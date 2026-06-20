# Media research - content multiplication, cadence, tooling (2026-06-20)

> A research pass on better ways to run the media output, with concrete moves for ZABAL Gamez.
> Pairs with `docs/media-playbook.md` (the system) and `docs/youtube-playbook.md` (video strategy).
> Brand: no emojis, no em dashes (hyphens only), no crypto/web3 jargon, "100+" for member count.

## 1. Content multiplication: one workshop -> many assets
The 2026 consensus is to win on smart repurposing, not endless original production. Break each
recording into its component "atoms" (claims, numbers, frameworks, how-to steps, quotes) and
reformat each into a platform-native asset.

**Target yield per ZABAL Gamez session (45-60 min):**
- 1 full YouTube video (package: `docs/recordings/youtube-package-template.md`)
- 8-15 short clips (Shorts + horizontal), each one self-contained point
- 3-5 quote cards (the sharpest lines, branded)
- 1 recap thread / newsletter blurb
- 1 speaker spotlight (thank-you + best quote, tags the guest)

**Clip rules that hold up:** lead with the payoff in the first 1-2 seconds (no intro), one clip
= one point, plain language, burned-in captions. We already surface the best lines in each
YouTube package's chapters/quotes, so picking clip moments is a read, not a rewatch.

## 2. Cadence + timing
- **X:** mid-week mornings win - Tue/Wed/Thu, roughly 9-11am, with a secondary 12-6pm window.
  1-3 posts/day is the healthy range for a text platform.
- **Farcaster:** timing matters far less than consistency and fit. The platform rewards relevant,
  trusted, channel-native posting over volume. Daily presence (replies, showing up in /zabal and
  the GCs) beats blasting. Quality over frequency.
- **Practical rule for us:** schedule the promo posts for mid-week mornings when possible; on
  Farcaster, the win is being present in-channel and replying, not hitting an exact minute.

## 3. Tooling shipped with this note
- **`scripts/gen-posts.mjs`** - generates the promo + live-now posts for upcoming sessions
  straight from `data/workshop-leads.json`, in the canonical post formats, with 280-char checks.
  This closes the media-playbook open item "generate posts from the source of truth": the copy
  can no longer drift from the data because it is produced from it.
  - `node scripts/gen-posts.mjs` (upcoming) | `node scripts/gen-posts.mjs 2026-06-25` (one date)

## 4. Next better-ways to build (ranked)
1. **Clip-picker from transcripts** - a script that reads a timestamped transcript and lists the
   best ~10 Short-worthy moments (with in/out timestamps), so cutting clips is a 10-minute job.
2. **Quote-card generator** - render the top quotes onto a branded card (the arcade template) for
   the channels where a bare link underperforms.
3. **One media kit per session** - `docs/sessions/<slug>.md` bundling Lu.ma + posts + YouTube, so
   each session is one file, all generated.
4. **Discord + Telegram one-click** - webhooks for the two manual go-live channels (Firefly
   already covers the public feeds).

## Sources
- ContentBeta - 1:10 content repurposing framework (2026): https://www.contentbeta.com/blog/content-repurposing-framework/
- OpusClip - short-form video strategy 2026: https://www.opus.pro/blog/short-form-video-strategy-2026
- PostQuickAI - repurpose video into 30+ posts: https://www.postquick.ai/blog/repurpose-video-content
- Buffer - best time to post on X 2026: https://buffer.com/resources/best-time-to-post-on-twitter-x/
- Sprout Social - best times to post on X 2026: https://sproutsocial.com/insights/best-times-to-post-on-twitter/
- HeyOrca - posting frequency by platform 2026: https://www.heyorca.com/blog/social-media-posting-frequency-by-platform-2026
