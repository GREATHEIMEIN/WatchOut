// ============================================
// 크롤러 실행 진입점
// 사용법: npm run crawl
//         또는: npx ts-node --project crawlers/tsconfig.json crawlers/run.ts
// ============================================

// dotenv 로드 — 반드시 다른 import보다 먼저 실행
import * as dotenv from 'dotenv';
dotenv.config();

import { runAll } from './index';

runAll().catch((error) => {
  console.error('❌ 크롤러 실행 중 예상치 못한 오류:', error);
  process.exit(1);
});
