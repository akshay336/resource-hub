import axios from 'axios';

// Base API configuration (configurable via .env VITE_API_BASE_URL)
const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// =========================================================================
// Day 2: JWT Request Interceptor (Injects Bearer Token into headers)
// =========================================================================
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('resourcehub_jwt_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// =========================================================================
// Day 2: JWT Response Interceptor (Auto-handles 401 Unauthorized / Token Expiry)
// =========================================================================
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and session on authentication failure
      localStorage.removeItem('resourcehub_jwt_token');
      localStorage.removeItem('resourcehub_user');
    }
    return Promise.reject(error);
  }
);

// =========================================================================
// Node.js API Service Endpoints Matrix (Days 1 to 15)
// =========================================================================

export const authApi = {
  // Day 1 Endpoints
  login: (credentials) => apiClient.post('/auth/login', credentials),
  forgotPassword: (email) => apiClient.post('/auth/forgot-password', { email }),
  resetPassword: (payload) => apiClient.post('/auth/reset-password', payload),
  
  // Day 2 Endpoints
  getMe: () => apiClient.get('/auth/me'),
  updateProfile: (profileData) => apiClient.put('/auth/profile', profileData),
  changePassword: (passwordData) => apiClient.put('/auth/change-password', passwordData)
};

export const employeesApi = {
  // Day 4 Endpoints
  getAll: (params) => apiClient.get('/employees', { params }),
  getById: (id) => apiClient.get(`/employees/${id}`),
  create: (data) => apiClient.post('/employees', data),
  update: (id, data) => apiClient.put(`/employees/${id}`, data),
  delete: (id) => apiClient.delete(`/employees/${id}`)
};

export const skillsApi = {
  // Day 5 Endpoints
  getAll: (params) => apiClient.get('/skills', { params }),
  create: (data) => apiClient.post('/skills', data),
  update: (code, data) => apiClient.put(`/skills/${code}`, data),
  delete: (code) => apiClient.delete(`/skills/${code}`)
};

export const certificationsApi = {
  // Day 5 Endpoints
  getAll: (params) => apiClient.get('/certifications', { params }),
  create: (data) => apiClient.post('/certifications', data),
  update: (code, data) => apiClient.put(`/certifications/${code}`, data),
  delete: (code) => apiClient.delete(`/certifications/${code}`)
};

export const clientsApi = {
  // Day 5 Endpoints
  getAll: (params) => apiClient.get('/clients', { params }),
  create: (data) => apiClient.post('/clients', data),
  update: (id, data) => apiClient.put(`/clients/${id}`, data),
  delete: (id) => apiClient.delete(`/clients/${id}`)
};

export const projectsApi = {
  // Day 6 & 7 Endpoints
  getAll: (params) => apiClient.get('/projects', { params }),
  getById: (id) => apiClient.get(`/projects/${id}`),
  create: (data) => apiClient.post('/projects', data),
  update: (id, data) => apiClient.put(`/projects/${id}`, data),
  getStructures: (projectId) => apiClient.get(`/projects/${projectId}/structure`),
  createStructure: (projectId, data) => apiClient.post(`/projects/${projectId}/structure`, data),
  updateStructure: (projectId, structId, data) => apiClient.put(`/projects/${projectId}/structure/${structId}`, data),
  getAllocations: (projectId) => apiClient.get(`/projects/${projectId}/allocations`),
  createAllocation: (projectId, data) => apiClient.post(`/projects/${projectId}/allocations`, data)
};

export const pmApi = {
  // Day 8 Endpoint
  getMyProjects: () => apiClient.get('/pm/my-projects')
};

export const teamApi = {
  // Day 10 Endpoints
  getProjectTeam: (projectId) => apiClient.get(`/projects/${projectId}/team`),
  releaseAllocation: (allocationId) => apiClient.delete(`/allocations/${allocationId}`),
  updateAllocation: (allocationId, data) => apiClient.put(`/allocations/${allocationId}`, data)
};

export const allocationsApi = {
  // Day 11 Endpoints
  getAvailableResources: (params) => apiClient.get('/resources/available', { params }),
  directAllocate: (data) => apiClient.post('/allocations/direct', data)
};

export const resourceRequestsApi = {
  // Day 5 & 14 Endpoints
  getAll: (params) => apiClient.get('/resource-requests', { params }),
  create: (data) => apiClient.post('/resource-requests', data),
  updateStatus: (id, status) => apiClient.put(`/resource-requests/${id}/status`, { status })
};

export const sharingRequestsApi = {
  // Day 12 & 13 Endpoints
  getAll: (params) => apiClient.get('/sharing-requests', { params }),
  getInbox: () => apiClient.get('/sharing-requests/inbox'),
  create: (data) => apiClient.post('/sharing-requests', data),
  acceptRequest: (id) => apiClient.put(`/sharing-requests/${id}/accept`),
  rejectRequest: (id, data) => apiClient.put(`/sharing-requests/${id}/reject`, data),
  updateStatus: (id, status) => apiClient.put(`/sharing-requests/${id}/status`, { status })
};

export const matchingApi = {
  // Day 15 Endpoints
  getMatches: (requestId) => apiClient.get(`/resource-requests/${requestId}/matches`),
  fulfillRequest: (requestId, data) => apiClient.post(`/resource-requests/${requestId}/fulfill`, data)
};

export const dashboardApi = {
  // Day 16 Endpoints
  getKpis: () => apiClient.get('/dashboard/kpis'),
  getUtilizationTrends: (params) => apiClient.get('/dashboard/utilization-trends', { params })
};

export const benchApi = {
  // Day 17 Endpoints
  getBenchResources: (params) => apiClient.get('/resources/bench', { params }),
  getUpcomingAvailability: (params) => apiClient.get('/resources/upcoming-availability', { params })
};

export const auditLogsApi = {
  // Day 18 Endpoints
  getAll: (params) => apiClient.get('/audit-logs', { params })
};

export const reportsApi = {
  // Day 18 Endpoints
  exportUtilization: (params) => apiClient.get('/reports/utilization/export', { params, responseType: 'blob' }),
  exportReport: (type, params) => apiClient.get(`/reports/${type}/export`, { params, responseType: 'blob' })
};

export const notificationsApi = {
  // Day 19 Endpoints
  getAll: (params) => apiClient.get('/notifications', { params }),
  markAsRead: (id) => apiClient.put(`/notifications/${id}/read`),
  markAllAsRead: () => apiClient.put('/notifications/read-all'),
  clearAll: () => apiClient.delete('/notifications')
};

export const adminApi = {
  // Day 20 Endpoints
  getSettings: () => apiClient.get('/admin/settings'),
  updateSettings: (settings) => apiClient.put('/admin/settings', settings),
  getSystemHealth: () => apiClient.get('/admin/health')
};

export default apiClient;
