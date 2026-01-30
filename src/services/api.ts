import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://hertsmarketplace-production.up.railway.app';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/api/auth/token/refresh/`, {
            refresh: refreshToken,
          });
          localStorage.setItem('access_token', response.data.access);
          error.config.headers.Authorization = `Bearer ${response.data.access}`;
          return api.request(error.config);
        } catch (refreshError) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login/', credentials);
    return response.data;
  },
  register: async (data: any) => {
    const response = await api.post('/auth/register/', data);
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get('/auth/user/');
    return response.data;
  },
  sendVerification: async (email: string) => {
    const response = await api.post('/auth/send-verification/', { email });
    return response.data;
  },
  sendVerificationEmail: async (email: string) => {
    const response = await api.post('/auth/send-verification/', { email });
    return response.data;
  },
  verifyEmail: async (email: string, code: string) => {
    const response = await api.post('/auth/verify-email/', { email, code });
    return response.data;
  },
  requestPasswordReset: async (email: string) => {
    const response = await api.post('/auth/request-password-reset/', { email });
    return response.data;
  },
  resetPassword: async (email: string, code: string, password: string, password2: string) => {
    const response = await api.post('/auth/reset-password/', { email, code, password, password2 });
    return response.data;
  },
};

// Conversations API (NEW - Vinted-style)
export const conversationsAPI = {
  start: async (listingId: number) => {
    const response = await api.post('/conversations/start/', { listing_id: listingId });
    return response.data;
  },
  list: async () => {
    const response = await api.get('/conversations/');
    return response.data;
  },
};

// Messages API
export const messagesAPI = {
  // NEW: Use conversation_id
  list: async (conversationId: number) => {
    const response = await api.get('/messages/', { params: { conversation: conversationId } });
    return response.data;
  },
  // NEW: Send message with conversation_id
  send: async (conversationId: number, content: string) => {
    const response = await api.post('/messages/', { conversation_id: conversationId, content });
    return response.data;
  },
  // Legacy: conversations endpoint (redirects to conversationsAPI.list)
  conversations: async () => {
    const response = await api.get('/messages/conversations/');
    return response.data;
  },
};

// Categories API
export const categoriesAPI = {
  list: async () => {
    const response = await api.get('/categories/');
    return response.data;
  },
  create: async (name: string) => {
    const response = await api.post('/categories/', { name });
    return response.data;
  },
};

// Listings API
export const listingsAPI = {
  list: async (params?: any) => {
    const response = await api.get('/listings/', { params });
    return response.data;
  },
  get: async (id: number) => {
    const response = await api.get(`/listings/${id}/`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/listings/', data);
    return response.data;
  },
  update: async (id: number, data: any) => {
    const response = await api.patch(`/listings/${id}/`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/listings/${id}/`);
    return response.data;
  },
  markSold: async (id: number) => {
    const response = await api.post(`/listings/${id}/mark_sold/`);
    return response.data;
  },
  markAvailable: async (id: number) => {
    const response = await api.post(`/listings/${id}/mark_available/`);
    return response.data;
  },
  markReserved: async (id: number) => {
    const response = await api.post(`/listings/${id}/mark_reserved/`);
    return response.data;
  },
  myListings: async () => {
    const response = await api.get('/listings/', { params: { seller: 'me' } });
    return response.data;
  },
  save: async (id: number) => {
    const response = await api.post(`/listings/${id}/save_listing/`);
    return response.data;
  },
  unsave: async (id: number) => {
    const response = await api.post(`/listings/${id}/unsave_listing/`);
    return response.data;
  },
};

// Saved Listings API
export const savedListingsAPI = {
  list: async () => {
    const response = await api.get('/saved-listings/');
    return response.data;
  },
  save: async (listingId: number) => {
    const response = await api.post(`/listings/${listingId}/save_listing/`);
    return response.data;
  },
  unsave: async (listingId: number) => {
    const response = await api.post(`/listings/${listingId}/unsave_listing/`);
    return response.data;
  },
  remove: async (listingId: number) => {
    const response = await api.post(`/listings/${listingId}/unsave_listing/`);
    return response.data;
  },
};

// Profile API
export const profileAPI = {
  get: async (id?: number) => {
    const url = id ? `/profiles/${id}/` : '/profiles/';
    const response = await api.get(url);
    return response.data;
  },
  update: async (data: any) => {
    const response = await api.patch('/profiles/', data);
    return response.data;
  },
  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.post('/profile/upload-avatar/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

// Premium API
export const premiumAPI = {
  getDashboard: async () => {
    const response = await api.get('/seller/dashboard/');
    return response.data;
  },
  getSellerDashboard: async () => {
    const response = await api.get('/seller/dashboard/');
    return response.data;
  },
  getNotifications: async () => {
    const response = await api.get('/notifications/');
    return response.data;
  },
  getRecentlyViewed: async () => {
    const response = await api.get('/recently-viewed/');
    return response.data;
  },
  markAsViewed: async (listingId: number) => {
    const response = await api.post('/recently-viewed/mark_viewed/', { listing_id: listingId });
    return response.data;
  },
  uploadAvatar: async (userId: any, file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.post('/profile/upload-avatar/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  checkAlerts: async () => {
    const response = await api.get('/saved-searches/check_alerts/');
    return response.data;
  },
};

// Search API
export const searchAPI = {
  search: async (query: string) => {
    const response = await api.get('/listings/', { params: { search: query } });
    return response.data;
  },
  save: async (query: string, categoryId?: number) => {
    const response = await api.post('/search/save/', { query, category: categoryId });
    return response.data;
  },
  suggestions: async (query: string) => {
    const response = await api.get('/search/suggestions/', { params: { q: query } });
    return response.data;
  },
};

// Reviews API
export const reviewsAPI = {
  list: async (params?: any) => {
    const response = await api.get('/reviews/', { params });
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/reviews/', data);
    return response.data;
  },
  get: async (id: number) => {
    const response = await api.get(`/reviews/${id}/`);
    return response.data;
  },
};

// AI API
export const aiAPI = {
  analyzeImage: async (imageFile: File) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    const response = await api.post('/ai/analyze-image/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  suggestPrice: async (data: any) => {
    const response = await api.post('/ai/suggest-price/', data);
    return response.data;
  },
  generateContent: async (data: any) => {
    const response = await api.post('/ai/generate-content/', data);
    return response.data;
  },
};

export default api;
