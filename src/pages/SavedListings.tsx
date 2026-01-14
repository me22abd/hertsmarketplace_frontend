import { useEffect, useState } from 'react';
import { ArrowLeft, Heart, Grid3x3, List } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { savedListingsAPI } from '@/services/api';
import type { SavedListing } from '@/types';
import ListingCard from '@/components/ListingCard';
import Loading from '@/components/Loading';
import BottomNav from '@/components/BottomNav';
import toast from 'react-hot-toast';

export default function SavedListings() {
  const navigate = useNavigate();
  const [savedListings, setSavedListings] = useState<SavedListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadSavedListings();
  }, []);

  const loadSavedListings = async () => {
    try {
      setIsLoading(true);
      const data = await savedListingsAPI.list();
      setSavedListings(data);
    } catch (error: any) {
      toast.error('Failed to load saved listings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (listingId: number) => {
    try {
      await savedListingsAPI.remove(listingId);
      setSavedListings(prev => prev.filter(item => item.listing.id !== listingId));
      toast.success('Removed from saved');
    } catch (error: any) {
      toast.error('Failed to remove');
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 z-20">
        <div className="w-full max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/home" className="touch-target -ml-2">
                <ArrowLeft size={24} className="text-gray-900" />
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Saved Items</h1>
            </div>
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="touch-target -mr-2"
            >
              {viewMode === 'grid' ? (
                <Grid3x3 size={20} className="text-gray-700" />
              ) : (
                <List size={20} className="text-gray-700" />
              )}
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {savedListings.length} {savedListings.length === 1 ? 'item' : 'items'}
          </p>
        </div>
      </div>

      <div className="w-full max-w-md mx-auto px-4 pt-4">
        {isLoading ? (
          <Loading />
        ) : savedListings.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Heart size={32} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Saved Items Yet</h2>
            <p className="text-gray-500 mb-6">
              Start saving items you love by tapping the heart icon
            </p>
            <Link
              to="/home"
              className="inline-block px-6 py-3 bg-primary text-white font-semibold rounded-xl"
            >
              Browse Listings
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 pb-4">
            {savedListings.map((saved) => (
              <ListingCard
                key={saved.id}
                listing={saved.listing}
                onSaveToggle={loadSavedListings}
              />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
