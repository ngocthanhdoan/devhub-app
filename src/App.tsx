import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useIsLoggedIn } from '@/hooks/useAuth';
import { TabLayout } from '@/components/TabLayout';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import OrdersList from '@/pages/OrdersList';
import OrderDetail from '@/pages/OrderDetail';
import Stops from '@/pages/Stops';
import Passengers from '@/pages/Passengers';
import Expenses from '@/pages/Expenses';
import TripMap from '@/pages/TripMap';
import History from '@/pages/History';
import Profile from '@/pages/Profile';
import type { ReactNode } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function ProtectedRoute({ children }: { children: ReactNode }) {
  const isLoggedIn = useIsLoggedIn();
  const location = useLocation();
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}

function TabRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <TabLayout>{children}</TabLayout>
    </ProtectedRoute>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Tab routes */}
      <Route path="/" element={<TabRoute><Dashboard /></TabRoute>} />
      <Route path="/orders" element={<TabRoute><OrdersList /></TabRoute>} />
      <Route path="/history" element={<TabRoute><History /></TabRoute>} />
      <Route path="/profile" element={<TabRoute><Profile /></TabRoute>} />

      {/* Push routes (no tab bar) */}
      <Route path="/order/:orderId" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
      <Route path="/order/:orderId/stops" element={<ProtectedRoute><Stops /></ProtectedRoute>} />
      <Route path="/order/:orderId/stop/:stopId/passengers" element={<ProtectedRoute><Passengers /></ProtectedRoute>} />
      <Route path="/order/:orderId/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
      <Route path="/order/:orderId/map" element={<ProtectedRoute><TripMap /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
