// 디자인 시스템 상수 — v5 프로토타입 기준

export const COLORS = {
  bg: '#FAFAFA',
  card: '#FFFFFF',
  text: '#1A1A1A',
  sub: '#8E8E93',
  border: '#F0F0F0',
  accent: '#0A84FF',
  green: '#34C759',
  red: '#FF3B30',
  orange: '#FF9500',
  tag: '#F2F2F7',
  // 다크 테마 / 골드 액센트
  headerBg: '#0C0C14',
  tabBg: '#0C0C14',
  pageBg: '#F5F5F7',
  gold: '#C9A84C',
  goldMuted: '#F0E4C2',
} as const;

export const FONTS = {
  regular: '400' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
} as const;

export const RADIUS = {
  card: 14,
  button: 12,
  tag: 20,
  input: 10,
} as const;

// 매입 가능 브랜드 목록
export const BRANDS = [
  'ROLEX',
  'Patek Philippe',
  'Audemars Piguet',
  'Omega',
  'Cartier',
  'IWC',
  'Panerai',
] as const;

// 시계 컨디션
export const CONDITIONS = [
  { value: 'S', label: 'S급', description: '미착용·새상품' },
  { value: 'A', label: 'A급', description: '양호한 상태' },
  { value: 'B', label: 'B급', description: '사용감 있음' },
] as const;

// 구성품 목록
export const KIT_OPTIONS = [
  '풀박스',
  '보증서/워런티',
  '영수증',
  '여분 링크',
  '설명서',
] as const;
