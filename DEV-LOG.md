# WATCHOUT — DEV-LOG.md

> 각 세션의 작업 내용을 기록합니다.
> Claude Code가 세션 시작 시 이 파일을 읽고 현재 진행 상황을 파악합니다.

---

## 2026-02-23 — 채팅 이미지 전송

### 완료
- [x] `expo-image-manipulator@~14.0.8` 설치
- [x] `store/useChatStore.ts` — `sendImageMessage(roomId, imageUri)` 액션 추가
  - expo-image-manipulator로 리사이즈 (max 1024px, JPEG quality 0.7)
  - Supabase Storage `chat-images` 버킷에 `chat/{roomId}/{userId}_{ts}.jpg` 업로드
  - `chat_messages` INSERT (message_type: 'image', message: 공개 URL)
  - `chat_rooms` last_message='사진' 업데이트 + 상대방 unread++
  - Supabase 미연결 시 리사이즈된 로컬 URI로 mock 모드 동작
- [x] `app/(tabs)/chat/[roomId].tsx` — 이미지 전송 + 뷰어
  - 입력창 좌측 📎(`attach` 아이콘) 버튼 → `handleImagePick`
  - expo-image-picker 갤러리 선택, 권한 체크
  - 이미지 메시지 = 200×200 둥근 썸네일 (내/상대방 동일 크기, borderRadius 분기)
  - 터치 → `Modal` 전체화면 뷰어 (검은 오버레이 + X 닫기 버튼)
- [x] TypeScript 컴파일 검증 통과 (tsc --noEmit)

### 핵심 패턴
```typescript
// 리사이즈 (동적 import로 타입 충돌 회피)
const resized = await manipulate(imageUri, [{ resize: { width: 1024 } }], {
  compress: 0.7, format: SaveFormat.JPEG,
});

// Storage 업로드 (fetch → blob)
const blob = await (await fetch(resized.uri)).blob();
await supabase.storage.from('chat-images').upload(fileName, blob, { contentType: 'image/jpeg' });

// 이미지 메시지 렌더링
{isImage && (
  <TouchableOpacity onPress={() => setViewerUri(msg.message)}>
    <Image source={{ uri: msg.message }} style={styles.imageBubble} resizeMode="cover" />
  </TouchableOpacity>
)}
```

### 수정된 파일 (2개)
- `store/useChatStore.ts` — `sendImageMessage` 액션 추가
- `app/(tabs)/chat/[roomId].tsx` — 📎 버튼, 이미지 버블, Modal 뷰어

---

## 2026-02-23 — SESSION 17 후속: 홈 화면 리디자인 + 탭 구조 변경

### 완료
- [x] `lib/constants.ts` — COLORS에 5개 추가: headerBg('#0C0C14'), tabBg('#0C0C14'), pageBg('#F5F5F7'), gold('#C9A84C'), goldMuted('#F0E4C2')
- [x] `components/common/Header.tsx` — `dark?: boolean` prop: true 시 headerBg 배경, 흰색 타이틀/아이콘, 반투명 보더
- [x] `components/common/NotificationBell.tsx` — `color?: string` prop: 미전달 시 COLORS.text 유지
- [x] `app/(tabs)/_layout.tsx` — 다크 탭 바: tabBarActiveTintColor=gold, tabBarInactiveTintColor='rgba(255,255,255,0.45)', tabBar bg=#0C0C14, trade 탭 "사고/팔기" pricetag-outline 아이콘, 즉시매입 센터 버튼 gold 색상
- [x] `app/(tabs)/index.tsx` — 완전 리라이트: Quick Actions 4개 수평(54x54 아이콘), MARKET 수평스크롤 SparkLine 카드(5개), 프리미엄 다크 배너(금색 레이블+흰 헤드라인+2버튼), MARKETPLACE/NEWS/COMMUNITY 카드형 리스트
- [x] 4개 탭 헤더 dark prop: exchange.tsx, buyback.tsx, trade.tsx(+제목 변경), mypage/index.tsx
- [x] TypeScript 컴파일 검증 통과 (tsc --noEmit)

### 핵심 패턴
```typescript
// Header dark 모드
<Header title="WATCHOUT" dark right={<NotificationBell color="#FFFFFF" />} />

// 탭 바 골드 액센트
tabBarActiveTintColor: COLORS.gold,
tabBarInactiveTintColor: 'rgba(255,255,255,0.45)',
backgroundColor: COLORS.tabBg,  // #0C0C14

// 홈 섹션 레이블 패턴
<Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 1.2, color: COLORS.gold }}>
  MARKET
</Text>
<Text style={{ fontSize: 18, fontWeight: '800' }}>실시간 시세</Text>
```

### 수정된 파일 (7개)
- `lib/constants.ts`
- `components/common/Header.tsx`
- `components/common/NotificationBell.tsx`
- `app/(tabs)/_layout.tsx`
- `app/(tabs)/index.tsx`
- `app/(tabs)/exchange.tsx`, `buyback.tsx`, `trade.tsx`, `mypage/index.tsx` (4개 dark prop)

---

## 2026-02-23 — SESSION 17: 관심 매물 찜 기능

### 완료
- [x] `supabase/migrations/00008_favorites.sql` — favorites(id, user_id FK, trade_post_id FK, UNIQUE 제약), RLS 3개(조회/추가/삭제), 인덱스 2개
- [x] `store/useFavoriteStore.ts` — favoriteIds[], fetchFavorites(Supabase 미연결 시 경고만), toggleFavorite(optimistic update — 즉시 UI 반영 후 Supabase 동기화, 실패해도 로컬 유지), isFavorite(id)
- [x] `components/trade/TradeCard.tsx` — isFavorite/onFavoritePress optional prop 추가, 이미지 하단 우측에 28px 원형 하트 버튼 오버레이 (반투명 흰 배경)
- [x] `app/trade/[id].tsx` — 하단 고정 바 하트 버튼: requireAuth + toggleFavorite, 찜 상태에 따라 heart(빨간)/heart-outline 토글
- [x] `app/(tabs)/trade.tsx` — useFavoriteStore import, isLoggedIn useEffect → fetchFavorites, handleFavoriteToggle(requireAuth + toggleFavorite), TradeCard에 isFavorite/onFavoritePress prop 전달
- [x] `app/(tabs)/mypage/favorites.tsx` — 완전 재구현: 비로그인/빈 상태/목록 3분기, tradeItems × favoriteIds 필터링, 2컬럼 TradeCard 그리드, Header 공통 컴포넌트 사용
- [x] TypeScript 컴파일 검증 통과 (tsc --noEmit)

### 핵심 패턴
```typescript
// Optimistic update: 즉시 UI 반영 → Supabase 동기화 → 실패해도 유지
const alreadyFav = get().isFavorite(tradePostId);
set(state => ({
  favoriteIds: alreadyFav
    ? state.favoriteIds.filter(id => id !== tradePostId)
    : [...state.favoriteIds, tradePostId],
}));
// then try Supabase...

// TradeCard 하트 버튼 — stopPropagation으로 카드 클릭과 분리
<TouchableOpacity
  onPress={(e) => { e.stopPropagation?.(); onFavoritePress(); }}
/>
```

### 생성된 파일 (2개)
- `supabase/migrations/00008_favorites.sql`
- `store/useFavoriteStore.ts`

### 수정된 파일 (4개)
- `components/trade/TradeCard.tsx`
- `app/trade/[id].tsx`
- `app/(tabs)/trade.tsx`
- `app/(tabs)/mypage/favorites.tsx`

---

## 2026-02-23 — SESSION 16 후속: 탭바 버그 수정 + Mock 채팅 데이터

### 완료
- [x] **탭바 사라짐 버그 근본 수정** — (tabs) nested Stack 패턴으로 채팅/알림 라우트 이동
  - `app/(tabs)/chat/_layout.tsx` 신규 (nested Stack: index, [roomId])
  - `app/(tabs)/notifications/_layout.tsx` 신규 (nested Stack: index)
  - `app/(tabs)/_layout.tsx` — chat, notifications Tabs.Screen(href:null) 추가
  - `app/_layout.tsx` — 구 루트 레벨 chat/notifications/mypage/notification-settings 라우트 제거
  - 기존 파일 이동: `app/chat/*` → `app/(tabs)/chat/*`, `app/notifications/*` → `app/(tabs)/notifications/*`, `app/mypage/notification-settings.tsx` → `app/(tabs)/mypage/notification-settings.tsx`
- [x] **Mock 채팅 데이터 fallback** — Supabase 미연결 시 자동 시드
  - `store/useChatStore.ts` — `createMockRooms(userId)` 채팅방 2개 (Rolex 서브마리너, Omega 스피드마스터)
  - `store/useChatStore.ts` — `createMockMessages(roomId, userId)` room1=5개/room2=3개 메시지 (자연스러운 매물 문의 대화)
  - fetchChatRooms: Supabase 오류 시 mock fallback
  - fetchMessages: Supabase 오류 시 mock fallback
  - sendMessage: Supabase 오류 시 로컬 state에 직접 추가 (`_localMsgId` 카운터)
  - createOrGetRoom: state 먼저 확인 → Supabase → 실패 시 로컬 방 생성
  - markRoomAsRead: 로컬 먼저 업데이트 후 Supabase 시도 (실패해도 무시)
- [x] `lib/mockData.ts` — MOCK_TRADE_ITEMS 7개에 `userId: 'mock-seller-00N'` 추가 (채팅 버튼 동작)
- [x] TypeScript 컴파일 검증 통과 (tsc --noEmit)

### Mock 채팅 대화 내용
```
Room 1 (Rolex 서브마리너 126610LN — watchman):
  나: "서브마리너 아직 판매 중인가요?"
  watchman: "네, 판매 중입니다! 언제든지 연락 주세요."
  나: "직거래 가능할까요? 강남역 쪽 괜찮으신지요"
  watchman: "강남역 가능합니다. 주말 오후 시간 어떠세요?"
  나: "토요일 오후 2시 괜찮습니다!"

Room 2 (Omega 스피드마스터 310.30.42 — omega_fan):
  나: "스피드마스터 가격 조금 조정 가능할까요?"
  omega_fan: "5,800,000원까지는 가능합니다 :)"
  나: "감사합니다. 보증서 유효기간 확인 부탁드릴게요"
```

### 탭바 패턴 (mypage, collection, chat, notifications 공통)
```
app/(tabs)/[feature]/
  _layout.tsx   ← Stack (screenOptions: headerShown: false)
  index.tsx     ← 메인 화면
  [sub].tsx     ← 서브 화면들

app/(tabs)/_layout.tsx:
  <Tabs.Screen name="[feature]" options={{ href: null }} />
```

### 수정된 파일 (5개)
- `store/useChatStore.ts`
- `lib/mockData.ts`
- `app/(tabs)/_layout.tsx`
- `app/(tabs)/mypage/_layout.tsx`
- `app/_layout.tsx`

### 추가 생성된 파일 (5개)
- `app/(tabs)/chat/_layout.tsx`
- `app/(tabs)/notifications/_layout.tsx`
- `app/(tabs)/chat/index.tsx` (구 app/chat/index.tsx 이동)
- `app/(tabs)/chat/[roomId].tsx` (구 app/chat/[roomId].tsx 이동)
- `app/(tabs)/notifications/index.tsx` (구 app/notifications/index.tsx 이동)
- `app/(tabs)/mypage/notification-settings.tsx` (구 app/mypage/notification-settings.tsx 이동)

---

## 2026-02-23 — SESSION 16: 1:1 실시간 채팅 (Supabase Realtime)

### 완료
- [x] supabase/migrations/00007_chat.sql — chat_rooms + chat_messages 테이블, RLS 4개 정책, REPLICA IDENTITY FULL, notifications type CHECK에 'chat' 추가
- [x] store/useChatStore.ts — ChatRoom/ChatMessage interface, fetchChatRooms/fetchMessages/sendMessage/createOrGetRoom/markRoomAsRead/subscribeToRoom(Realtime)/unsubscribeFromRoom
- [x] app/chat/index.tsx — 채팅방 목록 (ScrollView+map, 아바타, unread 뱃지, 비로그인 가드)
- [x] app/chat/[roomId].tsx — 실시간 채팅 화면 (날짜 구분선, 시스템/내/상대 버블, KeyboardAvoidingView, scrollToEnd)
- [x] types/index.ts — MockTradeItem에 userId?: string 추가
- [x] store/useNotificationStore.ts — NotificationType에 'chat' 추가
- [x] store/useTradeStore.ts — fetchTradePosts에 userId: post.user_id 매핑
- [x] app/trade/[id].tsx — handleChatPress 실제 동작 (requireAuth + createOrGetRoom + router.push), isMyPost 버튼 비활성화
- [x] app/(tabs)/mypage/index.tsx — 채팅 메뉴 (나의 활동 첫 번째) + totalUnread 뱃지
- [x] app/_layout.tsx — chat, chat/[roomId] 라우트 추가
- [x] app/mypage/notification-settings.tsx — chat 알림 토글 (SETTINGS 배열 + initial state)
- [x] app/notifications/index.tsx — TYPE_ICON에 chat: { name: 'chatbox', ... } 추가
- [x] TypeScript 컴파일 검증 통과 (tsc --noEmit)

### 생성된 파일 (4개)
- `supabase/migrations/00007_chat.sql`
- `store/useChatStore.ts`
- `app/chat/index.tsx`
- `app/chat/[roomId].tsx`

### 수정된 파일 (8개)
- `types/index.ts`, `store/useNotificationStore.ts`, `store/useTradeStore.ts`
- `app/trade/[id].tsx`, `app/(tabs)/mypage/index.tsx`, `app/_layout.tsx`
- `app/mypage/notification-settings.tsx`, `app/notifications/index.tsx`

### 핵심 패턴
```typescript
// Realtime 구독 — 모듈 레벨 채널 (Zustand state에 저장 불가)
let _channel: RealtimeChannel | null = null;

subscribeToRoom: (roomId, onNewMessage) => {
  if (_channel) supabase.removeChannel(_channel);
  _channel = supabase
    .channel(`room-${roomId}`)
    .on('postgres_changes', {
      event: 'INSERT', schema: 'public',
      table: 'chat_messages', filter: `room_id=eq.${roomId}`,
    }, (payload) => {
      const msg = mapMessage(payload.new);
      set(s => ({ currentMessages: [...s.currentMessages, msg] }));
      onNewMessage(msg);
    }).subscribe();
},

// createOrGetRoom — UPSERT 패턴
const { data: existing } = await supabase.from('chat_rooms')
  .select('id').eq('trade_post_id', tradePostId).eq('buyer_id', user.id).maybeSingle();
if (existing) return existing.id;
// → INSERT + 시스템 메시지

// 날짜 구분선 (렌더링 루프 내 변수)
let lastDateLabel = '';
// ...
const dateLabel = getDateLabel(msg.createdAt);
const showDate = dateLabel !== lastDateLabel;
if (showDate) lastDateLabel = dateLabel;
```

### ⚠️ Supabase 설정 필요
- 00001~00007 SQL 실행
- Supabase 대시보드 → Database → Replication → chat_messages 테이블 Realtime 활성화 확인 (SQL의 REPLICA IDENTITY FULL 보완)

---

## 2026-02-23 — SESSION 15: 알림 시스템 구현

### 완료
- [x] supabase/migrations/00006_notifications.sql — notifications 테이블 + RLS 4개 정책 + 복합 인덱스
- [x] store/useNotificationStore.ts — NotificationType(6종), Notification 인터페이스, Zustand store
- [x] lib/notifications.ts — createNotification 헬퍼 (서버사이드 알림 생성용)
- [x] components/common/NotificationBell.tsx — 뱃지(최대 99+, 빨간원), /notifications 이동
- [x] components/common/Header.tsx — default fallback → NotificationBell 교체
- [x] app/notifications/index.tsx — 6종 타입 아이콘, unread 금색 dot, 전체 읽음, 빈 상태
- [x] app/mypage/notification-settings.tsx — 6종 Switch, AsyncStorage 영구 저장
- [x] app/(tabs)/mypage/index.tsx — 알림 설정 Switch → 설정 페이지 navigation
- [x] app/_layout.tsx — 라우트 2개 추가
- [x] TypeScript 컴파일 검증 통과 (tsc --noEmit)

### 주요 패턴
```typescript
// NotificationBell — store 직접 구독 + router 내부 보유
const NotificationBell = () => {
  const { unreadCount } = useNotificationStore();
  const router = useRouter();
  // badge: position absolute, top:0, right:0
};

// Header — fallback만 교체, interface 변경 없음
{right ?? <NotificationBell />}

// notification-settings — AsyncStorage 키: notif_<type>
await AsyncStorage.setItem(`notif_${type}`, String(value));
```

---

## 2026-02-23 — SESSION 14: 로그인 가드 통일 + 이미지 업로드 실제 구현

### 완료
- [x] lib/authGuard.ts — requireAuth(router: Router, isLoggedIn: boolean, label?: string): boolean 생성
- [x] app/(tabs)/trade.tsx — requireAuth 적용, console.log 제거, Alert import 제거
- [x] app/(tabs)/community.tsx — 동일
- [x] app/trade/create.tsx — requireAuth + expo-image-picker 사진 선택 + 업로드 + 미리보기
- [x] app/(tabs)/mypage/index.tsx — 인라인 requireLogin 헬퍼 삭제 → requireAuth 교체
- [x] components/buyback/BuybackSheet.tsx — Step4 사진 3슬롯 실제 구현 (gallerry → buyback-images → 미리보기)
- [x] components/exchange/ExchangeSheet.tsx — Step3 사진 5슬롯 실제 구현
- [x] store/useExchangeStore.ts — uploadPhotos 액션 추가, submitRequest photos 실제 사용
- [x] store/useTradeStore.ts — createTradePost에서 formData.photos.filter(Boolean) 사용
- [x] store/useBuybackStore.ts — submitRequest에서 formData.photos.filter(Boolean) 사용
- [x] TypeScript 컴파일 검증 통과 (tsc --noEmit)

### 주요 패턴
```typescript
// lib/authGuard.ts
import type { Router } from 'expo-router';
export const requireAuth = (router: Router, isLoggedIn: boolean, label = '이 기능'): boolean => {
  if (!isLoggedIn) {
    Alert.alert('로그인 필요', `${label}은(는) 로그인 후 이용 가능합니다.`, [
      { text: '취소', style: 'cancel' },
      { text: '로그인', onPress: () => router.push('/auth/login') },
    ]);
    return false;
  }
  return true;
};

// 사진 업로드 패턴 (create.tsx, BuybackSheet, ExchangeSheet)
const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: Images, allowsEditing: true, quality: 0.8 });
if (!result.canceled) {
  const urls = await uploadImages([result.assets[0].uri]);
  if (urls.length > 0) setFormField('photos', [...photos.slice(0, i), urls[0], ...photos.slice(i + 1)]);
}
```

### 생성된 파일 (1개)
- `lib/authGuard.ts`

### 수정된 파일 (10개)
- `app/(tabs)/trade.tsx`, `app/(tabs)/community.tsx` — 인라인 체크 → requireAuth, console.log 제거
- `app/trade/create.tsx` — requireAuth + ImagePicker + 사진 미리보기
- `app/(tabs)/mypage/index.tsx` — requireLogin 헬퍼 삭제 → requireAuth
- `components/buyback/BuybackSheet.tsx` — Step4 사진 업로드
- `components/exchange/ExchangeSheet.tsx` — Step3 사진 업로드
- `store/useTradeStore.ts`, `store/useBuybackStore.ts`, `store/useExchangeStore.ts` — photos 실제 적용

### 스킵 항목
- BuybackSheet "기타" 브랜드: 이미 구현됨 (SESSION 12에서 완료)

---

## 2026-02-23 — SESSION 13: MY 페이지 완성 + 프로필 편집

### 완료
- [x] expo-image-picker 패키지 설치
- [x] store/useAuthStore.ts — updateProfile, uploadAvatar 액션 추가
- [x] store/useTradeStore.ts — MyTradeItem interface, myTrades/myTradesLoading state, fetchMyTrades(userId) 추가
- [x] store/useCommunityStore.ts — MyPost interface, myPosts/myPostsLoading state, fetchMyPosts(userId) 추가
- [x] store/useBuybackStore.ts — MyRequest interface, REQUEST_STATUS_LABEL/COLOR(exported), myRequests/myRequestsLoading state, fetchMyRequests(userId) 추가
- [x] app/(tabs)/mypage.tsx — 완전 리디자인 (프로필 카드, 활동/설정 섹션, 비로그인 분기)
- [x] app/mypage/edit-profile.tsx — 신규 생성 (ImagePicker, 닉네임/bio 편집, 저장)
- [x] app/mypage/my-trades.tsx — 신규 생성 (내 매물 리스트 + 상태 배지)
- [x] app/mypage/my-posts.tsx — 신규 생성 (내 게시글 리스트 + 카테고리 배지)
- [x] app/mypage/my-requests.tsx — 신규 생성 (매입/교환 내역 + 타입/상태 배지)
- [x] app/_layout.tsx — mypage/* 라우트 4개 추가
- [x] TypeScript 컴파일 검증 통과 (tsc --noEmit)

### 생성된 파일 (4개)
- `app/mypage/edit-profile.tsx` — 프로필 편집 (~300줄)
- `app/mypage/my-trades.tsx` — 내 매물 리스트 (~240줄)
- `app/mypage/my-posts.tsx` — 내 게시글 리스트 (~175줄)
- `app/mypage/my-requests.tsx` — 매입/교환 내역 (~180줄)

### 수정된 파일 (6개)
- `store/useAuthStore.ts` — updateProfile, uploadAvatar 추가
- `store/useTradeStore.ts` — MyTradeItem, fetchMyTrades 추가
- `store/useCommunityStore.ts` — MyPost, fetchMyPosts 추가
- `store/useBuybackStore.ts` — MyRequest, REQUEST_STATUS_LABEL/COLOR, fetchMyRequests 추가
- `app/(tabs)/mypage.tsx` — 완전 리디자인
- `app/_layout.tsx` — mypage/* 4개 라우트 추가

### MY 페이지 구조 (리디자인)
```
로그인 상태:
  프로필 카드 (아바타 64px / person-circle 아이콘 + 닉네임 + Lv.N 배지 + bio + [프로필 편집] 버튼)
  활동 섹션:
    내 컬렉션 → /collection
    내 매물   → /mypage/my-trades
    내 게시글 → /mypage/my-posts
    매입/교환 내역 → /mypage/my-requests
    관심 매물 → Alert (다음 업데이트)
  설정 섹션:
    알림 설정 (Switch 토글)
    이용약관 / 개인정보처리방침 / 앱 정보 (Alert)
    로그아웃 (Confirm Alert)

비로그인 상태:
  로그인 유도 카드 + [로그인하기] 버튼
  설정 섹션만 표시 (로그아웃 → [로그인하기])
```

### 각 서브페이지 구조
- **edit-profile**: 아바타(원형 88px + 사진변경 버튼) → 닉네임 TextInput → bio TextInput(3줄, 글자수 카운터) → [저장]
- **my-trades**: 빈상태(매물등록하기 CTA) 또는 리스트 (80×80 watch-outline 박스, 판매/구매 배지, 브랜드 모델, 가격, 상태배지, 시간)
- **my-posts**: 빈상태(글쓰기 CTA) 또는 리스트 (카테고리 배지, 제목, 💬/❤️/시간 메타)
- **my-requests**: 빈상태 또는 리스트 (타입배지 좌측, 브랜드 모델, 시간, 상태배지 우측)

### 기술적 특징
- **updateProfile**: supabase.from('users').update({ nickname, bio, avatar_url, updated_at }) + set({ user: {...} })
- **uploadAvatar**: supabase.storage.from('avatars').upload(userId/avatar.jpg, uri, { upsert: true }) + getPublicUrl
- **ImagePicker**: requestMediaLibraryPermissionsAsync → launchImageLibraryAsync(aspect:[1,1], quality:0.7)
- **REQUEST_STATUS_LABEL/COLOR**: useBuybackStore에서 export → my-requests.tsx에서 import
- **requireLogin(label, action)**: MY 페이지 내부 헬퍼 — 비로그인 시 Alert(로그인 화면 유도)
- **TRADE_STATUS_LABEL/COLOR**: my-trades.tsx 파일 내 로컬 상수 (active→판매중/green, reserved→예약중/orange, sold→거래완료/sub)

### 메모
- Supabase Storage 'avatars' 버킷은 00003_storage_buckets.sql에 이미 정의됨
- updateProfile 호출 시 updated_at 갱신 (users 테이블에 해당 컬럼 필요)
- MyTradeItem.type 필드는 trade_posts.type 컬럼 ('sell'/'buy') — status와 별개

---

## 2026-02-23 — SESSION 12: 교환거래 페이지 + 탭 구조 개편

### 완료
- [x] supabase/migrations/00005_exchange_trade.sql — buyback_requests 교환거래 컬럼 추가
- [x] store/useExchangeStore.ts — 4단계 폼 상태 (Zustand, BuybackStore 패턴 동일)
- [x] components/exchange/ExchangeSheet.tsx — 4단계 모달 바텀시트
- [x] app/(tabs)/exchange.tsx — 교환거래 소개 페이지 (다크 네이비 + 골드)
- [x] app/(tabs)/_layout.tsx — 탭 5개 개편 + 센터 원형 버튼
- [x] app/(tabs)/index.tsx — 시세 배너 + 교환거래 미니배너 추가
- [x] TypeScript 컴파일 검증 통과 (tsc --noEmit)

### 생성된 파일 (4개)
- `supabase/migrations/00005_exchange_trade.sql`
- `store/useExchangeStore.ts`
- `components/exchange/ExchangeSheet.tsx`
- `app/(tabs)/exchange.tsx`

### 수정된 파일 (2개)
- `app/(tabs)/_layout.tsx`
- `app/(tabs)/index.tsx`

### DB 변경 (00005_exchange_trade.sql)
```sql
ALTER TABLE buyback_requests
  ADD COLUMN IF NOT EXISTS type text NOT NULL DEFAULT 'buyback';
  -- CHECK (type IN ('buyback', 'exchange'))
  ADD COLUMN IF NOT EXISTS wanted_brand text,
  ADD COLUMN IF NOT EXISTS wanted_model text,
  ADD COLUMN IF NOT EXISTS wanted_condition text,
  ADD COLUMN IF NOT EXISTS wanted_note text,
  ADD COLUMN IF NOT EXISTS kakao_id text,
  ADD COLUMN IF NOT EXISTS contact_method text;
-- condition 체크: S/A/B/C (C급 신규 추가)
```

### 교환거래 페이지 구조
```
exchange.tsx
  ├─ Hero (다크 네이비 #1A1A2E + 골드 배지 + repeat 아이콘)
  ├─ Trust Badges 3개 (가로 스크롤)
  ├─ 진행 과정 4단계 (타임라인: 01신청→02검토→03딜→04확정)
  ├─ Why WATCHOUT 2×2 그리드
  ├─ 교환 가능 브랜드 태그 (flexWrap)
  ├─ FAQ 아코디언 4개
  ├─ 하단 CTA 배너 (다크 네이비)
  └─ ExchangeSheet 모달 (sheetVisible 상태)
```

### ExchangeSheet 4단계
- Step 1 — 내 시계: 브랜드 칩(기타→TextInput), 모델, 컨디션 S/A/B/C 2×2
- Step 2 — 원하는 시계: 브랜드 칩(기타→TextInput), 모델, 컨디션(선택), 요청사항
- Step 3 — 사진+상세: 5개 사진 슬롯(placeholder), 연도, 구성품(풀세트/풀박스/시계만), 특이사항
- Step 4 — 연락처+확인: 전화번호(필수), 카카오ID(선택), 연락방법 칩, 요청 요약 박스(↔), 개인정보 동의 체크박스

### 탭 구조 변경
```
기존 6탭: 홈 | 시세 | 즉시매입 | 시계거래 | 커뮤니티 | MY
변경 5탭: 홈 | 교환거래 | [즉시매입 센터버튼] | 시계거래 | MY
숨김(href:null): 시세, 커뮤니티 (파일 유지, router.push 접근 가능)
```

### 홈 화면 추가 섹션
- 실시간 시세 Top3: MOCK_WATCHES 3개, 순위 + 브랜드/모델 + 가격/변동률, → /price
- 교환거래 미니배너: 다크 네이비(#1A1A2E), repeat 아이콘 골드, → /(tabs)/exchange

---

## 2026-02-23 — SESSION 11: 시세 크롤러 구현 (TypeScript/Node.js)

### 완료
- [x] crawlers/tsconfig.json — Node.js용 TS 설정 (Expo tsconfig와 완전 분리)
- [x] crawlers/types.ts — CrawledPrice, WatchTarget, SaveResult 타입 + WATCH_TARGETS(6개) + getTodayDate()
- [x] crawlers/hisigan.ts — 하이시간 크롤러 (axios + cheerio, KRW 수집)
- [x] crawlers/chrono24.ts — Chrono24 크롤러 (axios + cheerio, EUR 수집, 중간가 계산)
- [x] crawlers/savePrices.ts — Supabase Node.js 클라이언트 + watch_prices INSERT + 중복 스킵
- [x] crawlers/index.ts — 통합 실행기 runAll() (하이시간 → Chrono24 순차 실행)
- [x] crawlers/run.ts — 진입점 (dotenv 로드 → runAll)
- [x] package.json — axios/cheerio/dotenv(dep) + ts-node(dev) 추가 + "crawl" 스크립트
- [x] TypeScript 컴파일 검증 통과 (tsc --project crawlers/tsconfig.json --noEmit)
- [x] HANDOFF.md 기술 스택 업데이트 (Python → TypeScript/Node.js)

### 생성된 파일 (7개)
- `crawlers/tsconfig.json` — CommonJS + ES2020 + strict (Expo tsconfig와 분리)
- `crawlers/types.ts` — 공유 타입 정의 + 6개 시계 타겟 설정
- `crawlers/hisigan.ts` — 하이시간 시세 크롤러
- `crawlers/chrono24.ts` — Chrono24 시세 크롤러
- `crawlers/savePrices.ts` — Supabase 저장 로직
- `crawlers/index.ts` — 통합 실행기
- `crawlers/run.ts` — 진입점

### 수정된 파일 (1개)
- `package.json` — 패키지 4개 추가 + crawl 스크립트 추가

### 기술적 설계

**크롤러 아키텍처:**
```
npm run crawl
  └─ crawlers/run.ts (dotenv.config())
       └─ crawlers/index.ts (runAll)
            ├─ crawlers/hisigan.ts → CrawledPrice[] (KRW)
            ├─ crawlers/chrono24.ts → CrawledPrice[] (EUR)
            └─ crawlers/savePrices.ts → watch_prices INSERT
```

**핵심 설계 결정:**
- **Python → TypeScript**: Expo 프로젝트와 같은 언어, 타입 공유 용이
- **lib/supabase.ts 미사용**: React Native AsyncStorage adapter는 Node.js 환경 불호환 → crawlers 전용 createClient() 사용
- **Expo tsconfig 분리**: expo/tsconfig.base는 React Native 전용 → crawlers/tsconfig.json에서 CommonJS 별도 설정
- **dotenv**: .env의 EXPO_PUBLIC_* 변수 재사용 (별도 환경 파일 불필요)
- **중복 방지**: UNIQUE(watch_id, source, recorded_date) 제약 → INSERT 후 error.code === '23505' 체크

**크롤링 전략:**
- 하이시간: 검색 URL + 첫 번째 결과 가격 추출 (KRW)
- Chrono24: 검색 결과 목록 + 중간가 계산 (EUR, 상/하위 10% 제외)
- 요청 간격: 하이시간 1.5초, Chrono24 2초 (서버 부하 방지)
- 오류 격리: 단일 watch 실패 시 해당 항목만 스킵, 나머지 계속 진행

**WATCH_TARGETS 6개:**
| 브랜드 | 모델 | Ref |
|--------|------|-----|
| Rolex | Submariner | 126610LN |
| Rolex | Daytona | 116500LN |
| Rolex | GMT-Master II | 126710BLNR |
| Rolex | Datejust | 126234 |
| Omega | Speedmaster | 311.30.42.30.01.005 |
| AP | Royal Oak | 15500ST |

### 실행 방법
```bash
# 크롤러 실행
npm run crawl

# 타입 검증만
npx tsc --project crawlers/tsconfig.json --noEmit
```

### ⚠️ 다음 세션 필수 작업
- **CSS 선택자 검증**: hisigan.ts와 chrono24.ts에 `// TODO: 실제 선택자 확인 필요` 주석 있음
  - 각 사이트 실제 HTML 구조 확인 후 선택자 수정 필요
  - 하이시간: 동적 렌더링이면 cheerio 대신 puppeteer 필요
  - Chrono24: 접근 차단 시 User-Agent 로테이션 또는 다른 방법 검토
- **Supabase 마이그레이션**: watch_prices 테이블 없으면 savePrices 실패
  - 00001_create_tables.sql 실행 후 watches 시드 데이터 삽입 필요

### 메모
- 크롤러는 앱 코드(React Native)에 전혀 영향 없음 — 완전 분리된 Node.js 스크립트
- Chrono24 EUR 가격은 KRW 환산 없이 그대로 저장 (source='chrono24'로 구분 가능)
- 추후 cron job (Mac launchd) 또는 Supabase Edge Function으로 자동화 가능

---

## 2026-02-23 — SESSION 10: 전체 레이아웃 미세 조정 + UI 통일

### 완료
- [x] 시세 화면 separator(8px) → divider(1px) 변경 (app/(tabs)/price.tsx)
- [x] 검색바/필터 간격 최적화 — paddingBottom: SPACING.sm → SPACING.xs (8px → 4px)
- [x] 커뮤니티 listContainer marginBottom: SPACING.md → SPACING.sm (12px → 8px)
- [x] 커뮤니티 카운트 행 paddingTop: SPACING.sm → SPACING.xs (8px → 4px)
- [x] TypeScript 컴파일 검증 통과
- [x] Expo 캐시 클리어 후 재시작

### 수정된 파일 (3개)
- `app/(tabs)/price.tsx` — separator → divider 변경, searchSection/brandFilter paddingBottom 4px로 조정
- `app/(tabs)/trade.tsx` — searchSection/filterRow paddingBottom 4px로 조정
- `app/(tabs)/community.tsx` — countRow paddingTop 4px로 조정, listContainer marginBottom 8px로 조정

### 변경 사항 상세

**price.tsx:**
- `styles.separator` (height: SPACING.sm) → `styles.divider` (height: 1, backgroundColor: COLORS.border)
- JSX: `styles.separator` → `styles.divider`
- `searchSection.paddingBottom`: SPACING.sm (8px) → SPACING.xs (4px)
- `brandFilter.paddingBottom`: SPACING.sm (8px) → SPACING.xs (4px)

**trade.tsx:**
- `searchSection.paddingBottom`: SPACING.sm (8px) → SPACING.xs (4px)
- `filterRow.paddingBottom`: SPACING.sm (8px) → SPACING.xs (4px)

**community.tsx:**
- `countRow.paddingTop`: SPACING.sm (8px) → SPACING.xs (4px)
- `listContainer.marginBottom`: SPACING.md (12px) → SPACING.sm (8px)

### 기술적 특징
- **SPACING.xs: 4** 활용: lib/constants.ts에 이미 정의된 상수 사용
- **divider 통일**: 시세 화면도 다른 화면과 동일하게 1px 구분선 사용
- **compact 레이아웃**: 검색바 ↔ 필터 ↔ 리스트 사이 빈 공간 최소화
- **커뮤니티 카드 배경 유지**: listContainer의 카드 배경은 디자인적으로 유지 (게시글 그룹 강조)

### 최종 레이아웃 구조
```
Header
└─ ScrollView
   ├─ 검색/탭 (paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4)
   ├─ 필터 (paddingHorizontal: 20, paddingBottom: 4)
   ├─ 카운트 (paddingHorizontal: 20, paddingBottom: 8)
   └─ 리스트 (paddingHorizontal: 20)
      └─ 아이템 + divider (1px)
```

### 메모
- FlatList → ScrollView 전환은 SESSION 5에서 이미 완료
- contentContainerStyle에 flexGrow: 1 미사용 (이미 준수 중)
- placeholder 이미지 Ionicons 교체는 SESSION 9에서 완료
- 브랜드 칩 height: 32 고정은 이미 적용됨
- collection/index.tsx는 이미 올바른 패턴 사용 중 (수정 불필요)

---

## 2026-02-23 — SESSION 9: 내 컬렉션 (시계 포트폴리오) 기능 구현

### 완료
- [x] CollectionRow, CollectionInsert, CollectionWithWatch, PortfolioStats 타입 추가 (types/index.ts)
- [x] useCollectionStore 구현 (store/useCollectionStore.ts — 컬렉션 CRUD + 통계)
- [x] CollectionCard 컴포넌트 (components/collection/CollectionCard.tsx — 1-row 리스트)
- [x] SummaryCard 컴포넌트 (components/collection/SummaryCard.tsx — 포트폴리오 통계)
- [x] ReturnChart 컴포넌트 (components/collection/ReturnChart.tsx — 가로 바 차트)
- [x] 컬렉션 메인 화면 (app/collection/index.tsx — 통계+리스트+FAB)
- [x] 시계 추가 화면 (app/collection/add.tsx — 브랜드/모델 선택+구매 정보)
- [x] 컬렉션 상세 화면 (app/collection/[id].tsx — 가격 비교+차트+삭제)
- [x] MY 페이지 연결 (app/(tabs)/mypage.tsx — handleCollection 라우팅)
- [x] TypeScript 컴파일 검증 통과

### 생성된 파일 (7개)
- `store/useCollectionStore.ts` — 컬렉션 Zustand 스토어 (CRUD + getStats)
- `components/collection/CollectionCard.tsx` — 시계 카드 (PriceCard 패턴)
- `components/collection/SummaryCard.tsx` — 통계 카드 (4개 행)
- `components/collection/ReturnChart.tsx` — 수익률 차트 (가로 바)
- `app/collection/index.tsx` — 컬렉션 메인 화면 (~220줄)
- `app/collection/add.tsx` — 시계 추가 화면 (~280줄)
- `app/collection/[id].tsx` — 컬렉션 상세 화면 (~240줄)

### 수정된 파일 (2개)
- `types/index.ts` — CollectionRow, CollectionWithWatch, PortfolioStats 타입 추가 (기존 Collection 유지)
- `app/(tabs)/mypage.tsx` — handleCollection()에서 router.push('/collection') 실제 라우팅

### UI 구조
- **컬렉션 메인**: Header → ScrollView → (컬렉션 있을 때) SummaryCard + 보유 시계 리스트 + FAB | (빈 상태) watch-outline 아이콘 + "시계 추가하기" 버튼
- **시계 추가**: Header → 브랜드 선택(horizontal ScrollView, chip) → 모델 선택(리스트, checkmark) → 구매 금액(선택) → 구매 날짜(선택) → 메모(선택) → 등록 버튼
- **컬렉션 상세**: Header → 시계 이미지(200x200) → 브랜드/모델/레퍼런스 → 가격 비교 섹션(구매가/현재가/손익) → ReturnChart → 구매 정보 → 삭제 버튼(빨간 테두리)

### 기술적 특징
- **fetchMyCollection**:
  - collections LEFT JOIN watches (id, brand, model, reference_number, image_url)
  - Promise.all로 각 시계의 최신 watch_prices 조회 (price, change_percent)
  - 수익률 계산: (currentPrice - purchasePrice) / purchasePrice * 100
- **addToCollection**:
  - UNIQUE 제약 위반 체크: error.code === '23505' → "이미 컬렉션에 추가된 시계입니다"
  - 성공 시 fetchMyCollection() 호출하여 리스트 새로고침
- **getStats**:
  - totalWatches: collections.length
  - totalPurchaseValue, totalCurrentValue: NULL 아닌 항목만 합산
  - totalReturn: totalCurrentValue - totalPurchaseValue
  - totalReturnRate: (totalReturn / totalPurchaseValue) * 100
- **브랜드/모델 동적 로드**:
  - loadBrands: watches 테이블 DISTINCT brand
  - loadWatches: selectedBrand로 필터링한 watches
- **NULL 안전 처리**:
  - purchasePrice, currentPrice 모두 NULL 가능
  - returnRate, returnAmount 계산 시 NULL 체크 필수
  - "시세 정보 없음" 안내 표시

### 컴포넌트 패턴
- **CollectionCard**: PriceCard 패턴 재사용 (flexDirection: 'row', 이미지 52x52, gap: SPACING.md)
- **SummaryCard**: 4개 통계 행 + 구분선(borderTopWidth: 1)
- **ReturnChart**: 가로 바 차트, clampedRate = Math.min(absRate, 100), green/red 조건부 색상
- **ScrollView + map**: FlatList 사용 안 함, contentContainerStyle에 flexGrow: 1 사용 안 함

### 메모
- collections 테이블 UNIQUE(user_id, watch_id) 제약 존재 → 같은 시계 중복 추가 방지
- Expo Router file-based routing → app/collection/ 폴더 자동 라우팅 (별도 _layout 설정 불필요)
- MY 페이지에서 로그인 체크 → 비로그인 시 Alert(로그인 필요) 표시
- 구매가 입력 시 숫자 포맷팅: parseInt().toLocaleString()
- 삭제 버튼: borderWidth: 1, borderColor: COLORS.red, destructive 스타일

---

## 2026-02-22 — SESSION 7: 인증 시스템 구현

### 완료
- [x] useAuthStore 확장 (store/useAuthStore.ts — session, isLoading, initialize, login, register, logout)
- [x] 로그인 화면 (app/auth/login.tsx — 이메일/비밀번호, eye toggle, 카카오 버튼 UI)
- [x] 회원가입 화면 (app/auth/register.tsx — 유효성 검증, 에러 메시지)
- [x] MY 페이지 로그인 연동 (app/(tabs)/mypage.tsx — 조건부 렌더링, 로그아웃 Alert)
- [x] 라우트 가드 적용 (trade/create, community/write — 진입 시 체크)
- [x] FAB 로그인 체크 (trade.tsx, community.tsx — FAB 터치 시 체크)
- [x] 즉시매입 로그인 체크 (BuybackSheet.tsx — 제출 시 체크)
- [x] 앱 초기화 (app/_layout.tsx — useEffect에서 initialize 호출)
- [x] 라우트 추가 (app/_layout.tsx — auth/login, auth/register)
- [x] TypeScript 컴파일 검증 통과

### 생성된 파일 (2개)
- `app/auth/login.tsx` — 로그인 화면 (~280줄)
- `app/auth/register.tsx` — 회원가입 화면 (~180줄)

### 수정된 파일 (8개)
- `store/useAuthStore.ts` — 19줄 → 135줄 (session, isLoading, Supabase Auth 연동)
- `app/(tabs)/mypage.tsx` — 로그인 상태 조건부 렌더링, 로그아웃 동작
- `app/_layout.tsx` — auth 라우트 2개 추가, initialize() 호출
- `app/trade/create.tsx` — useEffect에서 로그인 체크, 미로그인 시 Alert + 뒤로가기
- `app/community/write.tsx` — useEffect에서 로그인 체크
- `app/(tabs)/trade.tsx` — FAB onPress에 로그인 체크 로직 추가
- `app/(tabs)/community.tsx` — FAB onPress에 로그인 체크 로직 추가
- `components/buyback/BuybackSheet.tsx` — handleNext()에서 로그인 체크

### UI 구조
- **로그인 화면**: 로고(watch-outline 48px) → WATCHOUT 타이틀 → 이메일/비밀번호 입력 → 로그인 버튼 → 회원가입 링크 → 구분선 → 카카오 버튼(#FEE500)
- **회원가입 화면**: Header(뒤로가기) → 이메일/비밀번호/비밀번호 확인/닉네임 입력 → 에러 박스(빨간 배경) → 가입 버튼
- **MY 페이지**: 로그인 시 닉네임+레벨 표시, 비로그인 시 "손님 Lv.0" + 화살표 (터치 시 로그인 화면)
- **라우트 가드**: Alert 2버튼 (취소, 로그인), 로그인 선택 시 /auth/login 이동

### 기술적 특징
- **Supabase Auth 연동**: supabase.auth.signUp(), signInWithPassword(), signOut(), getSession()
- **세션 복원**: initialize()에서 getSession() → public.users 테이블에서 프로필 조회
- **onAuthStateChange**: 세션 변경 시 자동으로 user/isLoggedIn 업데이트
- **유효성 검증**:
  - 이메일: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` 정규식
  - 비밀번호: 8자 이상, 비밀번호 확인 일치
  - 닉네임: 2자 이상, 20자 이하
- **에러 핸들링**: try-catch, 사용자 친화적 에러 메시지 변환
- **라우트 가드 패턴**: `useAuthStore.getState().isLoggedIn` 체크 → Alert(2버튼)

### 메모
- 카카오 로그인은 UI만 구현 (Alert "준비 중")
- 비밀번호 재설정 미구현 → SESSION 8에서 진행
- 프로필 편집 미구현 → SESSION 8에서 진행
- Supabase 마이그레이션 SQL 아직 미실행 → 테스트 시 필요
- 이메일 인증: 개발 중에는 Supabase 대시보드에서 비활성화 가능

---

## 2026-02-22 — SESSION 6: 커뮤니티 게시판 + MY 페이지

### 완료
- [x] useCommunityStore 생성 (store/useCommunityStore.ts — 카테고리 필터 + 검색 + 공지 핀 정렬)
- [x] 카테고리 색상 유틸리티 (lib/utils.ts — getCategoryColor, getCategoryTextColor)
- [x] CommunityPostCard 컴포넌트 (components/community/CommunityPostCard.tsx)
- [x] 커뮤니티 리스트 화면 (app/community/index.tsx — 탭+검색+게시글 리스트+FAB)
- [x] 게시글 상세 화면 (app/community/[id].tsx — 제목+본문+좋아요+댓글 입력창)
- [x] 글쓰기 화면 (app/community/write.tsx — 카테고리 선택+제목+본문+이미지 슬롯)
- [x] MY 페이지 구현 (app/(tabs)/mypage.tsx — 프로필+컬렉션 배너+활동/설정 메뉴)
- [x] 홈 화면 네비게이션 연결 (app/(tabs)/index.tsx — 빠른 메뉴+최신글 카드 터치)
- [x] app/_layout.tsx에 community/index, community/[id], community/write 라우트 추가
- [x] TypeScript 컴파일 검증 통과

### 생성된 파일 (6개)
- `store/useCommunityStore.ts` — 커뮤니티 Zustand 스토어 (필터 + 정렬)
- `lib/utils.ts` — 카테고리 색상 유틸리티 (공통 함수)
- `components/community/CommunityPostCard.tsx` — 게시글 카드 컴포넌트
- `app/community/index.tsx` — 커뮤니티 리스트 화면
- `app/community/[id].tsx` — 게시글 상세 화면
- `app/community/write.tsx` — 글쓰기 화면

### 수정된 파일 (3개)
- `app/(tabs)/mypage.tsx` — 빈 화면 → 프로필 + 컬렉션 배너 + 메뉴 리스트 (~230줄)
- `app/(tabs)/index.tsx` — 커뮤니티 네비게이션 연결 (Alert → router.push)
- `app/_layout.tsx` — community 라우트 3개 추가

### UI 구조
- **커뮤니티 리스트**: Header → 카테고리 탭(전체/자유/질문/후기/정보) → 게시글 수 → ScrollView 게시글 리스트 → FAB
- **게시글 상세**: Header → 카테고리 배지 → 제목 → 작성자 정보(아바타+닉네임+Lv+시간) → 본문 → 좋아요 버튼 → 댓글 섹션 → 하단 댓글 입력창
- **글쓰기**: Header(등록 버튼) → 카테고리 4개 토글 → 제목 입력 → 본문 입력(2000자) → 이미지 슬롯 3개 → 하단 등록 버튼
- **MY 페이지**: Header → 프로필 카드(아바타+손님 Lv.0) → 컬렉션 배너(#FFF4E6) → 활동 메뉴(내 매물/매입 내역/메시지함/관심 매물/내 글) → 설정 메뉴(알림/언어/앱 정보/로그아웃)

### 기술적 특징
- **카테고리 필터링 + 공지 핀**: useCommunityStore의 getFilteredPosts()에서 처리
  - 카테고리 선택 시 해당 카테고리 + 공지(pinned: true) 포함
  - 정렬: 공지 항상 맨 위, 나머지는 최신순(id 역순)
- **카테고리 색상 유틸**: index.tsx에서 lib/utils.ts로 이동하여 재사용
  - 질문(파랑), 후기(초록), 정보(주황), 공지(빨강), 기본(회색)
- **더미 프로필**: MY 페이지는 로그인 기능 없이 "손님 Lv.0" 고정 표시
- **네비게이션 연결**: 홈 화면의 빠른 메뉴 "자유게시판", 최신글 카드, "더보기" 모두 /community 연결

### 메모
- 댓글 기능은 UI만 구현 (입력창 표시, 전송 시 Alert)
- 이미지 첨부는 placeholder만 (터치 시 Alert)
- 좋아요/등록은 Alert → 다음 업데이트에서 Supabase 연동 예정
- ScrollView 패턴 일관성: SESSION 5에서 검증된 패턴 재사용

---

## 2026-02-22 — SESSION 5: 시계거래 마켓플레이스 + 레이아웃 최적화

### 완료
- [x] MockTradeItem/MockAccessoryItem 타입 확장 (description, method, authorLevel 등 optional 필드)
- [x] Mock 데이터 확장 (시계 3→7개, 용품 4→7개, 기존 항목에 description/method 추가)
- [x] useTradeStore 생성 (store/useTradeStore.ts — 필터 + 폼 상태)
- [x] TradeCard 컴포넌트 (components/trade/TradeCard.tsx — 2컬럼용 시계 카드)
- [x] AccessoryCard 컴포넌트 (components/trade/AccessoryCard.tsx — 2컬럼용 용품 카드)
- [x] 시계거래 리스트 화면 (app/(tabs)/trade.tsx — 탭+검색+필터+2컬럼 그리드+FAB)
- [x] 매물 상세 화면 (app/trade/[id].tsx — 이미지 갤러리+판매자+가격+정보 그리드+하단 CTA)
- [x] 매물 등록 화면 (app/trade/create.tsx — 시계/용품별 폼+브랜드 그리드+구성품+사진+등록)
- [x] app/_layout.tsx에 trade/[id], trade/create 라우트 추가
- [x] 매물 등록 "기타" 브랜드 선택 시 직접 입력 TextInput 추가
- [x] 시세/시계거래 화면 간격 최적화 (ScrollView marginBottom 12px, countRow paddingTop 제거)
- [x] **FlatList → ScrollView 전환** (price.tsx, trade.tsx) — flex: 1 레이아웃 문제 근본 해결
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
- `app/(tabs)/trade.tsx` — 빈 화면 → 완전한 마켓플레이스 리스트 → FlatList → ScrollView 전환
- `app/(tabs)/price.tsx` — FlatList → ScrollView 전환 (간격 최적화)
- `app/trade/create.tsx` — "기타" 브랜드 직접 입력 기능 추가
- `app/_layout.tsx` — trade/[id], trade/create Stack.Screen 추가

### UI 구조
- **시계거래 리스트**: Header → 시계/용품 탭 → ScrollView(검색바 → 브랜드/카테고리 필터 → 매물 수 → 2컬럼 그리드) → FAB
- **매물 상세**: Header(뒤로가기) → 이미지 갤러리(280px) → 판매자 정보 → 가격+시세배지 → 정보 그리드(2열×3행) → 설명 → 하단 CTA(찜+메시지)
- **매물 등록**: Header(뒤로가기) → 시계/용품 탭 → 시계폼(거래유형+브랜드(기타 직접입력 가능)+모델+레퍼런스+연식/컨디션+구성품+가격+거래방법/지역+사진+설명) / 용품폼(카테고리+제목+가격/컨디션+사진+설명) → 등록 버튼

### 기술적 개선 (중요!)
- **FlatList → ScrollView 전환**: price.tsx와 trade.tsx 모두 ScrollView로 변경
  - **문제**: FlatList `flex: 1`이 남은 공간을 모두 차지 → 필터칩과 리스트 사이에 거대한 빈 공간 발생
  - **해결**: ScrollView + map()으로 전환, 데이터 6-7개뿐이라 성능 문제 없음
  - **결과**: 모든 요소가 위에서 아래로 자연스럽게 배치, flex 관련 문제 완전히 우회
- **2컬럼 그리드**: flexWrap: 'wrap' + gridItem width: '48%'로 구현 (trade.tsx)
- **간격 최적화**: ScrollView marginBottom 12px, countRow paddingTop 제거, 모든 섹션 8px 통일

### 메모
- TradeCard와 AccessoryCard는 메타데이터 구조가 달라 별도 컴포넌트로 분리
- 시계 카드에 판매/구매 배지(파랑/주황) + 시세 배지(green/yellow/red) 표시
- 찜/메시지 기능은 Alert("준비 중")으로 처리
- 사진 첨부는 UI placeholder만 (expo-image-picker 연동 추후)
- 매물 등록 폼의 formData는 useTradeStore에 서브객체로 포함
- "기타" 브랜드 선택 시 조건부 TextInput 표시 (formData.brand === '기타')

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
