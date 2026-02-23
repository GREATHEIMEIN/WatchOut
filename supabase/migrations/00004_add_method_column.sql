-- trade_posts에 method 컬럼 추가 (거래 방법)
ALTER TABLE trade_posts
ADD COLUMN method text CHECK (method IN ('직거래', '택배', '직거래/택배'));

-- 기본값 설정
UPDATE trade_posts SET method = '직거래' WHERE method IS NULL;
