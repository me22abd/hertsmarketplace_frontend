import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { listingsAPI } from '@/services/api';
import type { Listing } from '@/types';
import ListingCard from '@/components/ListingCard';
import Loading from '@/components/Loading';
import BottomNav from '@/components/BottomNav';
import toast from 'react-hot-toast';

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      setIsLoading(true);
      // Backend automatically filters to status='active' and is_deleted=false
      const data = await listingsAPI.list({ ordering: '-created_at' });
      setListings(data.results);
    } catch (error: any) {
      toast.error('Failed to load listings');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Minimal Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="w-full max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">Herts Marketplace</h1>
            <Link to="/search" className="touch-target">
              <Search size={22} className="text-gray-900" />
            </Link>
          </div>
        </div>
      </div>

      {/* Clean Grid Feed - Vinted style */}
      <div className="w-full max-w-md mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {listings.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-500 mb-4">No listings found</p>
            <Link
              to="/create"
              className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors"
            >
              Create First Listing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 pb-4">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} onSaveToggle={loadListings} />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
