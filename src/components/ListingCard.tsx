import { Heart, MessageCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import type { Listing } from '@/types';
import { useState } from 'react';
import { listingsAPI, streamAPI } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

interface Props {
  listing: Listing;
  onSaveToggle?: () => void;
}

export default function ListingCard({ listing, onSaveToggle }: Props) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isSaved, setIsSaved] = useState(listing.is_saved || false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isCreatingChannel, setIsCreatingChannel] = useState(false);

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

  const handleMessageSeller = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/login');
      return;
    }

    if (isCreatingChannel) return;

    try {
      setIsCreatingChannel(true);
      const response = await streamAPI.createChannel(listing.id);
      navigate(`/messages?channel=${response.channel_id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to start conversation');
    } finally {
      setIsCreatingChannel(false);
    }
  };

  // Reviews will come from backend when available
  // For now, don't show fake ratings

  return (
    <Link to={`/listing/${listing.id}`} className="block">
      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover dark:border-gray-800 dark:bg-gray-900">
        {/* Image */}
        <div className="relative aspect-square bg-gray-100 dark:bg-gray-800">
          {/* Prefer cloud image_url, fall back to image, then to placeholder */}
          {listing.image_url && !imageError ? (
            <img
              src={listing.image_url}
              alt={listing.title}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : listing.image && !imageError ? (
            <img
              src={listing.image}
              alt={listing.title}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              📦
            </div>
          )}
          
          {/* Action buttons */}
          <div className="absolute top-2 right-2 flex gap-2">
            {/* Message Seller button */}
            {user && listing.seller?.id !== user.id && (
              <button
                onClick={handleMessageSeller}
                disabled={isCreatingChannel}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-gray-700 shadow-sm backdrop-blur transition-all hover:scale-105 hover:bg-white dark:bg-gray-900/95 dark:text-gray-200 dark:hover:bg-gray-900"
                title="Message seller"
              >
                <MessageCircle size={16} />
              </button>
            )}
            {/* Save button */}
            <button
              onClick={handleSaveToggle}
              disabled={isLoading}
              className={`flex h-9 w-9 items-center justify-center rounded-full shadow-sm transition-all hover:scale-105 ${
                isSaved
                  ? 'bg-primary text-white'
                  : 'bg-white/95 text-gray-700 backdrop-blur hover:bg-white dark:bg-gray-900/95 dark:text-gray-200 dark:hover:bg-gray-900'
              }`}
            >
              <Heart size={16} className={isSaved ? 'fill-current' : ''} />
            </button>
          </div>

          {/* Status/Discount badge */}
          {listing.status === 'reserved' && (
            <div className="absolute left-2 top-2 rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-bold tracking-wide text-white">
              RESERVED
            </div>
          )}
          {listing.status === 'sold' && (
            <div className="absolute left-2 top-2 rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold tracking-wide text-white">
              SOLD
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3.5">
          {/* Rating - Removed fake ratings, will show real reviews when available from backend */}

          {/* Seller/Category */}
          {listing.seller?.profile?.name && (
            <p className="mb-1 truncate text-[11px] font-medium text-gray-500 dark:text-gray-400">
              {listing.seller.profile.name}
            </p>
          )}

          {/* Title */}
          <h3 className="mb-2 min-h-[2.5rem] truncate-2 text-sm font-semibold leading-tight text-gray-900 dark:text-white">
            {listing.title}
          </h3>
          
          {/* Price */}
          <div className="flex items-center gap-2">
            <p className="text-base font-bold text-gray-900 dark:text-white">£{listing.price}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
