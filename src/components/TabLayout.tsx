import { NavLink, useLocation } from 'react-router-dom';
import { Home, ClipboardList, History, User } from 'lucide-react';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const tabs = [
  { to: '/', label: 'Trang chủ', icon: Home, end: true },
  { to: '/orders', label: 'Lệnh', icon: ClipboardList, end: false },
  { to: '/history', label: 'Lịch sử', icon: History, end: false },
  { to: '/profile', label: 'Hồ sơ', icon: User, end: false },
];

export function TabLayout({ children }: Props) {
  const location = useLocation();
  const isOrderDetail = location.pathname.startsWith('/order/');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto">
      <div className="flex-1 overflow-y-auto pb-20">{children}</div>

      {!isOrderDetail && (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 px-2 py-1.5 flex items-center justify-around z-50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <NavLink
                key={tab.to}
                to={tab.to}
                end={tab.end}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-0.5 py-1.5 px-4 rounded-xl transition-all duration-200 ${
                    isActive ? 'text-blue-600' : 'text-gray-400'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">{tab.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      )}
    </div>
  );
}
