import { useState } from 'react';
import { LineChart } from 'react-native-gifted-charts';
import { View } from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';

export interface LinePoint {
  label: string;
  value: number;
}

interface Props {
  data: LinePoint[];
  color: string;
  height?: number;
  width?: number;
}

/**
 * Sparkline: no axes, rules or labels — at half the phone width there is no room for
 * them, and the card subtitle already carries the current value.
 * When `width` is omitted it fills the parent and measures itself via onLayout.
 */
export const MiniLineChart = ({ data, color, height = 52, width }: Props) => {
  const { palette } = useTheme();
  const [measuredWidth, setMeasuredWidth] = useState(0);

  const resolvedWidth = width ?? measuredWidth;

  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pad = Math.max(0.1, (max - min) * 0.25);

  const spacing =
    data.length > 1 ? (resolvedWidth - 12) / (data.length - 1) : 0;

  return (
    <View
      style={{ height, width: resolvedWidth }}
      onLayout={
        width ? undefined : (e) => setMeasuredWidth(e.nativeEvent.layout.width)
      }
    >
      {resolvedWidth > 0 ? (
        <LineChart
          data={data.map((p) => ({ value: p.value }))}
          height={height}
          width={resolvedWidth}
          color={color}
          thickness={2}
          curved
          hideDataPoints={data.length > 8}
          dataPointsColor={color}
          dataPointsRadius={2.5}
          yAxisOffset={min - pad}
          maxValue={max + pad - (min - pad)}
          hideAxesAndRules
          hideYAxisText
          spacing={spacing}
          initialSpacing={6}
          endSpacing={6}
          adjustToWidth
          xAxisColor={palette.border}
          disableScroll
        />
      ) : null}
    </View>
  );
};
