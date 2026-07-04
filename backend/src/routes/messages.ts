import { Router } from 'express';
import { supabase } from '../config/supabase';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const router = Router();

// Nodemailer transport setup
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || '',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

// GET all messages (Admin)
router.get('/', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.json(data);
  } catch (err: any) {
    console.error('Fetch messages error:', err);
    return res.status(500).json({ error: 'Failed to fetch messages.' });
  }
});

// PUT mark message as read/unread (Admin)
router.put('/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { is_read } = req.body;

  try {
    const { data, error } = await supabase
      .from('messages')
      .update({ is_read: is_read ?? true })
      .eq('id', id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Message not found.' });
    }
    return res.json(data[0]);
  } catch (err: any) {
    console.error('Update message error:', err);
    return res.status(500).json({ error: 'Failed to update message.' });
  }
});

// POST reply to a message (Admin)
router.post('/:id/reply', requireAuth, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { replyText } = req.body;

  if (!replyText) {
    return res.status(400).json({ error: 'Reply text is required.' });
  }

  try {
    // 1. Fetch message details to get the sender's email
    const { data: message, error: fetchError } = await supabase
      .from('messages')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !message) {
      return res.status(404).json({ error: 'Message not found.' });
    }

    // 2. Send email reply
    const mailOptions = {
      from: `"Arun Portfolio Admin" <arunyadaveluvu@gmail.com>`,
      to: message.email,
      subject: `Re: ${message.subject}`,
      text: `Hi ${message.name},
      
${replyText}

Best regards,
Portfolio Admin
      `,
      html: `
        <p>Hi ${message.name},</p>
        <p style="white-space: pre-line;">${replyText}</p>
        <hr />
        <p style="font-size: 12px; color: #666;">
          On ${new Date(message.created_at).toLocaleString()}, you wrote:
          <br />
          <em>"${message.message}"</em>
        </p>
      `,
    };

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail(mailOptions);
    } else {
      console.log('SMTP not configured. Simulating reply email:');
      console.log('----------------------------------------------------');
      console.log(`To: ${message.email}`);
      console.log(`Subject: ${mailOptions.subject}`);
      console.log(`Content: ${mailOptions.text}`);
      console.log('----------------------------------------------------');
    }

    // 3. Mark original message as read
    const { data: updatedMsg, error: dbError } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', id)
      .select();

    if (dbError) throw dbError;

    return res.json({ success: true, message: 'Reply sent successfully and message marked as read.', data: updatedMsg[0] });
  } catch (err: any) {
    console.error('Send reply error:', err);
    return res.status(500).json({ error: 'Failed to send reply.' });
  }
});

// DELETE a message (Admin)
router.delete('/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return res.json({ success: true, message: 'Message deleted successfully.' });
  } catch (err: any) {
    console.error('Delete message error:', err);
    return res.status(500).json({ error: 'Failed to delete message.' });
  }
});

export default router;
