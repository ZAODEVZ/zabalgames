INGEST BATCH: BCZ YapZ Episode 10 — Juliano from Pinetree (2026-02-23).

Build a manifest of nodes and edges, preview the first 3 nodes, then ask me to approve. Verbatim quote text must be preserved exactly. Topics, platforms, chains, and tools must be stored as attributes on the Episode node, NEVER as standalone Entity nodes per scope_constraint trait.

## EPISODE NODE
Subject: BCZ YapZ w/GIU (Pinetree)
Type: PodcastEpisode
Date: 2026-02-23
Show: BCZ YapZ
Episode number: 10
Format: video-podcast
YouTube URL: https://youtu.be/loSOniPcJx0
YouTube video ID: loSOniPcJx0
Description: Zaal interviews Juliano from Pinetree.
Source: https://youtu.be/loSOniPcJx0
Confidence: 1.0

## PERSON NODE — Guest
Subject: Juliano
Type: Person
Role: Founder/team at Pinetree
Source: https://youtu.be/loSOniPcJx0
Confidence: 1.0

## ORG NODE — Guest's organization
Subject: Pinetree
Type: Org
Source: https://youtu.be/loSOniPcJx0
Confidence: 0.9

## QUOTE NODE 1
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "uh, was head of CEO for a little bit, and then Windstone was head of CEO, which is the"
Timestamp: 00:01:10
YouTube deeplink: https://youtu.be/loSOniPcJx0?t=70
Confidence: 1.0

## QUOTE NODE 2
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "but I think the concept, like the Bitcoin concept and, and eventually"
Timestamp: 00:03:55
YouTube deeplink: https://youtu.be/loSOniPcJx0?t=235
Confidence: 1.0

## QUOTE NODE 3
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "all. And, and because of that, I was able to go to school here. Uh, in the"
Timestamp: 00:07:25
YouTube deeplink: https://youtu.be/loSOniPcJx0?t=445
Confidence: 1.0

## QUOTE NODE 4
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "as well. You have like the practical one and you also have the written one."
Timestamp: 00:10:30
YouTube deeplink: https://youtu.be/loSOniPcJx0?t=630
Confidence: 1.0

## QUOTE NODE 5
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "consistency. There's like, there are a few trades there, like pretty important. Um,"
Timestamp: 00:13:35
YouTube deeplink: https://youtu.be/loSOniPcJx0?t=815
Confidence: 1.0

## QUOTE NODE 6
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "Uh, but where crypto really shines is on monetization. So we're gonna focus a"
Timestamp: 00:16:55
YouTube deeplink: https://youtu.be/loSOniPcJx0?t=1015
Confidence: 1.0

## QUOTE NODE 7
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "that helps distribution, I think, um, is something that artists will start to flock towards."
Timestamp: 00:19:40
YouTube deeplink: https://youtu.be/loSOniPcJx0?t=1180
Confidence: 1.0

## EDGES TO ASSERT
- Zaal Panthaki -[hosted]-> BCZ YapZ w/GIU (Pinetree)
- Juliano -[appeared_on]-> BCZ YapZ w/GIU (Pinetree)
- Juliano -[part_of]-> Pinetree
- BCZ YapZ w/GIU (Pinetree) -[contains_quote]-> Quote 1 through Quote 7

---
Build the manifest, preview the first 3 nodes inline, then ask me "approve all?". Do not commit until I say yes. If existing Episode/Person/Org nodes match by name, MERGE; do not create parallel nodes. Topics in the description are attributes, not entities.