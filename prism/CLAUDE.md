# PRISM — EOP Media Build Context

> "Information is abundant. Meaning is scarce. PRISM is the bridge." — EOP Media, 2026

This file gives Claude Code full context for every PRISM build session.
Always read this file before making any changes to this repository.

---

## What This Repo Is

`eop-assets` is the GitHub Pages asset repository for EOP Media.
It serves JavaScript, HTML, and generated files to eopmedia.com via URL.

**Live files — DO NOT TOUCH:**
- `eop-connect.iife.js` — Polygon wallet connection for token-gate
- `eop-dashboard.iife.js` — Member dashboard widget

**PRISM files — all work happens here:**
- `generate-pdf.py` — The PDF + prompt card + embed code generator script
- `prism/posts/*.md` — Markdown source files for each blog post
- `prism/prompt-cards/*.json` — Generated + approved prompt cards (includes intro field)
- `prism/prompt-cards/*-embed.html` — Generated Gutenberg embed blocks
- `prism/pdfs/*.pdf` — Generated PDF companions
- `prism/widget/prism-widget.html` — Legacy iframe widget (no longer used in production)
- `.github/workflows/prism-generate.yml` — GitHub Action (do not edit)
- `prism/CLAUDE.md` — This file

---

## What PRISM Is

PRISM (Personalized Relevant Intelligence Synthesized for Meaning) is an EOP Media
methodology that filters fast-moving technology content through a reader's specific context.

**Three versions:**
- **V1 (current):** Gutenberg HTML block embedded in each blog post. Self-contained HTML + JS. No backend. CSS lives in child theme. Acquisition tool.
- **V2 (next quarter):** PRISM Profile intake inside member dashboard at /member-dashboard/prism/. Personalized prompt cards via Anthropic API.
- **V3 (future):** Licensable product at prism.eopmedia.com.

---

## Technical Environment

| Layer | Tool | Notes |
|---|---|---|
| CMS | WordPress + Gutenberg | Posts use Custom HTML blocks |
| CSS | Child theme custom.css | PRISM styles at bottom of file, namespace #prism-widget |
| Token gate | Polygon blockchain (OBST + TACT tokens) | |
| Asset hosting | GitHub Pages (this repo) | |
| AI API | Anthropic — claude-sonnet-4-6 | Used in generate-pdf.py Stage 1 |
| Session calendar | Luma | |
| Video | Vimeo Starter | |

---

## Automation — GitHub Action

A GitHub Action at `.github/workflows/prism-generate.yml` runs automatically
when any `.md` file is pushed to `prism/posts/`.

**What it does:**
1. Detects which `.md` files changed in the push
2. Runs Stage 1 (prompt cards via Anthropic API)
3. Runs Stage 2 (PDF generation)
4. Runs `--embed` (Gutenberg embed code)
5. Commits all generated files back to the repo

**Required secret:** `ANTHROPIC_API_KEY` must be set in GitHub repo Settings → Secrets and variables → Actions.

**Per-post workflow:**
```
1. Save post as .md → copy to prism/posts/
2. git add → git commit → git push
3. Wait ~2 minutes (Action runs)
4. git pull (get generated files)
5. Open [slug]-embed.html → Ctrl+A → Ctrl+C
6. Paste into Gutenberg Custom HTML block → publish
```

---

## generate-pdf.py — Script Reference

Three modes:

```bash
# Stage 1 only — generate prompt cards via API, save to JSON
python generate-pdf.py --post prism/posts/[file].md --prompts-only

# Stage 2 — generate PDF (uses existing approved JSON)
python generate-pdf.py --post prism/posts/[file].md

# Generate Gutenberg embed code from approved JSON
python generate-pdf.py --post prism/posts/[file].md --embed
```

**Requires:** `.env` file in repo root with `ANTHROPIC_API_KEY=sk-ant-...`
**Never push:** `.env` is protected by `.gitignore`

---

## Prompt Card JSON Structure

```json
{
  "post": { "slug": "post-slug", "generated": "2026-05-31" },
  "intro": "2-sentence widget intro. Sentence 1: what topics. Sentence 2: how to use prompts.",
  "cards": [
    {
      "id": "card-01",
      "audience": "Who this is for",
      "tag": "If you are [reader type]",
      "prompt": "Full prompt text the reader copies into their AI."
    }
  ]
}
```

**Intro rules:**
- 2 sentences maximum
- Do NOT include the Agency Collective line — widget adds it automatically
- Written in second person, present tense

---

## Widget Architecture

The PRISM widget is a self-contained Gutenberg Custom HTML block.

**What the embed block contains:**
- HTML structure only — no <style> tag
- JavaScript with prompt cards inlined as a JSON array
- No external dependencies, no iframe, no fetch calls

**What lives in the child theme:**
- All CSS at /wp-content/themes/eop-child-theme/assets/css/custom.css
- Namespace: #prism-widget — cannot conflict with theme styles
- Key fix: display: flex; flex-wrap: wrap for cards grid (not grid — WordPress overrides grid)
- Key fix: white-space: normal; word-wrap: break-word on all text elements

**Why not iframe:** WordPress/Jetpack strips <style> tags from HTML widget blocks before
page render. Inline CSS in iframes also failed due to CORS. Inline HTML block with child
theme CSS is the correct permanent architecture.

---

## File Naming Conventions

- Post slug: short, lowercase, hyphens, recognizable (does NOT need to match WordPress slug)
- Pattern: prism/posts/[slug].md → generates [slug].json, [slug].pdf, [slug]-embed.html
- Example: tangem-pay, prism-philosophy-heres-the-bridge, prism-methodology-aeo-vs.-seo

---

## Design System

All PRISM elements use EOP brand colors. Do not introduce new colors without instruction.

  EOP Red:     #A41623   Primary accent — borders, labels, CTAs
  EOP Black:   #1a1816   Headlines
  EOP Ink Mid: #3d3a36   Body text
  EOP Parch:   #f4f1ec   Card backgrounds
  EOP Rule:    #d9d5ce   Dividers and borders
  EOP Muted:   #7a7670   Secondary labels

Fonts in widget: Georgia (body, prompts) + Courier New (labels, buttons)
Fonts in PDF: Helvetica (all — ReportLab limitation)

---

## Live Posts with PRISM Widgets

| Post | Slug | Status |
|---|---|---|
| The Bridge Has Been Built (Tangem Pay) | tangem-pay | Live |
| Information Is Abundant. Meaning Is Personal. | prism-philosophy-heres-the-bridge | Live |
| AEO Isn't the New SEO | prism-methodology-aeo-vs.-seo | Live |

---

## Open Questions

5. PDF clickable links: ReportLab anchor tag issue unresolved — deferred to V3

---

## Decisions Made (May 2026 — Pre-V2 Build Session)

**D1 — PRISM Profile storage: WordPress user meta, keyed to wallet address**
Store profile in WordPress user meta. Primary key is wallet address (not WordPress user ID
or email). Wallet address is captured at login by the existing Polygon token-gate and must
be passed to all profile read/write functions. Include a JSON export function so members
can download their profile. This gives V2 simplicity while preserving Web3 portability —
any future PRISM instance can retrieve a profile by querying against wallet address.
Migration path to on-chain storage is clean when V3 warrants it.

**D2 — Content library indexing: tag + tier**
Index by WordPress post tags and member tier (SFTA / Observer / TACT). Do not build a
PRISM relevance scoring system for V2. Relevance scoring is deferred to V3. Use what
already exists in WordPress — tags are already applied to posts, tier access is already
controlled by the token-gate.

**D3 — Agent interface: Anthropic API inside eopmedia.com, with optional LLM hand-off**
V2 synthesis runs via Anthropic API (claude-sonnet-4-6) inside the member dashboard.
The member never leaves eopmedia.com for the initial synthesis. PRISM Profile is
assembled with post content and sent as a structured API request. After synthesis renders,
a "Go deeper" option appears — member clicks it and chooses their preferred LLM for
continued research. Hand-off packages the synthesis output plus a compressed profile
summary into a continuation prompt. The "go deeper" option is not shown by default —
only when the member explicitly requests it.

**D4 — LLM hand-off platforms: Claude.ai (default), Perplexity, ChatGPT**
Three options presented at hand-off. Claude.ai is the default. Perplexity is the
recommended option for web research (label accordingly in UI). ChatGPT included for
members who prefer it. Hand-off uses URL parameters with synthesis output — not raw
post content — to stay within browser URL length limits.

---

## Recommendations (May 2026 — Pre-V2 Build Session)

These recommendations capture the reasoning behind the decisions above, plus flags
for risks and opportunities that should inform every V2 build session.

### On Identity and Portability

The single most important architectural decision in V2 is using wallet address —
not WordPress user ID or email — as the primary key for PRISM Profile storage.

In Web3, identity is the wallet. Email and platform accounts are temporary. A member's
wallet address is the one identifier that travels with them across platforms, products,
and future PRISM instances. If EOP Media licenses PRISM to another community (V3),
that community's members will have wallet addresses you've never seen. Portability only
works if the profile was anchored to the right identifier from day one.

The portability framework has three levels:
- Level 1: Export portability — profile lives in WordPress, member can download as JSON
- Level 2: Wallet-anchored portability — profile indexed by wallet address, retrievable
  by any PRISM instance that knows the wallet (THIS IS WHAT WE ARE BUILDING)
- Level 3: On-chain / decentralized storage — profile is self-sovereign, stored on-chain
  or via Ceramic/IPFS. V3 decision, not V2.

Level 2 costs almost nothing extra at build time — it is one architectural decision
(which field is the primary key) made before the first line of code is written.
Not making this decision now means a data migration later.

### On the Agent Interface

The hybrid model — API synthesis inside eopmedia.com, optional hand-off to member's
preferred LLM — is stronger than either pure option alone.

Why API-inside first: PRISM's value proposition is that synthesis happens *through*
the member's context. If the member goes to Claude.ai and re-explains their situation
every time, PRISM isn't doing anything a prompt card couldn't already do. The persistent
profile only becomes powerful when your system holds it and applies it automatically.

Why optional hand-off: members have existing relationships with specific AI tools —
memory, saved projects, preferred interfaces. Forcing them to stay in eopmedia.com
for every interaction would feel limiting. The hybrid respects autonomy: PRISM does
what only PRISM can do, then hands off with everything the member needs to go further.

Perplexity is the recommended hand-off for web research specifically — it is built
for web-connected synthesis in a way Claude and ChatGPT are not. Label the button
accordingly in the UI: "Research further with Perplexity" rather than just "Open."

### On API Costs

Running synthesis via the Anthropic API costs real money. At approximately 1,000 tokens
per synthesis call, cost is roughly $0.003–0.015 per interaction. For a membership
community of hundreds of active users, monthly API costs are estimated at $20–50 —
well within the value delivered.

However: without rate limiting or response caching, a spike in member activity could
generate unexpected costs. Rate limiting (per-user daily limit) and caching (store
synthesis responses so the same post+profile combination is not re-generated)
must be designed before V2 goes live, not after.

### On the prism.eopmedia.com Subdomain

The Product Brief says to stake this subdomain immediately. As of this session it has
not been done. This is a two-hour task with no risk and meaningful upside — it secures
the brand, establishes intentional presence, and makes V3 sales conversations easier.
Do this before V2 build begins.

---

## Build Sequence (Updated)

### Immediate Actions (Before V2 Code Begins)

- [ ] Design the five PRISM Profile questions and their answer options (on paper first —
      questions determine data structure, data structure determines everything else)
- [ ] Stake prism.eopmedia.com with a placeholder page (EOP brand, tagline, coming soon CTA)
- [ ] Confirm wallet address is accessible from PHP in the existing token-gate implementation
      (Claude Code can verify this in one session against the existing eop-connect code)
- [ ] Set up Claude Code locally (npm install -g @anthropic/claude-code)

### Phase 1 — V1 Improvements (Parallel to V2 Planning, Low Risk)

- [ ] Add a JSON backup step to generate-pdf.py before any regeneration overwrites
      existing approved prompt cards (date-stamped copy, e.g. [slug]-2026-05-31.json)
- [ ] Add a --review flag to the GitHub Action so Stage 2 (PDF) only runs after
      manual approval of Stage 1 (prompt cards) — gives editorial control without
      breaking the automation for approved posts

### Phase 2 — V2 Build (One Quarter)

- [ ] Build PRISM Profile intake form (5 questions, saves to WordPress user meta
      keyed to wallet address)
- [ ] Build profile display/edit page (same form, pre-populated with saved values)
- [ ] Build synthesis endpoint: retrieves profile by wallet address, assembles with
      post content, calls Anthropic API (claude-sonnet-4-6), returns response
- [ ] Implement per-user rate limiting and response caching before any member-facing
      launch (not optional — required before go-live)
- [ ] Build "Go deeper" hand-off: constructs continuation prompt from synthesis output
      and compressed profile summary, presents three platform buttons (Claude.ai default,
      Perplexity for research, ChatGPT), shown only on member request
- [ ] Build JSON export function so members can download their PRISM Profile
- [ ] Create PRISM module page at /member-dashboard/prism/
- [ ] Build content library index (by tag + tier) accessible through PRISM
- [ ] Connect Luma session calendar for personalized session recommendations
- [ ] QA token-gate: Observer profile access, TACT full access

### Phase 3 — V3 (Post-V2 Validation)

- [ ] Migrate PRISM module to prism.eopmedia.com
- [ ] Evaluate Level 3 portability (on-chain profile storage) based on V2 member usage
- [ ] Implement PRISM relevance scoring for content library indexing
- [ ] Resolve PDF clickable links (ReportLab anchor tag issue, deferred from V1)
- [ ] Package methodology as licensable product with implementation service
- [ ] Develop sales materials and licensing agreement template
- [ ] Begin outreach to first prospective licensee communities

---

## Session Protocol

Start every Claude Code session with:
> "I am building PRISM. Refer to CLAUDE.md for context."

Before pushing any changes, confirm:
- [ ] No changes to eop-connect.iife.js or eop-dashboard.iife.js
- [ ] No changes to .github/workflows/prism-generate.yml (unless intentional)
- [ ] New post files are inside prism/posts/ only
- [ ] .env is not staged (git status should show it as untracked only)
- [ ] Widget tested before push
