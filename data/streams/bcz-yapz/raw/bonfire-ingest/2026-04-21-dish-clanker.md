INGEST BATCH: BCZ YapZ Episode 16 — Jack Dishman from Clanker (2026-04-21).

Build a manifest of nodes and edges, preview the first 3 nodes, then ask me to approve. Verbatim quote text must be preserved exactly. Topics, platforms, chains, and tools must be stored as attributes on the Episode node, NEVER as standalone Entity nodes per scope_constraint trait.

## EPISODE NODE
Subject: BCZ YapZ w/Dish (Clanker)
Type: PodcastEpisode
Date: 2026-04-21
Show: BCZ YapZ
Episode number: 16
Format: video-podcast
YouTube URL: https://youtu.be/gHbktZC6HbA
YouTube video ID: gHbktZC6HbA
Description: Zaal interviews Jack Dishman from Clanker.
Source: https://youtu.be/gHbktZC6HbA
Confidence: 1.0

## PERSON NODE — Guest
Subject: Jack Dishman
Type: Person
Role: Founder/team at Clanker
Source: https://youtu.be/gHbktZC6HbA
Confidence: 1.0

## ORG NODE — Guest's organization
Subject: Clanker
Type: Org
Source: https://youtu.be/gHbktZC6HbA
Confidence: 0.9

## QUOTE NODE 1
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "and, and also forecasters a whole in the ecosystem there. But, uh, let's start with, you know, a"
Timestamp: 00:01:00
YouTube deeplink: https://youtu.be/gHbktZC6HbA?t=60
Confidence: 1.0

## QUOTE NODE 2
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "first couple of things and did a, did a couple other, like, works for a couple different startups and,"
Timestamp: 00:05:05
YouTube deeplink: https://youtu.be/gHbktZC6HbA?t=305
Confidence: 1.0

## QUOTE NODE 3
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "you said V zero was very simple. Where did you kinda start doing that? Leveling up"
Timestamp: 00:09:20
YouTube deeplink: https://youtu.be/gHbktZC6HbA?t=560
Confidence: 1.0

## QUOTE NODE 4
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "posting actually as you're kind of coming in and, and choosing that as opposed to just a wallet address."
Timestamp: 00:13:20
YouTube deeplink: https://youtu.be/gHbktZC6HbA?t=800
Confidence: 1.0

## QUOTE NODE 5
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "which I think were, you know, it wasn't gonna, like, it wouldn't allow somebody to go maybe"
Timestamp: 00:17:40
YouTube deeplink: https://youtu.be/gHbktZC6HbA?t=1060
Confidence: 1.0

## QUOTE NODE 6
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "um, you know, the, the goal of what I wanna see right, is like have, you"
Timestamp: 00:21:30
YouTube deeplink: https://youtu.be/gHbktZC6HbA?t=1290
Confidence: 1.0

## QUOTE NODE 7
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "non-technical people, but specifically like not, um, people that aren't familiar with like blockchain"
Timestamp: 00:25:55
YouTube deeplink: https://youtu.be/gHbktZC6HbA?t=1555
Confidence: 1.0

## EDGES TO ASSERT
- Zaal Panthaki -[hosted]-> BCZ YapZ w/Dish (Clanker)
- Jack Dishman -[appeared_on]-> BCZ YapZ w/Dish (Clanker)
- Jack Dishman -[part_of]-> Clanker
- BCZ YapZ w/Dish (Clanker) -[contains_quote]-> Quote 1 through Quote 7

---
Build the manifest, preview the first 3 nodes inline, then ask me "approve all?". Do not commit until I say yes. If existing Episode/Person/Org nodes match by name, MERGE; do not create parallel nodes. Topics in the description are attributes, not entities.