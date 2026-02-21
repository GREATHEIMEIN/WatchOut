// 가격·퍼센트 포맷 유틸리티

/**
 * 가격을 "13,200,000원" 형태로 포맷
 */
export const formatPrice = (n: number): string => {
  return n.toLocaleString('ko-KR') + '원';
};

/**
 * 가격을 짧은 형태로 포맷
 * 10,000,000 이상 → "1,000만"
 * 100,000,000 이상 → "1.0억"
 */
export const formatPriceShort = (n: number): string => {
  if (n >= 100_000_000) {
    return (n / 100_000_000).toFixed(1) + '억';
  }
  if (n >= 10_000) {
    return Math.round(n / 10_000).toLocaleString('ko-KR') + '만';
  }
  return n.toLocaleString('ko-KR');
};

/**
 * 변동률을 "+2.3%" 또는 "-1.1%" 형태로 포맷
 */
export const formatPercent = (v: number): string => {
  return v > 0 ? `+${v}%` : `${v}%`;
};
