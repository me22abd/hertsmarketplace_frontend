import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, User as UserIcon, BookOpen, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/utils/helpers';

export default function Register() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password2: '',
    name: '',
    course: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (formData.password !== formData.password2) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    try {
      await register(formData);
      toast.success('Account created successfully!');
      // Go straight to home – email verification is only required when creating listings
      navigate('/home', { replace: true });
    } catch (error: any) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-md md:max-w-2xl lg:max-w-3xl mx-auto px-4 md:px-6 lg:px-8 py-4 flex items-center">
          <Link to="/" className="touch-target -ml-2">
            <ArrowLeft size={24} className="text-text-primary" />
          </Link>
          <h1 className="text-xl md:text-2xl font-bold text-text-primary ml-4">Sign Up</h1>
        </div>
      </div>

      {/* Form Container - Responsive */}
      <div className="flex-1 flex items-center justify-center py-8 md:py-12 lg:py-16">
        <div className="w-full max-w-md md:max-w-lg lg:max-w-xl mx-auto px-4 md:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm md:text-base font-medium text-text-primary mb-2 md:mb-3">
                Email *
              </label>
              <div className="relative">
                <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="input pl-12 text-base md:text-lg py-3 md:py-4"
                  required
                />
              </div>
              <p className="text-xs md:text-sm text-text-secondary mt-1 md:mt-2">
                You can use any valid email address. We’ll send a code when you’re ready to start selling.
              </p>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm md:text-base font-medium text-text-primary mb-2 md:mb-3">
                Full Name
              </label>
              <div className="relative">
                <UserIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="input pl-12 text-base md:text-lg py-3 md:py-4"
                />
              </div>
            </div>

            {/* Course */}
            <div>
              <label htmlFor="course" className="block text-sm md:text-base font-medium text-text-primary mb-2 md:mb-3">
                Course
              </label>
              <div className="relative">
                <BookOpen size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="course"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  placeholder="Computer Science"
                  className="input pl-12 text-base md:text-lg py-3 md:py-4"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm md:text-base font-medium text-text-primary mb-2 md:mb-3">
                Password *
              </label>
              <div className="relative">
                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  className="input pl-12 pr-14 text-base md:text-lg py-3 md:py-4"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowPassword(!showPassword);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200 cursor-pointer border-0 outline-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={0}
                >
                  {showPassword ? (
                    <EyeOff size={22} strokeWidth={2.5} className="text-gray-600" />
                  ) : (
                    <Eye size={22} strokeWidth={2.5} className="text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="password2" className="block text-sm md:text-base font-medium text-text-primary mb-2 md:mb-3">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type={showPassword2 ? 'text' : 'password'}
                  id="password2"
                  name="password2"
                  value={formData.password2}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className="input pl-12 pr-14 text-base md:text-lg py-3 md:py-4"
                  required
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowPassword2(!showPassword2);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200 cursor-pointer border-0 outline-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                  aria-label={showPassword2 ? 'Hide password' : 'Show password'}
                  tabIndex={0}
                >
                  {showPassword2 ? (
                    <EyeOff size={22} strokeWidth={2.5} className="text-gray-600" />
                  ) : (
                    <Eye size={22} strokeWidth={2.5} className="text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={isLoading} className="btn-primary w-full mt-8 md:mt-10 py-3 md:py-4 text-base md:text-lg font-semibold">
              {isLoading ? (
                <div className="spinner w-5 h-5 md:w-6 md:h-6"></div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-text-secondary mt-6 md:mt-8 text-sm md:text-base">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
