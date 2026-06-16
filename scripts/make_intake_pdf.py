#!/usr/bin/env python3
"""Generate the Beyond Concierge fill-in data-intake PDF."""
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, Flowable,
)

OUT = "Beyond-Concierge-Data-Intake.pdf"

CHARCOAL = colors.HexColor("#1B1B1F")
CHARCOAL2 = colors.HexColor("#34343A")
GOLD = colors.HexColor("#B08D3E")
GOLD_LT = colors.HexColor("#C8A862")
GRID = colors.HexColor("#D7D5CE")
SOFT = colors.HexColor("#F4F2EC")
MUTED = colors.HexColor("#6F6F77")
WHITE = colors.white

PAGE_W, PAGE_H = letter
LM = RM = 0.55 * inch
CONTENT_W = PAGE_W - LM - RM

styles = getSampleStyleSheet()
H1 = ParagraphStyle("H1", parent=styles["Title"], fontName="Helvetica-Bold",
                    fontSize=23, leading=26, textColor=CHARCOAL, spaceAfter=2, alignment=0)
EYEBROW = ParagraphStyle("Eyebrow", fontName="Helvetica-Bold", fontSize=8.5,
                         textColor=GOLD, spaceAfter=2, leading=11)
SECT = ParagraphStyle("Sect", fontName="Helvetica-Bold", fontSize=14.5,
                      textColor=CHARCOAL, spaceAfter=1, leading=17)
BODY = ParagraphStyle("Body", fontName="Helvetica", fontSize=9.5,
                      textColor=MUTED, leading=13, spaceAfter=2)
SMALL = ParagraphStyle("Small", fontName="Helvetica", fontSize=8, textColor=MUTED, leading=10)
CELLH = ParagraphStyle("CellH", fontName="Helvetica-Bold", fontSize=8.2, textColor=WHITE, leading=10)
CELL = ParagraphStyle("Cell", fontName="Helvetica", fontSize=9, textColor=CHARCOAL, leading=11)


class HR(Flowable):
    def __init__(self, width, color=GOLD, thickness=1.4):
        super().__init__(); self.width = width; self.color = color; self.thickness = thickness
    def wrap(self, *a): return (self.width, self.thickness + 4)
    def draw(self):
        self.canv.setStrokeColor(self.color); self.canv.setLineWidth(self.thickness)
        self.canv.line(0, 2, self.width, 2)


def header_footer(canvas, doc):
    canvas.saveState()
    # top charcoal band
    band_h = 0.6 * inch
    canvas.setFillColor(CHARCOAL)
    canvas.rect(0, PAGE_H - band_h, PAGE_W, band_h, fill=1, stroke=0)
    # gold mark square
    canvas.setFillColor(GOLD)
    canvas.roundRect(LM, PAGE_H - band_h + 0.13 * inch, 0.34 * inch, 0.34 * inch, 4, fill=1, stroke=0)
    canvas.setFillColor(CHARCOAL)
    canvas.setFont("Helvetica-Bold", 16)
    canvas.drawString(LM + 0.085 * inch, PAGE_H - band_h + 0.205 * inch, "B")
    # wordmark
    canvas.setFillColor(WHITE)
    canvas.setFont("Helvetica-Bold", 12)
    canvas.drawString(LM + 0.46 * inch, PAGE_H - band_h + 0.30 * inch, "BEYOND CONCIERGE")
    canvas.setFillColor(GOLD_LT)
    canvas.setFont("Helvetica-Bold", 7)
    canvas.drawString(LM + 0.46 * inch, PAGE_H - band_h + 0.16 * inch, "EXECUTIVE OS  ·  DATA INTAKE")
    canvas.setFillColor(colors.HexColor("#C9C9CD"))
    canvas.setFont("Helvetica", 9)
    canvas.drawRightString(PAGE_W - RM, PAGE_H - band_h + 0.24 * inch, "Confidential")
    # footer
    canvas.setStrokeColor(GOLD); canvas.setLineWidth(1)
    canvas.line(LM, 0.55 * inch, PAGE_W - RM, 0.55 * inch)
    canvas.setFillColor(MUTED); canvas.setFont("Helvetica", 7.5)
    canvas.drawString(LM, 0.38 * inch, "Beyond Concierge — Data Intake Form")
    canvas.drawRightString(PAGE_W - RM, 0.38 * inch, f"Page {doc.page}")
    canvas.restoreState()


def section(eyebrow, title, desc=None):
    out = [Spacer(1, 10), Paragraph(eyebrow.upper(), EYEBROW), Paragraph(title, SECT), HR(CONTENT_W)]
    if desc:
        out.append(Spacer(1, 1)); out.append(Paragraph(desc, BODY))
    out.append(Spacer(1, 4))
    return out


def grid_table(headers, widths, prefill=None, blanks=0, row_h=24):
    """Build a fill-in table. prefill = list of first-column labels."""
    prefill = prefill or []
    header_row = [Paragraph(h, CELLH) for h in headers]
    data = [header_row]
    for label in prefill:
        row = [Paragraph(label, CELL)] + [""] * (len(headers) - 1)
        data.append(row)
    for _ in range(blanks):
        data.append([""] * len(headers))
    heights = [18] + [row_h] * (len(data) - 1)
    t = Table(data, colWidths=widths, rowHeights=heights, repeatRows=1)
    style = [
        ("BACKGROUND", (0, 0), (-1, 0), CHARCOAL),
        ("LINEBELOW", (0, 0), (-1, 0), 0.5, CHARCOAL),
        ("GRID", (0, 1), (-1, -1), 0.5, GRID),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, 0), 4),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 4),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, SOFT]),
    ]
    return Table([[t]], colWidths=[CONTENT_W], style=[("LEFTPADDING",(0,0),(-1,-1),0),("RIGHTPADDING",(0,0),(-1,-1),0)]) if False else _styled(t, style)


def _styled(t, style):
    t.setStyle(TableStyle(style)); return t


def two_col(rows, label_w=2.6 * inch):
    val_w = CONTENT_W - label_w
    data = [[Paragraph(f"<b>{a}</b>", CELL), ""] for a in rows]
    t = Table(data, colWidths=[label_w, val_w], rowHeights=[26] * len(rows))
    _styled(t, [
        ("GRID", (0, 0), (-1, -1), 0.5, GRID),
        ("BACKGROUND", (0, 0), (0, -1), SOFT),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
    ])
    return t


story = []

# ── Title page intro ────────────────────────────────────────────────────────
story.append(Spacer(1, 6))
story.append(Paragraph("OWNER DATA INTAKE", EYEBROW))
story.append(Paragraph("Let's put your real numbers in.", H1))
story.append(Spacer(1, 4))
story.append(Paragraph(
    "Fill in whatever you know — rough numbers are fine, and you can do it in passes. "
    "Anything you leave blank simply stays empty in the dashboard until you add it. "
    "The most important sections are <b>Services &amp; Pricing</b> and <b>Monthly Overhead</b> — "
    "those power most of the dashboard. When you're done, send this back and we'll upload it.",
    BODY))
story.append(Spacer(1, 4))
tips = Table([[
    Paragraph("<b>1 · Print &amp; write</b><br/>or type into the boxes on your computer.", SMALL),
    Paragraph("<b>2 · Send it back</b><br/>email the file to your Beyond Concierge contact.", SMALL),
    Paragraph("<b>3 · We upload it</b><br/>and your live dashboard fills in.", SMALL),
]], colWidths=[CONTENT_W / 3] * 3)
_styled(tips, [("BACKGROUND", (0, 0), (-1, -1), SOFT), ("BOX", (0, 0), (-1, -1), 0.5, GRID),
               ("INNERGRID", (0, 0), (-1, -1), 0.5, GRID), ("VALIGN", (0, 0), (-1, -1), "TOP"),
               ("LEFTPADDING", (0, 0), (-1, -1), 8), ("TOPPADDING", (0, 0), (-1, -1), 7),
               ("BOTTOMPADDING", (0, 0), (-1, -1), 7)])
story.append(tips)

# ── 1. Business basics ──────────────────────────────────────────────────────
story += section("Section 1", "Business Basics")
story.append(two_col([
    "Clinic / location name", "Reporting month", "Avg. customers per month",
    "New customers per month", "Returning customers per month",
]))

# ── 2. Services & pricing ───────────────────────────────────────────────────
story += section("Section 2  ·  highest impact", "Services &amp; Pricing",
                 "For each service: retail price, product cost, nurse cost, labor/overhead, and how many you do per month. Card fees are auto-calculated. Add any service we missed in the blank rows.")
svc_headers = ["Service", "Retail $", "Product $", "Nurse $", "Labor $", "# / Month"]
svc_w = [1.9 * inch] + [(CONTENT_W - 1.9 * inch) / 5] * 5
services = ["Botox", "Dysport", "Dermal Fillers", "ThinWorks Body Contouring", "IV Therapy",
            "NAD+ Infusion", "Semaglutide Program", "Tirzepatide Program", "Vitamin Injections",
            "Concierge House Call", "Beyond Membership"]
story.append(grid_table(svc_headers, svc_w, prefill=services, blanks=4, row_h=23))

# ── 3. Monthly overhead ─────────────────────────────────────────────────────
story += section("Section 3  ·  highest impact", "Monthly Overhead (P&amp;L)",
                 "Your fixed monthly costs and rates. Revenue and product costs come from Section 2.")
story.append(two_col([
    "Payroll (monthly)", "Contractor costs (monthly)", "Nurse costs (monthly total)",
    "Marketing / ad costs (monthly)", "Rent &amp; facilities (monthly)", "Other overhead (monthly)",
    "Card fee rate (%)", "Refund rate (%)", "Transactions per month",
]))

# ── 4. IV therapy ───────────────────────────────────────────────────────────
story += section("Section 4", "IV Therapy — Ingredients &amp; Recipes",
                 "List each IV ingredient with its cost. Then list your drip menu and what goes in each.")
iv_headers = ["Ingredient", "Cost / Unit $", "Unit (mL, etc.)", "Supplier", "On Hand", "Reorder At"]
iv_w = [1.7 * inch] + [(CONTENT_W - 1.7 * inch) / 5] * 5
iv_ing = ["Vitamin C", "B-Complex", "B12", "Glutathione", "NAD+", "Magnesium", "Zinc",
          "Amino Blend", "Saline Bag"]
story.append(grid_table(iv_headers, iv_w, prefill=iv_ing, blanks=4, row_h=22))
story.append(Spacer(1, 8))
story.append(Paragraph("<b>Drip menu</b> — recipe name, retail price, and ingredients + amounts:", SMALL))
story.append(Spacer(1, 3))
rec_headers = ["Recipe / Drip Name", "Retail $", "Ingredients &amp; Amounts"]
rec_w = [2.0 * inch, 0.9 * inch, CONTENT_W - 2.9 * inch]
story.append(grid_table(rec_headers, rec_w, blanks=6, row_h=26))

# ── 5. GLP-1 ────────────────────────────────────────────────────────────────
story += section("Section 5", "GLP-1 Weight Loss",
                 "Program pricing, then each vial you've purchased (so we can track cost per mg).")
glp_prod_h = ["Product", "Monthly Price $", "Maintenance mg / month"]
glp_prod_w = [2.4 * inch, (CONTENT_W - 2.4 * inch) / 2, (CONTENT_W - 2.4 * inch) / 2]
story.append(grid_table(glp_prod_h, glp_prod_w, prefill=["Semaglutide", "Tirzepatide"], blanks=2, row_h=24))
story.append(Spacer(1, 8))
story.append(Paragraph("<b>Vials on hand</b>:", SMALL)); story.append(Spacer(1, 3))
vial_h = ["Lot / Batch", "Purchase Cost $", "mg in Vial", "mg Remaining", "Supplier", "Expiry"]
vial_w = [1.4 * inch] + [(CONTENT_W - 1.4 * inch) / 5] * 5
story.append(grid_table(vial_h, vial_w, blanks=6, row_h=24))

# ── 6. Inventory ────────────────────────────────────────────────────────────
story += section("Section 6", "Inventory",
                 "Everything you stock — product, supplies, retail. Add as many rows as you need.")
inv_h = ["Product", "Category", "Unit", "On Hand", "Unit Cost $", "Reorder At", "Supplier", "Expiry"]
inv_w = [1.45 * inch, 0.95 * inch, 0.6 * inch, 0.65 * inch, 0.8 * inch, 0.7 * inch, 1.0 * inch, 0.8 * inch]
# normalize widths to content
scale = CONTENT_W / sum(inv_w); inv_w = [w * scale for w in inv_w]
story.append(grid_table(inv_h, inv_w, blanks=12, row_h=22))

# ── 7. Website & SEO ────────────────────────────────────────────────────────
story += section("Section 7  ·  optional", "Website &amp; SEO",
                 "From Google Analytics / Search Console / your Google Business Profile (or estimates).")
story.append(two_col([
    "Organic visits / month", "Total website visits / month", "Online bookings / month",
    "Conversion rate (%)", "Google rating (stars)", "Number of Google reviews",
]))
story.append(Spacer(1, 6))
story.append(Paragraph("<b>Top keywords you want to rank for</b>:", SMALL)); story.append(Spacer(1, 3))
kw_h = ["Keyword / Phrase", "Monthly Searches (if known)", "Current Position (if known)"]
kw_w = [CONTENT_W * 0.5, CONTENT_W * 0.27, CONTENT_W * 0.23]
story.append(grid_table(kw_h, kw_w, blanks=6, row_h=22))

# ── 8. Social ───────────────────────────────────────────────────────────────
story += section("Section 8  ·  optional", "Social Media",
                 "Follower count and a few stats per channel. Leave blank any you don't use.")
soc_h = ["Channel", "Followers", "Growth % / mo", "Engagement %", "Posts / Week (goal)"]
soc_w = [1.6 * inch] + [(CONTENT_W - 1.6 * inch) / 4] * 4
story.append(grid_table(soc_h, soc_w, prefill=["Instagram", "TikTok", "Facebook", "YouTube", "LinkedIn"], blanks=1, row_h=24))

# ── 9. Advertising ──────────────────────────────────────────────────────────
story += section("Section 9  ·  optional", "Advertising",
                 "Each ad campaign: platform, spend, and what it produced.")
ad_h = ["Platform", "Campaign Name", "Monthly Spend $", "Leads", "Appointments", "Revenue $"]
ad_w = [1.0 * inch, 1.7 * inch] + [(CONTENT_W - 2.7 * inch) / 4] * 4
story.append(grid_table(ad_h, ad_w, blanks=8, row_h=23))

# ── 10. CRM & partnerships ──────────────────────────────────────────────────
story += section("Section 10", "CRM &amp; Partnerships",
                 "Gyms, doctors, influencers, corporate partners — and what each one sends you.")
crm_h = ["Partner Name", "Type", "Contact", "Leads", "Appts", "Revenue $", "Notes"]
crm_w = [1.4 * inch, 1.0 * inch, 1.0 * inch, 0.55 * inch, 0.55 * inch, 0.8 * inch, CONTENT_W - 5.3 * inch]
story.append(grid_table(crm_h, crm_w, blanks=10, row_h=24))

# ── Submit ──────────────────────────────────────────────────────────────────
story += section("All done?", "Send it back")
story.append(Paragraph(
    "Email the completed form to your Beyond Concierge contact and we'll upload it — your live "
    "dashboard will fill in with revenue, margins, inventory, and the rest. You can always update "
    "prices yourself anytime in <b>Owner Studio → Live Pricing</b>.", BODY))

doc = SimpleDocTemplate(
    OUT, pagesize=letter, leftMargin=LM, rightMargin=RM,
    topMargin=0.82 * inch, bottomMargin=0.7 * inch,
    title="Beyond Concierge — Data Intake Form", author="Beyond Concierge Executive OS",
)
doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
print("wrote", OUT)
