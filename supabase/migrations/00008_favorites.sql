-- 관심 매물 (찜) 테이블

CREATE TABLE IF NOT EXISTS favorites (
  id              serial PRIMARY KEY,
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  trade_post_id   integer NOT NULL REFERENCES trade_posts(id) ON DELETE CASCADE,
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, trade_post_id)  -- 동일 매물 중복 찜 방지
);

-- RLS 활성화
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- 본인 관심 목록만 조회
CREATE POLICY "본인 관심 목록 조회" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

-- 본인만 찜 추가
CREATE POLICY "관심 매물 추가" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 본인만 찜 삭제
CREATE POLICY "관심 매물 삭제" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- 인덱스
CREATE INDEX idx_favorites_user       ON favorites(user_id);
CREATE INDEX idx_favorites_trade_post ON favorites(trade_post_id);
