import os
from typing import Dict, Any, List
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable

def generate_pdf_report(contract: Any, analysis: Any, findings: List[Any], output_path: str) -> str:
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()
    
    # Custom Palette
    NAVY = colors.HexColor("#0F172A")
    PURPLE = colors.HexColor("#6C5CE7")
    TEXT_DARK = colors.HexColor("#1E293B")
    TEXT_MUTED = colors.HexColor("#64748B")
    BORDER_COLOR = colors.HexColor("#E2E8F0")

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=NAVY
    )
    
    h2_style = ParagraphStyle(
        'SectionHeader',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=PURPLE,
        spaceBefore=12,
        spaceAfter=6
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['BodyText'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=TEXT_DARK
    )

    muted_style = ParagraphStyle(
        'BodyMuted',
        parent=styles['BodyText'],
        fontName='Helvetica',
        fontSize=9,
        leading=12,
        textColor=TEXT_MUTED
    )

    story = []

    # Title & Header Banner
    story.append(Paragraph("CONTRACTAI", ParagraphStyle('Brand', fontName='Helvetica-Bold', fontSize=12, textColor=PURPLE)))
    story.append(Paragraph("Executive Contract Risk Analysis Report", title_style))
    story.append(Spacer(1, 10))

    # Meta Table
    meta_data = [
        [Paragraph("<b>Contract Title:</b>", body_style), Paragraph(contract.title, body_style)],
        [Paragraph("<b>File Type:</b>", body_style), Paragraph(contract.file_type.upper(), body_style)],
        [Paragraph("<b>Analyzed Date:</b>", body_style), Paragraph(str(contract.created_at.strftime("%B %d, %Y")), body_style)],
        [Paragraph("<b>Overall Risk Score:</b>", body_style), Paragraph(f"<b>{analysis.overall_score} / 100</b> ({analysis.risk_tier})", body_style)]
    ]

    t_meta = Table(meta_data, colWidths=[130, 390])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
        ('PADDING', (0,0), (-1,-1), 6),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR)
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 15))

    # Executive Summary Section
    story.append(Paragraph("EXECUTIVE SUMMARY", h2_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PURPLE, spaceAfter=8))
    summary_text = analysis.executive_summary or "Contract analysis completed."
    story.append(Paragraph(summary_text, body_style))
    story.append(Spacer(1, 15))

    # Top Risks Section
    story.append(Paragraph("TOP RISK FINDINGS & CLAUSE MATRIX", h2_style))
    story.append(HRFlowable(width="100%", thickness=1, color=PURPLE, spaceAfter=8))

    table_data = [[
        Paragraph("<b>Category</b>", body_style),
        Paragraph("<b>Risk</b>", body_style),
        Paragraph("<b>Finding & Impact</b>", body_style),
        Paragraph("<b>Recommendation</b>", body_style)
    ]]

    for f in findings[:6]:
        r_color = "#EF4444" if f.risk_level == "HIGH" else "#F59E0B" if f.risk_level == "MEDIUM" else "#10B981"
        risk_p = Paragraph(f"<font color='{r_color}'><b>{f.risk_level} ({f.score})</b></font>", body_style)
        table_data.append([
            Paragraph(f.category, body_style),
            risk_p,
            Paragraph(f"<b>{f.title}</b><br/>{f.explanation or ''}", muted_style),
            Paragraph(f.negotiation_recommendation or f.redline_suggestion or "Review section.", muted_style)
        ])

    t_findings = Table(table_data, colWidths=[100, 70, 180, 170])
    t_findings.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F1F5F9")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('PADDING', (0,0), (-1,-1), 6),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR)
    ]))
    story.append(t_findings)
    story.append(Spacer(1, 20))

    # Legal Disclaimer
    disclaimer = (
        "<b>LEGAL DISCLAIMER:</b> ContractAI provides AI-assisted preliminary contract risk analysis and does not "
        "constitute formal legal advice. Users should consult qualified legal counsel for binding legal decisions."
    )
    story.append(Paragraph(disclaimer, muted_style))

    doc.build(story)
    return output_path
