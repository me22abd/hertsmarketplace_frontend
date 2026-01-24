import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Search } from 'lucide-react';
import { premiumAPI } from '@/services/api';
import Loading from '@/components/Loading';
import BottomNav from '@/components/BottomNav';
import toast from 'react-hot-toast';

interface AlertItem {
  search_id: number;
  search_name: string;
  new_listings_count: number;
}

export default function Notifications() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        setIsLoading(true);
        const data = await premiumAPI.checkAlerts();
        setAlerts(data?.alerts || []);
      } catch (error: any) {
        console.error('Failed to load notifications', error);
        toast.error('Failed to load notifications');
      } finally {
        setIsLoading(false);
      }
    };

    loadAlerts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 z-20">
        <div className="w-full max-w-md mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="touch-target -ml-2"
          >
            <ArrowLeft size={24} className="text-gray-900" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Bell size={20} className="text-primary" />
            Notifications
          </h1>
        </div>
      </div>

      <div className="w-full max-w-md mx-auto px-4 py-6 space-y-4">
        {isLoading ? (
          <Loading />
        ) : alerts.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
              <Bell size={22} className="text-primary" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              You&apos;re all caught up
            </h2>
            <p className="text-sm text-gray-500 mb-3">
              When new listings match your saved searches, they&apos;ll show
              up here.
            </p>
            <button
              onClick={() => navigate('/search')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold"
            >
              <Search size={16} />
              Explore listings
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.search_id}
                className="bg-white rounded-2xl p-4 flex items-start gap-3 shadow-sm"
              >
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bell size={18} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {alert.search_name || 'New matches'}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {alert.new_listings_count} new listing
                    {alert.new_listings_count === 1 ? '' : 's'} match this
                    search.
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

