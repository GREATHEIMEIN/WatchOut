# WATCHOUT — HANDOFF.md
> **마지막 업데이트:** 2026-02-22 (SESSION 5 완료 — 시계거래 마켓플레이스)
> **현재 Phase:** Phase 1 — 앱 개발 시작

---

## 📋 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 서비스명 | WATCHOUT (워치아웃) |
| 포지셔닝 | 럭셔리 시계 시세 조회 + 즉시매입 + P2P 거래 + 커뮤니티 |
| 타겟 유저 | 한국 내 럭셔리 시계 소유자 및 관심자 (25~45세 남성 중심) |
| 수익 모델 | 즉시매입 마진 (10~15%) + P2P 거래 수수료 (3~5%) |
| 경쟁자 | 바이버(VIVER), 하이시간 |
| 차별점 | 즉시 현금화 + 무료 시세 데이터 + 커뮤니티 |

---

## 🛠 확정된 기술 스택

| 레이어 | 기술 | 비고 |
|--------|------|------|
| **프론트엔드** | React Native + Expo (Managed Workflow) | Expo Router 사용 |
| **백엔드/DB** | Supabase (PostgreSQL + Auth + Storage + Realtime) | |
| **상태 관리** | Zustand | 경량, 보일러플레이트 최소 |
| **푸시 알림** | Expo Notifications | iOS/Android 통합 |
| **크롤러** | Python (Selenium + BeautifulSoup) | 시세 데이터 수집 |
| **크롤러 호스팅** | 로컬 Mac (Phase 1) → AWS EC2 (Phase 2) | |
| **이미지 저장** | Supabase Storage | |
| **차트** | react-native-chart-kit 또는 Victory Native | 시세 차트 |
| **네비게이션** | Expo Router (file-based routing) | |
| **폰트** | Pretendard | 한국어 최적화 |

---

## 📁 프로젝트 구조 (목표)

```
watchout/
├── app/                          # Expo Router (file-based routing)
│   ├── (tabs)/                   # 탭 네비게이션
│   │   ├── _layout.tsx           # 탭 레이아웃
│   │   ├── index.tsx             # 홈
│   │   ├── price.tsx             # 시세
│   │   ├── buyback.tsx           # 즉시매입
│   │   ├── trade.tsx             # 시계거래
│   │   └── mypage.tsx            # MY
│   ├── price/
│   │   └── [id].tsx              # 시세 상세
│   ├── trade/
│   │   ├── [id].tsx              # 매물 상세
│   │   └── new.tsx               # 매물 등록
│   ├── community/
│   │   ├── index.tsx             # 커뮤니티 리스트
│   │   ├── [id].tsx              # 게시글 상세
│   │   └── new.tsx               # 글쓰기
│   ├── collection/
│   │   └── index.tsx             # 내 컬렉션
│   ├── auth/
│   │   └── login.tsx             # 로그인
│   ├── _layout.tsx               # 루트 레이아웃
│   └── +not-found.tsx
├── components/                   # 재사용 컴포넌트
│   ├── ui/                       # 기본 UI (Button, Card, Input 등)
│   ├── price/                    # 시세 관련 (SparkLine, PriceCard 등)
│   ├── trade/                    # 거래 관련 (TradeCard, TradeForm 등)
│   ├── buyback/                  # 즉시매입 (BuybackSheet 등)
│   └── common/                   # Header, BottomSheet, Badge 등
├── store/                        # Zustand stores
│   ├── useAuthStore.ts
│   ├── usePriceStore.ts
│   ├── useTradeStore.ts
│   └── useBuybackStore.ts
├── lib/                          # 유틸리티
│   ├── supabase.ts               # Supabase 클라이언트
│   ├── format.ts                 # 가격 포맷, 날짜 포맷
│   └── constants.ts              # 색상, 브랜드 목록 등
├── types/                        # TypeScript 타입
│   └── index.ts
├── assets/                       # 이미지, 폰트
│   ├── fonts/
│   └── images/
├── crawlers/                     # Python 크롤러 (별도 실행)
│   ├── hisigan.py
│   ├── chrono24.py
│   ├── viver.py
│   └── scheduler.py
├── HANDOFF.md                    # ← 이 파일
├── CLAUDE.md                     # Claude Code 설정
├── DEV-LOG.md                    # 개발 진행 로그
└── supabase/
    └── migrations/               # DB 마이그레이션
```

---

## 🗄️ 데이터베이스 테이블 (10개)

```sql
-- 1. users: 회원 정보, 등급, OAuth 연동
-- 2. watches: 시계 모델 마스터 데이터 (브랜드, 모델, 레퍼런스)
-- 3. watch_prices: 시세 히스토리 (일별 가격 기록)
-- 4. trade_posts: 매물 등록 (시계 + 시계용품)
-- 5. buyback_requests: 즉시매입 신청
-- 6. collections: 내 컬렉션 (보유 시계)
-- 7. community_posts: 커뮤니티 게시글
-- 8. comments: 댓글
-- 9. messages: 1:1 메시지
-- 10. reports: 신고
```

*상세 스키마: `supabase/migrations/00001_create_tables.sql` 참조*

---

## 📅 6주 개발 로드맵

| 주차 | 핵심 작업 | 마일스톤 |
|------|----------|---------|
| **Week 1** | 인프라 + 크롤러 + 시세 화면 | 시세 데이터 자동 수집 + 앱에서 조회 |
| **Week 2** | SNS 로그인 + 즉시매입 + 홈 화면 | 즉시매입 신청 가능 |
| **Week 3** | 시계거래 마켓플레이스 | **← MVP 출시 가능** |
| **Week 4** | 커뮤니티 + 1:1 메시지 | 커뮤니티 활성화 |
| **Week 5** | 내 컬렉션 + MY + 푸시 알림 | 전체 기능 완성 |
| **Week 6** | QA + 앱스토어 배포 | 앱스토어 출시 |

---

## 🎨 디자인 시스템 (v5 프로토타입 기준)

```typescript
export const COLORS = {
  bg: "#FAFAFA",
  card: "#FFFFFF",
  text: "#1A1A1A",
  sub: "#8E8E93",
  border: "#F0F0F0",
  accent: "#0A84FF",
  green: "#34C759",
  red: "#FF3B30",
  orange: "#FF9500",
  tag: "#F2F2F7",
};
```

- **폰트:** Pretendard (Regular 400, SemiBold 600, Bold 700, ExtraBold 800)
- **카드:** borderRadius 14, border 1px #F0F0F0, padding 14-16
- **버튼:** borderRadius 12 (메인), borderRadius 20 (태그/필터)

---

## ✅ 현재 완료 상태

- [x] v5 UI 프로토타입 (React JSX, 943줄)
- [x] 개발 아젠다 문서 v1
- [x] 기술 스택 결정 (Expo + Supabase + Zustand)
- [x] 기술 비교 분석 완료
- [x] 시계 플랫폼 벤치마크 분석 완료
- [x] HANDOFF.md, CLAUDE.md, DEV-LOG.md 생성
- [x] 폴더 구조 세팅 (components/ui,price,trade,buyback,common + store + lib + types + crawlers)
- [x] 디자인 시스템 상수 파일 (lib/constants.ts — COLORS, FONTS, SPACING, RADIUS, BRANDS)
- [x] 포맷 유틸리티 (lib/format.ts — formatPrice, formatPriceShort, formatPercent)
- [x] Supabase 클라이언트 설정 (lib/supabase.ts — .env 환경변수 연동 완료)
- [x] TypeScript 타입 정의 (types/index.ts — Watch, TradePost, User 등)
- [x] Zustand 스토어 생성 (store/useAuthStore.ts, store/usePriceStore.ts)
- [x] Expo Router 탭 5개 구성 (홈/시세/즉시매입/시계거래/MY)
- [x] 즉시매입 가운데 특수 원형 버튼 구현
- [x] Header 공통 컴포넌트 (components/common/Header.tsx)
- [x] 각 탭 빈 화면 + Header 렌더링
- [x] 필수 패키지 설치 (zustand, @supabase/supabase-js, @react-native-async-storage/async-storage)
- [x] TypeScript 컴파일 검증 통과
- [x] DB 스키마 SQL 작성 (10개 테이블, 인덱스, 트리거)
- [x] RLS 보안 정책 SQL 작성 (10개 테이블)
- [x] Storage 버킷 SQL 작성 (trade-images, buyback-images, avatars)
- [x] TypeScript 타입 DB 스키마와 동기화 (10개 Row + Insert 타입 + 조인 타입)
- [x] Supabase 프로젝트 생성 + .env 환경변수 연동
- [x] react-native-svg 패키지 설치
- [x] Mock 데이터 생성 (lib/mockData.ts — v5 WATCHES 6개)
- [x] SparkLine 컴포넌트 (components/price/SparkLine.tsx — SVG Polyline)
- [x] PriceCard 컴포넌트 (components/price/PriceCard.tsx — 시세 카드)
- [x] 시세 리스트 화면 (app/(tabs)/price.tsx — 검색, 브랜드 필터, FlatList)
- [x] 시세 상세 화면 (app/price/[id].tsx — 6주 바 차트)
- [x] usePriceStore 확장 (검색/필터 상태 추가)
- [x] app/_layout.tsx에 price/[id] 라우트 추가
- [x] 홈 화면 UI (빠른 메뉴 2x2, 커뮤니티, 매물 스크롤, 뉴스, 미니배너)
- [x] 더미 데이터 확장 (커뮤니티 6개, 매물 3개, 용품 4개, 뉴스 3개)
- [x] Mock 타입 4개 추가 (MockCommunityPost, MockTradeItem, MockAccessoryItem, MockNews)
- [x] 즉시매입 안내 페이지 (Hero, Trust Badges, 타임라인, FAQ, CTA)
- [x] useBuybackStore (Zustand — 5단계 폼 상태)
- [x] BuybackSheet 바텀시트 (5단계 스텝 폼 + 완료 화면)
- [x] useTradeStore 생성 (Zustand — 필터/폼 상태)
- [x] TradeCard 컴포넌트 (components/trade/TradeCard.tsx — 2컬럼용)
- [x] AccessoryCard 컴포넌트 (components/trade/AccessoryCard.tsx — 2컬럼용)
- [x] 시계거래 리스트 화면 (app/(tabs)/trade.tsx — 탭, 검색, 필터, 2컬럼 FlatList, FAB)
- [x] 매물 상세 화면 (app/trade/[id].tsx — 이미지, 판매자, 가격, 정보 그리드, CTA)
- [x] 매물 등록 화면 (app/trade/create.tsx — 시계/용품별 폼)
- [x] Mock 데이터 확장 (시계 7개, 용품 7개, description 추가)
- [x] MockTradeItem/MockAccessoryItem 타입 확장 (상세 화면용 optional 필드)
- [x] app/_layout.tsx에 trade/[id], trade/create 라우트 추가
- [ ] Supabase에 마이그레이션 SQL 실행 (00001~00003)
- [ ] Pretendard 폰트 적용

---

## 🚀 다음 세션에서 할 일

### SESSION 6: 크롤러 + 커뮤니티
1. Python 크롤러 3개 개발 (하이시간, Chrono24, 바이버)
2. 크롤러 → Supabase DB 연동
3. 커뮤니티 리스트/상세/작성 화면

### SESSION 7: 내 컬렉션 + MY + 메시지
1. 내 컬렉션 화면
2. MY 페이지 (프로필, 설정)
3. 1:1 메시지 기능
4. Pretendard 폰트 적용

---

## 📝 개발 규칙

- **커밋:** `feat:`, `fix:`, `refactor:`, `chore:`
- **타입:** TypeScript strict, `any` 금지
- **스타일:** StyleSheet.create() 사용
- **상태:** Zustand store 기능 단위 분리
- **주석:** 한국어

---

## 🔗 참고 자료

- **v5 프로토타입:** watchout-v5.jsx (React 웹 기반, 구조 참고용)
- **개발 아젠다:** watchout-dev-agenda.md
