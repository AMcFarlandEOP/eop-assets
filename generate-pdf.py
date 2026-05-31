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
        "post": {"slug": post_slug, "generated": datetime.now().strftime("%Y-%m-%d")},
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
            text = re.sub(r'\*\*(.+?)\*\*', r'\1', text)  # bold
            text = re.sub(r'\*(.+?)\*', r'\1', text)       # italic
            text = re.sub(r'\[(.+?)\]\(.+?\)', r'\1', text) # links
            text = re.sub(r'`(.+?)`', r'\1', text)          # code
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
    """Generate branded EOP Media PDF from post content and prompt cards."""
    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.lib.styles import ParagraphStyle
        from reportlab.lib.units import inch
        from reportlab.lib import colors
        from reportlab.platypus import (
            SimpleDocTemplate, Paragraph, Spacer, HRFlowable,
            KeepTogether, PageBreak
        )
        from reportlab.platypus.flowables import HRFlowable
        from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
    except ImportError:
        print("ERROR: reportlab not installed. Run: pip install reportlab")
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
    def rgb(r, g, b):
        return colors.Color(r/255, g/255, b/255)

    red     = rgb(*EOP_RED)
    black   = rgb(*EOP_BLACK)
    ink_mid = rgb(*EOP_INK_MID)
    parch   = rgb(*EOP_PARCHMENT)
    rule    = rgb(*EOP_RULE)
    muted   = rgb(*EOP_MUTED)
    white   = rgb(*WHITE)

    # ── PAGE TEMPLATE WITH HEADER/FOOTER ──
    PAGE_W, PAGE_H = letter
    MARGIN = 0.85 * inch
    CONTENT_W = PAGE_W - (2 * MARGIN)

    def on_page(canvas, doc):
        canvas.saveState()

        # Top red rule
        canvas.setFillColor(red)
        canvas.rect(0, PAGE_H - 18, PAGE_W, 18, fill=1, stroke=0)

        # Header text
        canvas.setFillColor(white)
        canvas.setFont("Helvetica-Bold", 6.5)
        canvas.drawString(MARGIN, PAGE_H - 12, "PRISM by EOP Media")
        canvas.setFont("Helvetica", 6)
        canvas.drawRightString(PAGE_W - MARGIN, PAGE_H - 12,
                               "Personalized Relevant Intelligence Synthesized for Meaning")

        # Bottom rule
        canvas.setStrokeColor(rule)
        canvas.setLineWidth(0.5)
        canvas.line(MARGIN, 36, PAGE_W - MARGIN, 36)

        # Footer text
        canvas.setFillColor(muted)
        canvas.setFont("Helvetica", 6.5)
        canvas.drawString(MARGIN, 24, f"EOP Media  ·  eopmedia.com  ·  {today}")
        canvas.drawRightString(PAGE_W - MARGIN, 24, f"Page {doc.page}")

        canvas.restoreState()

    def on_first_page(canvas, doc):
        on_page(canvas, doc)

    # ── STYLES ──
    def style(name, **kwargs):
        defaults = dict(
            fontName='Helvetica',
            fontSize=10,
            leading=16,
            textColor=ink_mid,
            spaceAfter=8,
            spaceBefore=0,
            allowWidows=1,
        )
        defaults.update(kwargs)
        return ParagraphStyle(name, **defaults)

    styles = {
        'eyebrow': style('eyebrow',
            fontName='Helvetica-Bold',
            fontSize=7,
            leading=10,
            textColor=red,
            spaceAfter=4,
            spaceBefore=0,
        ),
        'acronym': style('acronym',
            fontName='Helvetica',
            fontSize=6.5,
            leading=10,
            textColor=muted,
            spaceAfter=10,
        ),
        'title': style('title',
            fontName='Helvetica-Bold',
            fontSize=22,
            leading=28,
            textColor=black,
            spaceAfter=6,
            spaceBefore=4,
        ),
        'meta': style('meta',
            fontName='Helvetica',
            fontSize=7,
            leading=10,
            textColor=muted,
            spaceAfter=16,
        ),
        'italic': style('italic',
            fontName='Helvetica-Oblique',
            fontSize=10.5,
            leading=17,
            textColor=ink_mid,
            spaceAfter=12,
        ),
        'body': style('body',
            fontName='Helvetica',
            fontSize=10,
            leading=17,
            textColor=ink_mid,
            spaceAfter=10,
        ),
        'h2': style('h2',
            fontName='Helvetica-Bold',
            fontSize=14,
            leading=20,
            textColor=black,
            spaceAfter=6,
            spaceBefore=18,
        ),
        'h3': style('h3',
            fontName='Helvetica-Bold',
            fontSize=11,
            leading=16,
            textColor=black,
            spaceAfter=4,
            spaceBefore=12,
        ),
        'h4': style('h4',
            fontName='Helvetica-Bold',
            fontSize=10,
            leading=15,
            textColor=black,
            spaceAfter=4,
            spaceBefore=10,
        ),
        'card_section_label': style('card_section_label',
            fontName='Helvetica-Bold',
            fontSize=7,
            leading=10,
            textColor=red,
            spaceAfter=12,
            spaceBefore=4,
        ),
        'card_tag': style('card_tag',
            fontName='Helvetica-Bold',
            fontSize=7,
            leading=10,
            textColor=red,
            spaceAfter=3,
        ),
        'card_body': style('card_body',
            fontName='Helvetica',
            fontSize=8.5,
            leading=13,
            textColor=ink_mid,
            spaceAfter=0,
        ),
        'cta_label': style('cta_label',
            fontName='Helvetica-Bold',
            fontSize=7,
            leading=10,
            textColor=muted,
            spaceAfter=4,
        ),
        'cta_body': style('cta_body',
            fontName='Helvetica',
            fontSize=9,
            leading=14,
            textColor=black,
            spaceAfter=0,
        ),
    }

    # ── BUILD STORY ──
    story = []

    # Title block
    story.append(Paragraph("PRISM by EOP Media", styles['eyebrow']))
    story.append(Paragraph("Personalized Relevant Intelligence Synthesized for Meaning", styles['acronym']))
    story.append(HRFlowable(width=CONTENT_W, thickness=2, color=red, spaceAfter=14))
    story.append(Paragraph(post_title, styles['title']))
    story.append(Paragraph(f"EOP Media  ·  {today}", styles['meta']))
    story.append(HRFlowable(width=CONTENT_W, thickness=0.5, color=rule, spaceAfter=16))

    # Article body
    for block in blocks:
        if block['type'] == 'h2':
            story.append(Paragraph(block['text'], styles['h2']))
        elif block['type'] == 'h3':
            story.append(Paragraph(block['text'], styles['h3']))
        elif block['type'] == 'h4':
            story.append(Paragraph(block['text'], styles['h4']))
        elif block['type'] == 'italic':
            story.append(Paragraph(block['text'], styles['italic']))
        elif block['type'] == 'p':
            story.append(Paragraph(block['text'], styles['body']))

    # ── PROMPT CARDS SECTION ──
    story.append(PageBreak())
    story.append(Paragraph("PRISM PROMPT CARDS", styles['eyebrow']))
    story.append(Paragraph(
        "Choose the prompt that matches your context. Copy it into your AI of choice — "
        "Claude, ChatGPT, or Perplexity — and add your specific situation to make the intelligence yours.",
        styles['body']
    ))
    story.append(HRFlowable(width=CONTENT_W, thickness=0.5, color=rule, spaceAfter=14))

    # Render each card
    for card in cards:
        card_block = []
        card_block.append(Paragraph(card['tag'].upper(), styles['card_tag']))
        card_block.append(Paragraph(card['prompt'], styles['card_body']))
        card_block.append(Spacer(1, 10))
        card_block.append(HRFlowable(width=CONTENT_W, thickness=0.5, color=rule, spaceAfter=10))
        story.append(KeepTogether(card_block))

    # ── CTA FOOTER ──
    story.append(Spacer(1, 12))
    story.append(HRFlowable(width=CONTENT_W, thickness=1.5, color=red, spaceAfter=12))
    story.append(Paragraph("WANT A PERSONALIZED VERSION?", styles['cta_label']))
    story.append(Paragraph(
        f"Members of The Agency Collective access PRISM Standard — prompt cards generated "
        f"from your specific profile: your business stage, your goals, your fluency level. "
        f'Learn more at <a href="{AGENCY_COLLECTIVE_URL}" color="#A41623">{AGENCY_COLLECTIVE_URL}</a>',
        styles['cta_body']
    ))

    # ── BUILD PDF ──
    doc = SimpleDocTemplate(
        str(output_path),
        pagesize=letter,
        leftMargin=MARGIN,
        rightMargin=MARGIN,
        topMargin=MARGIN + 0.25 * inch,
        bottomMargin=MARGIN,
        title=post_title,
        author="EOP Media",
        subject="PRISM — Personalized Relevant Intelligence Synthesized for Meaning",
    )

    doc.build(story, onFirstPage=on_first_page, onLaterPages=on_page)

    return output_path


def generate_embed_code(post_path):
    """Generate complete Elementor embed code with cards inlined."""
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
    base_url = "https://amcfarlandeop.github.io/eop-assets"
    pdf_url = f"{base_url}/prism/pdfs/{slug}.pdf"
    widget_url = f"{base_url}/prism/widget/prism-widget.html"

    cards_json = json.dumps(cards, indent=4)
    # indent for embedding inside script tag
    cards_json_indented = "\n".join("    " + line for line in cards_json.splitlines())

    embed = f"""<script>
  window.PRISM_CONFIG = {{
    intro: "{intro}",
    pdf_url: "{pdf_url}",
    cards: {cards_json_indented}
  }};
</script>

<iframe id="prism-frame"
  src="{widget_url}"
  width="100%" frameborder="0" scrolling="no"
  style="width:100%;border:none;display:block;"></iframe>

<script src="https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.3.9/iframeResizer.min.js"></script>
<script>
  iFrameResize({{ log: false, checkOrigin: false }}, '#prism-frame');
</script>"""

    print("\n" + "="*60)
    print(f"ELEMENTOR EMBED CODE — {slug}")
    print("="*60)
    print("Copy everything between the lines below:")
    print("-"*60)
    print(embed)
    print("-"*60 + "\n")

    # Also save to a file for easy copying
    output_path = Path("prism/prompt-cards") / f"{slug}-embed.html"
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(embed)
    print(f"✓ Embed code also saved to: {output_path}\n")



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
