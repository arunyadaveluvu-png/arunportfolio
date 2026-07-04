import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { FiPlus, FiEdit, FiTrash2, FiBookOpen, FiX } from 'react-icons/fi';

interface Education {
  id: string;
  degree: string;
  college: string;
  university: string;
  year: string;
  cgpa: number;
}

export const ManageEducation: React.FC = () => {
  const [eduList, setEduList] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);

  // Form States
  const [degree, setDegree] = useState('');
  const [college, setCollege] = useState('');
  const [university, setUniversity] = useState('');
  const [year, setYear] = useState('');
  const [cgpa, setCgpa] = useState<number | ''>('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const data = await api.education.getAll();
      setEduList(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingEdu(null);
    setDegree('');
    setCollege('');
    setUniversity('');
    setYear('');
    setCgpa('');
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (edu: Education) => {
    setEditingEdu(edu);
    setDegree(edu.degree);
    setCollege(edu.college);
    setUniversity(edu.university || '');
    setYear(edu.year);
    setCgpa(edu.cgpa || '');
    setError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      degree,
      college,
      university: university || null,
      year,
      cgpa: cgpa === '' ? null : Number(cgpa),
    };

    try {
      if (editingEdu) {
        await api.education.update(editingEdu.id, payload);
      } else {
        await api.education.create(payload);
      }
      setModalOpen(false);
      fetchEducation();
    } catch (err: any) {
      console.error(err);
      setError('Failed to save education record.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this education record?')) return;
    try {
      await api.education.delete(id);
      fetchEducation();
    } catch (err) {
      console.error(err);
      alert('Failed to delete education record.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Manage Education</h1>
          <p className="text-gray-400 text-sm mt-1">Configure your timeline history and qualifications.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-all duration-300 shadow-lg shadow-purple-600/10 cursor-pointer"
        >
          <FiPlus className="w-4.5 h-4.5" />
          <span>Add Education</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {eduList.map((edu) => (
            <div key={edu.id} className="glass-panel p-6 rounded-2xl border border-white/5 flex items-start justify-between group">
              <div className="flex space-x-4">
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                  <FiBookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-md font-bold text-white tracking-tight leading-snug">{edu.degree}</h3>
                  <p className="text-gray-300 text-sm mt-1">{edu.college}</p>
                  {edu.university && <p className="text-gray-400 text-xs">{edu.university}</p>}
                  
                  <div className="flex items-center space-x-4 mt-3 text-[10px] font-semibold text-gray-500 tracking-wider uppercase">
                    <span>Year: {edu.year}</span>
                    {edu.cgpa && (
                      <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/10 font-mono">
                        CGPA: {Number(edu.cgpa).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => openEditModal(edu)}
                  className="p-2 rounded-lg bg-purple-500/10 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/20 transition-all cursor-pointer"
                  title="Edit Education"
                >
                  <FiEdit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(edu.id)}
                  className="p-2 rounded-lg bg-red-500/10 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/20 transition-all cursor-pointer"
                  title="Delete Education"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0b091c] border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-scale-in">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                {editingEdu ? 'Edit Education Record' : 'Add Education Record'}
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

              {/* Degree */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Degree / Qualification</label>
                <input
                  type="text"
                  required
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder="e.g. B.Tech in Computer Science"
                  className="block w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/40 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all"
                />
              </div>

              {/* College */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">College / Institution</label>
                <input
                  type="text"
                  required
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. Kalinga Institute of Industrial Technology"
                  className="block w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/40 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all"
                />
              </div>

              {/* University */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Affiliated University (Optional)</label>
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="e.g. KIIT University, CBSE"
                  className="block w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/40 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Year */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Academic Year</label>
                  <input
                    type="text"
                    required
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="e.g. 2021 - 2025"
                    className="block w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/40 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all"
                  />
                </div>

                {/* CGPA */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">CGPA / Percentage</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={cgpa}
                    onChange={(e) => setCgpa(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 9.12"
                    className="block w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/40 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all"
                  />
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
                  {submitting ? 'Saving...' : 'Save Education'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default ManageEducation;
