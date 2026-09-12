import { useParams, useNavigate } from 'react-router-dom';
import { Phone, CheckCircle2, Circle, ArrowLeft, UserPlus, UserMinus } from 'lucide-react';
import { usePrompt, usePromptMutation } from '@/hooks/usePrompt';
import { ScreenHeader } from '@/components/ScreenHeader';
import { PrimaryButton } from '@/components/PrimaryButton';
import { LoadingScreen, ErrorScreen } from '@/components/States';
import type { Passenger } from '@/types';

export default function Passengers() {
  const { orderId, stopId } = useParams<{ orderId: string; stopId: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = usePrompt<{ pickup: Passenger[]; dropoff: Passenger[] }>(
    'GOB3_0100',
    'passengersByStop',
    { orderId: orderId!, stopId: stopId! },
  );

  const boardMutation = usePromptMutation<Passenger>('GOB3_0100', 'boardPassenger', {
    invalidateKeys: [['GOB3_0100', 'passengersByStop', { orderId, stopId }]],
  });

  const alightMutation = usePromptMutation<Passenger>('GOB3_0100', 'alightPassenger', {
    invalidateKeys: [['GOB3_0100', 'passengersByStop', { orderId, stopId }]],
  });

  if (isLoading) return (
    <>
      <ScreenHeader title="Hành khách" />
      <LoadingScreen />
    </>
  );

  if (isError || !data) return (
    <>
      <ScreenHeader title="Hành khách" />
      <ErrorScreen message="Không tải được danh sách hành khách" />
    </>
  );

  const allPassengers = [...data.pickup, ...data.dropoff];
  const doneCount = allPassengers.filter((p) => p.isDone).length;
  const totalCount = allPassengers.length;
  const allDone = doneCount === totalCount && totalCount > 0;

  const handleToggle = (passenger: Passenger) => {
    if (passenger.isDone) return;
    if (passenger.action === 'PICKUP') {
      boardMutation.mutate(
        { orderId: orderId!, stopId: stopId!, passengerId: passenger.id },
        { onSuccess: () => refetch() },
      );
    } else {
      alightMutation.mutate(
        { orderId: orderId!, stopId: stopId!, passengerId: passenger.id },
        { onSuccess: () => refetch() },
      );
    }
  };

  const renderPassenger = (p: Passenger, action: 'PICKUP' | 'DROPOFF') => (
    <div
      key={p.id}
      className={`card p-3.5 flex items-center gap-3 animate-fade-in ${p.isDone ? 'opacity-60' : ''}`}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
        action === 'PICKUP' ? 'bg-emerald-50' : 'bg-red-50'
      }`}>
        {action === 'PICKUP' ? (
          <UserPlus className={`w-5 h-5 ${p.isDone ? 'text-emerald-400' : 'text-emerald-600'}`} />
        ) : (
          <UserMinus className={`w-5 h-5 ${p.isDone ? 'text-red-300' : 'text-red-500'}`} />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-gray-900 text-sm ${p.isDone ? 'line-through' : ''}`}>{p.name}</p>
        <a
          href={`tel:${p.phone.replace(/\s/g, '')}`}
          className="text-xs text-blue-500 flex items-center gap-1 mt-0.5"
          onClick={(e) => e.stopPropagation()}
        >
          <Phone className="w-3 h-3" />
          {p.phone}
        </a>
      </div>

      <button
        onClick={() => handleToggle(p)}
        disabled={p.isDone}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all flex-shrink-0 ${
          p.isDone
            ? 'bg-emerald-100 text-emerald-600 cursor-default'
            : action === 'PICKUP'
            ? 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95'
            : 'bg-red-500 text-white hover:bg-red-600 active:scale-95'
        }`}
      >
        {p.isDone ? (
          <>
            <CheckCircle2 className="w-4 h-4" />
            {action === 'PICKUP' ? 'Đã lên' : 'Đã xuống'}
          </>
        ) : (
          <>
            <Circle className="w-4 h-4" />
            {action === 'PICKUP' ? 'Lên xe' : 'Xuống xe'}
          </>
        )}
      </button>
    </div>
  );

  return (
    <div>
      <ScreenHeader title="Hành khách" subtitle="Quản lý đón/trả khách" />

      <div className="px-4 py-4 pb-8 space-y-5">
        {/* Progress counter */}
        <div className="card p-4 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-700">Tiến độ xử lý</p>
            <p className="text-sm font-bold text-blue-600">
              {doneCount}/{totalCount} khách
            </p>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${totalCount > 0 ? (doneCount / totalCount) * 100 : 0}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {Math.round((doneCount / totalCount) * 100) || 0}% đã xử lý
          </p>
        </div>

        {/* Pickup group */}
        {data.pickup.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Đón tại điểm này ({data.pickup.length})
            </h3>
            <div className="space-y-2">
              {data.pickup.map((p) => renderPassenger(p, 'PICKUP'))}
            </div>
          </div>
        )}

        {/* Dropoff group */}
        {data.dropoff.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              Trả tại điểm này ({data.dropoff.length})
            </h3>
            <div className="space-y-2">
              {data.dropoff.map((p) => renderPassenger(p, 'DROPOFF'))}
            </div>
          </div>
        )}

        {/* All done → back to stops */}
        {allDone && (
          <div className="animate-fade-in">
            <div className="card p-4 bg-emerald-50 border-emerald-200 text-center mb-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-emerald-700">
                Tất cả hành khách đã xử lý xong!
              </p>
            </div>
            <PrimaryButton fullWidth size="lg" onClick={() => navigate(`/order/${orderId}/stops`)}>
              <ArrowLeft className="w-5 h-5" />
              Quay lại tiến trình
            </PrimaryButton>
          </div>
        )}
      </div>
    </div>
  );
}
