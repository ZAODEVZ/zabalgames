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

**COMMITTED.** Two same-origin files now ship:
- `miniapp-sdk-0.1.10.js` - the SDK, esm.sh `?bundle` output with every dependency
  inlined. Its only external reference, esm.sh's `/node/buffer.mjs`, was vendored
  alongside and the import paths rewritten to the relative `./buffer.mjs` so the module
  resolves entirely same-origin.
- `buffer.mjs` - the node `Buffer` polyfill the SDK needs, self-contained.

Source 1 (`/assets/vendor/miniapp-sdk-0.1.10.js`) is now the live path; esm.sh stays as
the safety net. This is the same-origin cure for the CDN-stranded splash.

## How to (re)generate the vendored bundle

Run on a machine/CI with network access to esm.sh. `?bundle` inlines the package's own
dependencies into one ES module (stays within the repo's no-npm, zero-build rule - a
single committed file, not a node_modules tree). The `?bundle` output still imports
esm.sh's `/node/buffer.mjs` by absolute path, so vendor that too and rewrite the path:

```sh
# 1. The SDK bundle (esm.sh returns a stub that re-exports the resolved .bundle.mjs).
curl -fsSL "https://esm.sh/@farcaster/miniapp-sdk@0.1.10/es2022/miniapp-sdk.bundle.mjs" \
  -o assets/vendor/miniapp-sdk-0.1.10.js
# 2. The buffer polyfill it depends on (self-contained).
curl -fsSL "https://esm.sh/node/buffer.mjs" -o assets/vendor/buffer.mjs
# 3. Rewrite the SDK's absolute buffer import to the same-origin relative copy.
perl -i -pe 's{/node/buffer\.mjs}{./buffer.mjs}g' assets/vendor/miniapp-sdk-0.1.10.js
```

Then verify both are genuinely self-contained (no remaining absolute/cross-origin
imports) before committing:

```sh
for f in assets/vendor/miniapp-sdk-0.1.10.js assets/vendor/buffer.mjs; do
  grep -nE '["'"'"'](https?:|/)[^"'"'"']' "$f" | grep -E 'import|from' || echo "$f: OK"
done
# expect: OK for both. Any /node/... or https://... left means a dep still escapes
# same-origin - vendor it the same way (fetch + rewrite the import path).
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
