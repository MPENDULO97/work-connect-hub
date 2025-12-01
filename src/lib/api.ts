// API utility for backend communication
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function to make authenticated requests
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
};

// Auth API
export const authAPI = {
  signUp: async (email: string, password: string, userData?: any) => {
    return fetchWithAuth('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, ...userData }),
    });
  },

  signIn: async (email: string, password: string) => {
    const data = await fetchWithAuth('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }
    
    return data;
  },

  signOut: () => {
    localStorage.removeItem('authToken');
  },

  getSession: async () => {
    try {
      const token = getAuthToken();
      if (!token) return { session: null };

      const user = await fetchWithAuth('/api/auth/me');
      return { session: { user } };
    } catch (error) {
      return { session: null };
    }
  },
};

// User/Profile API
export const profileAPI = {
  getProfile: async (userId: string) => {
    return fetchWithAuth(`/api/profiles/${userId}`);
  },

  updateProfile: async (userId: string, data: any) => {
    return fetchWithAuth(`/api/profiles/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// Roles API
export const rolesAPI = {
  getUserRoles: async (userId: string) => {
    return fetchWithAuth(`/api/users/${userId}/roles`);
  },
};

// Projects API
export const projectsAPI = {
  getProjects: async (userId?: string) => {
    const url = userId ? `/api/projects?userId=${userId}` : '/api/projects';
    return fetchWithAuth(url);
  },

  getProject: async (projectId: string) => {
    return fetchWithAuth(`/api/projects/${projectId}`);
  },

  createProject: async (data: any) => {
    return fetchWithAuth('/api/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Proposals API
export const proposalsAPI = {
  getProposals: async (userId?: string) => {
    const url = userId ? `/api/proposals?userId=${userId}` : '/api/proposals';
    return fetchWithAuth(url);
  },

  createProposal: async (data: any) => {
    return fetchWithAuth('/api/proposals', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
