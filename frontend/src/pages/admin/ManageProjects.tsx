import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { supabase } from '../../services/supabase';
import { FiPlus, FiEdit, FiTrash2, FiLink, FiGithub, FiUpload, FiX } from 'react-icons/fi';

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  github_url: string;
  live_url: string;
  category: string;
  completion_date: string;
  image_url: string;
}

export const ManageProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  // Form States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [technologiesText, setTechnologiesText] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [category, setCategory] = useState('Data Analytics');
  const [completionDate, setCompletionDate] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageSource, setImageSource] = useState<'upload' | 'url'>('url');
  
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = ['Data Analytics', 'AI & Machine Learning', 'Web Development', 'Other'];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await api.projects.getAll();
      setProjects(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingProject(null);
    setTitle('');
    setDescription('');
    setTechnologiesText('');
    setGithubUrl('');
    setLiveUrl('');
    setCategory('Data Analytics');
    setCompletionDate('');
    setImageUrl('');
    setImageSource('url');
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setTitle(project.title);
    setDescription(project.description || '');
    setTechnologiesText(project.technologies ? project.technologies.join(', ') : '');
    setGithubUrl(project.github_url || '');
    setLiveUrl(project.live_url || '');
    setCategory(project.category);
    setCompletionDate(project.completion_date || '');
    setImageUrl(project.image_url || '');
    setImageSource(project.image_url && project.image_url.includes('supabase.co') ? 'upload' : 'url');
    setError(null);
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `projects/${fileName}`;

      // Upload file to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('portfolio')
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Image upload failed. Check bucket settings.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const techArray = technologiesText
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      title,
      description,
      technologies: techArray,
      github_url: githubUrl,
      live_url: liveUrl,
      category,
      completion_date: completionDate || null,
      image_url: imageUrl,
    };

    try {
      if (editingProject) {
        await api.projects.update(editingProject.id, payload);
      } else {
        await api.projects.create(payload);
      }
      setModalOpen(false);
      fetchProjects();
    } catch (err: any) {
      console.error('Submit project error:', err);
      setError(err.message || 'Failed to save project.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.projects.delete(id);
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert('Failed to delete project.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Manage Projects</h1>
          <p className="text-gray-400 text-sm mt-1">Add, update, or remove portfolio showcase items.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-all duration-300 shadow-lg shadow-purple-600/10 cursor-pointer"
        >
          <FiPlus className="w-4.5 h-4.5" />
          <span>Add Project</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="glass-panel rounded-2xl overflow-hidden border border-white/5 flex flex-col justify-between group">
              <div className="relative h-44 bg-gray-900 overflow-hidden border-b border-white/5">
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">No Image</div>
                )}
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-purple-300 border border-white/10">
                  {project.category}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-md font-bold text-white tracking-tight">{project.title}</h3>
                  <p className="text-gray-400 text-xs mt-2 line-clamp-2 leading-relaxed">{project.description}</p>
                  
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {project.technologies.map((tech, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  <div className="flex space-x-3 text-gray-400">
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                        <FiGithub className="w-4 h-4" />
                      </a>
                    )}
                    {project.live_url && (
                      <a href={project.live_url} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                        <FiLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(project)}
                      className="p-2 rounded-lg bg-purple-500/10 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/20 transition-all cursor-pointer"
                      title="Edit Project"
                    >
                      <FiEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/20 transition-all cursor-pointer"
                      title="Delete Project"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[#0b091c] border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-scale-in">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                {editingProject ? 'Edit Project' : 'Add New Project'}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Project Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Sales Analysis Dashboard"
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
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summarize the project metrics, achievements, and findings..."
                  rows={3}
                  className="block w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/40 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all resize-none"
                />
              </div>

              {/* Technologies */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Technologies (comma separated)</label>
                <input
                  type="text"
                  value={technologiesText}
                  onChange={(e) => setTechnologiesText(e.target.value)}
                  placeholder="e.g. Python, Pandas, Tableau, MySQL"
                  className="block w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/40 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* GitHub Link */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">GitHub URL</label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="block w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/40 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all"
                  />
                </div>

                {/* Live Demo Link */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Live Demo URL</label>
                  <input
                    type="url"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://yourdemo.com"
                    className="block w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/40 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Completion Date */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Completion Date</label>
                  <input
                    type="date"
                    value={completionDate}
                    onChange={(e) => setCompletionDate(e.target.value)}
                    className="block w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/40 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Project Image</label>
                  
                  {/* Selector Tabs */}
                  <div className="flex space-x-2 mb-3">
                    <button
                      type="button"
                      onClick={() => setImageSource('upload')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${imageSource === 'upload' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/10' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                    >
                      Upload Image
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageSource('url')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${imageSource === 'url' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/10' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                    >
                      Image URL
                    </button>
                  </div>

                  {imageSource === 'upload' ? (
                    <div className="border border-dashed border-white/10 hover:border-purple-500/30 bg-black/20 rounded-xl p-4 flex flex-col items-center justify-center transition-all min-h-[90px]">
                      {uploading ? (
                        <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                      ) : imageUrl ? (
                        <div className="flex items-center space-x-3 w-full justify-between">
                          <img src={imageUrl} className="w-10 h-10 object-cover rounded-lg border border-white/15" />
                          <span className="text-[10px] text-gray-500 truncate max-w-[150px]">{imageUrl}</span>
                          <button type="button" onClick={() => setImageUrl('')} className="text-red-400 hover:text-red-300 text-xs font-semibold cursor-pointer">Remove</button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center cursor-pointer space-y-1">
                          <FiUpload className="w-5 h-5 text-purple-400" />
                          <span className="text-[10px] text-gray-400 font-semibold">Choose image file</span>
                          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </label>
                      )}
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Paste external image URL here"
                      className="block w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/40 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all"
                    />
                  )}
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
                  disabled={submitting || uploading}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-all duration-300 shadow-lg shadow-purple-600/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {submitting ? 'Saving...' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default ManageProjects;
