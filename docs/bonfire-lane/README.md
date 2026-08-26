# Bonfire lane report - 2026-08-26

Lane: ZABAL Bonfire (knowledge graph, `zabal.bonfires.ai`).
Branch: `ws/bonfire-lane` off `origin/main` (d1a3f51). Committed locally, not pushed.
Nothing outbound was sent. No Telegram message, no reply, no post of any kind.

## Verdict

| # | Job | Status | One-line reason |
|---|-----|--------|-----------------|
| 1 | Index Bonfires TG chat `-1002812275482` into Bonfire | **NOT DONE** | Fractalgram is an authenticated Telegram client, not a public viewer. No session, no content. **0 episodes posted.** |
| 2 | Index `2087125632` + draft a reply | **PARTIAL** | Indexing NOT DONE (same wall). Draft written, but grounded on Bonfire recall, **not** on his live unread DM. |
| 3 | Search `-1002625006975` + reachable groupchats for dvl mojo | **DONE (via Bonfire, not via fractgram)** | Fractgram group unreachable; the Bonfire recall path works from the mac and returned the answer. |

**Episode ids posted by me this lane: none. Zero.** Nothing was written to the graph -
see "Why I posted nothing" below. Episode uuids cited in this report are **pre-existing**
episodes I read, not episodes I created.

---

## 1. Why fractgram is unreachable - NOT DONE, measured

`fractgram.web.app` is not a web viewer over Telegram. It is a fork of `telegram-tt`
(the page's own og:url is `https://sim31.github.io/telegram-tt/`), self-described as
"an alternative telegram client web app tailored to help host fractally or Eden style
consensus meetings." It talks MTProto over `wss://*.web.telegram.org`. Chat content
exists only inside an authenticated Telegram session.

What I measured, on all three targets:

```
GET https://fractgram.web.app/           -> 200, 3304 bytes, static SPA shell only
```

Headless load of each target URL, after networkidle wait:

| Target | Final URL | Rendered text |
|--------|-----------|---------------|
| `#-1002812275482` | `https://fractgram.web.app/` | "Log in to Telegram by QR Code ..." |
| `#2087125632` | `https://fractgram.web.app/` | "Log in to Telegram by QR Code ..." |
| `#-1002625006975` | `https://fractgram.web.app/` | "Log in to Telegram by QR Code ..." |

The hash route is stripped on every one and the app falls through to the auth screen.
Session state confirms no auth:

```
localStorage -> {"keys":["tt-multitab_1","tgme_sync"],"n":2}
```

No `dc*_auth_key`, no `user_auth`. The client is logged out.

### Every read path I tried, and why each failed

| Path | Result |
|------|--------|
| `curl` the URL | Static SPA shell. Hash fragments never reach a server, so there is nothing to fetch. |
| Headless browser (gstack `browse`) | Loads, renders the QR login wall. Above. |
| Real Chrome via claude-in-chrome | `list_connected_browsers` -> `[]`. No extension connected. |
| Playwright MCP | `Error: Extension connection timeout... Make sure the "Playwright MCP Bridge" extension is installed.` |
| Cookie import from a real browser | Would not help. Telegram web auth lives in localStorage/IndexedDB, not cookies, and on the `fractgram.web.app` origin specifically. |
| Telegram Bot API via `zabal_bonfire_bot` | No Telegram token in `~/.zao/zao.env`. Also the Bot API has no history read; `getUpdates` only drains the live queue and would disrupt the running bot. |
| Cached local export | `find` for any `*telegram*export*` / `*fractgram*` under `~/Documents`, `~/Desktop`, `~/.zao` -> nothing. |

**The only way in is Zaal's own Telegram credentials** - scanning the QR, or exporting an
MTProto auth key. Both are credential handling I will not do and should not do. This is an
owner action, not a blocked task I can retry.

---

## 2. Draft reply to `2087125632`

### Read this before sending

I could not open the DM. I have **not** seen his most recent message. This draft is built
from Bonfire recall of the prior thread, so it answers the last open question I can prove
exists in the graph - **not** necessarily what he asked most recently. If his latest message
moved on, this draft is stale. Check the DM before sending.

Who `2087125632` is, from the graph: **DvlsMojo / Dvl's Mojo / Gustavo de Lima Cavalcanti**,
who also posts as `@GCvlcnti` and `Neuralink0666` and signs `[IV]` / `[IVI]`. He states the
handles are all one person himself (episode `0f36697b-c16d-40f6-9d1d-64768575602a`). A separate
episode (`b26a48f0-d992-4ae3-bfeb-89a859dbea0e`) names "a direct message chat instance between
users @GCvlcnti and @bettercallzaal" at 95 messages, which is consistent with this id being
that DM. He primarily speaks Portuguese and has asked for patience with English.

The open thread the draft answers - two linked items, both awaiting Zaal:

1. **Network Layer Abstraction Proposal** (`88da8f86-cbf4-4f2d-843f-d7840a67742d`): he asked
   how to create a layer *above* personal named networks ("Zabal's NetWork", "Dvl's Mojo
   NetWork") that avoids hierarchy conflict while keeping the layers functionally separate.
   No answer from Zaal appears in the graph.
2. **TnN - The "n" Network** (`Introduction of TnN Network and Multi-Agent Capability
   Assessment`): his own candidate answer. ZabalAObot explicitly staged `TnN` as
   **unconfirmed pending his explicit definition**, with three hypotheses - umbrella brand for
   the nLayer hierarchy (p=0.70), n-gram discourse network (p=0.20), "The Node Network" tied to
   the n.0.0 anchoring protocol (p=0.10). It is still sitting unconfirmed.

### The draft, verbatim - Zaal sends this himself, I did not send it

```
Gustavo - your English is fine, no need to apologize for it.

On the layer above the personal networks: I agree the two named roots should not
sit under one another. "Zabal's Network" under "Dvl's Mojo Network" or the reverse
both create a hierarchy neither of us meant. So the layer above should not be a
third owner. It should be a protocol namespace that neither of us owns.

That is what I think TnN can be, if we define it that way. Right now the bot has
TnN staged as unconfirmed with three guesses - umbrella for nLayer, n-gram network,
or The Node Network tied to n.0.0. It stays unconfirmed until you say which one it
is, so nothing downstream can settle. Give me one sentence defining TnN and I will
have it committed as canon.

My read: option 1 with option 3 underneath it. TnN is the namespace, nLayer is its
structure, and n.0.0 anchoring is the mechanism that makes a node addressable inside
it. Personal roots like /zabal and /dvlsmojo then become peers that mount into TnN,
not children of each other. Peers, one level down from the namespace, equal to one
another.

If that matches what you meant, confirm and I will lock the definition. If it does
not, correct the sentence and I will use yours instead.

One ask on the ASCII docs - keep sending them, but put one plain line of text under
each one saying what it is. The graph reads prose. The art is landing as a placeholder
with no extractable content, so the ideas inside it are not making it into the
knowledge graph, and that is a loss.
```

Notes on the draft, so it can be judged rather than trusted:
- No emojis, no em dashes, per the brand rules.
- The last paragraph is a real finding, not filler. Multiple episodes
  (`c7a4a420-4782-4a84-9e37-45b702b11552`, `ee20099a-79d9-4f6d-a950-4f327b9811b8`,
  `babfeb8a-994c-4735-b567-d4415e7a3f57`) record his ASCII posts being classified as
  non-substantive and dropped, because extraction reads prose. Telling him is the fix.
- It commits Zaal to nothing beyond a naming decision he already effectively controls.

---

## 3. dvl mojo - findings

Fractgram group `-1002625006975` was unreachable, same wall. But the search itself
succeeded against a reachable source: the **Bonfire recall path works from the mac**.

### The path that worked

`~/.claude/skills/bonfire/scripts/bonfire-recall.sh` SSHes the VPS, and **the VPS is down**:

```
ssh: connect to host 187.77.3.104 port 22: Operation timed out
ERROR: cannot SSH to root@187.77.3.104 - check the key + host
```

But the Bonfire API answers directly from the mac (`POST /delve` -> 422 on an empty body,
so the endpoint is alive), and the key is in `~/.zao/zao.env` per doc 754. Running the same
`/delve` call locally works:

```
query "dvl mojo"                         -> success, num_results 41
query "Mojo The Ghost"                   -> success, num_results 42
query "DvlsMojo Gustavo de Lima ..."     -> success, num_results 43
```

This matters beyond this lane: **the Bonfire read path is live and does not need the VPS.**
The skill doc still says recall "returns `[]` until an admin runs labeling" - that is stale,
`/delve` returns real results. The skill's SSH transport is the broken part, not Bonfire.

### Who dvl mojo is

**DvlsMojo = Dvl's Mojo = Gustavo de Lima Cavalcanti**, aka `@GCvlcnti`, `Neuralink0666`,
signs `[IV]`/`[IVI]`. Portuguese-first, practicing English. Per
`50abaa76-68f9-4d36-98f0-5b9aedeff1cf`, Zaal has already corrected the graph on his role:
Gustavo is **building Deep Minds and assisting with bonfire builds, but is not the primary
builder of ZABAL Bonfire Bot** - Zaal is sole builder of that. Worth preserving; it was a
misattribution once already.

**Not to be confused with "Mojo The Ghost"** - a different entity entirely, a wallet-only
fractal member (`0xd7c87da92be8a2157af86641b12c9175632004dd`, zero respect, zero awards,
non-holder) in `ZAOfractal/data/members.json[136]` and `fractalbotjuly2026/data/names_to_wallets.json`.
Name collision only. Do not merge these two in the graph.

### What he is actually working on

- **TreeUnix** - his architecture vocabulary: BlockMeeting (multi-scale meeting spaces),
  DeepMeeting (1-on-1 AI-augmented subject extraction), Kanzi Cave (protected base space,
  named for Kanzi the bonobo who used lexigrams and played Minecraft against humans who did
  not know they faced non-human intelligence). Plus nLayer, DevtopIA, Know'Ledger, Protocol
  Dvls Bunkers, Crowd Council vs Crow Council, Sarcasm NetWork.
- **n.x "Free Insight" / node-zero anchoring** - making a Telegram message its own anchor
  point. n.0.0 = "Tips Anchored where its generated". Bot proposed message-link persistence
  and topic/forum sharding as mechanisms.
- **ZABAL-Dvl dual-root mapping** - parallel ecosystem maps of Zaal's roots (Founder, Artist,
  Consultant, Podcaster; ZAO Festivals, Fractals, Music, ZABAL coin, WaveWarZ, FISHBOWLZ,
  COC Concertz, Aurdour, ZABAL Gamez) against his own (Founder, Conception, Consultant,
  Networker; BlockMeeting, DeepMeeting, Kanzi_Cave, Signature_Spec).
- **Bonfire dev pulse, 2026-06-15**, in Portuguese: Explore page / SpongeBot research
  (commit 49fc23f), MCP unified layer (8b639f7, c4bbe25) across 36,000+ nodes with Zod
  validation at 73 points, Trimtab at 15/15.
- **Token Faucet Link Shortener** - a spec he handed to an AI assistant (Mira) on manus.im:
  seven tables, JWT auth, per-click token minting, referral commissions, anti-farming daily
  faucet, P2P transfers, admin panel.
- **A standing critique**: apps are deliberately built to stop people organizing themselves,
  because self-organization threatens the provider's model. His example - AI chat interfaces
  ship without chronological lists or search over past conversations.

### Two open operational items he raised that nobody closed

- **Bot migration / access** (`64ef9088-0cac-4ffa-9c66-1562b52fb552`): after moving
  `zabal_bonfire_bot` to a new group, he hit an access or config problem and it is unresolved
  in the graph. Open question was whether writing a group name in the setup form binds the bot
  to that group.
- **Topic vs message count** (`b26a48f0-d992-4ae3-bfeb-89a859dbea0e`): "55" was a topic id,
  not a message count. Telegram's linear-vs-topic display split caused the misread. Flagged
  because it is exactly the kind of thing that corrupts an ingest count.

---

## Why I posted nothing

The brief says push substantive items into Bonfire as episodes. I posted **zero** episodes,
deliberately:

1. I could not fetch a single new message. There is no new content to index.
2. Everything substantive I found was **already in the graph** - that is where I found it.
   Re-posting summaries of existing episodes under new names would duplicate nodes and
   pollute the graph with a second-hand copy of itself.

Writing zero is the correct outcome of a blocked fetch. A number of episodes posted here
would have looked like progress and been graph noise.

The write path is available if content ever arrives: `POST /delve` proved the API reachable
from the mac, and `bonfire-episode.sh` posts locally without the VPS.

## Owner actions to unblock

1. **Telegram session for fractgram** - only Zaal can do this. Either log in to
   `fractgram.web.app` in a Chrome where the Claude extension is connected, or export the
   three chats and drop the files somewhere I can read.
2. **VPS is down** - `187.77.3.104:22` times out. That breaks `/bonfire` posting and recall
   through the skill, and anything else on that box (`@ZAOcoworkingBot`).
3. **Send or discard the draft** in section 2, after checking his actual latest message.
4. **Confirm TnN** - one sentence from Gustavo unblocks it; it is staged unconfirmed and
   nothing downstream of it can settle.

## Repo fix this lane surfaced

`~/.claude/skills/bonfire/SKILL.md` says the read path "returns `[]` until an admin runs
labeling". Measured today, `POST /delve` returns 38-48 real results per query. The skill also
routes every call through an SSH transport to a box that is currently unreachable, when the
key is local and the API answers the mac directly. The skill should try local first and fall
back to SSH. Flagged, not changed - the skill is outside this repo.
