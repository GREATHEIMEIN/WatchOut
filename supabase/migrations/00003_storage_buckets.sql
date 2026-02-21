-- ============================================
-- WATCHOUT Storage 버킷 설정
-- ============================================

-- 1. trade-images — 매물 사진 (공개 읽기, 인증 유저 업로드)
INSERT INTO storage.buckets (id, name, public)
VALUES ('trade-images', 'trade-images', true);

CREATE POLICY "trade_images_select_public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'trade-images');

CREATE POLICY "trade_images_insert_auth"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'trade-images' AND auth.role() = 'authenticated');

CREATE POLICY "trade_images_delete_own"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'trade-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 2. buyback-images — 매입 사진 (본인+admin만 읽기, 인증+비인증 업로드)
INSERT INTO storage.buckets (id, name, public)
VALUES ('buyback-images', 'buyback-images', false);

CREATE POLICY "buyback_images_select_restricted"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'buyback-images'
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    )
  );

CREATE POLICY "buyback_images_insert_all"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'buyback-images');

-- 3. avatars — 프로필 사진 (공개 읽기, 본인만 업로드/삭제)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

CREATE POLICY "avatars_select_public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "avatars_insert_own"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "avatars_update_own"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "avatars_delete_own"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
