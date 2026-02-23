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

/**
 * 상대 시간 포맷 (1시간 전, 2일 전, 1주 전)
 */
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 1000 / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);

  if (diffMin < 1) return '방금 전';
  if (diffHour < 1) return `${diffMin}분 전`;
  if (diffDay < 1) return `${diffHour}시간 전`;
  if (diffWeek < 1) return `${diffDay}일 전`;
  if (diffWeek < 4) return `${diffWeek}주 전`;

  // 4주 이상은 절대 날짜
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}월 ${day}일`;
};
