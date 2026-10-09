<!-- Snapshot converted to markdown from PRISM-Product-Brief-EOP-Media-Updated.docx for plan review (Oct 2026). The .docx remains the source of record. Bullets and callout boxes were reformatted; wording is unchanged. -->

# PRISM

*Personalized Relevant Intelligence Synthesized for Meaning*

**PRODUCT BRIEF — EOP MEDIA — 2026**

# 1. What Is PRISM

PRISM — Personalized Relevant Intelligence Synthesized for Meaning — is a methodology developed by Angelia McFarland and EOP Media. It names a capability that most founders and creators lack not because they are unintelligent, but because the content ecosystem was never built to serve them.

***Information is abundant. Meaning is scarce. PRISM is the bridge.***

The methodology takes fast-moving technology content — AI, Web3, crypto, emerging strategy — and filters it through a user's specific context: their business stage, their goals, their current challenges, their fluency level. What comes out is not a summary. It is a synthesis built for them.

In optics, a prism takes undifferentiated light and reveals the spectrum of meaning inside it. That is precisely what this methodology does. EOP Media is borrowing from the physics. The name belongs to the science; the practice belongs to the community.

# 2. Origin and Context

PRISM began as a blog feature — a widget at the top of EOP Media posts that gave readers a PDF companion and a set of prompt cards for exploring content within their personal AI context. The core insight was simple: readers who already had personal agents could load the PDF and query from within their own personalized context. The prompt cards were the bridge for everyone else.

That insight revealed a larger product gap. Most EOP Media readers do not yet have personal agents. And even those who do have no consistent methodology for making technology content actionable within their specific situation. PRISM is the answer to both problems — not just a widget, but a personalization layer that can be built, scaled, and eventually licensed.

The methodology was formally named and defined in May 2026 as a strategic asset of EOP Media. The PRISM Product Brief marks the beginning of its deliberate build.

# 3. The Problem PRISM Solves

Founders and creators in the Web3 and AI space face three compounding problems:

- Content volume has outpaced human capacity to process it. The half-life of intelligence in fast-moving technology spaces is measured in weeks, not months.
- Generic content cannot be acted on. A founder in pre-revenue stage and a founder scaling to Series A need different things from the same article. Most content ignores this entirely.
- Personalization tools exist, but most founders have not built them. Personal AI agents are powerful for those who have them and inaccessible to everyone else.

PRISM closes all three gaps simultaneously — by delivering synthesized, personalized intelligence without requiring the reader to already have a sophisticated AI setup.

# 4. Version Roadmap

|  | **Who It Serves** | **What They Get** |
| --- | --- | --- |
| Version 1 PRISM Lite | Any EOP Media blog reader | HTML widget with smart prompt cards. PDF companion with clickable hyperlinks (WeasyPrint). Platform selector (Claude primary, ChatGPT secondary). Go Deeper button passes selected prompt + article PDF to chosen platform. Return instruction brings readers back to prism.eopmedia.com. No profile or personalization. Six cards shown. Acquisition mechanism for SFTA. |
| Version 2 PRISM Standard | SFTA + paid Agency Collective members (Observer, TACT) | PRISM Profile intake (8 questions including 2 optional open-ended fields). Profile stored in GoDaddy SQL, wallet address as primary key. Widget shows 2–3 profile-matched cards. Synthesis via Anthropic API server-side — member never leaves eopmedia.com. Four-layer content library index. Lives inside member dashboard. |
| Version 2+ Schema & Monitoring | Admin only (Angelia McFarland) | Automated JSON-LD schema generation from Brief data at creation time. Citation monitoring via Perplexity, ChatGPT, and Claude APIs on a defined schedule. Admin dashboard showing citation results over time. Two open questions must be resolved before build begins — see Section 10. |
| Version 3 PRISM Full / Licensed | TACT members + external licensees | Full persistent agent scoped to EOP Media content. Dynamic card generation at page load. Session intelligence integrated. Decentralized profile storage evaluated (Ceramic or equivalent). Licensable to other communities and content publishers via EOP Media implementation service. Licensee citation monitoring dashboard — configurable per licensee. |

## Version 1 — Live and Improving

Version 1 is a widget, a PDF, and a prompt card set. It is live across three posts. V1 improvements now in progress add the Go Deeper deep-link feature, platform selector, and the prism.eopmedia.com return landing page. V1 improvements complete before V2 build begins.

## Version 2 — The Agency Collective Integration

Version 2 is where PRISM becomes a product. The PRISM Profile intake creates the personalization layer. From that point forward, every piece of EOP Media content a member encounters is filtered through their context. Synthesis happens inside eopmedia.com via the Anthropic API — the member never leaves the site.

Version 2 also functions as the conversion mechanism between tiers. A reader who finds the free Lite version useful has a clear reason to join the Collective for the full PRISM experience. The product earns the upgrade; PRISM names the gap.

Build scope: one quarter. This is the proof of concept for Version 3.

## Version 2+ — Schema Automation and Citation Monitoring

Version 2+ adds two capabilities that serve PRISM's AEO positioning. Schema automation generates JSON-LD markup from Brief data at creation time, making every PRISM post machine-parseable without manual effort. Citation monitoring tracks whether AI systems are citing PRISM-structured content when users ask questions PRISM should be the answer to.

Both capabilities are admin-only in V2+. The monitoring dashboard is visible to Angelia McFarland as site administrator. The infrastructure built here becomes a licensee benefit in V3.

Two open questions govern when V2+ build can begin. See Section 10.

## Version 3 — The Licensable Product

Version 3 is where EOP Media becomes an infrastructure provider rather than only a content community. PRISM as a licensable methodology with an implementation service is a natural extension of Angelia McFarland's background — building systems for organizations across IBM, Dell Technologies, startups, and EOP Media.

Sales conversations for Version 3 can begin the moment Version 2 is live. The working product is the pitch.

# 5. Architecture Decision

PRISM Version 2 will live inside the existing Agency Collective member dashboard at eopmedia.com/member-dashboard/prism/ — built as a self-contained module with its own page and component structure.

This decision was made deliberately. It captures the adoption advantages of an existing authenticated audience without locking the product permanently into the WordPress environment.

## The Portability Principle

The PRISM module is built portable from day one. Wallet address — not WordPress user ID — is the primary key for all profile data. When Version 3 is ready, the module migrates cleanly to prism.eopmedia.com and profile data migrates cleanly from SQL to any future storage layer without a rebuild.

## The Subdomain: prism.eopmedia.com

The subdomain is staked and has a defined role at each version:

- V1 improvements: Return destination for Go Deeper sessions. Landing page acknowledges the synthesis session and converts toward Agency Collective membership.
- V2: Marketing page for PRISM Standard. Points members to /member-dashboard/prism/
- V3: Full product home. PRISM module migrates here from WordPress dashboard.

## Why Not Standalone From Day One

A standalone subdomain optimizes for Version 3 at the expense of Version 2. Starting standalone means building and maintaining a second environment, re-implementing access control outside the existing Polygon token-gate, and launching to a destination with no existing traffic. The adoption friction is real and the timeline cost is significant.

The inside-first approach captures Version 2 adoption while building the architecture that makes Version 3 inevitable.

# 6. Monetization Logic

PRISM monetizes through three mechanisms that correspond directly to the version roadmap.

## Mechanism 1 — Membership Conversion (Version 1 → Version 2)

PRISM Lite is free and ungated. It creates the demand for the personalized experience that only Agency Collective membership provides. Every reader who finds the prompt cards useful and wants more has one path: SFTA (free entry) → Observer or TACT (paid tiers). PRISM is the conversion mechanism, not a standalone revenue line at this stage.

## Mechanism 2 — Membership Value (Version 2)

PRISM Standard is a reason to join and a reason to stay. It elevates the Agency Collective from a content community to a personalized intelligence platform. The PRISM Profile becomes more valuable over time as the content library grows, creating genuine retention mechanics that session attendance alone cannot produce.

## Mechanism 3 — Licensing and Implementation (Version 3)

Other communities and content publishers face the same problem EOP Media solved. PRISM as a licensable methodology with EOP Media delivering the implementation is a consulting and licensing revenue stream with no direct competitor in the Web3 and emerging technology content space.

# 7. Ecosystem Context

PRISM does not exist in isolation. It is embedded in the EOP Media product ecosystem and draws meaning from that context.

## The Agency Collective

The Agency Collective is the token-gated membership community PRISM serves at Version 2. Four tiers: SFTA (free entry), Observer/OBST (paid, biweekly live sessions), TACT (full membership: strategy sessions, guest speakers, governance, Agency Lab eligibility), Agency Lab (invite-only for active TACT members with projects). Built on the Polygon blockchain for access verification.

## Tangem

Tangem hardware wallets are sold by EOP Media. Full-price purchases include an OBST Observer token — the primary on-ramp to the paid community. PRISM Lite lives on the blog; PRISM Standard lives in the dashboard that Tangem buyers first encounter. The wallet is the bridge; PRISM is part of what makes the destination worth crossing to.

## EOP Media Blog

The blog is where PRISM Lite lives and where new readers first encounter the methodology. Every post in the EOP Media content library carries a PRISM widget. The blog is not just a content channel — it is the top of the PRISM funnel.

# 8. Technical Environment

| **Platform** | **Role in PRISM Build** |
| --- | --- |
| WordPress + Gutenberg | CMS and member portal. Version 1 widget lives here as a Custom HTML block. Version 2 dashboard module lives here initially at /member-dashboard/prism/ |
| Polygon blockchain | Token-gated access control only. OBST and TACT tokens verify tier access automatically. No manual approval. Profile data is not stored on-chain. |
| GoDaddy SQL | Dedicated prism_profiles table. Wallet address as primary key. WordPress reads and writes via lightweight custom plugin. No additional cost — existing hosting. |
| Anthropic API (claude-sonnet-4-6) | Prompt card generation (generate-pdf.py Stage 1). V2 synthesis called server-side via PHP — API key never reaches the browser. V2+ citation monitoring queries via API. |
| Perplexity API | V2+ citation monitoring. Highest priority system — returns cited sources explicitly. API key to be obtained before V2+ build begins. |
| GitHub Pages | Hosts wallet gate and dashboard widget scripts. Hosts generated PRISM PDFs served via pdf_url in prompt card JSON. |
| WeasyPrint (Python) | PDF generation. Replaced ReportLab. HTML/CSS input — full design control. Clickable hyperlinks supported natively. Free, open source. |
| Luma | Session calendar and registration. PRISM can surface relevant upcoming sessions based on member profile. |
| Vimeo Starter | Video hosting for Tangem setup library and session recordings. PRISM content library draws from this. |
| prism.eopmedia.com | Subdomain staked. V1 improvements: return destination for Go Deeper sessions. V2: marketing page. V3: full product home. |

# 9. Build Sequence

## Phase 1a — V1 Improvements (Current)

- Replace ReportLab with WeasyPrint in generate-pdf.py
- Add pdf_url field to prompt card JSON output
- Add platform selector to widget (Claude primary, ChatGPT secondary with caveat)
- Add Go Deeper → button to each prompt card
- Build deep-link URL constructor (Claude: pdf_url reference; ChatGPT: condensed text summary)
- Add silent return instruction as JavaScript constant (not visible on cards, not in clipboard copy)
- Add localStorage platform preference memory
- Build prism.eopmedia.com landing page (return destination + Agency Collective conversion)
- Address GitHub Pages propagation delay

## Phase 1b — Pre-V2 Dependencies (Before V2 Build Begins)

- Design PRISM Profile questions — COMPLETE. See PRISM-Profile-V1.md.
- Derive tag taxonomy from profile answer options — COMPLETE. 32 tags defined.
- Tag existing content library (one-time manual task)
- Finalize prism_profiles SQL table schema

## Phase 2 — Version 2 (Quarter 1)

- Build prism_profiles SQL table and WordPress custom plugin for read/write
- Build PRISM Profile intake UI at /member-dashboard/prism/
- Build server-side PHP endpoint for Anthropic API synthesis calls
- Build content library index (four-layer: tier → tag → relevance score → date)
- Implement gated widget mode (2–3 profile-matched cards from richer generated set)
- Connect session calendar (Luma) to PRISM for personalized session recommendations
- QA token-gate: SFTA profile access, TACT full access

## Phase 2b — Version 2+ (Post-V2 Validation)

Two open questions must be resolved before Phase 2b begins. See Section 10.

- Schema automation: generate JSON-LD (FAQPage + Article/CreativeWork) from Brief data at creation time
- Inject JSON-LD into post page <head> via confirmed injection method (wp_head hook or PHP template)
- Build Perplexity API integration for citation monitoring (biweekly cadence)
- Build ChatGPT and Claude API integrations for citation monitoring (monthly cadence)
- Build admin citation monitoring dashboard — visible to Angelia as site administrator only
- Run baseline monitoring query set before any press coverage lands
- Manual monitoring inputs for Google AI Overview and Bing Copilot (form in admin dashboard)

## Phase 3 — Version 3 (Post-V2 Validation)

- Migrate PRISM module to prism.eopmedia.com
- Evaluate decentralized profile storage (Ceramic or equivalent)
- Implement dynamic card generation at page load via Anthropic API
- Evaluate Polygon capabilities and cost controls if on-chain profile writes are introduced
- Package methodology as licensable product with implementation service offering
- Configure citation monitoring module for per-licensee entity terms and query sets
- Develop sales materials and licensing agreement template
- Begin outreach to first prospective licensee communities

# 10. Architectural Decisions

All five pre-V2 open questions were resolved in Session 4 (June 2026). Decisions are locked and reflected in CLAUDE.md.

| **Question** | **Decision** |
| --- | --- |
| Agent interface | Anthropic API inside eopmedia.com. Server-side PHP. API key never reaches the browser. Member never leaves the site. |
| Profile storage | Dedicated prism_profiles table in existing GoDaddy SQL. Wallet address as primary key. WordPress reads/writes via lightweight custom plugin. On-chain stays for access tokens only. |
| Content indexing | Four-layer system: tier gate → tag filter → relevance score (tag/profile match count) → date tiebreaker. Tag taxonomy derived from profile answer options. |
| V1 deep-link platform | Claude.ai primary (EOP Red). ChatGPT secondary (muted, "Best with ChatGPT Plus"). Platform selector above card grid, preference saved via localStorage. Return instruction appended silently to payload. Return destination: prism.eopmedia.com. |
| PDF hyperlinks | Resolved by replacing ReportLab with WeasyPrint. HTML/CSS pipeline. Hyperlinks work natively. |

## V2+ Open Questions — Must Resolve Before Phase 2b

> **⚠ OPEN QUESTION: BRIEF DATA STRUCTURE**
> Do the six prompt cards currently have a discrete question field, or is the prompt text the question? FAQ schema generation requires a clean question string per card. If cards are freeform today, a normalization step is required before schema automation can be built. This question must be answered before any work touches the JSON card structure — in V2 or V2+.

> **⚠ RISK AND OPEN QUESTION: SCHEMA INJECTION METHOD**
> JSON-LD blocks must be injected into the `<head>` of each post page, not the Gutenberg content area (Jetpack may affect script tags in content blocks). Options are: (a) wp_head hook in functions.php, or (b) injection in single-perspectives.php. Risk: this is a PHP theme file change — a different kind of task from the Python/JS work done so far, with higher consequence if it goes wrong. Confirm the injection method and ensure a child theme backup exists before any development begins.

# 11. V3 Parking Lot

These decisions are deliberately deferred. They are named here so they are not lost.

- Decentralized profile storage — Ceramic Network or equivalent. Evaluate at V3 scope. Wallet-address primary key ensures clean migration from SQL.
- Dynamic card generation at page load — Anthropic API call per member per post load. Justified at V3 scale, not in V2 proof-of-concept.
- Polygon cost cap and usage controls — Evaluate whether Polygon remains the best chain for any on-chain profile writes introduced in V3.
- Licensee citation monitoring dashboard — Each V3 licensee gets their own admin view of AI citation results for their PRISM-structured content. Entity terms, query sets, and monitored systems must be data-driven (not hardcoded) to support per-licensee configuration. Design the V2+ monitoring module with this in mind.
- Licensee baseline run process — Standardized onboarding step for every V3 licensee: run the full monitoring query set before any content goes live, to establish their zero state.

# 12. How to Use This Brief

This document is the foundational reference for all PRISM build sessions. It lives in the PRISM build project in Claude alongside CLAUDE.md.

When starting a new session, reference both documents: "I am building PRISM. Refer to CLAUDE.md and the Product Brief for context." Every build decision should trace back to the architecture, versioning logic, and monetization structure documented here.

When decisions are made that update or supersede anything in this document, update both the brief and CLAUDE.md before the next session. These documents should always reflect the current state of the product, not the initial state.

***Information is abundant. Meaning is scarce. PRISM is the bridge.  —  EOP Media, 2026***

EOP Media — PRISM Product Brief — Confidential
