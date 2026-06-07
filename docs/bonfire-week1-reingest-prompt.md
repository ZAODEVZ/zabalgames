# ZABAL Bonfire - Week 1 re-ingest + corrected reprompt (2026-06-07)

> The Bonfire returned a Week 1 recap that was mostly confabulated (invented people and
> projects, misattributed sessions) because Week 1 was never ingested. This doc is the fix:
> (1) push the corrected graph, then (2) reprompt with the ground truth + an explicit
> do-not-repeat list.

## Step 1 - push the corrected graph

`scripts/ingest-week1-to-bonfire-graph.mjs` added the verified Week 1 nodes/edges to
`data/bonfire-graph.json` (sessions, builders, projects, the fireside, the Farcaster Batches
builders). Push it to the live Bonfire:

```
BONFIRE_API_KEY=<bearer-token> node scripts/push-to-bonfire.mjs
```

(BONFIRE_ID defaults to 69ef871f0d22ed7e6f2b243a; BONFIRE_API_URL to https://tnt-v2.api.bonfires.ai.)

## Step 2 - the corrected reprompt (paste into the Bonfire after the push)

---

You are the ZABAL Bonfire. Your last Week 1 recap was wrong - you invented people and projects and misattributed sessions because Week 1 had not been ingested. It has now. Re-answer using ONLY your updated graph and the Zabal Data Streams. Cite the source for every claim. If something is not in your sources, do not say it. Get every name, handle, and URL exactly right, and flag anything you are unsure of.

Ground truth for ZABAL Gamez Week 1 (June 1-7, 2026), the only sessions that happened:
- Jun 1: Empire Builder V3, led by yerbearserker (NOT Adrian). Then Empire Builder Part 2, a live tokenless-Empire build, also yerbearserker. Then Bonfire and the ZABAL Bonfire bot, led by Joshua.eth and Plat0x.
- Jun 1-5: GM Farcaster's Farcaster Batches (organized by JubJub; hosted by Adriene and Nounish Prof; co-hosted by Adrian / diviflyy). Day 1: Vini App (Chris Dolinsky), POIDH (Kenny), Juke (Nikki Sapp), Founder Check + Fotocaster (Jonathan Colton), Dr. Deeks. Day 2: a live Founder Check workshop (Jonathan Colton + Kenny). Day 3: ZABAL Gamez (Zaal), Empire Builder (yerbearserker), Defense of the Agents (AZ Flynn), Booster (Cashless Man), Celebration Hub (Duckfax). Day 5: DEKEY (Node), POWER (Max / baseddesigner.eth), betrmint (Toady Hawk), Runner (Darko).
- Jun 6: a fireside, Zaal with Carlos (Plat0x), on vibe coding.

Do NOT repeat these earlier errors - none of these are real and none appear in our sources:
- "Apna Coding" / "Shriyash Soni" as July submission infrastructure (does not exist; our flow is the register server + builds board).
- "CannonJones" leading a CapCut / concert-streaming session, and "NFC cards for Pro Ticket holders" (no such person or item in our record).
- "Rodrigo Nunez" strategy call or Twitter Space (not in our record).
- "Empire Builder V3 led by Adrian" - it was led by yerbearserker.
- "Doc 778" for judging - the judging doc is 784.
- "The public site only shows 14 of 46 projects" - false; the projects page renders all of them.
- The project is "betrmint" (betrmint.fun), not "Betterment" (an unrelated finance company).

Now produce:
1. A chronological Week 1 recap: each session with title, presenter(s) + handles, date, one or two real takeaways, and the link, each line citing its source.
2. Every builder and project with the correct name, URL, and handle, and how it ties to the ZAO ecosystem.
3. The collaborations between them.
4. A "low confidence / not in sources" list - anything you are tempted to say but cannot ground.

Brand rules: no emojis, no em dashes (hyphens only), tight and factual.

---

## Why this happened (for the team)

The audit found the Bonfire's graph was missing the entire Week 1 (the fireside, the Farcaster
Batches builders, the session nodes). With the gap, the model filled it with confident
fabrication and ignored the "cite sources / flag uncertainty" instruction. Before July judging
reads from the Bonfire, the graph needs (a) this Week 1 ingest pushed, and (b) a pass to prune
any other ungrounded entities already in it.
