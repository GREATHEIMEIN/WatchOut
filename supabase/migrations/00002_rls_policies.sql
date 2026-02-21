-- ============================================
-- WATCHOUT RLS (Row Level Security) 정책
-- ============================================

-- admin 체크 헬퍼 함수
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- ============================================
-- 1. users — 프로필 공개, 본인만 수정
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select_all"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "users_update_own"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================
-- 2. watches — 누구나 조회, admin만 관리
-- ============================================
ALTER TABLE watches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "watches_select_all"
  ON watches FOR SELECT
  USING (true);

CREATE POLICY "watches_insert_admin"
  ON watches FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "watches_update_admin"
  ON watches FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "watches_delete_admin"
  ON watches FOR DELETE
  USING (is_admin());

-- ============================================
-- 3. watch_prices — 누구나 조회, admin만 입력
-- ============================================
ALTER TABLE watch_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "watch_prices_select_all"
  ON watch_prices FOR SELECT
  USING (true);

CREATE POLICY "watch_prices_insert_admin"
  ON watch_prices FOR INSERT
  WITH CHECK (is_admin());

-- ============================================
-- 4. trade_posts — 누구나 조회, 인증 유저 등록, 본인만 수정/삭제
-- ============================================
ALTER TABLE trade_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "trade_posts_select_all"
  ON trade_posts FOR SELECT
  USING (true);

CREATE POLICY "trade_posts_insert_auth"
  ON trade_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "trade_posts_update_own"
  ON trade_posts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "trade_posts_delete_own"
  ON trade_posts FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 5. buyback_requests — 본인+admin 조회, 누구나 생성, admin만 수정
-- ============================================
ALTER TABLE buyback_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "buyback_requests_select_own_or_admin"
  ON buyback_requests FOR SELECT
  USING (
    auth.uid() = user_id
    OR is_admin()
    OR user_id IS NULL  -- 비회원 신청은 admin만 조회 가능하도록 별도 처리
  );

CREATE POLICY "buyback_requests_insert_all"
  ON buyback_requests FOR INSERT
  WITH CHECK (true);  -- 비회원도 신청 가능

CREATE POLICY "buyback_requests_update_admin"
  ON buyback_requests FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================
-- 6. collections — 본인만 CRUD
-- ============================================
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "collections_select_own"
  ON collections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "collections_insert_own"
  ON collections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "collections_update_own"
  ON collections FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "collections_delete_own"
  ON collections FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 7. community_posts — 누구나 조회, 인증 유저 등록, 본인만 수정/삭제
-- ============================================
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "community_posts_select_all"
  ON community_posts FOR SELECT
  USING (true);

CREATE POLICY "community_posts_insert_auth"
  ON community_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "community_posts_update_own"
  ON community_posts FOR UPDATE
  USING (auth.uid() = user_id OR is_admin())
  WITH CHECK (auth.uid() = user_id OR is_admin());

CREATE POLICY "community_posts_delete_own"
  ON community_posts FOR DELETE
  USING (auth.uid() = user_id OR is_admin());

-- ============================================
-- 8. comments — 누구나 조회, 인증 유저 등록, 본인만 수정/삭제
-- ============================================
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "comments_select_all"
  ON comments FOR SELECT
  USING (true);

CREATE POLICY "comments_insert_auth"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "comments_update_own"
  ON comments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "comments_delete_own"
  ON comments FOR DELETE
  USING (auth.uid() = user_id OR is_admin());

-- ============================================
-- 9. messages — 발신자/수신자만 조회, 인증 유저 전송
-- ============================================
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "messages_select_own"
  ON messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "messages_insert_auth"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- ============================================
-- 10. reports — 본인+admin 조회, 인증 유저 생성, admin만 수정
-- ============================================
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reports_select_own_or_admin"
  ON reports FOR SELECT
  USING (auth.uid() = reporter_id OR is_admin());

CREATE POLICY "reports_insert_auth"
  ON reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "reports_update_admin"
  ON reports FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());
