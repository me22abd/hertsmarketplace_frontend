import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, X } from 'lucide-react';
import { sellersAPI, reviewsAPI } from '@/services/api';
import type { Listing, User } from '@/types';
import Loading from '@/components/Loading';
import ListingCard from '@/components/ListingCard';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

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
  const { user } = useAuthStore();
  const [data, setData] = useState<SellerProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

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
            <button
              type="button"
              disabled={!user || user.id === seller.id}
              onClick={() => setShowReviewModal(true)}
              className={`text-xs font-medium rounded-full border px-3 py-1 ${
                !user || user.id === seller.id
                  ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                  : 'text-primary border-primary cursor-pointer'
              }`}
            >
              {user && user.id !== seller.id ? 'Write a review' : 'Write a review (disabled)'}
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

      {/* Write Review Modal */}
      {showReviewModal && user && user.id !== seller.id && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end"
          onClick={() => !isSubmittingReview && setShowReviewModal(false)}
        >
          <div
            className="bg-white w-full max-w-md mx-auto rounded-t-3xl max-h-[75vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Write a review</h2>
                <button
                  onClick={() => !isSubmittingReview && setShowReviewModal(false)}
                  className="touch-target -mr-2"
                  disabled={isSubmittingReview}
                >
                  <X size={22} className="text-gray-900" />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-2">
                  Share your experience with <span className="font-semibold">{displayName}</span>.
                </p>
                <div className="flex items-center gap-2">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const value = i + 1;
                    const active = (hoverRating ?? rating) >= value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onMouseEnter={() => setHoverRating(value)}
                        onMouseLeave={() => setHoverRating(null)}
                        onClick={() => setRating(value)}
                        className="p-1"
                      >
                        <Star
                          size={22}
                          className={active ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Comment <span className="text-gray-400">(optional)</span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary resize-none"
                  placeholder="Was the item as described? Was the meetup smooth? Would you recommend this seller?"
                />
              </div>

              <button
                type="button"
                disabled={isSubmittingReview}
                onClick={async () => {
                  if (!id) return;
                  try {
                    setIsSubmittingReview(true);
                    const payload = {
                      seller: Number(id),
                      rating,
                      comment: comment.trim(),
                    };
                    const created = await reviewsAPI.create(payload);
                    // Prepend new review into local state
                    setData((prev) =>
                      prev
                        ? {
                            ...prev,
                            reviews: [created, ...prev.reviews],
                          }
                        : prev
                    );
                    toast.success('Review submitted');
                    setShowReviewModal(false);
                    setComment('');
                  } catch (error: any) {
                    const message =
                      error?.response?.data?.detail ||
                      error?.response?.data?.non_field_errors?.[0] ||
                      error?.response?.data?.error ||
                      'Failed to submit review';
                    toast.error(typeof message === 'string' ? message : 'Failed to submit review');
                  } finally {
                    setIsSubmittingReview(false);
                  }
                }}
                className="w-full bg-primary text-white font-semibold py-3 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmittingReview ? 'Submitting…' : 'Submit review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

