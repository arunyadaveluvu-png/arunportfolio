import { Router } from 'express';
import { supabase } from '../config/supabase';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

const defaultExperience = [
  {
    id: '1',
    role: 'Software Engineer Intern',
    company: 'Arun Software Solutions',
    location: 'Remote',
    description: 'Developed and optimized user interfaces for premium client portfolios using React and TypeScript. Integrated Supabase for robust backend and authentication services.',
    skills: ['React', 'TypeScript', 'Supabase', 'Node.js'],
    start_date: '2025-06-01',
    end_date: null,
    is_current: true
  },
  {
    id: '2',
    role: 'Data Analyst Trainee',
    company: 'KIIT University',
    location: 'Bhubaneswar, India',
    description: 'Collaborated on data analysis projects utilizing Python, Pandas, and Power BI to build dashboards tracking student performances and demographics.',
    skills: ['Python', 'Pandas', 'Power BI', 'SQL'],
    start_date: '2024-05-01',
    end_date: '2024-07-31',
    is_current: false
  }
];

// GET all experience records (Public)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('experience')
      .select('*')
      .order('start_date', { ascending: false });

    if (error) throw error;
    return res.json(data);
  } catch (err: any) {
    console.warn('Fetch experience failed (db table missing or asleep). Serving fallback experiences.');
    return res.json(defaultExperience);
  }
});

// POST add experience record (Admin)
router.post('/', requireAuth, async (req: AuthenticatedRequest, res) => {
  const { role, company, location, description, skills, start_date, end_date, is_current } = req.body;

  if (!role || !company || !start_date) {
    return res.status(400).json({ error: 'Role, Company, and Start Date are required.' });
  }

  try {
    const { data, error } = await supabase
      .from('experience')
      .insert([{ 
        role, 
        company, 
        location: location || null, 
        description: description || null, 
        skills: skills || [], 
        start_date, 
        end_date: is_current ? null : (end_date || null), 
        is_current: !!is_current 
      }])
      .select();

    if (error) throw error;
    return res.status(201).json(data[0]);
  } catch (err: any) {
    console.error('Create experience error:', err);
    return res.status(500).json({ error: 'Failed to create experience record.' });
  }
});

// PUT update experience record (Admin)
router.put('/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { role, company, location, description, skills, start_date, end_date, is_current } = req.body;

  try {
    const { data, error } = await supabase
      .from('experience')
      .update({ 
        role, 
        company, 
        location: location || null, 
        description: description || null, 
        skills: skills || [], 
        start_date, 
        end_date: is_current ? null : (end_date || null), 
        is_current: !!is_current 
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Experience record not found.' });
    }
    return res.json(data[0]);
  } catch (err: any) {
    console.error('Update experience error:', err);
    return res.status(500).json({ error: 'Failed to update experience record.' });
  }
});

// DELETE experience record (Admin)
router.delete('/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('experience')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return res.json({ success: true, message: 'Experience record deleted successfully.' });
  } catch (err: any) {
    console.error('Delete experience error:', err);
    return res.status(500).json({ error: 'Failed to delete experience record.' });
  }
});

export default router;
