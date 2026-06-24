---
title: POIDH: the open bounty protocol
show: ZABAL Gamez Workshops
presenter: Kenny @kenny
org: POIDH
date: 2026-06-15T00:00:00.000Z
format: Livestreamed and recorded
language: en
track: builder
youtube: https://youtu.be/EdfMN-lRI4E
topics: [POIDH, bounty protocol, on-chain bounties, composability, Empire Builder, Farcaster, Base]
---

[00:00:00] Visit Zabalgamez.com. That's Z-A-B-A-L games.com and sign up Decentralized energy, let's talk about ways

[00:00:13] Awesome, awesome. What is up, everybody? We are back for another Zabal Gamez workshop. Today I'm here with Kenny from POIDH. Kenny, how you doing today? What's up, ZAO? Doing well, man. Enjoying, enjoying the Seattle weather. We got some World Cup games happening here today. Uh, got some fun stuff happening with POIDH.

[00:00:30] Our caster combos are great, so yeah, good vibes. Good vibes all around. Awesome. I love it. I'm really excited to chat here with you today for, I guess now the third time in a couple months, which is exciting. Yeah. Um, it's been really cool ever since Maseo introduced me to what you're doing over here with POIDH, and, um, I've had the awesome opportunity to try out building some bounties, improving that over time, and seeing what can be done with POIDH.

[00:00:55] So why don't you give us a little summary, what is POIDH? Yeah. So just for anybody who's [00:01:00] watching for the first time, hasn't checked out POIDH, uh, we're an open bounty protocol really for anybody to incentivize anything, right? So POIDH allows you to put out a bounty on there on-chain, uh, transparently, and then for anybody else to claim that.

[00:01:14] But most importantly, it also allows people to collaborate and add funds on top of your bounty, right? So it's this open protocol for collaboration using only on-chain tooling. Uh, we think that's pretty cool because all internet communities want to incentivize things, and there really is no one product that makes it simple for them.

[00:01:36] So that's what we're trying to be. Awesome. I love it. Nice and simple. So POIDH, pictures or it didn't happen. Do you wanna share with us, you know, what's been going on in, in the POIDH world with Kenny? How have you been collaborating with different folks? What are the different things that you're l- tools and, um, distribution mechanisms you're leveraging out here to, to share POIDH around?

[00:01:58] Mm-hmm. Yeah, so [00:02:00] big news that dropped today, uh, NARS DAO, they just launched, like, a separate front end officially, right? So if you go to NARS and you go check out their, uh, their main menu, you can find that they have, like, a bounty section now. And so that's an official alternate front end for POIDH, which is really driving home this, you know, we are a bounty protocol message more than we're just a bounty app, right?

[00:02:24] So, like, POIDH.xyz, it's the most popular front end for the smart contracts that we run on the back end, but anybody can interface with these smart contracts, and anybody can create a new front end, remix it, you know, host bounties that are just related to their DAO or just related to one specific topic. Um, so yeah, I'm, I'm really stoked on this 'cause, like, uh, you know, I, I've been, I've been thinking through, I've been building POIDH for a long time.

[00:02:51] It's m- it's my part-time thing. Full-time, uh, I'm an SEO consultant, but I wanna go full-time on POIDH, so, you know, I'm trying to raise funding at the moment, and [00:03:00] I've been trying to think about, you know, the most compelling messaging for it. And I really think this, like the protocol angle of saying, you know, Uniswap is the way you do trading on chains.

[00:03:10] The way everybody, uh, has agreed upon is, like, this standardized protocol that everybody uses, and most of the liquidity flows through there, right? Why can't POIDH be the bounty protocol, the coordination protocol for when you wanna pool money to get things done on chain? So I was, like, diving in and really honing that messaging last night, and then I wake up this morning and NARS has launched this alternate front end.

[00:03:36] Uh, so it's a nice little blessing. It's like, "Oh man, this is great." Like, I'm, I was thinking about this last night, and I wake up and, uh, it just kind of exists, and that's the power of these protocols that just fit together, these, you know, Lego, uh, internet money protocols that we have and, um, something you've talked a lot about too.

[00:03:54] Like just permissionless things, like when people can build and stack on top of each other, uh, [00:04:00] great things happen. A million percent. I think that composability factor is the coolest thing about crypto. It's, um, you know, I've built something and I want more people to use it. How do I get more people to use it?

[00:04:11] Other people can build on top of it, right? And I think that at a very basic l- layer, on the protocol level of crypto is one of the most interesting things that can- let the international community be able to leverage something. Because in the past there's been XYZ regulation or law or something in place to put a friction point to add permission steps kind of, right, to different things and pieces of software along the way.

[00:04:42] And as we are leveraging this decentralized web and we're creating protocols and of different capacities that anyone can build on top of, like you said, you just woke up and you see this like kinda gift, right? Like someone has built on top of my ecosystem. It's probably a really cool surprise to see in the morning.

[00:04:59] So [00:05:00] I love the idea of protocols. I think it's really cool to build something and then group it up into different sections so that the right customer for that, um, bounty, let's say, um, would be able to come in. So I know I've been using and leveraging a lot of We Them Media, um, topics for my channels because we're around that media and clips space.

[00:05:23] And I know initially you had POIDH, um, as this I want to manifest something in real life from digital money, right? And how do we do that? And I think now the evolution of POIDH has become I wanna get something done. Mm-hmm. How can I coordinate around that? Whether it's just me as a funder or whether it's me and a couple other people helping crowdfund this bounty, which is what we're gonna be doing later here today.

[00:05:52] Mm-hmm. So, um, I had a awesome opportunity to try playing around with POIDH. One of the things I've done and I hope to build more on [00:06:00] top of here is, uh, this website. Um, this is an initial, uh, website for the Zabal's POIDH, uh, clips. This one was specifically for our previous campaign for, um, Better Calls All Yaps with Kenny, episode 19.

[00:06:16] We did a clipping bounty there, and you can kinda see here some of the submissions people have done for past For past bounties. And one of the things I did in here was I created a very simple submitters board, and the beautiful thing about this whole ecosystem is the fact that I didn't need any of Kenny's permission to do any of this.

[00:06:38] Mm-hmm. I just went to the smart contract, I queried the smart contract for my specific bounties that I put up, and I said, "Look at these and look at all the people who have submitted, and take their, their data and put it on this page." Mm-hmm. And I actually even did an initial summary of who has hit the [00:07:00] requirements.

[00:07:00] We have 10 submissions, and I put up a specific rubric of what I wanted to see. And because anyone can put a claim up for anything, some of these claims didn't hit all of the things I was asking for, and I think that's part of the, the fun of it all as well, is seeing, okay, who's listening to instructions on a very basic level, and who's following these guidelines, and then who are other people that see something and see this opportunity and are just tossing something up, right?

[00:07:27] And I think the, the intentional, um, thought process behind some of the bounties has been the coolest thing for me. I've seen a lot of different incentivization campaigns in the s- Mm-hmm ... space of blockchain, and I've always felt as though unfortunately, because there's money involved, you have individuals who are just looking for money.

[00:07:51] They are not looking to add value in any way, shape, or form. Yeah. And what is the barrier that you're gonna be able to add in there to surface [00:08:00] the people who do wanna actually add value, right? And I think POIDH especially, um, transitioning towards a, um, a submission, um- Mm-hmm ... and, and, uh, and, uh, one person wins out of that style, I think has been a really powerful, um, marketing, uh, strategy for you guys because there's, um, a specific deadline that adds, um, some more information to a POIDH bounty where it's like, okay, shoot, no, no, this isn't just an open bounty, I can claim at any time.

[00:08:27] I need to do this by this time. Mm-hmm. And then the second part is you actually meet more folks out in the ecosystem because of people submitting. It's been really cool for me to see, oh, okay, there's this person submitting. Now let me check out their Farcaster profile. Let me check out their X profile.

[00:08:41] Let me learn a little bit more about what they're doing, and the fact that they submitted to what I'm building here means that I wanna take a look at what they're doing and see if I can come in and support them. So, um, I'd love for you to touch on anything I just shared there. I know it was a lot. And then we'll go into specifically the Zabal Games bounty and what we're playing around with here [00:09:00] and some of the awesome submissions we got.

[00:09:02] Yeah, that... When you sent me over, you know, that page that you'd made and what you'd gone through to judge things automatically, I loved it. 'Cause it's, it's so in line with what I've been thinking about with POIDH for a long time. It's hard to express and tell p- tell people Um, you know, when the app's first starting off and there's not a ton of users, but, like, if you think a couple steps ahead to, okay, if this succeeds as a place where communities are rallying, they're putting in money, people are cr- creating bounties, they're having conversations, they're connecting their social accounts too, right?

[00:09:36] They're connecting their Farcaster. Uh, they're connecting their GitHub. Uh, they are verifying with ZK Passport. That's something that we have where somebody can, you know, verify exactly what country they're with, uh, they're from using ZK Passport. Okay, so if you bring all these, these things together and then you add that AI layer on top where, you know, you're creating bounties and these...

[00:09:58] it's these very specific goals [00:10:00] and tasks, and then you're giving an AI free reign to just go, "Okay, now look at the 10 claims that came in and rank them for me," right? And it's something that's because you're defining specific tasks, the AI is very good at that, right? Yeah. And AI is great at that. Like, it's just like, "Oh, well, based off the criteria that you wrote here, and, you know, this profile, well, it's just a wallet that has no on-chain history and hasn't done anything before, and this image that they submitted looks like it's AI-generated.

[00:10:28] That's a zero. But, oh, this other claim, it's not just a pic, it's..." And people get caught up on this too. They think POIDH is just about the picture that people submit. And it's like, no, no, like we wanna build a full, robust social platform where they're looking at, "Oh, this came from a person with a wallet that's had five years of history on, uh, on Ethereum, and, uh, they have a, a Farcaster profile that has a high Neynar score, and they have an X that's attached," right?

[00:10:57] And so it's giving you all this stuff, but you don't have to do it [00:11:00] as the human, right? You... as a human, like it takes a lot of brain cycles to have to track this all down. Uh, yeah, POIDH is made for this- It's made to synthesize and standardize all this information for you, so it fits so well, uh, with AI reviews and, yeah, I was stoked when I saw that you were doing that 'cause, uh- Oh, that's

[00:11:20] yeah, it matches, it matches the vision. Someday I wanna have this stuff built into the platform too as well. Yeah. No, I love it. Well, the beauty of, uh, this space in is the, in this composable space is, um, a lot of other folks like me are open source builders, so all of this stuff is just out there for people to grab in the future.

[00:11:38] So- Yeah ... this is the evolution of that page. I made a, a new fresh repo just for POIDH, named it ZPOID for the Zabal, of course. Um, as we continue to build out our, um, ecosystem, and now hearing about this NARS, um, thing, I'm gonna have to reach out to them and see if we can also build that tooling 'cause it looks really cool.

[00:11:58] Yeah. There was one other sweet [00:12:00] thing that happened over the weekend too. I was talking with, uh... Do you know Femi from Farcast? Yes, yes. Cool. They just submitted an awesome submission as well for this. Yeah. And, and Femi reached out to me, and he was, he was like, "Hey, man," like, "I have..." I, I hear this a lot and I know.

[00:12:14] I apologize to everybody out there who uses POIDH and they're like, "The UI, UX, it needs polishing." I'm like, "Yes." "I totally understand." Um, but I was like, "Yo, if you got ideas, like, you don't..." He's like, "Can I hop on a call?" I'm like, "It's an open source GitHub repo. Like, go check it out. I probably have open issues related to some of the things that you're gonna bring up to me anyway.

[00:12:33] And, like, you can get after it too." And Femi, Femi's like, "What? I had no idea. Like- ... what? Open source? POIDH's a..." I'm like, oh man, like, we, we have... There's so much of our story that people just don't understand. And it was beautiful though 'cause he starts diving in and he's asking me questions. He's like, "Oh, y- you know, you have a skill file?"

[00:12:53] I'm like, "Yeah, here's this, the GitHub skill MD." And he's thinking about, like- different stuff that [00:13:00] he can add. And, you know, the reality of POIDH right now is, um, we don't have, you know, the treasury, the treasury amount is, is we're, we're working with, uh, not a ton of funding. So again, trying to raise some funding, if you're interested, reach out to me.

[00:13:15] Um, but I was like, "Yeah man, like I w- I would love to pay you for dev stuff but, you know, unfortunately at this point we don't have a lot of bounties out there for dev work." He's like, "It's okay. I just wanna work on something." And I realized, you know, I've been wanting to add a POIDH marketplace for the NFTs.

[00:13:30] Because if you're a, if you are a bounty creator, when you confirm your bounty, you collect an NFT. Oh. And there's always been this, this, like it's a feature I've been wanting to add, just hasn't been super high priority. But like I wanna be able to do that. Go list like, you know, the first 100 NFTs that I collected and list it out there for like 10 bucks a pop, and people can collect them if they want to as like historic memorabilia of POIDH.

[00:13:57] And Femi, like I told him about that. I [00:14:00] was like, "I mean, you could give it a shot if you want to, 'cause that's a separate section of the website that I've been wanting to build out and it's a good self-contained project." Yeah. Dude, he had an MVP running within like an hour and a half of me giving, like I just gave him the contracts, gave him the NFT stuff and I was like, "Yeah, this is, here's the context around how everything works."

[00:14:19] Um- That's so cool. So yeah, had to bring that up just 'cause we're talking about it. No, I love that. I, that's one of my favorite things about the space, is the fact that m- myself as a less experienced developer can send a GitHub to someone else and just send my files and they can give me immediate feedback on what I'm doing and where I can improve, and I think that's one of the coolest things of like, it's just so easy to, to do due diligence, honestly, on open source repos because it's all there, right?

[00:14:48] It's not this like, one of the biggest challenges I have with corporations today is the like lack of transparency, and I think that's why a lot of people in blockchain kinda like the blockchain because there's that, [00:15:00] um, public ledger portion of it. And I think I'm really excited to see, um, everyone's delving into agentic coding in some capacity.

[00:15:10] Like you said, he j- Femi just popped that, popped that in in a, in an hour and a half. And I think a lot of people are working really well in their silos right now, but the level up is really gonna be when we are doing some of these coordination pieces. So what I'm gonna request to you, Kenny, is let's get a space where me, you, and Femi come up to talk and we build something.

[00:15:29] Whether it's just me and Femi, um, building it out, or I'm helping support what he's already got ideated, or we're building the kinda idea I have for, for POIDH. It would be great to- Put a couple people into a room or a group and continue to think about how we can coordinate, um, to a bigger level without funding necessarily for developers.

[00:15:50] But having people who see a need, like me, I have something that I would benefit, net benefit from POIDH by building on top of it. Mm-hmm. So I would love to pop in and, and build some of [00:16:00] those things. So, um, I think the next, next one we'll definitely have to have a space with Femi, rock out, and ideate about some of these things.

[00:16:06] It sounds awesome. Yeah. Yeah, 100%. I would love to do that. Uh, I think that'd be a great... It would be... Are you talking about, like, a Farcaster space or a Twitter space? I mean, should we do it on, well- Twitter would reach more people. Well, well, I like, I'd do a Farcaster space, but, like, it keeps crashing my Android app every time that I use the Farcaster space.

[00:16:26] Yeah. It's, it's not fully fleshed out, but, uh, but the... We could do both. Yeah. I think that-that's the move- Okay ... more than anything. Yeah. So. No, I'm down, man. I'm down. And I was talking to, uh, the Vini App people- Yes ... uh, added POIDH functionality this week, too. Oh, really? So I feel like there's... Yeah, there's just a lot of good energy around composability, man.

[00:16:46] Exactly. I think that, that's it right there, is that there's a lot of good energy around composability. Um, I think a lot of people in the Farcaster ecosystem that have been here through the last six months- Mm ... [00:17:00] in some capacity have an understanding of, like, why an individual wants to be here for the long term.

[00:17:06] Um, there's this conversation happening right now that is about the, the daily active users on Farcaster, and the question I had was, how different is this than the general trend of crypto? And- Mm-hmm ... then immediately after that you had this idea for Bounty. And I think the cool thing about Farcaster is you have so many high autonomy individuals that are willing to put in work, um, and effort to something that they see value in.

[00:17:31] And the fact that you have so many of those individuals clustered together means that it's not just a social platform where people are sharing their thoughts, but they're actually sharing their actions and what they're f- what they're doing on top of their thoughts, and I think that's one thing that breaks it out of the traditional social, um, space because a lot of that is just conversation.

[00:17:50] That is all that's happening, and there's not much happening outside of the conversation around that app, right? Mm-hmm. Mm-hmm. So. 100%. [00:18:00] And yeah, I, I am very interested to see what the breakdown looks like for Farcaster versus crypto Twitter as a whole. 'Cause yeah, crypto Twitter as a whole is not in a great place.

[00:18:11] One of my buddies, I onboarded this guy- He first got into crypto, it was January... Jan- was it 2021? When was Top Shot popping off? That was January 2021-ish, right? Yeah, that was like the NFT bull season. I gave up '23, so. Okay, okay, yeah. He got in 2021, and he's been my one buddy who like, he's brow- he browses crypto Twitter with me, and we send memes back and forth and stuff, and he just...

[00:18:39] I gotta... I woke up and there was a DM from him this morning. He's like, "Man, like I don't even open Twitter anymore. Like, it's not even, it's not any good. The algo doesn't give me anything I'm interested in, in with the crypto stuff." And it's like, yeah, man, I... So it's, people are down, rightfully so. Like, they're worried about daily active users on Farcaster.

[00:18:59] I get it. [00:19:00] But yeah, man, it's not good anywhere, so. Exactly. There- My, my hypothesis if we do this data analysis is it'll be, you're, you're about right, that it's like, it's not as bad as people wanna make it Yeah, and I think another part why, like, I don't feel it personally at all is 'cause, like, I have something to work towards that- Mm-hmm

[00:19:18] is net. Like, we are getting new users just because, like, there's new people on Farcaster. I think people always, like, are looking at these, like, daily active users, but out of those 5,000 people, how many people do you actually talk to? Like- Mm-hmm ... probably at maximum 20%. That means there's 80% of those people that even though there's, like, a small number, there's still people to go talk to and reach out to and, like, connect with.

[00:19:39] Um, plus the, like, like you said, the builder energy, the composability. The sentiment around outside of Farcaster is negative, but around the space and the industry, everyone's really positive in what they're doing to make the world better. They're still doing that, whether or not the market dictates that or not, right?

[00:19:57] You're still building POIDH, I'm still building the ZAO and the [00:20:00] Zabal. Whatever the market dictate, doesn't matter. We're still gonna continue doing that. So- Absolutely ... I think I've found more people like that, higher signal. I think that those are some of the big things. But, um, let's kick it over to, um, the Zabal Gamez ad- Mm-hmm

[00:20:14] because we had some awesome submissions, and I just wanted to quickly peep through it, shout out some folks. So this is my third bounty now with POIDH, and we created a Zabal Gamez ad. This is the first time I went through and I made sure to add in as much information as I could to give the individual who is trying to complete the bounty the best chance they could to create the highest quality video.

[00:20:40] So one of those things was creating a pre-c- pre-cleared brand kit, as well as some direct download links to some of those pieces. And it was really cool to see some of these submissions. So we got eight submissions in total. We got Collins, we got Aweesha, Aweesha Khan. Uh, we got Vipul Pariwal. Oh [00:21:00] man, I apologize if I bundled some of those names.

[00:21:02] We got Femi- I pulled Pariwal in my head. I've seen... A lot of these guys have, have claimed a lot, so I've got pronunciation- Perfect. Okay, sick ... down pat. So that, that's another cool thing, is I'm meeting new people in the POIDH community through this- Wow ... which I, I love that. So we got Taku0x as well. D submitted, Profiane, and Joey as well, who won our first, uh, claim.

[00:21:24] Yeah. So awesome, like, seeing these submissions. I mean, two weeks, uh, for me, uh, slowly seeing them come in, people sharing them on Twitter, getting it out there. People asking for more info, right? 'Cause Femi actually reached out and asked, "Hey, do you have an instrumental version of this? I w- I like, I like the song, but is there a way we can get an instrumental?"

[00:21:44] And then, you know, less than 24 hours we got that over to, to them and they submitted it. So it's just, I'm really excited to see what we can do here together with, like you said, the surprises. The periods where you, like, put something out there [00:22:00] expecting something, but then getting something completely different, but it being, like, way better than you could've imagined.

[00:22:05] And I think that's where I'm at with POIDH where- Mm ... there's just, like, these random auspicious moments that happen naturally just because I've put this, like, thing out into the world. Mm-hmm. Whether that's connecting with an individual one-on-one, whether that's seeing the joy that winning a bounty makes to someone.

[00:22:24] I think Joey had mentioned on the first one he hadn't won one, so- Mm-hmm ... like that meant a lot to him. So I am excited to see what we can do here. Um, we're getting to about 23 minutes, so I wanna make sure I create our next claim, show how easy it is to create a claim. So we're gonna do that here, and if you wanna share anything else, Kenny, as we're getting this started, feel free No, I mean, I think you're- you are setting the highest tier of example for how to run these bounties, so I can't thank you enough, um, 'cause you're being...

[00:22:55] And it, it comes from doing, it comes from using the protocol too, right? And like, so you're seeing [00:23:00] it play out in real time. Like, "Oh, okay, I need, need as many different, um, details as possible." Thank you also for pushing me, 'cause part of like you're doing these great bounties, and we weren't, we didn't have markdown support.

[00:23:11] I was like, "All right, I gotta fix this shit," 'cause- ... yeah, like, he- he's out here putting in all this effort, and like we're not presenting these bounties as best as we possibly can. So, um, that was another, uh, big announcement last week for anybody who missed it. You can now do markdown support. We'll give you the preview while you're making the bounty as well.

[00:23:29] Um, yeah, trying to, trying to improve this as much as we can, make it easier for bounty creators. But yeah, I... This is gonna be a tough one. Also, I will say, uh, whoever you choose as winner, um, if you wanna send, you don't gotta announce it right now, but give me your three runners up as well, and I'm gonna send $5 to each of them.

[00:23:48] Awesome. And then I'm also gonna send at least $1 to everybody who sub- 'cause everybody's claimed, like these were good. So I actually do that already. So I'm using, and this is com- part of the composability- Mm-hmm ... so I'll quick- quickly go over that. So [00:24:00] I created an Empire Builder, um, an Empire Builder leaderboard with the people's submissions.

[00:24:09] So under the Zabal, under Empire Builder, under leaderboards, we have a POIDH submitters leaderboard. I'm gonna refresh this. I don't think it actually has the third one yet, but the idea here was that I was gonna be able to just give everyone some Zabal for every time they've submitted a different POIDH bounty for this ZAO.

[00:24:29] So I'm trying to essentially toss, you know, whatever the share of Zabal that I'm doing split between everyone is. Mm-hmm. But I've been doing the same thing, where it's like, man, just for submitting, I wanna make sure that I appreciate you for, for just being around here and putting in that effort. So this is how I'm doing that.

[00:24:46] That's kind of why I created the website, is I didn't wanna have to go through every single individual and send a dollar or whatever, right? Mm-hmm. So I tried to find an automated way to do it, and that way was through Empire Builder, so another part of that just composability of this whole space. Sick.[00:25:00] 

[00:25:00] Sick. Awesome. So let's, uh, let's create this bounty and show how easy it is. So I have this bounty pre-prepared actually, so I'm gonna copy it in. Um, I definitely recommend, uh, planning it out and I've sent every single one of my bounties before I've confirmed it over to Kenny, because Kenny's always giving me one or two ideas of like, "Oh, shoot, maybe you should think about this- Mm-hmm

[00:25:20] or maybe you should think about that." So I always recommend that. Um, bother Kenny, because we wanna make it as good as possible. Yes, sir. Boom. So I'm gonna start on the WeThem Media page because I'm gonna put it under WeThem Media since we're on the WeThem Media team. Um, I'm gonna press Create Bounty, and we got four boxes, one already filled out for WeThem Media.

[00:25:40] We got a title, description, and reward. So I'm going to go over and copy my title. So it's gonna be called the Zabal Games Open Pot And what this is gonna be is I'm gonna copy our raw file, and boom, we can just go to preview and take a look at this. So the Zabal Gamez [00:26:00] open pot, this is gonna be essentially for anyone who submits during the month of July.

[00:26:05] We'll be able to split, um, this open pot however much it becomes over time. This was an opportunity for me to give back to all the people who submit during the submission phase and may not make it all the way to the curation phase and earn some of those winning dollars. So even if it's just my 5, 10, $15, um, or anyone else that's out there that wants to add to this, that's kind of the beauty of just showing off this tech.

[00:26:29] So I'm gonna put, um, the, the next box here is the rewards. I'm gonna put .005. It's about $9.10. Uh, my goal here is to add more along the way, 'cause this one isn't actually gonna be claimed until the end of July. So this one's gonna be open for a little bit. And then you have the option for open bounty or not.

[00:26:48] I don't know why you would ever choose to close your bounty personally, but, um, it seems like it's an option. And then I'm, uh, signing the transaction. I don't think that showed up there. But boom, bounty created [00:27:00] successfully. You can share it right, right off rip. I'm gonna share this later, so I'm gonna close out.

[00:27:05] But boom- Mm-hmm ... that's it. It is there up and live. Anyone can add to it. Um- Yeah ... technically anyone can claim to this one, but really the claiming is, um, the fact that you have submitted, uh, on the Zabal Gamez website. So, uh, this will be more of a manual claim. Gonna be playing around with that. But again, another way to just try and test the different functionality of POIDH, uh, break it and, uh, and have Kenny come and fix it.

[00:27:33] Most definitely. Most definitely. Uh, god, that was good. Thank you so much for giving a clean, uh, demonstration of how it all goes down. I've been thinking, what do you think about, uh, we can tr- I know we're running out of time here almost, but I have been thinking, like I, I kinda wanna add a prompt flow at the beginning of create bounty.

[00:27:49] So almost like, oh, don't know what bounty you wanna create, and then like you could just type in be- and because we're getting so good with these markdown generated ones, and I have LLMs trained on the way that bounties should [00:28:00] look, I could probably just feed it all your, your history. I'll be like, "Look at this guy.

[00:28:03] Look at this guy's history. See how he does bounties, and then just make it exactly like he does." Um- I love it ... yeah. Ken, thank you. Well, it's the beauty of, uh, using these systems as tools, right? So, hey, I appreciate you so much for coming on, joining me, letting me showcase and show off POIDH and how we're using it.

[00:28:20] Thank you for coming in and sharing. Um, where can people catch up with you if they wanna catch up with you, Kenny? Uh, reach out to me on X, I'm @kennyistyping, on Farcaster, I'm Kenny. Uh, always down to chat, always down to collab. And if you have a bounty idea, yeah, send me a DM or just tag me, 'cause I wanna help you get that shipped, and I want to help fund it, and I wanna help promote it to make sure other people fund it.

[00:28:44] So, um, yes, uh, reach out to me if you, if you wanna make something happen Awesome. I love it. Thanks Kenny for joining in. Thanks everyone for coming in and chatting. I'm seeing some of these chats now, so appreciate you guys and we'll catch y'all soon. Bye. See yous [00:29:00] all

[00:29:00] ZAO keep it a Zali. From the ZAO Dow come proper. We eat rappers for lunch and if some left, we eat 'em for supper. I keep it a ZAO, homie, a Zali. Heard the streets calling E3. Iron Man to a Simonz, now the whole world hear about me