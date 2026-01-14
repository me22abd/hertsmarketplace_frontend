import { Home, ShoppingBag, PlusCircle, MessageCircle, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/bag', icon: ShoppingBag, label: 'Bag' },
  { path: '/create', icon: PlusCircle, label: 'Create' },
  { path: '/messages', icon: MessageCircle, label: 'Messages' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const location = useLocation();

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
              <Icon size={24} className={isActive ? 'stroke-[2.5]' : 'stroke-2'} />
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
