import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Package, MessageCircle, LogOut, ChevronRight, Bell, Shield, HelpCircle, CheckCircle, AlertCircle, Edit2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { authAPI } from '@/services/api';
import BottomNav from '@/components/BottomNav';
import EditProfileModal from '@/components/EditProfileModal';
import { getInitials } from '@/utils/helpers';
import toast from 'react-hot-toast';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout, loadUser } = useAuthStore();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerificationInput, setShowVerificationInput] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleSendVerification = async () => {
    try {
      setIsVerifying(true);
      const response = await authAPI.sendVerificationEmail();
      toast.success(response.message || 'Verification code sent to your email!');
      setShowVerificationInput(true);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || error.response?.data?.error || 'Failed to send verification email');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!verificationCode.trim()) {
      toast.error('Please enter the 6-digit verification code');
      return;
    }

    if (!verificationCode.match(/^\d{6}$/)) {
      toast.error('Verification code must be exactly 6 digits');
      return;
    }

    if (!user?.email) {
      toast.error('No email address found');
      return;
    }

    try {
      setIsVerifying(true);
      const response = await authAPI.verifyEmail(user.email, verificationCode);
      toast.success(response.message || 'Email verified successfully!');
      setShowVerificationInput(false);
      setVerificationCode('');
      await loadUser(); // Refresh user data
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.response?.data?.error || 'Verification failed';
      toast.error(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="w-full max-w-md mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        </div>
      </div>

      <div className="w-full max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Email Verification Banner */}
        {!user.email_verified && (
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle size={24} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-bold text-amber-900 mb-1">Verify Your Email</h3>
                <p className="text-sm text-amber-800 mb-3">
                  Please verify your email to start selling items on HertsMarketplace.
                </p>
                {!showVerificationInput ? (
                  <button
                    onClick={handleSendVerification}
                    disabled={isVerifying}
                    className="w-full bg-amber-600 text-white font-semibold py-2.5 rounded-xl disabled:opacity-50"
                  >
                    {isVerifying ? 'Sending...' : 'Send Verification Email'}
                  </button>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-amber-700 bg-amber-100 p-2 rounded">
                      Check your email for the 6-digit verification code. It expires in 10 minutes.
                    </p>
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      className="w-full px-3 py-2 rounded-lg border border-amber-300 text-sm text-center text-lg tracking-widest"
                    />
                    <button
                      onClick={handleVerifyEmail}
                      disabled={isVerifying || verificationCode.length !== 6}
                      className="w-full bg-amber-600 text-white font-semibold py-2.5 rounded-xl disabled:opacity-50"
                    >
                      {isVerifying ? 'Verifying...' : 'Verify Email'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Verified Badge */}
        {user.email_verified && (
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-3">
            <div className="flex items-center gap-2">
              <CheckCircle size={20} className="text-green-600" />
              <p className="text-sm font-semibold text-green-900">Email Verified ✓</p>
            </div>
          </div>
        )}

        {/* User Info Card */}
        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-6">
            {user.profile?.profile_photo ? (
              <img
                src={user.profile.profile_photo}
                alt={user.profile.name}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center font-bold text-2xl">
                {getInitials(user.profile?.name)}
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{user.profile?.name || 'Student'}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
              {user.profile?.course && (
                <p className="text-xs text-gray-400 mt-1">{user.profile.course}</p>
              )}
            </div>
          </div>
          <button
            onClick={() => setShowEditProfile(true)}
            className="w-full bg-gray-900 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <Edit2 size={18} />
            Edit Profile
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 text-center">
            <Package size={24} className="text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">0</div>
            <div className="text-xs text-gray-500">Listings</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center">
            <Heart size={24} className="text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">0</div>
            <div className="text-xs text-gray-500">Saved</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center">
            <MessageCircle size={24} className="text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">0</div>
            <div className="text-xs text-gray-500">Messages</div>
          </div>
        </div>

        {/* My Activity */}
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">My Activity</h3>
          </div>
          <button
            onClick={() => navigate('/my-listings')}
            className="w-full px-4 py-4 flex items-center justify-between border-b border-gray-50 active:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Package size={20} className="text-primary" />
              </div>
              <span className="font-medium text-gray-900">My Listings</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
          <button
            onClick={() => navigate('/saved')}
            className="w-full px-4 py-4 flex items-center justify-between border-b border-gray-50 active:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart size={20} className="text-primary" />
              </div>
              <span className="font-medium text-gray-900">Saved Items</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
          <button
            onClick={() => navigate('/messages')}
            className="w-full px-4 py-4 flex items-center justify-between active:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageCircle size={20} className="text-primary" />
              </div>
              <span className="font-medium text-gray-900">Messages</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">Settings</h3>
          </div>
          <button className="w-full px-4 py-4 flex items-center justify-between border-b border-gray-50 active:bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Bell size={20} className="text-gray-700" />
              </div>
              <span className="font-medium text-gray-900">Notifications</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
          <button
            onClick={() => navigate('/privacy')}
            className="w-full px-4 py-4 flex items-center justify-between border-b border-gray-50 active:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Shield size={20} className="text-gray-700" />
              </div>
              <span className="font-medium text-gray-900">Privacy Policy</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
          <button
            onClick={() => navigate('/terms')}
            className="w-full px-4 py-4 flex items-center justify-between active:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <HelpCircle size={20} className="text-gray-700" />
              </div>
              <span className="font-medium text-gray-900">Terms of Service</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full bg-white text-red-600 font-semibold py-4 rounded-2xl border border-red-200 flex items-center justify-center gap-2"
        >
          <LogOut size={20} />
          Log Out
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowLogoutConfirm(false)}>
          <div className="bg-white rounded-3xl max-w-sm w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Log Out</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-900 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 rounded-xl bg-red-600 text-white font-semibold"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        onSuccess={loadUser}
      />

      <BottomNav />
    </div>
  );
}
