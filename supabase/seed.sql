-- ============================================
-- WATCHOUT 시드 데이터
-- Supabase 실제 연동 테스트용
-- ============================================

-- 1. 테스트 유저 2명
-- 주의: 실제로는 Supabase Auth로 회원가입해야 하지만, 시드 데이터용으로 직접 생성
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token
) VALUES
(
  '00000000-0000-0000-0000-000000000000',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
  'authenticated',
  'authenticated',
  'watchlover@example.com',
  crypt('password123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"nickname": "watchlover"}'::jsonb,
  false,
  ''
),
(
  '00000000-0000-0000-0000-000000000000',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
  'authenticated',
  'authenticated',
  'rolex_daily@example.com',
  crypt('password123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"nickname": "rolex_daily"}'::jsonb,
  false,
  ''
);

-- users 테이블에 직접 INSERT (트리거 우회)
INSERT INTO users (id, email, nickname, level, bio, avatar_url) VALUES
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
  'watchlover@example.com',
  'watchlover',
  5,
  '롤렉스 덕후입니다 🕰️',
  null
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
  'rolex_daily@example.com',
  'rolex_daily',
  8,
  '시계 거래 8년차',
  null
);

-- 2. watches — 시계 모델 6개
INSERT INTO watches (brand, model, reference_number, category, case_size_mm) VALUES
('Rolex', 'Submariner', '126610LN', 'diver', 41),
('Rolex', 'Daytona', '116500LN', 'chrono', 40),
('Rolex', 'GMT-Master II', '126710BLNR', 'pilot', 40),
('Omega', 'Speedmaster', '310.30.42', 'chrono', 42),
('AP', 'Royal Oak', '15500ST', 'sport', 41),
('Rolex', 'Datejust', '126334', 'dress', 41);

-- 3. watch_prices — 각 모델별 6주치 시세
-- Rolex Submariner (id=1): 12.5M → 13.2M 상승
INSERT INTO watch_prices (watch_id, price, change_percent, source, recorded_date) VALUES
(1, 12500000, 0.0, 'hisigan', '2026-01-13'),
(1, 12800000, 2.4, 'hisigan', '2026-01-20'),
(1, 13000000, 1.6, 'hisigan', '2026-01-27'),
(1, 12900000, -0.8, 'hisigan', '2026-02-03'),
(1, 13100000, 1.6, 'hisigan', '2026-02-10'),
(1, 13200000, 0.8, 'hisigan', '2026-02-17');

-- Rolex Daytona (id=2): 33.2M → 32.5M 하락
INSERT INTO watch_prices (watch_id, price, change_percent, source, recorded_date) VALUES
(2, 33200000, 0.0, 'hisigan', '2026-01-13'),
(2, 33000000, -0.6, 'hisigan', '2026-01-20'),
(2, 32800000, -0.6, 'hisigan', '2026-01-27'),
(2, 32600000, -0.6, 'hisigan', '2026-02-03'),
(2, 32700000, 0.3, 'hisigan', '2026-02-10'),
(2, 32500000, -0.6, 'hisigan', '2026-02-17');

-- Rolex GMT-Master II (id=3): 19.2M → 19.8M 상승
INSERT INTO watch_prices (watch_id, price, change_percent, source, recorded_date) VALUES
(3, 19200000, 0.0, 'hisigan', '2026-01-13'),
(3, 19400000, 1.0, 'hisigan', '2026-01-20'),
(3, 19500000, 0.5, 'hisigan', '2026-01-27'),
(3, 19600000, 0.5, 'hisigan', '2026-02-03'),
(3, 19700000, 0.5, 'hisigan', '2026-02-10'),
(3, 19800000, 0.5, 'hisigan', '2026-02-17');

-- Omega Speedmaster (id=4): 5.9M → 5.8M 하락
INSERT INTO watch_prices (watch_id, price, change_percent, source, recorded_date) VALUES
(4, 5900000, 0.0, 'hisigan', '2026-01-13'),
(4, 5850000, -0.8, 'hisigan', '2026-01-20'),
(4, 5900000, 0.9, 'hisigan', '2026-01-27'),
(4, 5850000, -0.8, 'hisigan', '2026-02-03'),
(4, 5820000, -0.5, 'hisigan', '2026-02-10'),
(4, 5800000, -0.3, 'hisigan', '2026-02-17');

-- AP Royal Oak (id=5): 36.5M → 38.5M 상승
INSERT INTO watch_prices (watch_id, price, change_percent, source, recorded_date) VALUES
(5, 36500000, 0.0, 'hisigan', '2026-01-13'),
(5, 37000000, 1.4, 'hisigan', '2026-01-20'),
(5, 37500000, 1.4, 'hisigan', '2026-01-27'),
(5, 37800000, 0.8, 'hisigan', '2026-02-03'),
(5, 38200000, 1.1, 'hisigan', '2026-02-10'),
(5, 38500000, 0.8, 'hisigan', '2026-02-17');

-- Rolex Datejust (id=6): 11.0M → 11.5M 상승
INSERT INTO watch_prices (watch_id, price, change_percent, source, recorded_date) VALUES
(6, 11000000, 0.0, 'hisigan', '2026-01-13'),
(6, 11100000, 0.9, 'hisigan', '2026-01-20'),
(6, 11200000, 0.9, 'hisigan', '2026-01-27'),
(6, 11300000, 0.9, 'hisigan', '2026-02-03'),
(6, 11400000, 0.9, 'hisigan', '2026-02-10'),
(6, 11500000, 0.9, 'hisigan', '2026-02-17');

-- 4. trade_posts — 매물 6개 (시계 3개 + 용품 3개)
INSERT INTO trade_posts (
  user_id, type, item_type, brand, model, reference_number,
  price, condition, year, kit, description, location, status, method
) VALUES
-- 시계 3개
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
  'sell',
  'watch',
  'Rolex',
  'Submariner',
  '116610LN',
  11500000,
  'A',
  '2019',
  '풀박스',
  '개인 소장용으로 구매 후 정기적으로 서비스 받았습니다. 거의 새것 수준입니다.',
  '서울 강남',
  'active',
  '직거래'
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
  'sell',
  'watch',
  'Omega',
  'Speedmaster Professional',
  '310.30.42.50.01.001',
  5200000,
  'S',
  '2023',
  '풀세트',
  '2023년 구매 후 착용 횟수 5회 미만. 스크래치 전무.',
  '서울 송파',
  'active',
  '택배'
),
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
  'buy',
  'watch',
  'AP',
  'Royal Oak',
  '15500ST',
  null,
  null,
  null,
  null,
  '로얄오크 15500ST 구합니다. 풀박스 우대. 직거래 선호.',
  '서울 전역',
  'active',
  '직거래'
),
-- 시계용품 3개
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
  'sell',
  'accessory',
  null,
  null,
  null,
  450000,
  'A',
  null,
  null,
  'Wolf 워치와인더 1구. 거의 새것입니다.',
  '부산 해운대',
  'active',
  '직거래/택배'
),
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
  'sell',
  'accessory',
  null,
  null,
  null,
  120000,
  'S',
  null,
  null,
  '롤렉스 순정 가죽 스트랩 (미개봉)',
  '서울 강남',
  'active',
  '택배'
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
  'sell',
  'accessory',
  null,
  null,
  null,
  850000,
  'A',
  null,
  null,
  '12구 시계 보관함 (원목, 유리창)',
  '서울 마포',
  'active',
  '직거래'
);

-- trade_posts의 title 컬럼 업데이트 (용품은 title 필수)
UPDATE trade_posts SET title = 'Wolf 워치와인더 1구' WHERE id = 4;
UPDATE trade_posts SET title = '롤렉스 순정 가죽 스트랩' WHERE id = 5;
UPDATE trade_posts SET title = '12구 시계 보관함' WHERE id = 6;

-- 5. community_posts — 게시글 5개
INSERT INTO community_posts (
  user_id, category, title, content, likes_count, comments_count, pinned
) VALUES
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
  '자유',
  '데이토나 vs 스피드마스터, 어떤 게 더 나을까요?',
  '둘 다 크로노그래프인데 가격대가 너무 차이나네요. 스피마가 가성비는 좋은 것 같은데 롤렉스 브랜드 파워도 무시 못하죠. 여러분 의견 궁금합니다!',
  45,
  23,
  false
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
  '질문',
  '첫 롤렉스 추천 부탁드립니다 (예산 1500)',
  '시계 입문자인데 첫 롤렉스 구매하려고 합니다. 예산은 1500만원 정도인데 어떤 모델이 좋을까요?',
  32,
  18,
  false
),
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
  '후기',
  '로얄오크 15500ST 실착 후기',
  '드디어 꿈에 그리던 로얄오크를 손목에 찼습니다. 사진으로 보는 것과 실물은 정말 다르네요. 태피스트리 다이얼이 빛에 따라 달라 보여서 너무 아름답습니다.',
  89,
  31,
  false
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
  '정보',
  '롤렉스 AD 매장 구매 팁 공유합니다',
  'AD 매장에서 시계 구매하는 노하우를 공유합니다.

1. 매장 방문은 평일 오전이 좋습니다
2. 구매 이력이 중요합니다
3. 원하는 모델을 명확히 전달하세요
4. 인내심을 가지세요',
  110,
  42,
  false
),
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
  '공지',
  '공지: WATCHOUT 오픈 기념 이벤트 안내',
  'WATCHOUT 오픈을 기념하여 이벤트를 진행합니다!

- 기간: 2026.02.22 ~ 2026.03.22
- 혜택: 즉시매입 수수료 50% 할인
- 참여방법: 앱에서 즉시매입 신청 시 자동 적용

많은 참여 부탁드립니다!',
  67,
  5,
  true
);
