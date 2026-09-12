import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Wallet, ChevronRight } from 'lucide-react';
import { usePrompt } from '@/hooks/usePrompt';
import { LoadingScreen, ErrorScreen, EmptyScreen } from '@/components/States';
import { formatVND, formatDate, formatTime } from '@/utils/format';
import type { DispatchOrder } from '@/types';

export default function History() {
  const navigate = useNavigate();

  const { data: orders, isLoading, isError, refetch, isFetching } = usePrompt<DispatchOrder[]>(
    'GOB5_0100',
    'history',
    {},
  );

  return (
    <div className="px-4 py-5">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Lịch sử chuyến</h1>
        <p className="text-sm text-gray-400 mt-0.5">{orders?.length || 0} chuyến đã hoàn thành</p>
      </div>

      <button
        onClick={() => refetch()}
        className="text-xs text-blue-500 mb-3 flex items-center gap-1"
        disabled={isFetching}
      >
        {isFetching ? 'Đang tải...' : 'Làm mới'}
      </button>

      {isLoading && <LoadingScreen />}
      {isError && <ErrorScreen message="Không tải được lịch sử" />}
      {!isLoading && !isError && orders && orders.length === 0 && (
        <EmptyScreen message="Chưa có chuyến nào hoàn thành" />
      )}
      {!isLoading && !isError && orders && orders.length > 0 && (
        <div className="space-y-3">
          {orders.map((order) => {
            const firstStop = order.stops[0];
            const lastStop = order.stops[order.stops.length - 1];
            return (
              <div
                key={order.id}
                className="card p-4 cursor-pointer active:scale-[0.98] transition-transform animate-fade-in"
                onClick={() => navigate(`/order/${order.id}?readonly=true`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-gray-900">{order.code}</p>
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(order.dispatchAt)} · {formatTime(order.dispatchAt)}
                    </p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    Hoàn thành
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                  <p className="text-sm text-gray-700 truncate flex-1">{firstStop?.name}</p>
                  <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <p className="text-sm text-gray-700 truncate flex-1 text-right">{lastStop?.name}</p>
                  <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="w-3 h-3" />
                    {order.stops.length} điểm dừng
                  </span>
                  <span className="flex items-center gap-1 text-sm font-bold text-gray-900">
                    <Wallet className="w-3.5 h-3.5 text-gray-400" />
                    {formatVND(order.totalExpense)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
