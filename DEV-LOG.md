# WATCHOUT — DEV-LOG.md

> 각 세션의 작업 내용을 기록합니다.
> Claude Code가 세션 시작 시 이 파일을 읽고 현재 진행 상황을 파악합니다.

---

## 2026-02-22 — SESSION 5: 시계거래 마켓플레이스

### 완료
- [x] MockTradeItem/MockAccessoryItem 타입 확장 (description, method, authorLevel 등 optional 필드)
- [x] Mock 데이터 확장 (시계 3→7개, 용품 4→7개, 기존 항목에 description/method 추가)
- [x] useTradeStore 생성 (store/useTradeStore.ts — 필터 + 폼 상태)
- [x] TradeCard 컴포넌트 (components/trade/TradeCard.tsx — 2컬럼용 시계 카드)
- [x] AccessoryCard 컴포넌트 (components/trade/AccessoryCard.tsx — 2컬럼용 용품 카드)
- [x] 시계거래 리스트 화면 (app/(tabs)/trade.tsx — 탭+검색+필터+2컬럼 FlatList+FAB)
- [x] 매물 상세 화면 (app/trade/[id].tsx — 이미지 갤러리+판매자+가격+정보 그리드+하단 CTA)
- [x] 매물 등록 화면 (app/trade/create.tsx — 시계/용품별 폼+브랜드 그리드+구성품+사진+등록)
- [x] app/_layout.tsx에 trade/[id], trade/create 라우트 추가
- [x] TypeScript 컴파일 검증 통과

### 생성된 파일
- `store/useTradeStore.ts` — 시계거래 Zustand 스토어 (필터+폼)
- `components/trade/TradeCard.tsx` — 시계 매물 카드 (2컬럼용)
- `components/trade/AccessoryCard.tsx` — 시계용품 카드 (2컬럼용)
- `app/trade/[id].tsx` — 매물 상세 화면
- `app/trade/create.tsx` — 매물 등록 폼 화면

### 수정된 파일
- `types/index.ts` — MockTradeItem/MockAccessoryItem optional 필드 추가
- `lib/mockData.ts` — 시계+4, 용품+3, 기존 항목 description 추가
- `app/(tabs)/trade.tsx` — 빈 화면 → 완전한 마켓플레이스 리스트
- `app/_layout.tsx` — trade/[id], trade/create Stack.Screen 추가

### UI 구조
- **시계거래 리스트**: Header → 시계/용품 탭 → 검색바 → 브랜드/카테고리 필터 → 매물 수 → 2컬럼 FlatList → FAB
- **매물 상세**: Header(뒤로가기) → 이미지 갤러리(280px) → 판매자 정보 → 가격+시세배지 → 정보 그리드(2열×3행) → 설명 → 하단 CTA(찜+메시지)
- **매물 등록**: Header(뒤로가기) → 시계/용품 탭 → 시계폼(거래유형+브랜드+모델+레퍼런스+연식/컨디션+구성품+가격+거래방법/지역+사진+설명) / 용품폼(카테고리+제목+가격/컨디션+사진+설명) → 등록 버튼

### 메모
- TradeCard와 AccessoryCard는 메타데이터 구조가 달라 별도 컴포넌트로 분리
- 시계 카드에 판매/구매 배지(파랑/주황) + 시세 배지(green/yellow/red) 표시
- 찜/메시지 기능은 Alert("준비 중")으로 처리
- 사진 첨부는 UI placeholder만 (expo-image-picker 연동 추후)
- 매물 등록 폼의 formData는 useTradeStore에 서브객체로 포함

---

## 2026-02-22 — SESSION 4: 홈 화면 + 즉시매입 페이지

### 완료
- [x] Mock 타입 4개 추가 (types/index.ts — MockCommunityPost, MockTradeItem, MockAccessoryItem, MockNews)
- [x] 더미 데이터 4개 배열 추가 (lib/mockData.ts — 커뮤니티 6개, 매물 3개, 용품 4개, 뉴스 3개)
- [x] 홈 화면 전체 구현 (app/(tabs)/index.tsx)
- [x] 즉시매입 안내 페이지 구현 (app/(tabs)/buyback.tsx)
- [x] useBuybackStore 생성 (store/useBuybackStore.ts — 5단계 폼 상태)
- [x] BuybackSheet 바텀시트 구현 (components/buyback/BuybackSheet.tsx)
- [x] TypeScript 컴파일 검증 통과

### 생성된 파일
- `store/useBuybackStore.ts` — 즉시매입 신청 폼 Zustand 스토어
- `components/buyback/BuybackSheet.tsx` — 5단계 바텀시트 (Modal 기반)

### 수정된 파일
- `types/index.ts` — Mock 타입 4개 추가
- `lib/mockData.ts` — 커뮤니티/매물/용품/뉴스 더미 데이터 추가
- `app/(tabs)/index.tsx` — 홈 화면 전체 구현 (빈 화면 → 250줄)
- `app/(tabs)/buyback.tsx` — 즉시매입 안내 페이지 (빈 화면 → 350줄)

### UI 구조
- **홈 화면**: Header(WATCHOUT) → 빠른 메뉴 2x2 → 커뮤니티 최신글 3개 → 시계거래 매물 수평 스크롤 → 뉴스 3개 → 즉시매입 미니배너
- **즉시매입**: Hero → Trust Badges 3열 → 매입 과정 타임라인 5단계 → 왜 WATCHOUT 4항목 → 브랜드 태그 → FAQ 아코디언 4개 → CTA
- **BuybackSheet**: Modal(slide) → Progress bar → Step 1(브랜드) → Step 2(모델) → Step 3(컨디션+구성품) → Step 4(사진 UI) → Step 5(연락처) → 완료 화면

### 메모
- BuybackSheet는 React Native 내장 Modal 사용 (외부 라이브러리 불필요)
- 사진 첨부는 UI placeholder만 (expo-image-picker 연동 추후)
- community/collection 라우트 미구현 → Alert("준비 중")으로 처리
- 빠른 메뉴는 모바일 최적화를 위해 v5(4열) 대신 2x2 그리드로 구현

---

## 2026-02-21 — SESSION 3: 시세 화면 UI 구현

### 완료
- [x] react-native-svg 패키지 설치
- [x] Mock 데이터: `lib/mockData.ts` (v5 WATCHES 6개 → WatchWithPrice 타입)
- [x] SparkLine 컴포넌트: `components/price/SparkLine.tsx` (react-native-svg Polyline)
- [x] PriceCard 컴포넌트: `components/price/PriceCard.tsx` (시세 카드)
- [x] 시세 리스트 화면: `app/(tabs)/price.tsx` (검색바, 브랜드 필터 칩, FlatList)
- [x] 시세 상세 화면: `app/price/[id].tsx` (시계 정보 + 6주 바 차트)
- [x] usePriceStore 확장 (searchQuery, selectedBrand, getFilteredWatches)
- [x] app/_layout.tsx에 price/[id] 라우트 추가
- [x] TypeScript 컴파일 검증 통과

### 생성된 파일
- `lib/mockData.ts` — v5 WATCHES 기반 더미 데이터 6개
- `components/price/SparkLine.tsx` — SVG 미니 스파크라인 차트
- `components/price/PriceCard.tsx` — 시세 카드 (이미지, 브랜드, SparkLine, 가격)
- `app/price/[id].tsx` — 시세 상세 (정보 + 6주 바 차트)

### 수정된 파일
- `app/(tabs)/price.tsx` — 빈 화면 → 검색/필터/FlatList 구현
- `app/_layout.tsx` — price/[id] Stack.Screen 추가
- `store/usePriceStore.ts` — 검색/필터 상태 + getFilteredWatches 추가

### UI 구조
- **시세 리스트**: Header → 검색바 → 브랜드 필터 칩 (전체/Rolex/Omega/AP/Patek/Cartier) → 모델 수 → FlatList<PriceCard>
- **시세 상세**: Header(뒤로가기) → 시계 아이콘 → 레퍼런스 → 가격(28pt) → 변동률 → 6주 바 차트
- **바 차트**: 순수 View 기반 (react-native-chart-kit 미사용), 높이 비례 = ((price - min) / range) * 60 + 20

### 메모
- 바 차트는 외부 라이브러리 없이 View로 구현 (v5 차트가 단순 세로 막대)
- 시계 이미지는 Ionicons watch-outline placeholder (추후 실제 이미지로 대체)
- Pretendard 폰트 아직 미적용 → 다음 세션에서 적용 예정

---

## 2026-02-21 — SESSION 2: DB 스키마 + RLS + Storage + 타입

### 완료
- [x] 마이그레이션 SQL: `supabase/migrations/00001_create_tables.sql` (10개 테이블, 인덱스, 트리거)
- [x] RLS 정책 SQL: `supabase/migrations/00002_rls_policies.sql` (10개 테이블 보안 정책)
- [x] Storage 버킷 SQL: `supabase/migrations/00003_storage_buckets.sql` (3개 버킷)
- [x] TypeScript 타입 확장: `types/index.ts` (10개 Row 타입 + Insert 타입 + 조인 타입)
- [x] usePriceStore Watch → WatchWithPrice 타입 업데이트
- [x] TypeScript 컴파일 검증 통과

### 생성된 파일
- `supabase/migrations/00001_create_tables.sql` — 테이블 10개
- `supabase/migrations/00002_rls_policies.sql` — RLS 정책
- `supabase/migrations/00003_storage_buckets.sql` — Storage 버킷 3개

### 수정된 파일
- `types/index.ts` — DB 스키마 기반 전면 확장
- `store/usePriceStore.ts` — WatchWithPrice 타입으로 변경

### DB 테이블 요약
| 테이블 | 설명 |
|--------|------|
| users | 회원 프로필 (auth.users 참조, 자동 생성 트리거) |
| watches | 시계 모델 마스터 |
| watch_prices | 시세 히스토리 (일별, 소스별) |
| trade_posts | 매물 등록 (시계 + 시계용품) |
| buyback_requests | 즉시매입 신청 (비회원도 가능) |
| collections | 내 컬렉션 (보유 시계) |
| community_posts | 커뮤니티 게시글 |
| comments | 댓글 (댓글 수 자동 카운트 트리거) |
| messages | 1:1 메시지 |
| reports | 신고 |

### 메모
- SQL은 Supabase 프로젝트 생성 후 SQL Editor에서 순서대로 실행
- 또는 Supabase CLI (`supabase db push`)로 적용 가능
- auth.users 가입 시 public.users 자동 생성 트리거 포함
- watch_prices에 UNIQUE(watch_id, source, recorded_date) 제약으로 중복 방지

---

## 2026-02-21 — SESSION 1: 프로젝트 초기화

### 완료
- [x] 불필요한 Expo 기본 템플릿 파일 11개 삭제
- [x] 폴더 구조 세팅: components/(ui,price,trade,buyback,common), store/, lib/, types/, crawlers/
- [x] 디자인 시스템 상수: `lib/constants.ts` (COLORS, FONTS, SPACING, RADIUS, BRANDS, CONDITIONS, KIT_OPTIONS)
- [x] 포맷 유틸리티: `lib/format.ts` (formatPrice, formatPriceShort, formatPercent)
- [x] Supabase 클라이언트: `lib/supabase.ts` (placeholder URL, AsyncStorage adapter)
- [x] TypeScript 타입: `types/index.ts` (Watch, TradePost, CommunityPost, User, BuybackRequest)
- [x] Zustand 스토어: `store/useAuthStore.ts`, `store/usePriceStore.ts`
- [x] Expo Router 탭 5개: 홈/시세/즉시매입(가운데 특수 버튼)/시계거래/MY
- [x] Header 공통 컴포넌트: `components/common/Header.tsx` (SafeAreaInsets, 뒤로가기, 우측 슬롯)
- [x] 각 탭 빈 화면 + Header 렌더링
- [x] 패키지 설치: zustand, @supabase/supabase-js, @react-native-async-storage/async-storage
- [x] TypeScript 컴파일 검증 (npx tsc --noEmit) 통과

### 변경된 파일 (생성)
- `lib/constants.ts`, `lib/format.ts`, `lib/supabase.ts`
- `types/index.ts`
- `store/useAuthStore.ts`, `store/usePriceStore.ts`
- `components/common/Header.tsx`
- `app/(tabs)/price.tsx`, `app/(tabs)/buyback.tsx`, `app/(tabs)/trade.tsx`, `app/(tabs)/mypage.tsx`

### 변경된 파일 (수정)
- `app/_layout.tsx` — 간소화 (Themed/ColorScheme 의존성 제거)
- `app/(tabs)/_layout.tsx` — 탭 5개 구성 + 즉시매입 특수 버튼
- `app/(tabs)/index.tsx` — 홈 화면으로 교체
- `app/+not-found.tsx` — Themed 의존성 제거

### 삭제된 파일
- `components/EditScreenInfo.tsx`, `StyledText.tsx`, `ExternalLink.tsx`, `Themed.tsx`
- `components/useColorScheme.ts`, `useColorScheme.web.ts`, `useClientOnlyValue.ts`, `useClientOnlyValue.web.ts`
- `components/__tests__/StyledText-test.js`
- `constants/Colors.ts`
- `app/(tabs)/two.tsx`, `app/modal.tsx`, `app/+html.tsx`

### 메모
- npm 캐시 권한 문제 발생 (root 소유 파일) → `--cache /tmp/npm-cache-tmp`로 우회 설치
- Node v18.17.1 사용 중 → Expo 54 / RN 0.81은 Node >= 20.19.4 권장. 추후 업그레이드 필요
- Pretendard 폰트는 아직 미적용 → SESSION 3에서 적용 예정

---

## 2026-02-21 — Phase 0: 프로젝트 착수 준비

### 완료
- [x] 기술 스택 최종 확정 (Expo + Supabase + Zustand + Expo Notifications)
- [x] v5 UI 프로토타입 완성 (943줄 React JSX)
- [x] 개발 아젠다 문서 v1 작성
- [x] HANDOFF.md, CLAUDE.md, DEV-LOG.md 생성

### 미완료 / 다음 할 일
- [ ] skills.sh 스킬 3개 설치 (building-native-ui, react-native-best-practices, supabase-postgres)
- [ ] Expo 프로젝트 초기화 (`npx create-expo-app watchout --template tabs`)
- [ ] 필수 패키지 설치 (Zustand, Supabase 등)
- [ ] Supabase 프로젝트 생성 (supabase.com에서 수동)
- [ ] GitHub 비공개 리포 생성
- [ ] 탭 네비게이션 5개 구성
- [ ] 디자인 시스템 상수 파일 생성

### 메모
- v5 프로토타입은 React 웹 기반 → React Native로 전환 필요
- div → View, CSS object → StyleSheet.create()
- SVG 아이콘 → @expo/vector-icons 또는 lucide-react-native

---

<!-- 새 세션 기록은 이 위에 추가 (최신이 맨 위) -->
