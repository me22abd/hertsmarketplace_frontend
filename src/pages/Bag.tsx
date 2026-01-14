import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, MessageCircle, ShoppingBag, Plus, Minus } from 'lucide-react';
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

  const handleContactSeller = (item: SavedListing) => {
    navigate('/messages', { state: { listing: item.listing } });
  };

  const totalAmount = bagItems.reduce((sum, item) => {
    return sum + parseFloat(item.listing.price);
  }, 0);

  if (isLoading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 z-20">
        <div className="w-full max-w-md mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">My Bag</h1>
        </div>
      </div>

      <div className="w-full max-w-md mx-auto px-4 py-4">
        {bagItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <ShoppingBag size={32} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Your bag is empty</h2>
            <p className="text-gray-500 mb-6">
              Add items to your bag to purchase later
            </p>
            <Link
              to="/home"
              className="inline-block px-6 py-3 bg-primary text-white font-semibold rounded-xl"
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
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
                >
                  <div className="flex gap-3 p-3">
                    {/* Item Image */}
                    <div
                      onClick={() => navigate(`/listings/${item.listing.id}`)}
                      className="w-24 h-24 rounded-xl bg-gray-50 flex-shrink-0 overflow-hidden cursor-pointer"
                    >
                      {item.listing.image ? (
                        <img
                          src={item.listing.image}
                          alt={item.listing.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">
                          📦
                        </div>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0 pr-2">
                          <h3
                            onClick={() => navigate(`/listings/${item.listing.id}`)}
                            className="font-semibold text-gray-900 text-sm truncate cursor-pointer hover:text-primary"
                          >
                            {item.listing.title}
                          </h3>
                          {item.listing.seller_profile && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              Seller: {item.listing.seller_profile.name}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.listing.id)}
                          className="touch-target -mr-2"
                        >
                          <Trash2 size={18} className="text-gray-400 hover:text-red-600" />
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
                                ? 'bg-green-100 text-green-800'
                                : item.listing.status === 'reserved'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
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
                          className="mt-2 w-full bg-gray-900 text-white text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5 hover:bg-gray-800"
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
            <div className="bg-gray-50 rounded-2xl p-4 mb-4">
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total items</span>
                  <span className="font-semibold text-gray-900">{bagItems.length}</span>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-base font-bold text-gray-900">Total amount</span>
                  <span className="text-xl font-bold text-primary">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Info Card */}
            <div className="bg-primary/5 rounded-2xl p-4 mb-4">
              <h3 className="text-sm font-bold text-gray-900 mb-2">💰 Payment Methods</h3>
              <ul className="space-y-1.5 text-xs text-gray-600">
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
            <div className="bg-blue-50 rounded-xl p-4 mb-4">
              <p className="text-xs text-blue-900">
                <span className="font-semibold">ℹ️ Note:</span> Contact each seller to arrange
                pickup and payment. All items are from individual student sellers.
              </p>
            </div>

            {/* Action Button */}
            <button
              onClick={() => {
                if (bagItems.length > 0) {
                  navigate('/messages');
                  toast.success('Go to Messages to contact sellers');
                }
              }}
              disabled={bagItems.length === 0}
              className="w-full bg-primary text-white font-bold py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
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
