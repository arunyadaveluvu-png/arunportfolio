import { supabase } from './supabase';

const API_URL = import.meta.env.VITE_API_URL || 'https://arunportfolio-03k6.onrender.com';

// Helper to fetch auth headers
const getHeaders = async (isMultipart = false) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  const headers: Record<string, string> = {};
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Generic fetch wrapper
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}/api${path}`, options);
  
  if (!response.ok) {
    const errorJson = await response.json().catch(() => ({}));
    throw new Error(errorJson.error || `HTTP error! status: ${response.status}`);
  }
  
  return response.json() as Promise<T>;
}

export const api = {
  // Public submissions
  submitContact: async (data: { name: string; email: string; subject?: string; message: string }) => {
    return request<any>('/contact', {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify(data),
    });
  },

  logVisit: async (pageVisited: string) => {
    return request<any>('/visitor-log', {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify({ page_visited: pageVisited }),
    }).catch(err => console.error('Failed to log visitor view:', err));
  },

  // Projects CRUD
  projects: {
    getAll: () => request<any[]>('/projects'),
    create: async (data: any) => request<any>('/projects', {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify(data),
    }),
    update: async (id: string, data: any) => request<any>(`/projects/${id}`, {
      method: 'PUT',
      headers: await getHeaders(),
      body: JSON.stringify(data),
    }),
    delete: async (id: string) => request<any>(`/projects/${id}`, {
      method: 'DELETE',
      headers: await getHeaders(),
    }),
  },

  // Skills CRUD
  skills: {
    getAll: () => request<any[]>('/skills'),
    create: async (data: any) => request<any>('/skills', {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify(data),
    }),
    update: async (id: string, data: any) => request<any>(`/skills/${id}`, {
      method: 'PUT',
      headers: await getHeaders(),
      body: JSON.stringify(data),
    }),
    delete: async (id: string) => request<any>(`/skills/${id}`, {
      method: 'DELETE',
      headers: await getHeaders(),
    }),
  },

  // Certifications CRUD
  certificates: {
    getAll: () => request<any[]>('/certificates'),
    create: async (data: any) => request<any>('/certificates', {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify(data),
    }),
    update: async (id: string, data: any) => request<any>(`/certificates/${id}`, {
      method: 'PUT',
      headers: await getHeaders(),
      body: JSON.stringify(data),
    }),
    delete: async (id: string) => request<any>(`/certificates/${id}`, {
      method: 'DELETE',
      headers: await getHeaders(),
    }),
  },

  // Education CRUD
  education: {
    getAll: () => request<any[]>('/education'),
    create: async (data: any) => request<any>('/education', {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify(data),
    }),
    update: async (id: string, data: any) => request<any>(`/education/${id}`, {
      method: 'PUT',
      headers: await getHeaders(),
      body: JSON.stringify(data),
    }),
    delete: async (id: string) => request<any>(`/education/${id}`, {
      method: 'DELETE',
      headers: await getHeaders(),
    }),
  },

  // Experience CRUD
  experience: {
    getAll: () => request<any[]>('/experience'),
    create: async (data: any) => request<any>('/experience', {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify(data),
    }),
    update: async (id: string, data: any) => request<any>(`/experience/${id}`, {
      method: 'PUT',
      headers: await getHeaders(),
      body: JSON.stringify(data),
    }),
    delete: async (id: string) => request<any>(`/experience/${id}`, {
      method: 'DELETE',
      headers: await getHeaders(),
    }),
  },


  // Profile CRUD
  profile: {
    get: () => request<any>('/profile'),
    update: async (data: any) => request<any>('/profile', {
      method: 'PUT',
      headers: await getHeaders(),
      body: JSON.stringify(data),
    }),
  },

  // Gallery CRUD
  gallery: {
    getAll: () => request<any[]>('/gallery'),
    registerUpload: async (data: { image_url: string; name?: string; size?: number }) => request<any>('/gallery', {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify(data),
    }),
    delete: async (id: string) => request<any>(`/gallery/${id}`, {
      method: 'DELETE',
      headers: await getHeaders(),
    }),
  },

  // Messages / Contact submissions management
  messages: {
    getAll: async () => request<any[]>('/messages', {
      headers: await getHeaders(),
    }),
    markRead: async (id: string, isRead: boolean) => request<any>(`/messages/${id}`, {
      method: 'PUT',
      headers: await getHeaders(),
      body: JSON.stringify({ is_read: isRead }),
    }),
    reply: async (id: string, replyText: string) => request<any>(`/messages/${id}/reply`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify({ replyText }),
    }),
    delete: async (id: string) => request<any>(`/messages/${id}`, {
      headers: await getHeaders(),
      method: 'DELETE',
    }),
  },

  // Settings CRUD
  settings: {
    get: () => request<any>('/settings'),
    update: async (data: any) => request<any>('/settings', {
      method: 'PUT',
      headers: await getHeaders(),
      body: JSON.stringify(data),
    }),
  },

  // Stats for Dashboard Home
  stats: {
    getSummary: async () => request<any>('/stats', {
      headers: await getHeaders(),
    }),
  },
};
