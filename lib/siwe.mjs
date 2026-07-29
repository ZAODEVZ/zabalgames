// ZABAL Gamez - Sign-In With Ethereum (EIP-191 personal_sign) verification for the edge.
//
// Lets a wallet holder prove ownership of an address by signing a challenge, so a builder
// who submitted with a wallet but has no Farcaster account (and lost their edit link) can
// still reclaim and edit their project. Zero external service: recovery is done in-process
// with the vendored, audited secp256k1 + keccak256 primitives (lib/vendor/*), keeping the
// no-npm, no-build edge pattern. Edge-safe Web Crypto only.
//
// Flow: the client requests a one-time nonce, signs a message that binds the address, the
// nonce, and the submission id, and posts { address, signature, nonce, message }. The
// server consumes the nonce (one-time), checks the message binds nonce + id + address, and
// recovers the signer address, which must equal both the claimed address and the
// submission's stored wallet.

import { Signature } from './vendor/secp256k1.mjs';
import { keccak256 } from './vendor/sha3.mjs';

function utf8(s) { return new TextEncoder().encode(String(s)); }

// EIP-191 personal_sign digest of a UTF-8 message. Returns the 32-byte keccak hash as hex.
export function personalSignDigest(message) {
  const msg = utf8(message);
  const prefix = utf8('\x19Ethereum Signed Message:\n' + msg.length);
  const full = new Uint8Array(prefix.length + msg.length);
  full.set(prefix, 0);
  full.set(msg, prefix.length);
  return keccak256(full); // hex string, no 0x
}

// Derive the 0x address (lowercase) from an uncompressed public key point.
export function addressFromPoint(point) {
  const pub = point.toRawBytes(false); // 65 bytes: 0x04 || X(32) || Y(32)
  const hash = keccak256(pub.slice(1)); // keccak over X||Y, hex
  return '0x' + hash.slice(-40);
}

// Recover the 0x address (lowercase) that produced an EIP-191 personal_sign signature over
// `message`. Throws on a malformed signature.
export function recoverPersonalSignAddress(message, signatureHex) {
  let sig = String(signatureHex || '');
  if (sig.startsWith('0x')) sig = sig.slice(2);
  if (sig.length !== 130) throw new Error('signature must be 65 bytes');
  const r = BigInt('0x' + sig.slice(0, 64));
  const s = BigInt('0x' + sig.slice(64, 128));
  const v = parseInt(sig.slice(128, 130), 16);
  const recovery = v >= 27 ? v - 27 : v;
  if (recovery !== 0 && recovery !== 1) throw new Error('invalid recovery id');
  const point = new Signature(r, s, recovery).recoverPublicKey(personalSignDigest(message));
  return addressFromPoint(point);
}

// True when `signatureHex` is a valid EIP-191 signature of `message` by `expectedAddress`.
// Never throws - a malformed or non-matching signature returns false.
export function verifyPersonalSign(message, signatureHex, expectedAddress) {
  try {
    return recoverPersonalSignAddress(message, signatureHex) === String(expectedAddress || '').toLowerCase();
  } catch {
    return false;
  }
}

// The canonical challenge a client signs to prove wallet ownership for a project edit. The
// server rebuilds this exact string from the trusted id/address/nonce and recovers against
// it, so the signature cannot be replayed onto a different submission or address.
export function editChallenge({ domain, id, address, nonce }) {
  return `${domain} wants you to edit your ZABAL Gamez project.\n\n` +
    `Project: #${id}\n` +
    `Wallet: ${String(address).toLowerCase()}\n` +
    `Nonce: ${nonce}\n` +
    `Action: project-edit`;
}
