import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X, Camera } from 'lucide-react';
import { listingsAPI, categoriesAPI, authAPI, aiAPI } from '@/services/api';
import type { Category, ListingCondition } from '@/types';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import SearchableSelect from '@/components/SearchableSelect';

const CONDITIONS: { value: ListingCondition; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'good', label: 'Good' },
  { value: 'used', label: 'Used' },
];

export default function CreateListing() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [detectedCategories, setDetectedCategories] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: 'good' as ListingCondition,
  });

  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const MAX_IMAGES = 15;

  useEffect(() => {
    loadCategories();
    // Load default category suggestions on mount (even without image)
    loadDefaultSuggestions();
  }, []);

  const loadDefaultSuggestions = async () => {
    try {
      // Call analyze-image without image to get default suggestions
      const result = await aiAPI.analyzeImage();
      console.log('[CreateListing] Default suggestions response:', result);
      
      if (result && result.category_suggestions && Array.isArray(result.category_suggestions) && result.category_suggestions.length > 0) {
        console.log('[CreateListing] Setting detected categories:', result.category_suggestions);
        setDetectedCategories(result.category_suggestions);
      } else {
        console.warn('[CreateListing] No category_suggestions in response:', result);
      }
    } catch (error: any) {
      // Log error details for debugging
      console.error('[CreateListing] Error loading default suggestions:', {
        error,
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status
      });
      // Don't show error to user - defaults are optional
    }
  };

  // If user is not verified, redirect them to the Verify Email flow
  useEffect(() => {
    const runVerificationRedirect = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      if (user.email_verified) {
        return; // Already verified – nothing to do
      }

      if (!user.email) {
        toast.error('Please add an email address to your profile before creating listings.');
        navigate('/profile');
        return;
      }

      try {
        // Automatically send verification code when user starts the sell flow
        await authAPI.sendVerificationEmail();
        toast.success('Please verify your email to start selling. A 6-digit code has been sent.');
      } catch (error: any) {
        // Even if sending fails, still route them to the verify screen so they can retry
        const message =
          error?.response?.data?.detail ||
          error?.response?.data?.error ||
          'Could not send verification code. You can try resending on the next screen.';
        toast.error(message);
      } finally {
        navigate('/verify-email', {
          state: {
            email: user.email,
            redirectTo: '/create',
          },
          replace: true,
        });
      }
    };

    if (user && !user.email_verified) {
      runVerificationRedirect();
    }
  }, [user, navigate]);

  const loadCategories = async () => {
    try {
      console.log('[CreateListing] Loading categories...');
      const response = await categoriesAPI.list();
      console.log('[CreateListing] Categories API response:', JSON.stringify(response, null, 2));
      
      // Handle paginated response or direct array
      let categoriesList: Category[] = [];
      
      if (response && typeof response === 'object') {
        if (Array.isArray(response.results)) {
          categoriesList = response.results;
        } else if (Array.isArray(response)) {
          categoriesList = response;
        } else if (response.results && Array.isArray(response.results)) {
          categoriesList = response.results;
        }
      }
      
      console.log('[CreateListing] Parsed categories list:', categoriesList);
      console.log('[CreateListing] Categories count:', categoriesList.length);
      
      if (categoriesList.length === 0) {
        console.error('[CreateListing] No categories returned from API. Full response:', JSON.stringify(response, null, 2));
        console.error('[CreateListing] Response type:', typeof response);
        console.error('[CreateListing] Response keys:', response ? Object.keys(response) : 'null');
        
        // Try to load default categories as fallback
        const defaultCategories: Category[] = [
          { id: 1, name: 'Electronics', slug: 'electronics', icon: '💻', listing_count: 0 },
          { id: 2, name: 'Books', slug: 'books', icon: '📚', listing_count: 0 },
          { id: 3, name: 'Fashion', slug: 'fashion', icon: '👕', listing_count: 0 },
          { id: 4, name: 'Furniture', slug: 'furniture', icon: '🛋️', listing_count: 0 },
          { id: 5, name: 'Kitchen', slug: 'kitchen', icon: '🍴', listing_count: 0 },
          { id: 6, name: 'Sports', slug: 'sports', icon: '⚽', listing_count: 0 },
          { id: 7, name: 'Stationery', slug: 'stationery', icon: '📝', listing_count: 0 },
          { id: 8, name: 'Other', slug: 'other', icon: '📦', listing_count: 0 },
        ];
        
        console.warn('[CreateListing] Using fallback default categories');
        setCategories(defaultCategories);
        toast.error('Could not load categories from server. Using default categories.');
      } else {
        console.log(`[CreateListing] Successfully loaded ${categoriesList.length} categories`);
        setCategories(categoriesList);
      }
    } catch (error: any) {
      console.error('[CreateListing] Category loading error:', {
        error,
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
        isNetworkError: error?.isNetworkError,
        isTimeout: error?.isTimeout,
        stack: error?.stack
      });
      
      // Use fallback categories on error
      const defaultCategories: Category[] = [
        { id: 1, name: 'Electronics', slug: 'electronics', icon: '💻', listing_count: 0 },
        { id: 2, name: 'Books', slug: 'books', icon: '📚', listing_count: 0 },
        { id: 3, name: 'Fashion', slug: 'fashion', icon: '👕', listing_count: 0 },
        { id: 4, name: 'Furniture', slug: 'furniture', icon: '🛋️', listing_count: 0 },
        { id: 5, name: 'Kitchen', slug: 'kitchen', icon: '🍴', listing_count: 0 },
        { id: 6, name: 'Sports', slug: 'sports', icon: '⚽', listing_count: 0 },
        { id: 7, name: 'Stationery', slug: 'stationery', icon: '📝', listing_count: 0 },
        { id: 8, name: 'Other', slug: 'other', icon: '📦', listing_count: 0 },
      ];
      
      setCategories(defaultCategories);
      
      const errorMessage = error?.response?.data?.detail || error?.message || 'Failed to load categories';
      
      // Don't show toast for network errors that might be temporary
      if (!error?.isNetworkError && !error?.isTimeout) {
        toast.error(`Failed to load categories: ${errorMessage}. Using default categories.`);
      } else {
        console.warn('[CreateListing] Network error loading categories, using fallback');
        toast.error('Network error loading categories. Using default categories.');
      }
    }
  };

  const analyzeImage = async (imageFile: File) => {
    try {
      setIsAnalyzing(true);
      console.log('[CreateListing] Analyzing image:', imageFile.name, imageFile.size);
      
      const result = await aiAPI.analyzeImage(imageFile);
      console.log('[CreateListing] AI analysis result:', result);
      
      // Always set categories (even if empty, defaults will be shown)
      const suggestions = result?.category_suggestions || [];
      console.log('[CreateListing] Setting detected categories from analysis:', suggestions);
      setDetectedCategories(suggestions);
      
      // Store AI-detected tags in localStorage for category prioritization
      if (result.tags && Array.isArray(result.tags) && result.tags.length > 0) {
        localStorage.setItem('ai_detected_tags', result.tags.join(','));
      }
      
      setIsAnalyzing(false);
      
      // Only show success if we got actual AI results (not just defaults)
      // Check if description indicates it's a real AI result vs defaults
      const isRealAIResult = result.description && 
        !result.description.includes('No image provided') &&
        !result.description.includes('validation failed') &&
        !result.description.includes('AI analysis failed') &&
        !result.description.includes('temporarily unavailable');
      
      if (suggestions.length > 0 && isRealAIResult) {
        toast.success(`Detected ${suggestions.length} potential categor${suggestions.length > 1 ? 'ies' : 'y'}`);
      }
    } catch (error: any) {
      console.error('[CreateListing] Image analysis error:', {
        error,
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status
      });
      setIsAnalyzing(false);
      // Don't show error toast - endpoint now always returns 200 with defaults
      // Categories will still be available from defaults
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check total images won't exceed limit
    if (images.length + files.length > MAX_IMAGES) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed. You can add ${MAX_IMAGES - images.length} more.`);
      return;
    }

    const newImages: { file: File; preview: string }[] = [];

    files.forEach((file) => {
      if (file.size > 15 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum 15MB per image.`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = { file, preview: reader.result as string };
        newImages.push(imageData);
        
        // When all images are loaded, update state
        if (newImages.length === files.length) {
          setImages([...images, ...newImages]);
          
          // Analyze first image if it's the first one
          if (images.length === 0 && newImages.length > 0) {
            analyzeImage(newImages[0].file);
          }
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    
    // Reset detected categories if removing first image
    if (index === 0 && newImages.length > 0) {
      analyzeImage(newImages[0].file);
    } else if (newImages.length === 0) {
      setDetectedCategories([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Please enter a valid price');
      return;
    }
    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }

    if (images.length === 0) {
      toast.error('Please add at least one image');
      return;
    }

    try {
      setIsSubmitting(true);
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('category', formData.category);
      data.append('condition', formData.condition);
      
      // Add primary image
      if (images[0]) {
        data.append('image', images[0].file);
      }
      
      // Add additional images (up to 14 more)
      for (let i = 1; i < images.length && i < MAX_IMAGES; i++) {
        data.append(`additional_images_${i - 1}`, images[i].file);
      }

      await listingsAPI.create(data);
      toast.success('Listing created successfully!');
      navigate('/my-listings');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to create listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  // While we redirect unverified users, render nothing here
  if (!user?.email_verified) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 z-20">
        <div className="w-full max-w-md mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="touch-target -ml-2">
              <ArrowLeft size={24} className="text-gray-900" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Create Listing</h1>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Photos * {images.length > 0 && `(${images.length}/${MAX_IMAGES})`}
          </label>
          
          {images.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {images.map((img, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-gray-50">
                  <img
                    src={img.preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg"
                  >
                    <X size={16} className="text-gray-900" />
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                      Primary
                    </div>
                  )}
                </div>
              ))}
              
              {images.length < MAX_IMAGES && (
                <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors flex items-center justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Camera size={24} className="text-gray-400" />
                </label>
              )}
            </div>
          ) : (
            <label className="block aspect-square rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
              <div className="h-full flex flex-col items-center justify-center gap-3">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                  <Camera size={32} className="text-gray-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    Add photos
                  </p>
                  <p className="text-xs text-gray-500">
                    Upload up to {MAX_IMAGES} images (max 15MB each)
                  </p>
                </div>
              </div>
            </label>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. iPhone 13 Pro - Excellent Condition"
            className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-gray-200"
            maxLength={100}
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.title.length}/100
          </p>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Category *
            {isAnalyzing && (
              <span className="ml-2 text-xs text-primary font-normal">
                (Analyzing image...)
              </span>
            )}
          </label>
          <SearchableSelect
            options={categories}
            value={formData.category}
            onChange={(value) => setFormData({ ...formData, category: value })}
            placeholder={categories.length === 0 ? "Loading categories..." : "Search or select a category..."}
            detectedCategories={detectedCategories}
            allowCustom={true}
          />
          {categories.length === 0 && (
            <p className="text-xs text-yellow-600 mt-1">
              ⚠️ Categories are loading. If this persists, please refresh the page or contact support.
            </p>
          )}
          {detectedCategories.length > 0 && !formData.category && categories.length > 0 && (
            <p className="text-xs text-primary mt-1">
              💡 Detected: {detectedCategories.join(', ')} - Click to select or type your own
            </p>
          )}
        </div>

        {/* Condition */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Condition *
          </label>
          <div className="grid grid-cols-2 gap-2">
            {CONDITIONS.map((condition) => (
              <button
                key={condition.value}
                type="button"
                onClick={() => setFormData({ ...formData, condition: condition.value })}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  formData.condition === condition.value
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {condition.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Price *
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
              £
            </span>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full pl-8 pr-4 py-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-gray-200"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe your item..."
            rows={5}
            className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-gray-200 resize-none"
            maxLength={1000}
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.description.length}/1000
          </p>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white font-bold py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Create Listing'}
          </button>
          <p className="text-xs text-gray-500 text-center mt-3">
            By creating a listing, you agree to our Terms of Service
          </p>
        </div>
      </form>
    </div>
  );
}
