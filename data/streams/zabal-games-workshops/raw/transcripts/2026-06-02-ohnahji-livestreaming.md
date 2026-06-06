---
title: ZABAL Gamez Workshop 3 - Ohnahji on growing a livestream
show: ZABAL Gamez Workshops
episode: 3
guest: Ohnahji (Brian)
host: Zaal
date: 2026-06-02T00:00:00.000Z
format: video-livestream-workshop
language: en
track: creator
topics:
  - livestreaming
  - twitch
  - consistency
  - creator-tools
  - obs
  - raids
  - api-keys
  - security
entities:
  orgs:
    - Ohnahji
    - The ZAO
  people:
    - Ohnahji (Brian)
    - Zaal
    - Jaden Violet (JV)
  projects:
    - ZABAL Gamez
    - open-source OBS with an embedded LLM
source:
  capture: live workshop recording (Twitch), auto-transcript with proper nouns corrected
youtube: PENDING_UPLOAD
summary: |
  Day 2, the first creator-track session. Ohnahji (Brian) joins BetterCallZaal to talk
  live streaming - the community he built (a 10K PFP that became "Blockchain's first
  HBCU"), going from audio Spaces to video, and the lessons from a daily 365 stream (day
  288 and counting). The throughline: consistency beats production value, and the tech
  that already works (Twitch, Web2 distribution) still wins. They cover Twitch tools
  (raids, Streamed Together, shared chat, building your own bots), the builder-crossover
  basics (API keys and environment variables), staying safe on screen, and an open-source
  OBS-with-an-LLM idea that could become a future build.
status: cleaned
---

## Key points

- The first creator-track session of the season; Ohnahji potentially spans all three
  tracks - artist, builder, and creator.
- Ohnahji is a community founded January 2022 - a 10K PFP NFT that grew into a safe space
  for Black, brown, and allied folks to learn emerging tech, "Blockchain's first HBCU."
- Embrace the tech that already works: many Web3 streaming platforms are gone, but Twitch
  and Web2 distribution endure. Bring things on-chain only when on-chain is genuinely better.
- Live streaming proves human-to-human connection in an AI age, and the live chat is the
  unsung hero.
- Consistency is king. Ohnahji is on day 288 of a daily 365 stream - the early days are
  frustrating for everyone, and you improve just by showing up. The tool (OBS, Restream,
  StreamYard) matters less than the reps.
- Twitch collaboration: the Knock button / Streamed Together / shared chat for co-streaming;
  raids for community discovery; achievements and leaderboards for gamification.
- You can build your own chat bots instead of relying on Nightbot or StreamElements.
- Builder crossover: API keys are account-authenticated secrets, and environment variables
  (.env) hold secrets you keep local and never publish.
- Security: be careful what you screen-share live (secrets, wallets) - clips can be paused
  and rewound. When in doubt, slow down; rushing is where mistakes happen.
- Zaal is building an open-source OBS with an embedded LLM (with someone on Farcaster) - a
  candidate future ZABAL Gamez workshop to build on top of.

## Transcript

[00:00:00] In search of workshop leads. June is the prep month. A library of recorded sessions that gets a whole cohort of first-time Vibe Coders ready before the ship-a-thon this July. If you have built something worth teaching, you have a session to give. Visit zabalgamez.com. That's Z-A-B-A-L gamez.com and sign up.

[00:00:17] What, what, what is the ZABAL Gamez? Three months, June, July, August. June is prep with ZAO teachers, Vibe Coding instructors run recorded sessions on tools, context, and the ecosystem. July is the open build-a-thon. Anyone with the Vibe Coding harness ships a build for the ZAO ecosystem publicly. August is the finals, a cohort curated from July, each builder paired with a ZAO mentor for the main event winner reveal

[00:00:47] GM Shout out to Iman, killing it with the intros. Yes. Loving it. How we feeling today, B? Doing amazing. Family doing amazing. Good to see you. Good to be here, good to sit down. I appreciate you, [00:01:00] uh, with the invite, man. How is, how's everything your way? What's going on? It's going amazing on my end. This is day two of our ZABAL Gamez.

[00:01:08] We had, um, two awesome guests on yesterday, um, talking builder stuff. Today we have you on, first creator talking creator stuff. I'm actually really excited, 'cause I think you could be one of the few individuals that hit the trio of, uh, workshops, and hit, hit the ABCs of the ZAO. Um, the artist, the builder, and the creator track.

[00:01:29] Um, because I think you have something to share in each of those. So I'm excited to talk creator today. Um, we've been live streaming together a lot here and there throughout the last year plus. Um, we met in the community of the individual that has, uh, that has continued and pushed us to co- kind of come here over to Twitch, um, Jaden Violet from the UVR, so shout out to him.

[00:01:52] Um, I would love to know, or for the audience that, that doesn't know you, to, for you to share a little bit, um, you know, about yourself, [00:02:00] about Ohnahji, why, why your name is Ohnahji B, and, uh, and what everyone, uh, can expect from you here today. Most definitely. Appreciate you. Yeah, well, I'm Ohnahji B. Uh, Ohnahji is the community, you know, that we built, uh, back in 2022, uh, January.

[00:02:17] Started off as a OG PFP NFT 10K collection, uh, that really kind of branched into, uh, an amazing co- uh, community of talented artists, you know, huge, big brain developers, um, and just, you know, people ingrained in, in culture. Um, you know, we kind of bra- branded ourselves as a safe space for Black and... Hey, look at that.

[00:02:37] Got the merch going crazy. I love it. I love it. Branded ourselves as, you know, the, a safe space for Black, brown, and allied folks to learn about emerging tech, and we've been, you know, learning and growing, having workshops, conversations, um, daily lives and all kind of stuff. Go to conversations about that, and just building and branching out, and it's been a really good time.

[00:02:58] So yeah, I'm Ohnahji B. I'm, I'm one of the [00:03:00] founders. Uh, the B's for Brian, obviously, right there on the screen. But Ohnahji is the, is the community name, and that's the, that's the community, you know? Blockchain's first HBCU. Hell yeah. And, uh, through that process, coming in in 2021, seeing the NFT craze, you know, pushing, creating a ultimate- um, NFT project in there that you didn't see something that represented that thing, so you wanted to create it.

[00:03:31] And I think that's super powerful, is the idea here that, like, this space is ac- in blockchain or emerging tech is so vast and open where, like, you can take your own lane and really go with it and find, like, that niche that hasn't been carved out yet. Where in a lot of traditional software or entrepreneurship, a lot of the niches that you [00:04:00] think are very niche, where you barely will even get enough customers to survive, um, isn't actually, like...

[00:04:07] It is still over, over-supplied, right? So I think there's so many cool things about that space, but then there's also so many problems. It comes with a lot of different cons and problems and perception challenges that it faces. So one of the interesting things of the meld between streaming and blockchain that I've seen, and that's been interesting for me, has been seeing the fact that There is a lot of overlap in the customer or, like, the type of person you want to target for your audience in streaming, uh, specifically on Twitch than there is, uh, n- and there's a lot of that overlap that I think that can be really, um...

[00:04:57] A lot of the individuals over there would be [00:05:00] suscep- would be willing to buy a crypto coin but aren't educated enough on it, versus a lot of people on a lot of other social media platforms aren't even willing to put their money on the internet like that in the ho- i- in, like, any, for any reason whatsoever because they don't understand it.

[00:05:20] Right. And I'd love for you to chat about, like, what you've seen from, like, the transit- I mean, we could even talk about our podcast that started on Twitter Spaces and we evolved it over to live streaming, but then also a lot of your media and brand when you went from the, uh, just audio side to the audio video, and A, what the transition was like for, for anyone that's over there on, on Spaces just doing the audio, and then B, like, what is different?

[00:05:48] Why is it so powerful? Definitely. Most definitely. Um, I believe, what's the i- the ideal consumer? Shout out to Bomar in the chat. It's good to see you, family. Um, I think for me, [00:06:00] and you hit the nail on the head, it's like there was a, there was a shift for me when I was building, you know, Ohnahji, and we were talking about emerging tech and trying to be on the cutting edge of everything, right?

[00:06:09] But there is a beauty to not abandoning the current tech that's already out there, the current things, the current infrastructure that already kind of works. And you know, we've seen that. You know, you mentioned, um, our conversations that started off as, as, uh, uh, just regular audio Space calls, right? No cameras on.

[00:06:29] Um, then we branched off and we brought that co- the podcast, you know, Let's Talk About Web3, changed that over to Let's Talk About Eth, um, turned the cams on and got into the live streaming era. Um, I think it is kind of, for me, part of the reason that we got into streaming was, like you mentioned, JV, but also a lot of those Web3, uh, platforms that we were dabbling with, dabbling on, um, community that we were building, was trying to build some Web3 infrastructure, kind of putting, you know, NFTs to live streaming, the tech, you know, the [00:07:00] marketplaces to live streaming.

[00:07:01] It all kind of eventually are not here any longer. I mean, I feel like there's a, there's a beauty in embracing what already works and, you know, I'm on day 288 out of 365 of this daily stream journey, and it's, it's been an interesting shift, but it's been a really good time. I think, um, I was having a conversation earlier and I was talking to one of my friends, and- You know, humans are trying to find, especially in this tech, especially in AI, you know, AI has its, its beautiful uses and things, but for the most part, humans are longing for, even if they don't say it, they're longing for human-to-human interaction, human-to-human connection.

[00:07:41] Like, they see it dwindling on socials. They see it dwindling, uh, IRL. You know, when people go out, they're not talking to anybody. It's like social skills. So I think in the digital sense, live streaming makes the most sense. Like, you can instantly, for the most part, prove there's a human in front of you, there's a human-human connection, and people [00:08:00] are live in the chat, and you can tell that they're humans.

[00:08:02] 'Cause there's not a whole lot of chatbots that, that are in the chats, the live chats. But yeah, so I think it, I think it's beautiful. I think it's, um, important to not forget the tech that works when we're hunting all what's the new bas- uh, biggest and best thing, for sure. Yeah, I like that a lot. I think, uh, a lot of people jump into blockchain and then take it full bore and are like, "Okay, well I'm gonna, like, do everything on-chain for no reason at all," right?

[00:08:27] And, um, it can be powerful to bring things on-chain, especially things that, like, can be better on-chain. Right. But, um, like you're saying, like the Web2 use cases that are out there still get great distribution, so there's value in that right now, um, especially in a m- dwindling audience of, um, blockchain consumers anyways.

[00:08:51] Yeah. Facts. Huge facts. Okay, so one of the questions that I wanna talk to you about is what are the [00:09:00] lessons learned, like practical lessons. If someone, you just said 280 something days, I didn't really hear- Mm-hmm ... exactly what number, and 80, which is nuts. I mean, we know you're gonna get to 365- Yeah ... which is awesome, and it's great to watch and see that.

[00:09:15] Out of the, that, plus like the additional, I don't know, you did eight, an 80 day streak or whatever, but like the additional few months, uh, before that, what are like, let's say the top five things you learned with like, things that an individual can do at the very beginning that you don't have to then just like learn by doing it, right?

[00:09:40] You've learned by, over time, some of these, uh, ways to be better at producing the stream, and I'd love to know some of those things. Will you talk about like, you know, OBS versus, um, you know, a Restream or a StreamYard type platform? I think that's a, a good, a topic to hit, but then also just like [00:10:00] anything else that you think will be super valuable for someone who's like, "Okay, boom," like, "I'm gonna do it.

[00:10:06] Today's the day." What are the things that'll help them along the way? Most definitely. Um, yeah, first and foremost, you know, it is live, and it was one of the, the, the things that I struggled with and the most, um, in the beginning it's like, you know, as I, s- I tend to sometimes have a perfectionist side of me, especially in the, the art and the music side.

[00:10:28] But you have to know, and it's, it's good to reinforce that this is live in the moment and we're still working with tech, so things are gonna go down, things are gonna break. It doesn't matter what tool you use. You know, you mentioned OBS, Restream, StreamYard, it doesn't matter. Any broadcast tool is going to have some, some glitches, some technical whatever.

[00:10:47] You know, the Internet's gonna cut out here and there. Um, you know when people, when people say consistency really is king, it really is. So there's a whole lot of people, you know, who will start in the beginning, your first, your first day, [00:11:00] your first, you know, when you press live, the first week, your first month, and it's gonna be frustrating, and it's supposed to be.

[00:11:09] It's, it's, it's really not easy and, and I think everybody has to realize that, you know, there is grace in learning it, and you will get better with it. Like, it's, it's inevitable. Once you... It's, this is one of those spaces, one of those, you know, those mediums, those tech, whatever, anything that you will get better over time regardless.

[00:11:28] Um, like if nobody shows up, you will get better just learning the tools, being able to multitask around what you're doing live. Um, so you have to keep going. So when people say, especially in, you know, in content, in, in live streaming, you know- You gotta keep going. You know, the daily, the daily, uh, grind works.

[00:11:48] 365 journey does work because it, it forces people to, to do it every day, and to get better, and not give up. It's really easy to kinda give up in the first week, first month. You know, it is frustrating, but everybody goes through [00:12:00] it. But a whole... But a lot of streamers, a lot of content creators, they're not talking about those early days.

[00:12:04] They're not talking about how nobody really understands what they're doing. Even if you're told, you have to go through it, and it's one of those, it's one of those mediums that, that's that. So yeah. Boom. As far as, like, on the technicals though, you know, and it comes over time. You have to, you have to build up to, you know, multi-streaming.

[00:12:25] If you're going to different platforms, different places, that's gonna put a strain on, you know, your connection. That's gonna put a strain on, you know, what you can broadcast bit, bit rate-wise, and all that good stuff. Um, that puts a strain on what different tools you can use, what other tabs you can have up, what you can actually show while you're streaming.

[00:12:42] So, but all of that, it comes through, it comes with, like, time, just doing it. You have to, you have to try it. You have to do it, and you have to learn it for yourself. Like, no... Well, there are probably a few individuals who are blessed with a whole production team and all that good stuff from day one, but for most of the [00:13:00] time, like, a lot of people are doing it themselves.

[00:13:01] They have to do some stuff on the fly and, you know, everybody's used to that. The chats are used to that. The people watching livestreams are used to that, so you know, don't, don't think too much on that and just keep going. Keep learning and keep growing in it Boom. I love it. Uh, one of the things that we haven't done yet, and we should do, and it's a great reason that we didn't do it until we went live, um, is go live together, um, on Twitch.

[00:13:25] So I'm gonna share my screen and show what it looks like. Do you wanna send an invite? You know what is funny about that? What? I am on a different computer, and I'm not on Chrome- Oh ... and I almost sent the invite earlier, and I knew you were gonna ask that. Oh, man. I knew you were gonna ask that. Well- But we could, we could figure it out l- live on the fly

[00:13:46] here, let me- While we're- Let me, let me try and- While we're on ... not out. It says- Let's see. Hold on ... you cannot join a call on your own stream. Interesting. That's too funny. Oh, wait, no, that's because it's mine. I need to go to yours. That makes [00:14:00] sense. Okay. I requested it. Oh, there we go. See if you can do it.

[00:14:03] Yes, that'll work. Okay. I hit that. It worked. So because Ohnahji and I are both following each other, when either of us is live or both of us is live, I think, there's this knock button right on the profile. And this is on Twitch specifically, and it's a very powerful tool because let me share this tab. This is what it looks like.

[00:14:26] And, um, I'm gonna... It is a audio chat room video as well that you can add in here, which I'm not going to because we have it m- my, uh, my cam over here. But ultimately, you can use this as a traditional, uh, audio room. But most people just have it and then mute and leave it on because there's this, uh, tool right here that's called the shared chat.

[00:14:57] So whenever Ohnahji pops in here, if he can, [00:15:00] I don't know- ... if you were able to figure it out or not. I don't know. It's gonna have to be all wrong. Oh, wow. Um- Yeah, I don't even have Chrome on here either. You don't have it on your phone or anything? I have it. Uh, you can accept it on the phone? I, I don't know.

[00:15:14] Probably, maybe. Okay. We'll see. So, so that's some of the things that we could check, try, try live, right? Um, but I think this is a super useful thing that we only learned after a little bit of time playing around with this. It can be very powerful to collaborate with other individuals, especially, um, because that helps pass time sometimes as well.

[00:15:36] So being able to be, uh, i- continue a conversation with someone, play a game with another individual, grow with another individual in some way, shape, or form can be really powerful. So this is a awesome tool that individuals can use on Twitch to, um, have the chats, uh, connected and enabled and the whole, um, setup to be connected, which is [00:16:00] pretty cool.

[00:16:03] Most definitely. I can get into the stream manager here. See if you can send that invite one more time. Okay. And I'll see if it pops up on, on here on the, on the phone Pam pam

[00:16:20] No, I see it in the chat there. Let me... Well, I can actually... Wait, I have a link. There's an invite link, guys. Okay, cool. It's, like, blacked out as well, so I can share this Bum, bum. Actually, yeah, I'll show the other way to get to it. But ultimately, on that same page, if you go to invite guests, there is a link you can copy here for an invite link.

[00:16:50] So that is also super easy, so I'm gonna send that over and let's see if that works 'Cause that, that'd be cool [00:17:00] But let me share this tab and go to Creator Dashboard. So there's another place you can do this, which is under the Stream Manager, and then there's some options here that is Streamed Together.

[00:17:26] And when you click this one, it'll pop open the, uh, that same window that we had opened when we pressed Knock. So if you don't have someone else that's live, you can do it manually through there

[00:17:42] What other... Oh, okay, we got another, we got a question by Javi a- as well. Um, do you feel as if the consistency on streams helped you improve at public speaking and communicating in general, or were you already amazing at it before? I [00:18:00] appreciate you, Javi. That's too funny. Um, yeah, no, I think I've, I've gotten, uh, quite a bit better.

[00:18:06] It's different. I think, um, there's an element to it with which is the chat, which I love so much. You know, I think that's one of the, the unspoken heroes of live streaming is having that live chat and, you know, having, um, the ability for the streamer to be able to have that interaction and read the chats live, um, so that it kinda gets recorded with the conversation as well, too.

[00:18:27] I think there's a, there's a, you know, an art to that, for sure. I think there's a broad spectrum of that as well, too, which is kinda cool to see, and, you know, there's are some successful streamers that, you know, they're probably upping their reading skill while they're, while they're streaming and things like that, and there's other people that are, like, elite readers, which is kinda cool to see.

[00:18:46] Um, but yeah, for me, I think we were already kinda having these goated conversations. Um, you know, I think for me, the most jarring part was the turning the cam on part. You know, we were having, uh, audio spaces with the fam, [00:19:00] you know, the our, our longest segment on Now Is Your Saturdays, you know, talking tech week to week since February 2022, you know.

[00:19:07] So, uh, the hardest part for me was just popping on the cams and just, like, doing the tech work that, that kind of came along with that. 'Cause I, I'm really not, like, uh, a video or camera guy, so it's been, it's been really kinda cool learning that, learning the jargon, learning the tech and, and all that good stuff behind that, so.

[00:19:26] But no, I appre- W question, Javi, I appreciate you. It's good to see you, family. Thanks for tapping in. I love it. What are other, uh, tips you can give for people, um, uh, to start to live stream more, um, w- or when they are doing that consistency, um, some of the powerful things. 'Cause I know raiding is a powerful tool that, again, Twitch offers, and I'm talking about some of these ideas because one of the projects I'm working on with someone on Farcaster is an open source OBS with an LLM [00:20:00] embedded in it, is the ultimate idea- Mm-hmm

[00:20:02] at a very simple level. But then, like, all of the things we've been having conversations about, we've talked to three, maybe four different teams that have done streaming in some way, shape, or form in Web3, and most of them are no longer here with us in that same capacity, the companies. Yeah. Um, but there's a lot of lessons that I think we've learned along the way are, that are things like we would want out of a platform, out of a streaming platform, and I think it'd be really powerful to be able to potentially build that here in this ZABAL Gamez.

[00:20:39] So, um, one of the workshops that we could do potentially is building on top of that. I have some ideas together, but I'd need to do more research and, and put together a proper, uh, doc and maybe get that ready and, and started, um, and then we could build on top of it. Because I think that could be super powerful.

[00:20:58] Um- Yeah ... and, you know, just the [00:21:00] iteration of using that and reusing that and building on top of that can be like that recursive software building and making it better for, like, your use cases, which is crazy powerful. Yeah. 'Cause OBS could do a lot of the things, but you just, like, don't know exactly the setting where, and you don't wanna have to press that each time.

[00:21:17] So being able to make those things easier in a smooth way for, like, an individual like you or me that wants to abstract away all the tooling and just like, "I need this, this, and this," and like, "I have this, this, and this," let's template it over, right? And like, make it usable with one, like, on day one, right?

[00:21:36] I love that. I love that. No, I'm intrigued. Yeah. Ah, another open... Yeah. Yeah. OBS. Yep. Yeah. Do it up, and keep me posted on that, most definitely. Um, that's awesome. Awesome. Z, what was your initial co- c- uh, question? I had, I had an answer for it, but I lost it. Oh, I'm sorry. I don't know. No, you're good. You mean the, like, very back?

[00:21:58] It was like, "What are your top five things?" Or [00:22:00] like, what are your raiding, we were talking about top- Yes ... top things you could do for people. Yeah, so raiding, um, most definitely. I was gonna say, uh, one of the things that got me hooked, and you know because I know, C, you're also one of these guys, but the gamification of different things, leaderboards, achievements, it's all embedded in that, and I had no idea.

[00:22:20] Like, on the, on the, especially on the Twitch platform, um, there were so many different milestones that were tracked, uh, on achievements, and that was super fun. That's one of the reasons why I was raiding so much. I love the raiding, uh, system. I love raids already just 'cause it branches communities together.

[00:22:35] It's a cool, um, community discovery tool. Uh, but also I'm learning a lot, especially, you know, dabbling with AI, dabbling with AI and prompting and stuff, prompt coding on stream and off. I'm learning a lot of different things, um, connecting within Twitch chat. So like, you know, uh, the ability, the ease actually, uh, to be able to monitor chat, to, to see what's going on in [00:23:00] there, and to build your own bots essentially.

[00:23:03] Um, we don't have to... You know, streamers don't really have to be, uh, locked into some of the big ones, you know, like Nightbot, StreamElements, and different things like that. There are some powerful tooling that you can cook up on your own. Um, kinda similar how to, how you're saying, like, you know, there, there's ways to cook up some of your own tooling, um, alternatives to OBS and things, so.

[00:23:22] Yeah, why don't we even talk about that real quick? API keys and environment variables, right? Um, that's something that I think Is something that is a lot more on the builder track side of things. But if you want to understand and learn a little bit about this space, um, on that side of building for yourself, it's powerful to understand these, like, very basic principles.

[00:23:46] And, um, API keys are secrets that you can get that are authenticated to your account that is a string of letters and numbers that you put into your [00:24:00] code to give admin- to give, like, the rights that your account is giving under that API key to the code that you wanna build that does that thing. Twitch has a function, Discord, like, to, to- Telegram, many platforms have the functionality for building your own thing in with an API key.

[00:24:22] Um, when you're using code, you will... When you're writing code normally, you will be writing these secrets in environment variable files. So the environment variable files, env for short, um, are gonna be things that you do not publish to the internet. These are things you keep locally to your computer, because if they go on the internet, someone else can use them and gain access to your code in a way that you don't want.

[00:24:52] Um, do you think that explained it well? Yeah, most definitely. Most definitely. Do you have anything, do you have anything to add on that? I think there's- Yeah ... a [00:25:00] lot of things we could touch on, um, we could do on. We're, we're at about 25 minutes. Um, so I do wanna try and keep it under 30. Um, we could do another creator one, 'cause I think it'd be great to bring in a couple more creators and, um, and have people share a little bit.

[00:25:15] Uh, but- Yeah ... uh, do you wanna share a couple, like, last words of wisdom? Most definitely. I think, um, that's probably the scariest piece for me, you know, just being, like, in control, um, of, like, a Web3 community with, you know, a PFP and, and all that good stuff. Um, I'm very wary of, like, what I show on screen and what...

[00:25:37] You know, especially in the, in the streaming side. You know, you mention envir- uh, environment variables, API keys, different things like that. Just be, be super cognizant around, um, what you're screen sharing. You know, I know a lot of streamers out there, they just screen share, share everything, like, you know, desktop and going through sites and stuff.

[00:25:54] But if you have, um, you know, it's best practice to keep, you know, your, your secrets, [00:26:00] especially if you're doing development work, um, and streaming. Just make sure that, you know, um, double check what you're sharing, you know? Just, just so that something drastic doesn't happen because we're moving too fast.

[00:26:11] And that's the same, same, uh, ethos around Web3 and, and wallets and stuff. But, uh, yeah, 'cause we are live streaming and- Bad things can happen. We've seen those stories too, where, you know- Oh, sure ... someone's going, they're on stream and they click over to a desktop, they clip it, cl- click into a Notepad or something like that, and five seconds, that's it.

[00:26:32] Because people can also, they can go clip it, they can freeze it, they can pause it, rewind- Yeah ... right in the moment. So just be careful. Awesome. Great advice. I think there's, it's, uh, great to come from the Web3 space because you're usually supposed to be on high alert at all times. Right. So I think that's very powerful, 'cause a lot of people on Twitch do not use those same security practices that we've, like, been kind of, like, [00:27:00] ingrained in us, um, because of a hack here or there in some way, shape, or form, or seeing a friend, uh, be hacked here or there.

[00:27:07] Um, but that be safe, that's a great way to put it. And you know one of the things that I actually, I wanna cap this off with that I think you said at the very beginning, um, and you, you always continue to say that always struck me really well, is if there's any doubt in your mind, just take a step back and go slower.

[00:27:25] Like, that- Yeah ... is always going to be better. Like, there is never, there's nine times out of 10, there nine times out of 10, there isn't gonna be a better thing happening because you rushed. There- Right ... is, like, very much, like, if someone is trying to get you to rush, especially someone you don't know well, especially someone, like, potentially calling that is someone you do know well, but, like, is a really weird thing and amount because, like, maybe you know them from, you know, [00:28:00] some faraway place or something like that, right?

[00:28:03] Like, there could be a lot of different things. So, um, I digress. The, the best thing you said was, uh, was, you know, take a step back, be slow. Take a, like, take that step and, like, do your due diligence, do your research. Like, there's no need to rush into things, and that can always save you, right? Like, 'cause there's, there'll always be one or two red flags here, and the challenge that happens with most security things is that people rush.

[00:28:28] So we'll, we'll leave it at that. Very true. Very true. We'll slow down. Awesome. Well, thanks everyone for popping in. Cheers. Have a great rest of your guys' night and, uh, we'll see you guys soon. All right.
