// ============================================
// 하이시간 (hisigan.com) 시세 크롤러
// ============================================
// ⚠️ 주의: CSS 선택자는 사이트 구조 변경 시 업데이트 필요
// 실행 전 실제 hisigan.com HTML 구조 확인 후 아래 TODO 항목 수정할 것
// ============================================

import axios from 'axios';
import * as cheerio from 'cheerio';
import { CrawledPrice, WatchTarget, WATCH_TARGETS, getTodayDate } from './types';

const BASE_URL = 'https://www.hisigan.com';
const SEARCH_URL = `${BASE_URL}/search`;

/** axios 기본 설정 */
const http = axios.create({
  timeout: 15000,
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'ko-KR,ko;q=0.9',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  },
});

/** 가격 문자열 → 숫자 변환 (예: "1,234만원" → 12340000) */
function parseKrwPrice(text: string): number | null {
  // "만원" 단위 처리
  const manWon = text.match(/([0-9,]+)\s*만원/);
  if (manWon) {
    const num = parseInt(manWon[1].replace(/,/g, ''), 10);
    return isNaN(num) ? null : num * 10000;
  }

  // 원 단위 처리 (예: "12,340,000원" 또는 "12340000")
  const won = text.match(/([0-9,]+)\s*원?/);
  if (won) {
    const num = parseInt(won[1].replace(/,/g, ''), 10);
    return isNaN(num) ? null : num;
  }

  return null;
}

/** 단일 시계 모델 시세 스크래핑 */
async function scrapeWatch(target: WatchTarget): Promise<CrawledPrice | null> {
  try {
    // TODO: 하이시간 실제 검색 URL 구조 확인 후 수정
    // 예시: https://www.hisigan.com/search?q=서브마리너+126610LN
    const response = await http.get(SEARCH_URL, {
      params: { q: target.hisiganKeyword },
    });

    const $ = cheerio.load(response.data);

    // TODO: 실제 하이시간 HTML 구조 확인 후 선택자 수정
    // 아래는 추정 선택자 — 실제 사이트 확인 필수
    // 일반적으로 시세 사이트는 .price, .watch-price, [data-price] 등을 사용

    let priceText = '';

    // 시도 1: 검색 결과의 첫 번째 시세 카드
    const firstResult = $('.search-result-item, .watch-item, .price-item').first();
    if (firstResult.length > 0) {
      priceText = firstResult.find('.price, .watch-price, .amount').first().text().trim();
    }

    // 시도 2: 페이지 내 가격 패턴 직접 추출 (폴백)
    if (!priceText) {
      $('*').each((_i, el) => {
        const text = $(el).text().trim();
        if (text.includes('만원') && text.length < 30) {
          priceText = text;
          return false; // each 중단
        }
      });
    }

    const price = parseKrwPrice(priceText);
    if (!price) {
      console.log(`  [하이시간] ${target.brand} ${target.model}: 가격 파싱 실패 (텍스트: "${priceText}")`);
      return null;
    }

    console.log(`  [하이시간] ${target.brand} ${target.model}: ₩${price.toLocaleString()}`);
    return {
      brand: target.brand,
      model: target.model,
      ref: target.ref,
      price,
      currency: 'KRW',
      source: 'hisigan',
      date: getTodayDate(),
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`  [하이시간] ${target.brand} ${target.model} 오류: ${msg}`);
    return null;
  }
}

/** 하이시간 전체 시세 수집 */
export async function fetchPrices(): Promise<CrawledPrice[]> {
  console.log('\n📡 하이시간 크롤링 시작...');
  const results: CrawledPrice[] = [];

  for (const target of WATCH_TARGETS) {
    const price = await scrapeWatch(target);
    if (price) results.push(price);

    // 요청 간격 (서버 부하 방지)
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  console.log(`✅ 하이시간: ${results.length}/${WATCH_TARGETS.length}개 수집 완료`);
  return results;
}
