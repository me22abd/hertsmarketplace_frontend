import { useEffect, useState } from 'react';
import { Search, MapPin, SlidersHorizontal, Grid3x3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { categoriesAPI, listingsAPI } from '@/services/api';
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
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [categoriesData, listingsData] = await Promise.all([
        categoriesAPI.list(),
        listingsAPI.list({ ordering: '-created_at' }),
      ]);
      setCategories(categoriesData.results);
      setListings(listingsData.results);
    } catch (error: any) {
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
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
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="w-full max-w-md mx-auto px-4 py-3">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-0.5">
                <MapPin size={14} />
                <span>University of Hertfordshire</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                Hi {user?.profile?.name || 'there'}! 👋
              </h1>
            </div>
            <Link to="/search" className="touch-target">
              <Search size={22} className="text-gray-900" />
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md mx-auto px-4">
        {/* Hero Banner */}
        <section className="py-4">
          <Link to="/create">
            <div className="relative h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-gray-900">
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
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {categories.slice(0, 8).map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.slug)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.slug
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </section>

        {/* Filter and Sort Bar */}
        <section className="py-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <Link
              to="/search"
              className="flex items-center gap-2 text-sm text-gray-700 font-medium"
            >
              <SlidersHorizontal size={18} />
              Filters
            </Link>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1.5 text-sm text-gray-700 font-medium">
                <span>Price: lowest to high</span>
              </button>
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="touch-target"
              >
                <Grid3x3 size={18} className="text-gray-700" />
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
                <p className="text-xs text-gray-500">You've never seen it before!</p>
              </div>
              <Link to="/search" className="text-sm text-gray-900 font-medium">
                View all
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4">
              {listings.slice(0, 4).map((listing) => (
                <Link
                  key={listing.id}
                  to={`/listing/${listing.id}`}
                  className="relative flex-shrink-0 w-32"
                >
                  <div className="absolute top-2 left-2 bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
                    NEW
                  </div>
                  <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-2">
                    {/* Prefer cloud image_url, fall back to image, then to placeholder */}
                    <NewListingImage listing={listing} />
                  </div>
                  <h3 className="text-xs font-medium text-gray-900 truncate">{listing.title}</h3>
                  <p className="text-sm font-bold text-gray-900">£{listing.price}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Main Listings Grid */}
        <section className="py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">All Listings</h2>
            <Link to="/search" className="text-sm text-gray-900 font-medium">
              View all
            </Link>
          </div>

          {listings.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-gray-500 mb-4">No listings found</p>
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
