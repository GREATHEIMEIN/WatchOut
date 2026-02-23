// 채팅 상태 관리 — Supabase Realtime 기반 1:1 채팅

import { create } from 'zustand';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from './useAuthStore';

export interface ChatRoom {
  id: number;
  tradePostId: number;
  tradeBrand: string;
  tradeModel: string;
  buyerId: string;
  sellerId: string;
  counterpartNickname: string;
  counterpartAvatar: string | null;
  lastMessage: string | null;
  lastMessageAt: string;
  buyerUnread: number;
  sellerUnread: number;
  createdAt: string;
}

export interface ChatMessage {
  id: number;
  roomId: number;
  senderId: string;
  message: string;
  messageType: 'text' | 'image' | 'system';
  isRead: boolean;
  createdAt: string;
}

interface ChatStore {
  chatRooms: ChatRoom[];
  currentMessages: ChatMessage[];
  totalUnread: number;
  isLoading: boolean;
  fetchChatRooms: () => Promise<void>;
  fetchMessages: (roomId: number) => Promise<void>;
  sendMessage: (roomId: number, message: string) => Promise<void>;
  sendImageMessage: (roomId: number, imageUri: string) => Promise<void>;
  createOrGetRoom: (tradePostId: number, sellerId: string) => Promise<number | null>;
  markRoomAsRead: (roomId: number) => Promise<void>;
  subscribeToRoom: (roomId: number, onNewMessage: (msg: ChatMessage) => void) => void;
  unsubscribeFromRoom: () => void;
}

// Realtime 채널은 Zustand 외부에 보관 (직렬화 불가 객체)
let _channel: RealtimeChannel | null = null;

// Mock 판매자 ID 상수
const MOCK_SELLER_001 = 'mock-seller-001';
const MOCK_SELLER_002 = 'mock-seller-002';

// Mock 채팅방 데이터 — Supabase 미연결 시 fallback
const createMockRooms = (userId: string): ChatRoom[] => {
  const now = Date.now();
  return [
    {
      id: 1,
      tradePostId: 1,
      tradeBrand: 'Rolex',
      tradeModel: '서브마리너 데이트',
      buyerId: userId,
      sellerId: MOCK_SELLER_001,
      counterpartNickname: 'watchman',
      counterpartAvatar: null,
      lastMessage: '토요일 오후 2시 괜찮습니다!',
      lastMessageAt: new Date(now - 30 * 60 * 1000).toISOString(),
      buyerUnread: 0,
      sellerUnread: 1,
      createdAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      tradePostId: 2,
      tradeBrand: 'Omega',
      tradeModel: '스피드마스터',
      buyerId: userId,
      sellerId: MOCK_SELLER_002,
      counterpartNickname: 'omega_fan',
      counterpartAvatar: null,
      lastMessage: '감사합니다. 보증서 유효기간 확인 부탁드릴게요',
      lastMessageAt: new Date(now - 3 * 60 * 60 * 1000).toISOString(),
      buyerUnread: 1,
      sellerUnread: 0,
      createdAt: new Date(now - 5 * 60 * 60 * 1000).toISOString(),
    },
  ];
};

// Mock 메시지 데이터 — roomId 1, 2에 대해 자연스러운 매물 문의 대화
const createMockMessages = (roomId: number, userId: string): ChatMessage[] => {
  const now = Date.now();
  const sellerId = roomId === 1 ? MOCK_SELLER_001 : MOCK_SELLER_002;

  if (roomId === 1) {
    return [
      { id: 101, roomId: 1, senderId: userId,   message: '서브마리너 아직 판매 중인가요?', messageType: 'text', isRead: true, createdAt: new Date(now - 2 * 60 * 60 * 1000).toISOString() },
      { id: 102, roomId: 1, senderId: sellerId, message: '네, 판매 중입니다! 언제든지 연락 주세요.', messageType: 'text', isRead: true, createdAt: new Date(now - 110 * 60 * 1000).toISOString() },
      { id: 103, roomId: 1, senderId: userId,   message: '직거래 가능할까요? 강남역 쪽 괜찮으신지요', messageType: 'text', isRead: true, createdAt: new Date(now - 90 * 60 * 1000).toISOString() },
      { id: 104, roomId: 1, senderId: sellerId, message: '강남역 가능합니다. 주말 오후 시간 어떠세요?', messageType: 'text', isRead: true, createdAt: new Date(now - 60 * 60 * 1000).toISOString() },
      { id: 105, roomId: 1, senderId: userId,   message: '토요일 오후 2시 괜찮습니다!', messageType: 'text', isRead: true, createdAt: new Date(now - 30 * 60 * 1000).toISOString() },
    ];
  }

  if (roomId === 2) {
    return [
      { id: 201, roomId: 2, senderId: userId,   message: '스피드마스터 가격 조금 조정 가능할까요?', messageType: 'text', isRead: true, createdAt: new Date(now - 5 * 60 * 60 * 1000).toISOString() },
      { id: 202, roomId: 2, senderId: sellerId, message: '5,800,000원까지는 가능합니다 :)', messageType: 'text', isRead: true, createdAt: new Date(now - 4.5 * 60 * 60 * 1000).toISOString() },
      { id: 203, roomId: 2, senderId: userId,   message: '감사합니다. 보증서 유효기간 확인 부탁드릴게요', messageType: 'text', isRead: false, createdAt: new Date(now - 3 * 60 * 60 * 1000).toISOString() },
    ];
  }

  return [];
};

const mapToMessage = (row: Record<string, unknown>): ChatMessage => ({
  id: row.id as number,
  roomId: row.room_id as number,
  senderId: row.sender_id as string,
  message: row.message as string,
  messageType: row.message_type as ChatMessage['messageType'],
  isRead: row.is_read as boolean,
  createdAt: row.created_at as string,
});

// 로컬 ID 카운터 (mock 신규 메시지용)
let _localMsgId = 9000;

export const useChatStore = create<ChatStore>((set, get) => ({
  chatRooms: [],
  currentMessages: [],
  totalUnread: 0,
  isLoading: false,

  /**
   * 내 채팅방 목록 조회 (최신 메시지순) — 실패 시 mock fallback
   */
  fetchChatRooms: async () => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    set({ isLoading: true });

    try {
      const { data, error } = await supabase
        .from('chat_rooms')
        .select(
          `*, trade_post:trade_post_id(id, brand, model), buyer:buyer_id(id, nickname, avatar_url), seller:seller_id(id, nickname, avatar_url)`,
        )
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      const rooms: ChatRoom[] = (data || []).map((r: Record<string, unknown>) => {
        const isBuyer = r.buyer_id === user.id;
        const counterpart = (isBuyer ? r.seller : r.buyer) as Record<string, unknown> | null;
        return {
          id: r.id as number,
          tradePostId: r.trade_post_id as number,
          tradeBrand: (r.trade_post as Record<string, unknown> | null)?.brand as string ?? '',
          tradeModel: (r.trade_post as Record<string, unknown> | null)?.model as string ?? '',
          buyerId: r.buyer_id as string,
          sellerId: r.seller_id as string,
          counterpartNickname: counterpart?.nickname as string ?? '알 수 없음',
          counterpartAvatar: counterpart?.avatar_url as string | null ?? null,
          lastMessage: r.last_message as string | null,
          lastMessageAt: r.last_message_at as string,
          buyerUnread: r.buyer_unread as number,
          sellerUnread: r.seller_unread as number,
          createdAt: r.created_at as string,
        };
      });

      const totalUnread = rooms.reduce((sum, r) => {
        const myUnread = r.buyerId === user.id ? r.buyerUnread : r.sellerUnread;
        return sum + myUnread;
      }, 0);

      set({ chatRooms: rooms, totalUnread, isLoading: false });
    } catch {
      // Supabase 미연결 또는 테이블 미생성 시 mock 데이터 사용
      console.warn('fetchChatRooms: Supabase 미연결, mock 데이터 로드');
      const { user: currentUser } = useAuthStore.getState();
      if (currentUser) {
        const mockRooms = createMockRooms(currentUser.id);
        const totalUnread = mockRooms.reduce((sum, r) => sum + r.buyerUnread, 0);
        set({ chatRooms: mockRooms, totalUnread, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    }
  },

  /**
   * 특정 방 메시지 로드 — 실패 시 mock fallback
   */
  fetchMessages: async (roomId: number) => {
    set({ isLoading: true, currentMessages: [] });

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const messages = (data || []).map((row: Record<string, unknown>) => mapToMessage(row));
      set({ currentMessages: messages, isLoading: false });
    } catch {
      // Supabase 미연결 시 mock 메시지 fallback
      console.warn('fetchMessages: Supabase 미연결, mock 메시지 로드');
      const { user } = useAuthStore.getState();
      if (user) {
        const mockMsgs = createMockMessages(roomId, user.id);
        set({ currentMessages: mockMsgs, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    }
  },

  /**
   * 메시지 전송 + chat_rooms 업데이트
   * Supabase 실패 시 로컬 상태에 직접 추가 (mock 모드)
   */
  sendMessage: async (roomId: number, message: string) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    try {
      // 1. 메시지 INSERT (Realtime이 currentMessages에 자동 추가)
      const { error: msgError } = await supabase.from('chat_messages').insert({
        room_id: roomId,
        sender_id: user.id,
        message,
        message_type: 'text',
      });
      if (msgError) throw msgError;

      // 2. chat_rooms last_message + 상대방 unread++ 업데이트
      const room = get().chatRooms.find((r) => r.id === roomId);
      if (room) {
        const isBuyer = room.buyerId === user.id;
        const updateField = isBuyer
          ? { seller_unread: room.sellerUnread + 1 }
          : { buyer_unread: room.buyerUnread + 1 };
        await supabase
          .from('chat_rooms')
          .update({
            last_message: message,
            last_message_at: new Date().toISOString(),
            ...updateField,
          })
          .eq('id', roomId);

        // 로컬 상태 업데이트
        set((state) => ({
          chatRooms: state.chatRooms.map((r) =>
            r.id === roomId
              ? {
                  ...r,
                  lastMessage: message,
                  lastMessageAt: new Date().toISOString(),
                  sellerUnread: isBuyer ? r.sellerUnread + 1 : r.sellerUnread,
                  buyerUnread: !isBuyer ? r.buyerUnread + 1 : r.buyerUnread,
                }
              : r,
          ),
        }));
      }
    } catch {
      // Supabase 미연결 시 로컬 상태에 직접 추가 (mock 모드)
      console.warn('sendMessage: Supabase 미연결, 로컬 상태에 메시지 추가');
      const newMsg: ChatMessage = {
        id: ++_localMsgId,
        roomId,
        senderId: user.id,
        message,
        messageType: 'text',
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      set((state) => ({
        currentMessages: [...state.currentMessages, newMsg],
        chatRooms: state.chatRooms.map((r) =>
          r.id === roomId
            ? { ...r, lastMessage: message, lastMessageAt: new Date().toISOString() }
            : r,
        ),
      }));
    }
  },

  /**
   * 이미지 메시지 전송
   * 1) 리사이즈 (max 1024px, quality 0.7) — expo-image-manipulator
   * 2) Supabase Storage chat-images 버킷 업로드
   * 3) chat_messages INSERT (message_type: 'image', message: 이미지 URL)
   * 실패 시 로컬 상태에 직접 추가 (mock 모드)
   */
  sendImageMessage: async (roomId: number, imageUri: string) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    // 동적 import — 번들에 항상 포함되지만 런타임 호출 시 로드
    const ImageManipulator = await import('expo-image-manipulator');
    const manipulate = ImageManipulator.manipulateAsync ?? ImageManipulator.default?.manipulateAsync;
    const SaveFormat = ImageManipulator.SaveFormat ?? ImageManipulator.default?.SaveFormat;

    // 리사이즈: 긴 변 최대 1024px, JPEG quality 0.7
    const resized = await manipulate(imageUri, [{ resize: { width: 1024 } }], {
      compress: 0.7,
      format: SaveFormat.JPEG,
      base64: false,
    });

    const ext = 'jpg';
    const fileName = `chat/${roomId}/${user.id}_${Date.now()}.${ext}`;

    try {
      // 파일 읽기 → Blob 생성
      const response = await fetch(resized.uri);
      const blob = await response.blob();

      const { error: uploadError } = await supabase.storage
        .from('chat-images')
        .upload(fileName, blob, { contentType: 'image/jpeg', upsert: false });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('chat-images').getPublicUrl(fileName);
      const imageUrl = urlData.publicUrl;

      // chat_messages INSERT
      const { error: msgError } = await supabase.from('chat_messages').insert({
        room_id: roomId,
        sender_id: user.id,
        message: imageUrl,
        message_type: 'image',
      });
      if (msgError) throw msgError;

      // chat_rooms 업데이트
      const room = get().chatRooms.find((r) => r.id === roomId);
      if (room) {
        const isBuyer = room.buyerId === user.id;
        const updateField = isBuyer
          ? { seller_unread: room.sellerUnread + 1 }
          : { buyer_unread: room.buyerUnread + 1 };
        await supabase
          .from('chat_rooms')
          .update({
            last_message: '사진',
            last_message_at: new Date().toISOString(),
            ...updateField,
          })
          .eq('id', roomId);

        set((state) => ({
          chatRooms: state.chatRooms.map((r) =>
            r.id === roomId
              ? {
                  ...r,
                  lastMessage: '사진',
                  lastMessageAt: new Date().toISOString(),
                  sellerUnread: isBuyer ? r.sellerUnread + 1 : r.sellerUnread,
                  buyerUnread: !isBuyer ? r.buyerUnread + 1 : r.buyerUnread,
                }
              : r,
          ),
        }));
      }
    } catch {
      // Supabase 미연결 시 로컬 상태에 직접 추가 (리사이즈된 로컬 URI 사용)
      console.warn('sendImageMessage: Supabase 미연결, 로컬 상태에 이미지 메시지 추가');
      const newMsg: ChatMessage = {
        id: ++_localMsgId,
        roomId,
        senderId: user.id,
        message: resized.uri,
        messageType: 'image',
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      set((state) => ({
        currentMessages: [...state.currentMessages, newMsg],
        chatRooms: state.chatRooms.map((r) =>
          r.id === roomId
            ? { ...r, lastMessage: '사진', lastMessageAt: new Date().toISOString() }
            : r,
        ),
      }));
    }
  },

  /**
   * 채팅방 생성 또는 기존 방 ID 반환
   * 1) 현재 state에서 먼저 확인 (mock 방 포함)
   * 2) Supabase 조회/생성
   * 3) 실패 시 로컬 mock 방 생성
   */
  createOrGetRoom: async (tradePostId: number, sellerId: string) => {
    const { user } = useAuthStore.getState();
    if (!user) return null;

    // 1. 현재 state에서 먼저 확인 (mock 방 포함)
    const existingInState = get().chatRooms.find(
      (r) => r.tradePostId === tradePostId && r.buyerId === user.id,
    );
    if (existingInState) return existingInState.id;

    try {
      // 2. Supabase에서 기존 방 조회
      const { data: existing } = await supabase
        .from('chat_rooms')
        .select('id')
        .eq('trade_post_id', tradePostId)
        .eq('buyer_id', user.id)
        .maybeSingle();

      if (existing) return existing.id as number;

      // 3. 신규 방 생성
      const { data: newRoom, error } = await supabase
        .from('chat_rooms')
        .insert({ trade_post_id: tradePostId, buyer_id: user.id, seller_id: sellerId })
        .select('id')
        .single();

      if (error) throw error;

      // 4. 시스템 메시지 자동 추가
      if (newRoom) {
        await supabase.from('chat_messages').insert({
          room_id: newRoom.id,
          sender_id: user.id,
          message: '채팅이 시작되었습니다.',
          message_type: 'system',
        });
      }

      return newRoom?.id as number ?? null;
    } catch {
      // Supabase 미연결 시 로컬 mock 방 생성
      console.warn('createOrGetRoom: Supabase 미연결, 로컬 채팅방 생성');
      const newId = Date.now() % 100000; // 임시 ID
      const newRoom: ChatRoom = {
        id: newId,
        tradePostId,
        tradeBrand: '',
        tradeModel: '',
        buyerId: user.id,
        sellerId,
        counterpartNickname: '판매자',
        counterpartAvatar: null,
        lastMessage: null,
        lastMessageAt: new Date().toISOString(),
        buyerUnread: 0,
        sellerUnread: 0,
        createdAt: new Date().toISOString(),
      };
      const systemMsg: ChatMessage = {
        id: ++_localMsgId,
        roomId: newId,
        senderId: user.id,
        message: '채팅이 시작되었습니다.',
        messageType: 'system',
        isRead: true,
        createdAt: new Date().toISOString(),
      };
      set((state) => ({
        chatRooms: [newRoom, ...state.chatRooms],
        currentMessages: [systemMsg],
      }));
      return newId;
    }
  },

  /**
   * 읽음 처리 (내 unread → 0)
   */
  markRoomAsRead: async (roomId: number) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    const room = get().chatRooms.find((r) => r.id === roomId);
    if (!room) return;

    const isBuyer = room.buyerId === user.id;
    const field = isBuyer ? 'buyer_unread' : 'seller_unread';

    // 로컬 상태 즉시 업데이트
    set((state) => {
      const chatRooms = state.chatRooms.map((r) =>
        r.id === roomId
          ? { ...r, buyerUnread: isBuyer ? 0 : r.buyerUnread, sellerUnread: !isBuyer ? 0 : r.sellerUnread }
          : r,
      );
      const totalUnread = chatRooms.reduce((sum, r) => {
        const myUnread = r.buyerId === user.id ? r.buyerUnread : r.sellerUnread;
        return sum + myUnread;
      }, 0);
      return { chatRooms, totalUnread };
    });

    try {
      await supabase.from('chat_rooms').update({ [field]: 0 }).eq('id', roomId);
    } catch {
      // 로컬만 업데이트된 상태 유지
    }
  },

  /**
   * Supabase Realtime 구독 — 새 메시지 실시간 수신
   */
  subscribeToRoom: (roomId: number, onNewMessage: (msg: ChatMessage) => void) => {
    if (_channel) supabase.removeChannel(_channel);

    _channel = supabase
      .channel(`room-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const msg = mapToMessage(payload.new as Record<string, unknown>);
          set((state) => ({ currentMessages: [...state.currentMessages, msg] }));
          onNewMessage(msg);
        },
      )
      .subscribe();
  },

  /**
   * Realtime 구독 해제
   */
  unsubscribeFromRoom: () => {
    if (_channel) {
      supabase.removeChannel(_channel);
      _channel = null;
    }
  },
}));
