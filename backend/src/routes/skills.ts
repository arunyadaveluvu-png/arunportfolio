import { Router } from 'express';
import { supabase } from '../config/supabase';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// GET all skills (Public)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('proficiency', { ascending: false });

    if (error) throw error;
    return res.json(data);
  } catch (err: any) {
    console.warn('Fetch skills failed (db asleep). Serving fallback skills.');
    const defaultSkills = [
      { id: '1', name: 'Python', category: 'Programming', proficiency: 90, icon_name: 'SiPython' },
      { id: '2', name: 'C', category: 'Programming', proficiency: 75, icon_name: 'SiC' },
      { id: '3', name: 'C++', category: 'Programming', proficiency: 80, icon_name: 'SiCplusplus' },
      { id: '4', name: 'Java', category: 'Programming', proficiency: 70, icon_name: 'DiJava' },
      { id: '5', name: 'HTML5', category: 'Web Development', proficiency: 95, icon_name: 'SiHtml5' },
      { id: '6', name: 'CSS3', category: 'Web Development', proficiency: 90, icon_name: 'SiCss3' },
      { id: '7', name: 'JavaScript', category: 'Web Development', proficiency: 85, icon_name: 'SiJavascript' },
      { id: '8', name: 'React', category: 'Web Development', proficiency: 80, icon_name: 'FaReact' },
      { id: '9', name: 'Node.js', category: 'Web Development', proficiency: 75, icon_name: 'FaNodeJs' },
      { id: '10', name: 'SQL', category: 'Database', proficiency: 90, icon_name: 'DiDatabase' },
      { id: '11', name: 'MySQL', category: 'Database', proficiency: 85, icon_name: 'SiMysql' },
      { id: '12', name: 'MongoDB', category: 'Database', proficiency: 75, icon_name: 'SiMongodb' },
      { id: '13', name: 'Supabase', category: 'Database', proficiency: 80, icon_name: 'SiSupabase' },
      { id: '14', name: 'Excel', category: 'Data Analytics', proficiency: 90, icon_name: 'SiMicrosoftexcel' },
      { id: '15', name: 'Power BI', category: 'Data Analytics', proficiency: 85, icon_name: 'SiPowerbi' },
      { id: '16', name: 'Tableau', category: 'Data Analytics', proficiency: 80, icon_name: 'SiTableau' },
      { id: '17', name: 'Pandas', category: 'Data Analytics', proficiency: 85, icon_name: 'SiPandas' },
      { id: '18', name: 'NumPy', category: 'Data Analytics', proficiency: 80, icon_name: 'SiNumpy' },
      { id: '19', name: 'Matplotlib', category: 'Data Analytics', proficiency: 75, icon_name: 'SiMatplotlib' },
      { id: '20', name: 'Scikit-Learn', category: 'AI & Machine Learning', proficiency: 80, icon_name: 'SiScikitlearn' },
      { id: '21', name: 'TensorFlow', category: 'AI & Machine Learning', proficiency: 75, icon_name: 'SiTensorflow' },
      { id: '22', name: 'Machine Learning', category: 'AI & Machine Learning', proficiency: 85, icon_name: 'GiArtificialIntelligence' },
      { id: '23', name: 'Deep Learning', category: 'AI & Machine Learning', proficiency: 70, icon_name: 'GiBrain' },
      { id: '24', name: 'Git', category: 'Tools', proficiency: 85, icon_name: 'FaGitAlt' },
      { id: '25', name: 'GitHub', category: 'Tools', proficiency: 90, icon_name: 'FaGithub' },
      { id: '26', name: 'VS Code', category: 'Tools', proficiency: 95, icon_name: 'DiVisualstudio' },
      { id: '27', name: 'Postman', category: 'Tools', proficiency: 80, icon_name: 'SiPostman' }
    ];
    return res.json(defaultSkills);
  }
});

// POST add a skill (Admin)
router.post('/', requireAuth, async (req: AuthenticatedRequest, res) => {
  const { name, category, proficiency, icon_name } = req.body;

  if (!name || !category || proficiency === undefined) {
    return res.status(400).json({ error: 'Name, Category, and Proficiency are required.' });
  }

  try {
    const { data, error } = await supabase
      .from('skills')
      .insert([{ name, category, proficiency, icon_name }])
      .select();

    if (error) throw error;
    return res.status(201).json(data[0]);
  } catch (err: any) {
    console.error('Create skill error:', err);
    return res.status(500).json({ error: 'Failed to create skill.' });
  }
});

// PUT update a skill (Admin)
router.put('/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { name, category, proficiency, icon_name } = req.body;

  try {
    const { data, error } = await supabase
      .from('skills')
      .update({ name, category, proficiency, icon_name })
      .eq('id', id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Skill not found.' });
    }
    return res.json(data[0]);
  } catch (err: any) {
    console.error('Update skill error:', err);
    return res.status(500).json({ error: 'Failed to update skill.' });
  }
});

// DELETE a skill (Admin)
router.delete('/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return res.json({ success: true, message: 'Skill deleted successfully.' });
  } catch (err: any) {
    console.error('Delete skill error:', err);
    return res.status(500).json({ error: 'Failed to delete skill.' });
  }
});

export default router;
