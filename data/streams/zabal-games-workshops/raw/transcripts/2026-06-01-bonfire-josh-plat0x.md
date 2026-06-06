---
title: ZABAL Gamez Workshop 2 - Bonfire and the ZABAL Bonfire bot
show: ZABAL Gamez Workshops
episode: 2
guest: Joshua.eth and Plat0x (Carlos)
guest_links:
  - "farcaster: joshua.eth"
  - "twitter: at0x_eth"
host: Zaal
date: 2026-06-01T00:00:00.000Z
format: video-livestream-workshop
thumbnail: /assets/workshops/2026-06-01-bonfire-josh-plat0x.png
language: en
track: builder
topics:
  - bonfire
  - knowledge-graph
  - shared-memory
  - agents
  - curation
  - hackathons
  - llm-cost
  - farcaster
entities:
  orgs:
    - Bonfire
    - The ZAO
  people:
    - Joshua.eth
    - Plat0x (Carlos)
    - Zaal
  projects:
    - ZABAL Bonfire bot
    - ZABAL Gamez
    - WaveWarz
    - POIDH
links:
  - label: Bonfire
    url: https://bonfires.ai
youtube: PENDING_UPLOAD
source:
  capture: live workshop recording, auto-transcript with proper nouns corrected
summary: |
  Day 1, builder track, second session. Joshua.eth and Plat0x (Carlos) introduce Bonfire -
  a shared AI workspace where a group shares agents and, in the process of using them, grows
  a shared memory (a knowledge graph) that becomes a collective, ownable asset. They frame
  the data-loss problem (most of what is said at a conference or in a community is lost or
  siloed), the shift from software-as-a-service to curation as the last scarce asset, and a
  vision for hackathons where projects are interoperable by design - one protocol with a
  hundred features instead of a hundred isolated proofs of concept. Carlos demos the live
  ZABAL Bonfire bot, and they talk read agents, async teamwork, and the cost of LLM indexing.
status: cleaned
---

## Key points

- Bonfire is a shared AI workspace: a group shares agents and, in the process of using them
  (research, tasks, games), grows a shared memory - a knowledge graph that becomes a
  collective asset the group can leverage, share, and earn from.
- The data-loss problem: at a conference or in a community, most of what is said is lost or
  siloed to whoever heard it. Bonfire turns it into a living artifact that grows over time.
- For ZABAL Gamez: anyone who joins mid-season can get caught up fast, and the graph keeps
  growing year over year (who built what, who won, what happened).
- A vision for hackathons: coordinate participants so projects are interoperable by design -
  one protocol with a hundred features instead of a hundred isolated proofs of concept.
- The ZABAL Bonfire bot is live and queryable; read agents can watch it and notify people
  when relevant data is pushed, enabling clean async teamwork across time zones.
- Curation is the last scarce asset: anyone can build the same calendar app, but curated
  taste and structured knowledge stay unique, and curators can be owners who earn from it.
- The hard problem is cost: LLM-based indexing is expensive, so Bonfire is exploring
  language and grammar to index far more cheaply.
- Find Plat0x (Carlos) at at0x.eth and Bonfire at bonfires.ai.

## Transcript

[00:00:00] Visit zabalgamez.com. That's Z-A-B-A-L gamez.com and sign up. Decentralized energy. Let's talk about ways Welcome, welcome, welcome everybody. We are back for our second ZABAL Gamez workshop on day one. I got Joshua and, um, Plat0x. How do you pronounce- Carlos. Uh- It's like Plat0x. Oh, okay. Like Plat0x. Plat0x. You can go ahead. All right. I got Carlos and Josh here with me.

[00:00:30] How are you guys doing today? Good. Doing good, thank you, mate. Good. Doing good. Yeah, I'm super excited. I think there's gonna be a lot we can chat about with Bonfires, but, um, Josh, do you... If you wanna give, um, a quick intro on what Bonfires is, and then we can kick it over to Carlos to also give an intro, and then we can chat a little bit more, um, you know, about how I learned about Bonfires and what we might be able to do here in the ZABAL Gamez.

[00:00:56] Yes. Amazing. Thank you so much for, for inviting us, and thank you so [00:01:00] much for your support in using the platform. I can't wait to see how ZABAL Gamez is gonna unfold. Um, yeah, so Bonfires is an emerging movement, an emerging product. Uh, not to overstate it, but we're trying to do some really awesome things here.

[00:01:14] And essentially what Bonfire is, is a shared AI workspace. It's a place for you and a group of people to share an AI, an agent, a bunch of agents, and do cool things with those agents. And in the process of doing things with your agents, like research, playing games, you know, interacting with each other, learning more, uh, handling tasks for you.

[00:01:35] In the process of doing all that, it creates what we call a shared memory. It's essentially a knowledge graph or a series of structured data that grows as you use it. So you and your group of people, you use this AI to do things to improve your life, to make things easier, to make money, and in the process, you're growing this shared memory.

[00:01:55] And then that memory becomes the core of your collective, [00:02:00] and actually becomes an asset that you can leverage. You can earn money from using it. You can share it with others. You can use other agents. You can sort of grow your community with it, and it all revolves around, like, collectively using that, that, that AI system to create this new memory.

[00:02:14] And so I'm sure you're gonna find some great use cases with it, with ZABAL Gamez. I know you've already been doing some great things with the WaveWarz ...., and I know that Carlos is probably gonna blow you guys' minds with what's possible with the shared memory. Yeah, a million percent. Thank you for giving that, uh, intro.

[00:02:33] I think it's really cool. I, I got the opportunity to experience, um, Bonfires during the ... ETH Boulder presentation that you guys gave, and the, uh, ability to use it for the back end kind of for that conference, and that gave me a lot of ideas for what we could do with this. And, um, I've been chatting with Carlos over the last couple months, trying to find different ways that, uh, Bonfires fits into what we've been doing with The [00:03:00] ZAO and everything that we're doing, and this three-month buildathon seemed like the perfect place to start leveraging the use case of a shared knowledge graph.

[00:03:09] Up till this point, it's always been me, myself, uh, pushing data in, and I'm excited to now expand that to our community and all of the new people as well coming in who have questions, and, uh, this Bonfire bot, uh, may have better context than a traditional bot. So I don't know, Carlos, if you wanna tap into that a little bit more, give a quick intro about yourself.

[00:03:33] Yeah, for sure. Um, so I'm Carlos. I'm from Ecuador. And, um- So I've always really liked, like, big data and, like, large systems and stuff like that, and I've been d- doing, like, crypto-related stuff since 2020, uh, give or take. And I'm-- I've always been, like, super, like, enthused by, like, swarming and, like, what you [00:04:00] can do when you put yourself together with other people and that kind of behaviors.

[00:04:04] And I've been, like, working with AI now for, like, 10 years, um, in different capacities. And kind of like w- as agents started coming out, like, I was probably one of the first 0.1% of people who would, like, attempt vibe coding, like, way back in... Dude, like, ... ETH Boulder was in, like, 2023. Like, the very, like, very couple f- like, g- ChatGPTs that came out, I was already, like, vibe coding hard.

[00:04:36] And what got r- me really excited is, like, the ability for these things to kind of coordinate people and, and kind of like get this shared brain kind of experience. Um, and since, since around that time, we've been, like, workshopping with Josh in like... Like, we were w- talking about graphs, like, way be- before, like, anyone [00:05:00] was talking about graphs, uh, about context managing and, like, these, like, things that seemed kinda wild at the time.

[00:05:08] But as models have gotten better and, like, people are, like, putting more tokens through them, it's kinda gotten to a point where, like, it's, it's needed and, and, like, people already are starting to see, like, like, what's possible, you know? And that's kind of been, like, the main pursuit of Bonfires as a whole.

[00:05:27] Um, because to be honest, like, I'm... I mean, I really like the I mean, what people mostly are doing nowadays, and like you mentioned it, like as a single player experience with AI, uh, and kind of, I think a lot has been, okay, like let's try to do what we were doing before but with AI and like slap a AI sticker on top and kind of like call it a day.

[00:05:53] But I think there's like entirely new things that you can do. Like the ZABAL Gamez ... are just a great example of [00:06:00] like things that are now possible and like the outcomes are different because without a system like this, like there's this... And I, I like to conceptualize this as like a data loss problem.

[00:06:16] Like if you go to a conference, like, and that's what we were talking about in, in Boulder. Like, okay, you go there, you meet these people, you have these conversations, but what percentage of all the data that you're like moving is lost or like siloed to like that one person who, who heard about it or whatever.

[00:06:34] Um, and by creating these new type of experience where it's like now, now there's a digital artifact that kind of grows like a plant over time and, and kind of like the way it's going to end up like behaving depends a lot on, on the inputs, right? So, so it's kind of this new experience of like participating in cr- co-creating something and like not only like getting, [00:07:00] like, like being part of a story, you know?

[00:07:03] I think that's like, that's the core main thing that I feel people need to like be able to feel like you are part of something. Uh, and like also that's one of my big criticisms of like crypto where it's like right now crypto is a very like if you have cash you can play kind of game where it's like, "Oh, you have money?

[00:07:24] Yeah, go get yield." And that's like- Yeah ... the extent of crypto. But like for- It's a pay to win. The free to play part of it isn't really there at all. Yeah. And like there's been a lot of attempts at like monetizing Yapping and stuff, but it, it ends up being these like frivolous exercise and like there's no reward for like, for like craftsmanship and for depth and for like stuff that people really care about because we, we haven't really found a way to, to do that, you know?

[00:07:53] But like the, the, the idea is that with Bonfire .. you kind of can like get a bunch of people who like a given particular [00:08:00] topic, talk about it a bunch and then say like, "Hey, let's make a hackathon around this," and kind of everyone can like use it as a shilling point, you know? Like, like besides like you or me or like a cult of personality, which is all, all we have in crypto these days.

[00:08:17] Yeah, no, I think that's a super phenomenal way. One of the things I saw in Boulder was that exact thing that you said was the amount of data loss has always been something that's kinda interesting to me in a sense, less on the specific data loss side and more on like value lost, right? And, um, and that's always been an interesting thing to me as a person who's been working with on-chain musicians, where musicians as a whole, um, put in a lot of time, effort, and energy and value into their art, and in the traditional music industry have to, to get by, have to give away part of their value to different people, right?

[00:08:56] That are middlemen. And I think one of the really cool things about the value of [00:09:00] Web3 and the promise was that you could, um, remove all the middlemen, but all the people that came into on-chain music that I've seen from the 2021 bull run and, and beyond have mostly been doing the same practices from Web2 music- Right

[00:09:15] industry experiences. And now comes along vibe coding, and I think this is actually something that can change the game for independent artists because it is something that they can hand off some energy to. And in a s- instead of paying an individual, you spend tokens on an AI agent. That's a whole different ballgame because it's actually enabling you to learn about the, um, thing that you're working on.

[00:09:41] Or if you don't want to, you can that completely off, right- Right ... to an, to an agent. But I think the, that promise of like, okay, like it's possible to do like everything on your own wasn't really around. But now it, now that is manifesting to like, okay, now you just need to practice with these tools and get better at it, right?

[00:09:59] And [00:10:00] try these things out because it is now potentially possible to run the rest of your company other than the one thing- Right ... that you wanna do with agentic software, right? Yeah. And I think it goes even deeper than that in terms of... Because I, I honestly think that we as a society, like group of people, should be having like way more like revolutionary conversations in terms of like this changes the whole set of assumptions of how we build society.

[00:10:27] So like, and, and not even in a bad way. It doesn't even have to be in a bad way, you know? Like, like we've been existing in this like knowledge. Like, like we went from, um, goods and like from goods, from selling goods and, and added value to... Or, or like, you know, like the, the story of economics is like first you sold raw goods like minerals and stuff, and then there's, uh, like the Industrial Revolution, and then there's added value.

[00:10:56] But then we were in this phase of like soft [00:11:00] services as the main thing that you would sell, and especially like the main thing was like software as a service, right? Mm-hmm. And, and the thing is like I, I am of the people who think that software as a service is dead. Like there's no reason to like have- Like, like a multi-billionaire SaaS company anymore because- Yeah

[00:11:22] you can build your own, like, whatever, and, like, there's enough open source to build everything. Um, but what I do think that's going to be the, the last scarce asset basically is curation. And, like, knowledge, uh, structuring is something that I don't think is gonna go anywhere anytime soon because that's the only thing that remains, like, unique and fractal.

[00:11:47] Because, like, you and me could go build a calendar app and, like, it's going to end up being the pretty much the same calendar app. But if you and me go and curate music, it's going to be entirely unique [00:12:00] based on my taste of music and your taste of music. So it depends on the market, like, whose taste of music is more valuable, but both have some intrinsic value.

[00:12:10] And especially if you aggregate with other people who share your ta- taste of music, you can create, like, these huge, like, value aggregations that are the service rather than the software. So, like, everyone who participates in the curation of, of these data structures is an owner and therefore, like, earns some revenue on the use of that information.

[00:12:32] So that, I mean, that flips entirely what we're even doing out here because, like, you don't no longer have to, like, make a startup to sell some software to, to get rich, but rather, like, start getting these huge curations of, like, what's the biggest coherence swath of knowledge that I can sell to people? Oh, you're muted.

[00:12:53] I can't hear you anymore

[00:12:58] Technical issues [00:13:00] If it, if it's, if it doesn't get fixed, I'll break into a song. Can you hear me okay now? Yeah, yeah. Okay. I was fixing my camera and I, uh, I had to re-mic the mic. But I think, uh, that's a really cool way of looking at it. It's not something I had actually seen before. When you look at like basic utilities, um, anyone can make something that's similar.

[00:13:19] But then when you create something that's subjective and you take all of that together, that could be so different from person to person. But there's a group of individuals somewhere out there that take into that same preference, and that can be really interesting when you start to now aggregate similar types of taste together, right?

[00:13:41] Mm-hmm. And you are able to niche down in this, let's say, um, you know, folk tape or pop taste, right? And that's, uh, a really interesting concept that I hadn't been thinking about much before. But I think one of the super valuable things for the ZABAL Gamez here is the, um, the, the loss of information [00:14:00] but then the also ability to retr- retrieve information.

[00:14:03] Mm-hmm. At any point someone could join during this 90 days, and I would like for them to be as caught up as they can be on current events. Right. This is a really powerful tool to help do that. Yeah. And also even next year, like if you do s- like a yearly ZABAL Gamez, like it's a thing that grows over time.

[00:14:21] So like one interesting thing is like instead of doing the same projects over and over, like next year people will know who won, like what kind of things happened. And then... And, and one of the, one of the things that I like, I would like to see in the future is this idea of if you think a, a hackathon nowadays, like they are like, um...

[00:14:44] If you think about them in terms of cells, they are like, uh, single-celled organisms where like each hackathon project gets their own unique thing, and then you suddenly have in a hackathon many people doing kind of the exact same project because that's the hot thing. Like, [00:15:00] like in Denver it was all x402 stuff and like, I mean, th- that didn't necessarily change the world, you know?

[00:15:08] It didn't make that big of an impact. But what if there was coordination in between people who are participating in a hackathon where like you have this data structure who, who is aware that, okay, like there's people working on this, there's people working on that. Let's m- l- I'm aware of like these data structure could also be a- aware of all the types and like data payloads and stuff.

[00:15:30] So by the end of the hackathon, what if 100% of the projects would be interoperable between each other? So instead of a hackathon creating 100 proof of concepts, you create one protocol that has 100 features, you know? And like, and, and this is like, but this comes from a shared question of like everyone who's participating, it has to agree on like, okay, what do we want to build as a whole?

[00:15:56] And how are we- Yeah ... what do I want to build as a- Like [00:16:00] a subsection of the thing No, that's cool. I like the idea of understanding who's working on what projects at the same time, right? So one of the things that I'm working on with the ZABAL Gamez is writing up the initial prompt that I'm gonna give at the beginning of July that's gonna essentially be an explanation of the Zabal eco- uh, the, the ZAO ecosystem, which includes the Zabal, right?

[00:16:24] And all of these different projects that some have been started and completed, some of them have been started and are in the middle of process. Some of them have, uh, been ideated about, right? Like, there's all these projects in different states, right? So I made a dash projects page to work on and improve that, and I think that can be a really powerful thing to what you were saying there, where it's a lot of people working on this one ecosystem and set of problems where no two people are doing the same thing.

[00:16:53] If they are, they're working together and using- Right ... those brain powers together, right? And I think the ability to do that [00:17:00] asynchronously can come from a tool like Bonfires. Yeah. And, and that's kind of like the, like the vision long term of like... And, and it takes a lot of like stakeholders to, to want to do that.

[00:17:12] And, and we kind of discussed kind of like the early stages of that because, uh, the idea is that, and, and I think that in the future everyone's going to have their own agent. Like, I'm running my own, uh, like agent right now on, on the side, like, and basically everyone's gonna have some sort of agent doing something for them at some point.

[00:17:30] And the idea with Bonfires, and I was talking about this earlier, is like seeing Bonfires as like an orchestrator that can like, like you know that what you're saying in that Git commit or in that like message you're sending is being indexed in s- somewhere, that, that is being recorded and stuff, so that you're more willing to share.

[00:17:51] Uh, because I think that's one big issue with... And especially now that we're all producing more data, uh, the, the issue is like if no one's reading [00:18:00] this data, like what, what good is it to like do very detailed documentation and stuff? Um, you know, and there's a lot of lost, like double work more than anything.

[00:18:11] Yeah, for sure. So this currently is locked, so we have a Telegram if anyone is interested in joining and participating in using the Bonfires. Shoot me a DM, we'll add you up to the Telegram, and you can, um, prompt and ask it questions. But I'm gonna ask it here: What do you know about the ZABAL Gamez? And you can essentially be able to query it here.

[00:18:38] You can actually see a little bit of, um, this recent query of the ZABAL Gamez, what it learned. Um, so this is a lot of similar stuff that's on the website here where we can quickly go through it. Um, but it's currently working on ingesting the current state of the knowledge graph. But I think there's a lot of powerful things we can do here, and I'm excited to get other...

[00:18:59] We have, [00:19:00] um- two agents right now connected to it. I'm excited to get other people's read agents on board to watch this so that maybe when they get something interest- when someone pushes something interesting to it, they immediately are getting notified and pinged if it's related to them. So let's say two people are working on a project together, and one is in one time zone and the other is halfway across the world.

[00:19:24] Right. The ability for me to say, "Okay, you know, in this Git commit at the end of my project, this, these... Document it well so that my teammate can continue off here," and you essentially send that, and the ability for their AI to see that and then read all those files and pr- pre-prepare that, you know, for that individual before they wake up could be a powerful way of working together, right?

[00:19:49] And it's un- it wasn't ever, ever available to be so clean asynchronous with zero friction, and I think that's one of the things you guys have solved, which is really [00:20:00] cool. Yeah, and it's, it's actually like a, it's a super complex problem. Um, and there's like so many domains and stuff that, that you can like tool and tune.

[00:20:14] Uh, the, the cool thing that we're... As a sneak, we talked about this earlier, uh, I've been working a lot in... Because as you, as you may know, if everyone's doing this, at some point it becomes like a lot of data to parse, right? Mm-hmm. And I think that's one of the, w- like one of the conversations that's coming up to the forefront a lot, it's taking shape a lot more in the recent months.

[00:20:39] Um, but the cost of LLMs is something that people are going to have to reckon with. Uh, and right now we're in a very Like we're learning that it's expensive right now. Like Uber spent all their budget for, for a year in tokens in four months and stuff. [00:21:00] And once you get into the problem, it's like, okay, I have too big of a context, I need to summarize it.

[00:21:06] Mm-hmm. But summarization is expensive as well. Uh, and if you want to do like, uh, like, like the most of the state-of-the-art of, of this kind of thing is just throwing an LLM at it and having it extract a graph, which is what we do right now, uh, basically. But what I've been exploring is this idea of using like language and grammar to, uh, parse it on a natural way so that y- like the idea is that we're going to be able to do this indexing process basically for free, which allows you to like store a lot more information because it then becomes a problem about like the compute time and the storage, but, but not about the LLM expense, which is like burning fuel these days.

[00:21:52] So- Yeah. That's a primary problem in AI coding, right? Is token usage. Yeah. Yeah, and like when you get to harder problems [00:22:00] like, uh, like judging a hackathon with 1,000 applicants, like the amount of tokens that you spend just for that one thing ends up being thousands and thousands of dollars. So like any way that you can like compress that, uh, is, is, you know, is a huge saving.

[00:22:17] So like that's kind of like what we are working on at Bonfires right now, how to make that process kind of s- like seamless and, and something that you can build on with. So, um, and that's also what I'm excited to talk about in some, maybe some other, um, days about like the kinds of apps that you can do with memory systems.

[00:22:39] Like it kind of changes the... Much like with the economics of it, it also changes the design surface of the app and like, uh, like, like the mold book sa- example is very good in, in terms of like what you really want to build is a server and then the agentic interaction is, is going to be [00:23:00] mostly like through, through those interfaces.

[00:23:03] Mm-hmm. So like the, the role of the, of the front end changes because it now it's not the primary interaction place, but rather maybe some- somewhere you go to find more information or, you know- And, and even the way that you make an interface changes. Uh, so like there's a lot of cool levers, and I think it's a, it's a very fruitful conversation to have these days because now we're writing code.

[00:23:32] So like- Yeah, giving the context and ability to more people is always super helpful. So thank you, Carlos. Uh, I think that was an awesome first session. We definitely will have to dive deeper into the ZABAL Bonfire, but then also what else is capable here. Maybe we'll do a build, um, of something on top of the Bonfire during a session and, and that could be cool to watch your workflow of how you use your tools, because I think- Yeah

[00:23:59] that can [00:24:00] always be super powerful. That'd be awesome. Like I'm, I'm up for a challenge. I need to think up of something. Exactly. Maybe we can make a little magic 8-ball. Awesome. I love it. Yeah. And then it'll tell you a project to work on. Right. Right. Perfect. Yeah. No, one of the ideas I've also had is potentially a bot where because the, the logo is insert coin, um, putting, but you can kinda choose between one and 100 billion, a billion, whatever, however many tokens you wanna put in, and it can give you something based on that, whether it's a additional piece of information, whether we put a bunch of NFTs with different rarities in a, you know, a pool and it just picks from that.

[00:24:40] I think there could be some cool things that we could do. Yeah. I, I think it could be cool to make like a bounty system as well. So like if people have coins- For sure ... they can use them to like bounty. Like maybe you're making a project and you want someone to make an extra feature, but you know- I like that.

[00:24:54] Yes. You know? Okay. Cool. So you could put up an open, an open, uh, bount- Yeah, [00:25:00] honestly, you could even do it with POIDH, which is really cool, which is one- Mm-hmm ... of the tools we're using. So, um, yeah, I think a lot of awesome ideas. I'm excited to brainstorm it more. Thank you so much, Carlos. Of course. Do you wanna share where people can find you?

[00:25:12] Uh, yeah. I'm on Twitter .. @plat0x_ at0x.eth. Uh, and you can find us in, in bonfires.ai. Um, we are raising, so if you wanna get rich, like just call. It's a good opportunity. Uh, so yeah. Thanks for having me, and let's, let's have another one soon. Awesome. Thank you, Carlos. Have a good 

[00:25:35] Zaal keep it a Zaali. From the Zaal down come proper. We eat rappers for lunch and if some left, we eat 'em for supper. I keep it a Zaal, homie a Zaali. Heard the streets calling E3. I man to a sign mans. Now the whole world hear about me
