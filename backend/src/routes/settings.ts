import { Router } from 'express';
import { supabase } from '../config/supabase';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// GET settings (Public)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*');

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.json({
        title: 'Portfolio & Admin Dashboard',
        logo_url: '',
        meta_description: 'Professional Portfolio Website',
        google_analytics_id: '',
        theme: 'dark'
      });
    }

    return res.json(data[0]);
  } catch (err: any) {
    console.warn('Fetch settings failed (db asleep). Serving fallback settings.');
    return res.json({
      title: 'Portfolio & Admin Dashboard',
      logo_url: '',
      meta_description: 'Professional Portfolio of an Aspiring Data Analyst, AI/ML Enthusiast, and Web Developer.',
      google_analytics_id: '',
      theme: 'dark'
    });
  }
});

// PUT update settings (Admin)
router.put('/', requireAuth, async (req: AuthenticatedRequest, res) => {
  const { title, logo_url, meta_description, google_analytics_id, theme } = req.body;

  try {
    // Check if settings row exists (there is typically only one settings record)
    const { data: existingSettings, error: searchError } = await supabase
      .from('settings')
      .select('id');

    if (searchError) throw searchError;

    let result;
    if (!existingSettings || existingSettings.length === 0) {
      // Create first setting entry
      const { data, error } = await supabase
        .from('settings')
        .insert([{ title, logo_url, meta_description, google_analytics_id, theme }])
        .select();
      if (error) throw error;
      result = data[0];
    } else {
      // Update setting entry
      const rowId = existingSettings[0].id;
      const { data, error } = await supabase
        .from('settings')
        .update({ title, logo_url, meta_description, google_analytics_id, theme, updated_at: new Date() })
        .eq('id', rowId)
        .select();
      if (error) throw error;
      result = data[0];
    }

    return res.json(result);
  } catch (err: any) {
    console.error('Update settings error:', err);
    return res.status(500).json({ error: 'Failed to update settings.' });
  }
});

export default router;
