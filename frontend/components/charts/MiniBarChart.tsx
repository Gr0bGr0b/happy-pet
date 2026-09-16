import { useState } from 'react';
import { BarChart } from 'react-native-gifted-charts';
import { View } from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';

export interface BarPoint {
  label: string;
  value: number | null;
}

interface Props {
  data: BarPoint[];
  color: string;
  height?: number;
  width?: number;
}

/**
 * Sparkline bars: no axes or labels. Months with no data keep their slot as a faint
 * stub so the six-month span stays honest rather than silently compressing.
 * When `width` is omitted it fills the parent and measures itself via onLayout.
 */
export const MiniBarChart = ({ data, color, height = 52, width }: Props) => {
  const { palette } = useTheme();
  const [measuredWidth, setMeasuredWidth] = useState(0);

  const resolvedWidth = width ?? measuredWidth;

  const max = Math.max(...data.map((d) => d.value ?? 0), 1);
  const slot = resolvedWidth / Math.max(1, data.length);
  const barWidth = Math.max(6, Math.min(16, slot * 0.55));
  const spacing = Math.max(2, slot - barWidth);

  return (
    <View
      style={{ height, width: resolvedWidth }}
      onLayout={
        width ? undefined : (e) => setMeasuredWidth(e.nativeEvent.layout.width)
      }
    >
      {resolvedWidth > 0 ? (
        <BarChart
          data={data.map((point) => ({
            value: point.value ?? 0,
            frontColor: point.value === null ? palette.border : color
          }))}
          height={height}
          width={resolvedWidth}
          barWidth={barWidth}
          spacing={spacing}
          initialSpacing={spacing / 2}
          endSpacing={0}
          roundedTop
          barBorderRadius={3}
          maxValue={max * 1.15}
          hideAxesAndRules
          hideYAxisText
          disableScroll
        />
      ) : null}
    </View>
  );
};
