import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { authAPI } from '@/services/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loadUser } = useAuthStore();
  
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState('');
  const redirectTo = (location.state as any)?.redirectTo || '/home';

  // Get email from location state or user
  useEffect(() => {
    const emailFromState = location.state?.email;
    if (emailFromState) {
      setEmail(emailFromState);
    } else if (user?.email) {
      setEmail(user.email);
    } else {
      // If no email, redirect to login
      navigate('/login');
    }
  }, [location.state, user, navigate]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode.trim()) {
      toast.error('Please enter the 6-digit verification code');
      return;
    }

    if (!verificationCode.match(/^\d{6}$/)) {
      toast.error('Verification code must be exactly 6 digits');
      return;
    }

    if (!email) {
      toast.error('No email address found');
      return;
    }

    try {
      setIsVerifying(true);
      const response = await authAPI.verifyEmail(email, verificationCode);
      toast.success(response.message || 'Email verified successfully!');
      await loadUser(); // Refresh user data
      // Redirect back to the intended page (e.g. create listing)
      setTimeout(() => {
        navigate(redirectTo, { replace: true });
      }, 1000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.response?.data?.error || 'Verification failed';
      toast.error(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setIsResending(true);
      const response = await authAPI.sendVerificationEmail();
      toast.success(response.message || 'Verification code sent! Please check your email.');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || error.response?.data?.error || 'Failed to send verification code');
    } finally {
      setIsResending(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setVerificationCode(value);
  };

  // Auto-submit when 6 digits are entered
  useEffect(() => {
    if (verificationCode.length === 6) {
      const timer = setTimeout(() => {
        handleVerify(new Event('submit') as any);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [verificationCode]);

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-md md:max-w-2xl lg:max-w-3xl mx-auto px-4 md:px-6 lg:px-8 py-4 flex items-center">
          <Link to="/login" className="touch-target -ml-2">
            <ArrowLeft size={24} className="text-text-primary" />
          </Link>
          <h1 className="text-xl md:text-2xl font-bold text-text-primary ml-4">Verify Your Email</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center py-8 md:py-12 lg:py-16">
        <div className="w-full max-w-md mx-auto px-4 md:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <Mail size={40} className="text-primary" />
              </div>
            </div>

            {/* Title */}
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
                Check Your Email
              </h2>
              <p className="text-text-secondary text-sm md:text-base">
                We've sent a 6-digit verification code to
              </p>
              <p className="text-primary font-semibold mt-1">{email}</p>
            </div>

            {/* Code Input Form */}
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-text-primary mb-2">
                  Enter Verification Code
                </label>
                <input
                  type="text"
                  id="code"
                  value={verificationCode}
                  onChange={handleCodeChange}
                  placeholder="000000"
                  maxLength={6}
                  autoFocus
                  className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 text-center text-3xl font-bold tracking-widest transition-all"
                  disabled={isVerifying}
                />
                <p className="text-xs text-text-secondary mt-2 text-center">
                  Code expires in 10 minutes
                </p>
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={isVerifying || verificationCode.length !== 6}
                className="btn-primary w-full py-3 md:py-4 text-base md:text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? (
                  <div className="flex items-center justify-center">
                    <div className="spinner w-5 h-5 mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  'Verify Email'
                )}
              </button>
            </form>

            {/* Resend Code */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-text-secondary text-center mb-3">
                Didn't receive the code?
              </p>
              <button
                onClick={handleResendCode}
                disabled={isResending}
                className="w-full py-2.5 text-primary font-semibold rounded-xl border-2 border-primary hover:bg-primary/5 transition-colors disabled:opacity-50"
              >
                {isResending ? 'Sending...' : 'Resend Code'}
              </button>
            </div>

            {/* Help Text */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start">
                <AlertCircle size={20} className="text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-sm text-amber-800">
                  <p className="font-semibold mb-1">Check your spam folder</p>
                  <p className="text-xs">
                    If you don't see the email, check your spam/junk folder. The code expires in 10 minutes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link to="/login" className="text-text-secondary text-sm hover:text-primary">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}