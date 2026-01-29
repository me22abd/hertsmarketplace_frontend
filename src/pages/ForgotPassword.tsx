import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { authAPI } from '@/services/api';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    try {
      setIsLoading(true);
      const response = await authAPI.requestPasswordReset(email);
      
      if (response.email_sent) {
        setEmailSent(true);
        toast.success('Password reset code sent! Check your email.');
      } else {
        toast.error(response.message || 'Failed to send reset code');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.response?.data?.error || error.message || 'Failed to send reset code';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-bg flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-md md:max-w-2xl lg:max-w-3xl mx-auto px-4 md:px-6 lg:px-8 py-4 flex items-center">
            <button onClick={() => navigate('/login')} className="touch-target -ml-2">
              <ArrowLeft size={24} className="text-text-primary" />
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-text-primary ml-4">Forgot Password</h1>
          </div>
        </div>

        {/* Success Message */}
        <div className="flex-1 flex items-center justify-center py-8 md:py-12 lg:py-16">
          <div className="w-full max-w-md md:max-w-lg lg:max-w-xl mx-auto px-4 md:px-6 lg:px-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">Check Your Email</h2>
            <p className="text-text-secondary mb-6 text-base md:text-lg">
              We've sent a 6-digit password reset code to <strong>{email}</strong>
            </p>
            <p className="text-sm md:text-base text-text-secondary mb-8">
              The code will expire in 10 minutes. Please check your inbox and spam folder.
            </p>
            <button
              onClick={() => navigate('/reset-password', { state: { email } })}
              className="btn-primary w-full py-3 md:py-4 text-base md:text-lg font-semibold"
            >
              Enter Reset Code
            </button>
            <p className="text-center text-text-secondary mt-6 text-sm md:text-base">
              Didn't receive the code?{' '}
              <button
                onClick={() => {
                  setEmailSent(false);
                  setEmail('');
                }}
                className="text-primary font-semibold hover:underline"
              >
                Try again
              </button>
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
          <Link to="/login" className="touch-target -ml-2">
            <ArrowLeft size={24} className="text-text-primary" />
          </Link>
          <h1 className="text-xl md:text-2xl font-bold text-text-primary ml-4">Forgot Password</h1>
        </div>
      </div>

      {/* Form Container */}
      <div className="flex-1 flex items-center justify-center py-8 md:py-12 lg:py-16">
        <div className="w-full max-w-md md:max-w-lg lg:max-w-xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <p className="text-text-secondary text-base md:text-lg">
              Enter your email address and we'll send you a code to reset your password.
            </p>
          </div>

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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="input pl-12 text-base md:text-lg py-3 md:py-4"
                  required
                />
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
                'Send Reset Code'
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
