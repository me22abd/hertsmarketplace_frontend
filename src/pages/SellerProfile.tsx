import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { sellersAPI } from '@/services/api';
import type { Listing, User } from '@/types';
import Loading from '@/components/Loading';
import ListingCard from '@/components/ListingCard';

interface SellerProfileResponse {
  seller: User;
  profile: any;
  stats: {
    total_listings: number;
    active_listings: number;
    sold_listings: number;
    total_views: number;
    trust_score: string;
    positive_reviews: number;
    negative_reviews: number;
  };
  active_listings: Listing[];
  sold_listings: Listing[];
  reviews: any[];
}

export default function SellerProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<SellerProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        setIsLoading(true);
        const resp = await sellersAPI.getProfile(Number(id));
        setData(resp);
      } catch (error) {
        // If seller not found, go back
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  if (isLoading || !data) {
    return <Loading fullScreen />;
  }

  const { seller, profile, stats, active_listings, sold_listings, reviews } = data;

  const displayName = profile?.name || seller.email || 'Seller';
  const initials =
    profile?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() ||
    (seller.email ? seller.email[0].toUpperCase() : 'U');

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 z-20">
        <div className="w-full max-w-md mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="touch-target -ml-2">
            <ArrowLeft size={24} className="text-gray-900" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Seller Profile</h1>
        </div>
      </div>

      <div className="w-full max-w-md mx-auto px-4 py-4 space-y-6">
        {/* Seller card */}
        <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-lg">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-gray-900 truncate">{displayName}</h2>
            <p className="text-xs text-gray-500 truncate">
              {profile?.course || 'University of Hertfordshire'}
            </p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-gray-500">
                {stats?.total_listings ?? 0} listings • {stats?.sold_listings ?? 0} sold
              </span>
              <span className="text-xs text-gray-500">
                {reviews.length} review{reviews.length === 1 ? '' : 's'}
              </span>
            </div>
          </div>
        </div>

        {/* Active listings */}
        <section>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Active listings</h3>
          {active_listings.length === 0 ? (
            <p className="text-xs text-gray-500">No active listings from this seller.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {active_listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </section>

        {/* Sold listings (collapsed if empty) */}
        {sold_listings.length > 0 && (
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Recently sold</h3>
            <div className="grid grid-cols-2 gap-3">
              {sold_listings.slice(0, 4).map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </section>
        )}

        {/* Reviews preview */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-900">Reviews</h3>
            {/* Placeholder for "Write a review" button */}
            <button
              disabled
              className="text-xs text-gray-400 font-medium rounded-full border border-gray-200 px-3 py-1 cursor-not-allowed"
            >
              Write a review (coming soon)
            </button>
          </div>
          {reviews.length === 0 ? (
            <p className="text-xs text-gray-500">No reviews yet for this seller.</p>
          ) : (
            <div className="space-y-3">
              {reviews.slice(0, 3).map((review) => (
                <div key={review.id} className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <p className="text-xs font-semibold text-gray-900">
                        {review.reviewer_name}
                      </p>
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={`text-[10px] ${
                              i < review.rating ? 'text-amber-400' : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-xs text-gray-600 mt-1">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

