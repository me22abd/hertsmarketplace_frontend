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
    <div className="min-h-screen bg-gray-50 pb-20 dark:bg-gray-950">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-gray-100 bg-white/95 backdrop-blur dark:border-gray-800 dark:bg-gray-950/95">
        <div className="w-full max-w-md mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="touch-target -ml-2">
            <ArrowLeft size={24} className="text-gray-900 dark:text-white" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Seller Profile</h1>
        </div>
      </div>

      <div className="w-full max-w-md mx-auto px-4 py-4 space-y-6">
        {/* Seller card */}
        <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-card dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white flex items-center justify-center font-semibold text-lg">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="truncate text-base font-bold text-gray-900 dark:text-white">{displayName}</h2>
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">
              {profile?.course || 'University of Hertfordshire'}
            </p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
              {stats?.total_listings ?? 0} listings
            </span>
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
              {stats?.sold_listings ?? 0} sold
            </span>
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
              {reviews.length} review{reviews.length === 1 ? '' : 's'}
            </span>
          </div>
        </div>

        {/* Active listings */}
        <section>
          <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">Active listings</h3>
          {active_listings.length === 0 ? (
            <p className="text-xs text-gray-500 dark:text-gray-400">No active listings from this seller.</p>
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
            <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">Recently sold</h3>
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
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Reviews</h3>
            <button
              type="button"
              disabled={!user || user.id === seller.id}
              onClick={() => setShowReviewModal(true)}
              className={`text-xs font-medium rounded-full border px-3 py-1 ${
                !user || user.id === seller.id
                  ? 'cursor-not-allowed border-gray-200 text-gray-400 dark:border-gray-700 dark:text-gray-500'
                  : 'cursor-pointer border-primary text-primary'
              }`}
            >
              {user && user.id !== seller.id ? 'Write a review' : 'Write a review (disabled)'}
            </button>
          </div>
          {reviews.length === 0 ? (
            <p className="text-xs text-gray-500 dark:text-gray-400">No reviews yet for this seller.</p>
          ) : (
            <div className="space-y-3">
              {reviews.slice(0, 3).map((review) => (
                <div key={review.id} className="rounded-2xl border border-gray-100 bg-white p-3 shadow-card dark:border-gray-800 dark:bg-gray-900">
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <p className="text-xs font-semibold text-gray-900 dark:text-white">
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
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">{review.comment}</p>
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
            className="max-h-[75vh] w-full max-w-md overflow-auto rounded-t-3xl bg-white dark:bg-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 border-b border-gray-100 bg-white px-4 py-4 dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Write a review</h2>
                <button
                  onClick={() => !isSubmittingReview && setShowReviewModal(false)}
                  className="touch-target -mr-2"
                  disabled={isSubmittingReview}
                >
                  <X size={22} className="text-gray-900 dark:text-white" />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
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
                <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                  Comment <span className="text-gray-400">(optional)</span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
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

