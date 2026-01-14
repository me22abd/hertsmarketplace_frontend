import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Mail, Lock } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/utils/helpers';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuthStore();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const from = (location.state as any)?.from?.pathname || '/home';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(formData);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
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
          <h1 className="text-xl md:text-2xl font-bold text-text-primary ml-4">Log In</h1>
        </div>
      </div>

      {/* Form Container - Responsive */}
      <div className="flex-1 flex items-center justify-center py-8 md:py-12 lg:py-16">
        <div className="w-full max-w-md md:max-w-lg lg:max-w-xl mx-auto px-4 md:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm md:text-base font-medium text-text-primary mb-2 md:mb-3">
                Email
              </label>
              <div className="relative">
                <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@herts.ac.uk"
                  className="input pl-12 text-base md:text-lg py-3 md:py-4"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm md:text-base font-medium text-text-primary mb-2 md:mb-3">
                Password
              </label>
              <div className="relative">
                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="input pl-12 text-base md:text-lg py-3 md:py-4"
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={isLoading} className="btn-primary w-full mt-8 md:mt-10 py-3 md:py-4 text-base md:text-lg font-semibold">
              {isLoading ? (
                <div className="spinner w-5 h-5 md:w-6 md:h-6"></div>
              ) : (
                'Log In'
              )}
            </button>
          </form>

          {/* Sign up link */}
          <p className="text-center text-text-secondary mt-6 md:mt-8 text-sm md:text-base">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
