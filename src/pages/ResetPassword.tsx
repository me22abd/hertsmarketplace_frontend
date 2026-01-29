import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { authAPI } from '@/services/api';
import toast from 'react-hot-toast';

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState((location.state as any)?.email || '');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // If no email in state, redirect to forgot password
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      toast.error('Please enter the reset code');
      return;
    }

    if (code.length !== 6 || !/^\d+$/.test(code)) {
      toast.error('Reset code must be 6 digits');
      return;
    }

    if (!password) {
      toast.error('Please enter your new password');
      return;
    }

    if (password !== password2) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    try {
      setIsLoading(true);
      const response = await authAPI.resetPassword(email, code, password, password2);
      
      if (response.success) {
        setSuccess(true);
        toast.success('Password reset successful!');
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login', { state: { message: 'Password reset successful. Please log in with your new password.' } });
        }, 2000);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.response?.data?.error || error.message || 'Failed to reset password';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-bg flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-md md:max-w-2xl lg:max-w-3xl mx-auto px-4 md:px-6 lg:px-8 py-4 flex items-center">
            <button onClick={() => navigate('/login')} className="touch-target -ml-2">
              <ArrowLeft size={24} className="text-text-primary" />
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-text-primary ml-4">Reset Password</h1>
          </div>
        </div>

        {/* Success Message */}
        <div className="flex-1 flex items-center justify-center py-8 md:py-12 lg:py-16">
          <div className="w-full max-w-md md:max-w-lg lg:max-w-xl mx-auto px-4 md:px-6 lg:px-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">Password Reset Successful!</h2>
            <p className="text-text-secondary mb-8 text-base md:text-lg">
              Your password has been reset successfully. Redirecting to login...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-md md:max-w-2xl lg:max-w-3xl mx-auto px-4 md:px-6 lg:px-8 py-4 flex items-center">
          <button onClick={() => navigate('/forgot-password')} className="touch-target -ml-2">
            <ArrowLeft size={24} className="text-text-primary" />
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-text-primary ml-4">Reset Password</h1>
        </div>
      </div>

      {/* Form Container */}
      <div className="flex-1 flex items-center justify-center py-8 md:py-12 lg:py-16">
        <div className="w-full max-w-md md:max-w-lg lg:max-w-xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <p className="text-text-secondary text-base md:text-lg">
              Enter the 6-digit code sent to <strong>{email}</strong> and your new password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
            {/* Email (read-only) */}
            <div>
              <label htmlFor="email" className="block text-sm md:text-base font-medium text-text-primary mb-2 md:mb-3">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                readOnly
                className="input text-base md:text-lg py-3 md:py-4 bg-gray-50 cursor-not-allowed"
              />
            </div>

            {/* Reset Code */}
            <div>
              <label htmlFor="code" className="block text-sm md:text-base font-medium text-text-primary mb-2 md:mb-3">
                Reset Code
              </label>
              <input
                type="text"
                id="code"
                name="code"
                value={code}
                onChange={(e) => {
                  // Only allow digits, max 6 characters
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setCode(value);
                }}
                placeholder="000000"
                className="input text-base md:text-lg py-3 md:py-4 text-center tracking-widest font-mono"
                maxLength={6}
                required
              />
              <p className="text-xs text-text-secondary mt-1">Enter the 6-digit code from your email</p>
            </div>

            {/* New Password */}
            <div>
              <label htmlFor="password" className="block text-sm md:text-base font-medium text-text-primary mb-2 md:mb-3">
                New Password
              </label>
              <div className="relative">
                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your new password"
                  className="input pl-12 pr-16 text-base md:text-lg py-3 md:py-4"
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
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-12 h-12 -mr-1 text-gray-700 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-all duration-200 cursor-pointer border-0 outline-none focus:outline-none focus:ring-2 focus:ring-primary/20 touch-manipulation"
                  style={{ minWidth: '48px', minHeight: '48px' }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={0}
                >
                  {showPassword ? (
                    <EyeOff size={24} strokeWidth={2.5} className="text-gray-700" />
                  ) : (
                    <Eye size={24} strokeWidth={2.5} className="text-gray-700" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="password2" className="block text-sm md:text-base font-medium text-text-primary mb-2 md:mb-3">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type={showPassword2 ? 'text' : 'password'}
                  id="password2"
                  name="password2"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  placeholder="Confirm your new password"
                  className="input pl-12 pr-16 text-base md:text-lg py-3 md:py-4"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowPassword2(!showPassword2);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-12 h-12 -mr-1 text-gray-700 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-all duration-200 cursor-pointer border-0 outline-none focus:outline-none focus:ring-2 focus:ring-primary/20 touch-manipulation"
                  style={{ minWidth: '48px', minHeight: '48px' }}
                  aria-label={showPassword2 ? 'Hide password' : 'Show password'}
                  tabIndex={0}
                >
                  {showPassword2 ? (
                    <EyeOff size={24} strokeWidth={2.5} className="text-gray-700" />
                  ) : (
                    <Eye size={24} strokeWidth={2.5} className="text-gray-700" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full mt-8 md:mt-10 py-3 md:py-4 text-base md:text-lg font-semibold"
            >
              {isLoading ? (
                <div className="spinner w-5 h-5 md:w-6 md:h-6"></div>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>

          {/* Back to login */}
          <p className="text-center text-text-secondary mt-6 md:mt-8 text-sm md:text-base">
            Remember your password?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
