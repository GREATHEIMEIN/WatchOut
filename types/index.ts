// 공통 타입 정의

export interface User {
  id: string;
  email: string;
  nickname: string;
  level: number;
  avatarUrl: string | null;
  createdAt: string;
}

export interface Watch {
  id: number;
  brand: string;
  model: string;
  ref: string;
  price: number;
  change: number;
  imageUrl: string | null;
  history: number[];
}

export interface TradePost {
  id: number;
  brand: string;
  model: string;
  ref: string;
  price: number;
  condition: string;
  year: string;
  location: string;
  kit: string;
  type: 'sell' | 'buy';
  author: string;
  time: string;
  imageUrl: string | null;
}

export interface CommunityPost {
  id: number;
  title: string;
  author: string;
  comments: number;
  likes: number;
  time: string;
  category: string;
  pinned: boolean;
}

export interface BuybackRequest {
  brand: string;
  model: string;
  ref?: string;
  condition: string;
  year?: string;
  kits: string[];
  phone: string;
  location?: string;
}
