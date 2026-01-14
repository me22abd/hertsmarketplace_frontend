import type { ListingCondition, ListingStatus } from '@/types';

// Format price to GBP
export const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return `£${numPrice.toFixed(2)}`;
};

// Format date to relative time
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

// Format date to full format
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

// Get status color class
export const getStatusColor = (status: ListingStatus): string => {
  switch (status) {
    case 'available':
      return 'status-available';
    case 'reserved':
      return 'status-reserved';
    case 'sold':
      return 'status-sold';
    default:
      return 'status-available';
  }
};

// Get status label
export const getStatusLabel = (status: ListingStatus): string => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

// Get condition label
export const getConditionLabel = (condition: ListingCondition): string => {
  return condition.charAt(0).toUpperCase() + condition.slice(1);
};

// Get condition color
export const getConditionColor = (condition: ListingCondition): string => {
  switch (condition) {
    case 'new':
      return 'text-green-600';
    case 'good':
      return 'text-blue-600';
    case 'used':
      return 'text-gray-600';
    default:
      return 'text-gray-600';
  }
};

// Validate email
export const isHertsEmail = (email: string): boolean => {
  return email.toLowerCase().endsWith('@herts.ac.uk');
};

// File size validation
export const validateImageSize = (file: File, maxSizeMB = 5): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

// File type validation
export const validateImageType = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  return validTypes.includes(file.type);
};

// Generate initials from name
export const getInitials = (name?: string | null): string => {
  if (!name) return 'U';
  
  return name
    .split(' ')
    .map(word => word[0])
    .filter(Boolean)
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';
};

// Truncate text
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Get error message from API error
export const getErrorMessage = (error: any): string => {
  if (error.response?.data) {
    const data = error.response.data;
    
    // Handle field-specific errors
    if (typeof data === 'object') {
      const firstError = Object.values(data)[0];
      if (Array.isArray(firstError)) {
        return firstError[0];
      }
      if (typeof firstError === 'string') {
        return firstError;
      }
    }
    
    // Handle detail message
    if (data.detail) {
      return data.detail;
    }
  }
  
  return error.message || 'An error occurred';
};
