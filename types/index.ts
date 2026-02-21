// ============================================
// WATCHOUT TypeScript 타입 정의
// DB 스키마 (supabase/migrations/) 기반
// ============================================

// --- 공통 ---

export type UserRole = 'user' | 'admin';
export type TradeType = 'sell' | 'buy';
export type ItemType = 'watch' | 'accessory';
export type Condition = 'S' | 'A' | 'B';
export type TradeStatus = 'active' | 'reserved' | 'sold' | 'deleted';
export type BuybackStatus = 'pending' | 'contacted' | 'visited' | 'completed' | 'cancelled';
export type PostCategory = '자유' | '질문' | '후기' | '정보' | '공지';
export type WatchCategory = 'dress' | 'sport' | 'diver' | 'chrono' | 'pilot' | 'field' | 'other';
export type PriceSource = 'hisigan' | 'chrono24' | 'viver' | 'manual';
export type ReportTargetType = 'trade_post' | 'community_post' | 'comment' | 'user' | 'message';
export type ReportStatus = 'pending' | 'reviewed' | 'resolved';

// --- 1. users ---

export interface User {
  id: string;
  email: string;
  nickname: string;
  avatarUrl: string | null;
  role: UserRole;
  level: number;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserInsert {
  nickname: string;
  avatarUrl?: string | null;
  bio?: string | null;
}

// --- 2. watches ---

export interface Watch {
  id: number;
  brand: string;
  model: string;
  referenceNumber: string;
  imageUrl: string | null;
  category: WatchCategory | null;
  caseSizeMm: number | null;
  createdAt: string;
}

export interface WatchInsert {
  brand: string;
  model: string;
  referenceNumber: string;
  imageUrl?: string | null;
  category?: WatchCategory | null;
  caseSizeMm?: number | null;
}

// --- 3. watch_prices ---

export interface WatchPrice {
  id: number;
  watchId: number;
  price: number;
  changePercent: number | null;
  source: PriceSource;
  recordedDate: string;
  createdAt: string;
}

export interface WatchPriceInsert {
  watchId: number;
  price: number;
  changePercent?: number | null;
  source: PriceSource;
  recordedDate: string;
}

// --- 4. trade_posts ---

export interface TradePost {
  id: number;
  userId: string;
  type: TradeType;
  itemType: ItemType;
  brand: string | null;
  model: string | null;
  referenceNumber: string | null;
  title: string | null;
  price: number;
  condition: Condition | null;
  year: string | null;
  kit: string | null;
  description: string | null;
  images: string[] | null;
  location: string | null;
  status: TradeStatus;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface TradePostInsert {
  type: TradeType;
  itemType?: ItemType;
  brand?: string | null;
  model?: string | null;
  referenceNumber?: string | null;
  title?: string | null;
  price: number;
  condition?: Condition | null;
  year?: string | null;
  kit?: string | null;
  description?: string | null;
  images?: string[] | null;
  location?: string | null;
}

// --- 5. buyback_requests ---

export interface BuybackRequest {
  id: number;
  userId: string | null;
  brand: string;
  model: string;
  referenceNumber: string | null;
  condition: Condition;
  year: string | null;
  kits: string[] | null;
  photos: string[] | null;
  phone: string;
  location: string | null;
  status: BuybackStatus;
  adminNote: string | null;
  estimatedPrice: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface BuybackRequestInsert {
  brand: string;
  model: string;
  referenceNumber?: string | null;
  condition: Condition;
  year?: string | null;
  kits?: string[] | null;
  photos?: string[] | null;
  phone: string;
  location?: string | null;
}

// --- 6. collections ---

export interface Collection {
  id: number;
  userId: string;
  watchId: number;
  purchasePrice: number | null;
  purchaseDate: string | null;
  note: string | null;
  createdAt: string;
}

export interface CollectionInsert {
  watchId: number;
  purchasePrice?: number | null;
  purchaseDate?: string | null;
  note?: string | null;
}

// --- 7. community_posts ---

export interface CommunityPost {
  id: number;
  userId: string;
  category: PostCategory;
  title: string;
  content: string;
  images: string[] | null;
  likesCount: number;
  commentsCount: number;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityPostInsert {
  category: PostCategory;
  title: string;
  content: string;
  images?: string[] | null;
}

// --- 8. comments ---

export interface Comment {
  id: number;
  postId: number;
  userId: string;
  content: string;
  createdAt: string;
}

export interface CommentInsert {
  postId: number;
  content: string;
}

// --- 9. messages ---

export interface Message {
  id: number;
  senderId: string;
  receiverId: string;
  tradePostId: number | null;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface MessageInsert {
  receiverId: string;
  tradePostId?: number | null;
  content: string;
}

// --- 10. reports ---

export interface Report {
  id: number;
  reporterId: string;
  targetType: ReportTargetType;
  targetId: string;
  reason: string;
  status: ReportStatus;
  adminNote: string | null;
  createdAt: string;
}

export interface ReportInsert {
  targetType: ReportTargetType;
  targetId: string;
  reason: string;
}

// --- 조인/뷰 타입 (화면에서 사용) ---

/** 시세 화면용: Watch + 최신 가격 + 변동률 + 히스토리 */
export interface WatchWithPrice extends Watch {
  price: number;
  change: number;
  history: number[];
}

/** 매물 목록용: TradePost + 작성자 닉네임 */
export interface TradePostWithAuthor extends TradePost {
  authorNickname: string;
  authorAvatarUrl: string | null;
}

/** 커뮤니티 목록용: CommunityPost + 작성자 닉네임 */
export interface CommunityPostWithAuthor extends CommunityPost {
  authorNickname: string;
}

/** 댓글 목록용: Comment + 작성자 닉네임 */
export interface CommentWithAuthor extends Comment {
  authorNickname: string;
  authorAvatarUrl: string | null;
}

/** 컬렉션 목록용: Collection + Watch 정보 + 현재 시세 */
export interface CollectionWithWatch extends Collection {
  watch: Watch;
  currentPrice: number | null;
}
