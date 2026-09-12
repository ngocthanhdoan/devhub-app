import { Check, MapPin, Users, Clock, ChevronRight, SkipForward } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Stop, StopStatus } from '@/types';
import { formatTime } from '@/utils/format';
import { PrimaryButton } from './PrimaryButton';

interface Props {
  stops: Stop[];
  orderId: string;
  onArrive: (stopId: string) => void;
  onComplete: (stopId: string) => void;
  onSkip: (stopId: string) => void;
}

const statusConfig: Record<StopStatus, { dot: string; bg: string; text: string; line: string }> = {
  DONE: { dot: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700', line: 'bg-emerald-400' },
  ARRIVED: { dot: 'bg-blue-500', bg: 'bg-blue-50', text: 'text-blue-700', line: 'bg-blue-300' },
  PENDING: { dot: 'bg-gray-300', bg: 'bg-gray-50', text: 'text-gray-500', line: 'bg-gray-200' },
  SKIPPED: { dot: 'bg-red-400', bg: 'bg-red-50', text: 'text-red-500', line: 'bg-red-200' },
};

export function StopTimeline({ stops, orderId, onArrive, onComplete, onSkip }: Props) {
  const sorted = [...stops].sort((a, b) => a.sequence - b.sequence);
  const currentStop = sorted.find((s) => s.status === 'ARRIVED') || sorted.find((s) => s.status === 'PENDING');

  return (
    <div className="relative">
      {sorted.map((stop, index) => {
        const cfg = statusConfig[stop.status];
        const isLast = index === sorted.length - 1;
        const isCurrent = currentStop?.id === stop.id && stop.status !== 'DONE' && stop.status !== 'SKIPPED';
        const isLocked = currentStop && currentStop.id !== stop.id && stop.status === 'PENDING';

        return (
          <div key={stop.id} className="relative flex gap-4 pb-6 last:pb-0">
            {/* Vertical line */}
            {!isLast && (
              <div
                className={`absolute left-[18px] top-10 bottom-0 w-0.5 ${
                  stop.status === 'DONE' || stop.status === 'SKIPPED' ? cfg.line : 'bg-gray-200'
                }`}
              />
            )}

            {/* Dot */}
            <div className="flex-shrink-0 relative z-10">
              <div
                className={`w-9 h-9 rounded-full ${cfg.bg} flex items-center justify-center ${
                  isCurrent ? 'ring-4 ring-blue-100' : ''
                }`}
              >
                {stop.status === 'DONE' ? (
                  <Check className={`w-5 h-5 ${cfg.text}`} />
                ) : stop.status === 'SKIPPED' ? (
                  <SkipForward className={`w-4 h-4 ${cfg.text}`} />
                ) : (
                  <span className={`text-sm font-bold ${cfg.text}`}>{stop.sequence}</span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className={`flex-1 ${stop.status === 'PENDING' && !isCurrent ? 'opacity-50' : ''}`}>
              <div className={`card p-4 ${isCurrent ? 'ring-2 ring-blue-400' : ''}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{stop.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{stop.address}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text} flex-shrink-0 ml-2`}>
                    {stop.status === 'DONE' ? 'Hoàn tất' : stop.status === 'ARRIVED' ? 'Đã đến' : stop.status === 'SKIPPED' ? 'Bỏ qua' : 'Chưa đến'}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Dự kiến {stop.etaTime}
                  </span>
                  {stop.arrivedAt && (
                    <span className="flex items-center gap-1 text-emerald-600">
                      <Check className="w-3 h-3" />
                      {formatTime(stop.arrivedAt)}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {stop.passengers.length} khách
                  </span>
                </div>

                {/* Actions for current stop */}
                {isCurrent && (
                  <div className="mt-3 space-y-2 animate-fade-in">
                    {stop.status === 'PENDING' && (
                      <PrimaryButton
                        variant="primary"
                        fullWidth
                        size="sm"
                        onClick={() => onArrive(stop.id)}
                      >
                        <MapPin className="w-4 h-4" />
                        Đã đến
                      </PrimaryButton>
                    )}
                    {stop.status === 'ARRIVED' && (
                      <>
                        <div className="flex gap-2">
                          <PrimaryButton
                            variant="success"
                            fullWidth
                            size="sm"
                            onClick={() => onComplete(stop.id)}
                          >
                            <Check className="w-4 h-4" />
                            Hoàn tất điểm
                          </PrimaryButton>
                          <PrimaryButton
                            variant="danger"
                            size="sm"
                            onClick={() => onSkip(stop.id)}
                          >
                            <SkipForward className="w-4 h-4" />
                          </PrimaryButton>
                        </div>
                        <Link
                          to={`/order/${orderId}/stop/${stop.id}/passengers`}
                          className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-blue-50 text-blue-600 text-sm font-medium hover:bg-blue-100 transition-colors"
                        >
                          <Users className="w-4 h-4" />
                          Hành khách
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </>
                    )}
                  </div>
                )}

                {isLocked && (
                  <div className="mt-2 text-xs text-gray-400 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                    Đang khóa — hoàn thành điểm trước
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
