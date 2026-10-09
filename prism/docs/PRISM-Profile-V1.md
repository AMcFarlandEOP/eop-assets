# PRISM Profile — Version 1
## Question Design Reference

*Pre-V2 dependency. Finalized in design session, June 2026.*
*Bring this document to every V2 coding session alongside CLAUDE.md and the Product Brief.*

---

## How This Document Works

The PRISM Profile is the intake form Agency Collective members complete once when setting up their PRISM experience. Their answers do two jobs simultaneously:

1. **Tag matching** — finite answer options become tags applied to every post in the content library. The four-layer index (tier → tag → relevance score → date) uses these tags to surface the right content for each member.
2. **AI prompt context** — all answers, including the two optional open-ended fields, are passed directly into the server-side PHP prompt sent to the Anthropic API. The AI uses this context to personalize synthesis beyond what tags alone can deliver.

**Profile storage:** `prism_profiles` table in GoDaddy SQL. Wallet address as primary key.

---

## Question Set

### Q1 — Who You Are
*Highest-weight tag. Colors how every other answer is applied. Single select.*

> **How do you primarily identify in your work?**

| Option | Definition | Tag value |
|---|---|---|
| **Explorer** | I'm personally building my Web3 and AI literacy for myself and my household, so I can participate confidently in an increasingly tech-driven world | `explorer` |
| **Practitioner** | I'm a working professional applying emerging technology to my existing work or my clients | `practitioner` |
| **Creator** | I'm making content, products, or experiences using emerging technology | `creator` |
| **Founder / Entrepreneur** | I'm building or running a venture and need emerging tech to inform my strategy and decisions | `founder` |

---

### Q2 — Where You Are in Your Journey
*Maps to content complexity tiers. Single select.*

> **Where are you in your journey with emerging technology?**

| Option | Tag value |
|---|---|
| **Just starting** — I'm building foundational knowledge and figuring out where to begin | `just-starting` |
| **Getting traction** — I have some experience and I'm starting to apply what I'm learning | `getting-traction` |
| **Building actively** — I'm implementing, creating, or operating with emerging tech right now | `building-actively` |
| **Optimizing** — I have systems or a practice in place and I'm refining and scaling | `optimizing` |
| **Established** — I have deep experience and I'm evaluating new opportunities or pivots | `established` |

*Note: These five stages are also your content complexity tiers. Tag every post in the library with the journey stage(s) it serves.*

---

### Q3 — Primary Goal
*Captures intent without financial advice language. Single select.*

> **What are you most trying to accomplish right now?**

| Option | Tag value |
|---|---|
| **Build understanding** — I want to make sense of Web3, AI, and emerging technology before I take any next steps | `build-understanding` |
| **Evaluate confidently** — I understand the basics and I'm deciding whether and how to engage with specific tools or opportunities | `evaluate-confidently` |
| **Start participating** — I'm ready to take my first real steps — holding tokens, using digital tools, or joining communities | `start-participating` |
| **Build or create** — I'm actively building a product, service, or content practice using emerging technology | `build-or-create` |
| **Integrate and apply** — I'm bringing these tools into my existing work, business, or client practice | `integrate-and-apply` |
| **Lead and influence** — I'm helping others navigate this space — as an educator, advisor, community builder, or advocate | `lead-and-influence` |

---

### Q4 — Web3 and AI Fluency
*Member self-assessment maps directly to content complexity tags. Single select.*

> **Which best describes where you are with Web3 and AI tools today?**

| Option | Tag value |
|---|---|
| **Curious** — I'm interested but I haven't used any tools or held any digital assets yet | `fluency-curious` |
| **Exploring** — I've done some research and maybe taken a first step — created a wallet, tried an AI tool, or bought a small amount of crypto | `fluency-exploring` |
| **Engaged** — I use AI tools regularly and I understand how wallets, tokens, and digital ownership work | `fluency-engaged` |
| **Practicing** — I'm actively building, transacting, or creating with these tools as part of my regular work | `fluency-practicing` |
| **Fluent** — I can explain these concepts to others and I'm working at or near the technical edge | `fluency-fluent` |

*Note: Tag prefix `fluency-` avoids collision with Q1's `explorer` tag and Q2's journey stage tags.*

---

### Q5 — Biggest Challenge
*Highest personalization value. Tells PRISM what's blocking the member right now. Single select.*

> **What is your biggest challenge with emerging technology right now?**

| Option | Tag value |
|---|---|
| **Information overload** — There is too much noise and I can't identify what is actually relevant to my situation | `challenge-overload` |
| **Fear of mistakes** — I'm concerned about making costly errors — financially, technically, or reputationally | `challenge-fear` |
| **Finding my entry point** — I understand enough to be interested but I don't know how or where to start | `challenge-entry` |
| **Belonging and access** — This space often feels like it wasn't built for people like me and I'm navigating that | `challenge-belonging` |
| **Ecosystem readiness** — I'm ready to move but the infrastructure, regulation, or adoption isn't there yet | `challenge-ecosystem` |

*Note: `challenge-ecosystem` is the signal for experienced members who are fluent but waiting on the space to catch up. This is a distinct content need from beginner challenges.*

---

### Q6 — Content Preferences
*The equity signal lives here. Multi-select, limit 3.*

> **What kind of content serves you best?**
> *Choose up to 3.*

| Option | Tag value |
|---|---|
| **Deep dives** — I want thorough analysis and full context, not just headlines | `pref-deep-dive` |
| **Actionable frameworks** — I want structured approaches I can apply immediately | `pref-actionable` |
| **Emerging signals** — I want to know what's coming before it's mainstream | `pref-signals` |
| **Real examples** — I learn best from case studies and concrete stories | `pref-examples` |
| **Equity and inclusion lens** — I want content that considers who gets access and who gets left out | `pref-equity` |
| **Technical explainers** — I want to understand how things actually work under the hood | `pref-technical` |
| **Strategy and business application** — I want to understand the business and financial implications without speculation | `pref-strategy` |

*Note: Multi-select means one member can carry several `pref-` tags — richer matching against post content.*

---

### Q7 — Open Field: Biggest Unanswered Question
*Optional. Free text. Fed directly into the Anthropic API prompt — not used for tag matching.*

> **What's the one question you most wish you could get a straight answer to?**

*Leave blank to skip.*

**How this is used:** This field is appended to the member's profile context in the server-side PHP prompt. It gives the AI engine a specific anchor for synthesis beyond what tags can capture. A member who writes "I keep hearing about RWA tokenization but I don't understand if it applies to small creators" gets a fundamentally different synthesis than tag matching alone would produce.

---

### Q8 — Open Field: Current Decision
*Optional. Free text. Fed directly into the Anthropic API prompt — not used for tag matching.*

> **Is there a specific decision you're trying to make right now?**

*Leave blank to skip.*

**How this is used:** Turns content filtering into decision support. A member who writes "I'm deciding whether to accept crypto payments from my international clients" gives PRISM the context to frame every synthesis around that specific decision rather than general topic relevance.

---

## Complete Tag Taxonomy

All 32 finite tags derived from Q1–Q6 answer options. Every post in the content library should be tagged from this list.

### Identity tags (Q1)
`explorer` `practitioner` `creator` `founder`

### Journey stage tags (Q2)
`just-starting` `getting-traction` `building-actively` `optimizing` `established`

### Goal tags (Q3)
`build-understanding` `evaluate-confidently` `start-participating` `build-or-create` `integrate-and-apply` `lead-and-influence`

### Fluency tags (Q4)
`fluency-curious` `fluency-exploring` `fluency-engaged` `fluency-practicing` `fluency-fluent`

### Challenge tags (Q5)
`challenge-overload` `challenge-fear` `challenge-entry` `challenge-belonging` `challenge-ecosystem`

### Preference tags (Q6)
`pref-deep-dive` `pref-actionable` `pref-signals` `pref-examples` `pref-equity` `pref-technical` `pref-strategy`

---

## How Tags Feed the Four-Layer Index

```
Layer 1 — Tier gate:     Member's token (OBST or TACT) determines which posts are visible
Layer 2 — Tag filter:    Posts filtered by tags that match ANY of the member's profile answers
Layer 3 — Relevance score: Count of profile answer / post tag matches (arithmetic, not ML)
                          Identity tag (Q1) carries highest weight
                          Challenge tag (Q5) carries second-highest weight
                          Preference tags (Q6) carry additive weight (up to 3 selected)
Layer 4 — Date tiebreaker: Newer content wins when relevance scores tie
```

*Tag weighting is a V2 implementation decision. The scoring logic lives in PHP, not in this document.*

---

## How the Full Profile Feeds the AI Prompt

When a member clicks "Go Deeper →" on a prompt card, the server-side PHP constructs a prompt that includes:

```
[Selected prompt card text]
[Article PDF URL or condensed summary]
[Member profile context block]:
  - Who they are: [Q1 answer]
  - Journey stage: [Q2 answer]
  - Primary goal: [Q3 answer]
  - Fluency level: [Q4 answer]
  - Biggest challenge: [Q5 answer]
  - Content preferences: [Q6 answers — up to 3]
  - Open question: [Q7 — if provided]
  - Current decision: [Q8 — if provided]
[Return instruction — silent, appended by JS, never shown to member]
```

Q7 and Q8 are what transform a personalized response into a customized one. A member profile without them still produces good synthesis. A member profile with them produces synthesis that feels written specifically for that person's situation.

---

## V3 Parking Lot — Additional Profile Questions

These questions were evaluated and deliberately deferred. Do not build in V2.

| Question | Why deferred | V3 value |
|---|---|---|
| *Is there a specific tool, platform, or technology you're trying to understand or evaluate?* | Tags can't anticipate every tool name — free text can. Low lift in V3 once member base is established. | Enables tool-specific synthesis and content surfacing |
| *Who are you ultimately trying to help or serve with what you're building or learning?* | Adds audience context the AI can use to frame responses. More valuable once content library is larger. | Especially powerful for creators, practitioners, and equity-focused members |
| *What have you already tried or explored that didn't quite work for you?* | Prevents PRISM from surfacing content already consumed. Requires session memory to be useful. | Retention and re-engagement signal |

---

## Content Tagging Task

Before V2 build begins, all existing posts must be tagged from the taxonomy above.

**Existing posts to tag:**

| Post | Slug |
|---|---|
| The Bridge Has Been Built (Tangem Pay) | `tangem-pay` |
| Information Is Abundant. Meaning Is Personal. | `prism-philosophy-heres-the-bridge` |
| AEO Isn't the New SEO | `prism-methodology-aeo-vs.-seo` |

Tag each post with all applicable tags from the 32-tag vocabulary. A post can carry multiple tags from each category. There is no limit.

---

*PRISM Profile V1 — Finalized June 2026*
*Pre-V2 dependency. Both profile questions and tag taxonomy are locked before V2 build begins.*
*Next step: tag existing content library, then begin V2 build sequence per CLAUDE.md.*
