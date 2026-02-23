# WATCHOUT — HANDOFF.md
> **마지막 업데이트:** 2026-02-23 (SESSION 10 완료 — 전체 레이아웃 미세 조정 + UI 통일)
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
- [x] 매물 등록 화면 "기타" 브랜드 직접 입력 기능 추가
- [x] 시세/시계거래 화면 간격 최적화 (ScrollView marginBottom, countRow padding 조정)
- [x] FlatList → ScrollView 전환 (flex: 1 레이아웃 문제 근본 해결, 데이터 6-7개뿐이라 성능 문제 없음)
- [x] useCommunityStore 생성 (store/useCommunityStore.ts — 필터 + 정렬)
- [x] 카테고리 색상 유틸리티 (lib/utils.ts — getCategoryColor, getCategoryTextColor)
- [x] CommunityPostCard 컴포넌트 (components/community/CommunityPostCard.tsx)
- [x] 커뮤니티 리스트 화면 (app/community/index.tsx — 탭, 검색, 게시글 리스트, FAB)
- [x] 게시글 상세 화면 (app/community/[id].tsx — 본문, 좋아요, 댓글 입력창)
- [x] 글쓰기 화면 (app/community/write.tsx — 카테고리, 제목, 본문, 이미지 슬롯)
- [x] MY 페이지 구현 (app/(tabs)/mypage.tsx — 프로필, 컬렉션 배너, 활동/설정 메뉴)
- [x] 홈 화면 커뮤니티 네비게이션 연결 (app/(tabs)/index.tsx)
- [x] app/_layout.tsx에 community/index, community/[id], community/write 라우트 추가
- [x] useAuthStore 확장 (session, isLoading, initialize, login, register)
- [x] 로그인 화면 구현 (app/auth/login.tsx)
- [x] 회원가입 화면 구현 (app/auth/register.tsx)
- [x] MY 페이지 로그인 연동 (조건부 렌더링, 로그아웃 동작)
- [x] 라우트 가드 적용 (매물 등록, 글쓰기, 즉시매입, FAB)
- [x] 앱 초기화 시 세션 복원 (app/_layout.tsx)
- [x] auth/login, auth/register 라우트 추가
- [x] useCollectionStore 구현 (store/useCollectionStore.ts — CRUD + 통계)
- [x] CollectionCard 컴포넌트 (components/collection/CollectionCard.tsx)
- [x] SummaryCard 컴포넌트 (components/collection/SummaryCard.tsx)
- [x] ReturnChart 컴포넌트 (components/collection/ReturnChart.tsx)
- [x] 컬렉션 메인 화면 (app/collection/index.tsx — 통계 + 리스트 + FAB)
- [x] 시계 추가 화면 (app/collection/add.tsx — 브랜드/모델 선택 + 구매 정보)
- [x] 컬렉션 상세 화면 (app/collection/[id].tsx — 가격 비교 + 차트 + 삭제)
- [x] MY 페이지 컬렉션 연결 (라우트 가드 + 로그인 체크)
- [x] CollectionRow, CollectionInsert, CollectionWithWatch, PortfolioStats 타입 추가
- [x] 시세 화면 separator → divider(1px) 변경 (레이아웃 통일)
- [x] 검색바/필터 간격 최적화 (paddingBottom 4px)
- [x] 커뮤니티 listContainer marginBottom 조정 (8px)
- [ ] Supabase에 마이그레이션 SQL 실행 (00001~00003)
- [ ] Pretendard 폰트 적용

---

## 🚀 다음 세션에서 할 일

### SESSION 11: Supabase 실제 데이터 연동 (Week 2)
**목표:** Mock 데이터를 Supabase 실제 DB로 전환

1. **Supabase 마이그레이션 실행**
   - 00001~00003 SQL 실행
   - RLS 정책 확인
   - Storage 버킷 생성

2. **시드 데이터 삽입**
   - watches 6개 + watch_prices 히스토리
   - 테스트 trade_posts, community_posts

3. **Store 실제 연동**
   - usePriceStore.fetchWatches() 구현
   - useTradeStore.fetchTradePosts() + createTradePost()
   - useCommunityStore.fetchPosts() + createPost()
   - useBuybackStore.submitRequest()

4. **이미지 업로드**
   - expo-image-picker 설치
   - Supabase Storage 업로드 로직

### SESSION 12: 카카오 로그인 + 프로필 편집 (Week 2)
**목표:** 소셜 로그인 및 사용자 프로필 관리 기능 완성

1. **카카오 로그인 연동** (Supabase Auth with OAuth)
   - Kakao Developers에서 앱 등록
   - Supabase OAuth 설정
   - 카카오 로그인 버튼 실제 연동

2. **프로필 편집 기능**
   - 닉네임 변경
   - 아바타 업로드 (Supabase Storage)
   - 자기소개(bio) 입력

3. **비밀번호 재설정**
   - 이메일 링크 방식
   - Supabase Auth 이메일 템플릿 설정

### SESSION 13: 크롤러 개발 (Week 1 완료 목표)
**목표:** 시세 데이터 자동 수집 및 DB 저장

1. **Python 크롤러 개발 (crawlers/ 디렉토리)**
   - `hisigan.py`: 하이시간 시세 크롤링
   - `chrono24.py`: Chrono24 시세 크롤링
   - `viver.py`: 바이버 시세 크롤링
   - `scheduler.py`: 일 1회 자동 실행 스케줄러

2. **Supabase 연동**
   - 크롤링 데이터 → `watch_prices` 테이블 insert
   - 신규 모델 발견 시 → `watches` 테이블 insert

3. **Mock 데이터 대체**
   - 실제 크롤링 데이터로 교체

---

## 📌 SESSION 10 완료 상세

**구현된 기능:**
- 시세 화면 separator(8px) → divider(1px) 변경으로 다른 화면과 통일
- 검색바/필터 paddingBottom을 8px → 4px로 최적화하여 빈 공간 최소화
- 커뮤니티 listContainer marginBottom 12px → 8px로 조정하여 일관성 유지
- 커뮤니티 카운트 행 paddingTop 8px → 4px로 조정

**기술적 특징:**
- SPACING.xs: 4 상수 활용 (lib/constants.ts에 이미 정의됨)
- divider 1px 통일: backgroundColor: COLORS.border 사용
- compact 레이아웃: 검색바 ↔ 필터 ↔ 리스트 사이 빈 공간 제거
- 커뮤니티 카드 배경 유지: 게시글 그룹 시각적 강조 효과

**수정된 파일:**
- app/(tabs)/price.tsx: separator → divider, searchSection/brandFilter paddingBottom 조정
- app/(tabs)/trade.tsx: searchSection/filterRow paddingBottom 조정
- app/(tabs)/community.tsx: countRow paddingTop, listContainer marginBottom 조정

**검증 완료:**
- SESSION 5에서 FlatList → ScrollView 전환 이미 완료
- contentContainerStyle에 flexGrow: 1 미사용 (이미 준수)
- placeholder 이미지 Ionicons 교체 완료 (SESSION 9)
- 브랜드 칩 height: 32 고정 적용됨
- collection/index.tsx는 이미 올바른 패턴 사용 중

---

## 📌 SESSION 9 완료 상세

**구현된 기능:**
- 내 컬렉션 메인: SummaryCard(통계), 시계 리스트, FAB 시계 추가 버튼
- 시계 추가: 브랜드 선택 → 모델 선택 → 구매가/날짜/메모 입력
- 컬렉션 상세: 구매가 vs 현재 시세 비교, 수익률 차트, 삭제 기능
- 포트폴리오 통계: 총 보유 시계, 총 구매 금액, 현재 총 가치, 총 수익(금액+퍼센트)

**기술적 특징:**
- useCollectionStore: fetchMyCollection(LEFT JOIN + Promise.all), addToCollection(UNIQUE 제약), removeFromCollection, getStats
- 수익률 계산: (currentPrice - purchasePrice) / purchasePrice * 100
- UNIQUE 제약 처리: (user_id, watch_id) 중복 방지, 에러 코드 23505 체크
- NULL 안전 계산: purchasePrice, currentPrice 모두 NULL 가능, 조건부 렌더링
- 브랜드/모델 동적 로드: watches 테이블 DISTINCT brand, 브랜드별 필터링

**컴포넌트 패턴:**
- CollectionCard: PriceCard 패턴 재사용 (1-row 리스트, 52x52 이미지, gap: SPACING.md)
- SummaryCard: 4개 통계 행 + 구분선
- ReturnChart: 가로 바 차트 (최대 100%), green/red 조건부 색상
- ScrollView + map 패턴 유지, FlatList 사용 안 함

**파일 변경:**
- 신규 7개: useCollectionStore.ts, CollectionCard.tsx, SummaryCard.tsx, ReturnChart.tsx, collection/index.tsx, collection/add.tsx, collection/[id].tsx
- 수정 2개: types/index.ts (4개 타입 추가), mypage.tsx (handleCollection 라우팅)

---

## 📌 SESSION 7 완료 상세

**구현된 기능:**
- 로그인/회원가입: 이메일/비밀번호 방식, Supabase Auth 연동, 유효성 검증
- 세션 관리: AsyncStorage 기반 세션 복원, onAuthStateChange 리스너
- MY 페이지 연동: 로그인 상태에 따른 조건부 렌더링, 로그아웃 Alert 확인
- 라우트 가드: 매물 등록/글쓰기/즉시매입 진입 시 로그인 체크, FAB 버튼 보호

**기술적 특징:**
- useAuthStore 확장: session, isLoading, initialize(), login(), register(), logout()
- 앱 초기화: app/_layout.tsx에서 useEffect로 initialize() 호출
- 로그인 화면: compact 레이아웃, 이메일/비밀번호, eye icon toggle, 카카오 버튼(UI만)
- 회원가입: 이메일 형식 검증, 비밀번호 8자 이상, 비밀번호 일치, 닉네임 2자 이상
- 라우트 가드: Alert 2버튼 (취소, 로그인), 로그인 화면으로 이동 옵션

**파일 변경:**
- 신규 2개: auth/login.tsx, auth/register.tsx
- 수정 7개: useAuthStore.ts, mypage.tsx, _layout.tsx, trade/create.tsx, community/write.tsx, trade.tsx, community.tsx, BuybackSheet.tsx

---

## 📌 SESSION 6 완료 상세

**구현된 기능:**
- 커뮤니티 리스트: 카테고리 탭(전체/자유/질문/후기/정보), 공지 핀 고정, FAB 글쓰기
- 게시글 상세: 카테고리 배지, 제목/본문, 작성자 정보, 좋아요 버튼, 댓글 입력창
- 글쓰기: 카테고리 선택 4개 토글, 제목/본문 입력, 이미지 슬롯 placeholder, 유효성 검사
- MY 페이지: 더미 프로필(손님 Lv.0), 컬렉션 배너, 활동/설정 메뉴 리스트

**기술적 특징:**
- useCommunityStore: 카테고리 필터 + 검색 + 공지 핀 정렬 로직
- 카테고리 배지 색상 유틸 (lib/utils.ts): 공통 함수로 분리하여 재사용
- ScrollView 패턴 일관성: SESSION 5에서 검증된 패턴 재사용
- 홈 화면 연동: 빠른 메뉴/최신글 카드 → 커뮤니티 화면 네비게이션

**파일 변경:**
- 신규 6개: useCommunityStore, utils.ts, CommunityPostCard, community/index, community/[id], community/write
- 수정 3개: mypage.tsx, index.tsx, _layout.tsx

---

## 📌 SESSION 5 완료 상세

**구현된 기능:**
- 시계거래 탭: 시계/용품 탭, 검색, 브랜드/카테고리 필터, 2컬럼 그리드
- 매물 상세: 이미지 갤러리, 판매자 정보, 가격, 상세 정보 그리드, CTA 버튼
- 매물 등록: 시계/용품별 폼, "기타" 브랜드 직접 입력, 5단계 유효성 검사

**기술적 개선:**
- FlatList → ScrollView 전환으로 flex: 1 레이아웃 문제 근본 해결
- 데이터 6-7개 수준이므로 ScrollView로 충분 (성능 문제 없음)
- 간격 최적화: marginBottom 12px, padding 8px로 통일

**파일 변경:**
- 신규 5개: useTradeStore, TradeCard, AccessoryCard, trade/[id], trade/create
- 수정 4개: types/index.ts, mockData.ts, trade.tsx, _layout.tsx
- 레이아웃 최적화 2개: price.tsx, trade.tsx (FlatList → ScrollView)

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
