import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Listing } from '@/types';
import { useState } from 'react';
import { listingsAPI } from '@/services/api';
import toast from 'react-hot-toast';

interface Props {
  listing: Listing;
  onSaveToggle?: () => void;
}

export default function ListingCard({ listing, onSaveToggle }: Props) {
  const [isSaved, setIsSaved] = useState(listing.is_saved || false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    try {
      setIsLoading(true);
      if (isSaved) {
        await listingsAPI.unsave(listing.id);
        setIsSaved(false);
        toast.success('Removed from saved');
      } else {
        await listingsAPI.save(listing.id);
        setIsSaved(true);
        toast.success('Saved to favourites');
      }
      onSaveToggle?.();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update');
    } finally {
      setIsLoading(false);
    }
  };

  // Reviews will come from backend when available
  // For now, don't show fake ratings

  return (
    <Link to={`/listing/${listing.id}`} className="block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        {/* Image */}
        <div className="relative aspect-square bg-gray-100">
          {listing.image ? (
            <img
              src={listing.image}
              alt={listing.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              📦
            </div>
          )}
          
          {/* Save button */}
          <button
            onClick={handleSaveToggle}
            disabled={isLoading}
            className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm ${
              isSaved ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Heart size={16} className={isSaved ? 'fill-current' : ''} />
          </button>

          {/* Status/Discount badge */}
          {listing.status === 'reserved' && (
            <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
              RESERVED
            </div>
          )}
          {listing.status === 'sold' && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
              SOLD
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          {/* Rating - Removed fake ratings, will show real reviews when available from backend */}

          {/* Seller/Category */}
          {listing.seller?.profile?.name && (
            <p className="text-xs text-gray-500 mb-1 truncate">{listing.seller.profile.name}</p>
          )}

          {/* Title */}
          <h3 className="font-semibold text-sm text-gray-900 mb-1.5 truncate-2 leading-tight min-h-[2.5rem]">
            {listing.title}
          </h3>
          
          {/* Price */}
          <div className="flex items-center gap-2">
            <p className="text-base font-bold text-gray-900">£{listing.price}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
