-- 채팅 테이블 (chat_rooms + chat_messages)

-- chat_rooms 테이블
CREATE TABLE IF NOT EXISTS chat_rooms (
  id              serial PRIMARY KEY,
  trade_post_id   integer NOT NULL,
  buyer_id        uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  last_message    text,
  last_message_at timestamptz NOT NULL DEFAULT now(),
  buyer_unread    integer NOT NULL DEFAULT 0,
  seller_unread   integer NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE(trade_post_id, buyer_id)  -- 같은 매물에 같은 buyer는 방 1개만
);

-- chat_messages 테이블
CREATE TABLE IF NOT EXISTS chat_messages (
  id           serial PRIMARY KEY,
  room_id      integer NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  sender_id    uuid NOT NULL REFERENCES auth.users(id),
  message      text NOT NULL,
  message_type text NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'system')),
  is_read      boolean NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- RLS 활성화
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- chat_rooms RLS 정책
CREATE POLICY "본인 채팅방 조회" ON chat_rooms
  FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "채팅방 생성" ON chat_rooms
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "채팅방 업데이트" ON chat_rooms
  FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- chat_messages RLS 정책
CREATE POLICY "채팅방 메시지 조회" ON chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chat_rooms r
      WHERE r.id = room_id
        AND (r.buyer_id = auth.uid() OR r.seller_id = auth.uid())
    )
  );

CREATE POLICY "메시지 전송" ON chat_messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- 인덱스
CREATE INDEX idx_chat_rooms_buyer   ON chat_rooms(buyer_id);
CREATE INDEX idx_chat_rooms_seller  ON chat_rooms(seller_id);
CREATE INDEX idx_chat_rooms_trade   ON chat_rooms(trade_post_id);
CREATE INDEX idx_chat_messages_room ON chat_messages(room_id, created_at);

-- Realtime 활성화 (Supabase 대시보드 > Database > Replication에서도 활성화 필요)
ALTER TABLE chat_messages REPLICA IDENTITY FULL;

-- notifications 테이블 type CHECK에 'chat' 추가
-- (00006_notifications.sql의 CHECK 제약을 확장)
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE notifications ADD CONSTRAINT notifications_type_check
  CHECK (type IN (
    'trade_interest', 'price_alert', 'comment',
    'system', 'buyback_status', 'exchange_status', 'chat'
  ));
