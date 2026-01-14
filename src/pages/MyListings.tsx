import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, MoreVertical, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { listingsAPI } from '@/services/api';
import type { Listing } from '@/types';
import Loading from '@/components/Loading';
import BottomNav from '@/components/BottomNav';
import { formatPrice, getStatusLabel, getConditionLabel } from '@/utils/helpers';
import toast from 'react-hot-toast';

export default function MyListings() {
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    loadMyListings();
  }, []);

  const loadMyListings = async () => {
    try {
      setIsLoading(true);
      const data = await listingsAPI.myListings();
      setListings(data.results || data);
    } catch (error: any) {
      toast.error('Failed to load listings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (listing: Listing, newStatus: 'available' | 'reserved' | 'sold') => {
    try {
      if (newStatus === 'available') {
        await listingsAPI.markAvailable(listing.id);
      } else if (newStatus === 'reserved') {
        await listingsAPI.markReserved(listing.id);
      } else if (newStatus === 'sold') {
        await listingsAPI.markSold(listing.id);
      }
      toast.success(`Listing marked as ${newStatus}`);
      setShowMenu(false);
      setSelectedListing(null);
      await loadMyListings();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!selectedListing) return;

    try {
      await listingsAPI.delete(selectedListing.id);
      toast.success('Listing deleted');
      setShowDeleteConfirm(false);
      setShowMenu(false);
      setSelectedListing(null);
      await loadMyListings();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to delete listing');
    }
  };

  const activeListings = listings.filter(l => !l.is_deleted && l.status === 'available');
  const soldListings = listings.filter(l => !l.is_deleted && l.status === 'sold');
  const inactiveListings = listings.filter(l => l.is_deleted);

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 z-20">
        <div className="w-full max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/profile" className="touch-target -ml-2">
                <ArrowLeft size={24} className="text-gray-900" />
              </Link>
              <h1 className="text-xl font-bold text-gray-900">My Listings</h1>
            </div>
            <Link to="/create" className="touch-target -mr-2">
              <Plus size={24} className="text-gray-900" />
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md mx-auto px-4 py-6">
        {isLoading ? (
          <Loading />
        ) : listings.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Plus size={32} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Listings Yet</h2>
            <p className="text-gray-500 mb-6">
              Create your first listing to start selling
            </p>
            <Link
              to="/create"
              className="inline-block px-6 py-3 bg-primary text-white font-semibold rounded-xl"
            >
              Create Listing
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Active Listings */}
            {activeListings.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  Active ({activeListings.length})
                </h2>
                <div className="space-y-3">
                  {activeListings.map((listing) => (
                    <ListingItem
                      key={listing.id}
                      listing={listing}
                      onMenuClick={() => {
                        setSelectedListing(listing);
                        setShowMenu(true);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sold Listings */}
            {soldListings.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  Sold ({soldListings.length})
                </h2>
                <div className="space-y-3">
                  {soldListings.map((listing) => (
                    <ListingItem
                      key={listing.id}
                      listing={listing}
                      onMenuClick={() => {
                        setSelectedListing(listing);
                        setShowMenu(true);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Inactive Listings */}
            {inactiveListings.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  Inactive ({inactiveListings.length})
                </h2>
                <div className="space-y-3">
                  {inactiveListings.map((listing) => (
                    <ListingItem
                      key={listing.id}
                      listing={listing}
                      onMenuClick={() => {
                        setSelectedListing(listing);
                        setShowMenu(true);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Menu Modal */}
      {showMenu && selectedListing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowMenu(false)}>
          <div className="bg-white w-full max-w-md mx-auto rounded-t-3xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Manage Listing</h2>
              
              <div className="space-y-2 mb-6">
                <button
                  onClick={() => navigate(`/listings/${selectedListing.id}`)}
                  className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-3"
                >
                  <Eye size={20} className="text-gray-700" />
                  <span className="text-gray-900">View Listing</span>
                </button>
                {!selectedListing.is_deleted && (
                  <>
                    <button
                      onClick={() => handleStatusChange(selectedListing, 'available')}
                      disabled={selectedListing.status === 'available'}
                      className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-3 disabled:opacity-50"
                    >
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-gray-900">Mark as Available</span>
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedListing, 'reserved')}
                      disabled={selectedListing.status === 'reserved'}
                      className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-3 disabled:opacity-50"
                    >
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <span className="text-gray-900">Mark as Reserved</span>
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedListing, 'sold')}
                      disabled={selectedListing.status === 'sold'}
                      className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-3 disabled:opacity-50"
                    >
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-gray-900">Mark as Sold</span>
                    </button>
                  </>
                )}
                <button
                  onClick={() => {
                    setShowMenu(false);
                    setShowDeleteConfirm(true);
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 transition-colors flex items-center gap-3"
                >
                  <Trash2 size={20} className="text-red-600" />
                  <span className="text-red-600">Delete Listing</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && selectedListing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-white rounded-3xl max-w-sm w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Listing</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{selectedListing.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-900 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 rounded-xl bg-red-600 text-white font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

// Listing Item Component
function ListingItem({ listing, onMenuClick }: { listing: Listing; onMenuClick: () => void }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="flex gap-3 p-3">
        <div className="w-20 h-20 rounded-xl bg-gray-50 flex-shrink-0 overflow-hidden">
          {listing.image ? (
            <img
              src={listing.image}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">
              📦
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-semibold text-gray-900 text-sm truncate pr-2">
              {listing.title}
            </h3>
            <button onClick={onMenuClick} className="touch-target -mr-2 -mt-1 flex-shrink-0">
              <MoreVertical size={18} className="text-gray-700" />
            </button>
          </div>
          <p className="text-sm font-bold text-primary mb-2">
            {formatPrice(listing.price)}
          </p>
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                listing.status === 'available'
                  ? 'bg-green-100 text-green-800'
                  : listing.status === 'reserved'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {getStatusLabel(listing.status)}
            </span>
            {listing.is_deleted && (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                Deleted
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
