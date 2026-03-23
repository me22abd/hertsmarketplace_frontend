import { useEffect, useState } from 'react';
import { Search, MapPin, SlidersHorizontal, Grid3x3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { categoriesAPI, listingsAPI, premiumAPI } from '@/services/api';
import type { Category, Listing } from '@/types';
import ListingCard from '@/components/ListingCard';
import Loading from '@/components/Loading';
import BottomNav from '@/components/BottomNav';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

function NewListingImage({ listing }: { listing: Listing }) {
  const [imageError, setImageError] = useState(false);

  const src = (listing.image_url as string) || listing.image;

  if (src && !imageError) {
    return (
      <img
        src={src}
        alt={listing.title}
        className="w-full h-full object-cover"
        loading="lazy"
        onError={() => setImageError(true)}
      />
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center text-4xl">
      📦
    </div>
  );
}

export default function Home() {
  const { user } = useAuthStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadData();
    loadRecentlyViewed();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [categoriesData, listingsData] = await Promise.all([
        categoriesAPI.list(),
        listingsAPI.list({ ordering: '-created_at' }),
      ]);
      // Handle paginated or direct array response
      setCategories(Array.isArray(categoriesData) ? categoriesData : (categoriesData?.results || []));
      setListings(Array.isArray(listingsData) ? listingsData : (listingsData?.results || []));
    } catch (error: any) {
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const loadRecentlyViewed = async () => {
    try {
      // Try backend first (synced, up to last 20)
      const data: any = await premiumAPI.getRecentlyViewed();
      const rawItems = Array.isArray(data?.results) ? data.results : data;
      if (Array.isArray(rawItems) && rawItems.length > 0) {
        const mapped = rawItems
          .map((item: any) => item.listing)
          .filter((l: any) => !!l);
        const byId: Record<number, Listing> = {};
        mapped.forEach((l: Listing) => {
          byId[l.id] = l;
        });
        setRecentlyViewed(Object.values(byId).slice(0, 20));
        return;
      }
    } catch (error) {
      console.warn('Failed to load recently viewed from backend, falling back to local', error);
    }

    // Fallback: local storage (for safety / offline)
    try {
      const STORAGE_KEY = 'recently_viewed_listings';
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const items = JSON.parse(raw);
      if (Array.isArray(items)) {
        // items are already minimal listing-like objects
        const byId: Record<number, Listing> = {};
        items.forEach((l: Listing) => {
          byId[l.id] = l;
        });
        setRecentlyViewed(Object.values(byId).slice(0, 20));
      }
    } catch (e) {
      console.warn('Failed to parse local recently viewed items', e);
    }
  };

  const handleCategoryClick = async (slug: string) => {
    try {
      // Get AI-detected tags from localStorage if available (from image analysis)
      const aiDetectedTags = localStorage.getItem('ai_detected_tags');
      const params: any = { category: slug, ordering: '-created_at' };
      
      // If we have AI-detected tags, pass them to prioritize matching items
      if (aiDetectedTags) {
        params.ai_detected = aiDetectedTags;
      }
      
      const data = await listingsAPI.list(params);
      setListings(data.results);
    } catch (error) {
      toast.error('Failed to filter listings');
    }
  };

  const clearFilter = async () => {
    try {
      const data = await listingsAPI.list({ ordering: '-created_at' });
      setListings(data.results);
    } catch (error) {
      toast.error('Failed to load listings');
    }
  };

  if (isLoading) {
    return <Loading fullScreen />;
  }

  const handleCategorySelect = async (slug: string) => {
    setSelectedCategory(slug);
    handleCategoryClick(slug);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 dark:bg-gray-950">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-gray-100 bg-white/95 backdrop-blur dark:border-gray-800 dark:bg-gray-950/95">
        <div className="w-full max-w-md mx-auto px-4 py-3">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1">
              <div className="mb-0.5 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <MapPin size={14} />
                <span>University of Hertfordshire</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Hi {user?.profile?.name || 'there'}! 👋
              </h1>
            </div>
            <Link to="/search" className="touch-target">
              <Search size={22} className="text-gray-900 dark:text-white" />
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md mx-auto px-4">
        {/* Hero Banner */}
        <section className="py-4">
          <Link to="/create">
            <div className="relative h-48 overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-gray-900 shadow-card">
              <div className="absolute inset-0 flex flex-col justify-center px-6 text-white">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Start Selling</h2>
                <p className="text-white/90 text-sm mb-4 max-w-xs">List your items for free and connect with students</p>
                <button className="bg-white text-primary px-5 py-2.5 rounded-xl font-semibold w-fit hover:bg-gray-50 transition-colors">
                  Create Listing
                </button>
              </div>
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full"></div>
              <div className="absolute -right-2 -top-2 w-20 h-20 bg-white/10 rounded-full"></div>
            </div>
          </Link>
        </section>

        {/* Categories */}
        <section className="py-3">
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4">
            <button
              onClick={clearFilter}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                !selectedCategory
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              All
            </button>
            {(categories || []).slice(0, 8).map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.slug)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.slug
                    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </section>

        {/* Filter and Sort Bar */}
        <section className="border-b border-gray-100 py-3 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <Link
              to="/search"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              <SlidersHorizontal size={18} />
              Filters
            </Link>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                <span>Price: lowest to high</span>
              </button>
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="touch-target"
              >
                <Grid3x3 size={18} className="text-gray-700 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </section>

        {/* Promotional Section - New Items */}
        {listings.length > 0 && (
          <section className="py-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900">New</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">You've never seen it before!</p>
              </div>
              <Link to="/search" className="text-sm font-medium text-gray-900 dark:text-white">
                View all
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4">
              {(listings || []).slice(0, 4).map((listing) => (
                <Link
                  key={listing.id}
                  to={`/listing/${listing.id}`}
                  className="relative flex-shrink-0 w-32"
                >
                  <div className="absolute top-2 left-2 bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
                    NEW
                  </div>
                  <div className="mb-2 aspect-square overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
                    {/* Prefer cloud image_url, fall back to image, then to placeholder */}
                    <NewListingImage listing={listing} />
                  </div>
                  <h3 className="truncate text-xs font-medium text-gray-900 dark:text-white">{listing.title}</h3>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">£{listing.price}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <section className="py-2">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recently viewed</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Jump back to items you&apos;ve looked at.
                </p>
              </div>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4">
              {(recentlyViewed || []).slice(0, 10).map((listing) => (
                <Link
                  key={listing.id}
                  to={`/listing/${listing.id}`}
                  className="relative flex-shrink-0 w-32"
                >
                  <div className="mb-2 aspect-square overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
                    <NewListingImage listing={listing} />
                  </div>
                  <h3 className="truncate text-xs font-medium text-gray-900 dark:text-white">
                    {listing.title}
                  </h3>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">£{listing.price}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Main Listings Grid */}
        <section className="py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">All Listings</h2>
            <Link to="/search" className="text-sm font-medium text-gray-900 dark:text-white">
              View all
            </Link>
          </div>

          {listings.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📦</div>
              <p className="mb-4 text-gray-500 dark:text-gray-400">No listings found</p>
              <Link
                to="/create"
                className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors"
              >
                Create First Listing
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 pb-4">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} onSaveToggle={loadData} />
              ))}
            </div>
          )}
        </section>
      </div>

      <BottomNav />
    </div>
  );
}
