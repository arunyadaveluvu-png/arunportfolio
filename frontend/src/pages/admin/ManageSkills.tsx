import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { FiPlus, FiEdit, FiTrash2, FiCpu, FiX } from 'react-icons/fi';

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  icon_name: string;
}

export const ManageSkills: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  // Form States
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Programming');
  const [proficiency, setProficiency] = useState(80);
  const [iconName, setIconName] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    'Programming',
    'Web Development',
    'Database',
    'Data Analytics',
    'AI & Machine Learning',
    'Tools',
  ];

  // Common Icon mappings for auto-suggestion
  const commonIcons = [
    { name: 'Python', icon: 'SiPython' },
    { name: 'C', icon: 'SiC' },
    { name: 'C++', icon: 'SiCplusplus' },
    { name: 'Java', icon: 'DiJava' },
    { name: 'React', icon: 'FaReact' },
    { name: 'HTML5', icon: 'SiHtml5' },
    { name: 'CSS3', icon: 'SiCss3' },
    { name: 'JavaScript', icon: 'SiJavascript' },
    { name: 'Node.js', icon: 'FaNodeJs' },
    { name: 'SQL/Database', icon: 'DiDatabase' },
    { name: 'MySQL', icon: 'SiMysql' },
    { name: 'MongoDB', icon: 'SiMongodb' },
    { name: 'Supabase', icon: 'SiSupabase' },
    { name: 'Excel', icon: 'SiMicrosoftexcel' },
    { name: 'Power BI', icon: 'SiPowerbi' },
    { name: 'Tableau', icon: 'SiTableau' },
    { name: 'GitHub', icon: 'FaGithub' },
  ];

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const data = await api.skills.getAll();
      setSkills(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingSkill(null);
    setName('');
    setCategory('Programming');
    setProficiency(80);
    setIconName('');
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (skill: Skill) => {
    setEditingSkill(skill);
    setName(skill.name);
    setCategory(skill.category);
    setProficiency(skill.proficiency);
    setIconName(skill.icon_name || '');
    setError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = { name, category, proficiency, icon_name: iconName };

    try {
      if (editingSkill) {
        await api.skills.update(editingSkill.id, payload);
      } else {
        await api.skills.create(payload);
      }
      setModalOpen(false);
      fetchSkills();
    } catch (err: any) {
      console.error('Submit skill error:', err);
      setError(err.message || 'Failed to save skill.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;
    try {
      await api.skills.delete(id);
      fetchSkills();
    } catch (err) {
      console.error(err);
      alert('Failed to delete skill.');
    }
  };

  // Group skills by category for preview
  const groupedSkills = categories.reduce((acc, cat) => {
    acc[cat] = skills.filter((s) => s.category === cat);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Manage Skills</h1>
          <p className="text-gray-400 text-sm mt-1">Configure proficiency metric cards and categories.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-all duration-300 shadow-lg shadow-purple-600/10 cursor-pointer"
        >
          <FiPlus className="w-4.5 h-4.5" />
          <span>Add Skill</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {categories.map((cat) => {
            const catSkills = groupedSkills[cat] || [];
            if (catSkills.length === 0) return null;
            return (
              <div key={cat} className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
                <h3 className="text-md font-bold text-white tracking-wider border-b border-white/5 pb-2.5 flex items-center space-x-2">
                  <FiCpu className="w-4.5 h-4.5 text-purple-400" />
                  <span>{cat}</span>
                </h3>
                
                <div className="space-y-4">
                  {catSkills.map((skill) => (
                    <div key={skill.id} className="flex items-center justify-between group">
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center justify-between text-xs font-semibold mb-1">
                          <span className="text-gray-300">{skill.name}</span>
                          <span className="text-purple-400">{skill.proficiency}%</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden border border-white/5">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${skill.proficiency}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1.5 ml-3">
                        <button
                          onClick={() => openEditModal(skill)}
                          className="p-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/20 transition-all cursor-pointer"
                          title="Edit Skill"
                        >
                          <FiEdit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(skill.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/20 transition-all cursor-pointer"
                          title="Delete Skill"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Editor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0b091c] border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-scale-in">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                {editingSkill ? 'Edit Skill' : 'Add New Skill'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-red-300 text-xs">
                  {error}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Skill Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Pandas"
                  className="block w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/40 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="block w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/40 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-[#0b091c] text-white">{cat}</option>
                  ))}
                </select>
              </div>

              {/* Proficiency Percentage */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  <span>Proficiency Percentage</span>
                  <span className="text-purple-400 text-sm">{proficiency}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={proficiency}
                  onChange={(e) => setProficiency(parseInt(e.target.value))}
                  className="w-full accent-purple-600 bg-white/10 rounded-lg cursor-pointer h-1.5 focus:outline-none"
                />
              </div>

              {/* Icon suggestion */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">React Icon Name (Si/Fa/Di/Gi)</label>
                <input
                  type="text"
                  value={iconName}
                  onChange={(e) => setIconName(e.target.value)}
                  placeholder="e.g. SiPandas, FaReact"
                  className="block w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/40 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all"
                />
                
                {/* Auto Suggestions */}
                <div className="mt-3 flex flex-wrap gap-1.5 max-h-[70px] overflow-y-auto pr-1">
                  {commonIcons.map((item) => (
                    <button
                      key={item.icon}
                      type="button"
                      onClick={() => setIconName(item.icon)}
                      className="text-[9px] px-2 py-0.5 rounded bg-white/5 text-gray-400 hover:bg-purple-600/20 hover:text-white transition-all cursor-pointer"
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-white/5 pt-6 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-semibold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-all duration-300 shadow-lg shadow-purple-600/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {submitting ? 'Saving...' : 'Save Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default ManageSkills;
