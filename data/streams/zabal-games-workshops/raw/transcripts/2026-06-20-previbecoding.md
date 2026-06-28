---
title: ZABAL GAMEZ Workshop w/Ali Tiknazoglu
show: ZABAL Gamez Workshops
presenter: Ali Tiknazoglu @alitiknazoglu
date: 2026-06-20T00:00:00.000Z
format: Live talk plus Q and A, recorded
language: en
track: builder
topics: [AI coding, Vibe coding, Learning to code, AI tooling, Building]
---

[00:00:00] Visit zabal games.com. That's Z-A-B-A-L games.com and sign up Decentralized energy. Let's talk about ways welcome back to another Zabal Gamez workshop. Today, I'm here with Ali. How are you doing today, Ali? Thanks so much, man. It's so good to be back to you. Dude, it's amazing to have you back in the building. We had a short, uh, uh, Better Calls, All Yaps episode, if anyone wants to take a look at it, get a little bit more background on Ali here, um, about some of the things he's done.

[00:00:35] Um, I'm very excited to have you here for- Yeah ... our, uh, pre-co- pre-Vibe coding workshop. I think there's a lot of things we'll touch on today that can be really valuable for a person that's not necessarily used to creating code or creating systems around code and software, and I think that's very valuable, especially for an individual like me who has, um, seen some of it, uh, through my electrical engineering [00:01:00] backend, but not really built it myself and executed and tried it out.

[00:01:04] So, um, yeah, thank you for, for being here. How are you doing today? Yeah. It's all good, man. Just recently moved to a new studio, so that's why. Actually yesterday. I'm a little bit tired, but I'm okay. I love it. I love it. Well, I'll pull up this presentation and let you get started, and excited to hear what you got.

[00:01:22] All right. Perfect. So guys, first of all, welcome to this, um, this today's workshop. I'm Ali. Uh, some of you guys know me as the orange man, so that's why I just wanted to put some orange to this presentation still. So, uh, previously, uh, I worked at a company called Favor for two years. I got my whole knowhow to during that time, because I have three social media.

[00:01:44] It was merging Lens Protocol and Farcaster at the same time. After that, uh, I, I applied more than 180 jobs and I guess no one didn't hire me, and then I built my own consulting company, and then I started to consult my freelance projects and about the both product and product marketing. [00:02:00] So meanwhile, last year I started to build Influence, which m- many guys you know from Farcaster time.

[00:02:05] So Fa- if you know it from through you, you... If, if you are using Farcaster, you, you definitely know through just orange keys and other stuff. And Influence was, um, first my share on the Farcaster. We did a great job. We won the Base Batch, uh, Base, uh, Onchain Summer award, and we, we were selected for Base Batch two.

[00:02:26] Uh, I went to Argentina, pitched Influence. Unfortunately, the, the market condition was not good, and we, we did amazing job. We distributed tons of the money to creators in a this automated and, uh, way with algorithms. So recently, in couple of months ago, we just shut down. Now I'm just exploring the Vibe coding actually.

[00:02:45] Today we will talk about that. And I see most of the people is actually suffering and ha- having some pains and when, how... They, them, they don't know how the, how they should do or where they should start. So- [00:03:00] Uh, Zaal, just did you share on social also? I guess yes. Let me just quote it first, then I think we can go.

[00:03:09] Awesome. Sounds great. No, I'm excited. I think there's so many pieces to, uh, learning how to build, uh, with AI automation or AI assistance and how to leverage it in a different way. 'Cause whether you're a completely experienced software engineer or a person that's completely new to it, you have a completely different perspective and a different- Yeah

[00:03:30] creativity to bring to it. So I think it's, uh, it's all about learning the best way to communicate in your way with it, and I think having some very basic foundations of workflows that o- other people have found successful is a very powerful way to learn. Yeah. Perfect. Exactly. And thanks so much for having me, by the way.

[00:03:48] So, and I, I'm pretty sure... I hope people will love it, and, uh, just in Asia, I just learned something, lower the expectation, you will be happier. So I hope you will enjoy the presentation. [00:04:00] Shall we start? Go for it. Amazing. Okay. Perfect. So quick warning before we start, this is not a coding workshop. If you're expecting, it is not about that.

[00:04:09] So we will discuss about how to think, not how to write code, okay? So the topic is think part, because the think part is what nobody actually talking. So it's the part that actually determines if your app gets built or while live coding, you will not get a proper result and give up in just a few days or maybe two weeks.

[00:04:30] Uh, today, agenda, we have six topics. All right? We will define live coding, talk about the why domain expertise beats any tutorial, a breakdown what data product actually is, and then we will go through a mistakes everyone makes, and then how we can just flip it. And, and it's out of topic, but it's part of the topic of live coding, kinda it's a mix it, but for me, but I, I wanted to mention.

[00:04:54] I wanna mention about the builder mindset, and then I will give you a live demo at the end of the, uh, [00:05:00] presentation by opening, by sharing my screen. All right, let's go. Let's start with, uh, what vibe coding is not. As you know, this, this meme became popular. So whenever there is a new model, LLM model, everyone just saying, for example, Fabul or just Opus 4.8.

[00:05:17] So people just sharing a screen and just saying, "Build me a one m- a $1 million SaaS and make no mistakes." But actually, this, this became something, uh, people is, uh, you know, just now it, it's, it's out of a meme right now. People just get stuck with the AI, so they are keep building the same thing because they're trying to build something they don't know, which actually means AI is just copy-pasting whatever AI knows.

[00:05:47] We will come that part. So what is a vibe coding, actually? It's simply you describe, AI builds. But is it that much simple for describe part? We will discuss. [00:06:00] Whichever language you speak, it doesn't matter, Turkish, English, Spanish, uh, you talk with the LLM model, and then it builds for you. No synta-no syntax, no computer science degree required.

[00:06:11] So in which no syntax means you don't need to memorize the grammar of the, that, that programming language. You just describe what you want in plain language, and AI handles the technical part for you. And for tool, you can use Claude, Codex, Cursor, Lovable, and they made the execution part almost free and cheap, I would say.

[00:06:33] But the... I want just, just want to remember, make sure e-everyone should, should remember these sentences, uh, until the workshop, uh, is done. So the bottleneck is never AI. It's the, it's the us, so not knowing what we want. So but how we will know what we want? So if bottle- bottleneck is us, um, how, how we will know what we want?

[00:06:58] To explain it, I want to give an [00:07:00] example because that's best way to explain the things in a clear, clear path. Imagine, so Zaal, actually this is for you. Imagine I ask you to create a presentation about a building from an architectural perspective. Just analyze the building in architectural perspective and, and, and in different details.

[00:07:19] So I'm pretty sure you can do it with AI, right? So you can just upload the pictures. AI can do everything, and it ca- it will make a great... It will prepare, it will prepare a perfect presentation. But can you stand up and defend it? Can you just really present it? Yeah, no, I think that's such a great question.

[00:07:39] On some of them for sure, on others definitely not, which is a challenge because- Yeah ... it, it works. But if I wanna iterate on it further than a product that works, something that I tested and worked up as a solve for a solution, a, a challenge I have today- Yeah ... it works. But if I would want to productize that or [00:08:00] leverage it for other folks, it might not scale at that same level- Yeah

[00:08:04] because I don't have that, uh, expertise of how the backend architecture works of the actual product. Yeah. Yeah. Exactly. Th- th- something like that. That's why we call it domain expertise, which, which means actually know how. So, uh, it's actually confidently just I can say that mostly most of the people can't just present that kind of architectural presentation, uh, in a, in a, in a confidently.

[00:08:29] Why? Because it's outside your know how, and that's the just core point. If you have no idea, you can't think. If you can't think, you can't talk. If you can't talk, you can't define. And if you can't define, you can't actually build. Yes, you can build, but it will not be yours. I will come that part later. So another example I wanna give.

[00:08:49] All of us can drive, right? Every- ev- everyone is driving mostly And most of us can change simple, do simple things: changing oil, top up [00:09:00] water, cleaning water, blah, blah. So but ask someone to change a spark plug. Most people don't know how, and if you try without knowing, you will damage the car, 99%. Even if you, if you do know how to do it, without the right tools, you still can't do it.

[00:09:17] It's the same with AI, actually, same with the vibe coding. Fundamentals still matter. If you skip them, everything after is just guesswork or you are just, you are not owning the, that core product. So AI is owning the product, and you are just mimicking. So what is actually a product? When we say product, we are talking about anything that repeatedly gives the value add to user, but mostly there is a misunderstanding.

[00:09:45] Value doesn't have to be functional. Uh, think about the games. A game doesn't, uh, fix a functional problem. It solves the boredom. It gives you fun, achievement, and then a sense of a progress, right? That's a still a product. [00:10:00] It's just an emotional and, and, and a social one instead of just functional one. So everyone fixes...

[00:10:06] Uh, not every product actually fixes a pain. Some just deliver joy. If you only think in the terms of function, we will miss the what makes people actually love something, right? So that's why product actually has three dimension. It can be functional. It can be emotional. It can be something social. We can just connect with it.

[00:10:25] But the product has three lenses. So this is the how I see always, not just me, but overall general. Uh, who's the user? What is the problem? And what value I'm actually giving them? If you miss one of these, and the product us- usually falls apart, and we are not talking about the becoming a 1 billion user or whatever.

[00:10:45] We are talking about the startup kind of a cultural program. So it's a, like a, you are just, let's say just launched something. You are getting your first 100 user then first 1,000 users. So the great products actually happens exactly [00:11:00] where all of three overlaps, which actually means there's a product market fit.

[00:11:05] I wanna give an example, so two example, actually. One of them is the headphones. Uh, you wanna listen to music on a, on a bus, okay, in a public, i- in the subway or... But you can't bother the people around you. That's a real problem, right? And the, that headphones solve it. Simple Or something as a small, a, as a pen cap.

[00:11:25] So without the cap, the ink will dry and, and it will leak around, it'll make the around dirty, leave marks everywhere. So that tiny piece of plastic actually solving, uh, a real specific problem. That's what a good product thinking looks like even at a small scale. And I know these examples are just the physical products, but the product, you know, both product can be both digital and p- physical.

[00:11:53] We will focus the digital part, but we need to understand this first how it looks like. So [00:12:00] products don't start perfect. They evolve with the people, and the tools evolve. But the job, main job never change, okay? To give you an example, I want to show you just, uh, these ... Y- you see these three pictures. The pe- humanity just wanted to just, you know, store information.

[00:12:21] So first we use the cave wall, then stone, then parchment, and then paper, and now mobile apps or just computers. Completely different technology every time, but we need a s- we, we have same need, right? Same function, recording an idea, sharing an idea with others. In the first time, we were recording. In the second time, we were making it durable by just doing it, uh, for stone.

[00:12:47] But then we realized we couldn't move it together with us because we are just moving another country, another place. And then we make it portable. That's a progress, and that's the lesson. Instead of chasing the trend, chase [00:13:00] the job, yeah. Job means actually core function. Your tech stack will change 10 times over, over, over the

[00:13:06] when, when you are building a product. But users need mostly not. It, it may, it may change compared to, for example, if you compare to 20 years ago, people were not needing, you know, headphones that much because there was, there were not that much a phone. But now people needs different things. So we need to adapt the tech, but, uh, we need to understand the core functions.

[00:13:29] It's totally different. I know everyone's just looking for how to provide code and how these things can help us. But without understanding the, at least, uh, 1% of the what a product means, we really, we are just, uh, swimming in the ocean in a blindly. So to understand ... To build something, actually, we need to understand anatomy.

[00:13:53] Before the looking anatomy, I wanna explain a few things for distribution of the a- an application. [00:14:00] So there are main, two main ways to ship an application, actually, to build an application. First is web app, second is a mobile app. And the mobile app, as you know, is there are two major operation system, is one of them is Android and other one is iOS.

[00:14:14] So you can build both web app and mobile app. You can just build for mobile app. It's up to you. Or you can just support both of them. So in this case, we will talk about web app because I highly recommend everyone if it's your worst, first time, don't do, don't deal with the, uh, web coding something for mobile.

[00:14:31] It's a really painful process and, and I highly recommend just go with web apps. It's super easy compared to mobile apps. Because mobile app, mobile app side has different problems compared to web app. So we, we need to understand the web app, okay, how it looks like. I'll... I know everyone is looking, uh, the, the, the tons of websites, right, every day.

[00:14:58] But did you re- did you realize there [00:15:00] are com- common things? So what kind of a common things there are? So we, we need to understand that, okay? So at home it means a domain, actually. You see a domain, blahblah.com, blahblah.xyz, blahblah.ai, .org. So then we have a... the header. Header means actually a logo mostly on the top left, and the top right there is a call to action.

[00:15:25] And open the app or just book a call or whatever you have. And then a big text, uh, we call it a hero section, the... your core value proposal in one, one sentence, it's one liner. And then this is a generic, uh, landing page. After that, your co- core app pages. When you open the app, there will be different things, uh, based on your requirements.

[00:15:47] If you're... if it's a game, maybe leaderboard. If this is a just simple, uh, landing page for your consulting company, then it's just a... there's no app, so it's just a simple static page. And then when you scroll [00:16:00] down, you will see a footer, which means actually the most of the, uh, boring informations, uh, actually.

[00:16:06] So Zaal, can I share the other screen to show actually a few example to people? Go for it. Let's do it. All right. Uh, wait. Stop sharing. I guess I need to res- reshare, right? Go for it. I think it's super valuable to understand how, uh... I definitely, uh, second the recommendation for building web app first, um, and then once you are happy with that, then look at how it looks on mobile and improve it for mobile, because that's much easier process than going the opposite way.

[00:16:41] Mm-hmm. And then also, um, understanding how traditional webpages are framed doesn't necessarily mean you're defined to that, but understanding what the basic... Oh, shoot. Um, sorry. Um, the basic, um, defining features of a basic web app that you normally see [00:17:00] every day, and how you can actually define the wording and the terminology of where- Yeah

[00:17:06] and what that is. 'Cause that's the biggest thing is once you understand the terminology, you can always ask, uh, AI to explain it more for you. Yeah. And I think that's, that's the beautiful benefit. Yeah, exactly. So now let's just look at the three different website, right? So all, all of us familiar with.

[00:17:23] Let's first is Base, second one is Aave, third one is Neynar. So when you open the first time base.org, you see a, what we call it? Header. So in the header, mostly in the top left part, there is a logo and of the company or project. In the top right part there is a call to action. Mo- if it is opening an app, it's opening a, an app.

[00:17:45] This is a Base official website. It's not a Base app official website. That's why it's forwarding you to their documents, because Base is a chain. So as you see, there's a big, uh, just hero section, and it says, "The blockchain for global finance," with a really, [00:18:00] uh, you know, big size input. So and then this is, uh, their call to action, their, their one-liner.

[00:18:08] What, what is Base? The blockchain for global finance. And then when you scroll down, there are s- lots of small details. Small details. And then you see something. This is a footer part. So they are hiding lots of technical and unrelated, uh, the un- less important things in here, including the socials. Because if you put everything here, it will become crowded, right?

[00:18:31] So you can't put it. So let's look at another example, Aave. Same. So there's a header, there is a hero section. It just, they one line release savings for everyone. Scroll down, there is a footer. So this is the actual main structure for all of the apps. All right? So let's look at the Lena as a last start.

[00:18:55] Same na- a header and the call to action login, [00:19:00] and build where users, your users are. They're just one-liner. They, it explains what is Lena actually. And then scroll down, you will see footer. So this is very important, and it's normal. You don't need to t- take care about these details mostly because actually, uh, so let me just stop.

[00:19:21] Okay. Because, uh, y- a, a normal person shouldn't care about these things until you start white coding. So if you, if you never worked with a product team, if you're never part of a technical team before, or if you never just joined a technical meeting for ticketing or whatever, it's normal. You don't, you don't need to understand these things.

[00:19:38] But these are the simple structure of a web app. Still, we don't talk about the think part, as you see. It's just the core fundamentals. So let me just continue by sharing my screen. Um, oops, I guess I clicked wrong. Presenter view. [00:20:00] All right. Let me just, uh... Okay, perfect Uh, do we see my screen? Yep. Okay, perfect.

[00:20:11] So now this is actually, uh, just how it looks like. Okay? So we will... the skeleton we will be filling once we start building. If we have an idea, we will come that part. So- We have some common mistakes when we are building, actually. We- the- that's very important to understand before thinking an idea. No ownership.

[00:20:39] So it, it means actually AI decide everything, uh, just you don't own it. It's because you didn't just shape it, you just said, uh, you just accepted what AI says. And if you don't own it, probably you can't sell it because you don't feel like, uh, ownership about that. So wrong [00:21:00] domain. We explained the domain is actually a know-how.

[00:21:03] Building somewhere you have no real context. Which is, by the way, perfect. Definitely you can do that. I'm not saying you can't do that. But if it is your first practices, I highly recommend just do how you feel comfortable. For example, what does it mean? People asking that too much. "Ali, what does it mean?

[00:21:17] What's my know-how? What's my domain?" So let's just think. You need to understand who you are and what you like, and so maybe you like games too much, okay? And or, or let's give a reverse example. You never played an FPS game before, and now you are saying me you will build an F- FPS game. Does it make sense?

[00:21:38] Mm, it, it doesn't make sense. Because you never tried the existing ones, all right? So that's a problem. So, uh, and, and let's just say, for example, you are a creator. You know the, uh, the, the pain point of creators. You can build a scheduling tool for yourself and then if you, if it, if it, if it really help, if it is really helpful for you, and then you can share this [00:22:00] tool with others by making as premium subscription, for example.

[00:22:03] And it's super simple, by the way. So it's not hard, just you need to think about what you, what's the problem you have experiencing or what others experiencing, and then do you have something, do you know have, do, do you have some knowhow about that topic? Do you really, uh, defend on the publicly say, "Guys, this is the problem.

[00:22:23] I, I know the problem, and I prepare the product for it. I build the product for it. And then now we can use, and then you can make y- the, that, that problem will gone and just for couple of dollar." So that's very important. Wrong domain means actually you will be bored in couple of days, and then you will feel like you are not moving, actually AI is not building.

[00:22:44] Maybe you are, y- you are not fit for that, okay? So all build MVP. That's one of the thing. Chasing perfection instead of shipping the core function. Mostly people is doing whenever they, you start the vibe coding, [00:23:00] uh, I want this, I want this, I want this, and then Claude, Codex, whatever the agent is using, they are just doing And, and the first core functional documents and the backends and the files, whatever.

[00:23:13] And then you are saying, "I decided, I changed my mind, and I want, I want to, to do this." So maybe it affects entire structure that they were, the AI was building. Still you can... Yes, it can do, so you know. But still you will burn maybe lots of tokens for it. So we need to understand what we are think- what we have in our mind in a solid way, which by the way, at the end of this presentation, we will have a live demo about that, no worry.

[00:23:39] So that's why detail. Don't overthink. Don't just, you know, polish everything. So there is maybe just one millimeter space between text or whatever. Don't... It doesn't matter. If the app works, app works. Okay? So if it is a UI problems, if i- it is really a big problem, [00:24:00] yes, we need to fix. But if it is a small things, don't try to polish.

[00:24:04] So because you will, you will lose yourself at that moment. And then, and then until you're fixing it, okay, I will fix that part, that part, then that part, and then actually you are postponing your launch. Launch is so important. You have to launch as soon as possible to just get real feedback from real users because AI or you, you can't see the things.

[00:24:27] So recently what happened, I built a f- f- I built a project called MC Probe, so it's fully vibe coded. Uh, I was thinking, I was using a few, uh, MCP server, and then I decide, I, I just said, "These m- I'm just connecting with these MCP servers, but is it, i- is it, is that healthy server? Maybe they are just doing something wrong.

[00:24:48] Can I just scan it, I somehow?" I, I was thinking. So and then I decided to build something, a scoring mechanism for them. Is there healthy something? Is it just a, a, a, r- proper error handling, blah, blah. When I start [00:25:00] to talk with AI, uh, I, I had a clear picture in my mind, and then I built an MCP server which all these other servers.

[00:25:08] So- But we, uh, i- in prac- in paper, everything works nice, right? I tested three times, not just three times. Personally, three times, and the AI tested 10 times, uh, and there is no issue. But one of the Farcaster user, I forgot the username, so sorry for it, so just tried for his MCP server and found a bug. So if I wouldn't just make it public, uh, and if I wouldn't announce that, I wouldn't get that bug, never.

[00:25:36] So this is very important. Launch as soon as possible with the core function, and then get your initial feedbacks. So this is how you can move on. No distribution. It doesn't matter how good the app you build if nobody sees. So that's why you need to ma- make sure you are talking about that and, and, and you, you are just really doing something for it.

[00:25:59] And [00:26:00] pure laziness. This is the modern problem, right? Modern lux- luxury problem. So sometimes it's, it's really, it is what it is. We need to take time and just a little bit rest, which I was doing for, for a while after shutting down Influence. But We need to just start at some point. Uh, and we shouldn't just lie to ourselves.

[00:26:22] So, but we can flip all of these mistakes. No ownership, define it and own it. This is very important. No one is talking about. This is really so important. Psy- the psychology of the AI by coding is very important. The people doesn't feel like responsibility to product which is not defined by themselves.

[00:26:41] This is so important. So wrong domain. As I said, as I give as example, if you never played an FPC game, and then if you are trying to build, you know, a, a, that kind of a game, that's a problem. You can try, you can just challenge yourself, but I would recommend just go with, uh, something you are curious [00:27:00] about at first.

[00:27:01] All will be, all will be on MVP. Make it simple. Details, don't overthink. And no distribution. Start talking publicly. If you don't talk, why others should talk about your product? And pure laziness. Get up your ass. There's no other way, right? So all of us, you know, know each other from Farcaster base, and that's a important thing to remember.

[00:27:26] The we, the builder mindset is a very different than, uh, just, uh, uh, a, a normal mindset. So because it requires some certain type of, uh, things you need to suffer, you need to just give up and just, you know, and do something else instead of that. This is the mindset that ties all together. I love Naval Ravikant.

[00:27:51] I read his book, I guess, three times, and I sometimes still read for some parts. So he says perfectly, [00:28:00] "Specific knowledge is, uh, found by pursuing your genuine curios- curiosity, not whatever is hot right now." That's actually domain, domain expertise in one line. That's why I just saying, keep saying domain, domain expertise, know-how, know-hows.

[00:28:14] It is very important And it comes down to three things: a grinding mentality, a building in public and actually talking about your work, and understanding the, the game of distribution. It's not a- after you build, it's a part of the job. So we need to keep in mind, while coding is not just pressing the button, defining something, you need to do lots of things.

[00:28:38] The... All right? So now here's the truth. The idea and the production don't matter as much as anymore. It doesn't matter if you have an idea or not, you can ask tens of ideas to t- thousands of ideas to just, uh, to AI. The AI compressed both of these two down to almost nothing. So n- idea and production [00:29:00] really don't matter as much as anymore.

[00:29:02] So what is left? What actually differentiates the people? It is execution part. So own what you ship, and that's it. So just... And keep distributing, t- to keep learning the how you can distribute it. So this is very important part you need to understand. So because now there are some even certain tools, certain skill files, certain repos I saw, you can just copy the screenshots, all right?

[00:29:28] Take a screenshots of the apps and give the domain, and then they are just literally copying in just one, one couple of hours and based on complexity of the apps and blah blah. So it's, uh... So the pr- product that, that... These type of things are not matter anymore. So the matter that... What, what matters is we have to be there, we have to be visible, and we have to own what we have.

[00:29:53] So the presentation pa- part was that much actually. Thanks for listening this part. [00:30:00] I will jump the cloud part, but before that, if you have a questions, I'm happy to just answer. Awesome. I love it. Thank you so much, Ali. Uh, amazing presentation. I think there's a lot of juicy tidbits to take out of that, and I appreciate you for sharing all those things.

[00:30:16] If anyone has any questions, feel free to ask. Um, we saw a couple people saying that they were excited. I love products that spark joy. And, um, and yeah, I think, uh, we can definitely continue over to the demo if you're, if you're ready to rock. Yeah. I'm excited to see what you got, what you're gonna share.

[00:30:34] Yeah. Let me check how I can share the cloud. I guess I need to share my entire screen, right? Oh, yes Yeah, there might be a tab for just the, the one terminal or, or the Cloud instance in and of itself. Okay. I think I found a way. Now I opened the Cloud on my browser. Okay. Oh, okay. Cool. Do you see my screen?

[00:30:59] Yep. [00:31:00] Perfect. All right. Perfect. Now I will show you something, uh, simple in the Cloud, okay? And so if you think this is, uh... Ca- i- i- it's very simple. So we will talk about, uh, certain things. So just give me a sec- second. Uh, I will open other, another docs. And actually, both part a new sess- um, tut-tut. Okay

[00:31:32] All right. So, okay. So now I prepared this simple, actually, uh, simple, uh, uh, just, uh, prompt. I will share with the prompt with everyone after the call, and, and then I think you can practice it. Okay? The prompt is simple Uh, I'm just saying to AI, just, uh, I want to build an app. [00:32:00] Don't give me any output yet.

[00:32:01] Just ask me questions one small group at a time and wait for my response before moving on. Start with these two. Are you a developer or non-technical? Is that a first time bu- building an app? Then ask what the app does and who is, who it is for, which actually is covering the two fundamental of the product, right?

[00:32:21] So function and the user. So what the platform, web, mobile or both? Whether users needs login. Do you have a login system? Are you planning to have something like that? As you see, we are not still discussing your idea. We are discussing the functionality or structure of the app. The idea part belongs to you.

[00:32:39] You can put whatever you want, but to make the, the by coding session is successful in a tur- in a, in a detailed way, so you need to define these things instead of the letting AI define for you. Because if you just say, build something, I need say something like a, a creative tool, but I don't know what I need.

[00:32:59] So AI [00:33:00] will keep just guessing and hallucinating about what, what kind of something you are imagining because it's a generic topic, right? A creative tool. So I... It will say you, "Do, do you, do you mean this? Do you mean this?" Blah, blah, and then you will keep start discussing. That's also another practice which very perfect.

[00:33:18] But now this is pure focus. We will focus, uh, how we can make the, the pair by coding part is clear for AI. And this is a soft model. Actually, I have another hard mode of these questions for myself, so, and then I will... I'm working on it to the make it something for everyone. I will share after whenever it's ready, but let's continue with this now.

[00:33:42] Okay. User needs a login. Maybe you are preparing, uh, building a, just a simple, just a landing page for yourself. Maybe you're a creator, you just want to get a deal from the company's projects to make a UGC videos, okay, contents, and then you can make a simple, uh, [00:34:00] just, just a landing page by putting a picture, by putting one liner.

[00:34:04] So there are lots of creators are doing that, and there is just a one call to action, book a call with me, and it's opening their calendar. That's it. No login, no anything. Is there anything in your app people will pay or somehow maybe how it will work? Do you require any payment? Yes or no. If you're selling a subscription, yes.

[00:34:27] If you're not selling, no. And then if yes, still we need to understand, uh, do you, do, ca- can I pay with the crypto? Can I pay with the credit card? Do you see what I'm doing? I'm just defining the user journey, what I will do step by step. So then what we need to remember between the visits. So let's just say I open the app, I log in.

[00:34:52] This is a game, let's just say simple game, simple Mario game. Uh, I just open the app. I, I, my level is sevel- [00:35:00] seven. There's a lead- th- there's a leaderboard. But imagine if your app doesn't remember my level, whenever, whenever I open every time, if it starts from the one, it'll be problematic, right? So I wouldn't just keep coming.

[00:35:14] So which means, actually remember means data section, data layer. So what kind of a tables, what kind of a data your app will require? So do you have a leaderboard? You don't no- need to de- define the technical part. What kind of a data, uh, the app remember? Your profile picture, your, uh, just level, your experience.

[00:35:37] So your final, wherever you stay, wh- when you just visit last time, maybe level just seven, level 14, these type of things. Okay? So what the... So it will give us a clean summary page with the all of these details. Now just let's just enter it and just try. I love it. Do you have, do you have any idea to build?

[00:35:59] I, I like [00:36:00] how you... I, uh, um, I do. Um, ooh, I had a... Let me, one sec. I wrote it down in my notes, I think. Done that. Uh, I will share the... I, I will share this, by the way, uh, with everyone, so- Okay ... totally. Have you ever used Unlock Protocol? Do you know what Unlock Protocol is? Uh, no. I, I, I didn't use. It's a s- simple collectible, uh, yeah, a collectible protocol.

[00:36:24] I guess it maybe it's a, it might be a little, maybe too. Uh, maybe search and ask about it after- Yeah ... once we get here. Okay. I don't know. Is that a part of your process? 'Cause one of the parts of my process in previbe coding is telling my AI to research about the thing that I wanna build. Yeah. Yeah. And then having it come back to me with questions sometimes.

[00:36:44] Yeah. Yeah. Yeah, definitely we can do it. So I think, so the whole point of the this previbe coding is you will put the idea, or you can discuss a- an idea in different chat and come be- come back here again. But whole point is that we call it [00:37:00] PDD, project design document, for the agent to start building, actually.

[00:37:05] That's the whole point. So, and this is a soft PDD. There is a hard, hard PDD mostly, and with all technical details, UI, UX, and the other stuff, and all the... If there's a contract involved and all the details. For example, recently, the MC Prop has a, has a, I guess, 17 page of PDD file with all details in the beginning.

[00:37:26] So, and I, I'm building another scoring algorithm, so that, that project has a, for example, 35 page PDD. So as, how, if you define in a really all details, uh, with the, with all the, whatever you wanna see, whatever you wanna do, whatever, what kind of a function y- you are imagining. So if you de- if you define everything, AI will handle.

[00:37:48] It, it will be just, uh, just one click for AI. That's very important to know. But for now, we, for idea part, we will copy just something simple, [00:38:00] but first- Perfect. Yeah, let's do that ... let's just go to, we, we will go with this flow. Okay, first question. Are you developer? No. No. I am, I am none there. Okay. I am marketer.

[00:38:15] I am marketing manager. Just say. Is this your first time to building an app? Yes. Okay.

[00:38:27] I love it. I think, yeah, the more detailed the better is always helpful too. Yeah. So having the marketing manager helps, 'cause it's like, "Okay, I know, I know- Yeah ... what my perspective is." Yeah. So now there's another question. What does, what does the app do? So, Zaal, do you have a quick, quick idea to build, or I can make up anything?

[00:38:45] Uh, think of a quick idea. My ideas are always way too complicated. All right, man. All right. So let's just say, uh, I want a simple, uh, landing page for [00:39:00] myself, okay? That's it. It is only for myself and potential customers. Oops, sorry.

[00:39:16] I like that you add your bullet points

[00:39:22] Okay, now there's a problem. There is a, a- the, the AI thinks what kind of a landing page so you are offering. So, uh, is it showcasing your freelance service, personal brand, or, and what kind of something you ha- you, you, you, you, you are just looking for? All right. Actually, I am a marketing manager offering, offering consulting

[00:39:56] Web3 projects, okay? So [00:40:00] there are different package they can buy, they can, they can request. Uh, they can book a call with me Uh, I want to also show my existing clients There are, let's just say four. There are three, one. There are three. I have some, I have some testimonials from them

[00:40:38] Okay. Now AI even says it's a clear, right? Yeah. All right. So the platform. Okay. This is very important, but that's the, the presentation, remember, there are two main distribution, web app or mobile. So I highly recommend everyone go with web app. Don't deal with mobile, okay? There are lots of problems you will [00:41:00] experience, especially in iOS side.

[00:41:02] Even I'm not talking about the when the phone change, you will experience the bug. I am not even talking about that. Mm-hmm. So mobile is a problem. So the platform, platform is website only. Do visitors need to log in for anything? No, no login. So- Okay

[00:41:26] Okay. Is there any money changing hands on site itself? Is it repaid directly through the page or is the mo- the, they book call? Uh, yes, no money. They can book a call for free. Does the site need to remember anything between visits? Actually, no. It's a simple website for me. It's a landing page. So there is no, like, level system.

[00:41:49] There's no gamification system. It's a simple landing page

[00:41:59] This is a simple [00:42:00] idea, I know. We could make it more complex, but I think you can practice it after the, this, uh, workshop in, in, into, in your Codex or Cloud or whatever. I also think it's always really helpful to try out with something small. Everyone with vibe coding is always like, "Oh, yeah, I'm gonna reinvent this wheel or this thing that I wanna do- Yeah

[00:42:17] with my project," or this or that. And it's like, start with a small project, get it done, try it out, d- Yeah, exactly ... fix it a little bit, right? And then start putting your teeth in longer projects, right? So I like- Yeah ... like a very simple landing page is a great place to start, because that's what I recommend all my musicians.

[00:42:34] E- exactly. So definitely I agree with that. So now it gives us a summary. App summary. What it does, who uses it, platform, accounts, payments, data, pages needed. So do you want to add or remove or change before I turn into build the file? If you are agree with that, I'm okay with that. Just say it, "I'm okay with that."

[00:42:58] Create, create, [00:43:00] create the file.

[00:43:05] Okay. So if you think there's a problem still, you can just change your mi- mindset in here. So this is very important. So most of the people, one of the common mistakes I forgot to mention, but in the... when I presenting, so people have some ideas, okay? You are in the middle of now building something, maybe already two days passed.

[00:43:25] Now you're just saying to AI, "Hey, I changed my mind. I don't want a social login," which probably will impact many places, right? So by the way, it's okay, AI can handle. It's okay, perfect. But you will burn tokens, don't forget, okay? You will spend lots of tokens. So if it is a big feature you are removing, I would highly recommend just don't do it, just go and start from a scratch chat.

[00:43:50] So that's, uh, better if it's affect all of the tables and other stuff. Now, it gives us a simple, a softened, [00:44:00] uh, PDD. All right? So it explains everything, what this is called, who visits, platform, core rules, pages, home, services, uh, clients, contact, design notes, content the user will need to provide. As you see, it will request from me when- whenever I'm building, I, I, I want to give the list of the client names.

[00:44:22] I, I want to give of the list of my service. So out of scope, don't do anything with user login. There is no payment. There is nothing, blah, blah. So now, if you just copy this and go to just cloud, which, uh, we will do, but I need to change my sh- screen because the... I forgot, uh, Google, uh... sorry, cloud doesn't open- properly No worries Uh, open folder I think building that PRD is super important when you start because you solve a [00:45:00] lot of the problems.

[00:45:01] Those five, 10, 15, 20 minutes that you pre-vive code solves hours and sometimes- Yeah ... days of things that happen later down the line. Yeah, exactly. So do you see my screen now? Uh, let's see. Boom, I can pull it up. All right. Do you see? Perfect. All right. Now, when you open the cloud first time, it was something like that, but now I have lots of work- work- This is in Claude Code, right?

[00:45:29] Yeah, that's fine. Yeah, this is the Claude Code part. So first what you should do, come here, and then you'll see choose a file or whatever in here. There's an open folder section, okay? Go desktop, just choose the... I will choose the workshop now. Okay? Now I will just paste this. I will not do anything. Okay?

[00:45:56] Okay, this is the Opus 4.8[00:46:00] 

[00:46:01] Okay. Do you see It's almost done. Just wait a moment. In just probably maximum three to five minute so we can just get first print. So but we dis- we decided many things. We don't know, by the way, color yet. We don't know anything. So mostly people is focusing unrelated things, okay? Color, the, the, the, the things, you know, button- buttons, how the button is big or small or...

[00:46:30] Yes, these are important. UI/UX is very important. But first build something in... You, you should see with your eyes, okay? Then you can just keep improv- improv- improving yourself. You can make the buttons more, you know, modern. You can make the website more modern. With time you can add, uh, some, uh, some, uh, some kind of a gifts and other things, other confettis or whatever, you know?

[00:46:54] Some very fance- fancy things. So whole point is you have an [00:47:00] idea. That idea, actually you have some knowhow which you can define what you need. This is just landing page. Don't forget, there is no detail. If it's a game, you have to de- design all of the detail, like a leaderboard, like a system, game system.

[00:47:14] Will, will, will it be buy- Will we just sell diamond? Will we... There will be what kind of a system there will be. Is the PFP is just, uh... Is it a, sorry, FPS or MMORPG or whatever. Is the mobile or not. So there are lots of details. Imagine it's another project like, uh, let's just say forking, uh, Farcaster, okay?

[00:47:34] So as I just say UI, it'll be ca- ca- let's just say forking Twitter. So what, what you will have, you will log in, blah, blah, something like that. So what I'm saying is the idea will shape the whatever you have, and then these will change the entire product. If there's a login, that's another something. Okay.

[00:47:55] Now we have already website. As you see, guys, we built, [00:48:00] I guess, under 10 minutes. I know it's not fancy, right? Fancy, being, making it fancy is another part. So but already we built. If we just say clock, "Hey, this does not look good. Let's make it f- uh, fancy." And if you just even don't wanna deal with that, I...

[00:48:18] If you, if you want to build, most of the people is now building a landing page for themselves. Go Lovable. Lovable is a perfect place, but you need to burn a little bit credit. So you can make fancy websites with fancy UX elements, UI/UX elements. So that was the whole point of today's workshop. I just want to show you, you can actually do without knowing anything.

[00:48:40] But you need to just think what you need. If you can't just think what you need, if you just let the AI de- decide whatever you need, so then actually there's a problem. So probably you may like, you may not like, but I'm mostly guaranteed about something. It's hard to just defend the, the, the idea if it's not [00:49:00] belong to you.

[00:49:01] So idea- Actually, it's not like that. I, I wanna correct myself. So the for i- idea not the correct part, but the building part, defining the details, defining what you need and defining what's the problem you are fixing So as you see, we only just 10 minute, guys. So it's, it's simple, super simple. It's not a problem.

[00:49:21] Yes, I know it's not a proper website, so but it will be i- if you just keep working on it next 30 minutes. And if I work in next two hours, when you come back, you will see, oh my God, that's crazy. It's very modern and it's like a bit of liquid glass and all the just crazy buttons, so. But in the structure- Love it.

[00:49:40] I think the cool thing is too you can take that PRD and paste it into your harness of choice. Anything you want- Yeah ... anywhere. It's not this like you don't need to use Claude, you don't need to use Lovable, you can use anything- Yeah ... you want because you've built that action plan. And if the application's not gonna be able to do that, right, you can [00:50:00] always pre-prepare and say, "Hey, I'm gonna paste this into this, um- Yeah

[00:50:04] agent," right? Like that's sometimes I'll say, "Hey, I'm gonna use Claude Code." What do you, what, knowing what you know about Claude Code, let's pre-prompt this because maybe it has an extension you can use that you didn't know you could use- Yeah ... for this or that. So, um- Yeah ... thank you, Ali. Exactly. This was phenomenal.

[00:50:19] That was a great demo. Um, it wa- it was cool to see, um, it was cool to see, right, we, we had a conversation about it, made a plan from beginning to end, right? Like something that you could, um, share and, and try out and, and have coded there where you don't necessarily know how any of the code works, but you really understand the architecture of what you wanna build to.

[00:50:41] Yeah. So. Yeah, exactly. So that's the whole point. And if you're thinking, guys, you can't make it, I'm, I'm, I'm just, I just wanna say that everyone can make it, but the problem is not the making it or not. The problem is how long you will keep going to make it. So that's the problem. So the consistency is the, the m- the [00:51:00] most of the problem.

[00:51:00] So because when you're making something and when you are not getting a visitor, so people thinks, "Okay, I'm not getting any visitor. I'm not selling anything." So now, you know, everyone just trying to make the some sales business and because of the by coding, which is makes sense. But, i- so people, people need to understand the, the, the builder mindset and the, the game of distribution.

[00:51:20] So, so first people thinks, "Okay, product is ready, now audience." Or some people thinks audience is ready, then product. So there is no a certain receipt to how to do the things, but you need just to just fail many times to understand the game for yourself. Because everyone, a game is different for everyone.

[00:51:40] So that's the important part. The, if something works for me, it, it may not work for you. So, so that's why just listen yourself as much as possible. I love it. Thank you. Thank you, Ali. This was phenomenal. You shared a lot of bits of wisdom, and I'm excited because I think a lot of people will find, um, [00:52:00] some value in that.

[00:52:01] So definitely share that prompt out. I'll make sure to- Yeah ... share that around and, um, and thanks for sharing so much today. Yeah, definitely. Thanks for having me, man. Have a good one.

[00:52:14] ZAO keep it a Zali. From the ZAO Dow come proper. We eat rappers for lunch and if some left, we eat 'em for supper. I keep it a ZAO, homie a Zali. Heard the streets calling E-3. Iron Man to a Simonz. Now the whole world hear about me