import { useState } from 'react';
import { usePrompt } from '@/hooks/usePrompt';
import { OrderCard } from '@/components/OrderCard';
import { LoadingScreen, ErrorScreen, EmptyScreen } from '@/components/States';
import type { DispatchOrder } from '@/types';

const FILTERS = ['Tất cả', 'Chờ nhận', 'Đang chạy', 'Hoàn thành', 'Từ chối'] as const;

export default function OrdersList() {
  const [filter, setFilter] = useState<string>('Tất cả');

  const { data: orders, isLoading, isError, refetch, isFetching } = usePrompt<DispatchOrder[]>(
    'GOB1_0100',
    'myOrders',
    { filter },
  );

  return (
    <div className="px-4 py-5">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Lệnh điều chuyển</h1>
        <p className="text-sm text-gray-400 mt-0.5">{orders?.length || 0} lệnh</p>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 mb-4 scrollbar-hide">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`filter-chip ${filter === f ? 'filter-chip-active' : 'filter-chip-inactive'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Pull to refresh hint */}
      <button
        onClick={() => refetch()}
        className="text-xs text-blue-500 mb-3 flex items-center gap-1"
        disabled={isFetching}
      >
        {isFetching ? 'Đang tải...' : 'Kéo để làm mới'}
      </button>

      {isLoading && <LoadingScreen />}
      {isError && <ErrorScreen message="Không tải được danh sách lệnh" />}
      {!isLoading && !isError && orders && orders.length === 0 && (
        <EmptyScreen message="Không có lệnh nào trong mục này" />
      )}
      {!isLoading && !isError && orders && orders.length > 0 && (
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
