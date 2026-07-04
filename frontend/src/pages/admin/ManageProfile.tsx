import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { supabase } from '../../services/supabase';
import { FiSave, FiUpload, FiGithub, FiLinkedin, FiMail, FiPhone, FiMapPin, FiInfo, FiFileText } from 'react-icons/fi';

interface ProfileData {
  name: string;
  title: string;
  biography: string;
  profile_photo: string;
  cover_photo: string;
  resume_url: string;
  phone: string;
  email: string;
  location: string;
  social_links: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
  };
}

export const ManageProfile: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form States
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [biography, setBiography] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [coverPhoto, setCoverPhoto] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  
  const [profilePhotoSource, setProfilePhotoSource] = useState<'upload' | 'url'>('url');
  const [coverPhotoSource, setCoverPhotoSource] = useState<'upload' | 'url'>('url');
  const [resumeSource, setResumeSource] = useState<'upload' | 'url'>('url');

  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  
  // Social links
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [portfolio, setPortfolio] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await api.profile.get();
      if (data) {
        setName(data.name || '');
        setTitle(data.title || '');
        setBiography(data.biography || '');
        setProfilePhoto(data.profile_photo || '');
        setProfilePhotoSource(data.profile_photo && data.profile_photo.includes('supabase.co') ? 'upload' : 'url');
        setCoverPhoto(data.cover_photo || '');
        setCoverPhotoSource(data.cover_photo && data.cover_photo.includes('supabase.co') ? 'upload' : 'url');
        setResumeUrl(data.resume_url || '');
        setResumeSource(data.resume_url && data.resume_url.includes('supabase.co') ? 'upload' : 'url');
        setPhone(data.phone || '');
        setEmail(data.email || '');
        setLocation(data.location || '');
        setGithub(data.social_links?.github || '');
        setLinkedin(data.social_links?.linkedin || '');
        setPortfolio(data.social_links?.portfolio || '');
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch profile settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'profile_photo' | 'cover_photo' | 'resume_url') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(fieldName);
    setError(null);
    setSuccess(null);

    try {
      const fileExt = file.name.split('.').pop();
      const folder = fieldName === 'resume_url' ? 'resumes' : 'profile';
      const fileName = `${fieldName}_${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio')
        .getPublicUrl(filePath);

      if (fieldName === 'profile_photo') setProfilePhoto(publicUrl);
      if (fieldName === 'cover_photo') setCoverPhoto(publicUrl);
      if (fieldName === 'resume_url') setResumeUrl(publicUrl);

      setSuccess(`File uploaded successfully for ${fieldName.replace('_', ' ')}!`);
    } catch (err: any) {
      console.error(err);
      setError('File upload failed.');
    } finally {
      setUploadingField(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const payload: ProfileData = {
      name,
      title,
      biography,
      profile_photo: profilePhoto,
      cover_photo: coverPhoto,
      resume_url: resumeUrl,
      phone,
      email,
      location,
      social_links: {
        github,
        linkedin,
        portfolio,
      },
    };

    try {
      await api.profile.update(payload);
      setSuccess('Profile updated successfully!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error(err);
      setError('Failed to update profile settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Manage Profile</h1>
        <p className="text-gray-400 text-sm mt-1">Configure your personal information, cover assets, and resume.</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-red-300 text-xs">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Side: Avatar/Photos Uploader & Preview */}
        <div className="xl:col-span-1 space-y-6">
          {/* Cover/Avatar Card */}
          <div className="glass-panel rounded-2xl overflow-hidden border border-white/5 pb-6">
            {/* Cover photo preview */}
            <div className="relative h-32 bg-purple-950/20 border-b border-white/5 overflow-hidden flex items-center justify-center">
              {coverPhoto ? (
                <img src={coverPhoto} alt="Cover Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-gray-600">No Cover Selected</span>
              )}
            </div>

            {/* Cover Photo Source selector & inputs */}
            <div className="p-4 border-b border-white/5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-400">Cover Photo Source:</span>
                <div className="flex space-x-1.5">
                  <button
                    type="button"
                    onClick={() => setCoverPhotoSource('upload')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${coverPhotoSource === 'upload' ? 'bg-purple-600 text-white shadow' : 'bg-white/5 text-gray-400'}`}
                  >
                    Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => setCoverPhotoSource('url')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${coverPhotoSource === 'url' ? 'bg-purple-600 text-white shadow' : 'bg-white/5 text-gray-400'}`}
                  >
                    URL
                  </button>
                </div>
              </div>
              
              {coverPhotoSource === 'upload' ? (
                <div className="border border-dashed border-white/10 hover:border-purple-500/30 bg-black/20 rounded-xl p-3 flex flex-col items-center justify-center transition-all min-h-[60px]">
                  {uploadingField === 'cover_photo' ? (
                    <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <label className="flex flex-col items-center cursor-pointer space-y-0.5">
                      <FiUpload className="w-4 h-4 text-purple-400" />
                      <span className="text-[9px] text-gray-400 font-semibold">Choose cover image</span>
                      <input type="file" accept="image/*" className="hidden" disabled={uploadingField !== null} onChange={(e) => handleFileUpload(e, 'cover_photo')} />
                    </label>
                  )}
                </div>
              ) : (
                <input
                  type="text"
                  value={coverPhoto}
                  onChange={(e) => setCoverPhoto(e.target.value)}
                  placeholder="Paste cover photo URL"
                  className="block w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/5 focus:border-purple-500/40 text-xs text-white focus:outline-none transition-all"
                />
              )}
            </div>

            {/* Profile Photo Wrapper */}
            <div className="px-6 mt-4 flex flex-col items-center border-b border-white/5 pb-4">
              <div className="relative w-24 h-24 rounded-full border-4 border-[#030010] bg-gray-900 overflow-hidden flex items-center justify-center shadow-xl">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Profile Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-600 text-[10px]">Photo</span>
                )}
              </div>

              <div className="w-full space-y-3 mt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-400">Avatar Photo Source:</span>
                  <div className="flex space-x-1.5">
                    <button
                      type="button"
                      onClick={() => setProfilePhotoSource('upload')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${profilePhotoSource === 'upload' ? 'bg-purple-600 text-white shadow' : 'bg-white/5 text-gray-400'}`}
                    >
                      Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setProfilePhotoSource('url')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${profilePhotoSource === 'url' ? 'bg-purple-600 text-white shadow' : 'bg-white/5 text-gray-400'}`}
                    >
                      URL
                    </button>
                  </div>
                </div>

                {profilePhotoSource === 'upload' ? (
                  <div className="border border-dashed border-white/10 hover:border-purple-500/30 bg-black/20 rounded-xl p-3 flex flex-col items-center justify-center transition-all min-h-[60px]">
                    {uploadingField === 'profile_photo' ? (
                      <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <label className="flex flex-col items-center cursor-pointer space-y-0.5">
                        <FiUpload className="w-4 h-4 text-purple-400" />
                        <span className="text-[9px] text-gray-400 font-semibold">Choose profile avatar</span>
                        <input type="file" accept="image/*" className="hidden" disabled={uploadingField !== null} onChange={(e) => handleFileUpload(e, 'profile_photo')} />
                      </label>
                    )}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={profilePhoto}
                    onChange={(e) => setProfilePhoto(e.target.value)}
                    placeholder="Paste profile photo URL"
                    className="block w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/5 focus:border-purple-500/40 text-xs text-white focus:outline-none transition-all"
                  />
                )}
              </div>

              <h3 className="mt-4 text-white font-bold text-md">{name || 'Your Name'}</h3>
              <p className="text-gray-500 text-xs mt-1 text-center font-medium">{title || 'Your Title'}</p>
            </div>
          </div>

          {/* Resume Upload Box */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <FiFileText className="w-4.5 h-4.5 text-purple-400" />
              <span>Resume PDF</span>
            </h3>
            
            <p className="text-gray-400 text-xs">
              Upload your professional resume in PDF format.
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-400">Resume Source:</span>
                <div className="flex space-x-1.5">
                  <button
                    type="button"
                    onClick={() => setResumeSource('upload')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${resumeSource === 'upload' ? 'bg-purple-600 text-white shadow' : 'bg-white/5 text-gray-400'}`}
                  >
                    Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => setResumeSource('url')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${resumeSource === 'url' ? 'bg-purple-600 text-white shadow' : 'bg-white/5 text-gray-400'}`}
                  >
                    URL
                  </button>
                </div>
              </div>

              {resumeSource === 'upload' ? (
                <div className="border border-dashed border-white/10 hover:border-purple-500/30 bg-black/20 rounded-xl p-4 flex flex-col items-center justify-center transition-all min-h-[70px]">
                  {uploadingField === 'resume_url' ? (
                    <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : resumeUrl ? (
                    <div className="flex items-center space-x-3 w-full justify-between">
                      <span className="text-[10px] text-gray-400 truncate max-w-[150px] font-mono">Resume Loaded</span>
                      <button type="button" onClick={() => setResumeUrl('')} className="text-red-400 hover:text-red-300 text-xs font-semibold cursor-pointer">Remove</button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center cursor-pointer space-y-1">
                      <FiUpload className="w-5 h-5 text-purple-400" />
                      <span className="text-[10px] text-gray-400 font-semibold font-mono">Select Resume PDF</span>
                      <input type="file" accept=".pdf" className="hidden" disabled={uploadingField !== null} onChange={(e) => handleFileUpload(e, 'resume_url')} />
                    </label>
                  )}
                </div>
              ) : (
                <input
                  type="text"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  placeholder="Paste external resume PDF link"
                  className="block w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/40 text-sm text-white placeholder-gray-600 focus:outline-none transition-all"
                />
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Profile Info Fields */}
        <div className="xl:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-white/5 pb-2.5 flex items-center space-x-2">
              <FiInfo className="w-4.5 h-4.5 text-purple-400" />
              <span>Personal Profile Details</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="block w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/40 text-sm text-white focus:outline-none transition-all"
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Professional Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Aspiring Data Analyst | AI & ML Enthusiast"
                  className="block w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/40 text-sm text-white focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Biography */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Biography / Summary</label>
              <textarea
                value={biography}
                onChange={(e) => setBiography(e.target.value)}
                placeholder="Write a brief professional summary about your career goals and interests..."
                rows={6}
                className="block w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/40 text-sm text-white focus:outline-none transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center space-x-1">
                  <FiPhone className="w-3 h-3 text-purple-400" />
                  <span>Phone Number</span>
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="block w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/40 text-sm text-white focus:outline-none transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center space-x-1">
                  <FiMail className="w-3 h-3 text-purple-400" />
                  <span>Email</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="block w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/40 text-sm text-white focus:outline-none transition-all"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center space-x-1">
                  <FiMapPin className="w-3 h-3 text-purple-400" />
                  <span>Location</span>
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="New Delhi, India"
                  className="block w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/40 text-sm text-white focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Social Links Panel */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <FiGithub className="w-4.5 h-4.5 text-purple-400" />
              <span>Social & Portfolio Links</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* GitHub */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center space-x-1">
                  <FiGithub className="w-3 h-3" />
                  <span>GitHub Link</span>
                </label>
                <input
                  type="url"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="https://github.com/..."
                  className="block w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/40 text-sm text-white focus:outline-none transition-all"
                />
              </div>

              {/* LinkedIn */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center space-x-1">
                  <FiLinkedin className="w-3 h-3 text-blue-400" />
                  <span>LinkedIn Link</span>
                </label>
                <input
                  type="url"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  className="block w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/40 text-sm text-white focus:outline-none transition-all"
                />
              </div>

              {/* Portfolio */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Website URL</label>
                <input
                  type="url"
                  value={portfolio}
                  onChange={(e) => setPortfolio(e.target.value)}
                  placeholder="https://yourportfolio.com"
                  className="block w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/40 text-sm text-white focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={saving || uploadingField !== null}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-purple-600/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <FiSave className="w-4.5 h-4.5" />
              <span>{saving ? 'Saving Profile...' : 'Save Profile Settings'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default ManageProfile;
