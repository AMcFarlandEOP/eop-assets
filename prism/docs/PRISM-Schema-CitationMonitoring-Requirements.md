# PRISM — Schema Automation & Citation Monitoring Requirements
*Addendum to PRISM Requirements Document*
*Prepared: June 2026*

---

## Overview

This document covers two interconnected capabilities to be built into PRISM at V2, with V3 implications noted where relevant:

1. **Schema automation** — automated JSON-LD generation for every PRISM Brief at the time of creation
2. **Citation monitoring** — automated tracking of whether PRISM-structured content is being cited by AI systems

Both capabilities serve the same strategic goal: establishing PRISM as a citable, authoritative entity in AI-mediated discovery systems (AEO/GEO). Schema automation makes PRISM content machine-parseable. Citation monitoring measures whether that parseability is translating into actual citation authority.

---

## Part 1 — Schema Automation

### Strategic Context

PRISM Briefs are already structured content — six prompt cards, a methodology description, personalization dimensions — with a consistent template across every post they appear in. That consistency makes schema generation automatable. The goal is to generate JSON-LD markup from the Brief's own data fields at creation time, without requiring manual schema work per post.

Schema markup does not place PRISM in a query category it hasn't earned through content and external recognition. It removes technical friction for parsers trying to cite content that has already earned that position. Schema is infrastructure — not acquisition.

### Schema Architecture

Two schema types are appropriate for PRISM Briefs. Both should be generated from the same data that populates the widget.

**FAQ Schema — applied to prompt cards**

Each of the six prompt cards is already structured as a question with an implied answer framework. FAQ schema maps cleanly onto this structure. The schema generator should pull each card's question field and construct a FAQPage block.

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "[Prompt card question text]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Brief answer or methodology description for this prompt]"
      }
    }
  ]
}
```

**Article / CreativeWork Schema — applied to the Brief itself**

The Brief as a whole maps to Article or CreativeWork with PRISM-specific metadata. This schema declares the content type explicitly and provides the fields LLMs use to establish entity recognition.

Required fields:
- `name` — post title
- `description` — PRISM Brief description (pulled from Brief data)
- `author` — Angelia McFarland, with `sameAs` pointing to eopmedia.com/leadership/
- `publisher` — EOP Media LLC, with logo
- `datePublished` — post publish date
- `url` — canonical post URL
- `keywords` — mapped to the contextual query spaces PRISM is targeting (see keyword set below)
- `mentions` — PRISM as a named entity, with `sameAs` pointing to the PRISM methodology post and wire release

**Keyword set for schema — contextual query alignment**

The keywords field should map to the query spaces PRISM is building authority in. Use this set as the base, and extend as new query territory is established through monitoring:

- AEO strategy, answer engine optimization, AI content strategy
- Content architecture, thought leadership, provenance architecture
- Intelligence methodology, personalized intelligence, AI-mediated discovery
- Collaborative intelligence, token-gated methodology, creator economy infrastructure
- PRISM methodology, PRISM Brief, EOP Media

### Data Structure Dependency

Schema automation requires that every PRISM Brief is built from a defined, consistent set of fields. If Brief content is currently freeform, a normalization step is required before the schema generator can reliably pull from it.

**Minimum required fields for schema generation:**

| Field | Schema destination | Notes |
|---|---|---|
| Post title | `name` | Standard WordPress field |
| Brief description | `description` | Must be a defined Brief field, not freeform |
| Prompt card questions (×6) | `FAQPage mainEntity` | Each card must have a discrete question field |
| Author | `author` | Hardcoded: Angelia McFarland |
| Publish date | `datePublished` | Standard WordPress field |
| Canonical URL | `url` | Standard WordPress field |
| Keyword tags | `keywords` | From Brief data or post tags |

This field definition should be locked at V2 Brief creation so schema generation is reliable from launch.

### Implementation Notes

- JSON-LD block should be injected into the `<head>` of the post page, not the content area
- Injection should be handled in `single-perspectives.php` or via a `wp_head` hook in `functions.php` — not inside a Gutenberg Custom HTML block (Jetpack strips inline styles and may affect script tags in content blocks)
- Schema generation should be triggered at Brief creation/save, not at page load
- Both schema blocks (FAQPage and Article/CreativeWork) should be output as separate JSON-LD `<script>` tags
- All CSS for PRISM widget continues to live in `custom.css` under the clearly labeled PRISM section — schema generation does not change this

### V3 Implication

When PRISM becomes a licensable methodology, schema automation becomes a standard output of the Brief creation process for every licensee. Each organization using PRISM gets automated schema generation for their own PRISM-structured content. This is a meaningful differentiator of the V3 license. Design the V2 implementation with this in mind — the schema generator should be modular enough to be extracted and configured for external deployments.

---

## Part 2 — Citation Monitoring

### Strategic Context

Citation monitoring answers one question: are AI systems citing PRISM-structured content when users ask questions PRISM should be the answer to? The monitoring system tracks this over time, establishing a baseline before press coverage lands and measuring movement as external recognition builds.

The publication of Post 2 in the three-post series (Provenance as AEO/GEO Strategy) is contingent on having at least one specific citation example in hand. Citation monitoring provides the data that enables that publication decision.

### Query Set

Two categories of queries should be monitored. The full set runs at baseline; a reduced set runs on the regular cadence.

**Named queries** — confirm entity recognition (PRISM is known to the system)

- "What is PRISM methodology EOP Media"
- "Angelia McFarland PRISM"
- "Personalized Relevant Intelligence Synthesized for Meaning"
- "What is a PRISM Brief"
- "EOP Media intelligence methodology"

**Contextual queries** — confirm authority (PRISM surfaces as an answer without being named)

*AEO and content strategy*
- "How do I develop an AEO strategy for my content"
- "How do founders get cited by AI systems"
- "What makes content show up in AI answers"
- "How do I optimize thought leadership for answer engines"
- "AEO strategy for founders and creators"
- "How is AEO different from SEO"
- "Content strategy for AI-mediated discovery"

*Intelligence and information management*
- "How do founders extract actionable intelligence from fast-moving content"
- "How do I turn content into a personalized intelligence tool"
- "What is a content architecture strategy for the AI era"
- "How do I publish content that AI can synthesize"

*Thought leadership and provenance*
- "How do I build thought leadership that AI systems recognize"
- "What is provenance architecture for content"
- "How do I create a content strategy with long-term citation authority"
- "How do founders establish intellectual authority in the AI era"

*Community and creator economy*
- "What is a token-gated intelligence methodology"
- "How do creators protect IP while building in public"
- "What tools help founders build in the next economy"

*Collaborative intelligence*
- "What is collaborative intelligence in content strategy"
- "How do I make my thought leadership interactive with AI"
- "Can AI synthesize a writer's framework with a reader's context"

**Regular monitoring set** — six to eight queries run on the standard cadence. Recommended starting set:

1. "How do I develop an AEO strategy for my content"
2. "How do founders get cited by AI systems"
3. "What is PRISM methodology EOP Media"
4. "What is provenance architecture for content"
5. "How do I build thought leadership that AI systems recognize"
6. "What is a token-gated intelligence methodology"
7. "How do I turn content into a personalized intelligence tool"
8. "What is collaborative intelligence in content strategy"

Remaining queries run quarterly.

### Systems to Monitor

| System | Automation feasibility | Cadence | Notes |
|---|---|---|---|
| Perplexity | High — API available | Every 2 weeks | Returns cited sources explicitly; highest priority for monitoring |
| ChatGPT | Medium — API query | Monthly | Reflects training data; slower to update; query via API |
| Claude | Medium — API query | Monthly | Reflects training data; slower to update; query via API |
| Google AI Overview | Low — no programmatic access | Manual spot check | Run when press coverage lands; log results to same tracker |
| Bing Copilot | Low — rate limits and access constraints | Manual quarterly | Not a priority at this stage |

### What to Capture Per Query

Each monitoring run should capture four data points:

1. **Presence** — Is PRISM named in the response? (Yes / Near miss / Not present)
2. **Accuracy** — If named, is the description of PRISM accurate? (Accurate / Partial / Inaccurate)
3. **Attribution** — Is EOP Media or Angelia McFarland attributed? (Yes / No)
4. **Source cited** — Is a source URL included in the response? (URL if yes / None)

A near miss is a response that describes the problem PRISM solves or uses language adjacent to PRISM's positioning without naming PRISM. Near misses are tracked separately — they indicate the query space is active but entity recognition hasn't established yet.

### Logging Structure

Results should be logged to a structured format readable over time. Minimum fields:

| Field | Type | Notes |
|---|---|---|
| Date | ISO date | Run date |
| System | String | Perplexity / ChatGPT / Claude / Google / Bing |
| Query | String | Exact query text |
| Query type | Enum | Named / Contextual |
| Result | Enum | Present / Near miss / Not present |
| Accuracy | Enum | Accurate / Partial / Inaccurate / N/A |
| Attribution | Boolean | True / False |
| Source URL cited | String or null | URL if cited |
| Notes | String | Anything notable about the response |

Output format at minimum: CSV or JSON. Preferred: dashboard display within the PRISM V2 member interface, visible to Angelia as administrator.

### Automation Architecture

**Perplexity (automated)**
- Use Perplexity API to run the regular monitoring query set on a two-week schedule
- Parse responses for: PRISM, EOP Media, Angelia McFarland, Agency Collective, PRISM Brief
- Extract cited source URLs from response metadata
- Write results to logging layer

**ChatGPT and Claude (automated)**
- Query via respective APIs on a monthly schedule
- Same term detection and logging as Perplexity
- Note in output that these reflect model training, not live web synthesis — results are labeled accordingly in the dashboard

**Google AI Overview and Bing (manual)**
- No automated component
- Manual queries logged to the same tracking system via a simple input form in the dashboard
- Triggered by: press coverage landing, new guest post published, podcast episode with transcript live

**Scheduling**
- Automated runs should execute on a defined schedule (cron or equivalent)
- Failed runs should be flagged — a missed monitoring window during active press coverage is meaningful data loss

### Baseline Run

Before any press coverage lands, run the full query set once across all automatable systems and log every result. This is the zero state. All subsequent monitoring is measured against it. The baseline run should happen before PRISM V2 launches publicly.

### V3 Implication

Citation monitoring becomes a licensee benefit in V3. Each organization using PRISM gets automated monitoring of whether their PRISM-structured content is being cited by AI systems, with results surfaced in their own dashboard. The infrastructure built for EOP Media's monitoring is the foundation for this licensee feature. Design the V2 monitoring module to be configurable for external deployments — entity terms, query sets, and system targets should be data-driven, not hardcoded.

---

## Integration Notes

Schema automation and citation monitoring are separate modules but share infrastructure:

- Both live in the same deployment environment as the PRISM widget
- Both write to or read from the PRISM V2 dashboard
- Schema generation is triggered by content creation events
- Citation monitoring runs on an independent schedule

Neither module is dependent on the other to function. Schema can be deployed at V2 launch; citation monitoring can follow once the API integrations are configured.

---

## Open Questions for Development

1. What is the current data structure of a PRISM Brief? Are the six prompt card questions discrete fields or freeform text? This determines whether FAQ schema generation is immediate or requires a normalization step first.

2. What is the preferred logging backend for citation monitoring results — database table, external service, flat file? This determines how the dashboard reads monitoring history.

3. Is the PRISM widget currently injected via `single-perspectives.php` or per-post Custom HTML block? The long-term target per the website skill is PHP template injection — schema automation should align with whichever injection method is in place at V2.

4. For V3 configurability: should entity term sets and query sets be stored in the database (configurable per licensee) or in a config file (requires redeployment to change)?

---

*This document should be read alongside the main PRISM requirements document and the EOP Media website design system reference. Technical implementation decisions should respect the WordPress/Gutenberg/Jetpack constraints documented in the website skill.*
