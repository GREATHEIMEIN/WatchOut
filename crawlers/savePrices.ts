// ============================================
// Supabase watch_prices 테이블 저장 로직
// ============================================
// lib/supabase.ts 미사용 — Node.js 환경 전용 클라이언트 사용
// (React Native AsyncStorage adapter 불필요)
// ============================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CrawledPrice, SaveResult } from './types';

/** Supabase 클라이언트 초기화 (dotenv 로드 후 호출 필요) */
function createSupabaseClient(): SupabaseClient {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      'Supabase 환경변수 누락: EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY가 .env에 있어야 합니다.'
    );
  }

  return createClient(url, key);
}

/** watches 테이블에서 reference_number → id 매핑 조회 */
async function getWatchIdMap(
  supabase: SupabaseClient,
  refs: string[]
): Promise<Map<string, number>> {
  const { data, error } = await supabase
    .from('watches')
    .select('id, reference_number')
    .in('reference_number', refs);

  if (error) {
    throw new Error(`watches 테이블 조회 실패: ${error.message}`);
  }

  const map = new Map<string, number>();
  for (const row of data ?? []) {
    map.set(row.reference_number as string, row.id as number);
  }
  return map;
}

/** watch_prices 테이블에 INSERT (중복 시 스킵) */
export async function savePrices(prices: CrawledPrice[]): Promise<SaveResult> {
  if (prices.length === 0) {
    return { saved: 0, skipped: 0, failed: 0 };
  }

  const supabase = createSupabaseClient();
  const result: SaveResult = { saved: 0, skipped: 0, failed: 0 };

  // 1. ref → watch_id 매핑 조회
  const refs = [...new Set(prices.map((p) => p.ref))];
  let watchIdMap: Map<string, number>;

  try {
    watchIdMap = await getWatchIdMap(supabase, refs);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`❌ watch_id 조회 실패: ${msg}`);
    console.error('   → Supabase 마이그레이션(00001_create_tables.sql)이 실행되었는지 확인하세요.');
    return { saved: 0, skipped: 0, failed: prices.length };
  }

  // 2. 각 가격 데이터 저장
  for (const p of prices) {
    const watchId = watchIdMap.get(p.ref);

    if (!watchId) {
      console.log(`  ⚠️  watches 테이블에 ref 없음: ${p.ref} (${p.brand} ${p.model}) — 스킵`);
      result.skipped++;
      continue;
    }

    // KRW가 아닌 경우 (EUR 등) 메타 정보 보존용 — watch_prices는 정수 저장
    // EUR 가격은 그대로 저장 (source='chrono24'로 구분 가능)
    const { error } = await supabase
      .from('watch_prices')
      .insert({
        watch_id: watchId,
        price: p.price,
        source: p.source,
        recorded_date: p.date,
        // change_percent는 이전 날짜 데이터와 비교 후 계산 가능하지만, 현재는 null
        change_percent: null,
      });

    if (error) {
      // UNIQUE 제약 위반 (같은 날짜, 같은 source, 같은 watch_id) → 중복 스킵
      if (error.code === '23505') {
        console.log(`  ↩️  중복 스킵: ${p.brand} ${p.model} (${p.source}, ${p.date})`);
        result.skipped++;
      } else {
        console.error(`  ❌ 저장 실패: ${p.brand} ${p.model} — ${error.message}`);
        result.failed++;
      }
    } else {
      console.log(
        `  ✅ 저장: ${p.brand} ${p.model} | ${p.currency}${p.price.toLocaleString()} | ${p.source}`
      );
      result.saved++;
    }
  }

  return result;
}

/** 저장 결과 요약 출력 */
export function printSaveResult(result: SaveResult): void {
  console.log('\n────────────────────────────────');
  console.log(`📊 저장 결과`);
  console.log(`   ✅ 신규 저장: ${result.saved}건`);
  console.log(`   ↩️  중복 스킵: ${result.skipped}건`);
  console.log(`   ❌ 실패: ${result.failed}건`);
  console.log('────────────────────────────────\n');
}
