"""
PRISM PDF Generator — EOP Media
================================
Usage:
  Stage 1 — Generate prompt cards from a markdown post:
    python generate-pdf.py --post prism/posts/PRISM-Philosophy-Post-DRAFT.md --prompts-only

  Stage 2 — Generate the full PDF (after reviewing prompt cards):
    python generate-pdf.py --post prism/posts/PRISM-Philosophy-Post-DRAFT.md

The script reads your .env file for the ANTHROPIC_API_KEY.
"""

import os
import sys
import json
import re
import argparse
from pathlib import Path
from datetime import datetime

# Load environment variables from .env
from dotenv import load_dotenv
load_dotenv()

# ── CONFIGURATION ──────────────────────────────────────────────────────────────

EOP_RED        = (164, 22, 35)       # #A41623
EOP_BLACK      = (26, 24, 22)        # #1a1816
EOP_INK_MID    = (61, 58, 54)        # #3d3a36
EOP_PARCHMENT  = (244, 241, 236)     # #f4f1ec
EOP_RULE       = (217, 213, 206)     # #d9d5ce
EOP_MUTED      = (122, 118, 112)     # #7a7670
WHITE          = (255, 255, 255)

AGENCY_COLLECTIVE_URL = "https://eopmedia.com/the-agency-collective/"

BASE_URL = "https://amcfarlandeop.github.io/eop-assets"


def build_pdf_url(slug):
    """Construct the public GitHub Pages URL for a post's generated PDF."""
    return f"{BASE_URL}/prism/pdfs/{slug}.pdf"

# ── STAGE 1: GENERATE PROMPT CARDS VIA ANTHROPIC API ──────────────────────────

def generate_prompt_cards(post_content, post_title):
    """Call Anthropic API to generate 6 audience-specific prompt cards."""
    try:
        import anthropic
    except ImportError:
        print("ERROR: anthropic library not installed. Run: pip install anthropic")
        sys.exit(1)

    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        print("ERROR: ANTHROPIC_API_KEY not found in .env file.")
        sys.exit(1)

    print(f"\n→ Calling Anthropic API to generate prompt cards for:\n  {post_title}\n")

    client = anthropic.Anthropic(api_key=api_key)

    system_prompt = """You are an expert content strategist for EOP Media, a thought leadership 
platform serving founders and creators in the Web3, AI, and emerging technology space.

Your job is to read a blog post and generate two things:
1. A widget intro — 2 sentences describing what the article covers and how to use the prompts
2. Exactly 6 PRISM prompt cards for different reader segments

Widget intro rules:
- 2 sentences maximum
- Sentence 1: what specific topics this article covers (name them)
- Sentence 2: "The prompts below are starting points — not answers. Copy one into your AI of choice and add your own context."
- Do NOT include the Agency Collective line — that is added automatically
- Write in second person, present tense

Prompt card rules:
- Identify the 6 most distinct audience segments this post speaks to
- Each prompt must be 2-4 sentences, specific to this article's content
- Prompts should be written in first person from the reader's perspective
- The last card should always invite the reader to describe their own situation
- Return ONLY valid JSON — no preamble, no explanation, no markdown code fences

Return this exact JSON structure:
{
  "intro": "2-sentence widget intro here.",
  "cards": [
    {
      "id": "card-01",
      "audience": "brief description of who this is for",
      "tag": "If you are [type of reader]",
      "prompt": "the full prompt text the reader will copy"
    }
  ]
}"""

    user_message = f"""Please generate 6 PRISM prompt cards for this blog post:

TITLE: {post_title}

CONTENT:
{post_content}"""

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2000,
        messages=[{"role": "user", "content": user_message}],
        system=system_prompt
    )

    response_text = message.content[0].text.strip()

    # Strip markdown code fences if present
    response_text = re.sub(r'^```json\s*', '', response_text)
    response_text = re.sub(r'\s*```$', '', response_text)

    try:
        cards_data = json.loads(response_text)
        return cards_data.get("intro", ""), cards_data["cards"]
    except json.JSONDecodeError as e:
        print(f"ERROR: Could not parse API response as JSON: {e}")
        print(f"Raw response:\n{response_text}")
        sys.exit(1)


def save_prompt_cards(intro, cards, post_slug, output_dir):
    """Save generated prompt cards and intro to JSON file for review."""
    output_path = Path(output_dir) / f"{post_slug}.json"
    output_path.parent.mkdir(parents=True, exist_ok=True)

    output = {
        "post": {
            "slug": post_slug,
            "generated": datetime.now().strftime("%Y-%m-%d"),
            "pdf_url": build_pdf_url(post_slug),
        },
        "intro": intro,
        "cards": cards
    }

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    return output_path


def print_cards_for_review(intro, cards):
    """Print intro and prompt cards to terminal for review."""
    print("\n" + "="*60)
    print("PRISM WIDGET INTRO — REVIEW BEFORE GENERATING PDF")
    print("="*60)
    print(f"\n{intro}\n")
    print("="*60)
    print("PRISM PROMPT CARDS")
    print("="*60)
    for i, card in enumerate(cards, 1):
        print(f"\n[{i}] {card['tag']}")
        print(f"    Audience: {card['audience']}")
        print(f"    Prompt: {card['prompt'][:120]}...")
    print("\n" + "="*60)
    print("Intro and cards saved to prism/prompt-cards/")
    print("Review them, edit if needed, then run:")
    print("  python generate-pdf.py --post [your-post.md]")
    print("="*60 + "\n")


# ── MARKDOWN PARSING ───────────────────────────────────────────────────────────

def parse_markdown(content):
    """Parse markdown into structured blocks for PDF rendering."""
    lines = content.split('\n')
    blocks = []
    i = 0

    # Extract title from first H1 or ## TITLE section
    title = ""
    for line in lines:
        if line.startswith('# ') and not title:
            title = line[2:].strip()
            break

    # Look for ## TITLE block pattern
    for j, line in enumerate(lines):
        if line.strip() == '## TITLE' and j + 1 < len(lines):
            title = lines[j + 1].strip()
            break

    while i < len(lines):
        line = lines[i]

        # Skip draft metadata lines
        if line.startswith('*EOP Media') or line.startswith('*Status:') or line.startswith('## TITLE') or line.startswith('## SUBTITLE') or line.startswith('## BODY') or line.startswith('## DUAL CTA') or line.startswith('*DRAFT NOTES'):
            i += 1
            continue

        # Skip the title line itself (already captured)
        if line.strip() == title:
            i += 1
            continue

        # Skip horizontal rules
        if line.strip() == '---':
            i += 1
            continue

        # H3 headings
        if line.startswith('### '):
            blocks.append({'type': 'h3', 'text': line[4:].strip()})
            i += 1
            continue

        # H2 headings
        if line.startswith('## '):
            blocks.append({'type': 'h2', 'text': line[3:].strip()})
            i += 1
            continue

        # Bold dimension headers like **Dimension One: ...**
        bold_match = re.match(r'^\*\*(.+?)\*\*$', line.strip())
        if bold_match:
            blocks.append({'type': 'h4', 'text': bold_match.group(1)})
            i += 1
            continue

        # Italic subtitle/deck lines
        if line.strip().startswith('*') and line.strip().endswith('*') and len(line.strip()) > 2:
            text = line.strip()[1:-1]
            blocks.append({'type': 'italic', 'text': text})
            i += 1
            continue

        # Non-empty paragraph lines
        if line.strip():
            # Clean markdown formatting
            text = line.strip()
            text = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', text)  # bold
            text = re.sub(r'\*(.+?)\*', r'<em>\1</em>', text)              # italic
            text = re.sub(r'\[(.+?)\]\((.+?)\)', r'<a href="\2">\1</a>', text)  # links
            text = re.sub(r'`(.+?)`', r'<code>\1</code>', text)            # code
            if text:
                blocks.append({'type': 'p', 'text': text})

        i += 1

    return title, blocks


def extract_post_meta(filepath):
    """Extract slug and date from filename and content."""
    path = Path(filepath)
    slug = path.stem.lower().replace(' ', '-').replace('_', '-')
    # Clean up common suffixes
    slug = re.sub(r'-draft$', '', slug)
    slug = re.sub(r'-post$', '', slug)
    return slug


# ── STAGE 2: GENERATE PDF ─────────────────────────────────────────────────────

def generate_pdf(post_path, cards, output_dir):
    """Generate branded EOP Media PDF from post content and prompt cards via WeasyPrint."""
    try:
        from weasyprint import HTML
    except ImportError:
        print("ERROR: weasyprint not installed. Run: pip install weasyprint")
        print("WeasyPrint also requires Pango/cairo/GDK-Pixbuf system libraries —")
        print("see https://doc.courtbouillon.org/weasyprint/stable/first_steps.html")
        sys.exit(1)

    # Read and parse post
    with open(post_path, 'r', encoding='utf-8') as f:
        content = f.read()

    post_title, blocks = parse_markdown(content)
    post_slug = extract_post_meta(post_path)
    today = datetime.now().strftime("%B %d, %Y")

    # Output path
    output_path = Path(output_dir) / f"{post_slug}.pdf"
    output_path.parent.mkdir(parents=True, exist_ok=True)

    # ── COLOR HELPERS ──
    def hexcolor(rgb):
        return '#%02x%02x%02x' % rgb

    red     = hexcolor(EOP_RED)
    black   = hexcolor(EOP_BLACK)
    ink_mid = hexcolor(EOP_INK_MID)
    rule    = hexcolor(EOP_RULE)
    muted   = hexcolor(EOP_MUTED)

    # ── ARTICLE BODY HTML ──
    tag_by_type = {'h2': 'h2', 'h3': 'h3', 'h4': 'h4'}
    body_parts = []
    for block in blocks:
        block_type = block['type']
        if block_type in tag_by_type:
            body_parts.append(f"<{tag_by_type[block_type]}>{block['text']}</{tag_by_type[block_type]}>")
        elif block_type == 'italic':
            body_parts.append(f'<p class="italic">{block["text"]}</p>')
        elif block_type == 'p':
            body_parts.append(f'<p>{block["text"]}</p>')
    body_html = '\n'.join(body_parts)

    # ── PROMPT CARDS HTML ──
    card_parts = []
    for card in cards:
        card_parts.append(f'''<div class="card">
  <div class="card-tag">{card['tag'].upper()}</div>
  <div class="card-body">{card['prompt']}</div>
</div>''')
    cards_html = '\n'.join(card_parts)

    html_doc = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>{post_title}</title>
<style>
  @page {{
    size: letter;
    margin: 1.05in 0.85in 0.85in 0.85in;
    @top-center {{
      content: element(pageHeader);
      width: 100%;
      margin: 0;
    }}
    @bottom-center {{
      content: element(pageFooter);
      width: 100%;
      margin: 0;
    }}
  }}

  * {{ box-sizing: border-box; }}

  body {{
    font-family: Georgia, 'Times New Roman', serif;
    color: {ink_mid};
    font-size: 10pt;
    line-height: 1.5;
  }}

  #page-header {{
    position: running(pageHeader);
    background: {red};
    color: #ffffff;
    font-family: 'Courier New', Courier, monospace;
    font-size: 6.5pt;
    padding: 6px 0.85in;
    display: flex;
    justify-content: space-between;
  }}

  #page-footer {{
    position: running(pageFooter);
    border-top: 0.5pt solid {rule};
    color: {muted};
    font-family: 'Courier New', Courier, monospace;
    font-size: 6.5pt;
    padding-top: 4px;
    display: flex;
    justify-content: space-between;
  }}

  #page-footer .pageno::after {{ content: counter(page); }}

  .eyebrow {{
    font-family: 'Courier New', Courier, monospace;
    font-weight: bold;
    font-size: 7pt;
    color: {red};
    margin-bottom: 4px;
  }}

  .acronym {{
    font-family: 'Courier New', Courier, monospace;
    font-size: 6.5pt;
    color: {muted};
    margin-bottom: 10px;
  }}

  hr {{ border: none; border-top: 0.5pt solid {rule}; margin: 14px 0; }}
  hr.thick {{ border-top: 2pt solid {red}; }}

  h1.title {{
    font-family: Georgia, serif;
    font-size: 22pt;
    color: {black};
    margin: 4px 0 6px 0;
  }}

  .meta {{
    font-family: 'Courier New', Courier, monospace;
    font-size: 7pt;
    color: {muted};
    margin-bottom: 16px;
  }}

  h2 {{ font-size: 14pt; color: {black}; margin: 18px 0 6px 0; }}
  h3 {{ font-size: 11pt; color: {black}; margin: 12px 0 4px 0; }}
  h4 {{ font-size: 10pt; color: {black}; margin: 10px 0 4px 0; }}
  p {{ margin: 0 0 10px 0; }}
  p.italic {{ font-style: italic; }}
  a {{ color: {red}; }}

  .cards-section {{ page-break-before: always; }}

  .card {{
    border-bottom: 0.5pt solid {rule};
    padding-bottom: 10px;
    margin-bottom: 10px;
    break-inside: avoid;
  }}

  .card-tag {{
    font-family: 'Courier New', Courier, monospace;
    font-weight: bold;
    font-size: 7pt;
    color: {red};
    margin-bottom: 3px;
  }}

  .card-body {{ font-size: 8.5pt; line-height: 1.4; }}

  .cta {{
    border-top: 1.5pt solid {red};
    margin-top: 12px;
    padding-top: 12px;
  }}

  .cta-label {{
    font-family: 'Courier New', Courier, monospace;
    font-weight: bold;
    font-size: 7pt;
    color: {muted};
    margin-bottom: 4px;
  }}

  .cta-body {{ font-size: 9pt; color: {black}; }}
</style>
</head>
<body>

<div id="page-header">
  <span>PRISM by EOP Media</span>
  <span>Personalized Relevant Intelligence Synthesized for Meaning</span>
</div>
<div id="page-footer">
  <span>EOP Media &middot; eopmedia.com &middot; {today}</span>
  <span>Page <span class="pageno"></span></span>
</div>

<div class="eyebrow">PRISM by EOP Media</div>
<div class="acronym">Personalized Relevant Intelligence Synthesized for Meaning</div>
<hr class="thick">
<h1 class="title">{post_title}</h1>
<div class="meta">EOP Media &middot; {today}</div>
<hr>

{body_html}

<div class="cards-section">
  <div class="eyebrow">PRISM PROMPT CARDS</div>
  <p>Choose the prompt that matches your context. Copy it into your AI of choice — Claude, ChatGPT, or Perplexity — and add your specific situation to make the intelligence yours.</p>
  <hr>
  {cards_html}
</div>

<div class="cta">
  <div class="cta-label">WANT A PERSONALIZED VERSION?</div>
  <div class="cta-body">Members of The Agency Collective access PRISM Standard — prompt cards generated from your specific profile: your business stage, your goals, your fluency level. Learn more at <a href="{AGENCY_COLLECTIVE_URL}">{AGENCY_COLLECTIVE_URL}</a></div>
</div>

</body>
</html>"""

    HTML(string=html_doc, base_url=str(Path(post_path).resolve())).write_pdf(str(output_path))

    return output_path


# ── INLINE WIDGET TEMPLATE ──
WIDGET_TEMPLATE = """<!-- ============================================================
     PRISM by EOP Media — Gutenberg Custom HTML Block
     HTML + JS only. All CSS lives in:
     /wp-content/themes/eop-child-theme/assets/css/custom.css
     ============================================================ -->

<div id="prism-widget">
  <div class="pw-header">
    <span class="pw-eyebrow">PRISM by EOP Media</span>
    <span class="pw-acronym">Personalized Relevant Intelligence Synthesized for Meaning</span>
    <span class="pw-title">Engage Your AI to Go Deeper on This Article</span>
  </div>
  <div class="pw-intro">
    {intro} <strong>Members of The Agency Collective get a personalized version built around their profile.</strong>
  </div>
  <div class="pw-actions">
    <span class="pw-hint">{card_count} prompts built for this article</span>
    <a class="pw-pdf-btn" href="{pdf_url}" target="_blank">&#8595; Download PDF Companion</a>
    <button class="pw-toggle-btn" id="pw-toggle-btn">Explore Prompts &#8595;</button>
  </div>
  <div class="pw-cards-panel" id="pw-cards-panel">
    <span class="pw-cards-label">Choose your starting point — click any card to copy</span>
    <div class="pw-cards-grid" id="pw-cards-grid"></div>
    <div class="pw-cards-footer">
      <span class="pw-footer-note">Clicking a prompt copies it to your clipboard.</span>
      <a class="pw-footer-cta" href="https://eopmedia.com/the-agency-collective/" target="_blank">Get your personalized profile &rarr;</a>
    </div>
  </div>
</div>

<script>
(function() {{
  var cards = {cards_json};

  var grid   = document.getElementById('pw-cards-grid');
  var toggle = document.getElementById('pw-toggle-btn');
  var panel  = document.getElementById('pw-cards-panel');

  cards.forEach(function(card) {{
    var btn = document.createElement('button');
    btn.className = 'pw-card';
    btn.innerHTML =
      '<span class="pw-card-tag">'    + card.tag    + '</span>' +
      '<span class="pw-card-prompt">' + card.prompt + '</span>' +
      '<span class="pw-card-hint">Copy prompt</span>';

    btn.addEventListener('click', function() {{
      var hint = btn.querySelector('.pw-card-hint');
      if (navigator.clipboard) {{
        navigator.clipboard.writeText(card.prompt).then(function() {{
          btn.classList.add('copied');
          hint.textContent = 'Copied to clipboard';
          setTimeout(function() {{
            btn.classList.remove('copied');
            hint.textContent = 'Copy prompt';
          }}, 2500);
        }});
      }} else {{
        var ta = document.createElement('textarea');
        ta.value = card.prompt;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        btn.classList.add('copied');
        hint.textContent = 'Copied to clipboard';
        setTimeout(function() {{
          btn.classList.remove('copied');
          hint.textContent = 'Copy prompt';
        }}, 2500);
      }}
    }});
    grid.appendChild(btn);
  }});

  toggle.addEventListener('click', function() {{
    var isOpen = panel.classList.toggle('open');
    toggle.innerHTML = isOpen ? 'Collapse &#8593;' : 'Explore Prompts &#8595;';
  }});
}})();
</script>""" 

def generate_embed_code(post_path):
    """Generate self-contained inline Gutenberg HTML block."""
    slug = extract_post_meta(post_path)
    cards_path = Path("prism/prompt-cards") / f"{slug}.json"

    if not cards_path.exists():
        print(f"ERROR: No prompt cards found at {cards_path}")
        print("Run Stage 1 first: python generate-pdf.py --post [post] --prompts-only")
        sys.exit(1)

    with open(cards_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    intro = data.get("intro", "")
    cards = data.get("cards", [])
    pdf_url = data.get("post", {}).get("pdf_url") or build_pdf_url(slug)

    cards_json = json.dumps(cards, ensure_ascii=False)

    embed = WIDGET_TEMPLATE.format(
        intro=intro,
        card_count=len(cards),
        pdf_url=pdf_url,
        cards_json=cards_json
    )

    output_path = Path("prism/prompt-cards") / f"{slug}-embed.html"
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(embed)

    print("\n" + "="*60)
    print(f"GUTENBERG EMBED CODE — {slug}")
    print("="*60)
    print(f"\n✓ Embed code saved to: {output_path}")
    print("  Open it in VS Code, select all, and paste into your Gutenberg HTML block.")
    print("\n" + "="*60 + "\n")



# ── MAIN ───────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description='PRISM PDF Generator — EOP Media')
    parser.add_argument('--post', required=True, help='Path to markdown post file')
    parser.add_argument('--prompts-only', action='store_true',
                        help='Only generate prompt cards, skip PDF creation')
    parser.add_argument('--embed', action='store_true',
                        help='Generate Elementor embed code from approved prompt cards')
    args = parser.parse_args()

    post_path = Path(args.post)

    # Handle embed code generation
    if args.embed:
        generate_embed_code(post_path)
        return

    if not post_path.exists():
        print(f"ERROR: Post file not found: {post_path}")
        sys.exit(1)

    # Read post content
    with open(post_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Parse title
    title, _ = parse_markdown(content)
    slug = extract_post_meta(post_path)

    # Check for existing prompt cards
    cards_path = Path("prism/prompt-cards") / f"{slug}.json"

    if args.prompts_only or not cards_path.exists():
        # Generate prompt cards via API
        intro, cards = generate_prompt_cards(content, title)
        saved_path = save_prompt_cards(intro, cards, slug, "prism/prompt-cards")
        print_cards_for_review(intro, cards)

        if args.prompts_only:
            print(f"✓ Prompt cards saved to: {saved_path}")
            print("  Review and edit if needed, then run without --prompts-only to generate PDF.")
            return
    else:
        # Load existing approved prompt cards
        print(f"\n→ Loading approved prompt cards from: {cards_path}")
        with open(cards_path, 'r', encoding='utf-8') as f:
            cards_data = json.load(f)
        cards = cards_data["cards"]
        # intro available as cards_data.get("intro", "") if needed

    # Generate PDF
    print(f"\n→ Generating PDF for: {title}")
    output_path = generate_pdf(post_path, cards, "prism/pdfs")
    print(f"\n✓ PDF generated: {output_path}")
    print(f"  Open it with: start {output_path}\n")


if __name__ == "__main__":
    main()
