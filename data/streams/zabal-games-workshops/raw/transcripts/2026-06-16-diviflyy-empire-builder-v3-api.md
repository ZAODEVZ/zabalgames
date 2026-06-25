---
title: ZABAL GAMEZ Workshop w/diviflyy from Empire Builder
show: ZABAL Gamez Workshops
presenter: Adrian (diviflyy) @diviflyy
org: Empire Builder
date: 2026-06-16T00:00:00.000Z
format: Conversation + live demo, recorded
language: en
track: builder
youtube: https://youtu.be/P4ypb4jvpog
topics: [Empire Builder, leaderboards, boosters, mini apps, Farcaster, API]
---

[00:00:00] Visit Zabalgamez.com. That's Z-A-B-A-L games.com and sign up Decentralized energy, let's talk about ways What's up? What's up, everybody? What's up, G? I ha- I'm back for another Zabal Gamez workshop. We got Adrian, AKA Diva Fly in the building. What's up, Adrian? How we doing today? Hey, guys. Hey, how's it going? Good to see, see you. Good to be here. Um, yeah, it's great to be here. That int- intro got me pumped up. Is that you, Simmy?

[00:00:31] I love it. It's not me, no. It's, uh, our ZAO intern, Iman Africa. Yeah. He made a Farcaster song. Uh- Yeah ... that was his intro to Farcaster. I was like, "Yo, put this out on Tortoise. Go get involved." And it's been a great opportunity for him to meet more folks in the community, so it's been a blessing to have him making some awesome, uh, anthems for us.

[00:00:51] So, yeah. Absolutely. And that's one of the really cool things about Farcasters, you meet people from all over. Yeah, absolutely. Yeah. No, it's great to be [00:01:00] here. Great to... Excited to walk through some of the nitty-gritty stuff for Empire Builder. I know Jordan was on, uh, a previous, previous session a few weeks back and gave a long introduction over an hour long introduction to Empire Builder, an overview, very thorough.

[00:01:17] So yeah, I'm very excited to show, show more of the... more of how to, how to build with Empire. Awesome. Well, I am excited to see what you got to show for us, so I'm gonna just pull up your screen, and we'll just rock right into it. Let's do it. Um, all right. Okay, cool. I'm just doing the, the old mirror, mirror on mirror.

[00:01:38] Um, so yeah, I'll just start off with the, with the site, how to access the docs. So basically what I'm gonna do is just walk through initially, um, how to access the docs, what endpoints are available, what the, what the point of us creating, uh, all our endpoints in the first place actually is, um, and sort of what they enable and [00:02:00] what the purpose of them is.

[00:02:01] So if you go to empirebuilder.world and go down to the bottom, you'll see the docs tab. Um, that's p- pretty much the best way to access them. They're not really gonna be surfaced anywhere else. Um, so for the docs, essentially there's, you know... it introduces what Empire Builder is, but Jordan covered a lot of that.

[00:02:22] Um, basically the way we look at it from a more technical perspective is that it- it's the community layer modular framework that serves as the community lay- layer for token-based projects. These are a bit outdated. Now we know it doesn't even have to be a token-based project anymore. Um, it can be, you know, anything influencer-based creators and, you know, just anything you wanna build.

[00:02:46] It doesn't have to be token-based anymore. Um, the key concepts, Jordan again probably went over them. Really what I'm gonna be focusing on for this one is the integrations, the tools and APIs into, into, to connect [00:03:00] Empire logic to other protocols. Um, this is really the purpose of, of the docs and why we built out all this doc- uh, technical documentation in the first place, and I think is really something that as we get into the next stages of, of Zabal Games will be, especially the hackathon stage.

[00:03:17] Sorry, I keep flicking back to make sure I'm still alive, uh, alive on sharing because I'm on hotel, um, hotel Wi-Fi, so I hope, uh, I don't drop out. Let me know if I do, ZAO. Yeah, for sure I will. Um, yeah. So, um, yeah, basically in terms of integration patterns, really the two... Well, the, there's many int- ways you can integrate with, um, Empire Builder.

[00:03:45] The most obvious way is to just simply go to our interface and launch an empire, which is, uh, I would say 99.9% of ways that people do it. And we gave a demo of that in the first- Yeah ... round with [00:04:00] Jordan. Yeah. So you can go back to that if you wanna check that out as well. Yeah, exactly. Absolutely. Um- And yeah, distribute, uh, partner protocols.

[00:04:09] So distribute incentives to and from other platforms as well. Um, there wa- we have had a few of, few of those. Um, basically I would say at the moment, the way that we've structured the docs after V3 and the integrations, these three are almost, almost go hand in hand. Um, part- like you can just become a partner and/or a white labeled, um, partner by just going to the docs now.

[00:04:37] It used to be separate, but now it's essentially so robust that anyone can sort of partner with Empire Builder simply by using the current docs. Um, so yeah, I think what I, what I really wanna focus on is the use of Empire infrastructure under your own brand and the API access to pull leaderboards rank and data into your dApps, however you [00:05:00] need to, need to do it.

[00:05:01] Which yeah, we saw a lot of this happening early days of Empire Builder. Um, Bizarbest was a great example. He created his own, um, Empire Builder app directly, uh, mini app on, on Farcaster. I think it's still live. I think, um, the guy who built it might have dropped off. I'm not sure if he's still hosting it anymore.

[00:05:22] But yeah, there was a lot of that going on early days. Um, and I know ZAO yourself have integrated into your, your mini apps as well. Um, so great, um, use cases there. Um, today I think for this, what I wanna focus on is the public endpoints, the free-to-use endpoints. Um, we've definitely seen, I was, yeah, about to say to ZAO earlier is...

[00:05:46] to ZAO, sorry, uh, is that- Like, there's been a real uptick in, like, free endpoints essentially to use, especially with Hypersnap now. Um, so there's a lot more you can [00:06:00] do, especially within the Firecaster ecosystem, uh, just using Hypersnap without having to pay the fee for Neynar and such. You can just use Hypersnap and get all the info you need and then, um, direct that into the Empire endpoints as well to get all the info, to surface all the info you need there.

[00:06:18] Um, so yeah, I think this session I'll focus on the public endpoints, the ones that anyone can just jump in and use. And in future, uh, in a future demo, um, we'll focus on the authenticated endpoints, which you need an API key just for, um, security measures at the moment. We're looking to make, you know, eventually make all of these public.

[00:06:39] Um, but yeah, just for now, they need to be gated, um, to an API key. Um, but yeah, for the hackathon we can give out some API keys for people to use, but yeah, for a future session. Um, so I'll just do a quick run through of the public endpoints. Top empires, that's essentially your, um, [00:07:00] your top empires on the, on the leaderboard here.

[00:07:02] Zabal, I saw, I see- Oh, number two ... into number two there. So when you surface, surface that endpoint, you'll get a list of the top empires. Um, boosters by empire, so all the boosters for an empire will get surfaced. Um, ZAO, you've got a couple boosters, so those will- Oh, that's really cool. So now I could publicly query everyone else's boosters in different empires and be like, "Okay, look at these," and plan out some ideas for mine that I could use, right?

[00:07:31] Yeah. That's cool. Yeah, absolutely. You can, you can surface any, any empire's boosters. Um, I guess the, the one thing I want to add is, um, when you're surfacing, you do need the, the empire ID. So really the, the first endpoint to start with is always, um, get empire essentially. Um, and to get your empire, you need the empire ID, and your empire ID is [00:08:00] essentially just your token address.

[00:08:01] If you've launched an empire with a token, it will be the token address. It's up there in the URL. Um, but the thing is, because we started out with just token addresses and now we've moved to also tokenless, there is a bit of a, a overlap, like, or a bit of a, um, bizarre like, um, logic there that we still need to work out the, the ni- the nitty-gritty of where a tokenless empire, like say for Zabal Gamez, um- has a different identifier because it doesn't have a token.

[00:08:37] So basically you just need to go to the URL of your, um, empire and, and find what your empire ID is, um, to then use for these calls. Um, but yeah, we will eventually find a way to make it in- So if I go from a tokenless empire to a token empire, will that empire ID change? It won't, it won't. Okay. It will [00:09:00] ch- it will stay as that original.

[00:09:01] I got you. Okay. So you don't have to then update all your endpoints. I was curious, yeah. 'Cause that, yeah, that would be a pain in the ass. So yeah, definitely not. Is there... Can I ask, is there a reason why we can't all... You haven't gone down the route of also having it be just like a simple forward slash and then name of empire, and if there's two with the same name, doing dash one?

[00:09:24] Yeah, yeah. There's, there's a lot of roots that, like, I mean, as... I think you just hit the nail on the head as to why. It's because people just name, name them the same name probably a few too many times, right? Um, and then you end up, um... So the unique identifier here, um, for Zabal Games for example, this is actually the ending of the address you used to look- Yeah.

[00:09:47] I can tell ... so it's more, more, um, obvious, um, identifier, right? It's not just like Zabal Gamez one, Zabal Gamez two- And actually, so you just put... That's what you put. Okay, cool. So you did actually. I'm seeing that now. There [00:10:00] is some- Yeah ... some logic behind the madness there. Um, and yeah. Anyway, continuing on, um, distribution records of the empire, the rewards of the empire.

[00:10:10] Wow. Um, so the entire reward history of that empire, um- Distribution records is each individual users, how the lifetime amount that they've earned from their Empire. And, um, yeah, and of course the actual leaderboards, which is, you know, the, the main attraction, I guess, for Empires. Um, and basically nowadays I'm not gonna sit here and, and like walk you through like a school teacher, this is how you, you know, add this logic to your app.

[00:10:46] Because the way to do it nowadays is just to create a prompt that you feed to Claude Code. Um, so that's essentially what I've done, um, is, as a bit of a [00:11:00] demo, I created this... I literally created this, um, in a hour or so yesterday afternoon. Um, and this is a Zabal Empire, um, mini, uh, snap. It's a snap, right?

[00:11:15] That's what they're calling them nowadays, the young kids. Um, and essentially it just surfaces your rewards. As we said, it's a whitelisted, a white labeled, Zabal branded thing. I put Powered by Empire at the bottom because, you know, I am biased towards Empire Builder. Um, and you can just see the rewards that have been distributed.

[00:11:38] Um, you can see your rankings, your current leaderboard rankings within ZAO, and where you rank on all these leaderboards, and you can see the boosters for the Zabal Empire. Um- That's cool. All in one right there on the feed. All in one right there on the feed. Basically, I mean, I've sort of branded this Empire Builder way for examples of Zabal Games.[00:12:00] 

[00:12:00] You can simply just make a snap, make a mini app that uses the entire Empire stack to show how many rewards that person's earned, how, what their rank, current ranking is for a certain leaderboard. Um, you know, a- as well as, um, all other events. For example, some that haven't been explored here are, um, Empire rewards.

[00:12:23] So what rewards have been paid out for, for this game, for this particular event, right? Um, so you can surface all, um, all reward distributions as well that go through Um, for, for anything. I know, uh, Disky and Fight Club have, have been using, um, Empire, uh, for their rewards, um, their in-game rewards. So, um, they've been pulling that in as well for their leaderboards.

[00:12:51] Um, and another thing in future, a bit of a spoiler as well, we're gonna have multiple treasuries. So right now, each empire just [00:13:00] has their one treasury, but there will be a new button here that you can create a new treasury. That's really cool. Um, and you can split up the rewards for different- Oh, I had a question.

[00:13:12] Can we add boosters of different chains? Yeah. Yeah, absolutely. So you can add boosters- Because I think- ... from- Well, I, I mean can we add to the additional chains that we can bring boosters in from? Uh, yeah. So you can add boosters from, uh... Oh, so like we currently have two- I'm requesting, I'm requesting you do that- I g-

[00:13:34] is what I'm saying ... we have even more, so. I gotcha. Like, like it'd be nice to be like any EVM. Yeah. So right now we're, we're focused, like, the, the, I guess the biggest, um- ... thing is that there just wasn't really enough demand- Well, 'cause like I could bring up- ... for any ... an old Polygon one, right? Polygon. Like from somewhere else, right?

[00:13:56] Like, or, well, Optimism for me. I have my respect [00:14:00] on Optimism. Yeah. 'Cause govern- my governance for my DAO is on Optimism. Yeah. 'Cause like that's where I, I believe, like, the governance makes sense, so- Yeah ... that's kinda- Yeah, okay. Yeah. Well- So those are the two. We do, we do support in all other aspects, um, Monad, uh, Polygon, Optimism, and other, uh...

[00:14:20] What else? There's a BNB chain I think as well. Um, we do support that. Um, but yeah, we haven't, like, expanded it for the booster recognition quite yet, um, just because it takes a little bit longer. Like the latency for refreshing leaderboards is already quite long, so to add another chain in just increases that by, you know, ever so slightly, and then adding another chain and another chain, and it's just about like- It might be worthwhile, I don't know if you can or you can just do a fake one or like a pseudo one, but having a bar when you refresh would be great.

[00:14:53] So it's like as you're... Like I would love to see- Yeah ... what your query, you know what I mean? Yeah. Like, like you know how [00:15:00] Claude code, sometimes you're like, "Okay, like I wanna go into the details." Yeah. Yeah. Right? Like that kind of thing visually, like as a dropdown again, would be really cool I think. Uh, uh- Yeah

[00:15:08] especially 'cause like if it does take longer, right, for, for different things, like I'd be a lot more willing to know what it's doing and like how much longer I have to wait or like if I could walk away or something, right? Yeah. That's true. That's true. I think the ultimate goal in my mind is to get it to like zero latency, running our own- Yeah

[00:15:26] own nodes in order to like get it just- Is there a way it can auto refresh or do you have to manually come in and refresh? I just- It currently auto refreshes once every 24 hours- Okay ... um, if you haven't been on the page. So you might not really notice it, it's just happening in the background just in case.

[00:15:43] 'Cause a lot of people, we noticed a lot of people- ... were forgetting to refresh and they'll be like distributing to a leaderboard that's like three weeks old. So now we just like, yeah, in the background we'll refresh it for them every time- That makes sense ... they land on the page. Yeah, just, just in case, you know?

[00:15:57] That's cool. Yeah. [00:16:00] Yeah. No, 'cause I have thought about that, 'cause a couple times I was like, "Oh shoot, I didn't refresh before I distributed-" Yeah. Yeah ... "which I should have," which makes sense. Yeah. Yeah. So it, it would've refreshed for you. That's cool Yeah. So I think, yeah, for me, like, I guess- What... Okay, so in these, uh- Yeah

[00:16:18] the second half of this, what are the things you wanna see people build with Environment Builder? Yeah. This is, this is what I was gonna jump into. So basically, the way I've, I've built this Snap, right? Is, you know, I was just playing with Claude and trying to get it to create this Snap. And the way, as I said at the beginning, there's so many free available things.

[00:16:43] So I will share this Snap. I might actually, I'll post it in the comments- Amazing ... right now, so everyone has access to this I still can make long casts. My Farcaster Pro subscription hasn't run out yet. Sure, maybe. [00:17:00] What did that say? Maybe it said I, I couldn't. Who knows? Um, let's see, did that actually work, that comment?

[00:17:05] Yeah. Okay. Um, so yeah, when, for example, the Farcaster Snap spec, LLM's text. Got it. Hypersnap, free API, and then Empire Builder. You've got the Empire Builder skill. Um, Empire Builder skill, again, you can just get from the, the website and just copy paste that into your LLM or copy paste the whole thing. It will, it will know what to do, um, from there.

[00:17:34] It's incredibly, uh, useful nowadays, um, especially if Fable comes back. I mean, this is probably over-engineered, uh, prompt for Fable. Fable, you could probably just write this first bit and it'll figure it out. Um, but right now we're still stuck with Opus 4.8 for a little while longer, um, until the government releases Fable again.

[00:17:58] Um- [00:18:00] Yeah. So, um, yeah, basically just tell it to- Amazing ... I copy pasted this in... Yeah, if you copy paste this, I already tested it- So copy paste this into your prompt and to say Zabal or Zval Games- Yeah ... and let's build something cool. Yeah. Yeah, so if you copy paste this, this will, uh, create identically what I just created.

[00:18:22] Yeah. Um, you'll need to put your Empire ID here. So I put the Za- uh, Zabal one there. Yeah. So you put yours. Um, and then from there you can just iterate. What I would like to ultimately see is use of other endpoints. Like really I think going back to the point is, um... Wait, wait, wait. Ecosystem participation?

[00:18:47] No. Where was it? It was integration patterns, is using Empire infrastructure under your own brand. So this is what I really like to see, um, ultimately is like a [00:19:00] mini app or- The interoperability side of- Yeah ... of the ecosystem being lever- Yeah ... leveraging your tooling. Yeah. So for example, like the best example was recently, um, Flip, uh, Floor, Florian.

[00:19:11] Yeah. He created a app called Empire Draft. So you go on and you can draft- Yeah ... the empires you think are going to, are going to win, uh, within the next week. So basically make, you know, the highest increase in market cap. Um, so you use the Empire endpoints, all the public ones, fetch the top empires. You, you can draft which empires you want.

[00:19:36] I dr- drafted these ones. Um, and then- Yeah. Right now I think it was like, yeah, just a side project. Uh, he's already, uh, like, um, sort of sunset. But yeah, it was really cool when he, when it, when he, uh, launched it and yeah. In Vault now, and basically every time you draft, you pay a small [00:20:00] fee, and that fee goes to purchase the tokens that you've drafted, like 20%, 20%, 20% if you pick five, right?

[00:20:08] Um- Absolutely ... so yeah, just using the, um, the Empire infrastructure to create an app, um, on the back end. And yeah, right now I think just any, any sort of creative thing using public endpoints, um, would be great to see. Yeah. Especially like there isn't that much dynamic. Like I w- I... When we get into the, the authenticated ones and we start giving out the API keys, there's a lot more experimentation that can happen, um, and a lot more ideas that I want to show, especially with agents.

[00:20:43] Um, perhaps that's, that's like a good, um, task that I would love to see is like a little agent that lives on Farcaster, a social agent that when you tag it- Ooh ... it pulls all the information about your empire. I like this. It's your [00:21:00] own personal assistant. So if someone wants to know information about your empire, you just tag @Zabal Bot.

[00:21:06] We had this with Tiny Bot, uh, for a little while, but it was very limited, um, in its capabilities, and they eventually sunset that. But this, these bots, um, again, we're only using the public endpoints and the way that it's set up now, these bots could easily pull all these endpoints, have a knowledge base of your own empire, and basically if someone tags it and says, "Where am I placed on this leaderboard?

[00:21:31] How much have I earned?" Yeah. That's cool. And it can just tell you- I like that ... that you've done this. Yeah, we could definitely make that as part of the submission. So 'cause we could just make one for the Zabal Games Empire, simply make it open source and anyone else could just swap their leaderboard ID as a, you know, environment variable, whatever parameter, and boom, bap, they, you know, Sam's your uncle.

[00:21:53] Yeah, exactly. Bob's your uncle. Sam's your uncle, Bob's your uncle. Everyone's your uncle. Um- Uh, that's cool. I think, uh, [00:22:00] what's your favorite couple of authenticated ones that you wanna chat about here in our last couple minutes? Yeah. So I think for me is the deploy tokenless Empire one. Uh, that's the one we use in the snap.

[00:22:11] Um, right now it's literally a one-shot, um, deploy. Um- Yeah ... you just need your API key and that's, that's it. Just put, you know, whatever. Put your name, the name of your, um- W- what you want the name to be, Glink, um, whatever you want it to be, and that's, that's it. Um, and it will deploy an Empire for you all set up.

[00:22:33] You can also do it for your FID. Um, and basically from there you can then start setting it up. Again, I lean to the agent thing. Um- Like really getting an agent to be able to, like, create its own empire, then start taking actions, thinking for itself essentially about what would make a good leaderboard- Absolutely

[00:22:54] then creating that leaderboard. Yeah, yeah, yeah. What you need- Kinda like what Vini app did with the Vini appathon, [00:23:00] right? Yeah. They had Vini choose the winners, right? Yeah. So that would be very cool because the deployment side of using an empire- Yeah ... with the winnings. 'Cause like this could easily be something we do for our distribution as well, right?

[00:23:14] So I think there could be a couple of fun things we could play with and, uh, and do on that side. I'm excited. Uh, thank you for coming on. I think there's so many more things we could tap in and touch on. Yeah. We'll definitely have to get you in as we build, um, this idea and many more with, um, with Empire Builder here.

[00:23:32] Yeah, absolutely. I think, um, yeah, this is, this is sort of what I'm also trying to do with, um, with the Glonky bot as well, is get him to sort of roam around, see what's happening within the Farka ecosystem, who's doing, uh, Empire Builder aligned things, and really find ways to create leaderboards for, for certain actions, uh, within the empire.

[00:23:54] He will have access directly- Yeah ... to create leaderboards, to, um, add boosters, see if [00:24:00] someone's doing good things, remove boosters for people that have stopped, um, engaging with Empire, and just really be the moderator of the empire. Um, like sans actually distributing the rewards, which, um, right now I would recommend not giving your agent, uh access to.

[00:24:19] Um, but yeah, eventually, like potentially even that. Well, one of the other things that could be really cool is if you could gate the per- that's why I imagine why you have the treasuries. Yeah. Multiple treasuries is gating a specific treasury to a specific guardian. Yeah. And that would also allow you to have more individuals that are like semi-guardians and have some permissions.

[00:24:40] Like, s- giving certain permission to certain things could be really valuable. So excited to see, uh, what, what you rock out. Yeah, absolutely. No, I'm excited to see. Like, yeah, if there's any ... Yeah. There's a, there's a lot of things that I think can be, be done with these endpoints. Um, there is like a bit of creativity, and I think we need to dogfood a little bit [00:25:00] more to really, you know, show- Totally

[00:25:02] the capabilities, um, which is, yeah, on me and on YaboZaka for not, uh, not doing as much whilst we're doing a million other things. But- Yeah, here, I can, I can turn it off if you wanna switch back. Of course. But, um, no thank you so much, uh, Adrian. It was- Yeah ... uh, a pleasure to like just dive in a little bit more.

[00:25:20] I learned a lot. Yeah. I'm sure a lot of other folks will, will, will have learnt, uh, a lot I think. Uh, it was good to see a couple of people chatting. I know, uh, a couple people specifically that I wanna share this with because, uh, yeah, I think there's so much we can do with Empire Builder. I think you guys build a really cool ecosystem, and I'm excited to, to leverage and level it up and use it in what way possible we can here, so- Yeah, absolutely.

[00:25:45] Anytime, anytime you need anything, just let me know and I'm, I'll jump in and, and help you out and do anything we can. That's what we're all about here at Empire Builder. It's like building up, building up people and building up projects that are building. A million [00:26:00] percent. Thank you, Adrian. Appreciate it.

[00:26:02] Uh, we'll catch you guys all later. And, uh- Thanks, guys ... do, oh, do you wanna share where people can reach out to you as well, otherwise? Uh, yeah, you can reach out to me on Farcaster at Divi Fly, um, as well as, yeah, on Telegram or really join the Discord, join the Empire Builder Discord. Uh, you can find that on, um, Empire Builder site down the bottom.

[00:26:22] And then, yeah, ping me or Jordan there. That's probably the easiest way or the best way to reach us or just comment on, on some of my, my posts if you're on Farcaster or Twitter if you, if you're really, if it's something really urgent and you can't reach us, I'll notice it then. Awesome. I love it. Thank you, Adrian.

[00:26:40] Thank you. Appreciate you for joining. Awesome. Thanks, man. Cheers. Enjoy.

[00:26:43] ZAO keep it a Zali. From the ZAO Dow come proper. We eat rappers for lunch and if some left, we eat 'em for supper. I keep it a ZAO, homie a Zali. Heard the streets calling E-3. Iron Man to a Simonz. Now the whole world hear about me