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

## Open Questions (resolve before V2 build)

1. PRISM Profile storage: WordPress user meta, external DB, or on-chain?
2. Content library indexing: by tag, tier, date, or PRISM relevance score?
3. Agent interface: Claude.ai deep-link or Anthropic API inside eopmedia.com?
4. V1 deep-link default platform: Claude.ai, ChatGPT, or Perplexity?
5. PDF clickable links: ReportLab anchor tag issue unresolved — deferred

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
