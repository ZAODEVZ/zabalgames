// ZABAL Gamez - Unlock Protocol clipping bounty widget (recurring, auto-versioning).
//
// Drop-in: <section id="zg-unlock-bounty"></section> plus this script gives a button
// that sparks a real POIDH clipping bounty for the Unlock Protocol workshop (Ceci
// Sakura, recordings/32) on Base. Unlike assets/clip-bounty.js, this does NOT require
// the Farcaster app - it tries the Farcaster Mini App wallet first (so it still works
// there), then falls back to any injected browser wallet (MetaMask, Coinbase Wallet,
// Rainbow, etc.) so it also works on the open web. That gap - the existing clip-bounty
// widget only ever working inside Farcaster - is exactly what this widget exists to
// fix for this one bounty.
//
// Wallet connection is its OWN explicit step (a visible "Connect wallet" button), not
// folded into the create button. Two reasons: (1) it makes "are we actually connected"
// visually obvious instead of implicit, and (2) it isolates failures - if connecting
// itself breaks, you see that clearly instead of a generic error from a mixed-stage
// promise chain. Every async stage below is wrapped so the raw exception always lands
// in the browser console via console.error, even when the on-page message stays simple.
//
// The Farcaster provider is only ever requested when genuinely embedded in a Mini App
// (`ctx && ctx.client`, same gate every Farcaster-only helper in assets/miniapp.js
// uses) - not just "did the SDK return something". The Farcaster SDK returns a
// provider-SHAPED object even on a normal standalone page load, but that stub only
// works via postMessage to a parent frame that doesn't exist outside Farcaster, so
// calling .request() on it throws an opaque SDK-internal error instead of failing
// cleanly. Confirmed live: testing this page outside the Farcaster app threw
// "RpcResponse.InternalErrorError: Cannot read properties of undefined (reading
// 'error')" from inside miniapp-sdk-0.1.10.js. The context check avoids ever touching
// that stub when we're not actually inside Farcaster.
//
// The injected-wallet fallback uses EIP-6963 provider discovery rather than reading
// window.ethereum directly - with multiple wallet extensions installed (also visible
// in the console: two extensions throwing "Cannot redefine property: ethereum" at
// each other over that one global), whichever wins that race isn't guaranteed to be
// a clean, fully-initialized provider. EIP-6963 lets every wallet announce itself
// independently; window.ethereum is only the last-resort fallback for wallets that
// don't support it yet.
//
// Recurring by design: click create once to cast "Unlock Protocol Clipping Bounty",
// click it again next week (or whenever) and it casts "...v2", then "...v3", etc, with
// zero manual editing. The version number is derived live each time by counting how
// many matching bounties already exist on POIDH (via /api/unlock-bounty-count, a
// same-origin proxy - POIDH's own API sends no CORS headers, so a direct browser fetch
// to it from this domain would silently fail). See zpoidh rounds/r6/ for the canonical
// round record and docs/create-bounty.html for the general-purpose (non-recording-
// specific) version of this same idea.
//
// This is a real on-chain action. Creating a bounty sends a transaction on Base mainnet
// that locks the reward (in ETH) into the POIDH contract - same confirm-before-sign
// pattern as every other bounty widget on this site.
//
// POIDH main contract on Base (chain 8453), createOpenBounty(string name, string desc):
//   https://basescan.org/address/0x5555fa783936c260f77385b4e153b9725fef1719

(function () {
  var mount = document.getElementById('zg-unlock-bounty');
  if (!mount) return;

  var Z = window.ZABAL || {};
  var POIDH = '0x5555fa783936c260f77385b4e153b9725fef1719'; // POIDH main contract, Base
  var BASE_HEX = '0x2105'; // 8453
  var MIN_ETH = 0.001; // POIDH's own MIN_BOUNTY_AMOUNT, confirmed via eth_call
  var DEFAULT_ETH = '0.005';
  var VIEM = 'https://esm.sh/viem@2.53.1'; // exact pin, same as assets/clip-bounty.js
  var BOUNTY_CREATED_TOPIC = '0xd265c5d6a9224c4853317e9e3262b0605b45f0e87c8bfd17d020e54a87c439af';
  var BASE_TITLE = 'Unlock Protocol Clipping Bounty';
  var WORKSHOP_URL = 'https://zabalgamez.com/recordings/32';

  var ABI = [{
    inputs: [
      { internalType: 'string', name: 'name', type: 'string' },
      { internalType: 'string', name: 'description', type: 'string' }
    ],
    name: 'createOpenBounty',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  }];

  var provider = null;
  var currentAccount = null;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function shortAddr(a) { return a ? a.slice(0, 6) + '...' + a.slice(-4) : ''; }

  var css = '' +
    '.zub{margin:2rem 0 0.5rem;}' +
    '.zub-head h2{font-family:Syne,sans-serif;font-size:1.2rem;margin:0 0 0.3rem;}' +
    '.zub-sub{color:var(--text-dim,#8a8a94);font-size:0.88rem;margin:0 0 0.9rem;line-height:1.5;}' +
    '.zub-wallet{display:flex;align-items:center;gap:0.6rem;flex-wrap:wrap;margin-bottom:0.9rem;}' +
    '.zub-badge{font-size:0.82rem;color:var(--text-dim,#8a8a94);font-family:ui-monospace,monospace;}' +
    '.zub-net{display:inline-block;padding:0.15rem 0.6rem;border-radius:999px;font-size:0.76rem;font-weight:600;background:rgba(74,222,128,0.15);color:#4ade80;}' +
    '.zub-net.wrong{background:rgba(248,113,113,0.15);color:#f87171;}' +
    '.zub-box{background:var(--surface,#121217);border:1px solid var(--border,#1f1e26);border-radius:12px;padding:0.95rem;}' +
    '.zub-go{background:var(--zabal,#7c5cff);border:0;color:#fff;border-radius:999px;padding:0.6rem 1.3rem;font:inherit;font-weight:700;font-size:0.92rem;cursor:pointer;}' +
    '.zub-go:disabled{opacity:0.5;cursor:default;}' +
    '.zub-cancel{background:none;border:1px solid var(--border-hover,#2a2a33);color:var(--text-dim,#8a8a94);border-radius:999px;padding:0.5rem 1rem;font:inherit;font-size:0.88rem;cursor:pointer;}' +
    '.zub-review{margin-top:0.9rem;padding-top:0.9rem;border-top:1px solid var(--border,#1f1e26);}' +
    '.zub-review p{margin:0 0 0.6rem;font-size:0.88rem;line-height:1.5;color:var(--text-muted,#c8c6c0);}' +
    '.zub-review strong{color:var(--text,#e9e7e2);}' +
    '.zub-label{display:block;color:var(--text-dim,#8a8a94);font-size:0.8rem;margin:0.6rem 0 0.3rem;}' +
    '.zub-amt{display:flex;align-items:center;gap:0.45rem;background:var(--surface-2,#16161c);border:1px solid var(--border,#1f1e26);border-radius:8px;padding:0.5rem 0.7rem;max-width:10rem;}' +
    '.zub-amt input{width:5rem;background:none;border:0;color:var(--text,#e9e7e2);font:inherit;font-size:1rem;outline:none;}' +
    '.zub-amt span{color:var(--text-dim,#8a8a94);font-size:0.9rem;}' +
    '.zub-acts{display:flex;gap:0.6rem;flex-wrap:wrap;margin-top:0.8rem;}' +
    '.zub-note{color:var(--text-dim,#8a8a94);font-size:0.84rem;margin:0.7rem 0 0;line-height:1.5;}' +
    '.zub-note a{color:var(--cyan,#39d4ff);}' +
    '.zub-ok{color:var(--text,#e9e7e2);}' +
    '.zub-err{color:var(--pink,#ff4d8d);}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function setNote(id, html, cls) {
    var n = document.getElementById(id);
    if (!n) return;
    n.className = 'zub-note' + (cls ? ' ' + cls : '');
    n.innerHTML = html;
  }

  // ---- dual provider: Farcaster Mini App wallet first (only if genuinely embedded),
  // any injected wallet as fallback ----
  //
  // This is the actual fix for the gap that prompted this widget: assets/clip-bounty.js
  // only ever tries Z.getProvider() (Farcaster-only), so it shows nothing but an
  // "open in Farcaster" message on the open web. Trying window.ethereum too means this
  // one works everywhere.
  //
  // The first version of this fix checked "did Z.getProvider() return something
  // non-null" to decide whether we're in Farcaster - but the Farcaster SDK returns a
  // provider-SHAPED object even when the page is just loaded standalone in a normal
  // browser tab, not actually embedded in a Farcaster client. That stub only works via
  // postMessage to a parent frame that does not exist outside Farcaster, so calling
  // .request() on it throws an opaque SDK-internal error (confirmed in the console:
  // "RpcResponse.InternalErrorError: Cannot read properties of undefined (reading
  // 'error')" from inside miniapp-sdk-0.1.10.js, alongside a DataCloneError from the
  // SDK's own postMessage call - both are the SDK trying to talk to a parent that
  // isn't there). Every other Farcaster-only helper in assets/miniapp.js gates on
  // `ctx && ctx.client` (a real Mini App context) before touching anything
  // Farcaster-specific - this now does the same, so it only ever asks the SDK for a
  // provider when actually embedded in Farcaster.
  function getFarcasterProvider() {
    var ctxTry = (Z.getContext ? Z.getContext() : Promise.resolve(null));
    return ctxTry.then(function (ctx) {
      if (!ctx || !ctx.client || !Z.getProvider) return null;
      return Z.getProvider();
    }).catch(function (e) {
      console.error('[unlock-bounty] Farcaster context/provider check failed', e);
      return null;
    });
  }

  // EIP-6963 multi-wallet discovery. Plain window.ethereum is a single, last-writer-wins
  // slot - with multiple wallet extensions installed (seen in the console: MetaMask and
  // another extension both trying to define window.ethereum, throwing "Cannot redefine
  // property: ethereum" at each other), whichever one wins that race isn't guaranteed to
  // be a stable or even fully-initialized provider. EIP-6963 lets every wallet announce
  // itself independently instead of fighting over one global, so this asks for
  // announcements first and only falls back to the raw window.ethereum global if no
  // wallet answers (older wallets that don't implement EIP-6963 yet).
  function getInjectedProvider() {
    return new Promise(function (resolve) {
      var found = null;
      function onAnnounce(e) {
        if (!found && e && e.detail && e.detail.provider) found = e.detail.provider;
      }
      window.addEventListener('eip6963:announceProvider', onAnnounce);
      window.dispatchEvent(new Event('eip6963:requestProvider'));
      setTimeout(function () {
        window.removeEventListener('eip6963:announceProvider', onAnnounce);
        resolve(found || window.ethereum || null);
      }, 150);
    });
  }

  function getInjectedOrMiniAppProvider() {
    return getFarcasterProvider().then(function (p) {
      if (p) return p;
      return getInjectedProvider();
    });
  }

  async function ensureBase(prov) {
    var cid = await prov.request({ method: 'eth_chainId' });
    if (cid === BASE_HEX) return;
    try {
      await prov.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: BASE_HEX }] });
    } catch (e) {
      await prov.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: BASE_HEX, chainName: 'Base',
          nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
          rpcUrls: ['https://mainnet.base.org'], blockExplorerUrls: ['https://basescan.org']
        }]
      });
    }
  }

  async function refreshWalletBadge() {
    var badge = document.getElementById('zub-wallet-badge');
    var net = document.getElementById('zub-net-badge');
    if (!badge || !net) return;
    if (!currentAccount) { badge.textContent = ''; net.innerHTML = ''; return; }
    badge.textContent = shortAddr(currentAccount);
    try {
      var cid = await provider.request({ method: 'eth_chainId' });
      net.innerHTML = cid === BASE_HEX ? '<span class="zub-net">Base</span>' : '<span class="zub-net wrong">wrong network</span>';
    } catch (e) {
      console.error('[unlock-bounty] could not read chain id', e);
      net.innerHTML = '';
    }
  }

  function connectWallet() {
    var btn = document.getElementById('zub-connect');
    btn.disabled = true; btn.textContent = 'Connecting...';
    setNote('zub-create-note', '');

    getInjectedOrMiniAppProvider().then(function (p) {
      if (!p || typeof p.request !== 'function') {
        throw new Error('no-wallet');
      }
      provider = p;
      return provider.request({ method: 'eth_requestAccounts' });
    }).then(function (accts) {
      var from = accts && accts[0];
      if (!from) throw new Error('no-account');
      currentAccount = from;
      return ensureBase(provider);
    }).then(function () {
      btn.textContent = 'Connected';
      return refreshWalletBadge();
    }).then(function () {
      document.getElementById('zub-create').disabled = false;
    }).catch(function (err) {
      console.error('[unlock-bounty] connect failed', err);
      var msg = err && err.message === 'no-wallet'
        ? 'No wallet found. Install a browser wallet (MetaMask, Coinbase Wallet, Rainbow) or open this page in the Farcaster app.'
        : (/reject|denied|4001/i.test((err && err.message) || '') ? 'Connection cancelled.' : 'Could not connect: ' + esc((err && err.message) || 'unknown error') + ' (see browser console for details)');
      setNote('zub-create-note', msg, 'zub-err');
      btn.disabled = false; btn.textContent = 'Connect wallet';
    });
  }

  function formatBountyDate(d) {
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return days[d.getUTCDay()] + ' ' + months[d.getUTCMonth()] + ' ' + d.getUTCDate() + ', ' + d.getUTCFullYear();
  }

  function buildCopy(version) {
    var now = new Date();
    var deadline = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    var winnerCast = new Date(deadline.getTime() + 24 * 60 * 60 * 1000);
    var title = version <= 1 ? BASE_TITLE : (BASE_TITLE + ' v' + version);
    var roundNote = version <= 1 ? '' : ('this is round ' + version + ' of this bounty - same clip-up challenge, new week.\n\n');

    var description = 'clip up unlock protocol\n\n' +
      'unlock protocol lets anyone create memberships, tickets, certifications, and token-gated access as onchain NFTs - no code. ceci sakura from unlock walked through it live at the zabal gamez workshop, deploying a certification on base in real time and airdropping it to a wallet and a plain email address.\n\n' +
      'make the best clip that makes someone get unlock in a few seconds. best clips win and we run them.\n\n' +
      roundNote +
      'THE BAR (do these or you are not in the running)\n\n' +
      '1. clip a moment from the workshop recording - ' + WORKSHOP_URL + ' - or make an original clip that clearly shows what unlock does.\n' +
      '2. post it publicly on x, instagram, or youtube.\n' +
      '3. tag @UnlockProtocol and @bettercallzaal on x, and cross-post in a farcaster channel so the community sees it.\n' +
      '4. submit the public url on this poidh bounty page.\n' +
      '5. audio: if your clip has audio, use the source recording audio or one clear instrumental that does not fight the dialog. random library music over talking = floor fail.\n\n' +
      'THE RUBRIC (more boxes = stronger)\n\n' +
      'distribution\n' +
      '+ cross-post beyond one platform (bluesky, threads, linkedin, tiktok)\n' +
      '+ tag @kennyistyping / @kenny (poidh) and @poidh\n' +
      '+ include unlock-protocol.com as a visible link\n\n' +
      'craft\n' +
      '+ you get what unlock is in 3 seconds\n' +
      '+ vertical or square, captions if there is audio\n' +
      '+ on-brand energy, not generic crypto\n\n' +
      'substance\n' +
      '+ one clear takeaway - memberships / tickets / certifications / token-gated access as onchain NFTs, gasless, no code\n' +
      '+ names a real use - the soulbound certification ceci deployed live is a real example\n\n' +
      'THE ASSET KIT\n\n' +
      'workshop recording + transcript: ' + WORKSHOP_URL + '\n' +
      'unlock protocol: https://unlock-protocol.com\n\n' +
      'THE REWARD\n\n' +
      'winner takes the pot. best submission gets paid AND becomes pinned promo across the channels.\n\n' +
      'DEADLINE\n\n' +
      'submissions close ' + formatBountyDate(deadline) + ', 11:59pm pt.\n' +
      'winner cast by end of day ' + formatBountyDate(winnerCast) + '.\n\n' +
      'judge: single judge (zaal).';

    return { title: title, description: description, deadlineLabel: formatBountyDate(deadline) };
  }

  function fetchVersionCount() {
    return fetch('/api/unlock-bounty-count', { cache: 'no-store' })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (!d || !d.ok) console.error('[unlock-bounty] version count endpoint returned', d);
        return (d && d.ok) ? d.count : 0;
      })
      .catch(function (e) {
        console.error('[unlock-bounty] could not reach /api/unlock-bounty-count, defaulting version count to 0', e);
        return 0;
      });
  }

  // ---- on-chain create (same pattern as assets/clip-bounty.js) ----
  function createBounty(title, description, amountEth) {
    return import(VIEM).then(function (viem) {
      var data = viem.encodeFunctionData({ abi: ABI, functionName: 'createOpenBounty', args: [title, description] });
      var value = '0x' + viem.parseEther(String(amountEth)).toString(16);
      return provider.request({
        method: 'eth_sendTransaction',
        params: [{ from: currentAccount, to: POIDH, data: data, value: value }]
      }).then(function (txHash) { return { txHash: txHash }; });
    });
  }

  function waitForBountyId(txHash) {
    var tries = 0;
    function attempt() {
      return provider.request({ method: 'eth_getTransactionReceipt', params: [txHash] }).then(function (r) {
        if (r && r.logs) {
          for (var i = 0; i < r.logs.length; i++) {
            var log = r.logs[i];
            if (log && log.address && log.address.toLowerCase() === POIDH &&
                log.topics && log.topics[0] && log.topics[0].toLowerCase() === BOUNTY_CREATED_TOPIC && log.topics[1]) {
              try { return BigInt(log.topics[1]).toString(); } catch (e) { return null; }
            }
          }
          if (r.status) return null;
        }
        if (++tries >= 15) return null;
        return new Promise(function (res) { setTimeout(res, 2000); }).then(attempt);
      }).catch(function (e) {
        console.error('[unlock-bounty] receipt poll error (retrying)', e);
        if (++tries >= 15) return null;
        return new Promise(function (res) { setTimeout(res, 2000); }).then(attempt);
      });
    }
    return attempt();
  }

  function renderSuccess(bountyId, txHash, amountEth, title) {
    var scan = 'https://basescan.org/tx/' + txHash;
    var bountyUrl = bountyId ? ('https://poidh.xyz/base/bounty/' + bountyId) : null;
    var where = bountyUrl
      ? 'Live on POIDH: <a href="' + esc(bountyUrl) + '" target="_blank" rel="noopener">bounty #' + esc(bountyId) + '</a>.'
      : 'Confirmed, but could not resolve the bounty id automatically - check basescan for the receipt.';
    mount.querySelector('.zub-box').innerHTML =
      '<p class="zub-ok"><strong>"' + esc(title) + '"</strong> is live - ' + esc(amountEth) + ' ETH locked on Base.</p>' +
      '<p class="zub-note zub-ok">' + where + ' <a href="' + esc(scan) + '" target="_blank" rel="noopener">tx</a></p>' +
      '<div class="zub-acts"><button class="zub-go" id="zub-share">Share the bounty</button></div>';
    var share = document.getElementById('zub-share');
    if (share) share.addEventListener('click', function () {
      var text = 'Just sparked a POIDH clipping bounty for Unlock Protocol - clip up the ZABAL Gamez workshop w/Ceci Sakura and win the pot.';
      var embeds = bountyUrl ? [bountyUrl, WORKSHOP_URL] : [WORKSHOP_URL];
      if (Z.composeCast) Z.composeCast({ text: text, embeds: embeds, channelKey: 'zabal' });
      else window.open('https://warpcast.com/~/compose?text=' + encodeURIComponent(text + ' ' + (bountyUrl || WORKSHOP_URL)), '_blank', 'noopener');
    });
  }

  // ---- review panel: shows the auto-filled title/description before any signature ----
  function renderReview(copy, version) {
    var box = mount.querySelector('.zub-box');
    var versionNote = version <= 1
      ? 'No prior version found on POIDH - this will be the first cast.'
      : 'Found ' + (version - 1) + ' prior version(s) on POIDH - this will be v' + version + '.';
    var review = document.createElement('div');
    review.className = 'zub-review';
    review.innerHTML =
      '<p>' + esc(versionNote) + ' Title: <strong>' + esc(copy.title) + '</strong>. Deadline: <strong>' + esc(copy.deadlineLabel) + ', 11:59pm PT</strong>.</p>' +
      '<label class="zub-label" for="zub-amt">Reward</label>' +
      '<div class="zub-amt"><input id="zub-amt" type="number" min="' + MIN_ETH + '" step="0.001" value="' + DEFAULT_ETH + '" inputmode="decimal"><span>ETH</span></div>' +
      '<p style="margin-top:0.7rem;">This locks the reward on <strong>Base mainnet</strong> into a real, open POIDH bounty. Your wallet will ask you to sign.</p>' +
      '<div class="zub-acts"><button class="zub-go" id="zub-sign">Confirm and sign</button><button class="zub-cancel" id="zub-cancel">Cancel</button></div>';
    box.appendChild(review);

    document.getElementById('zub-cancel').addEventListener('click', function () {
      review.remove();
      document.getElementById('zub-create').disabled = false;
    });
    document.getElementById('zub-sign').addEventListener('click', function () {
      var amt = document.getElementById('zub-amt').value;
      var n = Number(amt);
      if (!isFinite(n) || n < MIN_ETH) { setNote('zub-create-note', 'Reward must be at least ' + MIN_ETH + ' ETH.', 'zub-err'); return; }

      var signBtn = document.getElementById('zub-sign');
      signBtn.disabled = true; signBtn.textContent = 'Check your wallet...';
      setNote('zub-create-note', '');
      createBounty(copy.title, copy.description, amt).then(function (res) {
        mount.querySelector('.zub-box').innerHTML =
          '<p class="zub-ok"><strong>Sent.</strong> ' + esc(amt) + ' ETH is on its way into an open bounty on Base.</p>' +
          '<p class="zub-note" id="zub-pending">Confirming on Base... <a href="https://basescan.org/tx/' + esc(res.txHash) + '" target="_blank" rel="noopener">view tx</a></p>';
        waitForBountyId(res.txHash).then(function (id) {
          renderSuccess(id, res.txHash, amt, copy.title);
        });
      }).catch(function (err) {
        console.error('[unlock-bounty] create bounty failed', err);
        var code = (err && err.message) || '';
        var msg = /reject|denied|4001/i.test(code)
          ? 'Cancelled. Nothing was sent.'
          : 'Could not create the bounty: ' + esc(code || 'unknown error') + '. Make sure you have ETH on Base. (see browser console for details)';
        setNote('zub-create-note', msg, 'zub-err');
        signBtn.disabled = false; signBtn.textContent = 'Confirm and sign';
      });
    });
  }

  function startCreate() {
    var btn = document.getElementById('zub-create');
    if (!currentAccount || !provider) {
      setNote('zub-create-note', 'Connect your wallet first (button above).', 'zub-err');
      return;
    }
    btn.disabled = true; btn.textContent = 'Loading...';
    setNote('zub-create-note', 'Checking how many prior versions already exist on POIDH...');

    fetchVersionCount().then(function (count) {
      var version = count + 1;
      var copy = buildCopy(version);
      btn.textContent = 'Spark Unlock Protocol Clipping Bounty';
      setNote('zub-create-note', '');
      renderReview(copy, version);
    }).catch(function (err) {
      // fetchVersionCount already resolves 0 on its own errors, so this only fires on a
      // genuinely unexpected failure (e.g. buildCopy itself throwing) - still surfaced,
      // never silently swallowed.
      console.error('[unlock-bounty] unexpected error preparing the bounty', err);
      setNote('zub-create-note', 'Something went wrong preparing the bounty: ' + esc((err && err.message) || 'unknown error') + ' (see browser console for details)', 'zub-err');
      btn.disabled = false; btn.textContent = 'Spark Unlock Protocol Clipping Bounty';
    });
  }

  function render() {
    mount.className = 'zub';
    mount.innerHTML =
      '<div class="zub-head"><h2>Spark a clipping bounty for Unlock Protocol</h2></div>' +
      '<p class="zub-sub">Puts up a real, open POIDH bounty on Base for the best clip of ' +
      '<a href="' + esc(WORKSHOP_URL) + '">Ceci Sakura\'s Unlock Protocol workshop</a>. Others can add to ' +
      'the pot. Recurring - run it again later and it auto-versions (v2, v3...).</p>' +
      '<div class="zub-wallet">' +
        '<button class="zub-go" id="zub-connect">Connect wallet</button>' +
        '<span class="zub-badge" id="zub-wallet-badge"></span>' +
        '<span id="zub-net-badge"></span>' +
      '</div>' +
      '<div class="zub-box">' +
        '<button class="zub-go" id="zub-create" disabled>Spark Unlock Protocol Clipping Bounty</button>' +
      '</div>' +
      '<p class="zub-note" id="zub-create-note"></p>';
    document.getElementById('zub-connect').addEventListener('click', connectWallet);
    document.getElementById('zub-create').addEventListener('click', startCreate);
  }

  render();

  // Auto-connect if a wallet is already authorized (does not prompt) - Farcaster
  // context first, then any injected wallet already granted access from a prior visit.
  getInjectedOrMiniAppProvider().then(function (p) {
    if (!p || typeof p.request !== 'function') return;
    provider = p;
    return provider.request({ method: 'eth_accounts' }).then(function (accts) {
      if (accts && accts[0]) {
        currentAccount = accts[0];
        document.getElementById('zub-connect').textContent = 'Connected';
        document.getElementById('zub-create').disabled = false;
        return refreshWalletBadge();
      }
    });
  }).catch(function (e) {
    console.error('[unlock-bounty] auto-connect check failed (not fatal, just skipped)', e);
  });
})();
