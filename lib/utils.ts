// 공통 유틸리티 함수

import { COLORS } from './constants';

/**
 * 커뮤니티 카테고리별 배경 색상 반환
 */
export const getCategoryColor = (category: string): string => {
  switch (category) {
    case '질문':
      return '#EEF4FF';
    case '후기':
      return '#E8F8EE';
    case '정보':
      return '#FFF4E6';
    case '공지':
      return '#FEF0F0';
    default:
      return COLORS.tag;
  }
};

/**
 * 커뮤니티 카테고리별 텍스트 색상 반환
 */
export const getCategoryTextColor = (category: string): string => {
  switch (category) {
    case '질문':
      return '#3B82F6';
    case '후기':
      return '#22C55E';
    case '정보':
      return COLORS.orange;
    case '공지':
      return COLORS.red;
    default:
      return COLORS.sub;
  }
};
