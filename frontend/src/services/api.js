import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_URL
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
});

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me')
};

// Candidate APIs
export const candidateAPI = {
  uploadResume: (formData) => {
    const token = localStorage.getItem('token');

    return api.post('/candidate/upload-resume', formData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },
  getMyResume: () => api.get('/candidate/my-resume'),
  deleteMyResume: () => api.delete('/candidate/my-resume')
};

// HR APIs
export const hrAPI = {
  createJob: (formData) => api.post('/hr/create-job', formData),
  getMyJobs: () => api.get('/hr/my-jobs'),
  getCandidates: (jobId) => api.get(`/hr/job/${jobId}/candidates`),
  sendInvitations: (jobId, data) => api.post(`/hr/job/${jobId}/send-invitations`, data)
};

export default api;