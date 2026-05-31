INGEST BATCH: BCZ YapZ Episode 17 — Hannah from Farm Drop (2026-04-21).

Build a manifest of nodes and edges, preview the first 3 nodes, then ask me to approve. Verbatim quote text must be preserved exactly. Topics, platforms, chains, and tools must be stored as attributes on the Episode node, NEVER as standalone Entity nodes per scope_constraint trait.

## EPISODE NODE
Subject: BCZ YapZ w/Hannah (Farm Drop)
Type: PodcastEpisode
Date: 2026-04-21
Show: BCZ YapZ
Episode number: 17
Format: video-podcast
YouTube URL: https://youtu.be/hw-6IHaziV0
YouTube video ID: hw-6IHaziV0
Description: Zaal interviews Hannah from Farm Drop.
Source: https://youtu.be/hw-6IHaziV0
Confidence: 1.0

## PERSON NODE — Guest
Subject: Hannah
Type: Person
Role: Founder/team at Farm Drop
Source: https://youtu.be/hw-6IHaziV0
Confidence: 1.0

## ORG NODE — Guest's organization
Subject: Farm Drop
Type: Org
Source: https://youtu.be/hw-6IHaziV0
Confidence: 0.9

## QUOTE NODE 1
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "And so went off to study international food business in Germany. Ended up interviewing a bunch of"
Timestamp: 00:01:25
YouTube deeplink: https://youtu.be/hw-6IHaziV0?t=85
Confidence: 1.0

## QUOTE NODE 2
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "local food in the area, especially in the wintertime. So we started to sort of develop a, a,"
Timestamp: 00:05:15
YouTube deeplink: https://youtu.be/hw-6IHaziV0?t=315
Confidence: 1.0

## QUOTE NODE 3
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "explained in, in, in depth, uh, how Farm Dog came to be. It's cool to really see"
Timestamp: 00:09:55
YouTube deeplink: https://youtu.be/hw-6IHaziV0?t=595
Confidence: 1.0

## QUOTE NODE 4
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "cuts you want that week, you just put it in your notes and we'll bring down the lamb chops or the ground lamb, or you know."
Timestamp: 00:13:45
YouTube deeplink: https://youtu.be/hw-6IHaziV0?t=825
Confidence: 1.0

## QUOTE NODE 5
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "work for different farmers at different times of the year and make sure that there isn't too much product so"
Timestamp: 00:18:00
YouTube deeplink: https://youtu.be/hw-6IHaziV0?t=1080
Confidence: 1.0

## QUOTE NODE 6
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "about local food, talking about our farmers and food producers and, and sort of what we're trying to build at the"
Timestamp: 00:22:25
YouTube deeplink: https://youtu.be/hw-6IHaziV0?t=1345
Confidence: 1.0

## QUOTE NODE 7
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "you know, food systems infrastructure to support our local food businesses and our local community"
Timestamp: 00:26:35
YouTube deeplink: https://youtu.be/hw-6IHaziV0?t=1595
Confidence: 1.0

## EDGES TO ASSERT
- Zaal Panthaki -[hosted]-> BCZ YapZ w/Hannah (Farm Drop)
- Hannah -[appeared_on]-> BCZ YapZ w/Hannah (Farm Drop)
- Hannah -[part_of]-> Farm Drop
- BCZ YapZ w/Hannah (Farm Drop) -[contains_quote]-> Quote 1 through Quote 7

---
Build the manifest, preview the first 3 nodes inline, then ask me "approve all?". Do not commit until I say yes. If existing Episode/Person/Org nodes match by name, MERGE; do not create parallel nodes. Topics in the description are attributes, not entities.