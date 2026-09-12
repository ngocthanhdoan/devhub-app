import { useNavigate } from 'react-router-dom';
import { Phone, BadgeCheck, Car, LogOut, Settings, Bell, ChevronRight, Loader2 } from 'lucide-react';
import { usePrompt } from '@/hooks/usePrompt';
import { useLogout } from '@/hooks/useAuth';
import { LoadingScreen, ErrorScreen } from '@/components/States';
import { PrimaryButton } from '@/components/PrimaryButton';
import type { Driver, Vehicle } from '@/types';

export default function Profile() {
  const navigate = useNavigate();
  const logoutMutation = useLogout();

  const { data, isLoading, isError } = usePrompt<{ driver: Driver; vehicle: Vehicle }>(
    'GOB6_0100',
    'profile',
    {},
  );

  if (isLoading) return <LoadingScreen />;
  if (isError || !data) return <ErrorScreen message="Không tải được hồ sơ" />;

  const { driver, vehicle } = data;

  const handleLogout = () => {
    logoutMutation.mutate(undefined, { onSuccess: () => navigate('/login') });
  };

  return (
    <div className="px-4 py-5 space-y-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Hồ sơ</h1>

      {/* Profile card */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white shadow-lg animate-fade-in">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold flex-shrink-0">
            {driver.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-xl truncate">{driver.name}</p>
            <p className="text-sm text-blue-100 flex items-center gap-1 mt-0.5">
              <BadgeCheck className="w-4 h-4" />
              Mã tài xế: {driver.code}
            </p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-sm text-blue-100 flex items-center gap-2">
            <Phone className="w-4 h-4" />
            {driver.phone}
          </p>
        </div>
      </div>

      {/* Vehicle card */}
      <div className="card p-4 animate-fade-in">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Car className="w-4 h-4 text-gray-400" />
          Xe đang phụ trách
        </h3>
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Car className="w-7 h-7 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-900 text-lg">{vehicle.plate}</p>
            <p className="text-sm text-gray-500">{vehicle.type}</p>
          </div>
          <span className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-medium">
            {vehicle.status}
          </span>
        </div>
      </div>

      {/* Menu items */}
      <div className="card divide-y divide-gray-100 animate-fade-in">
        <button className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left">
          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
            <Bell className="w-4 h-4 text-gray-500" />
          </div>
          <span className="flex-1 text-sm font-medium text-gray-700">Thông báo</span>
          <ChevronRight className="w-4 h-4 text-gray-300" />
        </button>
        <button className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left">
          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
            <Settings className="w-4 h-4 text-gray-500" />
          </div>
          <span className="flex-1 text-sm font-medium text-gray-700">Cài đặt</span>
          <ChevronRight className="w-4 h-4 text-gray-300" />
        </button>
      </div>

      {/* Logout */}
      <div className="pt-4">
        <PrimaryButton
          variant="danger"
          fullWidth
          size="lg"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          {logoutMutation.isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <LogOut className="w-5 h-5" />
              Đăng xuất
            </>
          )}
        </PrimaryButton>
      </div>

      <p className="text-center text-xs text-gray-400 mt-4">
        DevHub Solutions · Version 1.0.0
      </p>
    </div>
  );
}
