import { Router } from 'express';
import { supabase } from '../config/supabase';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// GET all certificates (Public)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .order('issue_date', { ascending: false });

    if (error) throw error;
    return res.json(data);
  } catch (err: any) {
    console.warn('Fetch certificates failed (db asleep). Serving fallback certificates.');
    const defaultCerts = [
      { id: '1', name: 'Google Data Analytics Professional Certificate', organization: 'Coursera - Google', issue_date: '2025-08-14', credential_id: 'GDA-10928374', verification_url: 'https://coursera.org/verify/gda10928374', image_url: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=800&q=80' },
      { id: '2', name: 'Machine Learning Specialization', organization: 'Coursera - DeepLearning.AI', issue_date: '2026-01-05', credential_id: 'ML-98273641', verification_url: 'https://coursera.org/verify/ml98273641', image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80' }
    ];
    return res.json(defaultCerts);
  }
});

// POST add a certificate (Admin)
router.post('/', requireAuth, async (req: AuthenticatedRequest, res) => {
  const { name, organization, issue_date, credential_id, verification_url, image_url } = req.body;

  if (!name || !organization) {
    return res.status(400).json({ error: 'Name and Organization are required.' });
  }

  try {
    const { data, error } = await supabase
      .from('certificates')
      .insert([{ name, organization, issue_date, credential_id, verification_url, image_url }])
      .select();

    if (error) throw error;
    return res.status(201).json(data[0]);
  } catch (err: any) {
    console.error('Create certificate error:', err);
    return res.status(500).json({ error: 'Failed to create certificate.' });
  }
});

// PUT update a certificate (Admin)
router.put('/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { name, organization, issue_date, credential_id, verification_url, image_url } = req.body;

  try {
    const { data, error } = await supabase
      .from('certificates')
      .update({ name, organization, issue_date, credential_id, verification_url, image_url })
      .eq('id', id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Certificate not found.' });
    }
    return res.json(data[0]);
  } catch (err: any) {
    console.error('Update certificate error:', err);
    return res.status(500).json({ error: 'Failed to update certificate.' });
  }
});

// DELETE a certificate (Admin)
router.delete('/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('certificates')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return res.json({ success: true, message: 'Certificate deleted successfully.' });
  } catch (err: any) {
    console.error('Delete certificate error:', err);
    return res.status(500).json({ error: 'Failed to delete certificate.' });
  }
});

export default router;
