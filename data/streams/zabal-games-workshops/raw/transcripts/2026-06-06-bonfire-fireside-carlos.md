---
title: ZABAL Gamez Fireside - Bonfires + a vibe-coding masterclass (Carlos / Plat0x x Zaal)
show: ZABAL Gamez Firesides
episode: 1
guest: Carlos (Plat0x, Bonfires)
guest_links:
  - "twitter: at0x_eth"
host: Zaal
date: 2026-06-06T00:00:00.000Z
format: audio-x-space-fireside
language: en
track: builder
topics:
  - bonfires
  - vibe-coding
  - planning
  - sub-agents
  - documentation-as-code
  - types-first
  - knowledge-graph
  - agents
entities:
  orgs:
    - Bonfires
    - The ZAO
  people:
    - Carlos (Plat0x)
    - Zaal
    - Josh
    - Linus Torvalds
  projects:
    - ZABAL Bonfire
    - ZABAL Gamez
    - WaveWarZ
    - Claude Code
    - Codex
links:
  - label: Bonfires
    url: https://bonfires.ai
source:
  capture: live X Space recording, auto-transcript with proper nouns corrected
summary: |
  A ~35-minute live ZABAL Gamez fireside between Zaal and Carlos (Plat0x, the Bonfires
  developer). Opens with the BetterCallZaal / WaveWarZ theme, then runs as half
  working-session, half vibe-coding masterclass. Working session: the Bonfires rewrite
  (hard deadline June 14, so ZAO integration waits until after); ZAO's second Bonfire
  agent responds in DMs but not groups (a config issue tangled in the rewrite, deferred);
  Carlos's CLI that auto-pushes context to the Bonfire on every git commit; Zaal's pattern
  of storing recordings on a subpage and pointing Bonfire episodes at that media URL; and
  the Bonfires positioning as a "sense-making tool" where the agent is "the librarian of a
  library," with multiple agents sharing one Bonfire's context while keeping their own
  episode stacks (a federated crew). Vibe-coding masterclass: plan-then-goal with a
  measurable threshold; Bob-and-Alice diagramming before any code; types-first prompting
  with a protocol/adapter contract; documentation-as-code (remove the code and the docs
  alone should reproduce it 1:1); the Linus Torvalds compiler analogy; "punch above your
  weight" by having AI read the papers/docs first; and Carlos's three skills - plan-making,
  sub-agents, and adversarial agents.
status: cleaned
---

# ZABAL Gamez Fireside - Bonfires + a vibe-coding masterclass

Carlos (Plat0x / Bonfires) x Zaal - 2026-06-06 - ~35 min - live X Space.
No timestamps (audio capture). Proper nouns corrected; the opening
BetterCallZaal / WaveWarZ theme song is noted rather than transcribed.

_[Opening: the BetterCallZaal / WaveWarZ theme.]_

**Zaal:** Yo, what up Carlos, how we doing big bro?

**Carlos:** Hey man, good, and you?

**Zaal:** I'm doing phenomenal. It's a beautiful day. I'm challenged with going through my
second Bonfire actually - I was creating one for one of the community members, the deep
thinking homie who's been working, that I was messaging you about yesterday. And I was at
the end point trying to get the - what's it called - it works in DMs but not in groups. I
believe I have turned on all the settings that I need to, and I eventually just allowed
groups, but it's still not seeming to listen in the group. I think you're in that group as
well.

**Carlos:** Yeah, right now it's a mess of configs. The main issue we have right now is
we're kind of in this refactoring time period, which is weird from a development
perspective because basically we started over. So a lot of the code that's currently there,
it's going to be there in some slightly different way once we're done. Since it's going to
change, it's hard to get you guys to use that, because it's going to change anyways. So we
would rather get finished as soon as possible - our deadline, by the way, just FYI, is the
14th to get everything integrated. So it should get easier soon. These things are hard.

**Zaal:** Awesome, no, I love that. So in about a week or so here you guys are going to be
doing that upgrade. I know we had a brief conversation about Bonfires a little bit earlier
this week. I'm actually working on getting that out on the YouTube, but I've started to
essentially make this ZABAL Gamez-recordings-two-or-three page for the Bonfires - that'll
be where it's stored. I think it'll be really valuable for the graph to be able to point:
okay, this is the URL where the video is actually stored, because the YouTube is embedded
on this page. So I don't know if you remember that conversation we had at the very
beginning with my WaveWarZ team - okay, we have a ton of these videos, how can we leverage
the Bonfires tooling where it's just text to actually point to media of some type that's
not just a file? I think this could be a way to do that: just using my custom website and
making a subpage for that specifically to point to.

**Carlos:** Yeah, totally. Having your own - basically, we envision these things as, I like
to think about it as the librarian of a library. So as you grow your library of things that
you have available and memories, the idea of the agent is the place you tell people to go
to, to experience the ZABAL Gamez, to guide them through it. It's also been interesting
this week - I've had a lot of conversations with Josh in terms of messaging and how we talk
about Bonfires and what we're doing. I think it's very exciting. I just like the concept and
the idea that we want to push: what does Bonfires do? The shortest definition is, it's a
sense-making tool. And sense-making is cool because the definition isn't a word, so it's "to
make sense." So what are we doing? We're making sense of things. We're the sense-makers, as
a group of people in an activity that we're doing. And I think starting to have this team of
"okay, I'm making sense of this" as your goal - that's kind of what we're doing with the
ZABAL Gamez, right? You're trying to make sense of open-source development and all these
toolings and stuff. And I think that's also an invitation: let's make sense together of
these things. It can be a good call to action, you know what I mean?

**Zaal:** Yeah, 100%. I appreciate that. So what else is up with you, tell me more.

**Carlos:** Honestly, one of the places I've been wanting to spend more time developing is
my video editing setup. This time I've gotten into a nice rhythm with this ZABAL Gamez
workflow, because I'm basically giving everything into the repo and it's capturing a lot of
it, and a lot of the conversations I'm having are all tied together here, so it's easy to
keep the theme there. It's been really powerful. I'm using a paid platform right now, so
I'm trying to think of the different things I like using the platform for and the things I
want to offload, so I can automate part of that process - so it's basically just an API
call for my own bots.

**Zaal:** Right, that's cool. How's your coding setup these days?

**Carlos:** Basically just Claude Code in the terminal for the longest time - since basically
we met, actually before that I was using Windsurf. Now recently - I'm a little bit sometimes
limited by my hardware and my setup in different capacities. My travel Mac is super weird and
wants to shut down every four hours, that is super weird. But ever since I started using the
terminal, because the terminal and Claude is open, it actually asks me to shut that down, and
that stops the shutdown, so that's been interesting on a different level. I've been recently
just using Claude Code in the cloud, because then I could use any device and pop in and out.
I've heard Dispatch is good. I'm kind of building my bots in Telegram in different capacities,
but the Bonfire has been super powerful in being the memory side of things, so I'm just
pushing a lot of data there. That's been my goal. So I definitely want to get on this wave of
every git commit I do, or a fellow teammate does on our repos, the information from that is
added to the Bonfire. So I don't know if that might be something we could talk a little bit
more about as well.

**Carlos:** Yeah, I did do this as a CLI tool and I think it's still around. I'm going to send
you the link. I set up my Claude thing so that every time it pushed -

**Zaal:** Explain CLIs a little bit more for me if you wouldn't mind.

**Carlos:** A CLI is a command line interface. There are different ways to interact with
software: you can either have a GUI, which is a graphical interface like Telegram, for
example, or you could have a command line interface, which is basically just a set of
terminal commands - similar to how you use Claude Code. And Claude Code is not a CLI but a
TUI, because it's a terminal UI, because it renders a user interface inside of a terminal. A
real CLI is just a bunch of commands you can call. So the idea is that instead of calling
Bonfires - the other way to do it is you would use HTTP requests, and there's this thing
called curl, which you can use to call any server. But the problem with that is that every
time you do a call, you have to add every environment and all these things to make it work.
So a CLI turns all that into "add to Bonfire." You set it up once, when you install the
thing you set up the environment. And the thing about CLIs is that Claude can call these
using the terminal access. So you install it once, then you make a skill that explains how to
call the CLI, and then your agent is able to use it. This works for stuff like - GitHub has a
CLI, Amazon Web Services has a CLI. Basically every software has a CLI package you can call.
This was usually just used by developers, but now that you have agents, you can tell your
agent to use them for you. So my pipeline is like, oh, we have the server for Run First, and
there's a bug, I want to query AWS with specific parameters - so instead of writing a script
(well, I still write a script, but then I save that script), I say "log check," and it checks
the logs with that logic using the CLI. It makes a lot more sense.

**Zaal:** Thanks for explaining that, that's cool.

**Carlos:** Yeah, actually I think there's a lot of value, especially for people who are just
starting to vibe code, to just have this ability to ask questions like "what the heck is
this, what the heck is that," and make sense of coding patterns. Because at the end of the
day, the AI knows everything, but it will only use whatever you query about. It's probably
easier to start with - imagine you're going to make an app. You can either say "make me an
app that does this and that," or you could say "define types in Python for an application
that does this and that." Just that prompt changes what the AI starts doing. It avoids you
having to add types retroactively and rewrite your app. Because every time it's like, oh,
let's make an app, oh but let's add a database, so you have to rewrite the app to make a
database. Oh but let's add authentication, so you have to rewrite the app. Oh but let's use
a graph database, so you have to change the database. And now you're like, oh, but it's
better to use a protocol contract, where instead of having to commit to using Mongo, you
just say "I'm going to use a database" and have an adapter system that you can change. But
that's something that, if you make the decision later, it's another rewrite. And if you
forgot about the types -

**Zaal:** Yeah. Actually knowing the big picture at the very beginning, that plan - I've
always heard that if you spend 15, 20 more minutes in that plan phase, you'll save hours and
hours in the long term, right?

**Carlos:** Yeah. And the thing is, the only way to get - yes, like you're saying - I would
say spending even an extra day. What I would do if I started from scratch right now: if I had
an idea I want to make, I would first write it down as a sketch diagram. You know how people -
have you ever heard about Bob and Alice?

**Zaal:** I have not.

**Carlos:** So every tech demo, whenever they have a diagram, it's Bob and Alice - they're
the users. You put Bob on one side and Alice on the other. For example, if you make an
e-commerce website, you go: okay, Bob wants to sell a vape, and Alice wants to buy a vape. I
want an app that will facilitate that transaction. So you're not talking about code yet,
you're talking about what's the exchange, what's the pipeline you want to make. So you go,
okay, first Bob has to - they don't know each other, so Bob has to post his sale, his object,
as a sale item. And then Alice has to be able to find that sales item somehow, and she has to
have enough information to execute that transaction. Bob has to be notified of that
transaction, and then he has to send the package, and Alice has to receive the package, so I
can verify that Bob has done the thing.

**Zaal:** Yeah, I think I understand.

**Carlos:** And you could draw that on paper. You draw Bob on one side and Alice on the
other, and then start drawing arrows. In the middle is your app. So first Bob - and you can
order things, because if Alice comes to the app first and Bob hasn't come to the app, then
she won't find anything. So you can know the sequence.

**Zaal:** Totally. You're being the middleman essentially, but being at the right time of
supply and demand. And timing that.

**Carlos:** Yeah. And that's what an e-commerce app is at the end of the day. But by doing
this, what you're defining is what things need to be built for your thing to work. So you
need a way for Bob to register on the app, then for Bob to post an item, then a way for Alice
to register and for her to have a feed of the items that are available. So far we have the
early functions. But if we stop there, Alice can see there's a thing but she can't buy it. So
now we have to keep going: Alice needs a function she can call to buy an item that I've
already established that I have. And then Bob needs to be notified. And in this case money has
been transferred - so is this a crypto app? If it is, do you give the money straight to Bob,
or do you wait until he sends the item and you release the money from escrow?

**Zaal:** Totally, yeah, because you're confirming the thing was actually accepted on the
other user's front.

**Carlos:** Right. And if you keep doing this exercise, you'll be able to describe and draw
all the things your app needs. Then you take a picture of that and send it to your terminal,
and turn that into your architecture diagram. And so far you haven't even decided what
programming language you're going to use - you're just defining what needs to be done to
achieve your goal.

**Zaal:** Yeah, 1000%. Another tip I've always heard is not trying to be too specific about
how it's going to be done, but just saying what you want it to get done. I've seen that be
very successful on my end as well sometimes.

**Carlos:** Yeah, that is true. And the more you can explain - that's also why some of the
better use cases of coding agents are when you have a metric you can optimize for. So for
example, let's say you've already built the app but it's slow. You can ask your agent: okay,
your goal for today is to make this app faster, and you can give it constraints. The latency,
since it's a specific number, you can leave that with a goal open, and it's just going to keep
going until it achieves the thing. So that's also a good way to do it.

**Zaal:** Awesome. Have you used - what's the longest goal that you've pursued? Does Claude
Code have goals?

**Carlos:** It does. I haven't - I've used it here and there, but sometimes I think I just
need to understand it or prompt it better. I haven't had much more than a couple hours here
or there. But sometimes it's also through a stall, which is always somewhat a challenge,
where it's like, okay, how to know if it's stalled out, or if it's actually doing something,
or if it's in a loop.

**Carlos:** Yeah. What I found useful - because I did notice that Claude has great
plan-making skills and he's very thorough, but usually when it comes to executing the plan,
it will start executing and then it will call the first phase a bunch of work, and then it
will be like, okay, I did the first phase. And then you have to be like, okay, but keep going,
keep going. And I found that making a plan and then making a goal, where the prompt is only
"complete the plan, use this and that skill," and the threshold - for example, the other day
I was doing, the threshold is having less than five seconds in a query - and it just went away
and worked for the rest of the day.

**Zaal:** That makes sense. Do you want to share a little bit more of some of the skills you
use and how you use them? I think that can also be a valuable conversation.

**Carlos:** Yeah. I actually use very few skills nowadays. I have a skill to make plans. To do
that, I ask the agent to go online and search for papers about it and make a skill of how to
make good plans with AIs. I found papers and made it a skill, and it was good. So I'll usually
start by doing that. Then I have a skill for sub-agents. That skill basically tells the agent:
you are the senior dev, and your job is to keep all the sub-agent threads full and just
organize their work and verify them and integrate it with the goal. And that one works really
well to get more things done, especially if you have a really broad thing with many parts that
don't overlap too much. And then I have one I don't use that much, but it's a sub-skill of the
agents, that is: make adversarial agents for a thing that I'm discussing. So it'll be like one
argues for the idea and the other argues against the idea, and then the main agent is reading
both and making an opinion. And that's pretty much it, really. I used to have the Bonfires one.

**Zaal:** That last one seems really interesting.

**Carlos:** Yeah. I haven't used it that much, and I'm kind of curious to use it with Opus
4.8. But right nowadays I'm using Codex. I really hope they release a new model soon. But it's
good because usually these things will just agree with you and everything, and I often like to
have several opinions, especially if it's "go research papers and then connect the papers with
the codebase," and such. That's another good piece of advice. It's kind of fun, because I was
a self-trained coder before AI started to be a thing. There were a lot of libraries, a lot of
things out there - the best skill you would have before is being able to clone repos and look
for GitHub and clone a repo to make it work. But there were also a lot of libraries kind of
above my pay grade, too hard for me to do or comprehend, or too obtuse, or too boring - stuff
like reading technical papers or very deep discussions. But the point is, I think with AI you
can punch above your weight and ask the AI to do those things that you wouldn't do. With
documentation it's kind of easy. I'll give you an example: I'm using this library for the
grammar stuff that I'm doing, and this is a front end for a Lisp back end. Lisp is a language
I haven't ever seen in code, and it has a bunch of functions, and it's super cool but it's
kind of hard. I would have never made an app with a Lisp back end that I need to understand and
run before AI. But with AI it's like, okay, go to the web page, read all the papers about it,
read the documentation about it, make a bunch of documents. And that's another important one -
I like to make a lot of architectural documents and be like, okay, research this and make a
dossier and a briefing about the topic, so you can have some continuity in what you're doing. I
think maintaining good documentation and good research documents is really important to maintain
good quality in the codebase. Punch above your weight and keep documentation about it. You don't
have to reason the details, but you need to be able to reason enough to find it interesting.
That's all you need.

**Zaal:** Yeah, I think people understanding how important documentation is makes a big
difference nowadays than it did before. Being very clear with your instructions and having the
communication layer really on tap, really understanding how you can leverage that tool, because
it's the most important way - making sure that you can hand things off to different tools and
have that recursive bit of knowledge. It's super important.

**Carlos:** Yeah. And actually, I think this is a very insightful thing that Linus actually
said - Linus Torvalds, the Linux guy. He was recently on an interview, and he's like, okay, I
get that people say AI has let them code 10 times more than before, but I don't hear anyone say
that about the compiler, which actually lets you go a thousand times faster. And the compiler,
what it does, it takes the syntax that you're writing and turns it into machine instructions. So
when you're writing code, you're really writing prompts for a program to turn those prompts into
instructions inside of another language. And to a degree, what we're doing with AI is kind of
the same, but more abstracted in a way. So you're still coding by prompting the coding agent,
but it's way fuzzier, to give it a word. But it still has the same effect: it's still
programming using syntax to produce machine outputs. So the point of that is that the
documentation layer should be the equivalent to the code. When you think about it, if you
removed all the code and you just had the documentation, you should be able to reproduce the
code exactly, because you have a natural-language explanation. It could even be stored as voice
notes. You could go kind of crazy with it. But the point still stands: the semantics should
transform into the execution in a one-to-one way.

**Zaal:** Yeah, I think it's pretty cool to see what we can do here and where the evolution of
coding is going. And I'm excited to be able to leverage Bonfires in such a way to do that as
well.

**Carlos:** Yeah dude, you're doing such a cool, important job in being an early adopter of it.
It is actually through the realization of projects like yours that we're going to be able to get
to the next level. And I think that if we all like the idea of becoming sense-makers and making
this a thing that we do as a concept, more people could catch on and start either participating
in our experiences of ZABAL Gamez, or making their own, which is also fun because it gives you
more things to do.

**Zaal:** Totally. Well, thank you, Carlos, I appreciate your time. Definitely want to keep
chatting more about Bonfires, figure out the rest of this issue so we can get our second agent
up on the ZABAL Bonfire. I think it'll be really cool to have some of these other agents for
specific use cases. So I would love to know, maybe in our last minute here, if you have any
thoughts on the different agents for one Bonfire and what the different benefit of having those
different personalities can be.

**Carlos:** Yeah, I think that's one of the more interesting things. Right now the cool thing
about the agents is that they each produce their own stack and episodes, but those drain into the
same Bonfire. So two agents can share the context, but they can still use their episode
production to track their history. So they should become distinctly them, rather than be
perceived as the same agent. So much so that when you create the new agent and you start
producing episodes, the existing agent is going to start seeing episodes produced by a different
agent, so it's going to be aware that there's a second agent on the Bonfire. So there's a lot of
interesting dynamics there. Especially for kind of federated crew situations, it is ideal,
because they all operate inside of the same information structure.

**Zaal:** Totally, no, I appreciate that.

**Carlos:** Yeah man, thanks for having me. I'm going to go and get something to eat now.

**Zaal:** Awesome, perfect. Thank you, appreciate it, we'll chat soon.

**Carlos:** Bye.
