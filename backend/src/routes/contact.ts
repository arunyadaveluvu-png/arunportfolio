import { Router, Request, Response } from 'express';
import { supabase } from '../config/supabase';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const router = Router();

// Nodemailer transport setup
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || '',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

router.post('/', async (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required fields.' });
  }

  try {
    // 1. Save to Supabase messages table
    const { data: dbData, error: dbError } = await supabase
      .from('messages')
      .insert([{ name, email, subject: subject || 'No Subject', message }])
      .select();

    if (dbError) {
      console.error('Database insertion error:', dbError);
      throw dbError;
    }

    // 2. Log visitor page submission
    const ipAddress = req.ip || req.headers['x-forwarded-for']?.toString() || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    
    await supabase.from('visitor_logs').insert([{
      ip_address: ipAddress,
      user_agent: userAgent,
      page_visited: 'Contact Form Submission'
    }]);

    // 3. Send email notification to admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const mailOptions = {
      from: `"Portfolio Contact Form" <${email}>`,
      to: adminEmail,
      subject: `New Portfolio Inquiry: ${subject || 'No Subject'}`,
      text: `You have received a new message from your portfolio website.
      
Name: ${name}
Email: ${email}
Subject: ${subject || 'No Subject'}
Message:
${message}
      `,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || 'No Subject'}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-line; background: #f4f4f4; padding: 10px; border-radius: 5px;">${message}</p>
      `,
    };

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('SMTP Mail error:', error);
        } else {
          console.log('Email sent successfully:', info.messageId);
        }
      });
    } else {
      console.log('SMTP not fully configured. Email notification simulation:');
      console.log('----------------------------------------------------');
      console.log(`To: ${adminEmail}`);
      console.log(`Subject: ${mailOptions.subject}`);
      console.log(`Content: ${mailOptions.text}`);
      console.log('----------------------------------------------------');
    }

    return res.status(201).json({ success: true, message: 'Message sent and logged successfully!', data: dbData });
  } catch (err: any) {
    console.error('Contact route error:', err);
    return res.status(500).json({ error: 'Failed to submit contact request.' });
  }
});

export default router;
