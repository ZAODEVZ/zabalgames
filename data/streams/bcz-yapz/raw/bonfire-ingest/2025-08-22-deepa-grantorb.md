INGEST BATCH: BCZ YapZ Episode 1 — Deepa from GrantOrb (2025-08-22).

Build a manifest of nodes and edges, preview the first 3 nodes, then ask me to approve. Verbatim quote text must be preserved exactly. Topics, platforms, chains, and tools must be stored as attributes on the Episode node, NEVER as standalone Entity nodes per scope_constraint trait.

## EPISODE NODE
Subject: BCZ YapZ w/Deepa
Type: PodcastEpisode
Date: 2025-08-22
Show: BCZ YapZ
Episode number: 1
Format: video-podcast
YouTube URL: https://youtu.be/3vUAFwXqdeo
YouTube video ID: 3vUAFwXqdeo
Description: Zaal interviews Deepa from GrantOrb.
Source: https://youtu.be/3vUAFwXqdeo
Confidence: 1.0

## PERSON NODE — Guest
Subject: Deepa
Type: Person
Role: Founder/team at GrantOrb
Source: https://youtu.be/3vUAFwXqdeo
Confidence: 1.0

## ORG NODE — Guest's organization
Subject: GrantOrb
Type: Org
Source: https://youtu.be/3vUAFwXqdeo
Confidence: 0.9

## QUOTE NODE 1
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "illiquid and soul bound. Illiquid means you can't buy and sell it. Soul bound means you can't trade it. So it's our"
Timestamp: 00:01:15
YouTube deeplink: https://youtu.be/3vUAFwXqdeo?t=75
Confidence: 1.0

## QUOTE NODE 2
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "like sending, attaching it to a cause. Yeah. Yeah. Attaching anything to a cause just brings more"
Timestamp: 00:05:15
YouTube deeplink: https://youtu.be/3vUAFwXqdeo?t=315
Confidence: 1.0

## QUOTE NODE 3
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "round, like they have like. Specific grants during the year. Uh, and, uh, it was in November, they"
Timestamp: 00:08:45
YouTube deeplink: https://youtu.be/3vUAFwXqdeo?t=525
Confidence: 1.0

## QUOTE NODE 4
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "definitely, like it cuts down time. Uh, like, I don't know if anybody like artists, lots of artists depends"
Timestamp: 00:12:25
YouTube deeplink: https://youtu.be/3vUAFwXqdeo?t=745
Confidence: 1.0

## QUOTE NODE 5
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "from there. Right? Like, and let's say, call it, call it quits, right? That's a product. But like from"
Timestamp: 00:16:20
YouTube deeplink: https://youtu.be/3vUAFwXqdeo?t=980
Confidence: 1.0

## QUOTE NODE 6
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "to every single other industry because you can apply these automation thoughts and processes and"
Timestamp: 00:20:15
YouTube deeplink: https://youtu.be/3vUAFwXqdeo?t=1215
Confidence: 1.0

## QUOTE NODE 7
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "where are you at now with. What do you need help with? Is there anything I can do for you to"
Timestamp: 00:24:00
YouTube deeplink: https://youtu.be/3vUAFwXqdeo?t=1440
Confidence: 1.0

## EDGES TO ASSERT
- Zaal Panthaki -[hosted]-> BCZ YapZ w/Deepa
- Deepa -[appeared_on]-> BCZ YapZ w/Deepa
- Deepa -[part_of]-> GrantOrb
- BCZ YapZ w/Deepa -[contains_quote]-> Quote 1 through Quote 7

---
Build the manifest, preview the first 3 nodes inline, then ask me "approve all?". Do not commit until I say yes. If existing Episode/Person/Org nodes match by name, MERGE; do not create parallel nodes. Topics in the description are attributes, not entities.