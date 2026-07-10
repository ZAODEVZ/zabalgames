---
title: ZABAL GAMEZ Workshop w/Adrienne from GM Farcaster
show: ZABAL Gamez Workshops
presenter: Adrienne Shulman @adrienne
org: GM Farcaster
date: 2026-06-30T00:00:00.000Z
format: Live talk plus Q and A, recorded
language: en
track: builder
youtube: https://youtu.be/t0LntX592vQ
topics: [Building Warpy, AI agents on Farcaster, Neynar webhooks and signers, Embeddings and vector search, Agentic loops and skills, Building in public]
---

[00:00:00] Visit zabal games.com. That's Z-A-B-A-L games.com and sign up Decentralized energy, let's talk about ways What's up, everybody? We're back for another Zabal Gamez workshop. Today I have Adrienne of GM Farcaster here today. How we doing today, Adrienne? What's up? I love that intro, Zaal. Thank you. Thank you. IMan Afrikah made it for me. That's the beauty of Web3, the beauty of this permissionless tech. Um, when you share brand assets out there, people can just build on top of it.

[00:00:34] So I'm sure we're gonna be talking a little bit about that today. Um, very excited to dive into what you've been building here alongside the GM Farcaster Podcast, talking about Warpy, the AI agent that lives, breathes, um, eats GM Farcaster. So, um, yeah- He's been like- Without further ado- ... hungry. Exactly.

[00:00:53] Ready, ready, ready to munch. And he predates a Warblet. He was the OG Warblet. Yeah, [00:01:00] which is, i- which is its own, like, piece of lore in and of itself. When I have conversations outside of Farcaster with my ex friends, um, some of these conversations I can't just, like... Just like crypto and Web3, these pieces of jargon, we've created our own Farcaster jargon, um, with some of the lore.

[00:01:17] But that's kind of the beauty of this, you know, safe space, this small space, which we're all trying to make a little bit bigger. So without, uh, further ado, I'd love for you to give a little bit of a bio, an intro, and then we can just get into building Warpy. Sure. Um, so yeah, I'm Adrienne Shulman. I am co-founder and co-host of GM Farcaster, which is a live stream news show covering everything that happens across the Farcaster ecosystem.

[00:01:43] Um, we have been doing it, my co-host and I now, Nish Propp, have been doing it since September 2023, um, which was shortly before Farcaster actually went permissionless and open to everyone. So we're, uh, we, we basically, it's like two to three times a week [00:02:00] we live stream. We talk about everything that's happening.

[00:02:01] So like you said, kind of all the lore, cultural stuff, announcements, news. Um, and, um- One of the cool things about being on Farcaster are just all the different, uh, kind of Lego blocks that you can play with and, and spaces to kind of build on top of. Um, and that was really why I wanted to build Warpy as an AI agent, um, because we have the podcast, so, like, podcasts, um, you know, you can do it on any sort of traditional media, but I was like, how do we use, um, kinda lean into all the different things you can only do on Farcaster?

[00:02:36] So, um, wanted to talk a little bit about how Warpy came to be and my experience building it from kind of a, I don't know, builder tech perspective. And, um, I prepared some slides. I said, uh, I'll probably use them just as, like, rough background, but Zaal, I said invite people if there's questions as I go, or if you have questions, feel free to interrupt.

[00:02:58] Amazing. I'll say one light [00:03:00] thing about GM Farcaster before I pop off and away. One of the things I actually really like that you guys do in the formatting of the show is I like the fact that the guest actually comes in midway through because it gives the opportunity for the chat to get energized, for people to come in, um, for people to share it out.

[00:03:19] And then when that individual comes in and joins in, you have this, um, excited and ready chat that's already been having a conversation for 20, 30 minutes. So, um, I just wanna say I really like what you guys are doing there with GM Farcaster, and I think it's been, uh, a model for me, myself, in seeing you build Warpy for how I...

[00:03:40] Uh, I mean, even just the media of the podcast for some of the different things I wanna do on the media side myself. So, um, yeah, very inspired by you guys and excited to hear more about the, the creation of Warpy. Yeah. Media's a fun place to experiment with. So my background is in kinda traditional B2B SaaS on the engineering side.

[00:03:59] [00:04:00] So, um, never really got into media, and I fell in love with Farcaster just 'cause I thought it was such a cool place, um, to build on top of. Like, it attracted so many different types of creative people. Um, so now doing GM Farcaster and using the, the, the podcast as a way to experiment with all the different, uh, kinda ways you can use technology and lean into, like, the new side of new media.

[00:04:22] And like you said, like, the, the livestreams I find really interesting because you have a way to, like, really connect with audience one-on-one. So I know you do a lot of that as well. So I- Yeah, no, I think in this ever so emerging AI content era that we're coming in, livestreaming brings authenticity that isn't seen in content today, and I think that's one of the big, um, big unlocks here.

[00:04:48] And it's the only scarcity left, I think, right? So, like, if an agent can spin up an agent that can spin up an agent and they all livestream, like, you're still only getting one human, and it may or may not be valuable. We'll have to see. Hard to [00:05:00] know what the future brings. Yeah, a million percent. Um, I think you guys do a great job in br- in bringing the, the news of Farcaster, it being so, um, specific, I think.

[00:05:12] It's general to everything, but at the same time, you have this, like, subculture of, uh, how can we use decentralized social media and the graph, the knowledge of the social graph to level up how connections can be made, and I think GM Farcaster does that great, especially with Warpy and the different ways you guys, um, encourage your listeners to be a part of the community, not just, you know, people who are coming in and listening in, but feel like they're a part of, of what makes us special That's what I love.

[00:05:49] That's what we love about it the best too. Um, and, uh, so, so, like, so this is, um... I'll kind of go into the history of Warp.io then, if we're ready to- Perfect ... to [00:06:00] start. Let's do it. So, um, uh, like you said, Prof and I have been live streaming GM Farcaster, Farcaster news. We talk about everything that's happening on Farcaster.

[00:06:09] And, um, a lot of people on the timeline would give us credit and gratitude, and people used to call us the time capsule of Farcaster history. And I loved that because no one else was really recording what was happening on Farcaster as it was happening except for us. Um, and for people on Farcaster, you know it moves really fast.

[00:06:32] Uh, I remember early on when we started the podcast, people would say, like, "Is there really that much to talk about?" And we always laugh 'cause we started with our show, we said it was gonna be 21 minutes, we were always late. We... now we call it 29 minutes, but we stream for about an hour, hour and a half every time because there's always things to talk about, and it's 'cause people are building things.

[00:06:49] Um, but it also changes so fast. So, like, how many times do we see projects launch and maybe they gain attention short term, they maybe succeed and go on. A lot of them don't. A lot of [00:07:00] them falter and fail. That's the nature of being in an emergent space. Memes pop up, then they die, you know? Uh, but we... and we were capturing all that, and we recorded it all.

[00:07:10] So if you go to our YouTube channel, you just see like a billion videos, it's really in the hundreds, but, of us talking about things. So when people would come in, especially new people, they'd say things like, "Oh, what's your... what is the story of your background? Like, what is a Warplet? What is the Molé meme?

[00:07:26] What is Wow Wow? What sort of projects were launched when?" Like, people don't have that context. So everyone would tag us and say, "Adrienne and Prof, answer that." But, like, I'm old and I have no memory. I'm like, "I don't remember," but we have that content. It sits in YouTube videos, also Spotify, X, wherever. Um, we also have them as NFTs, and they were on, uh, multiple platforms.

[00:07:47] But you couldn't search it because video is not, like, an inherently searchable. So if you think about, like, the way you search on, on Farcaster or X or Google, like, it's all text-based, and we didn't have [00:08:00] text to search. Um- So that was a frustrating point. And it never occurred to me to build search for history.

[00:08:08] Like, it never occurred to me, like, you could search through it. It was just one of those things that I was like, "Oh, well." Like, I, I knew there was something there, I just didn't know what the solution was. So the way Warp became to be, like, the big aha moment was, it was late 2024, and if you were active on the network at that point, you'll know what I'm talking about, and it was the moment that AI bots exploded on Farcaster.

[00:08:31] Um, and when I say AI bots, we really called them agents for the first time. I think that was the first time we kind of shifted from, like, you have an AI bot. So if you're-- We used to have, like, um, there were bots on Farcaster, like the Reminded Me bot, which you could tag, or there might be ones that would do, like, one thing and one thing only.

[00:08:48] But these were, like, agents that they showed up as Farcaster accounts. We knew they were AI, so they weren't pretending to be human, but they were way more agentic, so they were transacting on chain. You could have [00:09:00] full-on conversations. Um, I don't know if you remember, Aethernet was, I think, the biggest one, uh, that came out, and, and I believe this was, like, because they were built on...

[00:09:08] It was, like, a new anthropic model that came out that was way more conversational. Um, and the Eliza framework came out, so everyone was building agents. It was so cool at that moment, and now we take for granted, like, you know, you see the Clankers and the Nay-Nars on the feed being f- and Bracky being, like, full, having full personalities.

[00:09:27] But back then, I just, I thought it was so cool, and I just had so much FOMO, and I'm like, "I want a bot." GM Farcaster needs a bot, and I had no idea how to build it. At the time, I wasn't, like, an active developer. Um, but I just remember thinking, like, wouldn't it be cool if there was, like, a GM Farcaster-branded bot that knew everything we talked about?

[00:09:47] Like, you could ask the bot the question Um, and I think that's kind of one piece of advice I'd give people if you're thinking about building agents and you're new. Like, if you're a seasoned developer and you've got tons of confidence, like, go at it, do whatever you wanna [00:10:00] do. But if you're somewhat new, if you're new to Vibe coding, you wanna build a bot, um, what I think you should think about is, like, what is the one thing your bot can do that other bots aren't?

[00:10:09] Like, what your specialty's gonna be basically. Well said. Yeah, like, you can't compete. I was like, "I'm not gonna build Aethernet- Yeah. ... I have no idea how to build." But Aethernet doesn't know Jam Farcaster content. Yeah, how can you carve out your niche? Exactly. So, like, what is that? And, like, kinda focus on that.

[00:10:25] And, um, and I just remember casting, this is the other lesson, is like, I, you know, for better or worse, uh, I build in public. I cast a lot about- ... like, just, like, train of thoughts. Like, I think something and I cast it. So I probably casted, like, "Ooh, it'd be cool if I could build a bot. I have no idea how to do it."

[00:10:44] And someone who I knew from Farcaster, mutual follows, like, we're friendly, said like, "Yeah, you can do it. Like, you can do it." So I might have pinged him back, and he, you know, he jumped on a call with me and, and you'll see that a lot in Farcaster, people, like, are pretty [00:11:00] generous with their time. And we just kinda talked through...

[00:11:03] We, we spent 30 minutes, yeah, just kinda talked through, like, here's what, how to think about what a bot is. Here's what you would do for an MVP. Here's how you can make your, your episode searchable. And it was, like, just enough that I was like, okay. Oh, and it was also the time when he's like, "And also download Cursor and use AI for coding."

[00:11:18] Mm. That makes a big difference, I'm sure, using a different tool. Um, and this was over... I mean, this is now a year and a half ago, so, like, the AI coding agents have gotten so much better, but this was before Claude Code, before Codex. Um, Cursor had integrated AI. Uh, so kind of like he gave me some tools, he pointed me in the right direction, and it was enough to, to build an MVP.

[00:11:41] I love that. Toria mentioned here, "I've often, uh, thought about trying to build a bot for the Rise Up morning show similar to what you built, Adrian, but it seems daunting." And I would say, Toria, to that, um, just like Adrian said, uh, I think you just gotta... You just start somewhere and, and, and ask questions along the [00:12:00] way.

[00:12:00] Uh, both Adrian and I, I'm sure, would be happy for you to tag us. Uh, I would love to see it and I would love to help out in any way, shape or form. So I think, um, try it out and then ask questions. That, that's the best thing you can do. Yeah. And I think the best thing to think... It's just like create the bot.

[00:12:15] Build it in, in steps and iterations. So like think about what is the smallest thing you can do to get something live. So build a bot. Um, you said... I think you said, what was the morning show? It was, uh, Rise Up? Rise Up Morning Show. Okay. You build a bot, you call it the Rise Up Morning Show bot, give it a name, whatever.

[00:12:33] It can do nothing, but when someone tags it, it can say, you know, "Good morning. How is your day?" Like, it doesn't have to do anything, it just you, you get that, you know, round trip. I still remember- And then you add it ... the first time I made a calculator with code, right? It's this like it can be the most simple thing, but once you do it once, you realize you can do it and you just iterate on top of that, right?

[00:12:52] Yeah. Um, so Zaal, how are we doing on timing? Should I talk through kind of like what, like what the t- like what [00:13:00] is behind Warby from a technical perspective? I'd say let's send it, um, because I don't know. I think we'll just do questions as people come. Okay. I'd, I'd say. Yeah, let's rock through the 30 minutes and, um- Okay

[00:13:09] and if anyone has questions, just ask. So I'm gonna just explain for people who maybe are... I'm gonna assume this is kinda like vibe coding, new-ish to coding, but just maybe understands a little bit. But like conceptually, how do you think about what an AI agent is on Farcaster, um, and like the different components?

[00:13:27] So one, and I, I actually, I said one, but it's number two on my slide. But you actually need to create the Farcaster account. Like so... And I did this manually. Like you could, you could spin it up with code as well and use different APIs. I, I ended up trying to use the code and it was a pain in the ass. But I just went to farcaster.xyz.

[00:13:46] It said create a new account. I put in a new email address. You know, like I... And I was like, Warby. So and actually... Oh, I'm not logged in here, but like I can log in as Warby. It's not a agent, it's just an account. Yeah. But that's kinda like the shell. [00:14:00] Um, and then what you wanna do is you create a public facing API that will, um- That will get called anytime someone tags your bot.

[00:14:14] So the way it works is, um, y- like someone will cast on Farcaster and tag Warpy. I use Neynar Webhooks. They makes it really, really easy. They have a generous free tier now, um, where you basically say, "Hey, a Neynar dashboard. Anytime someone tags Warpy, what you do is you just call this API function," and that's what this is in the center.

[00:14:36] And all you have to do as a developer is expose an API. So then you... The, the API is just a contained, self-contained function that will execute whatever you tell it to do. So in this function... So for Warpy, what Warpy does is it reads your question, and it goes and searches in, in the MVP. It goes and searches through our transcripts of everything we've ever talked about.

[00:14:58] It formulates a reply. It uses [00:15:00] an LLM to generate the reply, and the last step of the API is it posts the reply back to Farcaster Um, and that's kind of... A- and that's simple I love it. It's, it's- Yeah ... it's so simple when you say it like that, right? Sometimes people have it in their head that there's so much going on, but when you break it down into the, the smallest simple step, right?

[00:15:23] Um, and what can you do? Make an account. You know, have it be able to reply, like we were saying, and, and, and all it taking is, is creating one API, exposed API. Looking at it like that, it, it makes it a lot less daunting. Yeah. And if, and I think if you wanna build in steps, like forget about AI agents. Like, don't have it do this agentic, do a million things, but just think of like, what is a bot you could do?

[00:15:46] So, you know, you could have something come in, um, and you could only respond to when you tag me and ask, "What time is it?" And, you know, like, it's the what time is it bot, and your code can just say, you [00:16:00] know, reply to Farcaster our current time, and that's all you have to do. And then you can start building in, okay, now how I'm gonna answer different types of questions.

[00:16:07] Um, the other thing that I'll, I'll just kinda share for people who maybe have media com- m- media or wanna, like, broadcast te- like, search through text. The, the piece that I had to understand, which I'd never done before, was, like, how do you do natural language search over tr- over video transcripts? So one, I had videos.

[00:16:23] How do you search through videos? You can't. So what I had to do was, one, just generate text transcripts for every episode. Yeah. This was easy to do with modern tooling and open source frameworks and APIs, but I used something called Deepgram, and I ran a utility that s- basically, like, scrapes through every video that I had and creates a text transcript.

[00:16:45] So now for every video I have, I've got a, um, text transcripts. In my MVP, they were just, like, in the code base as files. I later moved them to S3 in, in AWS. I later put some of them in a PostgreSQL [00:17:00] database. Like, but for the MVP it was just simple. Like, here's the text, it's integrated into the code base. I did it for 10 episodes at first just to test to see if you could do it.

[00:17:09] But now that you've got text transcripts, theoretically you can now search through them. Okay, so now I can search through the transcripts, but, um, the way you do natural language is with something called embeddings and a vector database. And what it is, it's, it's basically creating, like... Y- you're, you're putting numerical, uh, kind of numerical representation of all your text, um, and you put it in a vector database.

[00:17:33] You don't really need to know how to do this, all the super smart math- ... uh, physics, and E majors did this. You can just do open AI. Like, I use an OpenAI model that basically said, take this tre- text, store it as numerical embeddings- Oh ... put it into a vector database, and I used, um, is it, uh, Pinecone?

[00:17:54] Pinetree? Which one is it? I forget which one it is. Pinecone. Um, which- Pinetree is on, on Farcaster [00:18:00] if that's what it is. Okay, that's Pinecone, yeah. I'm posting, yeah. Um, and you put it in that database, so then when the text comes in... So when someone asks me a question, "Hey, Warpy, explain to me what, where the Warplet came from"- You just convert that text using the same embedding model.

[00:18:16] So you convert that to numbers, and you send it to your vector database and say, "Give me similar numbers." And it gives you similar numbers, but it comes back as transcript text. That's very cool. I'm not gonna lie, I'm not doing that, so that's good to know because, uh, I'm just doing a very basic search over everything, right?

[00:18:34] And just understanding the word to use, vector database, right? And go learn a little bit more about that, right? And that in and of itself is very helpful. Um, Tori was saying that she- And that's exactly what the guy told me. Zaal on the call. That's what I didn't know. Like, I didn't know... You know, I'd heard of embedding- The terminology

[00:18:52] but I didn't really understand. Okay, now I need to know, I need to store my plain text transcripts as vec- you know, in a vector database as embeddings. [00:19:00] Mm-hmm. Okay, now, um... And then the way the LLM call works is ultimately if you want your agent to feel human, you don't hard code personality. You basically- Yeah

[00:19:10] hand it over to an LLM prompt and you basically tell the LLM prompt, "Hey, you're Warpy. You're a bot on GM Farcaster. You know GM Farcaster. The user is asking this question," and you pass that in as context, "and you're gonna answer it giving, given this additional context or knowledge I'm giving you." So all the transcript snippets that came back from the vector search, I send that into the prompt as well.

[00:19:35] And then- That's cool ... and then the LLM just answers, and whatever the LLM answers is what gets written out. That's awesome. We had, uh, a question actually earlier, and I don't know if you'll know the answer to this, but um, but we can definitely talk about it. Has anyone used Neynar Studio and completed a bot or exported into a repo and continued?

[00:19:54] And I know both me and Adrian probably have less experience with Neynar Studio just because, um, [00:20:00] it's amazing for someone who's trying code out for the first time, but it can be a, a little bit limiting for someone who wants the full capacity of what you can do with- Mm-hmm ... with building with code. Um, but I do like that they changed, they changed it more recently in the last couple of months so that you can export all of the code, which is great.

[00:20:18] So you can start there, um, and then build it out after that if you, if you want to. So, um, that'd be my, my answer to you, Alpin. Um, and then, um, Alpin also said, "Building a mini app and did reach a limit with design, but also there will be an agent and just curious." So yeah, I'd say, like Adrian was saying earlier, build in public.

[00:20:37] That, that... What you just said, Adrian, is something that I've been loving about Farcaster the, the most, is just, like, sharing my daily updates of how I'm moving forward. And in that I've learnt so much because someone's like, "Wait, why aren't you doing this?" I'm like, "I, I don't know. Why should I be doing this?"

[00:20:54] Right? And then these conversations really flow into someone that might know just a [00:21:00] little bit more than you, giving you the right terminology to then go and attack it like you want to. Um, plus one to building in public. I, I, I search my casts for like Warby and building. Um, it used to be called GMFC 101 because I originally started-

[00:21:17] and I was like, oh my God, it was a whole history of like me struggling with things in public and, and getting answers. So, uh, definitely encourage you to keep doing that. Um, all right.

[00:21:34] So that was, like, V1 of... So, so late 2024, I started in, like, December. I probably launched it, like, the very, very basic MVP in December. And I was so proud of it. It was like birthing a baby. You like... It was so... And that was really, uh, one of the first projects I did as, like, a hands-on dev after taking, like, a 15-year hiatus from, um, doing hands-on stuff.

[00:21:59] But, um, [00:22:00] this is what you'll see. So, like, if you're new, like, a- and, and maybe we don't even need to go into this too far. You will launch something and it won't be everything, and that's okay. Like, you don't know what you're gonna struggle with until you do it. So, like, figure out what is the smallest, smallest MVP, which is minimal viable product.

[00:22:18] Like, the very smallest thing that you can get out just so you can have something. Then just start using it, play with it, and you figure out, like, what goes wrong, and then that's, that will dictate what you do next. Um, so I just had a whole bunch of major issues with our bot. Um, I think the... Probably the, the hardest one was, like, it was still...

[00:22:40] Like, it did one thing and one thing well, which is, like, it searched through our transcripts- Yeah ... for when we asked something. So if you asked it, "When is the next show?" Guess what it would do? Wouldn't, wouldn't give you a good answer or give you a past answer. W- right. It would, like, search through our transcripts for when we said-

[00:22:58] "When is the next show?" Oh, [00:23:00] yeah. Like, it, it... Or if it was like, "Hey, when's-" Oh, and this is... I was gonna, gonna say, this is a really interesting conversation about agents that I was having a short conversation with Chris yesterday about, like, when is it appropriate to build out another agent, right? When is it the right time to now say, "Hey, I want this agent, and we're gonna have Warpy just be the transcript guy"?

[00:23:24] And this agent, any time they know they have to go to the transcript, they're gonna go to Warpy now first instead of, you know... Now you have another layer on top of it, right? And it becomes a little bit more recursive. Um, but does that need to be a whole nother agent, right? Like, do we just need to, um, create the memory such that it's the same agent, but it understands where it is in the flow?

[00:23:45] And I think the beautiful part is this is an unsolved problem. So everyone that's out there trying things out is learning more and more, and there's no, like, one right answer. Yeah. And I think the way agents are going, which is, like, they used to be [00:24:00] kind of, like, purpose-built. Like, I did one or two things, or three things well.

[00:24:04] And they're now... Like, the new, the new paradigm is really- Instead of telling the agent, "Hey," kind of like, "Here are the things... Here, here's the one thing you can do, or two things," you basically give it a library of tools to use, or skills, and it goes into its own, what they call an agentic loop. So whereas before I even built Warby as, like, post MVP but before its newest incarnation, I was like, okay, people are asking different types of questions.

[00:24:33] Mm-hmm. So I used something called a workflow router pow- pattern. Gotcha. Which basically said- Mm ... hey, now you have three things. Call one of these three routes. But it still only went to one route, and that was it. So an agentic loop is just imagine a, like, almost like an infinite loop where you're saying, "This is the user's questions.

[00:24:52] These are the various tools you have. You're gonna go and ca- figure out which tool you think you should call, like, which makes most sense. You're gonna look at [00:25:00] the input, or the, or the output of that tool and decide whether that answered the question. If it didn't, you can call another tool." Yeah. So you're really letting it be way more agentic.

[00:25:08] You have to... Obviously, you'll put in some kind of, like, um, escape hatches. Like, you can do max five tool calls or 10 tool calls so it doesn't go on forever and, um. But that's what Warby is now, which is an agentic loop. So now instead of having to, like, go into the code and change the shape of the code, you just add an additional skill.

[00:25:27] So, like, Warby started with being able to search transcripts, but now he can search show summaries. Mm-hmm. And that's gonna be a different thing, because a summary will pull, like, what are the most important things. Yeah. It's more topic based. Um, it can do s- show listings, so that's like, how many times has Zaal been a guest is different than- Yeah

[00:25:46] when did I talk about Zaal? Yeah. Um, so that's kinda like metadata about the show. You're adding more parameters in that metadata- Yeah ... so it knows to... It knows more information and context, right? As opposed to just, like, a large text, text, text, [00:26:00] right? Mm-hmm. It has knowledge on the CEF. That's a new skill.

[00:26:04] Mm-hmm. Hey, by the way, you have a new skill. You're aw- aware of the CEF, and here's the information you know. So it's just when it goes time to making... Warby becomes so much more self-improving, and I also told Warby he needs to improve himself. Yeah. So every answer he logs in a log. I haven't even reviewed the format of the log.

[00:26:19] It's in a l- you know, it doesn't matter. Yeah. Because now I tell him, "Go review your recent answers and see how well you did." And he judges himself, and then he'll make his own impr- like, he'll suggest his own improvements and update his own code. And when I say him, it's really Claude Code doing it, so.

[00:26:36] Yeah, no, I- Um- ... I love that. There's so many pieces to the recursive side of coding that is so much more powerful now that you can just do an infinite amount of simulations, essentially Um, so that's it. I share, um, and I know we're up on time in a few, I'll share these slides, so for people who wanna dig in further- Amazing, yes.

[00:26:54] Um- I'll pop it in the description too, um, which would be great Um, and then if people [00:27:00] want to, yeah, like you should, if you're watching this right now and you're on Farcaster, tag Warpy. It's, um- Mm. He's, it's... I call him Warpy, but it's Daddyy is his, uh... There he is. Um, it's WarpyDaddyy. So right now tag him and ask him a question and see if he answers.

[00:27:18] Um, but...

[00:27:23] I'm doing it right now as well. Sorry. I, uh, yeah. I, I'm pulling an Adrian. It's the best. Um- And, and I'll just show, like, uh, other Farcaster tools. Like, this is like a tool I have that I can cast as Warpy. I d- built this so that Nowtisprof and I can both use it. So GM... Oh, I shouldn't say that. I should say ZM.

[00:27:45] Yes. Super excited to be with Zaal. Are you in Eth or are you just Zaal? Nope, just Zaal. That's why I love Farcaster. It's my favorite social media because I have the @Zaal. Um, all right[00:28:00] 

[00:28:03] That's cool. What permissions- And- ... are you using for this? Like, what, um, secret variables do you need to cast as Warpy? I do the- Like, if someone wanted to copy this for their own account. Um, I created a signer using Neynar. Okay. So I was using Neynar tooling, but, um, you basically create a signer, so I'm logged in as Warpy on my phone and I approve it, and- Okay

[00:28:28] and then I get an, an ID, um, that I can cast with. So you and Nounishprov have to, uh, sign the signer once at the very beginning before using it, or just one of you guys? Just... No, it's just whoever... It's, it's actually the Warpy account, and that's who- Oh. Oh, okay. I see ... I approve. Yeah. But because it's a... Here, so there it is.

[00:28:47] So there's the cast. Nice. Um, but I built it as a UI, like, in our, in our admin tools. Mm-hmm. So that means anyone can now call that, who has access to our admin tools. Like, anyone can cast right now. Gotcha. Yeah. So I don't have to- [00:29:00] That's awesome ... like... Yeah, if you're looking to share an account- You don't have to redo it.

[00:29:02] Yeah. That's cool ... you don't wanna share, like, a seed phrase. Like, you can kind of- Yeah ... abstract it away. I love it. Um, so yeah. Amazing. We got a couple people saying they really appreciate this. Alpen said, "I really appreciate this, but I have imposter syndrome, but building Fitcaster and will build in public."

[00:29:23] And then Arjun, shout out Arjun, appreciate you for coming in, asked, "What's Fitcaster?" And that's where we're at currently. So I would love to hear, um, Alpen, feel free to, you know, tag us on the timeline. Let's, uh... I love the building in public energy. It's, uh, my favorite thing. Like, I, I love the idea of not being, not feeling like before you post something, it's perfect.

[00:29:46] I think that is, like, the biggest challenge entrepreneurs, musicians, artists, all people, like, have to get through at some point, is, like, understanding that some imperfect things just need to go out there, because otherwise you're never gonna submit it. Mm-hmm. [00:30:00] Awesome. Well, Adrian, do you wanna share how people can get in touch with you if they wanna reach out?

[00:30:06] Um, @Adrian on Farcaster, @Ageshalman on Twitter, X. Um, I guess that's the best way. Follow GM Farcaster everywhere as well. Yes. And, um- Amazing. Definitely- Yeah ... uh, check out the, check out the podcast. I have been, uh, an avid listener dash viewer since I started, because for me, it's my, uh, ability to capture all of the news that I might not hit on the timeline all in one place, uh, which is really helpful, and if I miss it, I can always tag Warpy and ask Oh, we got one last question before we go from Arjun.

[00:30:44] Uh, "Do you need a specific Warpy account for the Neynar signer, or can you do that from your own account?" I bel- And, uh, yes, to cast as Warpy you need a Warpy signer. To cast as yourself, like, I, I, uh, yeah, I'm not... [00:31:00] I don't know if I understand the question, but, like, I- if I wanted to automate casts as me, I would need my own signer.

[00:31:05] Like, it's, it's specific to the bot account. Yeah. Feel free to tag, uh, us in the timeline with more questions, Arjun, on that specifically, and we'll try and sort it out. Awesome. Well, I appreciate everyone who came in. Thank you so much, Adrian, for sharing. This was really helpful for me, and I, I, I know the rest of our community, so, uh, appreciate your time, and thanks everyone for popping in.

[00:31:33] Okay, just to answer Arjun's question, and I gotta go. On the Neynar side, no, I'm logged in as m- like, it's my Neynar account. I can add signers for, like, a billion bot- as many infinite bots through my own Neynar account. I think that was the question. And Zaal, I'll just reiterate what you said. Um, and also, like, every single person in the world has imposter syndrome out there.

[00:31:53] Yeah. Everybody started from, like, nothing. Everybody appears smarter than they are and more [00:32:00] capable than they actually are, and all inside and, um... And the best thing is, like, yeah, share, share your learnings, build in public. Everyone's... It's, this is all new. Like, it's not like we've been building agents. Uh, you know, your grandfather wasn't building agents.

[00:32:12] You didn't come- ... from a long line. Like, your last name isn't Agent, Agentson, so- ... have, have fun and, and don't be worried about looking stupid in public, 'cause I do it every day. I love that. And also, like, that's the beauty of Farcaster. I find that, uh, my, my build in public posts on Farcaster end up doing a lot better than the build in public posts on other platforms, so it's the beautiful part about building on Farcaster is it's, uh, a good environment for that as well.

[00:32:39] So, awesome. So it looks like you an- answered Arjun's question. Um, appreciate you for coming in, Arjun, and thank you again, Adrian. All right. My pleasure. We'll see y'all soon. Good luck everyone. Peace.

[00:32:50] ZAO keep it a Zali. From ZaoDao come proper. We eat rappers for lunch and if some left, we eat 'em for supper. I keep it a ZAO, homie a Zali. Heard the [00:33:00] streets calling E-3. Iron Man to a Simonz. Now the whole world hear about me