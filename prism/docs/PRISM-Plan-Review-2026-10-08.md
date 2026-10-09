# PRISM Plan Review - October 8, 2026

*Read-only review by claude-fable-5-1 in Claude Code (manual mode). It read prism/CLAUDE.md, everything in prism/docs/, generate-pdf.py, the GitHub Action, .claude/settings.json, three prompt-card JSON files, and searched the two live wallet bundles. It changed no files.*

*Status: the sorting below is a PROPOSED triage, not decisions. Angelia has not yet decided anything in the "Decide before V2" or "Challenges to locked decisions" sections.*

---

## Proposed triage (finding numbers refer to the full review in the appendix)

### Act now (no V2 dependency, low risk)
- **#11 Manual citation baseline.** Already Angelia's stated plan (manual baseline, not built into V2). The new point is urgency: run the full query set in a spreadsheet before more press coverage lands.
- **#13 Live deep-link test.** In a browser, check whether claude.ai reads a PDF URL from a prefilled prompt. Five of the seven open V1 items depend on the answer. Also: no field or step currently produces the condensed summary ChatGPT needs.
- **#7 Spend cap.** Set a monthly limit in the Anthropic console on the eopmedia API account. Also covers the key the pipeline uses today.
- **#6 Action overwrites approved cards.** prism-generate.yml runs the API stage on every post edit and discards hand-edited JSON. Fix before anything hand-edits card JSON. The workflow file is on the Claude Code deny list, so the fix likely belongs in generate-pdf.py (skip the API call when a JSON already exists). Hypothesis: the script has not been read for this yet.

### Decide before V2 (design only, no code)
- **#1** Wallet address is treated as identity but nothing authenticates it.
- **#2** The tier gate runs only in the browser (verified in the bundles). The server must re-check tokens before paid Anthropic calls or gated content.
- **#3** CLAUDE.md says both "no fetch calls" and "mode determined by querying SQL at page load". These conflict. Choose: pasted block that fetches from PHP, or PHP-rendered block.
- **#12** Where the API key lives on shared hosting (wp-config constant outside the web root is the minimum).
- **#4** SFTA: the Product Brief promises SFTA profile access, but the profile key requires a wallet and the code only knows OBST and TACT. Open question below.
- **#8** Q7/Q8 free text is sensitive and tied to a public identifier. Needs consent text, retention, deletion and admin-visibility rules. (Not legal advice; counsel review if EU exposure grows.)
- **#9** First PHP work is V2, not V2+. Set up a staging copy of the site before any PHP.
- **#10** Where post tags live is undefined, and the tagging task lists 3 posts while 10 are live.

The reviewer's top recommendation: one page that settles #1, #2 and #3 (how PHP verifies the wallet, how it re-checks the token, and whether the widget fetches or is server-rendered).

### Challenges to locked decisions (Angelia's call; none adopted yet)
- Drop FAQPage schema and ship Article schema only (#5). The point that the cards have no answers to put in FAQPage is sound. The claim that FAQPage conflicts with Google's structured data rules has NOT been independently verified; check current Google guidance first.
- Defer the four-layer weighted index; per-card profile_match alone delivers gated mode for ten posts. If adopted, the tagging task is no longer a V2 blocker.
- Drop the ChatGPT secondary platform (removes a summary field, a generation step and URL-length limits).
- Cut Luma session recommendations from Phase 2.
- Drop monthly ChatGPT and Claude citation queries (training-data answers are weak signal); keep Perplexity.
- Use a config file, not per-licensee configurability, in the V2+ monitoring module.

### Verify / low priority
- #14 minor drift: CLAUDE.md says the Action detects files changed "in the push", but the workflow diffs only the last commit; unused mistune install; "Elementor" string at generate-pdf.py line 614; card text inserted with innerHTML and JSON inlined without escaping a closing script tag (becomes real once member free text renders).

---

## Open questions for Angelia
1. Does SFTA issue a token or require a connected wallet?
2. Has the wire release (named in the Schema doc) or any press already gone out?

## Proposed next steps (each confirmed before any code)
1. Answer the two questions above.
2. Read the EOP website skill, then draft the one-page auth and delivery decision (design only).
3. Read-only look at generate-pdf.py and the Action to confirm the overwrite fix.
4. On hold: the tagging assist, until the four-layer index decision is made.

---

## Appendix: full review output (verbatim from the Claude Code session)

```text
 I'll read the planning docs, the generator script, the
  workflow, settings, and a sample of prompt-card JSON, then
  give you a ranked review. No edits.

  Searched for 3 patterns, read 10 files (ctrl+o to expand)

● Bash(cat .gitignore 2>/dev/null; echo "---"; git ls-files |
      head -80)
  ⎿  .env
     ---
     .claude/settings.json
     … +50 lines (ctrl+o to expand)

● Core files are read. One quick check on the wallet gate bundle
  to see what tiers it knows about, since several V2
  assumptions hinge on it.

  Searched for 5 patterns (ctrl+o to expand)

● Review complete. I read all three docs, CLAUDE.md, the
  generator, the workflow, settings, three card JSON files, and
  grepped the two live wallet bundles to check how the tier gate
  actually works. No files were changed.

  Two things I verified in the bundles that the docs do not
  state: the tier gate runs entirely in the browser, checking
  token balances over a Polygon RPC, and neither bundle calls
  any WordPress endpoint or mentions SFTA.

  Findings, ranked by consequence

  1. Wallet address is treated as identity, but nothing
  authenticates it.
  Evidence: CLAUDE.md lines 179 to 180 and 242 to 244; Product
  Brief line 134. No doc mentions signature verification,
  nonces, or a session. Inferred, not found in a file.
  Why it matters: if the PHP endpoint accepts a wallet address
  sent from the browser, anyone can read or overwrite any
  member's profile, including Q7 and Q8 free text, by sending a
  different address. The decision to never use the WordPress
  user ID removes the one server-side identity WordPress gives
  you for free.
  Reversibility: low once profiles exist. Retrofitting auth
  means re-verifying every stored row.
  Confidence: high.

  2. The tier gate is client-side only, so the V2 server must
  re-check tokens itself.
  Evidence: CLAUDE.md line 272 says the tier gate is "already
  built." Grep of eop-connect.iife.js and eop-dashboard.iife.js
  finds balanceOf and ownerOf calls over an RPC, and no server
  endpoint. "Already built" is true for the browser, not for
  PHP.
  Why it matters: a PHP endpoint that performs paid Anthropic
  calls and returns gated content must verify holdings on the
  server, or the gate is cosmetic. This is extra scope V2 does
  not list.
  Reversibility: medium. Adding a server-side RPC check later is
  contained work, but any content served before then was
  unprotected.
  Confidence: high.

  3. "No fetch calls" and "mode determined at page load by
  querying SQL" cannot both be true.
  Evidence: CLAUDE.md line 217 versus lines 179 to 180.
  Why it matters: a pasted Custom HTML block cannot query SQL.
  Gated mode needs either a fetch to a PHP endpoint or a
  PHP-rendered widget. This is the central V2 architecture
  choice and the docs have not made it. The schema doc's open
  question 3 says the website skill targets PHP template
  injection, which I cannot verify.
  Reversibility: medium. Switching delivery models later means
  re-pasting ten posts.
  Confidence: high that it is a contradiction. The right answer
  depends on the website skill.

  4. SFTA members are promised V2 access, but the profile key
  requires a wallet with a token.
  Evidence: Product Brief lines 42 and 172 give SFTA profile
  access. CLAUDE.md line 53 and the bundles know only OBST and
  TACT. SFTA appears nowhere in the code.
  Why it matters: if SFTA is a free email tier without a wallet,
  those members cannot have a wallet-keyed profile at all. V2's
  conversion story depends on them.
  Question for you: does SFTA issue a token or require a
  connected wallet? If not, V2 either excludes SFTA or needs a
  second key, and that changes the schema.
  Reversibility: low. The primary key is the one thing you said
  you would never change.
  Confidence: medium.

  5. V2's profile_match field is blocked by a V2+ gate, and the
  gate only exists because of FAQPage schema.
  Evidence: CLAUDE.md lines 132 to 147 add profile_match in V2.
  CLAUDE.md line 302 and Product Brief line 212 forbid touching
  the card JSON until the question-field decision is made. The
  schema doc at lines 30 to 49 needs a question and an
  acceptedAnswer per card. Cards are prompts with no answers,
  confirmed across the three JSON files.
  Why it matters: you would have to invent answer text to fill
  FAQPage, and FAQPage for content not visible as Q&A on the
  page conflicts with Google's structured data rules. Dropping
  FAQPage and keeping only Article schema closes Gate 1
  immediately and unblocks V2. I think the FAQPage direction is
  wrong and this is the cheapest fix in the plan.
  Reversibility: high. Nothing is built yet.
  Confidence: high.

  6. The GitHub Action regenerates cards on every post edit and
  overwrites approved JSON.
  Evidence: prism-generate.yml line 74 runs the API stage
  unconditionally. CLAUDE.md line 24 calls the JSON "generated
  and approved."
  Why it matters: a typo fix to a live post triggers a fresh,
  non-deterministic card set and silently discards any manual
  edits. Once V2 adds hand-maintained fields such as
  profile_match or question, one push erases them. The pasted
  widget on WordPress would not update, so repo JSON, live
  widget, and any V2+ schema would drift apart.
  Reversibility: high if fixed before V2. Low after, because you
  would not know which fields were lost.
  Confidence: high.

  7. No spend or abuse controls on the V2 Anthropic endpoint.
  Evidence: CLAUDE.md lines 236 to 238 and 316 to 317. Rate
  limiting is mentioned only for V3 gas costs. Inferred, not
  found in a file.
  Why it matters: every Go Deeper click is a paid server call.
  One member or one script with a valid session can drain the
  budget. You need a per-wallet daily cap, a fixed max_tokens,
  and a hard monthly ceiling at the Anthropic console.
  Reversibility: high technically, but a surprise bill is not
  reversible.
  Confidence: high.

  8. Q7 and Q8 free text is sensitive data tied to a public
  identifier.
  Evidence: PRISM-Profile-V1.md lines 123 to 141; schema line
  257 to 258. Example answers describe business and payment
  decisions. No retention, deletion, consent copy, or
  admin-visibility rule appears in any doc.
  Why it matters: a wallet address is public and links to
  on-chain financial history. Pairing it with a self-described
  business situation makes the row identifying. Under GDPR-style
  rules a wallet address is personal data. The free text also
  enters the model prompt, so it needs escaping and should never
  be shown to other members or logged raw.
  Reversibility: medium. A deletion path and a privacy notice
  can be added, but data collected before consent cannot be
  un-collected.
  Confidence: high.

  9. V2 is the first PHP work, yet the PHP risk and backup rule
  are attached only to V2+.
  Evidence: CLAUDE.md line 304 and Product Brief line 215 flag
  PHP as higher consequence for schema injection. Phase 2 at
  Product Brief lines 166 to 168 is a custom plugin plus a PHP
  endpoint. No staging site or rollback procedure is defined
  anywhere. settings.json does ask before PHP edits, which is
  good.
  Why it matters: a broken plugin on GoDaddy shared hosting can
  white-screen the whole site, including the live token gate.
  Reversibility: high if you set up staging first. Low
  mid-incident.
  Confidence: high.

  10. Post tag storage is undefined and the tagging task is
  stale.
  Evidence: PRISM-Profile-V1.md lines 220 to 232 list three
  posts; ten are live per CLAUDE.md lines 360 to 373. No doc
  says where post tags live: WordPress taxonomy, the card JSON,
  or SQL. The weighted scoring at Profile-V1 lines 174 to 177 is
  undecided.
  Why it matters: the four-layer index cannot be built without a
  queryable tag store. For a library of ten posts a member can
  see all ten anyway.
  Reversibility: high.
  Confidence: high.

  11. The baseline citation run is time-sensitive and needs no
  code.
  Evidence: schema doc line 236 says before V2 launches
  publicly; Product Brief line 183 says before press coverage
  lands; both are scheduled under V2+ after V2 validation.
  Schema doc line 63 references a wire release.
  Why it matters: the zero state is only useful before coverage.
  Twenty-six queries in a spreadsheet takes an afternoon.
  Waiting for a dashboard forfeits the baseline.
  Question for you: has the wire release or any press already
  gone out?
  Reversibility: none. A missed baseline cannot be
  reconstructed.
  Confidence: high on the logic, medium on timing.

  12. API key placement on shared hosting is unspecified.
  Evidence: CLAUDE.md line 236 says "server-side config."
  Inferred beyond that.
  Why it matters: a key in the WordPress options table is
  readable by every plugin and lands in every database backup. A
  wp-config constant outside the web root is the minimum.
  Perplexity and OpenAI keys in V2+ have the same problem.
  Reversibility: high.
  Confidence: medium.

  13. Three deep-link gaps in the V1 improvements.
  Evidence: CLAUDE.md lines 189 and 200 require a condensed
  summary for ChatGPT; no field or generation step produces one
  in generate-pdf.py or the JSON. Profile-V1 line 201 appends
  the return instruction to the V2 server-side prompt, where the
  member never leaves the site, so it is a leftover. Whether
  claude.ai will fetch a PDF URL from a query-string prompt is
  not verified anywhere.
  Why it matters: the platform selector and return instruction
  are five of the seven open V1 items and gate V2. If the Claude
  deep link does not actually read the PDF, most of that work
  needs redesign.
  Reversibility: high.
  Confidence: high on the first two, low on the third because it
  needs a live test.

  14. Minor drift between CLAUDE.md and the workflow.
  Evidence: CLAUDE.md line 70 says the Action detects files
  changed "in the push." prism-generate.yml line 44 diffs only
  the last commit, so a two-commit push processes one post. The
  workflow installs mistune, which the script never imports.
  generate-pdf.py line 614 still says "Elementor." Card text is
  inserted with innerHTML at lines 526 to 528 and the JSON is
  inlined in a script tag without escaping a closing script tag.
  Why it matters: low today because you author the posts. The
  escaping point becomes real the moment member free text
  renders in a dashboard.
  Reversibility: high.
  Confidence: high.

  Decisions to lock before V2 coding

  - How the browser proves it owns the wallet to PHP. Signed
    nonce, or bind the wallet to a WordPress login session.
  - Widget delivery in V2: pasted block that fetches from PHP,
    or a PHP-rendered block. Also where PHP reads card JSON
    from, GitHub Pages or a copy in WordPress.
  - The final card JSON shape in one change: profile_match,
    optional question, and the summary field if ChatGPT stays.
    Fix the Action overwrite first.
  - Whether SFTA members can hold a profile at all.
  - Where post tags live, and whether the four-layer index ships
    in V2 or waits.
  - Spend policy: model, max_tokens, per-wallet cap, console
    ceiling.
  - Privacy terms for Q7 and Q8: consent text, retention,
    deletion, who can read them.
  - A staging copy of the site for all PHP work.

  Over-built for a proof of concept

  - The four-layer weighted index. Per-card profile_match alone
    delivers gated mode for ten posts.
  - Luma session recommendations in Phase 2. No API, data model,
    or taxonomy link exists for it.
  - FAQPage schema. Drop it and ship Article schema only, which
    also closes Gate 1.
  - Monthly ChatGPT and Claude citation queries. Non-browsing
    API answers reflect training data and give weak signal.
    Perplexity alone is enough for V2+.
  - Per-licensee configurability designed into the V2+
    monitoring module. A config file is fine for a single admin.
  - The ChatGPT secondary platform. It is a locked Session 4
    decision, so this is your call, but it adds a summary field,
    a generation step, and URL-length limits for a free-tier
    experience you already caveat. Claude-only would halve the
    deep-link work.

  Three things I would do first

  1. Run the citation baseline manually this week in a
     spreadsheet, before any more coverage lands.
  2. Fix the Action so it only calls the API when no JSON exists
     for the post, then lock the V2 card JSON shape in one
     commit with FAQPage dropped.
  3. Write a one-page V2 auth and delivery decision: how PHP
     verifies the wallet, how PHP re-checks the token, and
     whether the widget fetches or is rendered server-side.
     Nothing else in V2 can be designed until that page exists.

✻ Sautéed for 3m 58s · done 8:59 PM
```
