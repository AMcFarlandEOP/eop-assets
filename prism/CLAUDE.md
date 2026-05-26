# PRISM — EOP Media Build Context

> "Information is abundant. Meaning is scarce. PRISM is the bridge." — EOP Media, 2026

This file gives Claude Code full context for every PRISM build session.
Always read this file before making any changes to this repository.

---

## What This Repo Is

`eop-assets` is the GitHub Pages asset repository for EOP Media.
It serves JavaScript and HTML files directly to eopmedia.com via URL embed.

**Live files — DO NOT TOUCH:**
- `eop-connect.iife.js` — Polygon wallet connection for token-gate
- `eop-dashboard.iife.js` — Member dashboard widget

**PRISM files — all work happens here:**
- `prism/widget/prism-widget.html` — The embeddable blog widget (Version 1)
- `prism/prompt-cards/*.json` — Per-post prompt card data
- `prism/CLAUDE.md` — This file

---

## What PRISM Is

PRISM (Personalized Relevant Intelligence Synthesized for Meaning) is an EOP Media methodology
that filters fast-moving technology content through a reader's specific context.

**Three versions:**
- **V1 (current):** HTML widget + prompt cards embedded in blog posts. No backend. Acquisition tool.
- **V2 (next quarter):** PRISM Profile intake inside member dashboard at /member-dashboard/prism/. Personalized prompt cards via Anthropic API.
- **V3 (future):** Licensable product at prism.eopmedia.com.

---

## Technical Environment

| Layer | Tool |
|---|---|
| CMS | WordPress + Elementor |
| Token gate | Polygon blockchain (OBST + TACT tokens) |
| Asset hosting | GitHub Pages (this repo) |
| Widget embed | Elementor HTML block |
| AI API (V2) | Anthropic — claude-sonnet-4-6 |
| Session calendar | Luma |
| Video | Vimeo Starter |

---

## File Naming Conventions

- Widget: `prism-widget.html` (single file, updated in place)
- Prompt cards: `[post-slug].json` (one file per blog post)
- Example: `tangem-pay.json` for post slug `tangem-pay-stablecoin-bridge`

---

## Design System

The widget uses EOP brand colors. Do not introduce new colors without instruction.

```css
--eop-black: #0a0a0a
--eop-white: #f5f4f0
--eop-gold:  #c9a84c
--eop-gold-light: #e8c96a
```

Fonts: Syne (headings, labels) + DM Sans (body) — loaded from Google Fonts.

---

## Open Questions (resolve before V2 build)

1. PRISM Profile storage: WordPress user meta, external DB, or on-chain?
2. Content library indexing: by tag, tier, date, or PRISM relevance score?
3. Agent interface: Claude.ai deep-link or Anthropic API inside eopmedia.com?
4. V1 deep-link default platform: Claude.ai, ChatGPT, or Perplexity?
5. V2 prompt card generation: hand-authored or API-generated at page load?

---

## Session Protocol

Start every Claude Code session with:
> "I am building PRISM. Refer to CLAUDE.md for context."

Before pushing any changes, confirm:
- [ ] No changes to `eop-connect.iife.js` or `eop-dashboard.iife.js`
- [ ] New files are inside the `prism/` folder only
- [ ] Widget tested in browser before push
