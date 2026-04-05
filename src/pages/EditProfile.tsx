import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Upload } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { profileAPI, premiumAPI } from '@/services/api';
import toast from 'react-hot-toast';

export default function EditProfile() {
  const navigate = useNavigate();
  const { user, loadUser } = useAuthStore();

  const [formData, setFormData] = useState({
    name: user?.profile?.name || '',
    course: user?.profile?.course || '',
  });
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>(
    user?.profile?.avatar || user?.profile?.profile_photo || ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.profile?.name || '',
        course: user.profile?.course || '',
      });
      setPhotoPreview(user.profile?.avatar || user.profile?.profile_photo || '');
    }
  }, [user]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        toast.error('Image must be less than 15MB');
        return;
      }
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      // 1) Upload avatar image to Supabase (if changed)
      if (profilePhoto) {
        await premiumAPI.uploadAvatar(undefined, profilePhoto);
      }

      // 2) Update basic profile fields (name, course)
      await profileAPI.update({
        name: formData.name,
        course: formData.course,
      });

      await loadUser();
      toast.success('Profile updated successfully!');
      navigate('/profile');
    } catch (error: any) {
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to update profile';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 z-20">
        <div className="w-full max-w-md mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/profile')}
            className="touch-target -ml-2"
          >
            <ArrowLeft size={24} className="text-gray-900" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Edit Profile</h1>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md mx-auto px-4 py-6 space-y-6"
      >
        {/* Profile Photo */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Profile Photo
          </label>
          <div className="flex items-center gap-4">
            <div className="relative">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Profile preview"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-bold">
                  {user.profile?.name?.charAt(0) || 'U'}
                </div>
              )}
              <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-dark">
                <Camera size={16} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
            </div>
            <div className="flex-1">
              <label className="block w-full cursor-pointer">
                <div className="flex items-center gap-2 text-primary text-sm font-medium">
                  <Upload size={16} />
                  <span>Upload Photo</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-500 mt-1">JPG, PNG, max 15MB</p>
            </div>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            placeholder="Your full name"
            className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-gray-200"
            maxLength={100}
          />
        </div>

        {/* Course */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Course
          </label>
          <input
            type="text"
            value={formData.course}
            onChange={(e) =>
              setFormData({ ...formData, course: e.target.value })
            }
            placeholder="e.g. Computer Science"
            className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-gray-200"
            maxLength={200}
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white font-bold py-3.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="w-full mt-3 py-3 rounded-xl border-2 border-gray-200 text-gray-900 font-semibold"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

