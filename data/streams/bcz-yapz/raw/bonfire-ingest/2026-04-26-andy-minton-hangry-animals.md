INGEST BATCH: BCZ YapZ Episode 18 — Andy Minton from Hangry Animals (2026-04-26).

Build a manifest of nodes and edges, preview the first 3 nodes, then ask me to approve. Verbatim quote text must be preserved exactly. Topics, platforms, chains, and tools must be stored as attributes on the Episode node, NEVER as standalone Entity nodes per scope_constraint trait.

## EPISODE NODE
Subject: BCZ YapZ w/Andy Minton (Hangry Animals)
Type: PodcastEpisode
Date: 2026-04-26
Show: BCZ YapZ
Episode number: 18
Format: video-podcast
YouTube URL: https://youtu.be/HH0zCQgYgq0
YouTube video ID: HH0zCQgYgq0
Description: Zaal interviews Andy Minton from Hangry Animals.
Source: https://youtu.be/HH0zCQgYgq0
Confidence: 1.0

## PERSON NODE — Guest
Subject: Andy Minton
Type: Person
Role: Founder/team at Hangry Animals
Source: https://youtu.be/HH0zCQgYgq0
Confidence: 1.0

## ORG NODE — Guest's organization
Subject: Hangry Animals
Type: Org
Source: https://youtu.be/HH0zCQgYgq0
Confidence: 0.9

## QUOTE NODE 1
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "maybe. I know, I know this face looks fresh, but underneath, inside I'm haggard, you know,"
Timestamp: 00:01:20
YouTube deeplink: https://youtu.be/HH0zCQgYgq0?t=80
Confidence: 1.0

## QUOTE NODE 2
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "early. And from a technology standpoint, I don't think anybody has figured"
Timestamp: 00:06:00
YouTube deeplink: https://youtu.be/HH0zCQgYgq0?t=360
Confidence: 1.0

## QUOTE NODE 3
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "project. I dunno what it is yet, but we should try and figure out what that project could be."
Timestamp: 00:11:00
YouTube deeplink: https://youtu.be/HH0zCQgYgq0?t=660
Confidence: 1.0

## QUOTE NODE 4
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "that's what we had one. We, um, about a year and a half ago, we filed for a trademark in the"
Timestamp: 00:15:50
YouTube deeplink: https://youtu.be/HH0zCQgYgq0?t=950
Confidence: 1.0

## QUOTE NODE 5
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "inline skater gang who goes around tagging the city with your graffiti and"
Timestamp: 00:20:40
YouTube deeplink: https://youtu.be/HH0zCQgYgq0?t=1240
Confidence: 1.0

## QUOTE NODE 6
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "three deliveries in this round, so I've got a, you can't see it. Read it very well there. There's three sushi,"
Timestamp: 00:25:35
YouTube deeplink: https://youtu.be/HH0zCQgYgq0?t=1535
Confidence: 1.0

## QUOTE NODE 7
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "great to see a little bit more of like the, the back end of what you've been doing"
Timestamp: 00:30:50
YouTube deeplink: https://youtu.be/HH0zCQgYgq0?t=1850
Confidence: 1.0

## EDGES TO ASSERT
- Zaal Panthaki -[hosted]-> BCZ YapZ w/Andy Minton (Hangry Animals)
- Andy Minton -[appeared_on]-> BCZ YapZ w/Andy Minton (Hangry Animals)
- Andy Minton -[part_of]-> Hangry Animals
- BCZ YapZ w/Andy Minton (Hangry Animals) -[contains_quote]-> Quote 1 through Quote 7

---
Build the manifest, preview the first 3 nodes inline, then ask me "approve all?". Do not commit until I say yes. If existing Episode/Person/Org nodes match by name, MERGE; do not create parallel nodes. Topics in the description are attributes, not entities.