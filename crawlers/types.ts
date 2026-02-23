// ============================================
// 크롤러 공유 타입 및 시계 타겟 설정
// ============================================

/** 크롤링으로 수집한 시세 데이터 */
export interface CrawledPrice {
  brand: string;
  model: string;
  ref: string;           // reference_number (watches 테이블 매핑 키)
  price: number;         // 수집 통화 단위의 가격 (KRW 또는 EUR)
  currency: 'KRW' | 'EUR' | 'USD';
  source: 'hisigan' | 'chrono24';
  date: string;          // YYYY-MM-DD
}

/** watch_prices 테이블 저장 결과 */
export interface SaveResult {
  saved: number;         // 신규 저장 건수
  skipped: number;       // 중복으로 스킵한 건수
  failed: number;        // 저장 실패 건수
}

/** 크롤링 대상 시계 설정 */
export interface WatchTarget {
  ref: string;           // DB watches.reference_number
  brand: string;
  model: string;
  hisiganKeyword: string;   // 하이시간 검색어
  chrono24Keyword: string;  // Chrono24 검색어 (영문)
}

/** 크롤링 대상 시계 6개 */
export const WATCH_TARGETS: WatchTarget[] = [
  {
    ref: '126610LN',
    brand: 'Rolex',
    model: 'Submariner',
    hisiganKeyword: '서브마리너 126610LN',
    chrono24Keyword: 'Rolex Submariner 126610LN',
  },
  {
    ref: '116500LN',
    brand: 'Rolex',
    model: 'Daytona',
    hisiganKeyword: '데이토나 116500LN',
    chrono24Keyword: 'Rolex Daytona 116500LN',
  },
  {
    ref: '126710BLNR',
    brand: 'Rolex',
    model: 'GMT-Master II',
    hisiganKeyword: 'GMT 126710BLNR',
    chrono24Keyword: 'Rolex GMT-Master II 126710BLNR',
  },
  {
    ref: '126234',
    brand: 'Rolex',
    model: 'Datejust',
    hisiganKeyword: '데이저스트 126234',
    chrono24Keyword: 'Rolex Datejust 126234',
  },
  {
    ref: '311.30.42.30.01.005',
    brand: 'Omega',
    model: 'Speedmaster',
    hisiganKeyword: '스피드마스터 달탐험',
    chrono24Keyword: 'Omega Speedmaster Moonwatch Professional',
  },
  {
    ref: '15500ST',
    brand: 'AP',
    model: 'Royal Oak',
    hisiganKeyword: '로얄오크 15500ST',
    chrono24Keyword: 'Audemars Piguet Royal Oak 15500ST',
  },
];

/** 오늘 날짜 YYYY-MM-DD 반환 */
export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}
