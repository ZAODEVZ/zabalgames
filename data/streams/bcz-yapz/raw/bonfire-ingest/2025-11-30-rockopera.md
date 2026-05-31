INGEST BATCH: BCZ YapZ Episode 4 — Rock Opera (2025-11-30).

Build a manifest of nodes and edges, preview the first 3 nodes, then ask me to approve. Verbatim quote text must be preserved exactly. Topics, platforms, chains, and tools must be stored as attributes on the Episode node, NEVER as standalone Entity nodes per scope_constraint trait.

## EPISODE NODE
Subject: BCZ YapZ w/Rock Opera
Type: PodcastEpisode
Date: 2025-11-30
Show: BCZ YapZ
Episode number: 4
Format: video-podcast
YouTube URL: https://youtu.be/43GPWLE6W5Q
YouTube video ID: 43GPWLE6W5Q
Description: Zaal interviews Rock Opera.
Source: https://youtu.be/43GPWLE6W5Q
Confidence: 1.0

## PERSON NODE — Guest
Subject: Rock Opera
Type: Person
Source: https://youtu.be/43GPWLE6W5Q
Confidence: 1.0

## QUOTE NODE 1
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "yeah, no, I love, uh, I love going for a bike ride. I used to bike to, to high school, um, and there was,"
Timestamp: 00:01:00
YouTube deeplink: https://youtu.be/43GPWLE6W5Q?t=60
Confidence: 1.0

## QUOTE NODE 2
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "contract for tokenizing color. It, this is what's the phrase that I have here on chain,"
Timestamp: 00:05:20
YouTube deeplink: https://youtu.be/43GPWLE6W5Q?t=320
Confidence: 1.0

## QUOTE NODE 3
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "just like a wallet address could be, right. Like, it could be really cool for each wallet address within our community"
Timestamp: 00:09:15
YouTube deeplink: https://youtu.be/43GPWLE6W5Q?t=555
Confidence: 1.0

## QUOTE NODE 4
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "complicated than it should be to make a piece of art? Absolutely. However, the"
Timestamp: 00:13:20
YouTube deeplink: https://youtu.be/43GPWLE6W5Q?t=800
Confidence: 1.0

## QUOTE NODE 5
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "engineering, so we've probably taken some similar classes. Um, and I'm a classically trained"
Timestamp: 00:17:05
YouTube deeplink: https://youtu.be/43GPWLE6W5Q?t=1025
Confidence: 1.0

## QUOTE NODE 6
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "got 'em versus like tools in the past were, it was a lot harder and you had to know a lot more of like how"
Timestamp: 00:21:10
YouTube deeplink: https://youtu.be/43GPWLE6W5Q?t=1270
Confidence: 1.0

## QUOTE NODE 7
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "about, like, oh, what could be, and then continue down the path. Right. I, I, I wanna jump"
Timestamp: 00:25:20
YouTube deeplink: https://youtu.be/43GPWLE6W5Q?t=1520
Confidence: 1.0

## EDGES TO ASSERT
- Zaal Panthaki -[hosted]-> BCZ YapZ w/Rock Opera
- Rock Opera -[appeared_on]-> BCZ YapZ w/Rock Opera
- BCZ YapZ w/Rock Opera -[contains_quote]-> Quote 1 through Quote 7

---
Build the manifest, preview the first 3 nodes inline, then ask me "approve all?". Do not commit until I say yes. If existing Episode/Person/Org nodes match by name, MERGE; do not create parallel nodes. Topics in the description are attributes, not entities.