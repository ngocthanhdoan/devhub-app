import { useNavigate } from 'react-router-dom';
import { ClipboardList, CheckCircle2, Bell, Wallet, Navigation, Car, ChevronRight } from 'lucide-react';
import { usePrompt } from '@/hooks/usePrompt';
import { StatCard } from '@/components/StatCard';
import { AlertList } from '@/components/AlertList';
import { StatusBadge } from '@/components/StatusBadge';
import { LoadingScreen } from '@/components/States';
import { formatVND, formatTime } from '@/utils/format';
import type { DashboardData, StatCardsData, Alert as AlertType, DispatchOrder } from '@/types';

export default function Dashboard() {
  const navigate = useNavigate();

  const { data: stats, isLoading: statsLoading } = usePrompt<StatCardsData>('GOB0_0100', 'statCards', {});
  const { data: activeOrder } = usePrompt<DispatchOrder | null>('GOB0_0100', 'activeOrder', {}, { refetchInterval: 15000 });
  const { data: alerts } = usePrompt<AlertType[]>('GOB0_0100', 'alerts', {}, { refetchInterval: 15000 });

  if (statsLoading) return <LoadingScreen />;

  const unreadCount = alerts?.filter((a) => !a.read).length || 0;

  return (
    <div className="px-4 py-5 space-y-5">
      {/* Header greeting */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm">Xin chào,</p>
            <h1 className="text-xl font-bold mt-0.5">Nguyễn Văn Thành</h1>
          </div>
          <button
            onClick={() => navigate('/profile')}
            className="w-11 h-11 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white font-bold"
          >
            TX
          </button>
        </div>
        <div className="mt-4 bg-white/10 backdrop-blur rounded-xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Car className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-blue-100">Xe đang phụ trách</p>
            <p className="font-bold text-white text-lg">51B-1234.56</p>
          </div>
          <span className="ml-auto text-xs bg-emerald-400/30 text-emerald-50 px-2 py-1 rounded-full">
            Hoạt động
          </span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Lệnh hôm nay" value={stats?.todayOrders ?? 0} icon={ClipboardList} color="blue" />
        <StatCard label="Đã hoàn thành" value={stats?.completedOrders ?? 0} icon={CheckCircle2} color="green" />
        <StatCard label="Lệnh mới" value={stats?.newOrders ?? 0} icon={Bell} color="amber" />
        <StatCard label="Tổng chi phí" value={formatVND(stats?.totalExpense ?? 0)} icon={Wallet} color="red" />
      </div>

      {/* Active order card */}
      {activeOrder && (
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-blue-600" />
            Chuyến đang chạy
          </h2>
          <div
            className="card p-4 cursor-pointer active:scale-[0.98] transition-transform ring-2 ring-blue-200"
            onClick={() => navigate(`/order/${activeOrder.id}/stops`)}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-bold text-gray-900">{activeOrder.code}</p>
                <p className="text-xs text-gray-400 mt-0.5">Xuất phát: {formatTime(activeOrder.dispatchAt)}</p>
              </div>
              <StatusBadge status={activeOrder.status} size="md" />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-blue-500 font-medium">{activeOrder.stops[0]?.name}</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-red-500 font-medium truncate">
                {activeOrder.stops[activeOrder.stops.length - 1]?.name}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
              <span>{activeOrder.stops.length} điểm dừng</span>
              <span className="text-blue-600 font-medium flex items-center gap-1">
                Vào tiến trình <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Alerts */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-600" />
            Thông báo
          </h2>
          {unreadCount > 0 && (
            <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-medium">
              {unreadCount} mới
            </span>
          )}
        </div>
        <AlertList alerts={alerts || []} />
      </div>
    </div>
  );
}
