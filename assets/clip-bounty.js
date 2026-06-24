// ZABAL Gamez - clip bounty widget.
//
// Drop-in: any page with <section id="zg-clip-bounty"></section> plus this script lets
// any logged-in Farcaster user put up an OPEN POIDH bounty, on Base, for the best clip
// of this recording. It self-configures from the page - the title comes from the meta
// tags, the link from the canonical URL - so no per-page wiring beyond the mount point.
//
// This is a real on-chain action. Creating a bounty sends a transaction on Base mainnet
// that locks the reward (in ETH) into the POIDH contract. "Open" means anyone can add
// funds on top afterwards (the ZABAL Gamez Open Pot model). The widget makes the amount
// and the network explicit and requires a second confirm before it ever asks the wallet
// to sign. Outside a Mini App (no wallet), it points the user to open in Farcaster.
//
// POIDH main contract on Base (chain 8453), createOpenBounty(string name, string desc):
//   https://basescan.org/address/0x5555fa783936c260f77385b4e153b9725fef1719

(function () {
  var mount = document.getElementById('zg-clip-bounty');
  if (!mount) return;

  var Z = window.ZABAL || {};
  var APP_URL = 'https://farcaster.xyz/miniapps/zabal-gamez';
  var POIDH = '0x5555fa783936c260f77385b4e153b9725fef1719'; // POIDH main contract, Base
  var BASE_HEX = '0x2105'; // 8453
  var DEFAULT_ETH = '0.001';

  // Minimal ABI - just the function we call.
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

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function meta(p) { var m = document.querySelector('meta[property="' + p + '"]'); return m ? m.getAttribute('content') : ''; }

  // Recording title: strip the trailing " - ZABAL Gamez" branding from the og:title.
  var rawTitle = meta('og:title') || document.title || 'this session';
  var REC_TITLE = rawTitle.replace(/\s*-\s*ZABAL Gamez.*$/i, '').trim() || rawTitle;
  var canon = document.querySelector('link[rel="canonical"]');
  var REC_URL = (canon && canon.href) || location.href.split('#')[0];

  var BOUNTY_NAME = ('Clip bounty: ' + REC_TITLE).slice(0, 120);

  // ---- styles (injected once) ----
  var css = '' +
    '.zgb{margin:2rem 0 0.5rem;}' +
    '.zgb-head h2{font-family:Syne,sans-serif;font-size:1.2rem;margin:0 0 0.3rem;}' +
    '.zgb-sub{color:var(--text-dim,#8a8a94);font-size:0.88rem;margin:0 0 0.9rem;line-height:1.5;}' +
    '.zgb-box{background:var(--surface,#121217);border:1px solid var(--border,#1f1e26);border-radius:12px;padding:0.95rem;}' +
    '.zgb-name{color:var(--text-muted,#c8c6c0);font-size:0.86rem;margin:0 0 0.7rem;}' +
    '.zgb-name strong{color:var(--text,#e9e7e2);}' +
    '.zgb-label{display:block;color:var(--text-dim,#8a8a94);font-size:0.8rem;margin:0 0 0.3rem;}' +
    '.zgb-row{display:flex;gap:0.6rem;align-items:flex-end;flex-wrap:wrap;}' +
    '.zgb-amt{display:flex;align-items:center;gap:0.45rem;background:var(--surface-2,#16161c);border:1px solid var(--border,#1f1e26);border-radius:8px;padding:0.5rem 0.7rem;}' +
    '.zgb-amt input{width:6.5rem;background:none;border:0;color:var(--text,#e9e7e2);font:inherit;font-size:1rem;outline:none;}' +
    '.zgb-amt span{color:var(--text-dim,#8a8a94);font-size:0.9rem;}' +
    '.zgb-brief{width:100%;box-sizing:border-box;margin-top:0.7rem;background:var(--surface-2,#16161c);border:1px solid var(--border,#1f1e26);border-radius:8px;color:var(--text,#e9e7e2);font:inherit;font-size:0.9rem;padding:0.55rem 0.7rem;resize:vertical;min-height:58px;}' +
    '.zgb-go{background:var(--zabal,#7c5cff);border:0;color:#fff;border-radius:999px;padding:0.5rem 1.2rem;font:inherit;font-weight:600;font-size:0.9rem;cursor:pointer;}' +
    '.zgb-go:disabled{opacity:0.5;cursor:default;}' +
    '.zgb-confirm{background:rgba(124,92,255,0.08);border:1px solid var(--zabal,#7c5cff);border-radius:10px;padding:0.8rem;margin-top:0.8rem;}' +
    '.zgb-confirm p{margin:0 0 0.7rem;font-size:0.88rem;line-height:1.5;color:var(--text-muted,#c8c6c0);}' +
    '.zgb-confirm strong{color:var(--text,#e9e7e2);}' +
    '.zgb-acts{display:flex;gap:0.6rem;flex-wrap:wrap;}' +
    '.zgb-cancel{background:none;border:1px solid var(--border-hover,#2a2a33);color:var(--text-dim,#8a8a94);border-radius:999px;padding:0.5rem 1rem;font:inherit;font-size:0.88rem;cursor:pointer;}' +
    '.zgb-note{color:var(--text-dim,#8a8a94);font-size:0.84rem;margin:0.7rem 0 0;line-height:1.5;}' +
    '.zgb-note a{color:var(--cyan,#39d4ff);}' +
    '.zgb-ok{color:var(--text,#e9e7e2);}' +
    '.zgb-err{color:var(--pink,#ff4d8d);}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function setNote(html, cls) {
    var n = document.getElementById('zgb-note');
    if (!n) return;
    n.className = 'zgb-note' + (cls ? ' ' + cls : '');
    n.innerHTML = html;
  }

  function isPositiveAmount(v) {
    var n = Number(v);
    return isFinite(n) && n > 0;
  }

  // ---- on-chain create ----
  // Returns the tx hash, or throws a short string code the caller maps to a message.
  function createBounty(amountEth, brief) {
    var provider;
    return Z.getProvider().then(function (p) {
      provider = p;
      if (!provider || typeof provider.request !== 'function') throw 'no-wallet';
      return provider.request({ method: 'eth_requestAccounts' });
    }).then(function (accts) {
      var from = accts && accts[0];
      if (!from) throw 'no-account';
      // Ensure we are on Base before sending.
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
      return import('https://esm.sh/viem@2').then(function (viem) {
        var desc = (brief ? brief.trim() + '\n\n' : '') +
          'Open clip bounty for the ZABAL Gamez recording: ' + REC_TITLE + '. ' + REC_URL +
          '\n\nSubmit your best clip on POIDH. Anyone can add funds to this pot.';
        var data = viem.encodeFunctionData({ abi: ABI, functionName: 'createOpenBounty', args: [BOUNTY_NAME, desc] });
        var value = '0x' + viem.parseEther(String(amountEth)).toString(16);
        return provider.request({
          method: 'eth_sendTransaction',
          params: [{ from: from, to: POIDH, data: data, value: value }]
        });
      });
    });
  }

  // ---- success / share ----
  function renderSuccess(txHash, amountEth) {
    var scan = 'https://basescan.org/tx/' + txHash;
    mount.querySelector('.zgb-box').innerHTML =
      '<p class="zgb-name"><strong>Bounty created.</strong> ' + esc(amountEth) +
      ' ETH is locked on Base for the best clip of this recording.</p>' +
      '<p class="zgb-note zgb-ok">Transaction: <a href="' + esc(scan) + '" target="_blank" rel="noopener">view on Basescan</a>. ' +
      'It shows up on <a href="https://poidh.xyz/base" target="_blank" rel="noopener">poidh.xyz</a> once Base confirms it (a minute or two).</p>' +
      '<div class="zgb-acts" style="margin-top:0.8rem;"><button class="zgb-go" id="zgb-share">Share the bounty</button></div>';
    var share = document.getElementById('zgb-share');
    if (share) share.addEventListener('click', function () {
      var text = 'I put up a clip bounty on POIDH for a ZABAL Gamez recording: ' + REC_TITLE +
        '. Best clip wins - and anyone can add to the pot. Submit on poidh.xyz.';
      if (Z.composeCast) Z.composeCast({ text: text, embeds: [REC_URL], channelKey: 'zabal' });
      else if (Z.openUrl) Z.openUrl(APP_URL);
    });
  }

  // ---- render form ----
  function render() {
    mount.className = 'zgb';
    mount.innerHTML =
      '<div class="zgb-head"><h2>Fund a clip bounty</h2></div>' +
      '<p class="zgb-sub">Put up an open bounty, on Base, for the best clip of this recording. ' +
      'Others can add to the pot. Powered by POIDH - this creates a real on-chain bounty.</p>' +
      '<div class="zgb-box">' +
        '<p class="zgb-name">Bounty: <strong>' + esc(BOUNTY_NAME) + '</strong></p>' +
        '<div class="zgb-row">' +
          '<div><label class="zgb-label" for="zgb-amt">Reward</label>' +
          '<div class="zgb-amt"><input id="zgb-amt" type="number" min="0" step="0.0005" value="' + DEFAULT_ETH + '" inputmode="decimal"><span>ETH</span></div></div>' +
          '<button class="zgb-go" id="zgb-start">Create bounty</button>' +
        '</div>' +
        '<textarea class="zgb-brief" id="zgb-brief" placeholder="Optional: what makes a winning clip? (length, vibe, where to post it)"></textarea>' +
      '</div>' +
      '<p class="zgb-note" id="zgb-note"></p>';

    document.getElementById('zgb-start').addEventListener('click', startConfirm);
  }

  function startConfirm() {
    var amt = (document.getElementById('zgb-amt') || {}).value;
    var brief = (document.getElementById('zgb-brief') || {}).value || '';
    if (!isPositiveAmount(amt)) { setNote('Enter a reward greater than 0.', 'zgb-err'); return; }

    var box = mount.querySelector('.zgb-box');
    var conf = document.createElement('div');
    conf.className = 'zgb-confirm';
    conf.innerHTML =
      '<p>You are about to lock <strong>' + esc(amt) + ' ETH</strong> on <strong>Base mainnet</strong> into an open POIDH bounty. ' +
      'This is real and cannot be undone here. Your wallet will ask you to sign.</p>' +
      '<div class="zgb-acts"><button class="zgb-go" id="zgb-sign">Confirm and sign</button>' +
      '<button class="zgb-cancel" id="zgb-cancel">Cancel</button></div>';
    box.appendChild(conf);
    document.getElementById('zgb-start').disabled = true;

    document.getElementById('zgb-cancel').addEventListener('click', function () {
      conf.remove();
      document.getElementById('zgb-start').disabled = false;
    });
    document.getElementById('zgb-sign').addEventListener('click', function () {
      var signBtn = document.getElementById('zgb-sign');
      signBtn.disabled = true; signBtn.textContent = 'Check your wallet...';
      setNote('');
      createBounty(amt, brief).then(function (txHash) {
        renderSuccess(txHash, amt);
      }).catch(function (err) {
        var code = (typeof err === 'string') ? err : (err && err.message) || '';
        var msg;
        if (code === 'no-wallet' || code === 'no-account') {
          msg = 'Funding a bounty needs the Farcaster app wallet. <a href="' + APP_URL + '" target="_blank" rel="noopener">Open in Farcaster</a>.';
        } else if (/reject|denied|4001/i.test(code)) {
          msg = 'Transaction cancelled. Nothing was sent.';
        } else {
          msg = 'Could not create the bounty: ' + esc(code || 'unknown error') + '. Make sure you have ETH on Base, then try again.';
        }
        setNote(msg, 'zgb-err');
        signBtn.disabled = false; signBtn.textContent = 'Confirm and sign';
        document.getElementById('zgb-start').disabled = false;
      });
    });
  }

  render();

  // If there is no wallet at all (not in a Mini App), soften the CTA up front.
  if (Z.getProvider) {
    Z.getProvider().then(function (p) {
      if (!p) setNote('Open this recording in the Farcaster app to fund a bounty with your wallet. <a href="' + APP_URL + '" target="_blank" rel="noopener">Open in Farcaster</a>.');
    });
  }
})();
