export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
}

export function formatDateTime(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function formatDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d);
}

export function formatTime(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function formatTimeOnly(time: string): string {
  return time;
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  NEW: 'Mới',
  ASSIGNED: 'Chờ nhận',
  ACCEPTED: 'Đã nhận',
  IN_TRANSIT: 'Đang chạy',
  COMPLETED: 'Hoàn thành',
  REJECTED: 'Từ chối',
  CANCELLED: 'Đã hủy',
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-700',
  ASSIGNED: 'bg-amber-100 text-amber-700',
  ACCEPTED: 'bg-cyan-100 text-cyan-700',
  IN_TRANSIT: 'bg-indigo-100 text-indigo-700',
  COMPLETED: 'bg-emerald-100 text-emerald-700',
  REJECTED: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-gray-300 text-gray-700',
};

export const STOP_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Chưa đến',
  ARRIVED: 'Đã đến',
  DONE: 'Hoàn tất',
  SKIPPED: 'Bỏ qua',
};

export const EXPENSE_TYPE_LABELS: Record<string, string> = {
  FUEL: 'Xăng dầu',
  TOLL: 'Trạm thu phí',
  PARKING: 'Gửi xe',
  OTHER: 'Khác',
};

export const EXPENSE_TYPE_ICONS: Record<string, string> = {
  FUEL: '⛽',
  TOLL: '🛣️',
  PARKING: '🅿️',
  OTHER: '📦',
};
