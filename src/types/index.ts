// ===== Core API types =====

export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

export type OrderStatus =
  | 'NEW'
  | 'ASSIGNED'
  | 'ACCEPTED'
  | 'IN_TRANSIT'
  | 'COMPLETED'
  | 'REJECTED'
  | 'CANCELLED';

export type StopStatus = 'PENDING' | 'ARRIVED' | 'DONE' | 'SKIPPED';

export type PassengerAction = 'PICKUP' | 'DROPOFF';

export type ExpenseType = 'FUEL' | 'TOLL' | 'PARKING' | 'OTHER';

// ===== Data models =====

export interface Vehicle {
  id: string;
  plate: string;
  type: string;
  status: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  avatarUrl?: string;
  code: string;
}

export interface Passenger {
  id: string;
  name: string;
  phone: string;
  action: PassengerAction;
  isDone: boolean;
}

export interface Stop {
  id: string;
  sequence: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  etaTime: string;
  arrivedAt: string | null;
  status: StopStatus;
  passengers: Passenger[];
}

export interface Expense {
  id: string;
  orderId: string;
  type: ExpenseType;
  amount: number;
  liters?: number;
  odometerKm?: number;
  photoUrl?: string;
  createdAt: string;
}

export interface DispatchOrder {
  id: string;
  code: string;
  status: OrderStatus;
  vehicle: Vehicle;
  driver: Driver;
  stops: Stop[];
  dispatchAt: string;
  totalExpense: number;
  note: string;
}

export interface TrackingPoint {
  orderId: string;
  vehicleId: string;
  lat: number;
  lng: number;
  speed?: number;
  accuracy?: number;
  recordedAt: string;
}

export interface Alert {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  type: 'info' | 'warning' | 'success';
  read: boolean;
}

export interface StatCardsData {
  todayOrders: number;
  completedOrders: number;
  newOrders: number;
  totalExpense: number;
}

export interface DashboardData {
  driver: Driver;
  vehicle: Vehicle;
  stats: StatCardsData;
  activeOrder: DispatchOrder | null;
  alerts: Alert[];
}

export interface MapData {
  orderId: string;
  stops: Stop[];
  currentLocation: { lat: number; lng: number };
  nextStop: Stop | null;
  distanceToNextKm: number;
}

// ===== Action payload types =====

export interface AcceptOrderPayload {
  orderId: string;
}

export interface RejectOrderPayload {
  orderId: string;
  reason: string;
}

export interface StartOrderPayload {
  orderId: string;
}

export interface CompleteOrderPayload {
  orderId: string;
}

export interface StopActionPayload {
  orderId: string;
  stopId: string;
}

export interface PassengerActionPayload {
  orderId: string;
  stopId: string;
  passengerId: string;
}

export interface AddExpensePayload {
  orderId: string;
  type: ExpenseType;
  amount: number;
  liters?: number;
  odometerKm?: number;
  photoUrl?: string;
}

export interface SendLocationPayload {
  orderId: string;
  lat: number;
  lng: number;
  speed?: number;
  accuracy?: number;
}

export interface LoginPayload {
  phone: string;
  password: string;
}
