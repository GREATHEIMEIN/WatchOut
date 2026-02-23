// ============================================
// Chrono24 (chrono24.com) 시세 크롤러
// ============================================
// ⚠️ 주의: CSS 선택자는 사이트 구조 변경 시 업데이트 필요
// Chrono24는 대형 글로벌 마켓플레이스 — EUR 가격 수집 (KRW 환산 없음)
// 실행 전 실제 chrono24.com HTML 구조 확인 후 아래 TODO 항목 수정할 것
// ============================================

import axios from 'axios';
import * as cheerio from 'cheerio';
import { CrawledPrice, WatchTarget, WATCH_TARGETS, getTodayDate } from './types';

const SEARCH_URL = 'https://www.chrono24.com/search/index.htm';

/** axios 기본 설정 */
const http = axios.create({
  timeout: 20000,
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    Referer: 'https://www.chrono24.com/',
  },
});

/** EUR 가격 문자열 → 숫자 변환 (예: "€ 12,345" → 12345) */
function parseEurPrice(text: string): number | null {
  // EUR 기호 제거 후 숫자 추출
  const cleaned = text.replace(/[€$£,\s]/g, '');
  const num = parseInt(cleaned, 10);
  return isNaN(num) ? null : num;
}

/** 검색 결과에서 중간 가격 계산 (최저 5개 평균) */
function calculateMedianPrice(prices: number[]): number | null {
  if (prices.length === 0) return null;
  const sorted = [...prices].sort((a, b) => a - b);
  // 상위 10%와 하위 10% 제외한 중간값 사용
  const trimCount = Math.floor(sorted.length * 0.1);
  const trimmed = sorted.slice(trimCount, sorted.length - trimCount);
  if (trimmed.length === 0) return sorted[Math.floor(sorted.length / 2)];
  const sum = trimmed.reduce((acc, p) => acc + p, 0);
  return Math.round(sum / trimmed.length);
}

/** 단일 시계 모델 시세 스크래핑 */
async function scrapeWatch(target: WatchTarget): Promise<CrawledPrice | null> {
  try {
    // TODO: Chrono24 실제 검색 URL 파라미터 확인 후 수정
    // 예: https://www.chrono24.com/search/index.htm?query=Rolex+Submariner+126610LN&dosearch=true
    const response = await http.get(SEARCH_URL, {
      params: {
        query: target.chrono24Keyword,
        dosearch: 'true',
        watchTypes: 'U',   // Used watches
        sortorder: '5',    // 가격 오름차순
      },
    });

    const $ = cheerio.load(response.data);
    const prices: number[] = [];

    // TODO: 실제 Chrono24 HTML 구조 확인 후 선택자 수정
    // Chrono24 검색 결과의 가격 선택자 (일반적인 패턴)
    // 실제 선택자 예시: '.article-price', '.price', '[class*="price"]'
    $('.article-price, .js-article-price, [class*="article"] [class*="price"]').each((_i, el) => {
      const text = $(el).text().trim();
      const price = parseEurPrice(text);
      if (price && price > 1000) { // 1,000 EUR 미만은 제외 (광고 등)
        prices.push(price);
      }
    });

    // 폴백: data-price 속성 직접 추출
    if (prices.length === 0) {
      $('[data-price], [data-listing-price]').each((_i, el) => {
        const priceAttr = $(el).attr('data-price') ?? $(el).attr('data-listing-price') ?? '';
        const price = parseEurPrice(priceAttr);
        if (price && price > 1000) prices.push(price);
      });
    }

    if (prices.length === 0) {
      console.log(`  [Chrono24] ${target.brand} ${target.model}: 가격 데이터 없음`);
      return null;
    }

    const medianPrice = calculateMedianPrice(prices);
    if (!medianPrice) return null;

    console.log(
      `  [Chrono24] ${target.brand} ${target.model}: €${medianPrice.toLocaleString()} (${prices.length}개 매물 기준)`
    );

    return {
      brand: target.brand,
      model: target.model,
      ref: target.ref,
      price: medianPrice,
      currency: 'EUR',
      source: 'chrono24',
      date: getTodayDate(),
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`  [Chrono24] ${target.brand} ${target.model} 오류: ${msg}`);
    return null;
  }
}

/** Chrono24 전체 시세 수집 */
export async function fetchPrices(): Promise<CrawledPrice[]> {
  console.log('\n📡 Chrono24 크롤링 시작...');
  const results: CrawledPrice[] = [];

  for (const target of WATCH_TARGETS) {
    const price = await scrapeWatch(target);
    if (price) results.push(price);

    // 요청 간격 (서버 부하 방지 + 차단 방지)
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  console.log(`✅ Chrono24: ${results.length}/${WATCH_TARGETS.length}개 수집 완료`);
  return results;
}
