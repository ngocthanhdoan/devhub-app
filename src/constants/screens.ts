export interface ScreenDef {
  code: string;
  group: string;
  name: string;
  actions: string[];
  path: string;
}

export const SCREENS = {
  GOB0_0100: {
    code: 'GOB0_0100',
    group: 'B0',
    name: 'Dashboard tài xế',
    actions: ['statCards', 'alerts', 'activeOrder'],
    path: 'GO/B0/GOB0_0100',
  },
  GOB1_0100: {
    code: 'GOB1_0100',
    group: 'B1',
    name: 'Danh sách lệnh của tôi',
    actions: ['myOrders'],
    path: 'GO/B1/GOB1_0100',
  },
  GOB1_0200: {
    code: 'GOB1_0200',
    group: 'B1',
    name: 'Chi tiết lệnh',
    actions: ['orderDetail', 'acceptOrder', 'rejectOrder', 'startOrder', 'completeOrder'],
    path: 'GO/B1/GOB1_0200',
  },
  GOB2_0100: {
    code: 'GOB2_0100',
    group: 'B2',
    name: 'Điểm dừng (timeline)',
    actions: ['stops', 'arriveStop', 'completeStop', 'skipStop'],
    path: 'GO/B2/GOB2_0100',
  },
  GOB2_0200: {
    code: 'GOB2_0200',
    group: 'B2',
    name: 'Bản đồ chuyến đi',
    actions: ['mapData', 'sendLocation'],
    path: 'GO/B2/GOB2_0200',
  },
  GOB3_0100: {
    code: 'GOB3_0100',
    group: 'B3',
    name: 'Hành khách theo điểm dừng',
    actions: ['passengersByStop', 'boardPassenger', 'alightPassenger'],
    path: 'GO/B3/GOB3_0100',
  },
  GOB4_0100: {
    code: 'GOB4_0100',
    group: 'B4',
    name: 'Chi phí chuyến',
    actions: ['expenses', 'addExpense'],
    path: 'GO/B4/GOB4_0100',
  },
  GOB5_0100: {
    code: 'GOB5_0100',
    group: 'B5',
    name: 'Lịch sử hoàn thành',
    actions: ['history', 'historyDetail'],
    path: 'GO/B5/GOB5_0100',
  },
  GOB6_0100: {
    code: 'GOB6_0100',
    group: 'B6',
    name: 'Hồ sơ cá nhân',
    actions: ['profile', 'myVehicle'],
    path: 'GO/B6/GOB6_0100',
  },
} as const satisfies Record<string, ScreenDef>;

export type ScreenCode = keyof typeof SCREENS;

export function getScreenUrl(code: ScreenCode): string {
  const screen = SCREENS[code];
  return `/api/GO/${screen.path}/prompt`;
}
