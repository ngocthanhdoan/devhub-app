import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Lock, Truck, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useLogin } from '@/hooks/useAuth';

export default function Login() {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(
      { phone, password },
      {
        onSuccess: () => navigate('/'),
      },
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800 flex flex-col max-w-md mx-auto">
      {/* Header / Logo */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8">
        <div className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-5">
          <Truck className="w-10 h-10 text-blue-600" />
        </div>
        <h1 className="text-white text-2xl font-bold">DevHub Solutions</h1>
        <p className="text-blue-100 text-sm mt-1">Hệ thống điều chuyển xe</p>
      </div>

      {/* Login Form */}
      <div className="bg-white rounded-t-3xl px-6 pt-8 pb-10 shadow-2xl">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Đăng nhập</h2>
        <p className="text-sm text-gray-400 mb-6">Nhập số điện thoại và mật khẩu để tiếp tục</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Số điện thoại</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0901 234 567"
                className="input-field pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Mật khẩu</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {loginMutation.isError && (
            <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3">
              Đăng nhập thất bại. Vui lòng thử lại.
            </div>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2"
          >
            {loginMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Đang đăng nhập...
              </>
            ) : (
              'Đăng nhập'
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Nhập bất kỳ SĐT và mật khẩu nào để vào (mock mode)
        </p>
      </div>
    </div>
  );
}
