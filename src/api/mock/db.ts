import type {
  DispatchOrder,
  Driver,
  Vehicle,
  Alert,
  Expense,
} from '@/types';

const driver: Driver = {
  id: 'DRV-001',
  name: 'Nguyễn Văn Thành',
  phone: '0901 234 567',
  code: 'TX-001',
};

const vehicle: Vehicle = {
  id: 'VEH-001',
  plate: '51B-1234.56',
  type: 'Xe khách 29 chỗ',
  status: 'HOẠT ĐỘNG',
};

const seedOrders: DispatchOrder[] = [
  {
    id: 'ORD-001',
    code: 'DC-20250912-001',
    status: 'ASSIGNED',
    vehicle,
    driver,
    dispatchAt: '2025-09-12T06:30:00',
    totalExpense: 0,
    note: 'Đón khách đoàn công ty tại Bến xe Miền Đông. Đi đúng giờ.',
    stops: [
      {
        id: 'STP-001-1',
        sequence: 1,
        name: 'Bến xe Miền Đông',
        address: '292 Đinh Bộ Lĩnh, P.26, Q.Bình Thạnh',
        lat: 10.8056,
        lng: 106.6923,
        etaTime: '06:30',
        arrivedAt: null,
        status: 'PENDING',
        passengers: [
          { id: 'PAS-1', name: 'Trần Văn A', phone: '0902 111 222', action: 'PICKUP', isDone: false },
          { id: 'PAS-2', name: 'Lê Thị B', phone: '0902 333 444', action: 'PICKUP', isDone: false },
          { id: 'PAS-3', name: 'Phạm Văn C', phone: '0902 555 666', action: 'PICKUP', isDone: false },
        ],
      },
      {
        id: 'STP-001-2',
        sequence: 2,
        name: 'Ngã 4 Hàng Xanh',
        address: 'Đinh Bộ Lĩnh, P.25, Q.Bình Thạnh',
        lat: 10.7993,
        lng: 106.6956,
        etaTime: '06:50',
        arrivedAt: null,
        status: 'PENDING',
        passengers: [
          { id: 'PAS-4', name: 'Hoàng Thị D', phone: '0903 777 888', action: 'PICKUP', isDone: false },
        ],
      },
      {
        id: 'STP-001-3',
        sequence: 3,
        name: 'Suối Tiên',
        address: 'QL1A, P.Tam Phú, TP. Thủ Đức',
        lat: 10.8720,
        lng: 106.7520,
        etaTime: '07:30',
        arrivedAt: null,
        status: 'PENDING',
        passengers: [
          { id: 'PAS-1', name: 'Trần Văn A', phone: '0902 111 222', action: 'DROPOFF', isDone: false },
          { id: 'PAS-2', name: 'Lê Thị B', phone: '0902 333 444', action: 'DROPOFF', isDone: false },
          { id: 'PAS-3', name: 'Phạm Văn C', phone: '0902 555 666', action: 'DROPOFF', isDone: false },
          { id: 'PAS-4', name: 'Hoàng Thị D', phone: '0903 777 888', action: 'DROPOFF', isDone: false },
        ],
      },
    ],
  },
  {
    id: 'ORD-002',
    code: 'DC-20250912-002',
    status: 'IN_TRANSIT',
    vehicle,
    driver,
    dispatchAt: '2025-09-12T05:00:00',
    totalExpense: 185000,
    note: 'Chuyến đưa khách sân bay. Tránh đường QL1B giờ cao điểm.',
    stops: [
      {
        id: 'STP-002-1',
        sequence: 1,
        name: 'Chợ Bến Thành',
        address: 'Lê Lợi, Q.1, TP.HCM',
        lat: 10.7725,
        lng: 106.6980,
        etaTime: '05:00',
        arrivedAt: '2025-09-12T05:05:00',
        status: 'DONE',
        passengers: [
          { id: 'PAS-5', name: 'Vũ Thị E', phone: '0904 222 333', action: 'PICKUP', isDone: true },
          { id: 'PAS-6', name: 'Đặng Văn F', phone: '0904 444 555', action: 'PICKUP', isDone: true },
        ],
      },
      {
        id: 'STP-002-2',
        sequence: 2,
        name: 'Cầu Sài Gòn',
        address: 'Xa Lộ Hà Nội, Q.9, TP. Thủ Đức',
        lat: 10.8460,
        lng: 106.7420,
        etaTime: '05:40',
        arrivedAt: '2025-09-12T05:42:00',
        status: 'ARRIVED',
        passengers: [
          { id: 'PAS-5', name: 'Vũ Thị E', phone: '0904 222 333', action: 'DROPOFF', isDone: false },
          { id: 'PAS-6', name: 'Đặng Văn F', phone: '0904 444 555', action: 'DROPOFF', isDone: false },
        ],
      },
      {
        id: 'STP-002-3',
        sequence: 3,
        name: 'Sân bay Long Thành',
        address: 'Đường sân bay, H.Long Thành, Đồng Nai',
        lat: 10.8200,
        lng: 106.8000,
        etaTime: '06:30',
        arrivedAt: null,
        status: 'PENDING',
        passengers: [
          { id: 'PAS-7', name: 'Bùi Thị G', phone: '0905 666 777', action: 'DROPOFF', isDone: false },
        ],
      },
    ],
  },
  {
    id: 'ORD-003',
    code: 'DC-20250911-003',
    status: 'COMPLETED',
    vehicle,
    driver,
    dispatchAt: '2025-09-11T14:00:00',
    totalExpense: 520000,
    note: 'Chuyến công tác Bình Dương - TP.HCM.',
    stops: [
      {
        id: 'STP-003-1',
        sequence: 1,
        name: 'Bến xe Bình Dương',
        address: 'QL13, TP. Thủ Dầu Một, Bình Dương',
        lat: 10.9650,
        lng: 106.6880,
        etaTime: '14:00',
        arrivedAt: '2025-09-11T14:03:00',
        status: 'DONE',
        passengers: [
          { id: 'PAS-8', name: 'Ngô Văn H', phone: '0906 888 999', action: 'PICKUP', isDone: true },
        ],
      },
      {
        id: 'STP-003-2',
        sequence: 2,
        name: 'Bến xe Miền Tây',
        address: 'Kinh Dương Vương, Q.Bình Tân, TP.HCM',
        lat: 10.7600,
        lng: 106.6200,
        etaTime: '15:30',
        arrivedAt: '2025-09-11T15:35:00',
        status: 'DONE',
        passengers: [
          { id: 'PAS-8', name: 'Ngô Văn H', phone: '0906 888 999', action: 'DROPOFF', isDone: true },
        ],
      },
    ],
  },
  {
    id: 'ORD-004',
    code: 'DC-20250911-002',
    status: 'COMPLETED',
    vehicle,
    driver,
    dispatchAt: '2025-09-11T08:00:00',
    totalExpense: 340000,
    note: 'Đưa học sinh trường lưu động.',
    stops: [
      {
        id: 'STP-004-1',
        sequence: 1,
        name: 'Trường THPT Nguyễn Du',
        address: 'Lý Chính Thắng, Q.3, TP.HCM',
        lat: 10.7700,
        lng: 106.6850,
        etaTime: '08:00',
        arrivedAt: '2025-09-11T08:02:00',
        status: 'DONE',
        passengers: [
          { id: 'PAS-9', name: 'Đỗ Văn I', phone: '0907 111 222', action: 'PICKUP', isDone: true },
          { id: 'PAS-10', name: 'Hồ Thị K', phone: '0907 333 444', action: 'PICKUP', isDone: true },
        ],
      },
      {
        id: 'STP-004-2',
        sequence: 2,
        name: 'Suối Tiên',
        address: 'QL1A, P.Tam Phú, TP. Thủ Đức',
        lat: 10.8720,
        lng: 106.7520,
        etaTime: '09:00',
        arrivedAt: '2025-09-11T09:05:00',
        status: 'DONE',
        passengers: [
          { id: 'PAS-9', name: 'Đỗ Văn I', phone: '0907 111 222', action: 'DROPOFF', isDone: true },
          { id: 'PAS-10', name: 'Hồ Thị K', phone: '0907 333 444', action: 'DROPOFF', isDone: true },
        ],
      },
    ],
  },
];

const seedExpenses: Expense[] = [
  {
    id: 'EXP-001',
    orderId: 'ORD-002',
    type: 'FUEL',
    amount: 150000,
    liters: 20,
    odometerKm: 25400,
    createdAt: '2025-09-12T05:15:00',
  },
  {
    id: 'EXP-002',
    orderId: 'ORD-002',
    type: 'TOLL',
    amount: 35000,
    createdAt: '2025-09-12T05:30:00',
  },
  {
    id: 'EXP-003',
    orderId: 'ORD-003',
    type: 'FUEL',
    amount: 380000,
    liters: 50,
    odometerKm: 25300,
    createdAt: '2025-09-11T14:30:00',
  },
  {
    id: 'EXP-004',
    orderId: 'ORD-003',
    type: 'TOLL',
    amount: 65000,
    createdAt: '2025-09-11T15:00:00',
  },
  {
    id: 'EXP-005',
    orderId: 'ORD-003',
    type: 'PARKING',
    amount: 75000,
    createdAt: '2025-09-11T16:00:00',
  },
  {
    id: 'EXP-006',
    orderId: 'ORD-004',
    type: 'FUEL',
    amount: 280000,
    liters: 37,
    odometerKm: 25200,
    createdAt: '2025-09-11T08:30:00',
  },
  {
    id: 'EXP-007',
    orderId: 'ORD-004',
    type: 'PARKING',
    amount: 60000,
    createdAt: '2025-09-11T09:30:00',
  },
];

const seedAlerts: Alert[] = [
  {
    id: 'ALT-1',
    title: 'Lệnh mới',
    body: 'Bạn có lệnh điều chuyển DC-20250912-001 chờ nhận.',
    createdAt: '2025-09-12T04:00:00',
    type: 'info',
    read: false,
  },
  {
    id: 'ALT-2',
    title: 'Chuyến đang chạy',
    body: 'Chuyến DC-20250912-002 đang trong tiến trình. Vui lòng cập nhật điểm dừng.',
    createdAt: '2025-09-12T05:10:00',
    type: 'warning',
    read: false,
  },
  {
    id: 'ALT-3',
    title: 'Hoàn thành chuyến',
    body: 'Chuyến DC-20250911-003 đã hoàn thành. Tổng chi phí: 520.000đ.',
    createdAt: '2025-09-11T16:30:00',
    type: 'success',
    read: true,
  },
];

export interface MockDB {
  driver: Driver;
  vehicle: Vehicle;
  orders: DispatchOrder[];
  expenses: Expense[];
  alerts: Alert[];
  auth: {
    isLoggedIn: boolean;
    phone: string | null;
  };
}

export const db: MockDB = {
  driver,
  vehicle,
  orders: seedOrders,
  expenses: seedExpenses,
  alerts: seedAlerts,
  auth: {
    isLoggedIn: false,
    phone: null,
  },
};
