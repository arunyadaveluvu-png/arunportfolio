import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { supabase } from '../../services/supabase';
import { FiPlus, FiEdit, FiTrash2, FiLink, FiUpload, FiX } from 'react-icons/fi';

interface Certificate {
  id: string;
  name: string;
  organization: string;
  issue_date: string;
  credential_id: string;
  verification_url: string;
  image_url: string;
}

export const ManageCertificates: React.FC = () => {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);

  // Form States
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [credentialId, setCredentialId] = useState('');
  const [verificationUrl, setVerificationUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageSource, setImageSource] = useState<'upload' | 'url'>('url');

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCerts();
  }, []);

  const fetchCerts = async () => {
    try {
      const data = await api.certificates.getAll();
      setCerts(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingCert(null);
    setName('');
    setOrganization('');
    setIssueDate('');
    setCredentialId('');
    setVerificationUrl('');
    setImageUrl('');
    setImageSource('url');
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (cert: Certificate) => {
    setEditingCert(cert);
    setName(cert.name);
    setOrganization(cert.organization);
    setIssueDate(cert.issue_date || '');
    setCredentialId(cert.credential_id || '');
    setVerificationUrl(cert.verification_url || '');
    setImageUrl(cert.image_url || '');
    setImageSource(cert.image_url && cert.image_url.includes('supabase.co') ? 'upload' : 'url');
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
      const filePath = `certificates/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio')
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
    } catch (err: any) {
      console.error(err);
      setError('Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      name,
      organization,
      issue_date: issueDate || null,
      credential_id: credentialId,
      verification_url: verificationUrl,
      image_url: imageUrl,
    };

    try {
      if (editingCert) {
        await api.certificates.update(editingCert.id, payload);
      } else {
        await api.certificates.create(payload);
      }
      setModalOpen(false);
      fetchCerts();
    } catch (err: any) {
      console.error(err);
      setError('Failed to save certificate.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) return;
    try {
      await api.certificates.delete(id);
      fetchCerts();
    } catch (err) {
      console.error(err);
      alert('Failed to delete certificate.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Manage Certificates</h1>
          <p className="text-gray-400 text-sm mt-1">Upload and catalog credentials, courses, and honors.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-all duration-300 shadow-lg shadow-purple-600/10 cursor-pointer"
        >
          <FiPlus className="w-4.5 h-4.5" />
          <span>Add Certificate</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {certs.map((cert) => (
            <div key={cert.id} className="glass-panel rounded-2xl overflow-hidden border border-white/5 flex flex-col justify-between group">
              <div className="relative h-44 bg-gray-900 overflow-hidden border-b border-white/5 flex items-center justify-center">
                {cert.image_url ? (
                  <img
                    src={cert.image_url}
                    alt={cert.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-purple-950/20 text-purple-400 font-bold uppercase tracking-wider text-xs">
                    Credential Preview
                  </div>
                )}
              </div>
              
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight leading-snug">{cert.name}</h3>
                  <p className="text-purple-300/80 text-xs font-semibold mt-1">{cert.organization}</p>
                  
                  {cert.issue_date && (
                    <span className="text-[10px] text-gray-500 block mt-2">
                      Issued: {new Date(cert.issue_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
                    </span>
                  )}

                  {cert.credential_id && (
                    <span className="text-[10px] text-gray-500 block font-mono mt-1">
                      ID: {cert.credential_id}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  <div>
                    {cert.verification_url && (
                      <a
                        href={cert.verification_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center space-x-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
                      >
                        <FiLink className="w-3.5 h-3.5" />
                        <span>Verify Link</span>
                      </a>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(cert)}
                      className="p-2 rounded-lg bg-purple-500/10 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/20 transition-all cursor-pointer"
                      title="Edit Certificate"
                    >
                      <FiEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cert.id)}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/20 transition-all cursor-pointer"
                      title="Delete Certificate"
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
          <div className="w-full max-w-md bg-[#0b091c] border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-scale-in">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                {editingCert ? 'Edit Certificate' : 'Add Certificate'}
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
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Certificate Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Google Data Analytics"
                  className="block w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/40 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all"
                />
              </div>

              {/* Organization */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Issuing Organization</label>
                <input
                  type="text"
                  required
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. Coursera - Google"
                  className="block w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/40 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Issue Date */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Issue Date</label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="block w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/40 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all"
                  />
                </div>

                {/* Credential ID */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Credential ID</label>
                  <input
                    type="text"
                    value={credentialId}
                    onChange={(e) => setCredentialId(e.target.value)}
                    placeholder="GDA-1029..."
                    className="block w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/40 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all"
                  />
                </div>
              </div>

              {/* Verification URL */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Verification URL</label>
                <input
                  type="url"
                  value={verificationUrl}
                  onChange={(e) => setVerificationUrl(e.target.value)}
                  placeholder="https://coursera.org/verify/..."
                  className="block w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/40 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500/30 transition-all"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Certificate Image / Badge</label>
                
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
                  {submitting ? 'Saving...' : 'Save Certificate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default ManageCertificates;
