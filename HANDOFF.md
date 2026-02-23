# WATCHOUT — HANDOFF.md
> **마지막 업데이트:** 2026-02-23 (SESSION 17 — 홈 화면 리디자인 + 탭 구조 변경)
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
| **크롤러** | TypeScript + Node.js (cheerio + axios) | 시세 데이터 수집 (SESSION 11에서 Python → TS 전환) |
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
│   │   ├── _layout.tsx           # 탭 레이아웃 (5탭: 홈|교환거래|즉시매입(센터)|시계거래|MY)
│   │   ├── index.tsx             # 홈 (시세배너, 커뮤니티, 매물, 뉴스, 미니배너)
│   │   ├── exchange.tsx          # 교환거래 (소개 + ExchangeSheet)
│   │   ├── price.tsx             # 시세 (href: null — router.push로만 접근)
│   │   ├── buyback.tsx           # 즉시매입 (센터 원형 버튼)
│   │   ├── trade.tsx             # 시계거래
│   │   ├── community.tsx         # 커뮤니티 (href: null — router.push로만 접근)
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
│   ├── mypage/
│   │   ├── edit-profile.tsx      # 프로필 편집
│   │   ├── my-trades.tsx         # 내 매물 리스트
│   │   ├── my-posts.tsx          # 내 게시글 리스트
│   │   └── my-requests.tsx       # 매입/교환 내역
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
│   ├── exchange/                 # 교환거래 (ExchangeSheet 등)
│   └── common/                   # Header, BottomSheet, Badge 등
├── store/                        # Zustand stores
│   ├── useAuthStore.ts
│   ├── usePriceStore.ts
│   ├── useTradeStore.ts
│   ├── useBuybackStore.ts
│   ├── useExchangeStore.ts        # 교환거래 4단계 폼 상태
│   └── useCollectionStore.ts     # 내 컬렉션 CRUD + 통계
├── lib/                          # 유틸리티
│   ├── supabase.ts               # Supabase 클라이언트
│   ├── format.ts                 # 가격 포맷, 날짜 포맷
│   └── constants.ts              # 색상, 브랜드 목록 등
├── types/                        # TypeScript 타입
│   └── index.ts
├── assets/                       # 이미지, 폰트
│   ├── fonts/
│   └── images/
├── crawlers/                     # TypeScript 크롤러 (별도 실행, npm run crawl)
│   ├── tsconfig.json             # Node.js용 TS 설정 (Expo tsconfig와 분리)
│   ├── types.ts                  # 공유 타입 + WATCH_TARGETS 설정
│   ├── hisigan.ts                # 하이시간 시세 크롤러
│   ├── chrono24.ts               # Chrono24 시세 크롤러
│   ├── savePrices.ts             # Supabase watch_prices 저장
│   ├── index.ts                  # 통합 실행기 (runAll)
│   └── run.ts                    # 진입점 (dotenv → runAll)
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
- [x] crawlers/tsconfig.json — Node.js용 TS 설정 (Expo tsconfig와 분리)
- [x] crawlers/types.ts — CrawledPrice, WatchTarget, WATCH_TARGETS (6개 시계)
- [x] crawlers/hisigan.ts — 하이시간 시세 크롤러 (axios + cheerio, KRW)
- [x] crawlers/chrono24.ts — Chrono24 시세 크롤러 (axios + cheerio, EUR)
- [x] crawlers/savePrices.ts — watch_prices INSERT + 중복 스킵 (UNIQUE 제약 활용)
- [x] crawlers/index.ts — 통합 실행기 (runAll)
- [x] crawlers/run.ts — 진입점 (dotenv 로드 → runAll)
- [x] package.json — cheerio/axios/dotenv/ts-node 추가 + "crawl" 스크립트
- [x] supabase/migrations/00005_exchange_trade.sql — buyback_requests 교환거래 컬럼 추가 (type, wanted_*, kakao_id, contact_method, C급 condition)
- [x] store/useExchangeStore.ts — 4단계 교환거래 폼 상태 (Zustand)
- [x] components/exchange/ExchangeSheet.tsx — 4단계 모달 폼 (BuybackSheet 패턴 동일)
- [x] app/(tabs)/exchange.tsx — 교환거래 소개 페이지 (Hero+다크네이비, Trust Badges, 타임라인, FAQ)
- [x] app/(tabs)/_layout.tsx — 탭 5개로 개편 (교환거래 신규, 시세/커뮤니티 href:null, buyback 센터버튼)
- [x] app/(tabs)/index.tsx — 실시간 시세 배너 + 교환거래 미니배너 추가
- [x] store/useAuthStore.ts — updateProfile, uploadAvatar 추가 (Supabase users + Storage avatars)
- [x] store/useTradeStore.ts — MyTradeItem interface, fetchMyTrades(userId) 추가
- [x] store/useCommunityStore.ts — MyPost interface, fetchMyPosts(userId) 추가
- [x] store/useBuybackStore.ts — MyRequest interface, REQUEST_STATUS_LABEL/COLOR(export), fetchMyRequests(userId) 추가
- [x] app/(tabs)/mypage.tsx — 완전 리디자인 (프로필 카드 + 활동/설정 섹션 + 비로그인 분기)
- [x] app/mypage/edit-profile.tsx — expo-image-picker + 닉네임/bio 편집 + 저장
- [x] app/mypage/my-trades.tsx — 내 매물 리스트 (상태 배지: 판매중/예약중/거래완료)
- [x] app/mypage/my-posts.tsx — 내 게시글 리스트 (카테고리 배지, 💬/❤️ 메타)
- [x] app/mypage/my-requests.tsx — 매입/교환 내역 (타입/상태 배지)
- [x] app/_layout.tsx — mypage/* 라우트 4개 추가
- [x] 탭바 유지 버그 수정 (nested Stack 패턴 — mypage/_layout.tsx, collection/_layout.tsx)
- [x] favorites.tsx 신규 생성 (관심 매물 빈 상태 페이지)
- [x] lib/authGuard.ts — requireAuth(router, isLoggedIn, label) 통일 유틸리티
- [x] 로그인 가드 통일: trade.tsx, community.tsx FAB + mypage/index.tsx + trade/create.tsx
- [x] 이미지 업로드 실제 구현: trade/create.tsx (5슬롯, trade-images 버킷)
- [x] 이미지 업로드 실제 구현: BuybackSheet.tsx Step4 (3슬롯, buyback-images 버킷)
- [x] 이미지 업로드 실제 구현: ExchangeSheet.tsx Step3 (5슬롯, buyback-images 버킷)
- [x] store/useExchangeStore.ts — uploadPhotos 액션 추가
- [x] store/useTradeStore.ts, useBuybackStore.ts — createTradePost/submitRequest에서 formData.photos 실제 사용
- [x] supabase/migrations/00006_notifications.sql — notifications 테이블 + RLS + 인덱스
- [x] store/useNotificationStore.ts — fetchNotifications, markAsRead, markAllAsRead, deleteNotification
- [x] lib/notifications.ts — createNotification(userId, type, title, body, data) 헬퍼
- [x] components/common/NotificationBell.tsx — unreadCount 뱃지 + /notifications 이동
- [x] components/common/Header.tsx — fallback을 NotificationBell로 교체 (4개 탭 자동 적용)
- [x] app/notifications/index.tsx — 알림 목록 (타입 아이콘, unread dot, 전체 읽음, 빈 상태)
- [x] app/mypage/notification-settings.tsx — 타입별 Switch (AsyncStorage 저장/로드)
- [x] app/(tabs)/mypage/index.tsx — "알림 설정" Switch → 설정 페이지 navigation
- [x] app/_layout.tsx — notifications, mypage/notification-settings 라우트 추가
- [x] supabase/migrations/00007_chat.sql — chat_rooms, chat_messages 테이블 + RLS + Realtime
- [x] store/useChatStore.ts — Supabase Realtime 기반 채팅 스토어 전체 구현
- [x] app/chat/index.tsx — 채팅방 목록 화면
- [x] app/chat/[roomId].tsx — 채팅 화면 (Realtime 실시간, 날짜 구분선, 버블 UI)
- [x] types/index.ts — MockTradeItem에 userId 추가
- [x] store/useNotificationStore.ts — NotificationType에 'chat' 추가
- [x] store/useTradeStore.ts — fetchTradePosts에 userId 매핑
- [x] app/trade/[id].tsx — 채팅 버튼 실제 동작 + 본인 매물 비활성화
- [x] app/(tabs)/mypage/index.tsx — 채팅 메뉴 + totalUnread 뱃지 추가
- [x] app/_layout.tsx — chat, chat/[roomId] 라우트 추가
- [x] app/mypage/notification-settings.tsx — 채팅 알림 토글 추가 (chat: true)
- [x] app/notifications/index.tsx — TYPE_ICON에 chat 엔트리 추가
- [x] **탭바 사라짐 버그 근본 수정** — chat/, notifications/, mypage/notification-settings를 (tabs) nested Stack으로 이동
- [x] app/(tabs)/chat/_layout.tsx + app/(tabs)/notifications/_layout.tsx — nested Stack 추가
- [x] app/(tabs)/_layout.tsx — chat, notifications Tabs.Screen(href:null) 추가
- [x] app/_layout.tsx — 구 chat/notifications/mypage/notification-settings 라우트 제거
- [x] store/useChatStore.ts — Supabase 미연결 시 mock 데이터 fallback (createMockRooms/createMockMessages, sendMessage 로컬 추가, createOrGetRoom 로컬 방 생성)
- [x] lib/mockData.ts — MOCK_TRADE_ITEMS 7개에 userId: 'mock-seller-00N' 추가
- [x] supabase/migrations/00008_favorites.sql — favorites 테이블 + RLS + 인덱스
- [x] store/useFavoriteStore.ts — fetchFavorites, toggleFavorite(optimistic), isFavorite
- [x] components/trade/TradeCard.tsx — isFavorite/onFavoritePress prop, 하트 버튼 오버레이
- [x] app/trade/[id].tsx — 하단 바 하트 버튼 실제 동작 (requireAuth + toggleFavorite)
- [x] app/(tabs)/trade.tsx — TradeCard에 isFavorite/onFavoritePress 전달, fetchFavorites useEffect
- [x] app/(tabs)/mypage/favorites.tsx — 실제 찜 목록 (2컬럼 그리드, 비로그인/빈 상태 분기)
- [x] **SESSION 17: 홈 화면 리디자인 + 탭 구조 변경**
- [x] lib/constants.ts — COLORS에 headerBg/tabBg/pageBg/gold/goldMuted 추가
- [x] components/common/Header.tsx — dark?: boolean prop 추가 (다크 헤더 지원)
- [x] components/common/NotificationBell.tsx — color?: string prop 추가
- [x] app/(tabs)/_layout.tsx — 탭 바 다크 테마(#0C0C14), gold 활성(#C9A84C), trade→"사고/팔기" pricetag 아이콘, 즉시매입 버튼 gold 색상
- [x] app/(tabs)/index.tsx — 홈 완전 리라이트: Quick Actions 4개 수평, MARKET SparkLine 카드, 다크 프리미엄 배너, MARKETPLACE/NEWS/COMMUNITY 섹션
- [x] app/(tabs)/exchange.tsx, buyback.tsx, trade.tsx, mypage/index.tsx — dark 헤더 적용
- [ ] Supabase에 마이그레이션 SQL 실행 (00001~00008)
- [ ] 크롤러 CSS 선택자 실제 사이트 확인 후 수정 (hisigan.ts, chrono24.ts의 TODO 항목)
- [ ] Pretendard 폰트 적용

---

## 🚀 다음 세션에서 할 일

### SESSION 18: Supabase 실제 연동 (Week 2)
**목표:** Mock 데이터를 Supabase 실제 DB로 전환

1. **Supabase 마이그레이션 실행**
   - 00001~00008 SQL 실행
   - watches 테이블 시드 데이터 삽입 (6개 시계)
   - Supabase 대시보드에서 chat_messages Realtime 활성화 확인

2. **Store 실제 연동**
   - usePriceStore.fetchWatches() — Mock → Supabase
   - useTradeStore.fetchTradePosts() + createTradePost()
   - useCommunityStore.fetchPosts() + createPost()

3. **크롤러 선택자 검증**
   - hisigan.com 실제 HTML 구조 확인 → hisigan.ts 선택자 수정
   - chrono24.com 실제 HTML 구조 확인 → chrono24.ts 선택자 수정

### SESSION 19: 카카오 로그인
1. **카카오 로그인 연동** (Supabase Auth with OAuth)

---

## 📌 SESSION 16 완료 상세

**구현된 기능:**
- `supabase/migrations/00007_chat.sql` — chat_rooms (serial PK, trade_post_id, buyer_id/seller_id, last_message, buyer_unread/seller_unread, UNIQUE(trade_post_id, buyer_id)), chat_messages (room_id FK, sender_id, message, message_type CHECK, is_read), RLS 4개 정책, REPLICA IDENTITY FULL, notifications type CHECK에 'chat' 추가
- `store/useChatStore.ts` — ChatRoom/ChatMessage interface, fetchChatRooms (trade_post+buyer+seller JOIN), fetchMessages, sendMessage (INSERT + last_message UPDATE + counterpart unread++), createOrGetRoom (maybeSingle 기존 방 조회 → 없으면 INSERT + 시스템 메시지), markRoomAsRead, subscribeToRoom (postgres_changes Realtime), unsubscribeFromRoom. 채널은 모듈 레벨 `let _channel` 관리
- `app/chat/index.tsx` — Header("채팅"), ScrollView+map, 아바타(Image or 이니셜 원형), 닉네임+매물명+lastMessage+시간+unread 뱃지, 비로그인 유도/빈 상태
- `app/chat/[roomId].tsx` — 커스텀 헤더(상대방닉네임+매물 링크버튼), getDateLabel/formatTime 유틸, 날짜 구분선, 시스템 메시지(중앙), 내/상대 버블, KeyboardAvoidingView, sendMessage+createNotification, scrollToEnd 자동 스크롤
- `types/index.ts` — MockTradeItem에 `userId?: string` 추가
- `store/useNotificationStore.ts` — NotificationType에 'chat' 추가
- `store/useTradeStore.ts` — fetchTradePosts map에 `userId: post.user_id` 추가
- `app/trade/[id].tsx` — handleChatPress (requireAuth + createOrGetRoom → /chat/{roomId}), isMyPost 체크 → 내 매물 비활성 버튼
- `app/(tabs)/mypage/index.tsx` — 채팅 메뉴 추가(나의 활동 첫 번째), totalUnread 뱃지, fetchChatRooms useEffect
- `app/_layout.tsx` — chat, chat/[roomId] 라우트 추가
- `app/mypage/notification-settings.tsx` — chat 알림 토글 추가 (SETTINGS 배열 + initial state)
- `app/notifications/index.tsx` — TYPE_ICON에 chat 엔트리 추가

**알림 타입 7종 (신규 +1):**
| type | 아이콘 | 색상 |
|------|--------|------|
| trade_interest | heart | red |
| price_alert | trending-up | green |
| comment | chatbubble | accent(blue) |
| system | notifications | sub(gray) |
| buyback_status | cash | orange |
| exchange_status | swap-horizontal | purple |
| **chat** | **chatbox** | **accent(blue)** |

**생성된 파일 (4개):**
- `supabase/migrations/00007_chat.sql`
- `store/useChatStore.ts`
- `app/(tabs)/chat/index.tsx`
- `app/(tabs)/chat/[roomId].tsx`

**수정된 파일 (10개):**
- `types/index.ts` — userId? 추가
- `store/useNotificationStore.ts` — 'chat' 타입 추가
- `store/useTradeStore.ts` — userId 매핑
- `app/trade/[id].tsx` — 채팅 버튼 실동작
- `app/(tabs)/mypage/index.tsx` — 채팅 메뉴 + unread 뱃지
- `app/_layout.tsx` — 구 chat/notifications 라우트 제거 (→ (tabs) 이동)
- `app/(tabs)/_layout.tsx` — chat, notifications Tabs.Screen(href:null) 추가
- `app/(tabs)/mypage/notification-settings.tsx` — chat 알림 토글
- `app/(tabs)/notifications/index.tsx` — chat TYPE_ICON 엔트리
- `lib/mockData.ts` — userId 필드 추가

**추가 생성된 파일 (2개 — 탭바 버그 수정):**
- `app/(tabs)/chat/_layout.tsx`
- `app/(tabs)/notifications/_layout.tsx`

**핵심 기술:**
- Supabase Realtime: `supabase.channel('room-N').on('postgres_changes', { event: 'INSERT', filter: 'room_id=eq.N' })`
- REPLICA IDENTITY FULL: chat_messages Realtime payload에 full row data 포함 필수
- 채널 모듈 레벨 관리: `let _channel: RealtimeChannel | null = null` (Zustand state에 저장 불가)
- UNIQUE(trade_post_id, buyer_id): 같은 매물 중복 방 방지

---

## 📌 SESSION 15 완료 상세

**구현된 기능:**
- `supabase/migrations/00006_notifications.sql` — notifications 테이블 (id/user_id/type/title/body/data jsonb/is_read/created_at), RLS 4개 정책, 복합 인덱스
- `store/useNotificationStore.ts` — Zustand store: notifications[], unreadCount, fetchNotifications, markAsRead, markAllAsRead, deleteNotification (snake→camelCase 매핑)
- `lib/notifications.ts` — createNotification(userId, type, title, body, data) 서버사이드 생성 헬퍼
- `components/common/NotificationBell.tsx` — useNotificationStore 구독, unreadCount > 0 시 빨간 뱃지 (최대 99+), /notifications 이동
- `components/common/Header.tsx` — default right fallback을 NotificationBell로 교체 → 4개 탭 코드 변경 없이 자동 적용
- `app/notifications/index.tsx` — 알림 목록: 타입별 아이콘+색상(6종), unread 금색 dot, "전체 읽음" 버튼, formatRelativeTime, 빈 상태, 아이템 탭 → markAsRead + data.screen 이동
- `app/mypage/notification-settings.tsx` — 6개 알림 타입 Switch, AsyncStorage notif_<type> 키로 저장/로드, 앱 재시작 후에도 유지
- `app/(tabs)/mypage/index.tsx` — "알림 설정" Switch → TouchableOpacity + chevron (→ /mypage/notification-settings)
- `app/_layout.tsx` — notifications, mypage/notification-settings 라우트 추가

**알림 타입 6종:**
| type | 아이콘 | 색상 |
|------|--------|------|
| trade_interest | heart | red |
| price_alert | trending-up | green |
| comment | chatbubble | accent(blue) |
| system | notifications | sub(gray) |
| buyback_status | cash | orange |
| exchange_status | swap-horizontal | purple |

**생성된 파일 (6개):**
- `supabase/migrations/00006_notifications.sql`
- `store/useNotificationStore.ts`
- `lib/notifications.ts`
- `components/common/NotificationBell.tsx`
- `app/notifications/index.tsx`
- `app/mypage/notification-settings.tsx`

**수정된 파일 (3개):**
- `components/common/Header.tsx` — NotificationBell fallback 교체
- `app/(tabs)/mypage/index.tsx` — Switch 제거, navigation 추가
- `app/_layout.tsx` — 라우트 2개 추가

---

## 📌 SESSION 14 완료 상세

**구현된 기능:**
- 로그인 가드 통일: `lib/authGuard.ts` 생성 — `requireAuth(router, isLoggedIn, label)` 유틸리티. 기존 trade.tsx/community.tsx 인라인 체크 + mypage/index.tsx requireLogin 헬퍼를 모두 교체. trade/create.tsx useEffect도 교체.
- 이미지 업로드 실제 구현 (`trade/create.tsx`): expo-image-picker 갤러리 선택 → Supabase Storage trade-images 버킷 업로드 → URL 저장 → 사진 박스에 미리보기 표시. 업로드 중 ActivityIndicator 표시.
- 이미지 업로드 실제 구현 (`BuybackSheet.tsx Step 4`): 전면/후면/측면 3슬롯 → buyback-images 버킷. 동일 UX 패턴.
- 이미지 업로드 실제 구현 (`ExchangeSheet.tsx Step 3`): 5슬롯 → buyback-images 버킷.
- `store/useExchangeStore.ts` — uploadPhotos 액션 추가
- `store/useTradeStore.ts` createTradePost: `imageUrls: []` 하드코딩 → `formData.photos.filter(Boolean)` 실제 사용
- `store/useBuybackStore.ts` submitRequest: `photoUrls: []` 하드코딩 → `formData.photos.filter(Boolean)` 실제 사용
- `store/useExchangeStore.ts` submitRequest: `photos: null` → `formData.photos.length > 0 ? formData.photos : null`
- BuybackSheet "기타" 브랜드: 탐색 결과 이미 구현됨 (스킵)

**수정된 파일 (7개):**
- `lib/authGuard.ts` — 신규 생성
- `app/(tabs)/trade.tsx` — requireAuth 적용, console.log 제거, Alert import 제거
- `app/(tabs)/community.tsx` — requireAuth 적용, console.log 제거, Alert import 제거
- `app/trade/create.tsx` — requireAuth + expo-image-picker + 사진 박스 미리보기
- `app/(tabs)/mypage/index.tsx` — requireLogin 헬퍼 삭제 → requireAuth 교체
- `components/buyback/BuybackSheet.tsx` — Step4 사진 업로드 구현
- `components/exchange/ExchangeSheet.tsx` — Step3 사진 업로드 구현

**수정된 스토어 (3개):**
- `store/useTradeStore.ts` — createTradePost photos 실제 사용
- `store/useBuybackStore.ts` — submitRequest photos 실제 사용
- `store/useExchangeStore.ts` — uploadPhotos 추가, submitRequest photos 실제 사용

---

## 📌 SESSION 13 완료 상세

**구현된 기능:**
- MY 페이지 완전 리디자인: 프로필 카드(아바타+닉네임+레벨 배지+bio+편집 버튼), 활동 섹션(컬렉션/매물/게시글/매입교환/관심매물), 설정 섹션(알림Switch/이용약관/개인정보/앱정보/로그아웃), 비로그인 유도 카드
- 프로필 편집: expo-image-picker로 아바타 촬영/선택, Supabase Storage 업로드, 닉네임/bio TextInput 편집, 저장 시 users 테이블 update
- 내 매물: user_id 기준 trade_posts 조회, 판매중/예약중/거래완료 상태 배지, 빈 상태 CTA
- 내 게시글: user_id 기준 community_posts 조회, 카테고리 배지, 💬/❤️ 메타, 빈 상태 CTA
- 매입/교환 내역: user_id 기준 buyback_requests 조회, 타입(매입/교환) 배지, 상태(접수/검토중/완료/취소) 배지

**신규 Store 액션:**
```typescript
// useAuthStore
updateProfile(nickname, bio, avatarUrl) → { success }
uploadAvatar(imageUri) → publicUrl | null

// useTradeStore
fetchMyTrades(userId) → myTrades: MyTradeItem[]

// useCommunityStore
fetchMyPosts(userId) → myPosts: MyPost[]

// useBuybackStore
fetchMyRequests(userId) → myRequests: MyRequest[]
export REQUEST_STATUS_LABEL / REQUEST_STATUS_COLOR
```

**생성된 파일 (4개):**
- `app/mypage/edit-profile.tsx`
- `app/mypage/my-trades.tsx`
- `app/mypage/my-posts.tsx`
- `app/mypage/my-requests.tsx`

**수정된 파일 (6개):**
- `store/useAuthStore.ts`, `store/useTradeStore.ts`, `store/useCommunityStore.ts`, `store/useBuybackStore.ts`
- `app/(tabs)/mypage.tsx`, `app/_layout.tsx`

---

## 📌 SESSION 12 완료 상세

**구현된 기능:**
- 하단 탭 6개 → 5개 개편: 시세/커뮤니티 탭 제거(href:null로 숨김, router.push 접근 유지), 교환거래 탭 신규 추가
- 즉시매입 탭을 센터 원형 버튼으로 변경 (56×56, 포커스 시 COLORS.accent)
- 교환거래 소개 페이지: 다크 네이비(#1A1A2E) + 골드(#C9A84C) 헤로, Trust Badges 3개, 진행 4단계 타임라인, Why WATCHOUT 2×2 그리드, 브랜드 태그 flexWrap, FAQ 아코디언 4개, 하단 CTA
- ExchangeSheet 4단계 바텀시트 (BuybackSheet 패턴 완전 동일): Step1(내 시계), Step2(원하는 시계), Step3(사진+상세), Step4(연락처+요약+동의)
- DB 마이그레이션: buyback_requests에 type, wanted_*, kakao_id, contact_method 컬럼 추가, C급 condition 허용
- 홈 화면: 실시간 시세 Top3 배너(→ /price), 교환거래 미니배너(→ /exchange) 신규 추가

**교환거래 전용 색상 (exchange.tsx, ExchangeSheet.tsx 내부 상수, COLORS에 추가 안 함):**
```typescript
const EXCHANGE = {
  primary: '#1A1A2E',         // 다크 네이비
  accent: '#C9A84C',          // 골드
  surface: '#F8F6F1',         // 웜 그레이
  border: '#E5E2DB',          // 웜 보더
  accentLight: 'rgba(201,168,76,0.15)',
};
```

**기술적 특징:**
- `BottomTabBarButtonProps` from `@react-navigation/bottom-tabs`로 tabBarButton 커스텀
- `href: null` — 탭 바에서 숨기되 파일/라우트 유지, router.push로 접근 가능
- ExchangeSheet: TOTAL_STEPS=4, 기타 브랜드 직접입력, C급 condition, 요청 요약 박스, 개인정보 동의 Ionicons 체크박스
- useExchangeStore: isStepValid(step별 필수값), submitRequest(buyback_requests INSERT, type:'exchange')
- TypeScript 컴파일 통과 (tsc --noEmit)

**생성된 파일 (4개):**
- `supabase/migrations/00005_exchange_trade.sql`
- `store/useExchangeStore.ts`
- `components/exchange/ExchangeSheet.tsx`
- `app/(tabs)/exchange.tsx`

**수정된 파일 (2개):**
- `app/(tabs)/_layout.tsx` — CenterTabButton, 5탭 + 2 hidden
- `app/(tabs)/index.tsx` — 시세 배너 + 교환거래 미니배너 + 관련 스타일

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
