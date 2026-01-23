import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, Star, ChevronRight, X, Check } from 'lucide-react';
import { listingsAPI, reviewsAPI } from '@/services/api';
import type { Listing } from '@/types';
import Loading from '@/components/Loading';
import { useAuthStore } from '@/store/authStore';
import {
  formatPrice,
  formatRelativeTime,
  getConditionLabel,
  getStatusLabel,
  getInitials,
} from '@/utils/helpers';
import toast from 'react-hot-toast';

interface Review {
  id: number;
  reviewer_name: string;
  reviewer_avatar?: string;
  rating: number;
  comment: string;
  is_verified_purchase: boolean;
  created_at: string;
}

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState('M');
  const [showReviews, setShowReviews] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewStats, setReviewStats] = useState<{
    total_reviews: number;
    average_rating: number;
  } | null>(null);
  const [imageError, setImageError] = useState(false);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  useEffect(() => {
    if (id) {
      loadListing();
    }
  }, [id]);

  useEffect(() => {
    if (listing?.seller?.id) {
      loadReviews();
    }
  }, [listing?.seller?.id]);

  const loadListing = async () => {
    try {
      setIsLoading(true);
      setImageError(false);
      const data = await listingsAPI.get(Number(id));
      setListing(data);
      setIsSaved(data.is_saved || false);
    } catch (error: any) {
      toast.error('Failed to load listing');
      navigate('/home');
    } finally {
      setIsLoading(false);
    }
  };

  const loadReviews = async () => {
    if (!listing?.seller?.id) return;
    
    try {
      setIsLoadingReviews(true);
      const [reviewsData, statsData] = await Promise.all([
        reviewsAPI.list(listing.seller.id, listing.id),
        reviewsAPI.sellerStats(listing.seller.id),
      ]);
      
      // Handle paginated or direct array response
      const reviewsList = reviewsData.results || (Array.isArray(reviewsData) ? reviewsData : []);
      setReviews(reviewsList);
      setReviewStats(statsData);
    } catch (error: any) {
      console.error('Failed to load reviews:', error);
      // Don't show error toast - reviews are optional
      setReviews([]);
      setReviewStats({ total_reviews: 0, average_rating: 0 });
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const handleSaveToggle = async () => {
    try {
      if (isSaved) {
        await listingsAPI.unsave(Number(id));
        setIsSaved(false);
        toast.success('Removed from saved');
      } else {
        await listingsAPI.save(Number(id));
        setIsSaved(true);
        toast.success('Saved to favourites');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update');
    }
  };

  const handleContactSeller = () => {
    if (!listing) return;
    navigate('/messages', { state: { listing } });
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!listing) {
    return null;
  }

  const isOwner = user?.id === listing.seller.id;
  const averageRating = reviewStats?.average_rating || 0;
  const totalReviews = reviewStats?.total_reviews || 0;

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white z-20 border-b border-gray-100">
        <div className="w-full max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="touch-target -ml-2">
            <ArrowLeft size={24} className="text-gray-900" />
          </button>
          <button onClick={handleSaveToggle} className="touch-target -mr-2">
            <Heart
              size={24}
              className={isSaved ? 'text-primary fill-primary' : 'text-gray-900'}
            />
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="w-full max-w-md mx-auto">
        <div className="relative aspect-square bg-gray-50">
          {listing.image && !imageError ? (
            <img
              src={listing.image}
              alt={listing.title}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl bg-gray-100">
              📦
            </div>
          )}
          <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded-md">
            1/1
          </div>
        </div>

        {/* Price and Title */}
        <div className="px-4 pt-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{listing.title}</h1>
              {totalReviews > 0 && (
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < Math.floor(averageRating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">{averageRating.toFixed(1)}</span>
                  <button
                    onClick={() => setShowReviews(true)}
                    className="text-sm text-gray-500 underline"
                  >
                    ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
                  </button>
                </div>
              )}
            </div>
            <span className="text-2xl font-bold text-primary">
              {formatPrice(listing.price)}
            </span>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                listing.status === 'available'
                  ? 'bg-green-100 text-green-800'
                  : listing.status === 'reserved'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {getStatusLabel(listing.status)}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
              {getConditionLabel(listing.condition)}
            </span>
          </div>

          {/* Size Selector */}
          {listing.category?.name === 'Fashion' && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-900">Select size</span>
                <button
                  onClick={() => setShowSizeModal(true)}
                  className="text-xs text-gray-500 underline"
                >
                  Size guide
                </button>
              </div>
              <div className="flex gap-2">
                {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                      selectedSize === size
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-base font-bold text-gray-900 mb-2">Description</h2>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
              {listing.description}
            </p>
          </div>

          {/* Details */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Category</span>
              <span className="text-sm font-medium text-gray-900">
                {listing.category?.name || listing.category_name || 'Other'}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Condition</span>
              <span className="text-sm font-medium text-gray-900">
                {getConditionLabel(listing.condition)}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">Listed</span>
              <span className="text-sm font-medium text-gray-900">
                {formatRelativeTime(listing.created_at)}
              </span>
            </div>
          </div>

          {/* Seller Info */}
          {!isOwner && listing.seller?.profile && (
            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                  {getInitials(listing.seller.profile.name)}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-gray-900">
                    {listing.seller.profile.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {listing.seller.profile.course || 'University of Hertfordshire'}
                  </p>
                </div>
                <button className="px-4 py-2 bg-white rounded-xl text-sm font-medium text-gray-900 border border-gray-200">
                  View profile
                </button>
              </div>
            </div>
          )}

          {/* Reviews Section */}
          {totalReviews > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-gray-900">Reviews</h2>
                {totalReviews > 2 && (
                  <button
                    onClick={() => setShowReviews(true)}
                    className="text-sm text-gray-500 flex items-center gap-1"
                  >
                    See all
                    <ChevronRight size={16} />
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {reviews.slice(0, 2).map((review) => (
                  <div key={review.id} className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">
                            {review.reviewer_name}
                          </span>
                          {review.is_verified_purchase && (
                            <Check size={14} className="text-primary" />
                          )}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className={i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatRelativeTime(review.created_at)}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-gray-600">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      {!isOwner && listing.status === 'available' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-20">
          <div className="w-full max-w-md mx-auto px-4 py-3">
            <button
              onClick={handleContactSeller}
              className="w-full bg-primary text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2"
            >
              <MessageCircle size={20} />
              Contact Seller
            </button>
          </div>
        </div>
      )}

      {isOwner && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-20">
          <div className="w-full max-w-md mx-auto px-4 py-3">
            <Link
              to={`/my-listings`}
              className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl flex items-center justify-center"
            >
              Manage Listing
            </Link>
          </div>
        </div>
      )}

      {/* Size Guide Modal */}
      {showSizeModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowSizeModal(false)}>
          <div className="bg-white w-full max-w-md mx-auto rounded-t-3xl max-h-[70vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Size Guide</h2>
                <button onClick={() => setShowSizeModal(false)} className="touch-target -mr-2">
                  <X size={24} className="text-gray-900" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 font-semibold text-gray-900">Size</th>
                    <th className="text-left py-2 font-semibold text-gray-900">UK</th>
                    <th className="text-left py-2 font-semibold text-gray-900">US</th>
                    <th className="text-left py-2 font-semibold text-gray-900">EU</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { size: 'XS', uk: '6', us: '2', eu: '34' },
                    { size: 'S', uk: '8-10', us: '4-6', eu: '36-38' },
                    { size: 'M', uk: '12', us: '8', eu: '40' },
                    { size: 'L', uk: '14', us: '10', eu: '42' },
                    { size: 'XL', uk: '16', us: '12', eu: '44' },
                  ].map((row) => (
                    <tr key={row.size} className="border-b border-gray-100">
                      <td className="py-2 text-gray-900">{row.size}</td>
                      <td className="py-2 text-gray-600">{row.uk}</td>
                      <td className="py-2 text-gray-600">{row.us}</td>
                      <td className="py-2 text-gray-600">{row.eu}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Modal */}
      {showReviews && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowReviews(false)}>
          <div className="bg-white w-full max-w-md mx-auto rounded-t-3xl max-h-[85vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Reviews</h2>
                <button onClick={() => setShowReviews(false)} className="touch-target -mr-2">
                  <X size={24} className="text-gray-900" />
                </button>
              </div>
            </div>
            <div className="p-4">
              {/* Rating Summary */}
              <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-1">{averageRating}</div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < Math.floor(averageRating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">Based on 2 reviews</p>
                </div>
              </div>

              {/* All Reviews */}
              <div className="space-y-3">
                {MOCK_REVIEWS.map((review) => (
                  <div key={review.id} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">
                            {review.author}
                          </span>
                          {review.verified && (
                            <Check size={14} className="text-primary" />
                          )}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className={i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{review.date}</span>
                    </div>
                    <p className="text-sm text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
