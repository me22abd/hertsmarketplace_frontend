import { Home, ShoppingBag, PlusCircle, MessageCircle, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { premiumAPI } from '@/services/api';

const navItems = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/bag', icon: ShoppingBag, label: 'Bag' },
  { path: '/create', icon: PlusCircle, label: 'Create' },
  { path: '/messages', icon: MessageCircle, label: 'Messages' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Use existing premium notifications endpoint if available
        const data = await premiumAPI.getNotifications();
        // Expecting shape like { unread_messages: number, alerts: [...] }
        const count =
          typeof data?.unread_messages === 'number'
            ? data.unread_messages
            : (Array.isArray(data?.messages) ? data.messages.filter((m: any) => !m.is_read).length : 0);
        setUnreadCount(count);
      } catch {
        // Silent fail – nav should never break if notifications fail
        setUnreadCount(0);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom z-50">
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 touch-target transition-colors ${
                isActive ? 'text-primary' : 'text-gray-400'
              }`}
            >
              <div className="relative">
                <Icon size={24} className={isActive ? 'stroke-[2.5]' : 'stroke-2'} />
                {item.path === '/messages' && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              <span className={`text-xs ${isActive ? 'font-semibold' : 'font-normal'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
