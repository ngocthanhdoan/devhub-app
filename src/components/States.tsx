import { Loader2 } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
    </div>
  );
}

export function ErrorScreen({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-3">
        <span className="text-red-500 text-xl">!</span>
      </div>
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  );
}

export function EmptyScreen({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
        <span className="text-gray-300 text-2xl">∅</span>
      </div>
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  );
}
