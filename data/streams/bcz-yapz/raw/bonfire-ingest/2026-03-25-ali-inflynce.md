INGEST BATCH: BCZ YapZ Episode 13 — Ali from Inflynce (2026-03-25).

Build a manifest of nodes and edges, preview the first 3 nodes, then ask me to approve. Verbatim quote text must be preserved exactly. Topics, platforms, chains, and tools must be stored as attributes on the Episode node, NEVER as standalone Entity nodes per scope_constraint trait.

## EPISODE NODE
Subject: BCZ YapZ w/Ali (Inflynce)
Type: PodcastEpisode
Date: 2026-03-25
Show: BCZ YapZ
Episode number: 13
Format: video-podcast
YouTube URL: https://youtu.be/WTyafqHKQqM
YouTube video ID: WTyafqHKQqM
Description: Zaal interviews Ali from Inflynce.
Source: https://youtu.be/WTyafqHKQqM
Confidence: 1.0

## PERSON NODE — Guest
Subject: Ali
Type: Person
Role: Founder/team at Inflynce
Source: https://youtu.be/WTyafqHKQqM
Confidence: 1.0

## ORG NODE — Guest's organization
Subject: Inflynce
Type: Org
Source: https://youtu.be/WTyafqHKQqM
Confidence: 0.9

## QUOTE NODE 1
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "I'm right now is just building, launching products. Influence is one of them. So previously I"
Timestamp: 00:00:55
YouTube deeplink: https://youtu.be/WTyafqHKQqM?t=55
Confidence: 1.0

## QUOTE NODE 2
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "Okay. Uh, and I didn't know anything, actually. Nothing. Yeah. I was just, you know, just"
Timestamp: 00:04:50
YouTube deeplink: https://youtu.be/WTyafqHKQqM?t=290
Confidence: 1.0

## QUOTE NODE 3
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "nervous. You don't feel good at the end of the day. Right. Like that you, that you're moving, moving the needle"
Timestamp: 00:08:30
YouTube deeplink: https://youtu.be/WTyafqHKQqM?t=510
Confidence: 1.0

## QUOTE NODE 4
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "I was a, I was a trader and I came in and I was a musician and I came in, or Yeah, this and that. And"
Timestamp: 00:12:00
YouTube deeplink: https://youtu.be/WTyafqHKQqM?t=720
Confidence: 1.0

## QUOTE NODE 5
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "they follow you, you can just buy like, or repos. First of all, if you are an even account,"
Timestamp: 00:15:50
YouTube deeplink: https://youtu.be/WTyafqHKQqM?t=950
Confidence: 1.0

## QUOTE NODE 6
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "you need to target, you need to blah, blah, blah. You need lots of things. But whenever you became a permissionless, there would"
Timestamp: 00:19:50
YouTube deeplink: https://youtu.be/WTyafqHKQqM?t=1190
Confidence: 1.0

## QUOTE NODE 7
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "boost type, which means it doesn't have to be far casted content. It can be any link. It can be"
Timestamp: 00:23:20
YouTube deeplink: https://youtu.be/WTyafqHKQqM?t=1400
Confidence: 1.0

## EDGES TO ASSERT
- Zaal Panthaki -[hosted]-> BCZ YapZ w/Ali (Inflynce)
- Ali -[appeared_on]-> BCZ YapZ w/Ali (Inflynce)
- Ali -[part_of]-> Inflynce
- BCZ YapZ w/Ali (Inflynce) -[contains_quote]-> Quote 1 through Quote 7

---
Build the manifest, preview the first 3 nodes inline, then ask me "approve all?". Do not commit until I say yes. If existing Episode/Person/Org nodes match by name, MERGE; do not create parallel nodes. Topics in the description are attributes, not entities.