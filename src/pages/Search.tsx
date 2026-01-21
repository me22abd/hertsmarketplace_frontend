import { useEffect, useState } from 'react';
import { Search as SearchIcon, SlidersHorizontal, ArrowLeft, X, Grid3x3, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import { categoriesAPI, listingsAPI } from '@/services/api';
import type { Category, Listing, ListingCondition } from '@/types';
import ListingCard from '@/components/ListingCard';
import Loading from '@/components/Loading';
import BottomNav from '@/components/BottomNav';
import { debounce } from '@/utils/helpers';
import toast from 'react-hot-toast';

const CONDITIONS: ListingCondition[] = ['new', 'good', 'used'];
const SORT_OPTIONS = [
  { value: '-created_at', label: 'Newest' },
  { value: 'created_at', label: 'Oldest' },
  { value: 'price', label: 'Price: lowest to high' },
  { value: '-price', label: 'Price: highest to low' },
];

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const [filters, setFilters] = useState({
    category: '',
    condition: '' as ListingCondition | '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'price',
  });

  const [priceRange, setPriceRange] = useState({ min: 0, max: 500 });

  useEffect(() => {
    loadCategories();
    loadListings();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoriesAPI.list();
      setCategories(data.results);
    } catch (error) {
      toast.error('Failed to load categories');
    }
  };

  const loadListings = async () => {
    try {
      setIsLoading(true);
      const params: any = {
        ordering: filters.sortBy,
      };

      if (searchQuery) params.search = searchQuery;
      if (filters.category) params.category = filters.category;
      if (filters.condition) params.condition = filters.condition;
      if (filters.minPrice) params.min_price = filters.minPrice;
      if (filters.maxPrice) params.max_price = filters.maxPrice;

      const data = await listingsAPI.list(params);
      setListings(data.results);
    } catch (error) {
      toast.error('Failed to load listings');
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = debounce(loadListings, 500);

  useEffect(() => {
    debouncedSearch();
  }, [searchQuery, filters]);

  const clearFilters = () => {
    setFilters({
      category: '',
      condition: '',
      minPrice: '',
      maxPrice: '',
      sortBy: '-created_at',
    });
    setSearchQuery('');
  };

  const activeFilterCount = Object.values(filters).filter(v => v && v !== 'price').length;
  const currentSortLabel = SORT_OPTIONS.find(opt => opt.value === filters.sortBy)?.label || 'Price: lowest to high';

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="w-full max-w-md mx-auto px-4 py-3">
          <div className="flex items-center gap-3 mb-3">
            <Link to="/home" className="touch-target -ml-2">
              <ArrowLeft size={22} className="text-gray-900" />
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Search</h1>
            <div className="flex-1" />
            <SearchIcon size={22} className="text-gray-900" />
          </div>

          {/* Category Chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4">
            <button
              onClick={() => setFilters(prev => ({ ...prev, category: '' }))}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                !filters.category
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              All
            </button>
            {categories.slice(0, 8).map((category) => (
              <button
                key={category.id}
                onClick={() => setFilters(prev => ({ ...prev, category: category.slug }))}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  filters.category === category.slug
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter and Sort Bar */}
      <div className="bg-white border-b border-gray-100 sticky top-[108px] z-10">
        <div className="w-full max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center gap-2 text-sm text-gray-900 font-medium relative"
            >
              <SlidersHorizontal size={18} />
              Filters
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSortModal(true)}
                className="flex items-center gap-1.5 text-sm text-gray-700"
              >
                <span>{currentSortLabel}</span>
              </button>
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="touch-target"
              >
                {viewMode === 'grid' ? (
                  <Grid3x3 size={18} className="text-gray-700" />
                ) : (
                  <List size={18} className="text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="w-full max-w-md mx-auto px-4 pt-4">
        {isLoading ? (
          <Loading />
        ) : listings.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 mb-2">No items found</p>
            <p className="text-sm text-gray-400">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 pb-4">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} onSaveToggle={loadListings} />
            ))}
          </div>
        )}
      </div>

      {/* Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowFilters(false)}>
          <div className="bg-white w-full max-w-md mx-auto rounded-t-3xl max-h-[85vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                <button onClick={() => setShowFilters(false)} className="touch-target -mr-2">
                  <X size={24} className="text-gray-900" />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-6">
              {/* Price Range */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-3">Price range</h3>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">£{priceRange.min}</span>
                  <span className="text-sm text-gray-600">£{priceRange.max}</span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </div>

              {/* Conditions */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-3">Condition</h3>
                <div className="grid grid-cols-2 gap-2">
                  {CONDITIONS.map((condition) => (
                    <button
                      key={condition}
                      onClick={() => setFilters(prev => ({ 
                        ...prev, 
                        condition: prev.condition === condition ? '' : condition 
                      }))}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        filters.condition === condition
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {condition.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-3">Category</h3>
                <div className="grid grid-cols-2 gap-2">
                  {categories.slice(0, 6).map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setFilters(prev => ({ 
                        ...prev, 
                        category: prev.category === category.slug ? '' : category.slug 
                      }))}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        filters.category === category.slug
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 flex gap-3">
              <button onClick={clearFilters} className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-900 font-semibold">
                Discard
              </button>
              <button onClick={() => setShowFilters(false)} className="flex-1 py-3 rounded-xl bg-primary text-white font-semibold">
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sort Modal */}
      {showSortModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowSortModal(false)}>
          <div className="bg-white w-full max-w-md mx-auto rounded-t-3xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Sort by</h2>
              <div className="space-y-1">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setFilters(prev => ({ ...prev, sortBy: option.value }));
                      setShowSortModal(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                      filters.sortBy === option.value
                        ? 'bg-primary text-white font-semibold'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
