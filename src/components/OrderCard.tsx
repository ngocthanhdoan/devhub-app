import { useNavigate } from 'react-router-dom';
import { MapPin, Users, Clock, Car } from 'lucide-react';
import type { DispatchOrder } from '@/types';
import { StatusBadge } from './StatusBadge';
import { formatTime } from '@/utils/format';

interface Props {
  order: DispatchOrder;
}

export function OrderCard({ order }: Props) {
  const navigate = useNavigate();
  const firstStop = order.stops[0];
  const lastStop = order.stops[order.stops.length - 1];
  const passengerCount = order.stops.reduce(
    (sum, s) => sum + s.passengers.filter((p) => p.action === 'PICKUP').length,
    0,
  );

  return (
    <div
      className="card p-4 active:scale-[0.98] transition-transform cursor-pointer animate-fade-in"
      onClick={() => navigate(`/order/${order.id}`)}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-bold text-gray-900 text-base">{order.code}</p>
          <p className="text-xs text-gray-400 mt-0.5">Xuất phát: {formatTime(order.dispatchAt)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
            <p className="text-sm text-gray-700 truncate">{firstStop?.name}</p>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
            <p className="text-sm text-gray-700 truncate">{lastStop?.name}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-500 pt-3 border-t border-gray-100">
        <span className="flex items-center gap-1">
          <Car className="w-3.5 h-3.5" />
          {order.vehicle.plate}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" />
          {order.stops.length} điểm
        </span>
        <span className="flex items-center gap-1">
          <Users className="w-3.5 h-3.5" />
          {passengerCount} khách
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {formatTime(order.dispatchAt)}
        </span>
      </div>
    </div>
  );
}
