import { useState, useEffect } from 'react';
import { X, Camera, Upload } from 'lucide-react';
import { profileAPI } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditProfileModal({ isOpen, onClose, onSuccess }: EditProfileModalProps) {
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.profile?.name || '',
    course: user?.profile?.course || '',
  });
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>(user?.profile?.profile_photo || '');
  
  // Update preview when user changes or modal opens
  useEffect(() => {
    if (user?.profile?.profile_photo) {
      setPhotoPreview(user.profile.profile_photo);
    }
  }, [user?.profile?.profile_photo, isOpen]);

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
      const data = new FormData();
      if (formData.name) data.append('name', formData.name);
      if (formData.course) data.append('course', formData.course);
      if (profilePhoto) data.append('profile_photo', profilePhoto);

      const updatedProfile = await profileAPI.update(data as any);
      toast.success('Profile updated successfully!');
      
      // Update photo preview with the server response URL if available
      if (updatedProfile.profile_photo) {
        setPhotoPreview(updatedProfile.profile_photo);
      }
      
      // Clear the file input so the same file can be selected again if needed
      setProfilePhoto(null);
      
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={onClose}>
      <div
        className="bg-white w-full max-w-md mx-auto rounded-t-3xl max-h-[85vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
            <button onClick={onClose} className="touch-target -mr-2">
              <X size={24} className="text-gray-900" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-6">
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
                    {user?.profile?.name?.charAt(0) || 'U'}
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
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              placeholder="e.g. Computer Science"
              className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-gray-200"
              maxLength={200}
            />
          </div>

          {/* Submit Button */}
          <div className="sticky bottom-0 bg-white pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-900 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl bg-primary text-white font-semibold disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
