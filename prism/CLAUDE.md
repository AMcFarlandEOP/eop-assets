# PRISM — EOP Media Build Context

> "Information is abundant. Meaning is scarce. PRISM is the bridge." — EOP Media, 2026

This file gives Claude Code full context for every PRISM build session.
Always read this file before making any changes to this repository.

-----

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

-----

## What PRISM Is

PRISM (Personalized Relevant Intelligence Synthesized for Meaning) is an EOP Media
methodology that filters fast-moving technology content through a reader's specific context.

**Four versions:**

- **V1 (current):** Gutenberg HTML block embedded in each blog post. Self-contained HTML + JS. No backend. CSS lives in child theme. Acquisition tool. V1 improvements in progress (see below).
- **V2 (next quarter):** PRISM Profile intake inside member dashboard at /member-dashboard/prism/. Personalized prompt cards filtered by profile. Anthropic API synthesis inside eopmedia.com. Profile stored in GoDaddy SQL, wallet address as primary key.
- **V2+ (post-V2 validation):** Schema automation (JSON-LD generation from Brief data) and citation monitoring (automated AI system queries via Perplexity, ChatGPT, Claude APIs). Admin-only dashboard for Angelia. Two open questions must be resolved before V2+ build begins — see Pre-V2+ Dependencies below.
- **V3 (future):** Licensable product at prism.eopmedia.com. Dynamic card generation. Decentralized profile storage. Citation monitoring dashboard configurable per licensee.

-----

## Technical Environment

|Layer           |Tool                                        |Notes                                                   |
|----------------|--------------------------------------------|--------------------------------------------------------|
|CMS             |WordPress + Gutenberg                       |Posts use Custom HTML blocks                            |
|CSS             |Child theme custom.css                      |PRISM styles at bottom of file, namespace #prism-widget |
|Token gate      |Polygon blockchain (OBST + TACT tokens)     |Access control only — not profile storage               |
|Asset hosting   |GitHub Pages (this repo)                    |                                                        |
|AI API          |Anthropic — claude-sonnet-4-6               |generate-pdf.py Stage 1 + V2 synthesis (server-side PHP)|
|Profile storage |GoDaddy SQL — dedicated prism_profiles table|Wallet address as primary key                           |
|PDF generation  |WeasyPrint (Python)                         |Replaced ReportLab — HTML/CSS input, supports hyperlinks|
|Session calendar|Luma                                        |                                                        |
|Video           |Vimeo Starter                               |                                                        |

-----

## Automation — GitHub Action

A GitHub Action at `.github/workflows/prism-generate.yml` runs automatically
when any `.md` file is pushed to `prism/posts/`.

**What it does:**

1. Detects which `.md` files changed in the push
1. Runs Stage 1 (prompt cards via Anthropic API)
1. Runs Stage 2 (PDF generation via WeasyPrint)
1. Runs `--embed` (Gutenberg embed code)
1. Commits all generated files back to the repo

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

-----

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

-----

## Prompt Card JSON Structure

### V1 structure (current)

```json
{
  "post": { "slug": "post-slug", "generated": "2026-05-31", "pdf_url": "https://amcfarlandeop.github.io/eop-assets/prism/pdfs/[slug].pdf" },
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

### V2 addition — profile_match field

Each card gains a `profile_match` object mapping to PRISM Profile answer options.
The widget uses this to filter cards for authenticated members (gated mode).

```json
{
  "id": "card-01",
  "audience": "Pre-revenue founder",
  "tag": "If you are just getting started",
  "prompt": "Full prompt text the reader copies into their AI.",
  "profile_match": {
    "business_stage": ["pre-revenue", "idea-stage"],
    "goal": ["validate", "token-launch"]
  }
}
```

**Intro rules:**

- 2 sentences maximum
- Do NOT include the Agency Collective line — widget adds it automatically
- Written in second person, present tense

**pdf_url rules:**

- Added automatically by generate-pdf.py at generation time
- Used by widget JavaScript to construct deep-link payloads
- Points to the GitHub Pages PDF for this post

-----

## Widget Architecture

The PRISM widget is a self-contained Gutenberg Custom HTML block with two modes.

### Ungated mode (V1 — no wallet connected or no profile found)

- Shows all six prompt cards
- Platform selector visible above card grid (Claude primary, ChatGPT secondary)
- PDF download available
- "Go Deeper →" button on each card

### Gated mode (V2 — wallet connected + profile exists in SQL)

- Shows two to three profile-matched cards only (scored via profile_match field)
- Platform selector present but less prominent (V2 members synthesize inside eopmedia.com)
- Same "Go Deeper →" button behavior

**Mode is determined at page load** by checking wallet connection status and querying
the prism_profiles SQL table for a matching wallet address.

### Deep-link payload construction (both modes)

When a reader clicks "Go Deeper →", the widget JavaScript constructs the payload silently:

```
[Selected prompt text from card]
[Article PDF URL (Claude) or condensed summary (ChatGPT)]
[Return instruction — appended silently, never shown on card]
```

**Critical rules:**

- Return instruction is a JavaScript constant, NOT stored in JSON
- Return instruction is NOT visible on prompt cards
- Copy button copies prompt text only — return instruction never travels via clipboard
- Return destination: prism.eopmedia.com
- Claude deep-link: passes pdf_url from JSON
- ChatGPT deep-link: passes condensed text summary (URL reading unreliable on free tier)

### Platform selector behavior

- Sits above card grid inside expanded widget (not in collapsed header)
- Claude.ai: primary button, EOP Red
- ChatGPT: secondary button, muted styling, "Best with ChatGPT Plus" caveat
- Selection remembered via localStorage — returning readers skip the choice
- One "Go Deeper →" button per card uses the stored preference

### What the embed block contains

- HTML structure only — no `<style>` tag
- JavaScript with prompt cards inlined as a JSON array
- Platform selector UI
- Deep-link URL construction logic
- localStorage preference management
- No external dependencies, no iframe, no fetch calls

### What lives in the child theme

- All CSS at /wp-content/themes/eop-child-theme/assets/css/custom.css
- Namespace: #prism-widget — cannot conflict with theme styles
- Key fix: display: flex; flex-wrap: wrap for cards grid (not grid — WordPress overrides grid)
- Key fix: white-space: normal; word-wrap: break-word on all text elements

**Why not iframe:** WordPress/Jetpack strips `<style>` tags from HTML widget blocks before
page render. Inline CSS in iframes also failed due to CORS. Inline HTML block with child
theme CSS is the correct permanent architecture.

-----

## V2 Architecture Decisions (Session 4 — June 2026)

### Agent interface

Anthropic API called server-side via PHP inside eopmedia.com. API key stored in
server-side config, never reaches the browser. Members never leave the site.
GoDaddy SQL supports profile storage at no additional cost.

### Profile storage

Dedicated `prism_profiles` table in existing GoDaddy SQL database.
Wallet address is the primary key — never WordPress user ID.
WordPress reads and writes via a lightweight custom plugin.

**SQL table schema (to be finalized in V2 build):**

```
prism_profiles
  wallet_address    VARCHAR PRIMARY KEY
  business_stage    VARCHAR
  goals             VARCHAR
  web3_fluency      VARCHAR
  challenges        VARCHAR
  content_prefs     VARCHAR
  created_at        DATETIME
  updated_at        DATETIME
```

**On-chain principle:** Polygon blockchain handles access control only (OBST, TACT tokens).
Profile data is mutable preference data — SQL is the correct store.
Wallet address as primary key preserves Web3 identity portability.

### Content library indexing

Four-layer system applied in order:

1. **Tier gate** — member only sees content their token authorizes (already built)
1. **Tag filter** — posts filtered by tags matching profile answers
1. **Relevance score** — count of profile answer / post tag matches (arithmetic, not ML)
1. **Date tiebreaker** — newer content wins when relevance scores tie

Tag taxonomy is derived from PRISM Profile answer options.
Profile question design must be completed before tag taxonomy can be defined.
Both are pre-V2 dependencies — must be done before V2 build begins.

### PDF generation

WeasyPrint replaces ReportLab. PDF layouts are now written in HTML and CSS.
Clickable hyperlinks work natively in WeasyPrint — no workaround needed.
PDF design is now maintainable without understanding ReportLab's coordinate model.

-----

## Pre-V2 Dependencies (must complete before V2 build begins)

These are content and design tasks, not coding tasks. No V2 code should be written
until both are complete.

1. **Design PRISM Profile questions** — ✅ Complete. See PRISM-Profile-V1.md.
2. **Derive tag taxonomy from profile answer options** — ✅ Complete. 32 tags defined in PRISM-Profile-V1.md. Content tagging of existing library is the remaining manual task.

-----

## Pre-V2+ Dependencies (must resolve before V2+ build begins)

These are open questions, not tasks. No V2+ code should be written until both are answered.

1. **Brief data structure** — Do the six prompt cards currently have a discrete question field, or is the prompt text the question? FAQ schema generation requires a clean question string per card. If cards are freeform, a normalization step is required before schema can be automated. Answer this before any work that touches the JSON card structure.

2. **Schema injection method** — JSON-LD blocks must be injected into the `<head>` of each post page, not into the Gutenberg content area (Jetpack may affect script tags in content blocks). The two options are: (a) a `wp_head` hook in `functions.php`, or (b) injection in `single-perspectives.php`. **Risk:** this is a PHP theme file change — a different kind of task from the Python/JS work done so far, with higher consequence if it goes wrong. Confirm the injection method and ensure a child theme backup exists before any development begins.

-----

## V3 Parking Lot (decisions deferred — do not build in V2 or V2+)

- **Decentralized profile storage** — Ceramic Network or equivalent. Evaluate when V3
  is scoped. On-chain identity with off-chain mutable data via IPFS pointer is the
  likely pattern. SQL migration path will be clean given wallet-address primary key.
- **Dynamic card generation at page load** — Anthropic API call per member per post
  load, generating cards written specifically for that member. Justified at V3 scale,
  not in V2 proof-of-concept.
- **Polygon cost cap and usage controls** — If on-chain profile writes are introduced
  in V3, implement application-layer rate limiting per wallet to cap gas costs.
  Evaluate whether Polygon remains the best chain for this use case at V3 scope.
- **Licensee citation monitoring dashboard** — Each V3 licensee gets their own admin dashboard showing whether their PRISM-structured content is being cited by AI systems. Entity terms, query sets, and system targets must be data-driven (not hardcoded) for this to work per licensee. Build the V2+ monitoring module with this configurability in mind.
- **Licensee baseline run process** — Standardized onboarding step: run the full monitoring query set before any licensee's content goes live, to establish their zero state.

-----

## prism.eopmedia.com — Subdomain Role

|Phase                |Role                                                                                                                                                          |
|---------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
|Now (V1 improvements)|Return destination for deep-link sessions. Landing page acknowledges synthesis session, explains PRISM Standard, converts toward Agency Collective membership.|
|V2                   |Marketing page for PRISM Standard. Points members to /member-dashboard/prism/                                                                                 |
|V3                   |Full product home. PRISM module migrates here from WordPress dashboard.                                                                                       |

Subdomain is already staked. Landing page is a V1 improvement deliverable.

-----

## File Naming Conventions

- Post slug: short, lowercase, hyphens, recognizable (does NOT need to match WordPress slug)
- Pattern: prism/posts/[slug].md → generates [slug].json, [slug].pdf, [slug]-embed.html
- Example: tangem-pay, prism-philosophy-heres-the-bridge, prism-methodology-aeo-vs.-seo

-----

## Design System

All PRISM elements use EOP brand colors. Do not introduce new colors without instruction.

EOP Red:     #A41623   Primary accent — borders, labels, CTAs, primary buttons
EOP Black:   #1a1816   Headlines
EOP Ink Mid: #3d3a36   Body text
EOP Parch:   #f4f1ec   Card backgrounds
EOP Rule:    #d9d5ce   Dividers and borders
EOP Muted:   #7a7670   Secondary labels, secondary buttons

Fonts in widget: Georgia (body, prompts) + Courier New (labels, buttons)
Fonts in PDF: HTML/CSS via WeasyPrint — full font control now available

-----

## Live Posts with PRISM Widgets

|Post                                         |Slug                             |Status|
|---------------------------------------------|---------------------------------|------|
|The Bridge Has Been Built (Tangem Pay)       |tangem-pay                       |Live  |
|Information Is Abundant. Meaning Is Personal.|prism-philosophy-heres-the-bridge|Live  |
|AEO Isn't the New SEO                        |prism-methodology-aeo-vs.-seo    |Live  |

-----

## V1 Improvements Backlog (next coding session)

These are additions to V1 — not V2 build items. Complete before V2 begins.

- [ ] Replace ReportLab with WeasyPrint in generate-pdf.py
- [ ] Add pdf_url field to JSON output in generate-pdf.py
- [ ] Add platform selector to widget (Claude primary, ChatGPT secondary)
- [ ] Add "Go Deeper →" button to each prompt card
- [ ] Build deep-link URL constructor in widget JavaScript (Claude: pdf_url, ChatGPT: condensed summary)
- [ ] Add return instruction as JavaScript constant (silent, not shown on cards, not in clipboard copy)
- [ ] Add localStorage platform preference memory
- [ ] Build prism.eopmedia.com landing page (return destination + Agency Collective conversion)
- [ ] Address GitHub Pages propagation delay (known V1 limitation)
- [ ] Resolve PDF clickable links (resolved by WeasyPrint migration)

-----

## Architectural Decisions Log

|Decision                                                            |Resolved|Session      |
|--------------------------------------------------------------------|--------|-------------|
|Widget CSS lives in child theme, not embed block                    |Yes     |Pre-Session 4|
|Wallet address is primary key for all profile storage               |Yes     |Session 4    |
|Agent interface: Anthropic API server-side, member never leaves site|Yes     |Session 4    |
|Profile storage: GoDaddy SQL dedicated table                        |Yes     |Session 4    |
|Content indexing: four-layer (tier → tag → relevance → date)        |Yes     |Session 4    |
|Deep-link platforms: Claude primary, ChatGPT secondary              |Yes     |Session 4    |
|Widget modes: ungated (6 cards) / gated (2-3 profile-matched cards) |Yes     |Session 4    |
|Platform selector: above card grid, localStorage memory             |Yes     |Session 4    |
|Return instruction: silent JS constant, not in JSON or clipboard    |Yes     |Session 4    |
|Return destination: prism.eopmedia.com                              |Yes     |Session 4    |
|PDF library: WeasyPrint replaces ReportLab                          |Yes     |Session 4    |
|On-chain storage: access tokens only, not profile data              |Yes     |Session 4    |
|Decentralized profile storage (Ceramic): deferred to V3             |Yes     |Session 4    |
|Dynamic card generation at page load: deferred to V3                |Yes     |Session 4    |
|PRISM Profile questions and tag taxonomy finalized|Yes|Session 5|
|Schema automation and citation monitoring: deferred to V2+|Yes|Session 6|
|Citation monitoring dashboard: admin-only (Angelia in V2+, licensee admins in V3)|Yes|Session 6|
|Schema injection method (wp_head vs PHP template): open question — resolve before V2+ build|No|Session 6|
|Brief data structure (discrete question field vs freeform prompt): open question — resolve before V2+ build|No|Session 6|
-----

## Session Protocol

Start every Claude Code session with:

> "I am building PRISM. Refer to CLAUDE.md for context."

Before pushing any changes, confirm:

- [ ] No changes to eop-connect.iife.js or eop-dashboard.iife.js
- [ ] No changes to .github/workflows/prism-generate.yml (unless intentional)
- [ ] New post files are inside prism/posts/ only
- [ ] .env is not staged (git status should show it as untracked only)
- [ ] Widget tested before push
