import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { supabase } from '../../services/supabase';
import { FiSave, FiUpload, FiSliders } from 'react-icons/fi';

export const ManageSettings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form States
  const [title, setTitle] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState('');
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await api.settings.get();
      if (data) {
        setTitle(data.title || '');
        setLogoUrl(data.logo_url || '');
        setMetaDescription(data.meta_description || '');
        setGoogleAnalyticsId(data.google_analytics_id || '');
        setTheme(data.theme || 'dark');
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch website settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `logo_${Date.now()}.${fileExt}`;
      const filePath = `settings/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio')
        .getPublicUrl(filePath);

      setLogoUrl(publicUrl);
      setSuccess('Logo uploaded successfully!');
    } catch (err: any) {
      console.error(err);
      setError('Logo upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const payload = {
      title,
      logo_url: logoUrl,
      meta_description: metaDescription,
      google_analytics_id: googleAnalyticsId,
      theme,
    };

    try {
      await api.settings.update(payload);
      setSuccess('Website settings updated successfully!');
      
      // Update document title dynamically in admin for instant feedback
      document.title = title || 'Portfolio Admin';
    } catch (err: any) {
      console.error(err);
      setError('Failed to update website settings.');
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
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Global Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Configure your website titles, SEO descriptors, and tracking configurations.</p>
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

      <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl border border-white/5 space-y-6">
        <h3 className="text-sm font-bold text-white border-b border-white/5 pb-2.5 flex items-center space-x-2">
          <FiSliders className="w-4.5 h-4.5 text-purple-400" />
          <span>Website Configurations</span>
        </h3>

        {/* Website Title */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Website Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. John Doe | Professional Portfolio"
            className="block w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/40 text-sm text-white placeholder-gray-600 focus:outline-none transition-all"
          />
        </div>

        {/* Logo URL */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Website Logo</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="Paste Logo URL or Upload →"
              className="block flex-1 px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/40 text-sm text-white placeholder-gray-600 focus:outline-none transition-all"
            />
            <label className="relative p-2.5 rounded-xl bg-purple-600/10 hover:bg-purple-600/20 text-purple-300 hover:text-white border border-purple-500/25 transition-all flex items-center justify-center cursor-pointer min-w-[45px]">
              {uploading ? (
                <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FiUpload className="w-4.5 h-4.5" />
              )}
              <input
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={handleLogoUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* SEO Meta Description */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">SEO Meta Description</label>
          <textarea
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            placeholder="A short description that search engines display under search listings..."
            rows={3}
            className="block w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/40 text-sm text-white placeholder-gray-600 focus:outline-none transition-all resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Google Analytics ID */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Google Analytics Tag (G-XXXXXXXXXX)</label>
            <input
              type="text"
              value={googleAnalyticsId}
              onChange={(e) => setGoogleAnalyticsId(e.target.value)}
              placeholder="G-XXXXXX"
              className="block w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/40 text-sm text-white placeholder-gray-600 focus:outline-none transition-all"
            />
          </div>

          {/* Theme */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Default Theme Mode</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="block w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/40 text-sm text-white focus:outline-none transition-all"
            >
              <option value="dark" className="bg-[#0b091c] text-white">Dark Mode (Default)</option>
              <option value="light" className="bg-[#0b091c] text-white">Light Mode</option>
            </select>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end border-t border-white/5 pt-6">
          <button
            type="submit"
            disabled={saving || uploading}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-purple-600/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <FiSave className="w-4.5 h-4.5" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
export default ManageSettings;
