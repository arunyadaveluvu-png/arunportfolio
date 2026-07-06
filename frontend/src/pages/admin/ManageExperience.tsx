import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { FiPlus, FiEdit, FiTrash2, FiBriefcase, FiX, FiCalendar, FiMapPin } from 'react-icons/fi';

interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  description: string;
  skills: string[];
  start_date: string;
  end_date: string | null;
  is_current: boolean;
}

export const ManageExperience: React.FC = () => {
  const [experienceList, setExperienceList] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);

  // Form States
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [skillsInput, setSkillsInput] = useState(''); // Comma separated skills
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isCurrent, setIsCurrent] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchExperience();
  }, []);

  const fetchExperience = async () => {
    try {
      const data = await api.experience.getAll();
      setExperienceList(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingExp(null);
    setRole('');
    setCompany('');
    setLocation('');
    setDescription('');
    setSkillsInput('');
    setStartDate('');
    setEndDate('');
    setIsCurrent(false);
    setError(null);
    setModalOpen(true);
  };

  const formatDateForInput = (dateString: string | null) => {
    if (!dateString) return '';
    // Extract YYYY-MM-DD from timestamp or ISO string
    return dateString.split('T')[0];
  };

  const openEditModal = (exp: Experience) => {
    setEditingExp(exp);
    setRole(exp.role);
    setCompany(exp.company);
    setLocation(exp.location || '');
    setDescription(exp.description || '');
    setSkillsInput(exp.skills ? exp.skills.join(', ') : '');
    setStartDate(formatDateForInput(exp.start_date));
    setEndDate(formatDateForInput(exp.end_date));
    setIsCurrent(!!exp.is_current);
    setError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Process skills into array
    const skillsArray = skillsInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const payload = {
      role,
      company,
      location: location || null,
      description: description || null,
      skills: skillsArray,
      start_date: startDate,
      end_date: isCurrent ? null : (endDate || null),
      is_current: isCurrent,
    };

    try {
      if (editingExp) {
        await api.experience.update(editingExp.id, payload);
      } else {
        await api.experience.create(payload);
      }
      setModalOpen(false);
      fetchExperience();
    } catch (err: any) {
      console.error(err);
      setError('Failed to save experience record.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this experience record?')) return;
    try {
      await api.experience.delete(id);
      fetchExperience();
    } catch (err) {
      console.error(err);
      alert('Failed to delete experience record.');
    }
  };

  const formatDateDisplay = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Manage Experience</h1>
          <p className="text-gray-400 text-sm mt-1">Configure your professional work experience and internships.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-all duration-300 shadow-lg shadow-purple-600/10 cursor-pointer"
        >
          <FiPlus className="w-4.5 h-4.5" />
          <span>Add Experience</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {experienceList.length === 0 ? (
            <div className="glass-panel p-12 rounded-2xl border border-white/5 text-center">
              <FiBriefcase className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-md font-bold text-white">No experience records found</h3>
              <p className="text-gray-400 text-xs mt-1">Add your internships or full-time roles to display in your portfolio.</p>
            </div>
          ) : (
            experienceList.map((exp) => (
              <div key={exp.id} className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row md:items-start justify-between gap-4 group">
                <div className="flex space-x-4 flex-1 min-w-0">
                  <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 self-start">
                    <FiBriefcase className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-white tracking-tight leading-snug">{exp.role}</h3>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-600/20 text-purple-300 border border-purple-500/25">
                        {exp.company}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center space-x-1">
                        <FiCalendar className="w-3.5 h-3.5" />
                        <span>
                          {formatDateDisplay(exp.start_date)} - {exp.is_current ? 'Present' : formatDateDisplay(exp.end_date)}
                        </span>
                      </span>
                      {exp.location && (
                        <span className="flex items-center space-x-1">
                          <FiMapPin className="w-3.5 h-3.5" />
                          <span>{exp.location}</span>
                        </span>
                      )}
                    </div>

                    {exp.description && (
                      <p className="text-gray-300 text-xs mt-3 leading-relaxed whitespace-pre-wrap max-w-3xl">
                        {exp.description}
                      </p>
                    )}

                    {exp.skills && exp.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {exp.skills.map((skill, index) => (
                          <span key={index} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-300 border border-white/5">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex md:self-start space-x-2">
                  <button
                    onClick={() => openEditModal(exp)}
                    className="p-2 rounded-lg bg-purple-500/10 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/20 transition-all cursor-pointer"
                    title="Edit Experience"
                  >
                    <FiEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/20 transition-all cursor-pointer"
                    title="Delete Experience"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Editor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#0b091c] border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-scale-in">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                {editingExp ? 'Edit Experience Record' : 'Add Experience Record'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-red-300 text-xs">
                  {error}
                </div>
              )}

              {/* Role */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Job Title / Role</label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Software Engineer Intern"
                  className="block w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/40 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all"
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Company / Organization</label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Google"
                  className="block w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/40 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Location (Optional)</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Bangalore, India (or Remote)"
                  className="block w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/40 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all"
                />
              </div>

              {/* Date Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="block w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/40 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">End Date</label>
                  <input
                    type="date"
                    disabled={isCurrent}
                    value={isCurrent ? '' : endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="block w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/40 text-sm text-white disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all"
                  />
                </div>
              </div>

              {/* Is Current Role */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isCurrent"
                  checked={isCurrent}
                  onChange={(e) => setIsCurrent(e.target.checked)}
                  className="rounded border-white/10 bg-black/40 text-purple-600 focus:ring-purple-500/30"
                />
                <label htmlFor="isCurrent" className="text-xs text-gray-300 select-none cursor-pointer">
                  I currently work in this role
                </label>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Description / Achievements</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Outline your responsibilities, projects, and achievements in this role..."
                  className="block w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/40 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all resize-none"
                />
              </div>

              {/* Skills */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Technologies / Skills (Comma-separated)</label>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  placeholder="e.g. React, TypeScript, Python, Git"
                  className="block w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/40 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all"
                />
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
                  {submitting ? 'Saving...' : 'Save Experience'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageExperience;
