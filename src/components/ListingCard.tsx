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

  return (
    <Link to={`/listing/${listing.id}`} className="block">
      <div className="bg-white rounded-xl overflow-hidden">
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
            className={`absolute top-2 right-2 w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-md ${
              isSaved ? 'bg-primary text-white' : 'bg-white/90 text-gray-700 hover:bg-white'
            }`}
          >
            <Heart size={18} className={isSaved ? 'fill-current' : ''} />
          </button>
        </div>

        {/* Content - Minimal Vinted style */}
        <div className="p-3 space-y-1">
          {/* Price (bold, primary) */}
          <p className="text-lg font-bold text-gray-900">£{listing.price}</p>

          {/* Title */}
          <h3 className="font-medium text-sm text-gray-900 line-clamp-2 leading-tight min-h-[2.5rem]">
            {listing.title}
          </h3>

          {/* Condition */}
          <p className="text-xs text-gray-500 capitalize">
            {listing.condition}
          </p>
        </div>
      </div>
    </Link>
  );
}
