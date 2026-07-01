# Manual submission - add anything the watchers miss

The July submission system pulls builds in automatically (POIDH claim casts via the watcher, Magnetiq
UGC via the receiver). When something comes in a way the watchers do not catch - a DM, a tag you saw,
a build shared in a call - you can add it by hand in about ten seconds. It lands in the same store, so
it shows on `/submissions` and the builder's `/builder?handle=` profile just like everything else.

## The endpoint

```
POST https://zabalgamez.com/api/submission-intake
Authorization: Bearer <ADMIN_KEY>
Content-Type: application/json
```

`ADMIN_KEY` is the value set in the Vercel project env (Settings -> Environment Variables). It is the
same key the admin approve/reject flow uses.

## Fields

| field | required | notes |
|-------|----------|-------|
| `source` | no | where it came from, e.g. `dm`, `tag`, `call`, `manual` (default `manual`) |
| `builder.handle` | one of handle / wallet / fid | Farcaster handle, no @ |
| `builder.fid` | " | Farcaster FID (number) |
| `builder.wallet` | " | 0x wallet |
| `project` | yes | the title, e.g. "Proof Drop" |
| `url` | recommended | the live link - app, video, image, track, whatever it is |
| `repo` | no | `owner/repo` if there is one |
| `track` | no | `artist`, `builder`, or `creator` |
| `type` | no | `video` / `image` / `app` / `repo` / `music` / `link` / `other` - inferred from the url if omitted |
| `note` | no | one line of context |
| `forBrand` | no | `zabalgamez` (default), `zabal`, or `zao` |

Submissions upsert by builder + project, so re-posting the same project just updates it - no
duplicates. That is also how a builder updates their own entry.

## Examples

A video (creator track):

```bash
curl -sS -X POST https://zabalgamez.com/api/submission-intake \
  -H "Authorization: Bearer $ADMIN_KEY" -H "Content-Type: application/json" \
  -d '{"source":"tag","builder":{"handle":"someone"},"project":"ZABAL Gamez recap edit","url":"https://youtu.be/xxxx","track":"creator","note":"a 60-second recap they cut"}'
```

An image (artist track):

```bash
curl -sS -X POST https://zabalgamez.com/api/submission-intake \
  -H "Authorization: Bearer $ADMIN_KEY" -H "Content-Type: application/json" \
  -d '{"source":"dm","builder":{"handle":"artistname"},"project":"Insert Coin poster","url":"https://.../poster.png","track":"artist"}'
```

A repo (builder track):

```bash
curl -sS -X POST https://zabalgamez.com/api/submission-intake \
  -H "Authorization: Bearer $ADMIN_KEY" -H "Content-Type: application/json" \
  -d '{"source":"manual","builder":{"handle":"ghostmintops"},"project":"Proof Drop","url":"https://proof-drop-zabal.pages.dev","repo":"BrandonDucar/proof-drop-zabal","track":"builder"}'
```

## Where it shows up

- The season feed at `/submissions` (filterable by track and type).
- The builder profile at `/builder?handle=<handle>` (grouped by track, with a comment thread).

That is the whole manual path. For the automatic paths see `api/poidh-watcher.mjs` (POIDH claims) and
`api/magnetiq-ugc.mjs` (Magnetiq UGC).
