import { Router } from 'express';
import { supabase } from '../config/supabase';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// GET profile (Public - retrieves the admin's active profile details)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');

    if (error) throw error;
    
    // Return the first profile in the table, or a default empty layout if none exist
    if (!data || data.length === 0) {
      return res.json({
        name: 'Arun',
        title: 'Aspiring Data Analyst | AI & ML Enthusiast',
        biography: 'I am a passionate data analyst and AI/ML enthusiast focused on turning complex data into actionable insights.',
        email: 'arunkumar.yeluvu@example.com',
        phone: '',
        location: 'India',
        social_links: {
          github: 'https://github.com/arunyadaveluvu-png',
          linkedin: 'https://www.linkedin.com/in/arun-kumar-yeluvu-0b4687373'
        }
      });
    }
    
    return res.json(data[0]);
  } catch (err: any) {
    console.warn('Fetch profile failed (db asleep). Serving fallback profile.');
    return res.json({
      name: 'Arun',
      title: 'Aspiring Data Analyst | AI & ML Enthusiast | Full Stack Developer',
      biography: 'I am a passionate data analyst and AI/ML enthusiast focused on turning complex data into actionable insights.',
      email: 'arunkumar.yeluvu@example.com',
      phone: '',
      location: 'India',
      social_links: {
        github: 'https://github.com/arunyadaveluvu-png',
        linkedin: 'https://www.linkedin.com/in/arun-kumar-yeluvu-0b4687373'
      }
    });
  }
});

// PUT update profile (Admin)
router.put('/', requireAuth, async (req: AuthenticatedRequest, res) => {
  const { name, title, biography, profile_photo, cover_photo, resume_url, phone, email, location, social_links } = req.body;
  const adminId = req.user.id; // User ID from Supabase Auth token context

  try {
    // Check if profile exists for this user ID
    const { data: existingProfile, error: searchError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', adminId);

    if (searchError) throw searchError;

    let result;
    if (!existingProfile || existingProfile.length === 0) {
      // Create profile row if it doesn't exist
      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          id: adminId, name, title, biography, profile_photo, cover_photo, resume_url, phone, email, location, social_links
        }])
        .select();
      if (error) throw error;
      result = data[0];
    } else {
      // Update existing profile row
      const { data, error } = await supabase
        .from('profiles')
        .update({
          name, title, biography, profile_photo, cover_photo, resume_url, phone, email, location, social_links, updated_at: new Date()
        })
        .eq('id', adminId)
        .select();
      if (error) throw error;
      result = data[0];
    }

    return res.json(result);
  } catch (err: any) {
    console.error('Update profile error:', err);
    return res.status(500).json({ error: 'Failed to update profile.' });
  }
});

export default router;
