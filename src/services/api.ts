import axios, { AxiosError } from 'axios';
import type {
  AuthResponse,
  Category,
  Conversation,
  CreateListingData,
  Listing,
  LoginRequest,
  Message,
  PaginatedResponse,
  RegisterRequest,
  TokenResponse,
  UpdateProfileData,
  User,
  UserProfile,
} from '@/types';

// Ensure API URL uses HTTPS and has no trailing slash
const getApiBaseUrl = () => {
  const url = import.meta.env.VITE_API_URL || '/api';
  // Remove trailing slash if present
  return url.replace(/\/$/, '');
};

const API_BASE_URL = getApiBaseUrl();

// Create axios instance with timeout
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh and error handling
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Handle timeout errors
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      const timeoutError = new Error('Request timeout: The server is taking too long to respond. Please check if the backend is running.');
      (timeoutError as any).isTimeout = true;
      return Promise.reject(timeoutError);
    }

    // Handle network errors (backend down, CORS issues, etc.)
    if (!error.response && error.request) {
      // Check if it's a CORS error or connection issue
      const isCorsError = error.message?.includes('CORS') || error.message?.includes('Network Error');
      const errorMessage = isCorsError 
        ? 'Connection error: Please check your internet connection and try again.'
        : `Cannot connect to server. Please check:\n1. Your internet connection\n2. The backend server is running\n3. API URL: ${API_BASE_URL}`;
      
      const networkError = new Error(errorMessage);
      (networkError as any).isNetworkError = true;
      return Promise.reject(networkError);
    }

    // Handle 401 errors for token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const { data } = await axios.post<{ access: string }>(
            `${API_BASE_URL}/auth/token/refresh/`,
            { refresh: refreshToken },
            { timeout: 30000 }
          );
          localStorage.setItem('access_token', data.access);
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register/', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<TokenResponse> => {
    const response = await api.post<TokenResponse>('/auth/login/', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/auth/user/');
    return response.data;
  },

  sendVerificationEmail: async (): Promise<{ message: string; email_sent: boolean; expires_in_minutes?: number }> => {
    const response = await api.post('/auth/send-verification/');
    return response.data;
  },

  verifyEmail: async (email: string, code: string): Promise<{ message: string; user: User; email_verified: boolean }> => {
    const response = await api.post('/auth/verify-email/', { email, code });
    return response.data;
  },
};

// Categories API
export const categoriesAPI = {
  list: async (): Promise<PaginatedResponse<Category>> => {
    try {
      console.log('[api] categoriesAPI.list: Fetching categories...');
      const response = await api.get<PaginatedResponse<Category>>('/categories/');
      console.log('[api] categoriesAPI.list: Response received', {
        status: response.status,
        hasData: !!response.data,
        hasResults: !!response.data?.results,
        resultsLength: response.data?.results?.length,
        isArray: Array.isArray(response.data),
        dataType: Array.isArray(response.data) ? 'array' : typeof response.data
      });
      
      // Handle both paginated and direct array responses
      if (response.data?.results) {
        console.log('[api] categoriesAPI.list: Paginated response, returning results');
        return response.data;
      } else if (Array.isArray(response.data)) {
        console.log('[api] categoriesAPI.list: Array response, wrapping in results');
        return { results: response.data, count: response.data.length };
      } else {
        console.warn('[api] categoriesAPI.list: Unexpected response format', response.data);
        return { results: [], count: 0 };
      }
    } catch (error: any) {
      console.error('[api] categoriesAPI.list: Error', {
        error,
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
        isNetworkError: error?.isNetworkError
      });
      throw error;
    }
  },

  getBySlug: async (slug: string): Promise<Category> => {
    const response = await api.get<Category>(`/categories/${slug}/`);
    return response.data;
  },
};

// Listings API
export const listingsAPI = {
  list: async (params?: {
    search?: string;
    category?: string;
    status?: string;
    condition?: string;
    min_price?: number;
    max_price?: number;
    ordering?: string;
    page?: number;
    ai_detected?: string;
  }): Promise<PaginatedResponse<Listing>> => {
    const response = await api.get<PaginatedResponse<Listing>>('/listings/', { params });
    return response.data;
  },

  get: async (id: number): Promise<Listing> => {
    const response = await api.get<Listing>(`/listings/${id}/`);
    return response.data;
  },

  create: async (data: FormData | CreateListingData): Promise<Listing> => {
    let formData: FormData;
    if (data instanceof FormData) {
      formData = data;
    } else {
      formData = new FormData();
      formData.append('title', data.title);
      formData.append('price', data.price);
      formData.append('condition', data.condition);
      formData.append('category_id', data.category_id.toString());
      formData.append('image', data.image);
      if (data.description) {
        formData.append('description', data.description);
      }
    }

    const response = await api.post<Listing>('/listings/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id: number, data: Partial<CreateListingData>): Promise<Listing> => {
    const formData = new FormData();
    if (data.title) formData.append('title', data.title);
    if (data.price) formData.append('price', data.price);
    if (data.condition) formData.append('condition', data.condition);
    if (data.category_id) formData.append('category_id', data.category_id.toString());
    if (data.description) formData.append('description', data.description);
    if (data.image) formData.append('image', data.image);

    const response = await api.patch<Listing>(`/listings/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/listings/${id}/`);
  },

  markSold: async (id: number): Promise<Listing> => {
    const response = await api.post<Listing>(`/listings/${id}/mark_sold/`);
    return response.data;
  },

  markReserved: async (id: number): Promise<Listing> => {
    const response = await api.post<Listing>(`/listings/${id}/mark_reserved/`);
    return response.data;
  },

  markAvailable: async (id: number): Promise<Listing> => {
    const response = await api.post<Listing>(`/listings/${id}/mark_available/`);
    return response.data;
  },

  myListings: async (includeDeleted = false): Promise<PaginatedResponse<Listing>> => {
    const response = await api.get<PaginatedResponse<Listing>>('/listings/my_listings/', {
      params: { include_deleted: includeDeleted },
    });
    return response.data;
  },

  save: async (id: number): Promise<{ message: string; is_saved: boolean }> => {
    const response = await api.post(`/listings/${id}/save_listing/`);
    return response.data;
  },

  unsave: async (id: number): Promise<{ message: string; is_saved: boolean }> => {
    const response = await api.post(`/listings/${id}/unsave_listing/`);
    return response.data;
  },

  saved: async (): Promise<PaginatedResponse<{ id: number; listing: Listing; created_at: string }>> => {
    const response = await api.get('/listings/saved/');
    return response.data;
  },
};

// Messages API
export const messagesAPI = {
  list: async (listingId?: number): Promise<PaginatedResponse<Message>> => {
    const response = await api.get<PaginatedResponse<Message>>('/messages/', {
      params: listingId ? { listing: listingId } : undefined,
    });
    return response.data;
  },

  send: async (listingId: number, content: string): Promise<Message> => {
    const response = await api.post<Message>('/messages/', {
      listing: listingId,
      content,
    });
    return response.data;
  },

  conversations: async (): Promise<Conversation[]> => {
    const response = await api.get<Conversation[]>('/messages/conversations/');
    return response.data;
  },

  markRead: async (id: number): Promise<Message> => {
    const response = await api.post<Message>(`/messages/${id}/mark_read/`);
    return response.data;
  },
};

// Profile API
export const profileAPI = {
  get: async (): Promise<UserProfile> => {
    const response = await api.get<UserProfile>('/profiles/me/');
    return response.data;
  },

  update: async (data: UpdateProfileData): Promise<UserProfile> => {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.course) formData.append('course', data.course);
    if (data.profile_photo) formData.append('profile_photo', data.profile_photo);

    const response = await api.patch<UserProfile>('/profiles/me/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

// Saved Listings API
export const savedListingsAPI = {
  list: async (): Promise<any[]> => {
    const response = await api.get('/listings/saved/');
    return response.data.results || response.data;
  },

  remove: async (listingId: number): Promise<void> => {
    await api.post(`/listings/${listingId}/unsave_listing/`);
  },
};

// Reports API
export const reportsAPI = {
  create: async (listingId: number, reason: string, description?: string): Promise<any> => {
    const response = await api.post('/reports/', {
      listing: listingId,
      reason,
      description,
    });
    return response.data;
  },
};

// AI API
export const aiAPI = {
  analyzeImage: async (imageFile?: File): Promise<{ tags: string[]; category_suggestions: string[]; description: string }> => {
    try {
      const formData = new FormData();
      // Image is optional - endpoint returns defaults if no image
      if (imageFile && imageFile.size > 0) {
        formData.append('image', imageFile);
        console.log('[api] analyzeImage: Sending image', imageFile.name, imageFile.size);
      } else {
        console.log('[api] analyzeImage: No image provided, requesting defaults');
      }
      
      const response = await api.post('/ai/analyze-image/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      console.log('[api] analyzeImage: Response received', {
        status: response.status,
        data: response.data,
        hasCategorySuggestions: !!response.data?.category_suggestions,
        categorySuggestionsLength: response.data?.category_suggestions?.length,
        categorySuggestionsType: Array.isArray(response.data?.category_suggestions) ? 'array' : typeof response.data?.category_suggestions
      });
      
      // Validate response structure
      if (!response.data) {
        console.warn('[api] analyzeImage: Empty response data');
        return {
          tags: [],
          category_suggestions: [],
          description: 'Empty response from server'
        };
      }
      
      // Ensure category_suggestions is an array
      const categorySuggestions = Array.isArray(response.data.category_suggestions) 
        ? response.data.category_suggestions 
        : [];
      
      const result = {
        tags: Array.isArray(response.data.tags) ? response.data.tags : [],
        category_suggestions: categorySuggestions,
        description: response.data.description || ''
      };
      
      console.log('[api] analyzeImage: Parsed result', result);
      return result;
      
    } catch (error: any) {
      console.error('[api] analyzeImage: Error occurred', {
        error,
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
        isNetworkError: error?.isNetworkError
      });
      
      // Handle 404 specifically (endpoint not deployed yet)
      if (error.response?.status === 404) {
        console.warn('[api] analyzeImage: 404 - endpoint not found, returning defaults');
        return {
          tags: [],
          category_suggestions: ['Electronics', 'Books', 'Fashion', 'Furniture', 'Kitchen', 'Sports', 'Stationery', 'Other'],
          description: 'AI analysis unavailable. Please select a category manually.'
        };
      }
      
      // For other errors, return defaults instead of throwing
      return {
        tags: [],
        category_suggestions: ['Electronics', 'Books', 'Fashion', 'Furniture', 'Kitchen', 'Sports', 'Stationery', 'Other'],
        description: 'Could not analyze image. Please select a category manually.'
      };
    }
  },
};

// Search API
export const premiumAPI = {
  // AI Price Suggestions
  suggestPrice: async (data: {
    title?: string;
    description?: string;
    category?: number | string;
    condition?: string;
    image?: File;
  }) => {
    const formData = new FormData();
    if (data.title) formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.category) formData.append('category', String(data.category));
    if (data.condition) formData.append('condition', data.condition);
    if (data.image) formData.append('image', data.image);

    const response = await api.post('/ai/suggest-price/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Generate Listing Content
  generateContent: async (image: File, category?: number | string) => {
    const formData = new FormData();
    formData.append('image', image);
    if (category) formData.append('category', String(category));

    const response = await api.post('/ai/generate-content/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Upload Avatar
  uploadAvatar: async (avatarUrl?: string, profilePhoto?: File) => {
    const formData = new FormData();
    if (avatarUrl) formData.append('avatar_url', avatarUrl);
    if (profilePhoto) formData.append('profile_photo', profilePhoto);

    const response = await api.post('/profile/upload-avatar/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Draft Listings
  getDrafts: async () => {
    const response = await api.get('/drafts/');
    return response.data;
  },

  createDraft: async (data: {
    title?: string;
    description?: string;
    price?: number;
    category?: number;
    condition?: string;
    images_data?: any[];
  }) => {
    const response = await api.post('/drafts/', data);
    return response.data;
  },

  updateDraft: async (id: number, data: any) => {
    const response = await api.patch(`/drafts/${id}/`, data);
    return response.data;
  },

  deleteDraft: async (id: number) => {
    const response = await api.delete(`/drafts/${id}/`);
    return response.data;
  },

  // Recently Viewed
  getRecentlyViewed: async () => {
    const response = await api.get('/recently-viewed/');
    return response.data;
  },

  markAsViewed: async (listingId: number) => {
    const response = await api.post('/recently-viewed/mark_viewed/', {
      listing_id: listingId,
    });
    return response.data;
  },

  // Saved Searches
  getSavedSearches: async () => {
    const response = await api.get('/saved-searches/');
    return response.data;
  },

  createSavedSearch: async (data: {
    name: string;
    query?: string;
    category?: number;
    min_price?: number;
    max_price?: number;
    condition?: string;
    alert_enabled?: boolean;
  }) => {
    const response = await api.post('/saved-searches/', data);
    return response.data;
  },

  updateSavedSearch: async (id: number, data: any) => {
    const response = await api.patch(`/saved-searches/${id}/`, data);
    return response.data;
  },

  deleteSavedSearch: async (id: number) => {
    const response = await api.delete(`/saved-searches/${id}/`);
    return response.data;
  },

  toggleSearchAlert: async (id: number) => {
    const response = await api.post(`/saved-searches/${id}/toggle_alert/`);
    return response.data;
  },

  checkAlerts: async () => {
    const response = await api.get('/saved-searches/check_alerts/');
    return response.data;
  },

  // Seller Dashboard
  getSellerDashboard: async () => {
    const response = await api.get('/seller/dashboard/');
    return response.data;
  },
};

export const searchAPI = {
  save: async (query: string, categoryId?: number): Promise<any> => {
    const response = await api.post('/search/save/', {
      query,
      category_id: categoryId,
    });
    return response.data;
  },
  suggestions: async (query: string): Promise<{ suggestions: string[] }> => {
    const response = await api.get('/search/suggestions/', {
      params: { q: query },
    });
    return response.data;
  },
};

export default api;
