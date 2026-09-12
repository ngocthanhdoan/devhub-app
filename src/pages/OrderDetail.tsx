import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Car,
  Clock,
  FileText,
  MapPin,
  CheckCircle2,
  XCircle,
  Play,
  Navigation,
  Flag,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { usePrompt, usePromptMutation } from '@/hooks/usePrompt';
import { ScreenHeader } from '@/components/ScreenHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Modal } from '@/components/Modal';
import { LoadingScreen, ErrorScreen } from '@/components/States';
import { formatDateTime, formatTime } from '@/utils/format';
import type { DispatchOrder } from '@/types';

export default function OrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const { data: order, isLoading, isError, refetch } = usePrompt<DispatchOrder>(
    'GOB1_0200',
    'orderDetail',
    { orderId: orderId! },
  );

  const acceptMutation = usePromptMutation<DispatchOrder>('GOB1_0200', 'acceptOrder', {
    invalidateKeys: [['GOB1_0200', 'orderDetail', { orderId }], ['GOB1_0100'], ['GOB0_0100']],
  });

  const rejectMutation = usePromptMutation<DispatchOrder>('GOB1_0200', 'rejectOrder', {
    invalidateKeys: [['GOB1_0200', 'orderDetail', { orderId }], ['GOB1_0100'], ['GOB0_0100']],
  });

  const startMutation = usePromptMutation<DispatchOrder>('GOB1_0200', 'startOrder', {
    invalidateKeys: [['GOB1_0200', 'orderDetail', { orderId }], ['GOB1_0100'], ['GOB0_0100']],
  });

  const completeMutation = usePromptMutation<DispatchOrder>('GOB1_0200', 'completeOrder', {
    invalidateKeys: [['GOB1_0200', 'orderDetail', { orderId }], ['GOB1_0100'], ['GOB0_0100'], ['GOB5_0100']],
  });

  if (isLoading) return (
    <>
      <ScreenHeader title="Chi tiết lệnh" />
      <LoadingScreen />
    </>
  );

  if (isError || !order) return (
    <>
      <ScreenHeader title="Chi tiết lệnh" />
      <ErrorScreen message="Không tải được chi tiết lệnh" />
    </>
  );

  const allStopsDone = order.stops.every((s) => s.status === 'DONE' || s.status === 'SKIPPED');
  const isReadOnly = order.status === 'COMPLETED' || order.status === 'REJECTED' || order.status === 'CANCELLED';

  const handleReject = () => {
    rejectMutation.mutate(
      { orderId: orderId!, reason: rejectReason },
      { onSuccess: () => { setRejectModalOpen(false); refetch(); } },
    );
  };

  return (
    <div>
      <ScreenHeader title={order.code} subtitle="Chi tiết lệnh điều chuyển" />

      <div className="px-4 py-4 space-y-4 pb-8">
        {/* Status + code */}
        <div className="card p-4 flex items-center justify-between animate-fade-in">
          <div>
            <p className="text-xs text-gray-400">Mã lệnh</p>
            <p className="font-bold text-lg text-gray-900">{order.code}</p>
          </div>
          <StatusBadge status={order.status} size="md" />
        </div>

        {/* Vehicle info */}
        <div className="card p-4 animate-fade-in">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Thông tin xe</h3>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <Car className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-bold text-gray-900">{order.vehicle.plate}</p>
              <p className="text-sm text-gray-500">{order.vehicle.type}</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Giờ xuất phát
              </p>
              <p className="font-semibold text-gray-900 text-sm mt-0.5">{formatTime(order.dispatchAt)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Ngày</p>
              <p className="font-semibold text-gray-900 text-sm mt-0.5">{formatDateTime(order.dispatchAt)}</p>
            </div>
          </div>
        </div>

        {/* Note */}
        {order.note && (
          <div className="card p-4 animate-fade-in">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" /> Ghi chú
            </h3>
            <p className="text-sm text-gray-600">{order.note}</p>
          </div>
        )}

        {/* Stops preview */}
        <div className="card p-4 animate-fade-in">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" /> Điểm dừng ({order.stops.length})
          </h3>
          <div className="space-y-3">
            {order.stops.map((stop, idx) => (
              <div key={stop.id} className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  stop.status === 'DONE' ? 'bg-emerald-100 text-emerald-600' :
                  stop.status === 'ARRIVED' ? 'bg-blue-100 text-blue-600' :
                  stop.status === 'SKIPPED' ? 'bg-red-100 text-red-500' :
                  'bg-gray-100 text-gray-500'
                }`}>
                  {stop.status === 'DONE' ? '✓' : stop.sequence}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{stop.name}</p>
                  <p className="text-xs text-gray-400 truncate">{stop.address}</p>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">{stop.etaTime}</span>
              </div>
            ))}
          </div>
          {!isReadOnly && order.status === 'IN_TRANSIT' && (
            <button
              onClick={() => navigate(`/order/${order.id}/stops`)}
              className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-50 text-blue-600 text-sm font-medium hover:bg-blue-100 transition-colors"
            >
              <Navigation className="w-4 h-4" />
              Vào tiến trình chuyến
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Action buttons */}
        {!isReadOnly && (
          <div className="space-y-3 pt-2">
            {order.status === 'ASSIGNED' && (
              <div className="flex gap-3">
                <PrimaryButton
                  variant="success"
                  fullWidth
                  size="lg"
                  onClick={() => acceptMutation.mutate({ orderId: orderId! }, { onSuccess: () => refetch() })}
                  disabled={acceptMutation.isPending}
                >
                  {acceptMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                  Nhận lệnh
                </PrimaryButton>
                <PrimaryButton
                  variant="danger"
                  size="lg"
                  onClick={() => setRejectModalOpen(true)}
                  disabled={rejectMutation.isPending}
                >
                  <XCircle className="w-5 h-5" />
                </PrimaryButton>
              </div>
            )}

            {order.status === 'ACCEPTED' && (
              <PrimaryButton
                fullWidth
                size="lg"
                onClick={() => startMutation.mutate({ orderId: orderId! }, { onSuccess: () => refetch() })}
                disabled={startMutation.isPending}
              >
                {startMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                Xuất phát
              </PrimaryButton>
            )}

            {order.status === 'IN_TRANSIT' && (
              <>
                <PrimaryButton
                  fullWidth
                  size="lg"
                  onClick={() => navigate(`/order/${order.id}/stops`)}
                >
                  <Navigation className="w-5 h-5" />
                  Vào tiến trình chuyến
                </PrimaryButton>
                {allStopsDone && (
                  <PrimaryButton
                    variant="success"
                    fullWidth
                    size="lg"
                    onClick={() => completeMutation.mutate({ orderId: orderId! }, { onSuccess: () => refetch() })}
                    disabled={completeMutation.isPending}
                  >
                    {completeMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Flag className="w-5 h-5" />}
                    Hoàn thành chuyến
                  </PrimaryButton>
                )}
              </>
            )}
          </div>
        )}

        {/* Error message */}
        {(acceptMutation.isError || rejectMutation.isError || startMutation.isError || completeMutation.isError) && (
          <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 text-center">
            Có lỗi xảy ra. Vui lòng thử lại.
          </div>
        )}
      </div>

      {/* Reject modal */}
      <Modal open={rejectModalOpen} onClose={() => setRejectModalOpen(false)} title="Từ chối lệnh">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Lý do từ chối</label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Nhập lý do từ chối lệnh..."
              rows={4}
              className="input-field resize-none"
            />
          </div>
          <div className="flex gap-3">
            <PrimaryButton variant="secondary" fullWidth onClick={() => setRejectModalOpen(false)}>
              Hủy
            </PrimaryButton>
            <PrimaryButton
              variant="danger"
              fullWidth
              onClick={handleReject}
              disabled={!rejectReason.trim() || rejectMutation.isPending}
            >
              {rejectMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Xác nhận từ chối'}
            </PrimaryButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}
