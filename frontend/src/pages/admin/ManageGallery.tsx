import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { supabase } from '../../services/supabase';
import { FiPlus, FiTrash2, FiCopy, FiUpload, FiX, FiCheck } from 'react-icons/fi';

interface GalleryItem {
  id: string;
  image_url: string;
  name: string;
  size: number;
  created_at: string;
}

export const ManageGallery: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const data = await api.gallery.getAll();
      setItems(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      // 1. Upload to Supabase Storage bucket 'portfolio'
      const { data, error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Fetch public URL
      const { data: { publicUrl } } = supabase.storage
        .from('portfolio')
        .getPublicUrl(filePath);

      // 3. Register image in database via backend Express routing
      await api.gallery.registerUpload({
        image_url: publicUrl,
        name: file.name,
        size: file.size,
      });

      fetchGallery();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this image from storage and gallery?')) return;
    try {
      await api.gallery.delete(id);
      fetchGallery();
    } catch (err) {
      console.error(err);
      alert('Failed to delete image.');
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Media Gallery</h1>
          <p className="text-gray-400 text-sm mt-1">Upload and copy public URLs of images for projects, cover files, and profile avatars.</p>
        </div>
        
        <label className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-all duration-300 shadow-lg shadow-purple-600/10 cursor-pointer">
          {uploading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Uploading Asset...</span>
            </>
          ) : (
            <>
              <FiUpload className="w-4.5 h-4.5" />
              <span>Upload Image</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={handleUpload}
            className="hidden"
          />
        </label>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-red-300 text-xs">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.id} className="glass-panel rounded-2xl overflow-hidden border border-white/5 flex flex-col justify-between group">
              <div className="relative aspect-video bg-gray-900 overflow-hidden border-b border-white/5 flex items-center justify-center">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-4 space-y-3">
                <div className="min-w-0">
                  <p className="text-gray-300 text-xs font-bold truncate">{item.name}</p>
                  <p className="text-gray-500 text-[10px] mt-0.5">{formatBytes(item.size)}</p>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-3">
                  <button
                    onClick={() => handleCopyUrl(item.image_url, item.id)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-purple-500/15 text-gray-400 hover:text-purple-300 transition-colors text-xs font-semibold cursor-pointer"
                  >
                    {copiedId === item.id ? (
                      <>
                        <FiCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <FiCopy className="w-3.5 h-3.5" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-300 transition-colors cursor-pointer"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default ManageGallery;
