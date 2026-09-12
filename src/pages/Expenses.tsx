import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Fuel, Road, ParkingSquare, Package, Camera, Loader2, Wallet } from 'lucide-react';
import { usePrompt, usePromptMutation } from '@/hooks/usePrompt';
import { ScreenHeader } from '@/components/ScreenHeader';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Modal } from '@/components/Modal';
import { LoadingScreen, ErrorScreen } from '@/components/States';
import { formatVND, formatDateTime, EXPENSE_TYPE_LABELS } from '@/utils/format';
import type { Expense, ExpenseType, DispatchOrder } from '@/types';

const typeIcons: Record<ExpenseType, typeof Fuel> = {
  FUEL: Fuel,
  TOLL: Road,
  PARKING: ParkingSquare,
  OTHER: Package,
};

const typeColors: Record<ExpenseType, string> = {
  FUEL: 'bg-amber-50 text-amber-600',
  TOLL: 'bg-blue-50 text-blue-600',
  PARKING: 'bg-purple-50 text-purple-600',
  OTHER: 'bg-gray-100 text-gray-600',
};

export default function Expenses() {
  const { orderId } = useParams<{ orderId: string }>();
  const [modalOpen, setModalOpen] = useState(false);
  const [type, setType] = useState<ExpenseType>('FUEL');
  const [amount, setAmount] = useState('');
  const [liters, setLiters] = useState('');
  const [odometer, setOdometer] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);

  const { data, isLoading, isError, refetch } = usePrompt<{ expenses: Expense[]; total: number }>(
    'GOB4_0100',
    'expenses',
    { orderId: orderId! },
  );

  const { data: order } = usePrompt<DispatchOrder>('GOB1_0200', 'orderDetail', { orderId: orderId! });

  const addMutation = usePromptMutation<Expense>('GOB4_0100', 'addExpense', {
    invalidateKeys: [['GOB4_0100', 'expenses', { orderId }], ['GOB1_0200', 'orderDetail', { orderId }]],
  });

  if (isLoading) return (
    <>
      <ScreenHeader title="Chi phí chuyến" />
      <LoadingScreen />
    </>
  );

  if (isError || !data) return (
    <>
      <ScreenHeader title="Chi phí chuyến" />
      <ErrorScreen message="Không tải được chi phí" />
    </>
  );

  const isCompleted = order?.status === 'COMPLETED';

  const handleAdd = () => {
    const payload: Record<string, unknown> = {
      orderId: orderId!,
      type,
      amount: parseInt(amount, 10) || 0,
    };
    if (type === 'FUEL') {
      payload.liters = parseFloat(liters) || 0;
      payload.odometerKm = parseInt(odometer, 10) || 0;
    }
    if (photoUrl) payload.photoUrl = photoUrl;

    addMutation.mutate(payload as any, {
      onSuccess: () => {
        setModalOpen(false);
        setAmount('');
        setLiters('');
        setOdometer('');
        setPhotoUrl(undefined);
        refetch();
      },
    });
  };

  const handleTakePhoto = () => {
    // Simulate photo capture in web — generate a placeholder
    setPhotoUrl(`https://placehold.co/300x200/2563EB/FFFFFF?text=Hoa+don+${Date.now()}`);
  };

  return (
    <div>
      <ScreenHeader title="Chi phí chuyến" />

      <div className="px-4 py-4 pb-8 space-y-4">
        {/* Total card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white shadow-lg animate-fade-in">
          <div className="flex items-center gap-3 mb-1">
            <Wallet className="w-5 h-5 text-blue-100" />
            <p className="text-sm text-blue-100">Tổng chi phí chuyến</p>
          </div>
          <p className="text-3xl font-bold">{formatVND(data.total)}</p>
          <p className="text-xs text-blue-200 mt-1">{data.expenses.length} khoản chi</p>
        </div>

        {/* Expenses list */}
        {data.expenses.length === 0 ? (
          <div className="card p-8 text-center">
            <Package className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">Chưa có khoản chi nào</p>
          </div>
        ) : (
          <div className="space-y-2">
            {data.expenses.map((exp) => {
              const Icon = typeIcons[exp.type];
              return (
                <div key={exp.id} className="card p-3.5 flex items-center gap-3 animate-fade-in">
                  <div className={`w-10 h-10 rounded-xl ${typeColors[exp.type]} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{EXPENSE_TYPE_LABELS[exp.type]}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{formatDateTime(exp.createdAt)}</span>
                      {exp.liters && <span>· {exp.liters} lít</span>}
                      {exp.odometerKm && <span>· {exp.odometerKm} km</span>}
                    </div>
                  </div>
                  <p className="font-bold text-gray-900 text-sm">{formatVND(exp.amount)}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Error */}
        {addMutation.isError && (
          <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 text-center">
            {(addMutation.error as any)?.message || 'Có lỗi xảy ra khi thêm chi phí'}
          </div>
        )}
      </div>

      {/* FAB */}
      {!isCompleted && (
        <button
          onClick={() => setModalOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 text-white shadow-xl flex items-center justify-center active:scale-90 transition-transform z-50 hover:bg-blue-700"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}

      {/* Add expense modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Thêm khoản chi">
        <div className="space-y-4">
          {/* Type selector */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Loại chi phí</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(EXPENSE_TYPE_LABELS) as ExpenseType[]).map((t) => {
                const Icon = typeIcons[t];
                return (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      type === t
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {EXPENSE_TYPE_LABELS[t]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Số tiền (VNĐ)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="input-field"
            />
          </div>

          {/* Fuel-only fields */}
          {type === 'FUEL' && (
            <div className="grid grid-cols-2 gap-3 animate-fade-in">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Số lít</label>
                <input
                  type="number"
                  value={liters}
                  onChange={(e) => setLiters(e.target.value)}
                  placeholder="0"
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Số km</label>
                <input
                  type="number"
                  value={odometer}
                  onChange={(e) => setOdometer(e.target.value)}
                  placeholder="0"
                  className="input-field"
                />
              </div>
            </div>
          )}

          {/* Photo */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Ảnh hóa đơn</label>
            <button
              onClick={handleTakePhoto}
              className="w-full py-8 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors"
            >
              {photoUrl ? (
                <img src={photoUrl} alt="Hóa đơn" className="max-h-32 rounded-lg" />
              ) : (
                <>
                  <Camera className="w-6 h-6" />
                  <span className="text-sm">Chụp ảnh hóa đơn</span>
                </>
              )}
            </button>
          </div>

          <PrimaryButton
            fullWidth
            size="lg"
            onClick={handleAdd}
            disabled={!amount || addMutation.isPending}
          >
            {addMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Lưu'}
          </PrimaryButton>
        </div>
      </Modal>
    </div>
  );
}
