import { useParams, useNavigate } from 'react-router-dom';
import { Wallet, Map as MapIcon, Flag, Loader2 } from 'lucide-react';
import { usePrompt, usePromptMutation } from '@/hooks/usePrompt';
import { ScreenHeader } from '@/components/ScreenHeader';
import { StopTimeline } from '@/components/StopTimeline';
import { PrimaryButton } from '@/components/PrimaryButton';
import { LoadingScreen, ErrorScreen } from '@/components/States';
import type { Stop, DispatchOrder } from '@/types';

export default function Stops() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const { data: stops, isLoading, isError, refetch } = usePrompt<Stop[]>(
    'GOB2_0100',
    'stops',
    { orderId: orderId! },
    { refetchInterval: 10000 },
  );

  const arriveMutation = usePromptMutation<Stop[]>('GOB2_0100', 'arriveStop', {
    invalidateKeys: [['GOB2_0100', 'stops', { orderId }], ['GOB1_0200', 'orderDetail', { orderId }]],
  });

  const completeMutation = usePromptMutation<Stop[]>('GOB2_0100', 'completeStop', {
    invalidateKeys: [['GOB2_0100', 'stops', { orderId }], ['GOB1_0200', 'orderDetail', { orderId }]],
  });

  const skipMutation = usePromptMutation<Stop[]>('GOB2_0100', 'skipStop', {
    invalidateKeys: [['GOB2_0100', 'stops', { orderId }], ['GOB1_0200', 'orderDetail', { orderId }]],
  });

  const completeOrderMutation = usePromptMutation<DispatchOrder>('GOB1_0200', 'completeOrder', {
    invalidateKeys: [['GOB1_0200', 'orderDetail', { orderId }], ['GOB1_0100'], ['GOB0_0100'], ['GOB5_0100']],
  });

  if (isLoading) return (
    <>
      <ScreenHeader
        title="Tiến trình chuyến"
        rightAction={
          <div className="flex gap-1">
            <button
              onClick={() => navigate(`/order/${orderId}/expenses`)}
              className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 hover:bg-amber-100 transition-colors"
            >
              <Wallet className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate(`/order/${orderId}/map`)}
              className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors"
            >
              <MapIcon className="w-5 h-5" />
            </button>
          </div>
        }
      />
      <LoadingScreen />
    </>
  );

  if (isError || !stops) return (
    <>
      <ScreenHeader title="Tiến trình chuyến" />
      <ErrorScreen message="Không tải được danh sách điểm dừng" />
    </>
  );

  const allDone = stops.every((s) => s.status === 'DONE' || s.status === 'SKIPPED');

  const handleArrive = (stopId: string) => {
    arriveMutation.mutate({ orderId: orderId!, stopId }, { onSuccess: () => refetch() });
  };

  const handleComplete = (stopId: string) => {
    completeMutation.mutate({ orderId: orderId!, stopId }, { onSuccess: () => refetch() });
  };

  const handleSkip = (stopId: string) => {
    skipMutation.mutate({ orderId: orderId!, stopId }, { onSuccess: () => refetch() });
  };

  const handleCompleteOrder = () => {
    completeOrderMutation.mutate({ orderId: orderId! }, { onSuccess: () => navigate(`/order/${orderId}`) });
  };

  return (
    <div>
      <ScreenHeader
        title="Tiến trình chuyến"
        rightAction={
          <div className="flex gap-1">
            <button
              onClick={() => navigate(`/order/${orderId}/expenses`)}
              className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 hover:bg-amber-100 transition-colors"
            >
              <Wallet className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate(`/order/${orderId}/map`)}
              className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors"
            >
              <MapIcon className="w-5 h-5" />
            </button>
          </div>
        }
      />

      <div className="px-4 py-4 pb-8">
        <StopTimeline
          stops={stops}
          orderId={orderId!}
          onArrive={handleArrive}
          onComplete={handleComplete}
          onSkip={handleSkip}
        />

        {/* Error message */}
        {(arriveMutation.isError || completeMutation.isError || skipMutation.isError) && (
          <div className="mt-4 bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 text-center">
            {(arriveMutation.error as any)?.message ||
             (completeMutation.error as any)?.message ||
             (skipMutation.error as any)?.message ||
             'Có lỗi xảy ra'}
          </div>
        )}

        {/* Complete order button */}
        {allDone && (
          <div className="mt-6 animate-fade-in">
            <PrimaryButton
              variant="success"
              fullWidth
              size="lg"
              onClick={handleCompleteOrder}
              disabled={completeOrderMutation.isPending}
            >
              {completeOrderMutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Flag className="w-5 h-5" />
                  Hoàn thành chuyến
                </>
              )}
            </PrimaryButton>
          </div>
        )}

        {/* Loading overlay for mutations */}
        {(arriveMutation.isPending || completeMutation.isPending || skipMutation.isPending) && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2 z-50">
            <Loader2 className="w-4 h-4 animate-spin" />
            Đang xử lý...
          </div>
        )}
      </div>
    </div>
  );
}
