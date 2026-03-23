import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, MessageCircle, ShoppingBag } from 'lucide-react';
import { savedListingsAPI, listingsAPI } from '@/services/api';
import type { SavedListing } from '@/types';
import Loading from '@/components/Loading';
import BottomNav from '@/components/BottomNav';
import { formatPrice } from '@/utils/helpers';
import toast from 'react-hot-toast';

export default function Bag() {
  const navigate = useNavigate();
  const [bagItems, setBagItems] = useState<SavedListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBagItems();
  }, []);

  const loadBagItems = async () => {
    try {
      setIsLoading(true);
      const data = await savedListingsAPI.list();
      setBagItems(data);
    } catch (error: any) {
      toast.error('Failed to load bag items');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = async (listingId: number) => {
    try {
      await savedListingsAPI.remove(listingId);
      setBagItems(prev => prev.filter(item => item.listing.id !== listingId));
      toast.success('Removed from bag');
    } catch (error: any) {
      toast.error('Failed to remove item');
    }
  };

  const handleContactSeller = async (item: SavedListing) => {
    try {
      // Reserve the item for in-person collection before starting chat
      await listingsAPI.reserveInPerson(item.listing.id);
    } catch (error: any) {
      // If reservation fails (e.g. already reserved), still let them chat
      console.warn('Failed to reserve from bag before contacting seller', error);
    } finally {
      navigate('/messages', { state: { listing: item.listing } });
    }
  };

  const totalAmount = bagItems.reduce((sum, item) => {
    return sum + parseFloat(item.listing.price);
  }, 0);

  if (isLoading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 dark:bg-gray-950">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-gray-100 bg-white/95 backdrop-blur dark:border-gray-800 dark:bg-gray-950/95">
        <div className="w-full max-w-md mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Bag</h1>
        </div>
      </div>

      <div className="w-full max-w-md mx-auto px-4 py-4">
        {bagItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900">
              <ShoppingBag size={32} className="text-gray-400 dark:text-gray-600" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">Your bag is empty</h2>
            <p className="mb-6 text-gray-500 dark:text-gray-400">
              Add items to your bag to purchase later
            </p>
            <Link
              to="/home"
              className="inline-block rounded-xl bg-primary px-6 py-3 font-semibold text-white"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Bag Items */}
            <div className="space-y-3 mb-6">
              {bagItems.map((item) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-card dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="flex gap-3 p-3">
                    {/* Item Image */}
                    <div
                      onClick={() => navigate(`/listing/${item.listing.id}`)}
                      className="h-24 w-24 cursor-pointer flex-shrink-0 overflow-hidden rounded-2xl bg-gray-50 dark:bg-gray-800"
                    >
                      {item.listing.image ? (
                        <img
                          src={item.listing.image}
                          alt={item.listing.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-3xl">
                          📦
                        </div>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0 pr-2">
                          <h3
                            onClick={() => navigate(`/listing/${item.listing.id}`)}
                            className="cursor-pointer truncate text-sm font-semibold text-gray-900 hover:text-primary dark:text-white"
                          >
                            {item.listing.title}
                          </h3>
                          {item.listing.seller?.profile?.name && (
                            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                              Seller: {item.listing.seller.profile.name}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.listing.id)}
                          className="touch-target -mr-2"
                        >
                          <Trash2 size={18} className="text-gray-400 hover:text-red-600 dark:text-gray-500" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-primary">
                            {formatPrice(item.listing.price)}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              item.listing.status === 'available'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200'
                                : item.listing.status === 'reserved'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'
                            }`}
                          >
                            {item.listing.status === 'available'
                              ? 'Available'
                              : item.listing.status === 'reserved'
                              ? 'Reserved'
                              : 'Sold'}
                          </span>
                        </div>
                      </div>

                      {item.listing.status === 'available' && (
                        <button
                          onClick={() => handleContactSeller(item)}
                          className="mt-2 w-full rounded-lg bg-gray-900 py-2 text-xs font-semibold text-white flex items-center justify-center gap-1.5 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                        >
                          <MessageCircle size={14} />
                          Contact Seller
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Card */}
            <div className="mb-4 rounded-3xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Total items</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{bagItems.length}</span>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-3 dark:border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-base font-bold text-gray-900 dark:text-white">Total amount</span>
                  <span className="text-xl font-bold text-primary">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Info Card */}
            <div className="mb-4 rounded-3xl bg-primary/5 p-4">
              <h3 className="mb-2 text-sm font-bold text-gray-900 dark:text-white">💰 Payment Methods</h3>
              <ul className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Cash on delivery (after receiving item)</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Bank transfer (after receiving item)</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Arrange with seller directly</span>
                </li>
              </ul>
            </div>

            {/* Info Message */}
            <div className="mb-4 rounded-2xl bg-blue-50 p-4 dark:bg-blue-900/20">
              <p className="text-xs text-blue-900 dark:text-blue-200">
                <span className="font-semibold">ℹ️ Note:</span> Contact each seller to arrange
                pickup and payment. All items are from individual student sellers.
              </p>
            </div>

            {/* Action Button */}
            <button
              onClick={async () => {
                if (bagItems.length === 0) return;

                // Try to reserve all available items in the bag for in-person collection
                const reservable = bagItems.filter(
                  (item) => item.listing.status === 'available'
                );

                for (const item of reservable) {
                  try {
                    await listingsAPI.reserveInPerson(item.listing.id);
                  } catch (error) {
                    console.warn('Failed to reserve item from bag', item.listing.id, error);
                  }
                }

                navigate('/messages');
                toast.success('Go to Messages to arrange collection with sellers');
              }}
              disabled={bagItems.length === 0}
              className="w-full rounded-xl bg-primary py-4 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Contact All Sellers
            </button>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
