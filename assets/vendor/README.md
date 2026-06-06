# assets/vendor - self-hosted Mini App SDK

`assets/miniapp.js` loads the Farcaster Mini App SDK **self-host-first**, then falls
back to the esm.sh CDN:

```
1. /assets/vendor/miniapp-sdk-0.1.10.js     (this folder - same-origin, preferred)
2. https://esm.sh/@farcaster/miniapp-sdk@0.1.10   (CDN fallback)
```

The native splash only dismisses when `sdk.actions.ready()` runs, so the SDK load is
load-bearing. A single hard dependency on a third-party CDN is what strands the splash
when that CDN is slow, down, or network-blocked. Vendoring a same-origin copy removes
that single point of failure; esm.sh remains the safety net.

## Status

The vendored bundle `miniapp-sdk-0.1.10.js` is **not committed yet** - the build
environment that wrote this could not reach esm.sh (outbound allowlist). Until the
file is added, source 1 simply 404s and the loader transparently uses esm.sh, exactly
as before. Adding the file flips the app to same-origin with zero other changes.

## How to (re)generate the vendored bundle

Run on a machine/CI with network access to esm.sh. `?bundle` inlines all dependencies
into one self-contained ES module (stays within the repo's no-npm, zero-build rule -
it is a single committed file, not a node_modules tree).

```sh
curl -fsSL "https://esm.sh/@farcaster/miniapp-sdk@0.1.10?bundle&target=es2022" \
  -o assets/vendor/miniapp-sdk-0.1.10.js
```

Then verify it is genuinely self-contained (no remaining cross-origin imports) before
committing:

```sh
grep -nE 'from\s*["'"'"']https?:|import\(["'"'"']https?:' assets/vendor/miniapp-sdk-0.1.10.js
# expect: no matches. If any appear, the bundle still pulls from the CDN - re-fetch
# the resolved .bundle.mjs that the stub points at, or bundle the deps in.
```

Sanity-check it exports the SDK and parses as a module:

```sh
grep -c 'export' assets/vendor/miniapp-sdk-0.1.10.js     # expect >= 1
cp assets/vendor/miniapp-sdk-0.1.10.js /tmp/_sdk.mjs && node --check /tmp/_sdk.mjs
```

Finally, **test in a real Farcaster client** (open a zabalgamez.com embed in Warpcast)
before relying on it - the loader's CDN fallback means a bad vendored file would still
work via esm.sh, but you want the same-origin path actually exercised.

## Bumping the version

1. Re-run the curl with the new exact version, save as `miniapp-sdk-<version>.js`.
2. Update both entries in `SDK_SOURCES` in `assets/miniapp.js` to the new version.
3. Keep the exact pin (no `0.1.x` range) so the CDN fallback never does a
   resolve-redirect. Re-check the `back`/`haptics`/capability guards still hold.
