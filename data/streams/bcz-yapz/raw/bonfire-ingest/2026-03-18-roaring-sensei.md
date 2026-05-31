INGEST BATCH: BCZ YapZ Episode 11 — Roaring Sensei (2026-03-18).

Build a manifest of nodes and edges, preview the first 3 nodes, then ask me to approve. Verbatim quote text must be preserved exactly. Topics, platforms, chains, and tools must be stored as attributes on the Episode node, NEVER as standalone Entity nodes per scope_constraint trait.

## EPISODE NODE
Subject: BCZ YapZ w/Roaring Sensei
Type: PodcastEpisode
Date: 2026-03-18
Show: BCZ YapZ
Episode number: 11
Format: video-podcast
YouTube URL: https://youtu.be/DIeav3o8t9M
YouTube video ID: DIeav3o8t9M
Description: Zaal interviews Roaring Sensei.
Source: https://youtu.be/DIeav3o8t9M
Confidence: 1.0

## PERSON NODE — Guest
Subject: Roaring Sensei
Type: Person
Source: https://youtu.be/DIeav3o8t9M
Confidence: 1.0

## QUOTE NODE 1
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "you share a little bit about yourself, like your background and, uh, and what,"
Timestamp: 00:01:10
YouTube deeplink: https://youtu.be/DIeav3o8t9M?t=70
Confidence: 1.0

## QUOTE NODE 2
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "I lo I love all that. I would love to. To dive into, dive to, to GameStop a little bit more."
Timestamp: 00:05:35
YouTube deeplink: https://youtu.be/DIeav3o8t9M?t=335
Confidence: 1.0

## QUOTE NODE 3
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "I'm a magic of the gathering kid. Nice. So like I, I have a lot of magic. The gathering cards"
Timestamp: 00:10:00
YouTube deeplink: https://youtu.be/DIeav3o8t9M?t=600
Confidence: 1.0

## QUOTE NODE 4
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "stocks and things like that. And it's worked really well. I've got a lovely connection. The collection of, um."
Timestamp: 00:14:15
YouTube deeplink: https://youtu.be/DIeav3o8t9M?t=855
Confidence: 1.0

## QUOTE NODE 5
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "segment myself, you know what I mean? Because I get, I get called Sensei more than I get called"
Timestamp: 00:18:40
YouTube deeplink: https://youtu.be/DIeav3o8t9M?t=1120
Confidence: 1.0

## QUOTE NODE 6
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "difficult for me because I try to be as nice as possible, but not everybody's gonna like you. Not everybody's gonna"
Timestamp: 00:22:55
YouTube deeplink: https://youtu.be/DIeav3o8t9M?t=1375
Confidence: 1.0

## QUOTE NODE 7
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "changes, there has to be that line where we say, what are we gonna do here, folks? What, how are we gonna."
Timestamp: 00:27:05
YouTube deeplink: https://youtu.be/DIeav3o8t9M?t=1625
Confidence: 1.0

## EDGES TO ASSERT
- Zaal Panthaki -[hosted]-> BCZ YapZ w/Roaring Sensei
- Roaring Sensei -[appeared_on]-> BCZ YapZ w/Roaring Sensei
- BCZ YapZ w/Roaring Sensei -[contains_quote]-> Quote 1 through Quote 7

---
Build the manifest, preview the first 3 nodes inline, then ask me "approve all?". Do not commit until I say yes. If existing Episode/Person/Org nodes match by name, MERGE; do not create parallel nodes. Topics in the description are attributes, not entities.