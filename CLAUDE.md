# CLAUDE.md — WATCHOUT 프로젝트 규칙

## 프로젝트 컨텍스트
WATCHOUT은 럭셔리 시계 시세 조회 + 즉시매입 + P2P 거래 + 커뮤니티를 결합한 React Native (Expo) 앱이다.
개발자는 Hugo (1인 개발). 한국어로 소통한다.

## 세션 시작 시 반드시 할 것
1. `HANDOFF.md`를 읽고 현재 상태를 파악한다
2. `DEV-LOG.md`의 마지막 항목을 확인한다
3. 작업 완료 후 두 파일을 업데이트한다

## 기술 스택 (절대 변경하지 말 것)
- React Native + Expo (Managed Workflow, SDK 52+)
- Expo Router (file-based routing)
- TypeScript (strict mode)
- Supabase (PostgreSQL + Auth + Storage + Realtime)
- Zustand (상태 관리)
- Expo Notifications (푸시)
- Python + Selenium (크롤러, 별도 디렉토리)

## 코딩 규칙
- TypeScript strict mode. `any` 사용 금지
- 컴포넌트: 함수형. React.FC 사용 금지 (일반 function 또는 arrow function)
- 스타일: `StyleSheet.create()` 사용. inline style은 동적 스타일만 허용
- 상태: Zustand store는 기능 단위 분리 (useAuthStore, usePriceStore 등)
- Supabase 호출: `lib/supabase.ts`에서 클라이언트 export
- 에러 핸들링: try-catch 필수, 유저에게 Alert 또는 Toast로 표시
- 네이밍: 파일명 camelCase, 컴포넌트명 PascalCase, 상수 UPPER_SNAKE_CASE
- 주석: 한국어로 작성
- 커밋: conventional commits (feat:, fix:, refactor:, chore:)

## 디자인 시스템
```
메인 배경: #FAFAFA     카드 배경: #FFFFFF
텍스트: #1A1A1A        서브텍스트: #8E8E93
보더: #F0F0F0          액센트: #0A84FF
성공/상승: #34C759     경고/하락: #FF3B30
태그 배경: #F2F2F7
```
- 카드 borderRadius: 14
- 버튼 borderRadius: 12 (메인), 20 (태그/필터)
- 폰트: Pretendard (400, 600, 700, 800)
- 간격 단위: 4, 8, 12, 16, 20, 24, 32

## 폴더 구조 규칙
- `app/` — Expo Router 라우트만
- `components/` — 재사용 UI 컴포넌트
- `store/` — Zustand 스토어
- `lib/` — 유틸리티, Supabase 클라이언트
- `types/` — TypeScript 타입
- `crawlers/` — Python 크롤러 (앱과 별도)

## 작업 완료 시 반드시
1. `HANDOFF.md`의 "현재 완료 상태"와 "다음 세션에서 할 일" 업데이트
2. `DEV-LOG.md`에 작업 내용 기록
3. 변경된 파일 목록 안내

## 절대 하지 말 것
- Redux, MobX 등 다른 상태관리 도입
- Expo Managed에서 eject
- Firebase 사용
- `any` 타입 사용
- `node_modules/`, `.env` 커밋
