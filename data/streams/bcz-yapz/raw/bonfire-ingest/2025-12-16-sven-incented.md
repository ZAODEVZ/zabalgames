INGEST BATCH: BCZ YapZ Episode 6 — Sven from Incented (2025-12-16).

Build a manifest of nodes and edges, preview the first 3 nodes, then ask me to approve. Verbatim quote text must be preserved exactly. Topics, platforms, chains, and tools must be stored as attributes on the Episode node, NEVER as standalone Entity nodes per scope_constraint trait.

## EPISODE NODE
Subject: BCZ Yaps w/Sven (Incented)
Type: PodcastEpisode
Date: 2025-12-16
Show: BCZ YapZ
Episode number: 6
Format: video-podcast
YouTube URL: https://youtu.be/O7-1weR0Qog
YouTube video ID: O7-1weR0Qog
Description: Zaal interviews Sven from Incented.
Source: https://youtu.be/O7-1weR0Qog
Confidence: 1.0

## PERSON NODE — Guest
Subject: Sven
Type: Person
Role: Founder/team at Incented
Source: https://youtu.be/O7-1weR0Qog
Confidence: 1.0

## ORG NODE — Guest's organization
Subject: Incented
Type: Org
Source: https://youtu.be/O7-1weR0Qog
Confidence: 0.9

## QUOTE NODE 1
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "uh, I'm just like a random nerd living in the desert really. So don't pay too much attention to me or what"
Timestamp: 00:00:55
YouTube deeplink: https://youtu.be/O7-1weR0Qog?t=55
Confidence: 1.0

## QUOTE NODE 2
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "for a couple big corporate companies and now in the crypto space, I'm getting more involved with startups and"
Timestamp: 00:04:25
YouTube deeplink: https://youtu.be/O7-1weR0Qog?t=265
Confidence: 1.0

## QUOTE NODE 3
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "usually this is all configurable of course, because we're protocol. Um, but you can get an upside by"
Timestamp: 00:07:25
YouTube deeplink: https://youtu.be/O7-1weR0Qog?t=445
Confidence: 1.0

## QUOTE NODE 4
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "generation for our social channels, right? So we, we have, I'm not gonna go through all of this. Don't worry if you're"
Timestamp: 00:10:25
YouTube deeplink: https://youtu.be/O7-1weR0Qog?t=625
Confidence: 1.0

## QUOTE NODE 5
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "Yeah, on the upper right, on the, in the upper right. And, uh, I've pre-filled out some of this information to"
Timestamp: 00:13:55
YouTube deeplink: https://youtu.be/O7-1weR0Qog?t=835
Confidence: 1.0

## QUOTE NODE 6
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "where you, maybe you're an ecosystem or a community and you have a couple things in mind that you want"
Timestamp: 00:16:50
YouTube deeplink: https://youtu.be/O7-1weR0Qog?t=1010
Confidence: 1.0

## QUOTE NODE 7
Type: Quote
Speaker: (mark Zaal or guest based on context)
Text (verbatim): "private? Uh, so you just see the stats, like there's actually four different levels. You can either just see the"
Timestamp: 00:20:20
YouTube deeplink: https://youtu.be/O7-1weR0Qog?t=1220
Confidence: 1.0

## EDGES TO ASSERT
- Zaal Panthaki -[hosted]-> BCZ Yaps w/Sven (Incented)
- Sven -[appeared_on]-> BCZ Yaps w/Sven (Incented)
- Sven -[part_of]-> Incented
- BCZ Yaps w/Sven (Incented) -[contains_quote]-> Quote 1 through Quote 7

---
Build the manifest, preview the first 3 nodes inline, then ask me "approve all?". Do not commit until I say yes. If existing Episode/Person/Org nodes match by name, MERGE; do not create parallel nodes. Topics in the description are attributes, not entities.