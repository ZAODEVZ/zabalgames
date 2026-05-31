INGEST BATCH: BCZ YapZ Episode 14 — Jordan from Ryft (2026-04-01).

Build a manifest of nodes and edges, preview the first 3 nodes, then ask me to approve. Verbatim quote text must be preserved exactly. Topics, platforms, chains, and tools must be stored as attributes on the Episode node, NEVER as standalone Entity nodes per scope_constraint trait.

## EPISODE NODE
Subject: BCZ YapZ w/Jordan (Ryft)
Type: PodcastEpisode
Date: 2026-04-01
Show: BCZ YapZ
Episode number: 14
Format: video-podcast
YouTube URL: https://youtu.be/IbhHxFR4yxE
YouTube video ID: IbhHxFR4yxE
Description: Zaal interviews Jordan from Ryft.
Source: https://youtu.be/IbhHxFR4yxE
Confidence: 1.0

## PERSON NODE — Guest
Subject: Jordan
Type: Person
Role: Founder/team at Ryft
Source: https://youtu.be/IbhHxFR4yxE
Confidence: 1.0

## ORG NODE — Guest's organization
Subject: Ryft
Type: Org
Source: https://youtu.be/IbhHxFR4yxE
Confidence: 0.9

## QUOTE NODE 1
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "Right? And isn't just slop. So it's amazing to have you on. Um, I'd love for you to go into a"
Timestamp: 00:01:20
YouTube deeplink: https://youtu.be/IbhHxFR4yxE?t=80
Confidence: 1.0

## QUOTE NODE 2
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "So I was like, Hey, you know that it's worth waking up in the middle of life. It's,"
Timestamp: 00:06:36
YouTube deeplink: https://youtu.be/IbhHxFR4yxE?t=396
Confidence: 1.0

## QUOTE NODE 3
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "looking at the way that you tell your story, the way that your brand is built."
Timestamp: 00:12:05
YouTube deeplink: https://youtu.be/IbhHxFR4yxE?t=725
Confidence: 1.0

## QUOTE NODE 4
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "then some people like pop into like, okay, like I found my way to make the world better. Like,"
Timestamp: 00:17:05
YouTube deeplink: https://youtu.be/IbhHxFR4yxE?t=1025
Confidence: 1.0

## QUOTE NODE 5
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "And so I have like spreadsheets, right? I have spreadsheets of, of the different items that I'm the"
Timestamp: 00:22:05
YouTube deeplink: https://youtu.be/IbhHxFR4yxE?t=1325
Confidence: 1.0

## QUOTE NODE 6
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "these types of systems that I'm talking about work, because then you can do it"
Timestamp: 00:27:40
YouTube deeplink: https://youtu.be/IbhHxFR4yxE?t=1660
Confidence: 1.0

## QUOTE NODE 7
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "find a, a, a, you know, a bunch of different people. Like, Hey, you know, go and get this or"
Timestamp: 00:32:55
YouTube deeplink: https://youtu.be/IbhHxFR4yxE?t=1975
Confidence: 1.0

## EDGES TO ASSERT
- Zaal Panthaki -[hosted]-> BCZ YapZ w/Jordan (Ryft)
- Jordan -[appeared_on]-> BCZ YapZ w/Jordan (Ryft)
- Jordan -[part_of]-> Ryft
- BCZ YapZ w/Jordan (Ryft) -[contains_quote]-> Quote 1 through Quote 7

---
Build the manifest, preview the first 3 nodes inline, then ask me "approve all?". Do not commit until I say yes. If existing Episode/Person/Org nodes match by name, MERGE; do not create parallel nodes. Topics in the description are attributes, not entities.