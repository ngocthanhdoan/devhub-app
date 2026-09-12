import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/utils/format';
import type { OrderStatus } from '@/types';

interface Props {
  status: OrderStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'sm' }: Props) {
  const label = ORDER_STATUS_LABELS[status] || status;
  const color = ORDER_STATUS_COLORS[status] || 'bg-gray-100 text-gray-700';
  const sizeClass = size === 'md' ? 'px-3 py-1 text-sm' : 'px-2.5 py-0.5 text-xs';
  return (
    <span className={`inline-flex items-center rounded-full font-semibold ${color} ${sizeClass}`}>
      {label}
    </span>
  );
}
