---
title: ZABAL GAMEZ Workshop w/topocount from Neynar
show: ZABAL Gamez Workshops
presenter: topocount @topocount.eth
org: Neynar
date: 2026-06-23T00:00:00.000Z
format: Dev talk, recorded
language: en
track: builder
youtube: https://youtu.be/lv70ErBQopY
topics: [Snapchain, Farcaster protocol, Neynar, Signers, Rust, Clients]
---

[00:00:00] Visit Zabalgamez.com. That's Z-A-B-A-L games.com and sign up Decentralized energy, let's talk about ways

[00:00:13] Welcome, welcome back everybody to another Zabal Gamez workshop. I'm here today with TopoCount. How we doing today, Topo? Hey, it's all pretty good. Uh, I'm excited to be, uh, talking about the stuff that I've been working on, and just giving my perspective on Farcaster stuff and building on it, so yeah. Yeah, no, I'm really excited.

[00:00:33] Uh, do you wanna give everyone a little bit of background, who you are, um, you know, how you kinda joined the Neynar team, and like, maybe, uh... Yeah, I, I have a question on top of that about, like, maybe the transition, so I'm kinda curious about that, but we'll, we'll get into that after your intro. Yeah, so, uh, I, I've been, like, a smart contract engineer for a good chunk of my, um, career at this point.

[00:00:58] I've, I basically started [00:01:00] my tech career in Ethereum. Um, I guess people would call that, like, EVM or s- maybe crypto at this point. But, um, and now, uh, I, and I've kinda like worked my way through, like, coordination tools, and getting to work on a platform which was orig- originally just Neynar that facilitates people building stuff was, like, really cool.

[00:01:22] I was ... I, I still work on, like, the data product side. Um, and, uh- Like the API and web hooks that, but like now that we've kind of, uh, you know, now that we're running Farcaster, um, I, I've got- gotten the chance to work on Snapchain itself and the protocol, and it's, uh, it's been like something I've wanted to do, uh, f- for a good chunk of my career.

[00:01:50] It's been a career goal of mine to work on a code base like Snapchain, um, and to, uh, something in Rust that is decentralized and, um, [00:02:00] kind of a big challenge on that front. And like I'm doing it a lot sooner than I thought I was, which is like a dream come true. And, um, I'm excited to like give it a lot of, give it a lot more attention than it was getting towards the end of like Merkle's tenure on it.

[00:02:14] I think Merkle was really working into growth- growth hacking and didn't see a lot of dividends from that on Snapchain, and kind of pivoted away from working on it so much. So, um, yeah. And we kind of see it as part of the whole process if we wanna get more people building on this ecosystem. So, yeah. I love it.

[00:02:31] I think, uh, Snapchain is a very, a, uh, very interesting, uh... Just where, uh, uh, tell, tell us more about it, if you wouldn't mind, for, for anyone who hasn't heard of it. Yeah. So Snapchain is like the underlying implementation of like the Farcaster protocol that accepts all of your messages, um, or casts, likes, follows, um, and like distributed, distributes them [00:03:00] to, um, all the clients.

[00:03:03] So, um, I think, uh, like the, uh... And it's like, uh, so this is like, it's, it's a fundamentally interesting thing for people who are like crypto nerds because it is like an completely open social backend that anyone can literally like inspect or build on, um, and see like what's really going on, and that presents its own set of challenges, which I'm sure we'll get into.

[00:03:27] But basically what it means is like, uh, anyone can basically build, uh, tooling to interact with people on the Farcaster app or, uh, you know, Q or, um, formerly Base, uh, the Base app. So like, uh, and that's like really, that's like really cool. Like you can build like different front ends, um, and we'll talk about how I think that that can be more achievable, um, than like what it, than it has been in the past.

[00:03:56] Um, and uh, I think it's important to also [00:04:00] highlight that like we are now like working and planning in earnest to like move more of like what is inside Farcaster, the, the client and the app onto, uh, Snapchain. Um, so like, uh, I think we've had, we've had a, an FIP open for a while on Blocks. Um, I'm working on, I've, we've been talking about channels a lot there, so there's a lot to unpack there too- Yeah

[00:04:24] on the, on the timeline. Um, and so like that means that like- I, I think that like the multiplayer environments that like channels present are making those, like bringing those outside of the Farcaster app will unlock a lot of like the stuff that people wanna make on Farcaster. So yeah. A million percent.

[00:04:45] So that's cool. I like that overall goal of moving things that are on the client to the protocol and letting anyone be able to leverage some of that tooling, because I think that helps grow the ecosystem for, uh, client building. And I know you wanted to chat a little bit [00:05:00] more when we were talking before a, a little bit about it, but as well as just like the conversation that had been happening over the last, um, last few months, uh, around client building.

[00:05:09] What's your kind of vision for clients going forward? What do you ... In addition to giving that opportunity for some of the things that the Farcaster app has natively in it, um, to clients by bringing some of those things on Snapchat, and what else are you kind of thinking to build on them to help? Yeah. So, uh, I mean, we're, we're

[00:05:29] I, I me- I, I casted about this s- uh, like, I think a few work- a few working days ago at this point, but, uh, there are some, there are some, uh, communities and developers in those communities that are using, I think, channels in some really interesting ways, where rather than trying to build like a whole client, they just focus on a subset of activity on the protocol that is like mostly centered around a topic like skateboarding or football, like n- uh, association football, not American football, [00:06:00] and

[00:06:00] Or, um, mm, like a social club, like mug club, mug club. And like, uh, I think that is like much more tractable to build as like an indie dev than like an entire, um, like database to support all the activity on the protocol. Um, I think, uh, we're g- we're working on, we're planning out and arguing, uh, you know, in a, in a, in a, in a friendly way about like what we want, how we want to bring, uh, certain primitives, um, onto the protocol and what we wanna, uh, and like what stuff, what tie-ins we might may or may not wanna have with like on-chain, uh, primitives to make, um- curation and, uh, I guess like administration or moderation, uh, a little bit more legible for folks.

[00:06:53] Um, so like I, I think, uh, that a- and like I think [00:07:00] we incrementally want to ultimately bring channel, uh, channel, like membership moderation user- users who are moderators and eventually followers on chain. On, onto Snapchain, not, not on chain, on chain. And that, that will become a lot more, um, like usable for everybody.

[00:07:20] Uh, and they, we, we, like we basically, we have a bunch of like APIs for the Farcaster client right now, and we wanna bring a bunch of that stuff onto Snapchain itself, 'cause it's, uh, it, it, it, it's like a lot of those primitives, like blocks right now, especially like if you have to use the, the, uh, if you have to...

[00:07:39] Like blocks are not working the way they should, and that's like a whole different discussion. Where like, uh, I think if you unblock someone- Oh, social blocks ... it's hard, it's hard to, it's hard to- Oh, you mean block in terms of blocking an individual? Sorry? You mean blocking an individual, correct? Yeah, yeah, yeah.

[00:07:55] Not blo- not like, uh, not blockchain blocks, but like social blocks. Yeah. [00:08:00] Yeah. Yeah. Sorry. Um, so yeah, I've been rambling a bit, but, um, I, uh, I, I, I think like I, I, I think it might've been Userstein who said this well, um, and probably other users who I'm not, um, crediting, uh, well right now. Uh, but like, I think that we need to kind of like lean into the p- the fractal potential and the emergent potential of like budding communities and, um, uh, activity, like different, different like niches and use cases, and enable those.

[00:08:33] Uh, I think that that's like the only... That's the biggest thing, the biggest differentiator we have going for us as far as like how we're positioned and what the stack can do. So, you know. I love that. I think there's, uh, a lot of fun things to, to poke at there. But, um, but there's definitely this, uh, benefit of having a protocol that anyone can kind of come in and build their own front end.

[00:08:58] And I like the [00:09:00] idea of the fractal potential of getting lots of different individuals to not only create their own clients, but as you were having that conversation, create collaborative clients that maybe is a community, uh, of theirs, but then also another community that's out there. And then there's this client specifically for those two communities to emerge together, and that could be really interesting as well.

[00:09:19] Uh, and it could be like part of an event, um, that like builds a semi proto DAO out of that, right? Like something happens and then it kind of continues on after the event, but it's not, it's not like its own thing in and of itself. It kind of started at a point, but then it's kind of a continuation, right?

[00:09:38] As opposed to this one time thing. And that's kind of where I see things like channels being a really cool thing, where it's like, okay, like this thing happened, we're making a channel for it, we're gonna do these things, and then they're always viewable in the past. Or if people wanna rebuild off of any of those ideas, it's like you kind of continue that discussion or conversation in a channel.

[00:09:57] Yeah, absolutely. Like [00:10:00] the, um, I think that there is, uh- I, there's so many places I wanna go with this right now. Um, th- th- so I'm, I'm a user of this, like, search engine called, like, Kagi. It's like, uh, uh, I, I, I, I'm not gonna get into too much of, like, why, 'cause it's, I don't wanna be too much of a shill, but, uh-

[00:10:22] um, it, it's, like, uh, they have this, like, free, like, little landing page called, like, The Small Web, that is curated by users, and only by users. And, like, you have... You can't add your own website unless you've recommended, like, three websites on there that don't exist yet. Um, and the idea is, like, to kind of bring that, like, Web 1.0 feel back, where you're just browsing people's blogs, browsing informational sites, playing, playing, like, indie games that don't have a ton of ads, and all that kind of stuff.

[00:10:54] Um, and, like, I love the, I love that ethos of, like, building, like, a human-first, [00:11:00] um, web experience that is, like, more about, like, user, the user's, like, sense of discovery and connection with the people they're interacting with online. So, like, kind of, like, evolving that to, like, you know, m- bringing, bringing, like, that, that initial small web feel from, like, Web 1, bringing that to, like, a social experience.

[00:11:20] And I feel like we can do that pretty well. Um, that, like... And, and I, I, I think that, like, uh, there's been a lot of hay made in the last few years over, like, you know, quote, so-called, like, read, write, own. Um, and just, like, you know, a user sovereign internet based on Web3. Um, and, like, none of that has materialized.

[00:11:43] So, uh- 100%. ... like, I, I think we're still trying to solve that problem. So, yeah. I like that. I like that as the kinda goal, because there is so many things that you can touch on, uh, that Farcaster does bring, like the ability to, if you do get, [00:12:00] quote-unquote, "censored" by one protocol, you know, that doesn't necessarily mean that you can't still interact with the network as a whole, which is really cool.

[00:12:08] Kind of the- Yeah ... not, the ability to, um, fight against deplatforming of traditional social media platforms, right? And being able to kinda say, "Okay, like, there's another place, like, we can all go because XYZ platform isn't the right one for us." And, and the tools are ho- getting better at building those things as well.

[00:12:29] So, uh, I don't have a question in there specifically, but I do want to dive into a little bit more about SnapChain. Um, I know you said you guys are thinking of bringing some more things over. Do you wanna give a kinda, like, list of the things that SnapChain has right now that users can tap into when they tap into the protocol?

[00:12:50] Yeah. So, uh, right now what we, what we track are, like, user, are, are, uh, users of course, and their profile information. [00:13:00] Um, follows- Casts, all that kind of, all the stuff that you see, um, the at, at like a very primitive level. And we have some like really rudimentary APIs for those things available on Snapchain itself too.

[00:13:15] Um, the issue i- the issue is that like very few of that, very little of that information is like fully hydrated with like the, the embeds, um- Mm ... being fleshed out or any, or like quote casts, embedded casts in like a quote cast being fleshed out, stuff like that. So that's like, that's like why Neynar initially kind of like existed, was to like provide like APIs that give you the full fat Farcaster information.

[00:13:41] Um, so like I don't- I think that, like, what we are trying to do is, like, make, like, Farcaster or make Neynar, um, Neynar's tooling, like, better or more, more, I think, accessible in the, in the absence of, like, having this [00:14:00] information on, like, Farcaster. So like, um, that's, that's like one, like, kind of affordance we're offering.

[00:14:05] I think the other thing that, like, I just added recently is, um, gasless keys. So, like, keys- Uh-huh ... um, so, like, the way... L- l- let's talk about how signers work or using keys. Please do. Yes. Yeah. 'Cause I'm very confused by that part, and that's why I'm like, I'm not doing it, like, in my, in my setup because I'm like, I, I don't know enough about it.

[00:14:27] So please, please enlighten us. Yeah. Yeah. So, like, there is, like, a really nice way to get started with signers and keys, like, baked into... I'm gonna use those words interchangeably right now, so- Okay ... sorry about that. Um, ba- baked into, um, Neynar, and that's what a lot of people end up doing. Um, where, uh, where, like, i- i- it's like, it's confusing, like, what you need a signer for and, like, how they interact.

[00:14:57] And, like, I think as, like, as, like, a developer, it's, [00:15:00] like, the highest learning curve to ascend b- to get started. Um, but basically how it works is they made, like, a, like, I think Merkle, the Merkle team made, like, a, a pretty opinionated, and in my opinion, good decision to offload all actual signature work from the user to the developer.

[00:15:25] So what happens right now, um, if you're not using, like, Snapchain signers, which is- which are, like, what I like to call gasless keys, I'll call them Snapchain signers from now on, um, but are using on-chain signers. Like, on-chain signers are, like, what, what, what shipped with, like, the origin- with Snapchain originally.

[00:15:43] And, like, what you have to do is, like, go to a smart, smart contract and present a payload signed by the user, uh, to, like, I think, Optimism, and then, and then that basically gives [00:16:00] you access to the signer in that payload, and that is complicated because you have this, like... So basically what the user is doing is, like, signing, signing off on you submitting messages to the protocol on their behalf.

[00:16:14] Now, there are a few things in Snapchain signers that we fixed, um- That, like, I think, uh, are, are kind of like rough edges for on-chain signers. One is they don't expire. Two is only the developer can revoke those signers, not, um ... It's, right, easily right now. It's really, it's, it's like not ... You can do it in the app, but like, it's not obvious to users that like

[00:16:41] Actually, yeah, it's not obvious to users that like they can re- they need to or should revoke these signers because they never expire. So if like an app goes dormant, um, and we've had s- you know, those signers are just kinda like floating in, in random parties could in theory get access to them and sign messages on your behalf.

[00:16:58] So like with Snapchain [00:17:00] signers, what we've done is we've first gotten them off of like an, a, a, an EVM blockchain. So like now they are entirely native to Snapchain and they don't cost any money. They don't cost a transaction to create. I see. And that's why you're calling them gasless signers. Yeah. Yeah.

[00:17:15] Um, they, we use like s- similar like signing primitives, the IP712 to like generate the payloads that Snapchain then decodes, but they effectively never go on-chain. Um, and so they're free in that sense. The, they are, um, they, they expire after 90 days of no use, which is like a security affordance that is like supposed to protect, you know, intended to protect users, um, and is a convenience for developers.

[00:17:46] Every time a signer is, a, a signer presents a message to the protocol, the lifetime of that signer is extended another 90 days. So like that way you kind of have the best of both worlds. You as a, you as a developer don't have to manage like OAuth 2 refresh [00:18:00] sequences. Uh, but like you also, and you also don't have to worry about like these me- these Snap- uh, these signers expiring on you.

[00:18:09] Um, so those are like the big, uh, wins with, uh, with, with Snapchain signers and like, uh, I think we're still migrating to using them on the Farcaster protocol. Um, and we, we will eventually sunset on-chain signers, but that'll be ... That's not, that's not coming for a while. So like you can use either right now, um, and, uh, it's fine, but like if you, uh, but if you wanna like provide some extra security and user respecting, uh, affordances, like I highly recommend using the Snapchain signers right now.

[00:18:45] So, yeah. Interesting. So when a developer creates the, these new Snapchain signers then, um, [00:19:00] or, or signers in general, are they defaulting to that? Or how, how does one differentiate one from the other right now?

[00:19:10] Uh, it, they are separate. So one is, one is act- en- entirely activated by submitting a message to Optimism. Oh, okay. And then s- and then Snapchain picks up that on-chain transaction and, uh, allows messages from the signer in that payload to be submitted, um, to Snapchain. Um, the... Which it, it... And, uh- Like, how does a developer pick, uh, Snapchain signers to use?

[00:19:37] Like, what's the process of doing that? Is that just- Uh- ... through Neynar or through their own, or, or, I, I guess any validator? I, I don't know. We, we... So you don't even have to use Neynar for this. You, all you need is, like, all you do is present the user with the payload similar to, like, how the- Oh, I see ... the existing docs present, uh, the docs explain it.

[00:19:59] [00:20:00] And then, um, you submit a key add message to f- to Snapchain, and then that message registers that key to the user who signed it. One, one, another s- another security affordance that we've kind of created is, like, you can only have one signer per a given user, um, because they're free now. Like, they cost nothing to generate.

[00:20:20] Um, you know, unlike on-chain signers where, like, you know, it costs money to register a given signer now... Uh, so y- a lot of, a lot of apps use one signer for every us- across all their users. Like, now you have to generate a new signer for every, for each individual user. Um, and that's just, like, more just, like, it's blast radius protection and it, it prev- it prevents, like, if, if somehow o- uh, a third party gets their hands on one signer, they don't have access to all these different users.

[00:20:54] Um- That's cool. Yeah. So, like, it's, it's as simple as basically doing the same thing that [00:21:00] you s- doing something very similar that you do with on-chain signers, only you just submit the message to Snapchain- Right ... formatted a little bit differently, um, instead of on-chain. And then, and then you're able to use that signer on behalf of the user who signed off on it.

[00:21:12] So yeah. I gotcha. And you as a developer essentially put that in some window somewhere where the user is authenticating through that, and, and that gives you that just like it was before, but instead of it costing money, um, it just goes right to Snapchain. So that's pretty cool. Yeah, exactly. Do you wanna, do you wanna share some of the other, uh, backend upgrades and things you guys have done that are less things that people see that are all the flashy things on the, on the front of the feed?

[00:21:38] Yeah, so, uh, I think, uh, uh, we, we've mi- minimized the memory footprint. I think both Hypersnap and Snapchain have done this. Um, now to run a node as a reader, it take ... It, it only costs, like, up to four gigabytes of memory to run a node, which is much more affordable than, [00:22:00] like, the 32 or 64 it used to cost. Um, and, uh- We've also, uh, I've, I, I, we've also pushed some work, s- pushed some changes that make the mesh, the consensus mesh ar- around, uh, all the validate- across all the validators much more resilient.

[00:22:19] And we, like, a- just, like, I've been running a node, a s- a, a validator node on test net in Mumbai for, like, I think a couple weeks now, and just today I actually started running a, a validator node. I took one of the existing nodes from Merkle and moved it to Ireland. So now we have these, like, cross-continental consensus, uh, consensus patterns occurring, which, like, is good for the network 'cause it means that you can

[00:22:46] anyone can run a node. A, like, as we're onboarding more validators, which is, I think we're gonna, we're s- we're continuing to onboard more validators after Uno, um, soon, um, we'll, uh, [00:23:00] uh, we'll be able to ac- accept, allow them to run a node almost anywhere, um, in the, in the world, and be able to, like, participate in consensus with them, which is, I think, pretty sick, so.

[00:23:11] Yeah, that's cool. That's one part of the decentralization, right? You, you can get users across, uh, a bunch of d- uh, a bunch of different places. That really adds, um, users and then validators, right? The validators coming in at, at some of these other places is pretty cool. So I'm excited to, to hear more about that and, uh, and see how that goes.

[00:23:32] What, what is the benefit of running a validator for SnapChain, let's say, than a traditional blockchain?

[00:23:45] So I think running a validator kind of forces you to under- like, I think, um, I always think of, like, the intellectual benefits of things because I'm a huge dork, but, like- ... it, it, it makes you understand what it [00:24:00] takes to run a Snapchain node right now, which has its pros and cons. We're trying to make it more of a pro than a con.

[00:24:04] Um, uh- Yeah ... you get, uh, by default, like, maintainer-level access to Snapchain, and I think, like, the proto- uh, I think, like, s- not maintainer-level access, but, like, some level of access to be determined as we generalize, uh, the protocol itself from, like, Snapchain into, like, a language-less specification that will facilitate the building of other clients from s- of, of other, uh, Farcaster protocol implementations from scratch, basically.

[00:24:36] Huh. Um, it ... I, I don't know, I don't know if there's, like, much incentive to do that right now, but we think it's important for decentralization that the specification exists outside of Rust, and in- Yeah ... in, in, in, like, a v- plain protocol specification. So, yeah. Um, and, uh, I think that that also makes it easier to reason about, like, what is expected of a, [00:25:00] uh, of, like, a node that

[00:25:01] O- of, like, a, of, of an implementation, basically. Um, so I think, uh, I think we want to work ... I, we, we actually discussed this internally, like, what would it take to, like, get off of, like, the validator system, which, I mean, is ... I, I, I've heard it ... I, I like to think of it as proof of authority, where, like, it's a, it's a permissioned, uh, it's a permissioned, uh, like, set basically, um, where, like, all the other existing validators have to agree to include you in the validator set in order for you to become, um, part of it.

[00:25:38] And the big thing we need is, like, a larger community. If we have a larger community of people participating in, uh, on the protocol, wanting to run validator nodes, um ... So, like, basically, as more people participate on Farcaster as users- Mm ... the idea is, like, more developers will become attracted to it, and we'll eventually [00:26:00] be able to

[00:26:01] We'll eventually have more liquidity and activity in the protocol to, like, build real incentives. But until that point, like, we are kind of ... We want to maintain, like, a relatively, like, high-trust environment. We are decentralizing. We're in the, like, the, like, like, process right now of making Neynar slash, like, you know, Farcaster itself, like, a non-majority runner.

[00:26:27] So basically, the idea is, like, we wanna bring in, like, value-aligned, um, node runner, validator runners who, um, we have, like- uh, uh, trust and relationships with. Uh, trust to, like, trust to maintain, like, a high availability of their node. Um, and ex- and, like, longstanding relationships, like, as far as, as community members.

[00:26:52] Um, and then, like- As the protocol and user base grows, we can get away [00:27:00] from the current consensus system and move to something that is, um, truly permissionless. I think like a half measure step that I am researching doing right now is taking the ... I think especially as the validator set becomes more pluralized and less nanar- Mm-hmm

[00:27:19] um, we want to move the, uh, the control of the validator set onto a decentralized medium out of the repo and onto ide- ideally like a smart contract, and make it so, like, the, like, the process of joining and, and like, uh, or removing a validator, it becomes like a multisig process at least, and not just something that I- Everyone asks that

[00:27:47] I do in a repo, right? Oh, yeah. Like, like a GitHub repo right now. Oh, okay. So yeah, yeah. That's interesting. That's cool. I lo- I love the kind of intersection that we're at right now with AI and blockchain where, [00:28:00] I mean, we've had many conversations about DAOs and how those can be super powerful primitives but haven't been explored in enough, um, enough as a whole.

[00:28:12] Um, but it's really interesting to hear different parts of the, the co-mingling of, uh, of those two things for me and, uh, and just kind of being able to see all the different developer sides from the super non-technical, um, individual all the way to a software developer who's been doing it for 20 plus years.

[00:28:33] Um, yeah. What's the biggest thing for you right now? W- as we're getting close to the end, what's, what's the, the biggest thing on your mind right now? Channels. I'm spending- Oh ... I'm spending, like, a lot of headspace thinking about how we wanna do, what we wanna do with channels, and I'm trying to ... I've- I spent some time last week, um, you know, on- online, uh, on, on Farcaster just, [00:29:00] like, trying to like stir the pot a bit.

[00:29:01] Um, yeah. Is that why the Farcaster intern posted about channels? Were you- That wasn't, that wasn't me. That was like- No, I know it wasn't you both, but- Yeah, that was like the hive mind ... were you prompting it? Were you prompting, uh, the, the Farcaster intern to, to- No ... ask? Okay. So you- I actually, actually what happened, it's the other way around actually.

[00:29:18] Okay. Not- I like it ... the see, seeing the responses- Okay ... to, like, what, what, what the intern got- Oh ... and, like, seeing, like, and, like, just seeing all the, all the spicy takes, which, you know, we, we want, um, made me want to, like, kind of like carry the flag for channels a bit. And not that I'm gonna be, like, doing all the implementation.

[00:29:41] Yeah. But, like, just try to, like, drive the product evolution forward internally and see what, see what happens. So, like, I'm, I'm, I'm trying to, like- Uh, move that forward. I'm getting a l- some- I'm getting a lot of positive responses and positive feedback. Um, and I think- One of the things- Yeah, go ahead. [00:30:00] I, I don't mean to interrupt you if you have a, if you're finishing a point.

[00:30:02] No, that's it. That's it. Okay I, I, I'm just... I'm, I'm pretty excited about channels right now. I'm getting sweaty about it. One of the thing I think that we as a community, but it is an idea, uh, as a whole, that we could take from something like a Reddit is- Yes ... the ability to be pseudo-anonymous, but also interacting by more of, like, the lurker status, but specifically around a specific thing, right?

[00:30:30] Like, there's some people ... There's not a lot of people here who are like, "Okay," like, "this is my only thing," like, "That's all I do." Right. Because, like, there isn't that, like, incentive or, or way to do that, mechanism to do that well. But I do think that, like, being an admin of a channel, just like being a mod of, of a Reddit, the, uh, subreddit, which is its own mess of things to talk about.

[00:30:55] But- ... it could be a really powerful thing, especially when we take into these things of decentralization [00:31:00] where maybe you can add a, a token gate into your channel. Maybe- Yes ... these other, like, small things that could be things that you don't have on places like Reddit, and I don't know any other social media that i- is as, uh, unique like that.

[00:31:15] But the ability to come on immediately, start talking about something, and being a fore- thought expert in it, and being able to actually, like, gain influence quickly, because I don't think that that's, like, really easy for a new person that has a lot of resources, value, and things to give to then immediately get like

[00:31:34] Okay, like people are looking at this, unless someone specifically, like, you look at someone like Luciano, I don't know if you've seen him on the feed, but he's been onboarding people like crazy. Like he's been- I, I lo- I love his presence. He's- Whenever he pops up in my feed- He's posting about it ... I'm happy.

[00:31:46] Right? Yeah. So like, that's huge because then I'm like, "Okay, bing, bang, boom. I'm gonna follow and add a notification on for this person," because I know it's, like, A, from a trusted individual, and then B, it's an individual that needs that help and support right now. [00:32:00] Because they might be, like, doing some really cool stuff, but people might not be seeing it.

[00:32:04] So the ability for, like, me as a new user to come in and write something in Dash Books and be able to, like, have, like, really excited people about books that are like gonna check that out, right? Because this individual, that's like part of their daily routine. And there are some people that do that, but not enough.

[00:32:20] So like, how do we make ... Question for- Yeah ... like, how do we make channels a part of our daily routine, a spec- a specific channel being, right? Like, how can that be supported by someone like, uh, Topo here? Yeah, exactly. Like, I, I think that there is, like ... I think that you could approach it from, like, a pseudo perspective if you want to.

[00:32:41] Um, or like- A more, uh, like persona perspective too. Like I, I... One of the things that like I, um, I've always wanted to be on Farcaster and I'm still working to become that type of poster, is like just a very [00:33:00] unvarnished, frequent presence. Like, um, I- one of the things that like intimidated me in the early years of Farcaster was like how much, like how much people were performing to kind of like build a follower count and like I'm not, I don't think, I don't think it's worth like...

[00:33:18] I, I think that that was what the incentive mechanism was- Yeah ... was like cultivating from, from people. I think there was a lot of incentive to like build a following, build a, build like a platform. And like what I want is I wanna be a, I wanna be like a u- a type of, like a persona who engages in my interests organically, finds fulfillment in the feedback and like, in like praise or criticism I get and like what I'm doing.

[00:33:46] Um, you could even be a dog. Uh, and uh, you know, finds more interest and like co- and becomes like a, uh, you know, maybe someone who can share experiences [00:34:00] with others. Like I, um, I went to like a pretty competitive college. Uh, and one of the things that I like to do on Reddit right now is like just provide reassurances to people in that college's subreddit-

[00:34:14] to people who are like struggling or like, uh- I've seen your posts, which is hilarious. I don't do that because I... Well, for a separate reason, but that's, that's amazing. I like that. That's a good energy. Because like that's something you don't get a benefit from, right? Like, uh, that's- Yeah ... the basic like, um, public good thing that can be like you're, you're passing something on from knowledge that you, you've gained, right?

[00:34:39] Passing- Yeah ... passing through the college. Like that was like, I mean I, I, I don't wanna get too into like what my experience in, in college was like- ... but like it was like a real, uh, like probably one of the most intense periods of my life aside from like probably just having a kid. Um- ... and, uh, I think honestly [00:35:00] just having a kid during COVID was like an extremely isolating and brutal experience.

[00:35:04] But like that's a whole different discussion. Um, and, uh- I, I, I wanna be the person that I needed when I was trying to get through something. Yeah. Um, and like, I hope that those people exist when I am a novice in various things that I wanna do. So like, I, that's ki- I think Farcaster brings out that energy.

[00:35:27] Yeah, exactly. That like basically everywhere where it's like someone will post a challenge about something, and people will say, "Hey, I might not know this, but I know an individual who might know a little bit more about it, so I'm gonna tag them." And then like that flourishing of like a unfinished idea, kind of like what we were saying before, of like just posting that, being unafraid to post a, a, a newbie question, and being able to then get not only feedback, but then potentially [00:36:00] reassurance and support from an individual on Farcaster saying like, "Hey, like I'll help you do this."

[00:36:04] The thing that Reddit does not have is that like retention and follow through of like once you have an interaction with a random character on the internet. Not a lot of people are following other Redditors, right? Like- Yeah ... that doesn't really happen. There's no like mechanism there. That's the like pro that Farcaster has as well as having, you know, a whole blockchain backend and, and wallet, right?

[00:36:26] Where like you can permissionlessly- Yeah ... send money, which is a whole different, again, like, you know, don't wanna have to talk all about crypto, right? But like it has its, its benefits that, that something like Reddit doesn't have. So I think that- I, I think that, I think that will, I think as we find, uh, I think, I mean, I, I don't wanna start waving hands towards like the CLARITY Act specifically.

[00:36:46] But like, uh, like I think that we want to build in the direction where like the financial infrastructure like exists for like, like the, these, these [00:37:00] like- emergent like, uh, social orientations and like relationships have like real rails to do stuff with. And, uh, that, um, that, that does- like you said, that doesn't exist anywhere else.

[00:37:18] But like, I mean, in my experiences in crypto, like I've already seen this kind of like in a, in a rough analog sense where like I've worked on projects, um, that have like really loose, uh, employment relationships, whether it's through like Raid Guild or like on something like, uh, uh, um... Oh, man. There was like this, this Protocol Labs project that I worked on, um, called SourceCred, where we had like developers coming in from like other parts of the world and contributing to it, and I got to build- I had the pleasure of like building relationships with them and reviewing their code and cultivating them to a small degree as like developers.[00:38:00] 

[00:38:00] Um, most of them, in a lot of ways, are smarter than me. It's just they wanted to build on the code base, and I got to help them do that. Um, but like, instead of like interacting with these people as like outsourced engineers, I got to interact with them on a per- person-to-person level on like Discord, uh, and in GitHub, and that was like immensely rewarding to just like meet people from different cultures, argue about, you know, random w- random life experiences, and get, kinda get roasted as an American.

[00:38:29] It was all- Yeah ... a fantastic experience. And I, I wanna see like more generative, I wanna see like more, more like generative results, like something like SourceCred but better come out of like what we're doing on Farcaster, basically. So yeah. I like it. Yeah, there's, uh, there's a lot of fun things you can talk about when you go to the, like, not even the technical rails, but the just, like, Farcast or cultural, [00:39:00] um, support and everything around that.

[00:39:01] But, uh, we're getting, you know, close to the end. Do you have anything you want to share with everyone? You know, what's, what's the, what's the, like, thing you want people thinking about and asking questions about? And c- and where do you want people to come if they have things for you? Where- what's the best way to reach you?

[00:39:22] Yeah. Uh, I mean, @ me on the timeline. Uh, get in my DMs if you want to talk about, like, keys and you aren't content with, like, what's available right now, snap chain signers, uh, or signers in general, I'm happy to help out. Um, I don't think we've had, like, any presence from the Neynar team come in and fill the gap, uh, like, uh, uh, Horse Facts did on, on, on the timeline.

[00:39:48] Um, and I don't think, I don't know if any of us have the personality to do it like, like, uh, Horse Facts did, but, like, we all have our, like, um, our- we all have our, like, areas of focus and our areas of [00:40:00] expertise. Some of those are different, some of those are different things. Um, but, like, and maybe we should make that more legible for people, but, like, i-i-if you want to know who to talk to or who to at about a feature, um, and they're open to it, you know, because maybe some of them like to be heads down, which is good, uh, in its own way.

[00:40:19] Um, let, uh, you know, you can at me, um, or you can talk to, like, Quasia on the timeline. He's big on the wallet, and he sees, like, he's big on the wallet stuff. Um, but there are other engineers that, you know, might not be as vocal on the timeline who, you know, might want to talk to you as well, depending on, like, what problems you're having.

[00:40:38] So, um, yeah. Uh, I, and one thing I want to get, one thing I want to say is, like, I, um, I don't think the docs for snap chain signers are, like, like, as good as they are for on-chain signers yet, so, like, I am going to polish those up before, um, the games start. I think that's something I should commit to, so that means this [00:41:00] week.

[00:41:00] Um, so yeah. Uh, I, uh, I, I don't know. Uh, Zaal, it's been a big pleasure, uh, just kind of, like, sharing what I spend almost all my time doing and, uh, talking- You're gonna have to come back. You're gonna have to come back for the, for the open build to, to actually build something with us, because I think that would be a lot of fun.

[00:41:20] Give, give a little demo, um, going from, like, A to Z of, of using some of these things. I think that'd be a lot of fun, and that'd be a good thing to, to share out. Definitely. I, I, I, I would love to do that. That sounds awesome. Awesome. Well, it was amazing having you on. Thank you so much for coming, joining in.

[00:41:39] Thanks for everyone who's listening in, and we'll see you all soon. Cheers.

[00:41:45] ZAO keep it a Zali. From the ZAO Dow come proper. We eat rappers for lunch and if some left, we eat 'em for supper. I keep it a ZAO, homie a Zali. Heard the streets calling E-3. Iron Man to assignments. Now the whole world hear about me