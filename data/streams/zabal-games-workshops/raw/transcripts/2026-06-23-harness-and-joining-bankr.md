---
title: ZABAL GAMEZ Workshop w/Saltorious from Bankr
show: ZABAL Gamez Workshops
presenter: Saltorious @saltorious.eth
org: Bankr
date: 2026-06-23T00:00:00.000Z
format: Talk + Q&A, recorded
language: en
track: builder
youtube: https://youtu.be/YmRfDeJyl0M
topics: [Harness, Bankr, Building tools, Onchain tools, Farcaster]
---

[00:00:00] Visit zabal games.com. That's Z-A-B-A-L games.com and sign up Decentralized energy, let's talk about ways What's up? What's up, everybody? We're back for another Zabal Gamez workshop. Oh man, my camera's going crazy, but we're back. We're with Saltorius. How we doing today, Saltorius? I'm doing good, man. How are you? Dude, I'm doing phenomenal. I'm excited to dive into some of the things you built here today. Um, dive deeper into Harness and, uh, and your new job at Banker and, uh, tap into how, um, how awesome Banker is and the different things that you can do there as a builder.

[00:00:41] Hell yeah. Absolutely. Let's get into it. Awesome. Here, I'll pull up my, uh, your screen here, and we can just rock out. If you wanna share a little bit about yourself and/or Harness, you know, feel free, um, as we're starting, or you can do it while, while, while we're, while we're running away with things. Yeah.

[00:00:58] I'm uh, I, [00:01:00] I- ... Zaal asked if I made a presentation when I joined, uh, the chat, and I did not. So we're just gonna, we're gonna freeform this. So if y'all don't know me, I'm Saltorius. Uh, I have been sort of in the Farcaster space for a long time. Uh, built, uh, I was previously at a company called Laser where, um, did a lot of contract work for some of the biggest companies in Web3, and, uh, recently joined the Banker team as dev rel, uh, supporting builders, uh, to...

[00:01:34] Supporting builders in many different ways, uh, but principally distribution and funding. Um, so I guess as a call-out right now, if you're building on Base, uh, build on Banker and hit me up, show me what you're building. Would be happy to take a look and hop on a call to see how we can support you. Uh, but yeah, um, uh, been building on Farcaster for a while.

[00:01:54] Made a few, um, mini apps that got very varying levels of, of [00:02:00] popularity. So I made a mini app called HypeMan, which, um, uh, which is basically an AI recaster, uh, for you. So you, uh, if you wanna promote a tweet, you put a particular budget on it. People come along and can quote tweet that for, to get a portion of the budget.

[00:02:18] Uh, but they aren't writing the content. An AI scans their profile, learns how to write like them, and writes a quote tweet for you, for them. Um, uh, during the whole donut craze, I made, uh, People's Donuts, which was the communiting, community mining pool for the donut ecosystem. So when the price to be King Glazer went from half an Eth to one Eth to, like, three Eth, I was like, "There's no way."

[00:02:42] Like, I'm not paying three Eth to do this, but money's still on the table. So I made a custom contract that acted as a mining pool for the donut ecosystem, and it got up to, I think it was, like, 120K in the pool at one point. It was kind of insane. Um, and then most [00:03:00] recently, uh, made a game called Among Traitors, which is locking a bunch of agents in a room.

[00:03:06] One of them is a killer. Uh, they're going on a murders, murdering spree, trying to- Uh, trying to eliminate everyone, and it's up to the rest of the agents to deliberate and figure out who the killer is before everybody dies. Um, you as a player have actions that you can spend to either help your agent or hurt other people's agents.

[00:03:26] Um, and yeah, got... Among Traders was kind of an experiment that started when I was in... That was launched while I was at Kismacasa, um, Eth Denver. Uh, just sort of, uh, people were doing a hackathon, and I was trying to just think of an idea, and it, it snowballed into sort of this, this, uh, interactive game that a lot of people seem to enjoy.

[00:03:51] Uh, and it's currently part of the Clanker... We received a, a grant from the Clanker Ecosystem Fund of $2,500 to build the [00:04:00] game. So right now, that $2,500 is going towards supporting inference costs for the game, because Lord knows that is expensive. But but yeah, um, and so... But you know me, can't, can't stay still, always building new stuff.

[00:04:15] So there is a, uh, more general, um, I would say, productivity tool, I guess you could call it, that I'm building, um, at the moment, um, called Harness. Um, and so I guess I will show that right now Awesome. Yeah, dude, it's been great to, to have you on a couple live streams. Been chatting over the Among Traders journey, hearing different, like, ideas that you have with agents, and it's really exciting to hear what you're cooking here.

[00:04:50] So, um, I'm excited to play around with it more now that I'm getting kind of like a front row, uh, demo. Yeah. So, um, I guess [00:05:00] I'll start with w- what it is and then why I built it. Um, so what Harness is, is a browser b- I have this, I have this spiel down, but I need to make it shorter. It's a brow- browser-based screen aware AI assistant that lives in a floating PIP window, um, and is completely private, and doesn't require any downloads or installs of any kind, including browser extensions.

[00:05:29] That is the entire- That's baller ... synopsis of what, of what this applica- of what this application is. And I guess to dig into why I built it, um, so my, my development workflow has kind of evolved over time. Uh, I made a video, like way, way back, I think I shared it on Forecast. I'm pretty sure I shared it on Forecast.

[00:05:52] But I made a video about how I don't like using, um, agent harnesses. And like, since then, [00:06:00] I've, I've very much changed my tune. I can't code without Claude now, unfortunately. I mean, I can, but it just takes forever, or it seems like it takes forever. Um, uh, but yeah. But at, at the time, I did not like using agent harnesses.

[00:06:15] Um, I thought that there was a lot left on the table, and there's a lot of foot guns that you could potentially run into stuff. It generates too much code too quickly, um, and it's kind of impossible to review. Since then, I've kind of refined my workflow, uh, when building things from scratch, when going from idea to like first line of code, uh, and it actually starts in the da- in the browser for me.

[00:06:41] So because of the, um, memory capabilities and a lot of work that was done by Anthropic and open... uh, mainly Anthropic to, like Claude- Claude's really good about remembering shit about you. Um, and so I start there because it's a good... it's a really good [00:07:00] baseline for me to, uh, start fleshing out an idea because it already has an i- it already has a good- Knowledge base of like who I am and like where I'm coming from when, when I'm building this stuff.

[00:07:13] Uh, so the very first thing that I do is I open up Claude and I kind of explain what I'm thinking and what my idea is, and start doing the technical research as far as what tools and what things I would need to be able to start building. And then probably similarly, uh, and, and, and sort of the issue with that when, when just starting that exploration process, process with Claude is obviously I'm doing a bunch of research.

[00:07:40] I not only have my Claude tab open, but I have 50 other tabs open for all of the different things that it's recommending me to look up, tangents that I think of in my head that I wanna Google and look more into. Uh, multiple Claude chat windows open because I'm, I'm on one idea and then I think of something else to ask real quick, [00:08:00] and then I open up a new Claude tab and start another conversation there.

[00:08:03] Now all of a sudden I have six Claude tabs open along with 50 other tabs open and it's just a mess trying to figure out where I am. So the very first thing I was like, I just want my... I want my AI assistant, like, always available. I want it on top of everything. I wanna always be able to click on it. I wanna be able to minimize it when I'm not using and put it away in the corner, and then when I need to ask it something, I want it right there, always in the same spot where I'm at.

[00:08:28] So that's why-- So that's the impetus of putting it in a floating pip window Um, and then the other thing is the screen awareness part. So, uh, especially when sort of digging into, uh, digging into, like, things that can't be... That take a lot of effort to explain as far as, like, giving the model context or, um, s- stuff that, um, stuff that's not...

[00:08:56] Maybe stuff that even can't be copied, stuff that's, like, in an image or so- or [00:09:00] something. You know what I mean? Yeah. No, 100%. Take a scree- What, what do you do? You take a screenshot and you send it to the model. Mm-hmm. And almost every time, when you provide additional context in the, in the form of an image, your, the, the output is way better because the model is way more grounded in reality as far as, like, what you're asking it.

[00:09:18] Um, and all of these models now, all the main models that everybody's using, that, you know, you're spending 10 mil- $10 per million input tokens, $35 per million output tokens, all of them are multimodal, right? Being that they can accept images, they can accept audio, they can accept text, but everyone's only using, like, the text portion of it, and there's so much left on the table as far as context awareness via images, um, that, that sort of aren't being, aren't being used.

[00:09:47] Um, and so that was the second piece, making it screen aware so that every time I answer the ques- answered a question, it would be grounded in what I was actually doing. It'd be grounded in the reality of what I'm actually looking at. [00:10:00] Uh, and the combination of the two things makes for really good, really, really helpful ans- answers, um, and kind of, uh, kind of m- so that, that's the baseline, right?

[00:10:13] Making, just b- having the model being able to answer your questions better it... by, by way of being grounded in what you're looking at. Um, the other piece, uh, of this build is the fact that since we're dealing with screenshots and we're dealing with people's screens and stuff, privacy is super important, right?

[00:10:34] Like, I remember when Microsoft 11 was announced and they had that feature that, like, watches you all the time and sends reports to Microsoft. I mean, I don't run Windows, you know, so that's not, that was never a concern of mine, but people were rightly pissed. Like, how are you gonna watch what I'm doing all the time and then, like, sort of, like, I have to opt into it because otherwise I'm not gonna be able to use my computer.

[00:10:59] Um, [00:11:00] but, and then all my, all my data's just getting sent to Microsoft, like, without any sort of, without any... I, I don't have any say. Permissions, yeah, as well. Yeah. Right? So that's one piece, and then the other piece is, like, how people use AI today. You know what I mean? Like- There are some people who tell their AI agents shit they wouldn't tell their mother, you know what I mean?

[00:11:21] Like, there, there are some people who, who like really like share some personal, personal, personal information. Uh, and so, and I think this is a wider sort of trend, uh, in, in sort of how people are building in AI using local first models, using private infrastructure, um, um, encrypted servers that sort of you can't see into, you can't see the reasoning being done, so all of your data is private.

[00:11:48] And so, so Harness is built to be private, private first. So the way that I'm doing that Is, uh, the way that I'm doing that is, um, this [00:12:00] idea of, uh, using local models effectively. Models that can run in your browser using your own hardware are super powerful when used effectively. Um, and then using that to create a dense context packet to be sent up to a more powerful reasoning model that runs on Venice's private infrastructure.

[00:12:19] So Venice, if you're not aware, is a, probably the largest, um, provider of private inference. Um- Hmm ... so, so what that means is if you're r- if you use models that have open weights, Venice has set up infrastructure so that when the reasoning is done, it happens in, uh, an encrypted server. Which, which is like the...

[00:12:42] There's a technical term for it, but it... At, at its very core it's an encrypted server. So the data goes to the inference model. Uh, goes to the model, rather. The inference happens within the server. Nobody can see inside. You can't see inside. Venice can't see inside. Nobody can see what's happening in the [00:13:00] model, and then the data is returned to the sender.

[00:13:02] And so this coupling of local models that can create really, really targeted dense context packets, and, uh, shipping that up to a more capable reasoning model unlocks so many things. Uh, and I'll show... I'll guess I'll... I can show a couple exam- of examples, um, while going through, uh, while going through Harness.

[00:13:25] But, um, yeah, that, that's really the, the, the main thesis here is local models when used effectively are really powerful. Everybody has pretty pow- pretty... If you run modern hardwa- hardware, you have a machine that can run these local models quite effectively. Um, and you can do really powerful things if you, you know, target them correctly.

[00:13:46] So as far as the local model part goes, within your browser, so maybe I'll go to the dashboard and we can, you can kind of see. So these local models spinning up right now. There's a clip model. [00:14:00] There's a- Huh ... so web GPU has to be enabled. There's a clip model, which is basically a image embedder. So all of the images that Harness sees get embedded, um, in this embedder, and there's a image to image embedding and text to image embedding.

[00:14:15] And so what that allows for is you can do semantic search with images and text. So let's say you went to Reddit, let's say you went to YouTube, let's say you went to Twitter, let's say you went to Hyperliquid, and then you went to Polymarket, and then you ask Harness a question about what you saw on Twitter.

[00:14:31] It would be able to semantically search through everything that you've seen so far and pull up the Twitter frames and then give that to the fr- the, uh, the reasoning model as context. Uh, so that, that's, you know, that's a, that is a model that runs on your hardware, but directed at something very specific- Yeah

[00:14:49] ends up being really, really powerful Uh, then we have an OCR model. Um, I forget what OCR stands for. I think it's, like, obstacle computer reading, something like that. But [00:15:00] basically, it ta- it takes, it takes what you see and, uh, pulls all the text off. So if I'm on YouTube, it'll pull, it'll pull all of the words that it can- Yeah

[00:15:11] can discern off the screen. Or if you're on Pi Market, it'll pull all the words you can see. That's cool. And what that, what that is for is to annotate every single key frame that, that... Every single image that Harness sees, there's an annotation along with it to make cert- to make search amongst the key frames that much better.

[00:15:29] So the OC- the OCR model pulls out all of the text and all of the information on your screen, annotates it, combines it in this, in this packet of data, and then that, that text, that text, that annotation gets embedded as well so that when you search, again, when the model has to search over what you've seen in the past, it will not only be able to do a text-to-image search via the clip embedding, but it can also do an i- uh, a text-to-text search- Yeah

[00:15:58] over the, the data [00:16:00] that was extracted via the OCR model. And then there's a dense text, a small, dense text embedding model. So this is, this is the local model that does, um, the text embedding. So when the OCR, when the, uh, text is extracted from the OCR, it's embedded via this dense em- uh, this dense text, uh, embedder.

[00:16:19] Um, and then the combination of all of these creates this pipeline of things that you've seen that have rich annotations and tags along with them that is searchable by the frontier model and lives completely on your computer. None of that ever leaves- Yeah ... your hardware. That's sick. Yeah. Because it's all local, and it's, uh, a lot cheaper- And it's a lot cheaper

[00:16:41] than what people are doing these days. Yes, it's a lot cheaper. Another part of the cost here, uh, a lot of... Another part on the cost here is all of these, all of the frontier level inferences run through Venice's private infrastructure, but there are providers on top of it that actually provide inference [00:17:00] at a discount.

[00:17:00] So you can ostensibly get a- a- access to the smartest, most capable models for, like, 60 to 90% off. It's this website called Surplus Intelligence. I highly, I highly suggest- Huh ... you check it out. This, these guys are a part of the Banker ecosystem. Um- Very cool ... they- I'll have to check this out. Yeah, yeah.

[00:17:22] They're one of the top banker pro- uh, one of the top banker projects right now. But there's a lot of people who have DM staked, and they're selling their access DM, or people who have free credits through, like, GCP or free credits through wherever, they can come here and sell them at whatever rate they want.

[00:17:38] typically below market rates. And as a buyer, you can do the same thing. So you can come here and you can get 89% off Gemini Pro for you. You can get 99% off GPT-54. You can get 89% off Claude Opus 4.7. So all of the managed frontier reasoning that happens in Harness is first routed through [00:18:00] surplus intelligence markets to make sure that people get the absolute lowest rate.

[00:18:04] So I've had f- five bucks on this account for, like, a month and a half now, and I'm not even through all, I'm not even through all, I'm not even all the way through it. And, like, I built it, I built the product, right? Yeah. So I'm using it all the time, and I've, I've barely scratched the surface as far as, like- That's cool

[00:18:22] the free credits that I give myself. So it's a com- a combination of doing a lot of things locally, getting rich, rich context locally to maximize for signal and minimize for noise. Yeah. And then routing it through private infrastructure through a layer that provides inference on the cheap. Um- Because you have fuzzy inputs and fuzzy outputs, you're just sending it through a shit ton of filters.

[00:18:42] Yeah. Yeah. Uh, essentially. That's cool. Um- I love it ... let's see. What else? What else? We had the... Oh, another piece of sticking true to the privacy ethos. Um, another p- part that people don't really think about is, like, every [00:19:00] memory, like when you use Claude on the browser, when you use ChatGPT on the browser, every memory that that agent makes with you is stored on Anthropic servers, is stored on OpenAI servers, right?

[00:19:12] Um, depending on how you feel about that, you know, that's, that, that's, that's another breach of privacy that I feel is kind of overreaching as far as these model- And then, and then not to mention, if you wanna get an export of your, of that data, good fucking luck. It takes forever. It, it takes so long or, or, and/or it's impossible.

[00:19:34] Um, and so with Harness, again, built to be local first, uh, it uses PG Lite, which is a Postgres, um, instance that runs completely on your browser. So all your memories, all the memories that you make with your agent live on the browser. Um, you can optionally... So if we go back to the homepage, this is a, I hate, I hate outright shilling, but this is like the first prod- product that I've made that I'm charging money for.[00:20:00] 

[00:20:00] So, um- Yeah. So you can, uh, you can optionally pay $7.99 a month, and you get all of those local memories get encrypted and backed up on Harness servers. I can't read them. You encrypt them with a password, you set them up. A blob is stored on the server, and you can pull it down whenever you want, uh, and put it on another machine.

[00:20:19] You can do whatever the hell, whatever the hell you want with it. Um, that's that. That's really the main s- sell in the, in the product that I'm... Eventually I wanna open source this. Uh, I want it to be as private and open as possible, but I also would like to make some money, uh, from it. So, like, uh, I think that is a, a fair compromise.

[00:20:39] Your, your information lives on your computer, do whatever the fuck you want with it. But in the event where you wanna back that up, or you want to transfer that data to another computer, uh, you can do some type of managed, um, storage- Yeah ... with Harness. Cloud infrastructure with you guys. Yeah. Yeah. You can do some type of managed storage here, and again, it's [00:21:00] encrypted.

[00:21:00] I can't read it. It's locked behind a password. Whatever. Um, let's see, what else can I show you? We have- Do you wanna show, show a little l- demo of it? Like- Yeah, yeah. Yeah ... yeah, I guess you have more- I'll show you that ... more parameters. 'Cause, like, I wa- I ended up going to it while, while we were chatting, and then I was like, "Okay, well, there's a lot here," so it's cool.

[00:21:21] It, it's cool to see, like, you have the control and the customizability that you want. Yeah. So let's, let's do this. I will, I'll spin it up. Let's go make sure I am... I'm not gonna use Claude, 'cause Claude's been stupid the last, like, three days. Yeah, see- Use... Let's, let's use, actually let's use Jill then. Do I have Jill on one here?

[00:21:43] I think I do. Or maybe I have to update this list for GLM 5.2. Okay, let's use, let's use GPT-55. Um, so let's close that. Let's close this. Let's refresh, make sure we're on the right model. [00:22:00] Where do you see the model? Oh, I see. Never mind. Right in the middle there like that. Yeah, right here. GPT-55. There's, uh, there's still some work I have to do as far as, like, making this feel nicer to use.

[00:22:12] There's still some, like, state issues that I have to run through. I've been super busy the last two weeks, so, um, trying to get, get in as much as I can. Uh, but so- Yeah, you know that they're as usable as you can... You need for yourself to be able to use it daily. Exactly. Exactly. Um, so this is now, like, my workflow basically.

[00:22:32] So you start it up. Yeah. Again, you get this floating pip window, which, uh, another, another thing I guess to touch on is there are other products out there like this, right? Um, there are other things that exist. There are other AI systems that exist that can see your screen and can, like, do stuff for you.

[00:22:47] I'm thinking of there's a product called Highlight. There's a product called Hey Clicky. I don't know, you've probably seen the guy Farza on Twitter, who has, like, these Steve Job-esque type of, like, demos, which it's cool. Like, very [00:23:00] cool, but I ain't downloading shit on my... Like, I, like, I... There's too many things to download, and then when you download them, the types of permissions that you have to give to these pieces of software is- So high

[00:23:12] It's too mu- yeah, it's too much for my- It's basically infinite. It's inf- yeah. It's like, uh, I, I want to take control of your computer's accelerometer just in case you- Yeah. Uh, like, what the... What do you mean by taking my accelerometer? Um, so that, that is the main... That is the segment that I'm trying to build this in, is for people who want some of th- those capabilities, but don't wanna download anything, and don't...

[00:23:37] And, and then, and then what's more, those, those products don't ha- There's no wa- inclination of privacy, right? It can see your computer. It can control your computer. Where does that data go? Where is that data stored? What comes back? What ca- what are the actual limits of what this thing can do on your computer?

[00:23:55] You know what I mean? So building in sort of the opposite direction is what [00:24:00] I'm going for. So like I was saying, when you boot it up, you get this floating pip window. Um, this is a new Chrome browser primitive, so this only works in Chrome unfortunately. But this primitive will be available in other browsers probably very soon.

[00:24:14] Um, you start a screen share. So let's... I brought up Hyperliquid. Um, and now Harness can see my entire screen. Uh, when I... When any meaningful, tangible change happens on the screen, like me, um, mou- mou- some mouse movements, but scrolling, moving the chart like this, uh, a new K- key frame is embedded into the local memory.

[00:24:36] And so I can just ask, uh, you know, looking at the Hype- USDC chart Um, do you think I should go long or short? Uh, and then I'll let it go. Uh, you can, like I was saying, you can minimize it, you can put it away. You can keep doing your thing and then come back to it, [00:25:00] which is... This is the exact workflow that I wanted, right?

[00:25:02] I am in here, I can do whatever I want. I can continue, um- Yeah. Browsing ... browsing, using my computer as normal, and then when I have a question for my AI, oh, it's right here. Pull it up, it's ready to go. Um, so I will... This is still thinking Boom. And so you can see- Yeah ... it can see all, it can see everything.

[00:25:24] You can see the 21-day moving average, which I have that indicator up. That's cool. It can give me a play. Um, and it's recommending that I lean short on a small bounce. I'm not gonna do that. Actually- Yeah ... I can't do it 'cause, I can't do it 'cause I, uh, I don't even- Oh, yeah ... I don't have my VPN up. Oh, yeah. But yeah, this is-

[00:25:44] for like, uh, and the- and so another thing that, um, is, is new is the, the idea of using skills with your harness agents. So let me go to settings But can I not open [00:26:00] settings while it's going? Okay, I'll pause that and open up settings. Uh, it's bugged I need a light refresh

[00:26:14] I load up the models again. So you have this, this idea of skills. These come from the banker, the skills.banker.bot, all the skills that have been merged into the banker ecosystem. And so there's a bunch of trading skills, right? So if you wanna do, like, any sort of trade analysis, you can enable one of these skills, and it's available for your agent to use.

[00:26:33] So you can enable a skill, show it a chart, and it'll have sort of, uh, hi- advanced level reasoning along with, um, a specialized skill to go with it to be able to give you the best possible answer at the lowest possible rate. Um, another thing that... Another example that I've been sort of de- demoing when dem- when demoing the product is this, which I think [00:27:00] is really cool.

[00:27:00] So- You just say, like, "Look at all of these"? Yeah. Look, look at all... And literally that. Like, look at all of the markets here. You just lightly, lightly scroll up and down before you send, right? Uh, yeah. Yep. Look at all the markets here. That's cool. Uh- I love that ... um, let's see. Look at all the markets here and find- Pick a favorite, right?

[00:27:20] Like ... any mispriced markets. Uh, search the web. All right, and then I'll, I'll let that go. I can scroll around a little bit so I can get a clearer view of everything that's on here. And as I'm scrolling, as I'm scrolling and more key frames are, are being added to the local pipeline, um, if it's still processing, like, it...

[00:27:45] The context gets updated with new key frames that go into... That get added into the pipeline. That's cool. So if I ask a question up here and then I scroll down here, and new key frames are added, that's added to its context while it's processing. So let's see. That's crazy. That is- It is inspecting the current screen.

[00:27:59] It's [00:28:00] searching the web. It's thinking. It's searching the web. It's probably doing multiple web searches for s- each market that it thinks is worth looking into. That's sick. Um, let's see. Hopefully I don't hit a turn. Uh, that, that is a bug that I've been- What's a turn? So there are... So when you build out these...

[00:28:25] Yeah, I hit a turn then. Let's try again. Um, when you're build- building out these, uh, AI systems, uh, there, there's the... When you, when you make tool calls, there's a number of turns or a number of back and forths that you set in the parameters to allow, like, the maximum number of times- Yeah ... a model can go out and- And go...

[00:28:46] Yeah ... make a, and make a tool call. And that's lit- that's simply to- That max out. Yeah ... yeah, it's simply to, uh, limit costs on every- Yeah ... on every, uh, on every call. I forge- I think I have the maximum tool call as five, [00:29:00] but I scrolled a little bit, so it probably tried to make more than five web searches, which is why it errored out.

[00:29:05] So let's try it one more time

[00:29:17] Yeah, no, I, I'm just trying to think of-- There's so many different fun use cases for it, so Uh, try again. Limit to three markets to look in.

[00:29:40] So it should only do three web searches this time

[00:29:51] Uh There's a couple of other actually really cool things that this can do because of the key frame thing that I [00:30:00] wanna show you. So hopefully, if this doesn't work, I'll just move on to that. But this, uh, there's a video on my Twitter of me doing this, so this does work. And I'll look into the, uh, the terms thing.

[00:30:11] Maybe I'll make that, maybe I'll make that configurable based on how much you're willing to spend. Good idea. All right. Uh, I did more than three. Might... Yeah. Anyway, all right. Well, the, uh... Okay. Anyway, uh, I will look at, I will look at that. It's trying to do too much. Um, but okay. So another cool thing that you can do because of this, let's say you've been browsing for a little while.

[00:30:37] You were on X, you were on Y, you were on Hyperliquid, you were on YouTube, uh, and then you wanna recall what you saw in the past. So you can say, "I was looking at, uh, charts, um, five minutes ago. Could you pull up a screenshot of it?" Uh, and it can [00:31:00] query... Because it can query the local store, it can go back and it can literally pull up the screenshot of what you were seeing.

[00:31:05] Ah, that's cool. So it can recall your screen, and boom, it can... It pulled up what I was- Wow ... looking at five minutes ago. Um, and then it's gonna add some, add some commentary. Uh, so that's a cool thing. And then the last cool thing that I wanted to show you... Oh, it's, uh, another chart that I was looking at before, uh, 172 hours ago.

[00:31:26] So it's literally whatever, whatever is in the key store. Again, some of this needs tuning. Uh, I've, I've... This is out and available to use, but I haven't done a, like, really big market in that it pulled up- Yeah ... the Hyperliquid screen that I was on five minutes ago or seven minutes ago. Anyway, I haven't, uh...

[00:31:42] This is out, available to use. I haven't done a really big marketing push just- It found it, though. It found what you were looking for on the third- It did find it, and it did... Like, this is a chart technically. Yeah, yeah. This is a chart. So it did find it eventually. Um, but again, there's some tuning and some, and some fixing that I have to do before [00:32:00] really doing, like, a big marketing push.

[00:32:01] But I, I can see this being really useful for some people. Uh, the last thing that I wanted to demo, let's go here, go to Farcaster. Uh, so again, because it has this running sort of screen awareness, you can ask it to do things like, "Look at, take a look at... Like, like, watch my screen for the next five minutes.

[00:32:22] I want you to take note of X and give me a report on Y." So I can be like- Ooh, that's cool ... "I'm scrolling Farcaster. Watch my screen for the next, uh, two minutes and, uh, tell me everyone who, every-" Account that says the word, uh, let's see, what's po- what's a popular word on Fire? What's a... I guess, uh, let's see, spaces.

[00:32:57] We'll see if maybe, maybe that'll work. [00:33:00] So there's a tool that does this, and so now I can just start scrolling. So got assault on one, and the two-minute screen watching is running. You can see the countdown here, and then it's just watching me scroll, and hopefully someone does say spaces so that this isn't a They'll double it.

[00:33:19] Ah, here we go. A fire caster cancel. Hopefully it'll catch that Uh, let's see. So the idea for this feature is, like, if you're doing, if you're doing, like, lead generation, right? Or if you're a recruiter and you're doing... And you're trying to find good people, you can ask it, "Hey, watch me s- watch me browse LinkedIn for the next 30 minutes, and take note of all of the profiles that I come across that...

[00:33:47] Of people that have eight or more years of experience." And it can just watch you do this. You can put it away again, you can put it up in the corner, it's still running. Whoops. Gotta fix that. You can put it away, you can put it in the corner, it's still [00:34:00] running, and I can kinda keep browsing, uh, as normal.

[00:34:04] And then when the time is up, it'll have... It should have a good report for me. Um, so yeah, the, the, the, the idea there is sort of passive, uh, passive research capabilities, while I'm still very much in the loop. I'm still very much doing what I would normally do, um, while using my computer, but I have this added layer of intelligence that isn't overbearing.

[00:34:30] Like, I... Like, this idea that, like, agents are going to completely take over my workflow, they're gonna do everything for me, I, quite frankly, I don't want that. I don't want, I don't want a complete takeover of, like, how I do things. I want an additive, an additive tool that makes it easier for me to do the things that I'm already doing.

[00:34:49] Uh, and I feel like this lives in, like, that happy medium, where it's, it's very much a clear, um, upgrade from, like, what I w- you know, [00:35:00] upgrade from how you would normally do things. Um, but it's not overbearing in the fact that it doesn't completely take over my computer and it doesn't, like, do shit for me.

[00:35:07] Like, I don't, I don't, I don't want that. I just- Yeah ... you know, that's not what, that's not what I find most value about these, about these AI tools. Until they get to a point where it's like, "Oh, you're, you're actually legitim- legitimately, like, s- like, like, smarter than me at, at everything," not just, like, one specific area.

[00:35:25] You're, you're h- head and shoulders smarter than me, uh, of everything. There's no reason for me to even, like, think about doing things myself, which quite frankly is not the case. Um, let's see. Where is it at?

[00:35:40] So called JDL The call, uh, yeah, so call JBL. Other than that, the only calling some static spaces in your left-hand side. Um, so yeah, I mean, again, some tuning to do, some fine-tuning to do, but it did catch one that probably missed the [00:36:00] Farcaster count. Um, but yeah, that, that's the whole idea with this feature, and as I, you know, as I refine things, it'll get better.

[00:36:08] It'll get, um... As the, these local models are, are sort of very quickly outpacing the capabilities of, like, the large local models for sure, but even the s- the very small ones that run on Transformers JS, they are incred- they're getting more and more powerful every month. Huh. Um, so as I, as sort of this system gets built out, it'll get increasingly better.

[00:36:32] As I get the code base to a stable spot, um, you know, I'm gonna try to really start pushing this out more. But that is a overview of what Harness is. Uh, if you're watching, I implore you to try it out. Every time I put this in the hands of somebody else, they use it for something that I never would've thought of.

[00:36:53] Um, my sister is in medical school and she was using it to study. She was showing it, like, the study material, and it was creating Anki [00:37:00] flashcards for her as she was scrolling and studying, which I thought was really cool. Um, people u- people have used it to play chess. It's really good at playing GeoGuessr.

[00:37:08] There's a lot of things that, like... Yeah, I just give it to someone and see what they do with it, and I'm impressed every time. So if, if you are interested in this kind of thing, check it out. Try harness.ai. When you sign up, you get $5 of free inference, which will last you a fucking month. Yeah. So play around with it, let me know what you think.

[00:37:28] Um, that, but that is the most recent thing that I've been hacking on. Boom. Well said. Oh, yeah. And I'm excited to try it. Yeah. I already started. I tossed it over my Claude code screens and I said, "What should I do? Um, how should I manage these better?" 'Cause that's something that I'm trash at. Yeah. Yeah. Yeah.

[00:37:49] Yeah, and so, and, and the big thing that I'm working towards with this is context sharing between your desktop assistant and your Claude code assistant. And [00:38:00] like, so like I'm... I imagine if you, if anyone uses a combination of the two, what do you do? You have this whole conversation with your desktop assistant, and then at the end you're like, "Make a markdown file so I can-" Yeah

[00:38:12] "tell my Claude, so I can give my Claude all the context of this conversation." Yeah. Um, that sucks- Yeah ... 'cause it al- it always- It is ... it always misses. Summarizing it, yeah. It al- yeah, it... Like, the summary's good, but it always misses shit, or like you're having a whole conversation, so like you might need- The details that you need, right?

[00:38:28] Like the small things that might be important. The small, the very small things, or it over indexes on st- Like, if you're having a conversation, you're having this fluid conversation and you come across something where it's like, "Oh, you know what? Never mind, that's a bad idea. Forget about that," it's still in the context.

[00:38:41] Yeah. So when it writes the s- when it writes the summary, that thing that you told to forget about is still in the context, and then you give that to your Claude code agent. Yeah. And now it's working off of information- It is, yeah ... that you thought, you thought was dropped, but it's not. It's still in there.

[00:38:55] Yeah. So, uh, what I'm working towards is an mc- an MCP that [00:39:00] lets you share context between, um, your Harness agent and your Cla- Claude code agent. So basically you would authenticate the MCP within your Claude code agent, and any time a memory gets saved to, uh, Harness, um, it would, it would be able to transfer it to your Claude code session so that everything that you've seen, everything that you've done in, like, your web session is very easily portable to your Claude code session.

[00:39:24] And to me, that's like the perfect workflow for me personally, and hopefully for other people. Um, for hope- hope- it is, it's perfect for me, and hopefully it would be perfect for other people, that's what I'm building towards. Um, but yeah, that is, that is the thesis, the build. Um, definitely gonna get better over time.

[00:39:46] I've been super busy with, uh, everything. Life, kid, life, banker, harness, jujitsu, you name it. So carving a little bit of time out for everything i- [00:40:00] as an order, order of priority. But as I, as I settle more into, like, the banker role and get more, get more, like, sort of in a good groove and, like, learn everything that, that that job requires of me, um, and then wrapping up all of the current engagements that I'm on and, and, uh, finding a good balance, you know, this'll, this'll inevitably get better.

[00:40:22] But, um, someone actually launched a token for me and ga- and, like, set me as a fee provider. And before, uh, before I even, like, announced what I was making, there was, like, 3K in fees for me to claim. Holy shit. Like, before that. And, like, since then there's been a crazy amount of trading activity. I think it's, like, been, like, four Eth that I've been able to claim so far, and then, like, an equal amount in the actual token, so at least 10K.

[00:40:48] Uh, so people, you know, are jazzed about the idea. People- Yeah ... wanna see it. Want to see it happen, yeah. Yeah, wanna see it, wanna see it flourish and wanna see it proliferate. They're kind of getting on my ass to post more [00:41:00] on Twitter about it and shit, but, but it'll come, it'll come. Amazing. No, I'm excited.

[00:41:05] We'll definitely have to do a session in July during the open build of using it during a build or two. Maybe, um, me live streaming in some capacity, and you coming in and being like, "Hey, maybe do this or that," um, and try- try out- try it out this way. But I appreciate you and your busy schedule coming on, sharing- Yeah

[00:41:22] some time with me, sharing some time with us, um, sharing some really cool things that you've been working on, and, um, I'm excited to try out, and I hope you all do as well. So- Right ... uh, thank you for your time, Saltorius. Where can people reach out and catch you? Uh, yeah, catch me on Farcaster on Twitter, Saltorius.eth on Farcaster, uh, Saltorius1 on Twitter.

[00:41:43] Uh, hit me in the DMs, especially if you're building something. Uh, if you're building something and you're looking for just to get more eyeballs on it, if you're looking for distribution, if you're looking for funding, that is exactly what we do at Banker. We, we are here to help. Um, so [00:42:00] shoot me a DM either on Farcaster or Twitter.

[00:42:02] I will get in contact with you. I'll check out what you're building. We can hop on a call. I can put you in touch with the rest of the Banker team to see how we can help. Um, but yeah, that is, that is my... That is where you can find me. I love it. Thank you, Saltorius. Thank you everyone for coming in, and we'll see y'all later.

[00:42:21] Cool. So you- Cheers.

[00:42:22] ZAO keep it a Zali. From ZaoDao come proper. We eat rappers for lunch and if some left we eat 'em for supper. I keep it a ZAO homie a Zali. Heard the streets calling E-3. Iron Man to a Simonz. Now the whole world hear about me