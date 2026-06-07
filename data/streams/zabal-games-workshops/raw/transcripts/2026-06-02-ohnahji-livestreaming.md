---
title: Starting and growing your own livestream - Ohnahji (ZABAL Gamez Day 2, creator track)
show: ZABAL Gamez Workshops
episode: 4
presenter: Ohnahji (Brian)
co_host: Zaal
host: Zaal
date: 2026-06-02T00:00:00.000Z
format: live Twitch session, recorded
language: en
track: creator
topics:
  - livestreaming
  - audience-growth
  - creator-track
  - consistency
  - twitch
  - obs-restream-streamyard
  - raiding
  - api-keys
  - environment-variables
  - operational-security
recording: https://luma.com/xa3bsp21
source: live Twitch stream (Zaal x Ohnahji), auto-transcript lightly cleaned
summary: |
  Day 2 of ZABAL Gamez and the first creator-track session. Ohnahji (Brian), co-founder of the
  Ohnahji community ("blockchain's first HBCU," a safe space for Black, brown, and allied folks
  learning emerging tech), joins Zaal on Twitch to talk about starting and growing a livestream.
  Ohnahji is on day ~288 of a 365 daily-stream journey. The throughline: consistency is king -
  every broadcast tool (OBS, Restream, StreamYard) glitches, the early days are frustrating for
  everyone, and you only get better by showing up daily. They demo Twitch's Streamed Together /
  Knock + shared chat for collaborating live, talk raids as a community-discovery and gamification
  tool, building your own chat bots instead of leaning only on Nightbot/StreamElements, and the
  builder-side basics of API keys and environment variables (keep your secrets in .env, never on
  screen). It closes on operational security for streamers: be careful what you screen-share, and
  when in doubt, slow down - rushing is where things go wrong.
takeaways:
  - "Consistency is king. Every tool glitches and the first weeks are frustrating for everyone - you only improve by streaming daily and not quitting."
  - "Embrace the tech that already works. Web2 distribution (Twitch) still reaches people; bring things on-chain only when on-chain is genuinely better."
  - "Twitch Streamed Together / Knock + shared chat lets you collaborate live and merge chats; raids are a powerful community-discovery and gamification tool."
  - "Build your own bots and tooling - API keys are account-scoped secrets; keep them in .env files, never published and never on screen."
  - "Operational security: double-check what you screen-share, and when in doubt slow down - nine times out of ten rushing is the mistake."
status: cleaned
---

## Key points

- **Who:** Ohnahji B (Brian), co-founder of the Ohnahji community - a 2022 PFP/NFT project that
  grew into "blockchain's first HBCU," a safe space for Black, brown, and allied folks learning
  emerging tech. The first creator-track session of ZABAL Gamez.
- **Consistency is king.** Ohnahji is ~288 of 365 on a daily-stream journey. Every tool (OBS,
  Restream, StreamYard) breaks sometimes; the internet cuts out; the first week and month are
  frustrating for everyone. You get better just by showing up - the daily grind forces it.
- **Don't abandon what works.** There is beauty in Web2 rails that already reach people. A lot of
  Web3 streaming infra came and went; the distribution on Twitch is real now. Bring things on-chain
  only when on-chain is actually better.
- **Why live wins:** people are longing for human-to-human connection; a livestream instantly proves
  there is a human in front of you, and the live chat is the unspoken hero of the medium.
- **Twitch tooling:** Streamed Together / the Knock button + shared chat let two streamers who follow
  each other collaborate live and merge their chats; raids branch communities together and double as
  a discovery + gamification tool (leaderboards, achievements).
- **Build your own:** you can cook up your own chat bots instead of relying only on Nightbot or
  StreamElements. Which leads into the builder basics - API keys (account-scoped secrets you paste
  into code) and environment variables (.env files you keep local, never publish, never show on screen).
- **Operational security:** be cognizant of what you screen-share (viewers can clip, freeze, rewind a
  leaked secret in seconds). Same ethos as Web3 wallets. When in doubt, slow down - rushing is where
  things go wrong.
- **Seeded for ZABAL Gamez:** an idea surfaced live - an open-source OBS alternative with an LLM
  embedded (a project Zaal is exploring with a Farcaster builder), a candidate to build on during the season.

## Transcript

> Lightly cleaned from the live Twitch auto-transcript; timestamps preserved for navigation.
> Speakers: Zaal (host) and Ohnahji (Brian).

[00:00:00] (ZABAL Gamez trailer) In search of workshop leads. June is the prep month. A library of recorded sessions that gets a whole cohort of first-time vibe coders ready before the ship-a-thon this July. If you have built something worth teaching, you have a session to give. Visit zabalgamez.com - that's Z-A-B-A-L-games.com - and sign up.

[00:00:17] What, what, what is the ZABAL Gamez? Three months: June, July, August. June is prep with ZAO teachers; vibe-coding instructors run recorded sessions on tools, context, and the ecosystem. July is the open build-a-thon - anyone with a vibe-coding harness ships a build for the ZAO ecosystem publicly. August is the finals, a cohort curated from July, each builder paired with a ZAO mentor for the main event and winner reveal.

[00:00:47] GM. Shout out to Iman, killing it with the intros. How we feeling today, B? Doing amazing, family doing amazing. Good to be here, good to sit down. I appreciate the invite. How's everything your way? It's going amazing on my end. This is day two of our ZABAL Gamez. We had two awesome guests on yesterday talking builder stuff. Today we have you on, first creator, talking creator stuff. I think you could be one of the few who hit the trio of workshops - the ABCs of the ZAO: the artist, the builder, and the creator track - because you have something to share in each.

[00:01:52] For the audience that doesn't know you - share a little about yourself, about Ohnahji, why your name is Ohnahji B, and what to expect today. Most definitely. I'm Ohnahji B. Ohnahji is the community we built back in January 2022. It started as an OG PFP NFT 10K collection that branched into an amazing community of talented artists, big-brain developers, and people ingrained in culture. We branded ourselves as a safe space for Black, brown, and allied folks to learn about emerging tech - workshops, conversations, daily lives. The B is for Brian. Ohnahji is the community: blockchain's first HBCU.

[00:03:31] Coming in around 2021, seeing the NFT craze, you create the thing you didn't see represented. This space is so vast and open - you can take your own lane and find a niche that hasn't been carved out yet, where in traditional software a lot of "niches" are actually oversupplied. But it also comes with cons, problems, and perception challenges. One interesting thing about the meld of streaming and blockchain: there's a lot of overlap in the audience you'd target on Twitch. A lot of those folks would be willing to buy a coin but aren't educated on it, versus people on other platforms who won't put money on the internet at all because they don't understand it.

[00:05:20] Talk about the transition - our podcast started on Twitter Spaces and we evolved it to livestreaming; your media went from audio to audio-video. What was the transition like, and why is it so powerful? There was a shift for me building Ohnahji and trying to be on the cutting edge - but there's beauty in not abandoning the current tech that already works. Our conversations started as audio Space calls, no cameras. Then we branched the podcast (Let's Talk About Web3, then Let's Talk About Eth), turned the cams on, and got into livestreaming. A lot of the Web3 streaming platforms we dabbled with aren't here any longer. There's a beauty in embracing what works.

[00:07:01] I'm on day 288 of 365 of this daily stream journey. Humans are longing for human-to-human connection - they see it dwindling on socials and IRL. In the digital sense, livestreaming makes the most sense: you can instantly prove there's a human in front of you, people are live in the chat, and you can tell they're human. Don't forget the tech that works while hunting the newest, biggest thing.

[00:08:27] A lot of people jump into blockchain and go full bore - "I'll do everything on-chain for no reason." It can be powerful to bring things on-chain when they're genuinely better there, but Web2 use cases still get great distribution, so there's value in that right now, especially with a dwindling audience of blockchain consumers.

[00:08:51] Practical lessons: you said ~288 days. What are the top things someone can do at the very beginning so they don't have to learn everything the hard way - OBS vs Restream vs StreamYard, and anything else valuable for someone who says "today's the day"? First and foremost: it is live. I have a perfectionist side, especially with art and music, but you have to reinforce that this is live and we're working with tech - things break no matter what tool you use. OBS, Restream, StreamYard, the internet cutting out - it doesn't matter.

[00:10:47] When people say consistency is king, it really is. A lot of people start - first day, first week, first month - and it's frustrating, and it's supposed to be. There's grace in learning it, and you will get better; it's inevitable. Even if nobody shows up you'll get better just learning the tools and multitasking live. The daily 365 journey works because it forces you to do it every day and not give up. A lot of creators don't talk about those early days where nobody understands what they're doing.

[00:12:25] On the technicals: multi-streaming to different platforms strains your connection, your bitrate, what tools and tabs you can use, what you can show. But it all comes with time - you have to try it and learn it for yourself. A few people are blessed with a production team from day one, but most do it themselves, on the fly, and the chats are used to that. Don't overthink it - keep learning and growing.

[00:13:25] One thing we haven't done and should: go live together on Twitch. Let me share my screen. (They troubleshoot an invite live - wrong computer, no Chrome, "you cannot join a call on your own stream.") Because Ohnahji and I follow each other, when either of us is live there's a Knock button on the profile. This is Twitch-specific and powerful. It's an audio/video chat room you can add, but most people mute and leave it on for the shared chat tool. When you connect, the chats merge.

[00:16:03] (More live troubleshooting; they find the invite link under Invite Guests, and the Creator Dashboard > Stream Manager > Streamed Together option, which opens the same window as Knock - so you can do it manually if no one else is live.)

[00:17:42] Question from Javi: did consistency on streams improve your public speaking and communication, or were you already great? I've gotten quite a bit better. The chat is one of the unspoken heroes of livestreaming - reading it live and interacting is an art, and there's a broad spectrum of skill there. For me the most jarring part was turning the cam on; we'd been doing audio Spaces with the fam since February 2022, so popping the cams on and doing the tech work was the hard part.

[00:19:26] More tips for people building consistency - raiding is powerful. One of the projects I'm working on with someone on Farcaster is an open-source OBS with an LLM embedded - that's the ultimate idea at a simple level. We've talked to three or four teams that did Web3 streaming; most are no longer here in that capacity. There are lots of lessons about what we'd want out of a streaming platform, and it could be powerful to build that here in ZABAL Gamez. One of the workshops could be building on top of that - I'd put together a proper doc first, then we build on it. That recursive software building - using it, reusing it, making it better for your use cases - is crazy powerful.

[00:21:58] Back to the top things: raiding. The gamification - leaderboards, achievements - got me hooked; Twitch tracks so many milestones. Raids branch communities together and are a great discovery tool. And dabbling with AI and prompt-coding on and off stream, I'm learning to monitor chat and build my own bots - streamers don't have to be locked into Nightbot or StreamElements; you can cook up your own tooling.

[00:23:22] Let's talk API keys and environment variables - more builder-track, but worth understanding. API keys are account-authenticated secrets (a string of letters and numbers) you put into your code to grant it the rights your account has under that key. Twitch, Discord, Telegram - many platforms let you build with an API key. When you write code you keep these secrets in environment variable (.env) files that you do not publish to the internet - if they leak, someone else can use them to access things you don't want.

[00:25:00] We're at ~25 minutes; let's keep it under 30. Last words of wisdom? The scariest piece for me, being in control of a Web3 community with a PFP and all that, is being wary of what I show on screen. Be cognizant when screen-sharing, especially doing development work with env variables and API keys - double-check what you're sharing so nothing drastic happens because we moved too fast. Same ethos as Web3 wallets. People can clip, freeze, pause, and rewind a leaked secret in the moment, so be careful.

[00:27:07] Coming from Web3, you're supposed to be on high alert at all times - a lot of Twitch streamers don't use the same security practices we've had ingrained by seeing hacks. And the thing you always say that struck me: if there's any doubt, take a step back and go slower. Nine times out of ten there isn't a better outcome from rushing; if someone's trying to get you to rush, that's a red flag. Do your due diligence, do your research - slowing down can always save you. Very true. We'll leave it at that.

[00:28:28] Thanks everyone for popping in. Cheers - have a great rest of your night, and we'll see you soon.
