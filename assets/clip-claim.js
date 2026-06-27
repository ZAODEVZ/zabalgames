// ZABAL Gamez - clip claim widget.
//
// Drop-in: any recording page with a YouTube video, a <section id="zg-clip-claim">
// mount, and this script gets a "submit a clip" flow. A viewer makes a 45-60s clip of
// the recording (one tap opens YouTube's native Clip tool on the video), pastes the
// clip link, and submits it as a claim against an open POIDH bounty on this recording.
//
// On-chain: createClaim(bountyId, name, description, uri) on the POIDH main contract
// (Base, nonpayable - just gas). The uri points at /api/clip-meta, which serves the
// claim metadata (poster = the recording's YouTube thumbnail, plus the clip link) so
// the claim renders on poidh.xyz without any IPFS/Pinata hosting.
//
// The claimant supplies the bounty they are claiming (paste its poidh.xyz link or id).
// Auto-listing open bounties per recording is a follow-up (needs the bounty-record
// backend); pasting the id keeps v1 dependency-free.

(function () {
  var mount = document.getElementById('zg-clip-claim');
  if (!mount) return;

  // Need the source video to make a clip. Pull the id from the embed; bail if absent.
  var player = document.getElementById('rec-player');
  var YT = '';
  if (player && player.src) { var mm = player.src.match(/embed\/([A-Za-z0-9_-]{6,20})/); YT = mm ? mm[1] : ''; }
  if (!YT) return;

  var Z = window.ZABAL || {};
  var APP_URL = 'https://farcaster.xyz/miniapps/zabal-gamez';
  var POIDH = '0x5555fa783936c260f77385b4e153b9725fef1719'; // POIDH main contract, Base
  var BASE_HEX = '0x2105'; // 8453
  var META_BASE = 'https://zabalgamez.com/api/clip-meta'; // prod, so on-chain uris always resolve
  var VIEM = 'https://esm.sh/viem@2.53.1';

  var ABI = [{
    inputs: [
      { internalType: 'uint256', name: 'bountyId', type: 'uint256' },
      { internalType: 'string', name: 'name', type: 'string' },
      { internalType: 'string', name: 'description', type: 'string' },
      { internalType: 'string', name: 'uri', type: 'string' }
    ],
    name: 'createClaim',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }];

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function meta(p) { var m = document.querySelector('meta[property="' + p + '"]'); return m ? m.getAttribute('content') : ''; }

  // Same recording id the comment + gallery widgets key on (path slug, slashes kept).
  var REC_ID = location.pathname.replace(/^\/+|\/+$/g, '').replace(/\.html$/i, '').toLowerCase().replace(/[^a-z0-9/_-]/g, '');

  var rawTitle = meta('og:title') || document.title || 'this session';
  var REC_TITLE = rawTitle.replace(/\s*-\s*ZABAL Gamez.*$/i, '').trim() || rawTitle;
  var DEFAULT_CLAIM_TITLE = ('Clip: ' + REC_TITLE).slice(0, 120);
  var WATCH_URL = 'https://www.youtube.com/watch?v=' + YT;

  // Parse a bounty id from a pasted poidh URL or a bare number.
  function parseBountyId(s) {
    s = String(s || '').trim();
    var m1 = s.match(/bounty\/(\d+)/i);
    if (m1) return m1[1];
    if (/^\d+$/.test(s)) return s;
    return '';
  }
  function isUrl(s) { try { var u = new URL(String(s || '')); return u.protocol === 'http:' || u.protocol === 'https:'; } catch (e) { return false; } }

  // ---- styles (share the bounty widget's look) ----
  var css = '' +
    '.zgk{margin:1.6rem 0 0.5rem;}' +
    '.zgk-head h2{font-family:Syne,sans-serif;font-size:1.2rem;margin:0 0 0.3rem;}' +
    '.zgk-sub{color:var(--text-dim,#8a8a94);font-size:0.88rem;margin:0 0 0.9rem;line-height:1.5;}' +
    '.zgk-box{background:var(--surface,#121217);border:1px solid var(--border,#1f1e26);border-radius:12px;padding:0.95rem;}' +
    '.zgk-step{margin:0 0 0.85rem;}' +
    '.zgk-step:last-child{margin-bottom:0;}' +
    '.zgk-label{display:block;color:var(--text-dim,#8a8a94);font-size:0.8rem;margin:0 0 0.3rem;}' +
    '.zgk-num{color:var(--cyan,#39d4ff);font-weight:700;}' +
    '.zgk-in{width:100%;box-sizing:border-box;background:var(--surface-2,#16161c);border:1px solid var(--border,#1f1e26);border-radius:8px;color:var(--text,#e9e7e2);font:inherit;font-size:0.92rem;padding:0.55rem 0.7rem;}' +
    '.zgk-clipbtn{display:inline-block;background:none;border:1px solid var(--cyan,#39d4ff);color:var(--cyan,#39d4ff);border-radius:999px;padding:0.45rem 1rem;font:inherit;font-size:0.88rem;cursor:pointer;text-decoration:none;}' +
    '.zgk-hint{color:var(--text-dim,#8a8a94);font-size:0.8rem;margin:0.35rem 0 0;line-height:1.45;}' +
    '.zgk-go{background:var(--zabal,#7c5cff);border:0;color:#fff;border-radius:999px;padding:0.5rem 1.2rem;font:inherit;font-weight:600;font-size:0.9rem;cursor:pointer;margin-top:0.2rem;}' +
    '.zgk-go:disabled{opacity:0.5;cursor:default;}' +
    '.zgk-note{color:var(--text-dim,#8a8a94);font-size:0.84rem;margin:0.7rem 0 0;line-height:1.5;}' +
    '.zgk-note a{color:var(--cyan,#39d4ff);}' +
    '.zgk-ok{color:var(--text,#e9e7e2);}' +
    '.zgk-err{color:var(--pink,#ff4d8d);}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function setNote(html, cls) {
    var n = document.getElementById('zgk-note');
    if (!n) return;
    n.className = 'zgk-note' + (cls ? ' ' + cls : '');
    n.innerHTML = html;
  }

  // ---- on-chain claim ----
  function submitClaim(bountyId, title, clipUrl) {
    var provider;
    var desc = 'Clip submission for the ZABAL Gamez recording: ' + REC_TITLE + '.';
    var uri = META_BASE + '?v=' + encodeURIComponent(YT) + '&c=' + encodeURIComponent(clipUrl) +
      '&t=' + encodeURIComponent(title) + '&d=' + encodeURIComponent(desc);
    return Z.getProvider().then(function (p) {
      provider = p;
      if (!provider || typeof provider.request !== 'function') throw 'no-wallet';
      return provider.request({ method: 'eth_requestAccounts' });
    }).then(function (accts) {
      var from = accts && accts[0];
      if (!from) throw 'no-account';
      return provider.request({ method: 'eth_chainId' }).then(function (cid) {
        if (cid === BASE_HEX) return from;
        return provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: BASE_HEX }] })
          .catch(function () {
            return provider.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: BASE_HEX,
                chainName: 'Base',
                nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
                rpcUrls: ['https://mainnet.base.org'],
                blockExplorerUrls: ['https://basescan.org']
              }]
            });
          })
          .then(function () { return from; });
      });
    }).then(function (from) {
      return import(VIEM).then(function (viem) {
        var data = viem.encodeFunctionData({
          abi: ABI, functionName: 'createClaim',
          args: [BigInt(bountyId), title, desc + '\n\nWatch the clip: ' + clipUrl, uri]
        });
        return provider.request({
          method: 'eth_sendTransaction',
          params: [{ from: from, to: POIDH, data: data }] // nonpayable - no value
        });
      });
    });
  }

  function renderSuccess(txHash, bountyId) {
    var scan = 'https://basescan.org/tx/' + txHash;
    var bountyUrl = 'https://poidh.xyz/base/bounty/' + bountyId;
    mount.querySelector('.zgk-box').innerHTML =
      '<p class="zgk-ok"><strong>Clip submitted.</strong> Your claim is on bounty #' + esc(bountyId) + '.</p>' +
      '<p class="zgk-note zgk-ok">See it on <a href="' + esc(bountyUrl) + '" target="_blank" rel="noopener">the bounty</a>. ' +
      '<a href="' + esc(scan) + '" target="_blank" rel="noopener">tx</a></p>' +
      '<div style="margin-top:0.8rem;"><button class="zgk-go" id="zgk-share">Share your clip</button></div>';
    var share = document.getElementById('zgk-share');
    if (share) share.addEventListener('click', function () {
      var text = 'Just dropped a clip from a ZABAL Gamez recording: ' + REC_TITLE + '. Submitted it for the bounty on POIDH.';
      if (Z.composeCast) Z.composeCast({ text: text, embeds: [bountyUrl], channelKey: 'zabal' });
      else if (Z.openUrl) Z.openUrl(APP_URL);
    });
  }

  function render() {
    mount.className = 'zgk';
    mount.innerHTML =
      '<div class="zgk-head"><h2>Submit a clip</h2></div>' +
      '<p class="zgk-sub">Cut a 45-60s clip of this recording and submit it as a claim on an open POIDH bounty. ' +
      'Best clip wins the pot.</p>' +
      '<div class="zgk-box">' +
        '<div class="zgk-step">' +
          '<span class="zgk-label"><span class="zgk-num">1.</span> Make your clip</span>' +
          '<a class="zgk-clipbtn" href="' + esc(WATCH_URL) + '" target="_blank" rel="noopener">Open on YouTube</a>' +
          '<p class="zgk-hint">On YouTube, hit <strong>Clip</strong> under the video, trim to 45-60 seconds, then Share and copy the clip link.</p>' +
        '</div>' +
        '<div class="zgk-step">' +
          '<label class="zgk-label" for="zgk-clip"><span class="zgk-num">2.</span> Paste your clip link</label>' +
          '<input id="zgk-clip" class="zgk-in" type="url" placeholder="https://youtube.com/clip/... or a Farcaster cast" inputmode="url">' +
        '</div>' +
        '<div class="zgk-step">' +
          '<label class="zgk-label" for="zgk-bounty"><span class="zgk-num">3.</span> Which bounty? (paste its poidh.xyz link or number)</label>' +
          '<input id="zgk-bounty" class="zgk-in" type="text" placeholder="poidh.xyz/base/bounty/1249  or  1249">' +
        '</div>' +
        '<div class="zgk-step">' +
          '<label class="zgk-label" for="zgk-title"><span class="zgk-num">4.</span> Title</label>' +
          '<input id="zgk-title" class="zgk-in" type="text" value="' + esc(DEFAULT_CLAIM_TITLE) + '" maxlength="120">' +
        '</div>' +
        '<button class="zgk-go" id="zgk-submit">Submit clip</button>' +
      '</div>' +
      '<p class="zgk-note" id="zgk-note"></p>';

    document.getElementById('zgk-submit').addEventListener('click', onSubmit);
  }

  function onSubmit() {
    var clip = (document.getElementById('zgk-clip') || {}).value;
    var bountyRaw = (document.getElementById('zgk-bounty') || {}).value;
    var title = ((document.getElementById('zgk-title') || {}).value || DEFAULT_CLAIM_TITLE).slice(0, 120);
    var bountyId = parseBountyId(bountyRaw);

    if (!isUrl(clip)) { setNote('Paste a valid clip link (step 2).', 'zgk-err'); return; }
    if (!bountyId) { setNote('Paste the bounty link or its number (step 3).', 'zgk-err'); return; }

    var btn = document.getElementById('zgk-submit');
    btn.disabled = true; btn.textContent = 'Check your wallet...';
    setNote('Submitting your claim on Base (just a gas fee)...');

    submitClaim(bountyId, title, clip).then(function (txHash) {
      // Record the clip on-site (gallery + /clips feed + clipper leaderboard).
      // Best-effort: a registry hiccup must never undo a confirmed on-chain claim.
      if (Z.recordClip) {
        try { Z.recordClip({ recId: REC_ID, clipUrl: clip, title: title, bountyId: bountyId, txHash: txHash }); } catch (e) { /* ignore */ }
      }
      renderSuccess(txHash, bountyId);
    }).catch(function (err) {
      var code = (typeof err === 'string') ? err : (err && err.message) || '';
      var msg;
      if (code === 'no-wallet' || code === 'no-account') {
        msg = 'Submitting a clip needs the Farcaster app wallet. <a href="' + APP_URL + '" target="_blank" rel="noopener">Open in Farcaster</a>.';
      } else if (/reject|denied|4001/i.test(code)) {
        msg = 'Cancelled. Nothing was submitted.';
      } else {
        msg = 'Could not submit the claim: ' + esc(code || 'unknown error') + '. Check the bounty number is right and try again.';
      }
      setNote(msg, 'zgk-err');
      btn.disabled = false; btn.textContent = 'Submit clip';
    });
  }

  render();

  // Submitting a clip claim is an on-chain action that needs a wallet (Farcaster app only).
  // On the open web, replace the form with a clean "open in Farcaster" panel so nothing fails.
  function gateForWeb() {
    var box = mount.querySelector('.zgk-box');
    if (box) box.innerHTML = '<p class="zgk-note">Submitting a clip is an onchain claim on Base, so it needs the Farcaster app wallet. <a href="' + APP_URL + '" target="_blank" rel="noopener">Open in Farcaster</a> to submit your clip. You can still make the clip on YouTube anytime.</p>';
  }
  if (Z.getProvider) {
    Z.getProvider().then(function (p) { if (!p) gateForWeb(); });
  } else {
    gateForWeb();
  }
})();
