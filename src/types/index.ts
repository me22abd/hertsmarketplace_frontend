// API Response Types
export interface User {
  id: number;
  email: string;
  phone?: string;
  email_verified: boolean;
  date_joined: string;
  profile: UserProfile;
}

export interface UserProfile {
  id: number;
  name: string;
  course: string;
  profile_photo?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  listing_count: number;
}

export type ListingStatus = 'available' | 'reserved' | 'sold';
export type ListingCondition = 'new' | 'good' | 'used';

export interface Listing {
  id: number;
  title: string;
  description?: string;
  price: string;
  condition: ListingCondition;
  status: ListingStatus;
  image: string;
  image_url?: string | null;
  is_sold: boolean;
  is_saved?: boolean;
  is_deleted?: boolean;
  created_at: string;
  seller: User;
  category_name?: string;
  category?: Category;
}

export interface Message {
  id: number;
  listing: number;
  listing_title: string;
  sender: User;
  recipient: User;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface Conversation {
  listing: Listing;
  other_user: User;
  last_message: Message;
  unread_count: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  password2: string;
  name?: string;
  course?: string;
}

export interface AuthResponse {
  user: User;
  tokens: {
    access: string;
    refresh: string;
  };
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

// Form Types
export interface CreateListingData {
  title: string;
  description?: string;
  price: string;
  condition: ListingCondition;
  category_id: number;
  image: File;
}

export interface UpdateProfileData {
  name?: string;
  course?: string;
  profile_photo?: File;
}

export interface SavedListing {
  id: number;
  listing: Listing;
  created_at: string;
}
