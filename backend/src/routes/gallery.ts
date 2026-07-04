import { Router } from 'express';
import { supabase } from '../config/supabase';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// GET all gallery items (Public or Admin)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.json(data);
  } catch (err: any) {
    console.error('Fetch gallery error:', err);
    return res.status(500).json({ error: 'Failed to fetch gallery items.' });
  }
});

// POST register uploaded image (Admin)
router.post('/', requireAuth, async (req: AuthenticatedRequest, res) => {
  const { image_url, name, size } = req.body;

  if (!image_url) {
    return res.status(400).json({ error: 'Image URL is required.' });
  }

  try {
    const { data, error } = await supabase
      .from('gallery')
      .insert([{ image_url, name: name || 'Uploaded Image', size: size || 0 }])
      .select();

    if (error) throw error;
    return res.status(201).json(data[0]);
  } catch (err: any) {
    console.error('Save gallery metadata error:', err);
    return res.status(500).json({ error: 'Failed to save image metadata.' });
  }
});

// DELETE image from gallery & storage (Admin)
router.delete('/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;

  try {
    // 1. Fetch image details to get URL
    const { data: item, error: getError } = await supabase
      .from('gallery')
      .select('image_url')
      .eq('id', id)
      .single();

    if (getError || !item) {
      return res.status(404).json({ error: 'Image not found in gallery.' });
    }

    // 2. Extract path/filename from URL to delete from Supabase storage
    // Example URL: https://ipdiyenjqmpgonpjrdlq.supabase.co/storage/v1/object/public/portfolio/uploads/image.png
    // The relative path in the bucket is "uploads/image.png"
    const urlParts = item.image_url.split('/portfolio/');
    if (urlParts.length > 1) {
      const storagePath = decodeURIComponent(urlParts[1]);
      const { error: storageError } = await supabase.storage
        .from('portfolio')
        .remove([storagePath]);

      if (storageError) {
        console.error('Failed to remove from Supabase Storage:', storageError);
        // Continue database deletion even if storage remove failed
      }
    }

    // 3. Delete from database
    const { error: dbError } = await supabase
      .from('gallery')
      .delete()
      .eq('id', id);

    if (dbError) throw dbError;

    return res.json({ success: true, message: 'Image deleted from gallery and storage.' });
  } catch (err: any) {
    console.error('Delete gallery item error:', err);
    return res.status(500).json({ error: 'Failed to delete gallery item.' });
  }
});

export default router;
