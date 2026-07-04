import { Router } from 'express';
import { supabase } from '../config/supabase';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// GET all education records (Public)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .order('year', { ascending: false });

    if (error) throw error;
    return res.json(data);
  } catch (err: any) {
    console.warn('Fetch education failed (db asleep). Serving fallback education records.');
    const defaultEducation = [
      { id: '1', degree: 'Bachelor of Technology in Computer Science', college: 'Kalinga Institute of Industrial Technology', university: 'KIIT University', year: '2021 - 2025', cgpa: 8.92 },
      { id: '2', degree: 'Higher Secondary Education (Class XII)', college: 'DAV Public School', university: 'CBSE', year: '2019 - 2021', cgpa: 9.40 }
    ];
    return res.json(defaultEducation);
  }
});

// POST add education record (Admin)
router.post('/', requireAuth, async (req: AuthenticatedRequest, res) => {
  const { degree, college, university, year, cgpa } = req.body;

  if (!degree || !college || !year) {
    return res.status(400).json({ error: 'Degree, College, and Year are required.' });
  }

  try {
    const { data, error } = await supabase
      .from('education')
      .insert([{ degree, college, university, year, cgpa }])
      .select();

    if (error) throw error;
    return res.status(201).json(data[0]);
  } catch (err: any) {
    console.error('Create education error:', err);
    return res.status(500).json({ error: 'Failed to create education record.' });
  }
});

// PUT update education record (Admin)
router.put('/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { degree, college, university, year, cgpa } = req.body;

  try {
    const { data, error } = await supabase
      .from('education')
      .update({ degree, college, university, year, cgpa })
      .eq('id', id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Education record not found.' });
    }
    return res.json(data[0]);
  } catch (err: any) {
    console.error('Update education error:', err);
    return res.status(500).json({ error: 'Failed to update education record.' });
  }
});

// DELETE education record (Admin)
router.delete('/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('education')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return res.json({ success: true, message: 'Education record deleted successfully.' });
  } catch (err: any) {
    console.error('Delete education error:', err);
    return res.status(500).json({ error: 'Failed to delete education record.' });
  }
});

export default router;
