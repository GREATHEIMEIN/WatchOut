-- 알림 테이블
CREATE TABLE IF NOT EXISTS notifications (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type        text NOT NULL CHECK (type IN (
                'trade_interest', 'price_alert', 'comment',
                'system', 'buyback_status', 'exchange_status')),
  title       text NOT NULL,
  body        text NOT NULL,
  data        jsonb NOT NULL DEFAULT '{}',
  is_read     boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "본인 알림 조회" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "본인 알림 업데이트" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "본인 알림 삭제" ON notifications
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "시스템 알림 생성" ON notifications
  FOR INSERT WITH CHECK (true);

CREATE INDEX idx_notifications_user_unread
  ON notifications(user_id, is_read, created_at DESC);

-- 시드 데이터 3개 (user_id를 실제 UUID로 교체 후 실행)
-- INSERT INTO notifications (user_id, type, title, body, data) VALUES
--   ('00000000-0000-0000-0000-000000000000', 'system',
--     'WATCHOUT에 오신 것을 환영합니다!',
--     '럭셔리 시계 시세 조회, 즉시 매입, P2P 거래를 시작해보세요.',
--     '{}'),
--   ('00000000-0000-0000-0000-000000000000', 'price_alert',
--     'Rolex Submariner 시세 변동',
--     '최근 1주일간 3.2% 상승했습니다.',
--     '{"screen": "/price/rolex-submariner-116610ln"}'),
--   ('00000000-0000-0000-0000-000000000000', 'trade_interest',
--     '내 매물에 관심 표시',
--     '홍길동님이 "Rolex Datejust 41" 매물에 관심을 표시했습니다.',
--     '{"screen": "/trade/1"}');
