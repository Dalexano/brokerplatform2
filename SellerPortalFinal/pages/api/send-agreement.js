import nodemailer from 'nodemailer';
import { createPDF } from '../../../utils/pdf-generator';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { formData } = req.body;
  const pdfBuffer = await createPDF(formData);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: [formData.email, process.env.BROKER_EMAIL],
      subject: 'Marketing Agreement Submission Confirmation',
      text: 'Thank you for your submission. Attached is your marketing agreement.',
      attachments: [{
        filename: 'MarketingAgreement.pdf',
        content: pdfBuffer,
      }],
    });
    res.status(200).json({ message: 'Email sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send email' });
  }
}
