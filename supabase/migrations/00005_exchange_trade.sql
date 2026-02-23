-- ============================================
-- 교환거래 기능 추가 마이그레이션
-- buyback_requests 테이블에 교환거래 컬럼 추가
-- ============================================

-- type 컬럼 추가 (buyback 기본값)
ALTER TABLE buyback_requests
  ADD COLUMN IF NOT EXISTS type text NOT NULL DEFAULT 'buyback';

-- type 체크 제약
ALTER TABLE buyback_requests
  DROP CONSTRAINT IF EXISTS buyback_requests_type_check;
ALTER TABLE buyback_requests
  ADD CONSTRAINT buyback_requests_type_check
  CHECK (type IN ('buyback', 'exchange'));

-- 교환 원하는 시계 정보
ALTER TABLE buyback_requests
  ADD COLUMN IF NOT EXISTS wanted_brand     text,
  ADD COLUMN IF NOT EXISTS wanted_model     text,
  ADD COLUMN IF NOT EXISTS wanted_condition text,
  ADD COLUMN IF NOT EXISTS wanted_note      text;

-- condition 체크 제약 업데이트 (C급 추가)
ALTER TABLE buyback_requests
  DROP CONSTRAINT IF EXISTS buyback_requests_condition_check;
ALTER TABLE buyback_requests
  ADD CONSTRAINT buyback_requests_condition_check
  CHECK (condition IN ('S', 'A', 'B', 'C'));

-- 카카오톡 연락처 필드 추가
ALTER TABLE buyback_requests
  ADD COLUMN IF NOT EXISTS kakao_id        text,
  ADD COLUMN IF NOT EXISTS contact_method  text;
