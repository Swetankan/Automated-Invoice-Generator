import { Router, Request, Response } from 'express';
import { Invoice, IInvoice } from '../models/Invoice';
import puppeteer from 'puppeteer';
import nodemailer from 'nodemailer';
import { getInvoiceHtml } from '../utils/generateInvoiceHtml';

const router = Router();

// Route: POST /api/invoices
// Description: Create and save a new invoice
router.post('/', async (req: Request, res: Response) => {
  try {
    const invoiceData: IInvoice = req.body;
    const newInvoice = new Invoice(invoiceData);
    const savedInvoice = await newInvoice.save();
    res.status(201).json(savedInvoice);
  } catch (error) {
    console.error("Error saving invoice:", error);
    res.status(500).json({ message: 'Failed to save invoice', error });
  }
});

// Route: POST /api/invoices/generate-pdf
// Description: Generate a PDF from invoice data
router.post('/generate-pdf', async (req: Request, res: Response) => {
    try {
        const invoiceData: IInvoice = req.body;
        const htmlContent = getInvoiceHtml(invoiceData);

        const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
        const page = await browser.newPage();
        
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
        
        await browser.close();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoiceData.invoiceNumber}.pdf`);
        res.send(pdfBuffer);

    } catch (error) {
        console.error("Error generating PDF:", error);
        res.status(500).json({ message: 'Error generating PDF' });
    }
});

// Route: POST /api/invoices/send-email
// Description: Generate a PDF and email it to the client
router.post('/send-email', async (req: Request, res: Response) => {
    try {
        const invoiceData: IInvoice = req.body;
        const htmlContent = getInvoiceHtml(invoiceData);

        // 1. Generate PDF
        const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();

        // 2. Configure Nodemailer
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT || "587"),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // 3. Send Email
        await transporter.sendMail({
            from: `"Invoice Generator" <${process.env.EMAIL_USER}>`, // sender address
            to: invoiceData.clientEmail, // list of receivers
            subject: `Invoice #${invoiceData.invoiceNumber} from Your Company`, // Subject line
            text: `Hi ${invoiceData.clientName},\n\nPlease find your invoice attached.\n\nThank you!`, // plain text body
            attachments: [
                {
                    filename: `invoice-${invoiceData.invoiceNumber}.pdf`,
                    // FIX: Convert the Uint8Array from Puppeteer into a Buffer
                    content: Buffer.from(pdfBuffer),
                    contentType: 'application/pdf',
                },
            ],
        });

        res.status(200).json({ message: 'Email sent successfully!' });

    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: 'Failed to send email' });
    }
});

export default router;
