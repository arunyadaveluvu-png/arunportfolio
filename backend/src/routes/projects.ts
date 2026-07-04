import { Router as ExpressRouter } from 'express';
import { supabase } from '../config/supabase';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

const router = ExpressRouter();

// GET all projects (Public)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('completion_date', { ascending: false });

    if (error) throw error;
    return res.json(data);
  } catch (err: any) {
    console.warn('Fetch projects failed (db asleep). Serving fallback projects.');
    const defaultProjects = [
      {
        id: '1',
        title: 'Sales Performance Analytics Dashboard',
        description: 'A comprehensive Excel and Power BI project that processes raw retail data to track revenues, customer demographics, and product returns.',
        technologies: ['Excel', 'Power BI', 'SQL'],
        github_url: 'https://github.com/arunyadaveluvu-png',
        live_url: '',
        category: 'Data Analytics',
        completion_date: '2025-11-20',
        image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: '2',
        title: 'Heart Disease Prediction Model',
        description: 'Developed a binary classification model using Random Forest and XGBoost to predict heart disease risks based on patient clinical parameters.',
        technologies: ['Python', 'Scikit-Learn', 'Pandas', 'Matplotlib'],
        github_url: 'https://github.com/arunyadaveluvu-png',
        live_url: '',
        category: 'AI & Machine Learning',
        completion_date: '2026-02-15',
        image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: '3',
        title: 'AI-Powered Code Assistant',
        description: 'Created a React web application integrated with an Express/Node backend that uses OpenAI LLM embeddings to suggest code optimizations.',
        technologies: ['React', 'Node.js', 'Express', 'Tailwind CSS', 'OpenAI'],
        github_url: 'https://github.com/arunyadaveluvu-png',
        live_url: '',
        category: 'Web Development',
        completion_date: '2026-05-10',
        image_url: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&w=800&q=80'
      }
    ];
    return res.json(defaultProjects);
  }
});

// POST add a project (Admin)
router.post('/', requireAuth, async (req: AuthenticatedRequest, res) => {
  const { title, description, technologies, github_url, live_url, category, completion_date, image_url, images } = req.body;
  
  if (!title || !category) {
    return res.status(400).json({ error: 'Title and Category are required fields.' });
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .insert([{ title, description, technologies, github_url, live_url, category, completion_date, image_url, images }])
      .select();

    if (error) throw error;
    return res.status(201).json(data[0]);
  } catch (err: any) {
    console.error('Create project error:', err);
    return res.status(500).json({ error: 'Failed to create project.' });
  }
});

// PUT update a project (Admin)
router.put('/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { title, description, technologies, github_url, live_url, category, completion_date, image_url, images } = req.body;

  try {
    const { data, error } = await supabase
      .from('projects')
      .update({ title, description, technologies, github_url, live_url, category, completion_date, image_url, images, updated_at: new Date() })
      .eq('id', id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Project not found.' });
    }
    return res.json(data[0]);
  } catch (err: any) {
    console.error('Update project error:', err);
    return res.status(500).json({ error: 'Failed to update project.' });
  }
});

// DELETE a project (Admin)
router.delete('/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return res.json({ success: true, message: 'Project deleted successfully.' });
  } catch (err: any) {
    console.error('Delete project error:', err);
    return res.status(500).json({ error: 'Failed to delete project.' });
  }
});

export default router;
