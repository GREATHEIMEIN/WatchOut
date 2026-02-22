// v5 프로토타입 기반 더미 데이터

import type {
  WatchWithPrice,
  MockCommunityPost,
  MockTradeItem,
  MockAccessoryItem,
  MockNews,
} from '@/types';

export const MOCK_WATCHES: WatchWithPrice[] = [
  {
    id: 1,
    brand: 'Rolex',
    model: 'Submariner',
    referenceNumber: '126610LN',
    imageUrl: null,
    category: 'diver',
    caseSizeMm: 41,
    createdAt: '2025-01-01',
    price: 13200000,
    change: 2.3,
    history: [12500000, 12800000, 13000000, 12900000, 13100000, 13200000],
  },
  {
    id: 2,
    brand: 'Rolex',
    model: 'Daytona',
    referenceNumber: '116500LN',
    imageUrl: null,
    category: 'chrono',
    caseSizeMm: 40,
    createdAt: '2025-01-01',
    price: 32500000,
    change: -1.1,
    history: [33200000, 33000000, 32800000, 32600000, 32700000, 32500000],
  },
  {
    id: 3,
    brand: 'Rolex',
    model: 'GMT-Master II',
    referenceNumber: '126710BLNR',
    imageUrl: null,
    category: 'pilot',
    caseSizeMm: 40,
    createdAt: '2025-01-01',
    price: 19800000,
    change: 0.8,
    history: [19200000, 19400000, 19500000, 19600000, 19700000, 19800000],
  },
  {
    id: 4,
    brand: 'Omega',
    model: 'Speedmaster',
    referenceNumber: '310.30.42',
    imageUrl: null,
    category: 'chrono',
    caseSizeMm: 42,
    createdAt: '2025-01-01',
    price: 5800000,
    change: -0.5,
    history: [5900000, 5850000, 5900000, 5850000, 5820000, 5800000],
  },
  {
    id: 5,
    brand: 'AP',
    model: 'Royal Oak',
    referenceNumber: '15500ST',
    imageUrl: null,
    category: 'sport',
    caseSizeMm: 41,
    createdAt: '2025-01-01',
    price: 38500000,
    change: 3.1,
    history: [36500000, 37000000, 37500000, 37800000, 38200000, 38500000],
  },
  {
    id: 6,
    brand: 'Rolex',
    model: 'Datejust',
    referenceNumber: '126334',
    imageUrl: null,
    category: 'dress',
    caseSizeMm: 41,
    createdAt: '2025-01-01',
    price: 11500000,
    change: 1.5,
    history: [11000000, 11100000, 11200000, 11300000, 11400000, 11500000],
  },
];

// 커뮤니티 최신글 (v5 COMMUNITY_POSTS 기반)
export const MOCK_COMMUNITY_POSTS: MockCommunityPost[] = [
  { id: 1, title: '데이토나 vs 스피드마스터, 어떤 게 더 나을까요?', author: 'watchlover', comments: 23, likes: 45, time: '30분 전', category: '자유' },
  { id: 2, title: '첫 롤렉스 추천 부탁드립니다 (예산 1500)', author: 'newbie2025', comments: 18, likes: 32, time: '1시간 전', category: '질문' },
  { id: 3, title: '공지: WATCHOUT 오픈 기념 이벤트 안내', author: '관리자', comments: 5, likes: 67, time: '2일 전', category: '공지', pinned: true },
  { id: 4, title: '로열오크 15500ST 실착 후기', author: 'APfan', comments: 31, likes: 89, time: '3시간 전', category: '후기' },
  { id: 5, title: '롤렉스 AD 매장 구매 팁 공유합니다', author: 'rolex_daily', comments: 42, likes: 110, time: '6시간 전', category: '정보' },
  { id: 6, title: '시계 보관함 추천 좀 해주세요', author: 'careful_owner', comments: 15, likes: 28, time: '8시간 전', category: '자유' },
];

// 시계거래 최신 매물 (v5 TRADE_ITEMS 기반)
export const MOCK_TRADE_ITEMS: MockTradeItem[] = [
  { id: 1, brand: 'Rolex', model: '서브마리너 데이트', ref: '126610LN', price: 12800000, condition: 'A급', year: '2023', loc: '서울 강남', kit: '풀박스', badge: 'green', badgeText: '시세 이하', type: 'sell', author: 'watchman', time: '1시간 전' },
  { id: 2, brand: 'Omega', model: '스피드마스터', ref: '310.30.42', price: 5900000, condition: 'S급', year: '2024', loc: '서울 종로', kit: '풀박스+영수증', badge: 'yellow', badgeText: '시세 수준', type: 'sell', author: 'omega_fan', time: '3시간 전' },
  { id: 3, brand: 'Rolex', model: '데이토나', ref: '116500LN', price: 34000000, condition: 'A급', year: '2022', loc: '부산', kit: '보증서만', badge: 'red', badgeText: '시세 이상', type: 'buy', author: 'collector_kr', time: '5시간 전' },
];

// 시계용품 매물 (v5 ACCESSORY_ITEMS 기반)
export const MOCK_ACCESSORY_ITEMS: MockAccessoryItem[] = [
  { id: 10, title: '롤렉스 오이스터 순정 스트랩 (새상품)', price: 450000, category: '스트랩/브레이슬릿', author: 'parts_kr', time: '2시간 전', condition: 'S급' },
  { id: 11, title: '울프 와인더 4구 (British Racing)', price: 680000, category: '와인더/보관함', author: 'luxbox', time: '4시간 전', condition: 'A급' },
  { id: 12, title: '베르종 시계 공구 세트 16종', price: 120000, category: '공구/도구', author: 'toolmaster', time: '6시간 전', condition: 'S급' },
  { id: 13, title: '시계 보호 필름 (41mm용 5매)', price: 15000, category: '보호필름/케이스', author: 'film_shop', time: '1일 전', condition: 'S급' },
];

// 시계 뉴스 (v5 NEWS 기반)
export const MOCK_NEWS: MockNews[] = [
  { id: 1, title: '롤렉스 2025 신작 미리보기: Watches & Wonders', source: 'Hodinkee', time: '2시간 전' },
  { id: 2, title: '오데마 피게, 로열오크 50주년 한정판 추가 발매', source: '바이버 매거진', time: '5시간 전' },
  { id: 3, title: '중고 시계 시장 2025년 전망 리포트', source: 'WatchCharts', time: '1일 전' },
];
