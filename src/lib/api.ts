const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface FetchOptions extends RequestInit {
  token?: string;
}

async function fetchAPI(endpoint: string, options: FetchOptions = {}) {
  const { token, ...fetchOptions } = options;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...fetchOptions,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

// Auth API
export const authAPI = {
  signup: (data: { email: string; password: string; fullName: string; roles: string[] }) =>
    fetchAPI('/api/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
  
  login: (data: { email: string; password: string }) =>
    fetchAPI('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  
  logout: () =>
    fetchAPI('/api/auth/logout', { method: 'POST' }),
  
  getSession: (token?: string) =>
    fetchAPI('/api/auth/session', { token }),
};

// Jobs API
export const jobsAPI = {
  list: (params?: { category?: string; q?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return fetchAPI(`/api/jobs${query ? `?${query}` : ''}`);
  },
  
  get: (id: string) =>
    fetchAPI(`/api/jobs/${id}`),
  
  create: (data: any, token?: string) =>
    fetchAPI('/api/jobs', { method: 'POST', body: JSON.stringify(data), token }),
  
  update: (id: string, data: any, token?: string) =>
    fetchAPI(`/api/jobs/${id}`, { method: 'PUT', body: JSON.stringify(data), token }),
  
  delete: (id: string, token?: string) =>
    fetchAPI(`/api/jobs/${id}`, { method: 'DELETE', token }),
};

// Projects API
export const projectsAPI = {
  list: (params?: { status?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return fetchAPI(`/api/projects${query ? `?${query}` : ''}`);
  },
  
  get: (id: string) =>
    fetchAPI(`/api/projects/${id}`),
  
  create: (data: any, token?: string) =>
    fetchAPI('/api/projects', { method: 'POST', body: JSON.stringify(data), token }),
  
  update: (id: string, data: any, token?: string) =>
    fetchAPI(`/api/projects/${id}`, { method: 'PUT', body: JSON.stringify(data), token }),
  
  delete: (id: string, token?: string) =>
    fetchAPI(`/api/projects/${id}`, { method: 'DELETE', token }),
};

// Proposals API
export const proposalsAPI = {
  list: (params?: { projectId?: string; freelancerId?: string }, token?: string) => {
    const query = new URLSearchParams(params as any).toString();
    return fetchAPI(`/api/proposals${query ? `?${query}` : ''}`, { token });
  },
  
  create: (data: any, token?: string) =>
    fetchAPI('/api/proposals', { method: 'POST', body: JSON.stringify(data), token }),
  
  update: (id: string, data: any, token?: string) =>
    fetchAPI(`/api/proposals/${id}`, { method: 'PUT', body: JSON.stringify(data), token }),
};
