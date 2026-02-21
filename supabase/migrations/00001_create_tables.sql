-- ============================================
-- WATCHOUT 데이터베이스 스키마
-- 테이블 10개 + 인덱스 + 트리거
-- ============================================

-- updated_at 자동 갱신 함수
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 1. users — 회원 프로필 (auth.users 참조)
-- ============================================
CREATE TABLE users (
  id         uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      text UNIQUE NOT NULL,
  nickname   text UNIQUE NOT NULL,
  avatar_url text,
  role       text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  level      integer NOT NULL DEFAULT 1,
  bio        text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- auth.users 가입 시 public.users 자동 생성
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, nickname)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nickname', 'user_' || LEFT(NEW.id::text, 8))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- 2. watches — 시계 모델 마스터
-- ============================================
CREATE TABLE watches (
  id               serial PRIMARY KEY,
  brand            text NOT NULL,
  model            text NOT NULL,
  reference_number text NOT NULL UNIQUE,
  image_url        text,
  category         text CHECK (category IN ('dress', 'sport', 'diver', 'chrono', 'pilot', 'field', 'other')),
  case_size_mm     integer,
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_watches_brand ON watches(brand);

-- ============================================
-- 3. watch_prices — 시세 히스토리
-- ============================================
CREATE TABLE watch_prices (
  id             serial PRIMARY KEY,
  watch_id       integer NOT NULL REFERENCES watches(id) ON DELETE CASCADE,
  price          integer NOT NULL,
  change_percent numeric(5,2),
  source         text NOT NULL CHECK (source IN ('hisigan', 'chrono24', 'viver', 'manual')),
  recorded_date  date NOT NULL,
  created_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE(watch_id, source, recorded_date)
);

CREATE INDEX idx_watch_prices_watch_date ON watch_prices(watch_id, recorded_date DESC);

-- ============================================
-- 4. trade_posts — 매물 등록 (시계 + 시계용품)
-- ============================================
CREATE TABLE trade_posts (
  id               serial PRIMARY KEY,
  user_id          uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type             text NOT NULL CHECK (type IN ('sell', 'buy')),
  item_type        text NOT NULL DEFAULT 'watch' CHECK (item_type IN ('watch', 'accessory')),
  brand            text,
  model            text,
  reference_number text,
  title            text,
  price            integer NOT NULL,
  condition        text CHECK (condition IN ('S', 'A', 'B')),
  year             text,
  kit              text,
  description      text,
  images           text[],
  location         text,
  status           text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'reserved', 'sold', 'deleted')),
  views            integer NOT NULL DEFAULT 0,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_trade_posts_status ON trade_posts(status) WHERE status = 'active';
CREATE INDEX idx_trade_posts_user ON trade_posts(user_id);
CREATE INDEX idx_trade_posts_item_type ON trade_posts(item_type, created_at DESC);

CREATE TRIGGER trade_posts_updated_at
  BEFORE UPDATE ON trade_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 5. buyback_requests — 즉시매입 신청
-- ============================================
CREATE TABLE buyback_requests (
  id               serial PRIMARY KEY,
  user_id          uuid REFERENCES users(id) ON DELETE SET NULL,
  brand            text NOT NULL,
  model            text NOT NULL,
  reference_number text,
  condition        text NOT NULL CHECK (condition IN ('S', 'A', 'B')),
  year             text,
  kits             text[],
  photos           text[],
  phone            text NOT NULL,
  location         text,
  status           text NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending', 'contacted', 'visited', 'completed', 'cancelled')),
  admin_note       text,
  estimated_price  integer,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_buyback_requests_status ON buyback_requests(status);

CREATE TRIGGER buyback_requests_updated_at
  BEFORE UPDATE ON buyback_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 6. collections — 내 컬렉션
-- ============================================
CREATE TABLE collections (
  id             serial PRIMARY KEY,
  user_id        uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  watch_id       integer NOT NULL REFERENCES watches(id) ON DELETE CASCADE,
  purchase_price integer,
  purchase_date  text,
  note           text,
  created_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, watch_id)
);

CREATE INDEX idx_collections_user ON collections(user_id);

-- ============================================
-- 7. community_posts — 커뮤니티 게시글
-- ============================================
CREATE TABLE community_posts (
  id             serial PRIMARY KEY,
  user_id        uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category       text NOT NULL CHECK (category IN ('자유', '질문', '후기', '정보', '공지')),
  title          text NOT NULL,
  content        text NOT NULL,
  images         text[],
  likes_count    integer NOT NULL DEFAULT 0,
  comments_count integer NOT NULL DEFAULT 0,
  pinned         boolean NOT NULL DEFAULT false,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_community_posts_category ON community_posts(category, created_at DESC);
CREATE INDEX idx_community_posts_pinned ON community_posts(pinned) WHERE pinned = true;

CREATE TRIGGER community_posts_updated_at
  BEFORE UPDATE ON community_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 8. comments — 댓글
-- ============================================
CREATE TABLE comments (
  id         serial PRIMARY KEY,
  post_id    integer NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content    text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_comments_post ON comments(post_id, created_at);

-- 댓글 수 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE community_posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE community_posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER comments_count_trigger
  AFTER INSERT OR DELETE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_comments_count();

-- ============================================
-- 9. messages — 1:1 메시지
-- ============================================
CREATE TABLE messages (
  id            serial PRIMARY KEY,
  sender_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id   uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  trade_post_id integer REFERENCES trade_posts(id) ON DELETE SET NULL,
  content       text NOT NULL,
  is_read       boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_conversation ON messages(sender_id, receiver_id, created_at DESC);
CREATE INDEX idx_messages_receiver_unread ON messages(receiver_id, is_read) WHERE is_read = false;

-- ============================================
-- 10. reports — 신고
-- ============================================
CREATE TABLE reports (
  id          serial PRIMARY KEY,
  reporter_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_type text NOT NULL CHECK (target_type IN ('trade_post', 'community_post', 'comment', 'user', 'message')),
  target_id   text NOT NULL,
  reason      text NOT NULL,
  status      text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  admin_note  text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_reports_status ON reports(status) WHERE status = 'pending';
