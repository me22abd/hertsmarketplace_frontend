import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X, Camera } from 'lucide-react';
import { listingsAPI, categoriesAPI, authAPI } from '@/services/api';
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

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: 'good' as ListingCondition,
  });

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    loadCategories();
  }, []);

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
      const data = await categoriesAPI.list();
      setCategories(data.results || data);
    } catch (error) {
      toast.error('Failed to load categories');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview('');
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

    try {
      setIsSubmitting(true);
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('category', formData.category);
      data.append('condition', formData.condition);
      if (image) {
        data.append('image', image);
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
            Photos *
          </label>
          {imagePreview ? (
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg"
              >
                <X size={18} className="text-gray-900" />
              </button>
            </div>
          ) : (
            <label className="block aspect-square rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
              <input
                type="file"
                accept="image/*"
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
                    Upload up to 1 image (max 5MB)
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
          </label>
          <SearchableSelect
            options={categories}
            value={formData.category}
            onChange={(value) => setFormData({ ...formData, category: value })}
            placeholder="Search or select a category..."
          />
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
