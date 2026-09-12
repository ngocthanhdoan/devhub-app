import { db } from './db';
import type {
  ApiResponse,
  DispatchOrder,
  OrderStatus,
  Stop,
  StopStatus,
  Alert,
  Expense,
  DashboardData,
  StatCardsData,
  MapData,
  Vehicle,
  Driver,
  Passenger,
} from '@/types';

function ok<T>(data: T): ApiResponse<T> {
  return { code: 200, message: 'OK', data };
}

function error(code: number, message: string): ApiResponse<never> {
  return { code, message, data: null as never };
}

function calcTotalExpense(orderId: string): number {
  return db.expenses
    .filter((e) => e.orderId === orderId)
    .reduce((sum, e) => sum + e.amount, 0);
}

function findOrder(orderId: string): DispatchOrder | undefined {
  return db.orders.find((o) => o.id === orderId);
}

function calcDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10;
}

// ===== GOB0_0100: Dashboard =====

function handleStatCards(): ApiResponse<StatCardsData> {
  const today = '2025-09-12';
  const todayOrders = db.orders.filter((o) => o.dispatchAt.startsWith(today)).length;
  const completedOrders = db.orders.filter(
    (o) => o.status === 'COMPLETED' && o.dispatchAt.startsWith(today),
  ).length;
  const newOrders = db.orders.filter((o) => o.status === 'ASSIGNED').length;
  const totalExpense = db.orders
    .filter((o) => o.dispatchAt.startsWith(today))
    .reduce((sum, o) => sum + calcTotalExpense(o.id), 0);
  return ok({ todayOrders, completedOrders, newOrders, totalExpense });
}

function handleAlerts(): ApiResponse<Alert[]> {
  return ok(db.alerts);
}

function handleActiveOrder(): ApiResponse<DispatchOrder | null> {
  const active = db.orders.find((o) => o.status === 'IN_TRANSIT' || o.status === 'ACCEPTED');
  return ok(active ?? null);
}

function handleDashboard(): ApiResponse<DashboardData> {
  const stats = handleStatCards().data;
  const alerts = handleAlerts().data;
  const activeOrder = handleActiveOrder().data;
  return ok({ driver: db.driver, vehicle: db.vehicle, stats, activeOrder, alerts });
}

// ===== GOB1_0100: Orders list =====

function handleMyOrders(payload: { filter?: string }): ApiResponse<DispatchOrder[]> {
  const filter = payload?.filter || 'ALL';
  if (filter === 'ALL') return ok(db.orders);
  const statusMap: Record<string, string> = {
    'CHỜ NHẬN': 'ASSIGNED',
    'ĐANG CHẠY': 'ACCEPTED',
    'HOÀN THÀNH': 'COMPLETED',
    'TỪ CHỐI': 'REJECTED',
  };
  const statusFilter = statusMap[filter] || filter;
  return ok(db.orders.filter((o) => o.status === statusFilter));
}

// ===== GOB1_0200: Order detail =====

function handleOrderDetail(payload: { orderId: string }): ApiResponse<DispatchOrder | null> {
  const order = findOrder(payload.orderId);
  if (!order) return error(404, 'Không tìm thấy lệnh');
  return ok({ ...order, totalExpense: calcTotalExpense(order.id) });
}

function handleAcceptOrder(payload: { orderId: string }): ApiResponse<DispatchOrder> {
  const order = findOrder(payload.orderId);
  if (!order) return error(404, 'Không tìm thấy lệnh');
  if (order.status !== 'ASSIGNED') return error(409, 'Lệnh không ở trạng thái chờ nhận');
  order.status = 'ACCEPTED';
  return ok({ ...order, totalExpense: calcTotalExpense(order.id) });
}

function handleRejectOrder(payload: { orderId: string; reason: string }): ApiResponse<DispatchOrder> {
  const order = findOrder(payload.orderId);
  if (!order) return error(404, 'Không tìm thấy lệnh');
  if (order.status !== 'ASSIGNED') return error(409, 'Lệnh không ở trạng thái chờ nhận');
  order.status = 'REJECTED';
  order.note = order.note + ` | Lý do từ chối: ${payload.reason}`;
  return ok({ ...order, totalExpense: calcTotalExpense(order.id) });
}

function handleStartOrder(payload: { orderId: string }): ApiResponse<DispatchOrder> {
  const order = findOrder(payload.orderId);
  if (!order) return error(404, 'Không tìm thấy lệnh');
  if (order.status !== 'ACCEPTED') return error(409, 'Lệnh chưa được nhận');
  order.status = 'IN_TRANSIT';
  return ok({ ...order, totalExpense: calcTotalExpense(order.id) });
}

function handleCompleteOrder(payload: { orderId: string }): ApiResponse<DispatchOrder> {
  const order = findOrder(payload.orderId);
  if (!order) return error(404, 'Không tìm thấy lệnh');
  if (order.status !== 'IN_TRANSIT') return error(409, 'Lệnh không ở trạng thái đang chạy');
  const allDone = order.stops.every((s) => s.status === 'DONE' || s.status === 'SKIPPED');
  if (!allDone) return error(409, 'Còn điểm dừng chưa hoàn thành');
  order.status = 'COMPLETED';
  return ok({ ...order, totalExpense: calcTotalExpense(order.id) });
}

// ===== GOB2_0100: Stops =====

function handleStops(payload: { orderId: string }): ApiResponse<Stop[]> {
  const order = findOrder(payload.orderId);
  if (!order) return error(404, 'Không tìm thấy lệnh');
  return ok(order.stops);
}

function getCurrentStop(order: DispatchOrder): Stop | undefined {
  return order.stops.find((s) => s.status === 'ARRIVED') || order.stops.find((s) => s.status === 'PENDING');
}

function handleArriveStop(payload: { orderId: string; stopId: string }): ApiResponse<Stop[]> {
  const order = findOrder(payload.orderId);
  if (!order) return error(404, 'Không tìm thấy lệnh');
  const stop = order.stops.find((s) => s.id === payload.stopId);
  if (!stop) return error(404, 'Không tìm thấy điểm dừng');
  if (stop.status !== 'PENDING') return error(409, 'Điểm dừng không ở trạng thái chờ');

  const currentStop = getCurrentStop(order);
  if (currentStop && currentStop.id !== stop.id) {
    return error(409, 'Vui lòng hoàn thành điểm dừng hiện tại trước');
  }

  stop.status = 'ARRIVED';
  stop.arrivedAt = new Date().toISOString();
  return ok(order.stops);
}

function handleCompleteStop(payload: { orderId: string; stopId: string }): ApiResponse<Stop[]> {
  const order = findOrder(payload.orderId);
  if (!order) return error(404, 'Không tìm thấy lệnh');
  const stop = order.stops.find((s) => s.id === payload.stopId);
  if (!stop) return error(404, 'Không tìm thấy điểm dừng');
  if (stop.status !== 'ARRIVED') return error(409, 'Điểm dừng chưa đến nơi');
  stop.status = 'DONE';
  stop.passengers.forEach((p) => (p.isDone = true));
  return ok(order.stops);
}

function handleSkipStop(payload: { orderId: string; stopId: string }): ApiResponse<Stop[]> {
  const order = findOrder(payload.orderId);
  if (!order) return error(404, 'Không tìm thấy lệnh');
  const stop = order.stops.find((s) => s.id === payload.stopId);
  if (!stop) return error(404, 'Không tìm thấy điểm dừng');
  if (stop.status !== 'ARRIVED') return error(409, 'Điểm dừng chưa đến nơi');
  stop.status = 'SKIPPED';
  return ok(order.stops);
}

// ===== GOB2_0200: Map =====

function handleMapData(payload: { orderId: string }): ApiResponse<MapData> {
  const order = findOrder(payload.orderId);
  if (!order) return error(404, 'Không tìm thấy lệnh');
  const nextStop = order.stops.find((s) => s.status === 'PENDING' || s.status === 'ARRIVED') || null;
  const currentLocation = nextStop
    ? { lat: nextStop.lat - 0.01, lng: nextStop.lng - 0.005 }
    : { lat: order.stops[0].lat, lng: order.stops[0].lng };
  const distanceToNextKm = nextStop
    ? calcDistanceKm(currentLocation.lat, currentLocation.lng, nextStop.lat, nextStop.lng)
    : 0;
  return ok({ orderId: order.id, stops: order.stops, currentLocation, nextStop, distanceToNextKm });
}

function handleSendLocation(payload: { orderId: string; lat: number; lng: number }): ApiResponse<{ success: boolean }> {
  return ok({ success: true });
}

// ===== GOB3_0100: Passengers =====

function handlePassengersByStop(payload: { orderId: string; stopId: string }): ApiResponse<{ pickup: Passenger[]; dropoff: Passenger[] }> {
  const order = findOrder(payload.orderId);
  if (!order) return error(404, 'Không tìm thấy lệnh');
  const stop = order.stops.find((s) => s.id === payload.stopId);
  if (!stop) return error(404, 'Không tìm thấy điểm dừng');
  const pickup = stop.passengers.filter((p) => p.action === 'PICKUP');
  const dropoff = stop.passengers.filter((p) => p.action === 'DROPOFF');
  return ok({ pickup, dropoff });
}

function handleBoardPassenger(payload: { orderId: string; stopId: string; passengerId: string }): ApiResponse<Passenger> {
  const order = findOrder(payload.orderId);
  if (!order) return error(404, 'Không tìm thấy lệnh');
  const stop = order.stops.find((s) => s.id === payload.stopId);
  if (!stop) return error(404, 'Không tìm thấy điểm dừng');
  const passenger = stop.passengers.find((p) => p.id === payload.passengerId);
  if (!passenger) return error(404, 'Không tìm thấy hành khách');
  if (passenger.action !== 'PICKUP') return error(409, 'Hành khách không phải loại đón');
  passenger.isDone = true;
  return ok(passenger);
}

function handleAlightPassenger(payload: { orderId: string; stopId: string; passengerId: string }): ApiResponse<Passenger> {
  const order = findOrder(payload.orderId);
  if (!order) return error(404, 'Không tìm thấy lệnh');
  const stop = order.stops.find((s) => s.id === payload.stopId);
  if (!stop) return error(404, 'Không tìm thấy điểm dừng');
  const passenger = stop.passengers.find((p) => p.id === payload.passengerId);
  if (!passenger) return error(404, 'Không tìm thấy hành khách');
  if (passenger.action !== 'DROPOFF') return error(409, 'Hành khách không phải loại trả');
  passenger.isDone = true;
  return ok(passenger);
}

// ===== GOB4_0100: Expenses =====

function handleExpenses(payload: { orderId: string }): ApiResponse<{ expenses: Expense[]; total: number }> {
  const order = findOrder(payload.orderId);
  if (!order) return error(404, 'Không tìm thấy lệnh');
  const expenses = db.expenses.filter((e) => e.orderId === payload.orderId);
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  return ok({ expenses, total });
}

function handleAddExpense(payload: {
  orderId: string;
  type: Expense['type'];
  amount: number;
  liters?: number;
  odometerKm?: number;
  photoUrl?: string;
}): ApiResponse<Expense> {
  const order = findOrder(payload.orderId);
  if (!order) return error(404, 'Không tìm thấy lệnh');
  if (order.status === 'COMPLETED') return error(409, 'Không thể thêm chi phí cho chuyến đã hoàn thành');
  const expense: Expense = {
    id: `EXP-${Date.now()}`,
    orderId: payload.orderId,
    type: payload.type,
    amount: payload.amount,
    liters: payload.liters,
    odometerKm: payload.odometerKm,
    photoUrl: payload.photoUrl,
    createdAt: new Date().toISOString(),
  };
  db.expenses.push(expense);
  order.totalExpense = calcTotalExpense(payload.orderId);
  return ok(expense);
}

// ===== GOB5_0100: History =====

function handleHistory(): ApiResponse<DispatchOrder[]> {
  return ok(db.orders.filter((o) => o.status === 'COMPLETED'));
}

function handleHistoryDetail(payload: { orderId: string }): ApiResponse<DispatchOrder | null> {
  const order = findOrder(payload.orderId);
  if (!order || order.status !== 'COMPLETED') return error(404, 'Không tìm thấy chuyến');
  return ok({ ...order, totalExpense: calcTotalExpense(order.id) });
}

// ===== GOB6_0100: Profile =====

function handleProfile(): ApiResponse<{ driver: Driver; vehicle: Vehicle }> {
  return ok({ driver: db.driver, vehicle: db.vehicle });
}

function handleMyVehicle(): ApiResponse<Vehicle> {
  return ok(db.vehicle);
}

// ===== Login =====

function handleLogin(payload: { phone: string; password: string }): ApiResponse<{ driver: Driver; token: string }> {
  db.auth.isLoggedIn = true;
  db.auth.phone = payload.phone;
  return ok({ driver: db.driver, token: 'mock-token-' + Date.now() });
}

function handleLogout(): ApiResponse<{ success: boolean }> {
  db.auth.isLoggedIn = false;
  db.auth.phone = null;
  return ok({ success: true });
}

// ===== Dispatch =====

interface HandlerEntry {
  screen: string;
  handlers: Record<string, (payload: any) => ApiResponse<any>>;
}

const registry: Record<string, Record<string, (payload: any) => ApiResponse<any>>> = {
  GOB0_0100: {
    statCards: handleStatCards,
    alerts: handleAlerts,
    activeOrder: handleActiveOrder,
    dashboard: handleDashboard,
  },
  GOB1_0100: {
    myOrders: handleMyOrders,
  },
  GOB1_0200: {
    orderDetail: handleOrderDetail,
    acceptOrder: handleAcceptOrder,
    rejectOrder: handleRejectOrder,
    startOrder: handleStartOrder,
    completeOrder: handleCompleteOrder,
  },
  GOB2_0100: {
    stops: handleStops,
    arriveStop: handleArriveStop,
    completeStop: handleCompleteStop,
    skipStop: handleSkipStop,
  },
  GOB2_0200: {
    mapData: handleMapData,
    sendLocation: handleSendLocation,
  },
  GOB3_0100: {
    passengersByStop: handlePassengersByStop,
    boardPassenger: handleBoardPassenger,
    alightPassenger: handleAlightPassenger,
  },
  GOB4_0100: {
    expenses: handleExpenses,
    addExpense: handleAddExpense,
  },
  GOB5_0100: {
    history: handleHistory,
    historyDetail: handleHistoryDetail,
  },
  GOB6_0100: {
    profile: handleProfile,
    myVehicle: handleMyVehicle,
  },
  LOGIN: {
    login: handleLogin,
    logout: handleLogout,
  },
};

export function mockPrompt(screenCode: string, action: string, payload?: any): ApiResponse<any> {
  const screenHandlers = registry[screenCode];
  if (!screenHandlers) return error(404, `Không tìm thấy màn hình: ${screenCode}`);
  const handler = screenHandlers[action];
  if (!handler) return error(400, `Action không hợp lệ: ${action}`);
  return handler(payload || {});
}
