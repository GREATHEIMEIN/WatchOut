// ============================================
// 크롤러 통합 실행기
// ============================================

import { fetchPrices as fetchHisigan } from './hisigan';
import { fetchPrices as fetchChrono24 } from './chrono24';
import { savePrices, printSaveResult } from './savePrices';
import { CrawledPrice, SaveResult } from './types';

/** 모든 크롤러 순차 실행 + Supabase 저장 */
export async function runAll(): Promise<void> {
  const startTime = Date.now();
  console.log('🕐 WATCHOUT 시세 크롤러 시작');
  console.log(`   실행 시각: ${new Date().toLocaleString('ko-KR')}`);

  const allPrices: CrawledPrice[] = [];

  // 1. 하이시간 크롤링
  try {
    const hisiganPrices = await fetchHisigan();
    allPrices.push(...hisiganPrices);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`❌ 하이시간 크롤러 전체 실패: ${msg}`);
  }

  // 2. Chrono24 크롤링
  try {
    const chrono24Prices = await fetchChrono24();
    allPrices.push(...chrono24Prices);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`❌ Chrono24 크롤러 전체 실패: ${msg}`);
  }

  // 3. 수집 결과 요약
  console.log(`\n📋 수집 완료: 총 ${allPrices.length}건`);

  if (allPrices.length === 0) {
    console.log('⚠️  저장할 데이터가 없습니다. 크롤러 선택자를 확인하세요.');
    return;
  }

  // 4. Supabase 저장
  console.log('\n💾 Supabase 저장 중...');
  let saveResult: SaveResult;

  try {
    saveResult = await savePrices(allPrices);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`❌ 저장 중 오류 발생: ${msg}`);
    return;
  }

  // 5. 결과 요약
  printSaveResult(saveResult);

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`⏱  총 실행 시간: ${elapsed}초`);
}
