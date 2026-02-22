// 미니 스파크라인 차트 — v5 Spark 컴포넌트 기반

import Svg, { Polyline } from 'react-native-svg';
import { COLORS } from '@/lib/constants';

interface SparkLineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
}

const SparkLine = ({ data, width = 50, height = 22, color = COLORS.green }: SparkLineProps) => {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  // 데이터 → SVG 좌표 변환 (v5 로직 동일)
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <Svg width={width} height={height}>
      <Polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default SparkLine;
