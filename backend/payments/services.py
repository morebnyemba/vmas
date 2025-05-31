# backend/payments/services.py
import logging
from io import BytesIO # Required for ReportLab in-memory PDF generation

from django.conf import settings
from django.utils import timezone
from django.core.files.base import ContentFile

from .models import Receipt, Payment
# from properties.models import Transaction # If linking to transactions

# --- ReportLab Imports ---
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_RIGHT, TA_CENTER
from reportlab.lib import colors
from reportlab.lib.units import inch

logger = logging.getLogger(__name__)

def _generate_receipt_pdf_reportlab(receipt_instance: Receipt):
    """
    Generates a PDF receipt using ReportLab and returns its content.
    """
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter,
                            rightMargin=72, leftMargin=72,
                            topMargin=72, bottomMargin=18)
    styles = getSampleStyleSheet()
    
    # Custom styles
    styles.add(ParagraphStyle(name='RightAlign', alignment=TA_RIGHT))
    styles.add(ParagraphStyle(name='CenterAlign', alignment=TA_CENTER, fontSize=16, spaceAfter=0.2*inch))
    styles.add(ParagraphStyle(name='BoldText', fontName='Helvetica-Bold'))

    story = []

    # Company Details (Consider making these configurable via settings)
    company_name = "Visit Masvingo Private Limited" # Or settings.COMPANY_NAME
    company_address = "123 Tourism Road, Masvingo, Zimbabwe" # Or settings.COMPANY_ADDRESS
    story.append(Paragraph(company_name, styles['h1']))
    story.append(Paragraph(company_address, styles['Normal']))
    story.append(Spacer(1, 0.2*inch))

    # Receipt Title
    story.append(Paragraph("OFFICIAL RECEIPT", styles['CenterAlign']))
    story.append(Spacer(1, 0.2*inch))

    # Receipt Details Table
    receipt_details_data = [
        [Paragraph("Receipt Number:", styles['BoldText']), receipt_instance.receipt_number],
        [Paragraph("Issue Date:", styles['BoldText']), receipt_instance.issued_at.strftime("%Y-%m-%d %H:%M:%S")],
        [Paragraph("Payment Reference:", styles['BoldText']), str(receipt_instance.payment.reference)],
    ]
    receipt_details_table = Table(receipt_details_data, colWidths=[1.5*inch, 4.5*inch])
    receipt_details_table.setStyle(TableStyle([
        ('ALIGN', (0,0), (0,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(receipt_details_table)
    story.append(Spacer(1, 0.2*inch))

    # Customer Details
    story.append(Paragraph("Billed To:", styles['BoldText']))
    customer_info = f"""
        {receipt_instance.customer_name or 'N/A'}<br/>
        {receipt_instance.customer_email or 'N/A'}<br/>
        {receipt_instance.customer_phone or 'N/A'}
    """
    story.append(Paragraph(customer_info, styles['Normal']))
    story.append(Spacer(1, 0.3*inch))

    # Items Description / Table
    story.append(Paragraph("Description of Services/Items:", styles['BoldText']))
    # For a simple description:
    # story.append(Paragraph(receipt_instance.items_description.replace('\n', '<br/>\n'), styles['Normal']))

    # For a more structured item table (if you have itemized data):
    # Example: assuming items_description is "Item 1: $10\nItem 2: $20"
    # Or if you fetch from related Transaction models
    item_data = [
        [Paragraph('Description', styles['BoldText']), Paragraph('Amount', styles['BoldText'])]
    ]
    
    # Simple parsing if items_description is structured, or build from related models
    # This is a placeholder. You'll need robust logic if items_description is complex.
    # For now, we'll use the single `items_description` field.
    item_data.append([
        Paragraph(receipt_instance.items_description or "Payment for services", styles['Normal']),
        Paragraph(f"{receipt_instance.currency} {receipt_instance.amount_paid}", styles['RightAlign'])
    ])
    
    items_table = Table(item_data, colWidths=[4.5*inch, 1.5*inch])
    items_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 1, colors.black),
        ('BACKGROUND', (0,0), (-1,0), colors.grey),
        ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
        ('ALIGN', (1,1), (-1,-1), 'RIGHT'), # Align amounts to the right
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('TOPPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(items_table)
    story.append(Spacer(1, 0.2*inch))
    
    # Total Amount
    total_data = [
        [Paragraph("Total Amount Paid:", styles['BoldText']), Paragraph(f"{receipt_instance.currency} {receipt_instance.amount_paid}", styles['RightAlign'])]
    ]
    total_table = Table(total_data, colWidths=[4.5*inch, 1.5*inch])
    total_table.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'RIGHT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('FONTNAME', (0,0), (-1,-1), 'Helvetica-Bold'),
        ('TOPPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(total_table)
    story.append(Spacer(1, 0.3*inch))

    # Payment Method
    story.append(Paragraph(f"Payment Method: {receipt_instance.payment_method_details}", styles['Normal']))
    story.append(Spacer(1, 0.3*inch))

    # Notes
    if receipt_instance.notes:
        story.append(Paragraph("Notes:", styles['BoldText']))
        story.append(Paragraph(receipt_instance.notes.replace('\n', '<br/>\n'), styles['Normal']))
        story.append(Spacer(1, 0.2*inch))

    # Thank you message
    story.append(Paragraph("Thank you for your business!", styles['Normal']))
    story.append(Spacer(1, 0.5*inch))
    story.append(Paragraph(f"Generated on: {timezone.now().strftime('%Y-%m-%d %H:%M:%S')}", styles['Italic']))


    doc.build(story)
    pdf_content = buffer.getvalue()
    buffer.close()
    return pdf_content


def generate_and_save_receipt(payment: Payment):
    """
    Gathers data, creates a Receipt instance, generates PDF with ReportLab,
    and saves it to the Receipt model.
    """
    if not payment.status == 'Paid':
        logger.warning(f"Payment {payment.reference} is not marked as paid. Receipt not generated.")
        return None

    try:
        if hasattr(payment, 'receipt') and payment.receipt:
            logger.info(f"Receipt already exists for payment {payment.reference}.")
            # Optionally, regenerate PDF if it's missing or needs update
            # if not payment.receipt.receipt_pdf:
            #     pdf_content = _generate_receipt_pdf_reportlab(payment.receipt)
            #     file_name = f"receipt_{payment.receipt.receipt_number}.pdf"
            #     payment.receipt.receipt_pdf.save(file_name, ContentFile(pdf_content), save=True)
            #     logger.info(f"PDF regenerated for existing receipt {payment.receipt.receipt_number}")
            return payment.receipt

        user = payment.user
        customer_name = user.get_full_name() if user else "N/A" # type: ignore
        customer_email = user.email if user else "N/A" # type: ignore
        customer_phone = payment.buyer_phone or (user.phone_number if user and hasattr(user, 'phone_number') else "N/A") # type: ignore
        
        # Simplified item description for now.
        # You should enhance this based on your application's logic,
        # e.g., by querying related Transaction models from `properties.models`
        items_description = f"Payment for services/goods related to reference {payment.reference}. Amount: {payment.currency} {payment.amount}."
        # Example if linking to properties.Transaction:
        # transactions = Transaction.objects.filter(payment_id=payment.reference) # Adjust as needed
        # if transactions.exists():
        #     item_lines = [f"{tx.get_transaction_type_display()}: {tx.amount} {tx.currency}" for tx in transactions]
        #     items_description = "\n".join(item_lines)


        receipt_instance = Receipt( # Don't save yet, we need the receipt_number first
            payment=payment,
            customer_name=str(customer_name),
            customer_email=str(customer_email),
            customer_phone=str(customer_phone),
            amount_paid=payment.amount,
            currency=payment.currency,
            payment_method_details=payment.integration.name if payment.integration else "Unknown",
            items_description=items_description,
        )
        receipt_instance.save() # Save to generate receipt_number and issued_at

        # Generate PDF using ReportLab
        pdf_content = _generate_receipt_pdf_reportlab(receipt_instance)
        if pdf_content:
            file_name = f"receipt_{receipt_instance.receipt_number}.pdf"
            receipt_instance.receipt_pdf.save(file_name, ContentFile(pdf_content), save=True) # Save again with PDF
            logger.info(f"Receipt {receipt_instance.receipt_number} created and PDF generated for payment {payment.reference}")
        else:
            logger.error(f"Failed to generate PDF for receipt {receipt_instance.receipt_number}")
            # Receipt instance is still saved, but without PDF. Handle as needed.
            
        return receipt_instance

    except Exception as e:
        logger.error(f"Error generating or saving receipt for payment {payment.reference}: {e}", exc_info=True)
        return None