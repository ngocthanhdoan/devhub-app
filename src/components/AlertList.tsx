import { Bell, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import type { Alert } from '@/types';
import { formatDateTime } from '@/utils/format';

interface Props {
  alerts: Alert[];
}

const typeConfig = {
  info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50' },
  warning: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50' },
  success: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
};

export function AlertList({ alerts }: Props) {
  if (!alerts || alerts.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-4">Chưa có thông báo</p>;
  }

  return (
    <div className="space-y-2">
      {alerts.map((alert) => {
        const cfg = typeConfig[alert.type];
        const Icon = cfg.icon;
        return (
          <div key={alert.id} className="card p-3 flex items-start gap-3 animate-fade-in">
            <div className={`w-8 h-8 rounded-lg ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-4 h-4 ${cfg.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm text-gray-900">{alert.title}</p>
                {!alert.read && <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />}
              </div>
              <p className="text-xs text-gray-600 mt-0.5">{alert.body}</p>
              <p className="text-[10px] text-gray-400 mt-1">{formatDateTime(alert.createdAt)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
