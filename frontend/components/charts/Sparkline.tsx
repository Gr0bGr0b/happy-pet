import { LineChart } from 'react-native-chart-kit';
import { Text, View } from 'react-native';
import { Circle } from 'react-native-svg';
import { useTheme } from '@/providers/ThemeProvider';

interface Props {
  values: number[];
  /** One per value — rendered as the x axis. */
  labels?: string[];
  color: string;
  height?: number;
  width: number;
}

// Room for the dot radius so the topmost point isn't clipped by the chart edge.
const PAD_TOP = 8;
const LABEL_ROW = 16;
// Gap between the plot floor and the ticks: when the latest value is also the series
// minimum its dot sits on the floor, and without this it collides with its own label.
const LABEL_GAP = 7;
// Horizontal breathing room so the first and last dots (and the emphasised latest one)
// are not sliced in half by the clipping wrapper.
const INSET = 6;
// The bezier curve overshoots its data points, so a steep final drop dips below the plot
// floor (which sits at paddingTop + 3/4 * height) and gets sliced by the clip. Extra
// canvas and matching container height give that overshoot somewhere to go.
const BLEED = 10;
// Six month names do not fit legibly across half a phone width — they collided. Show
// first / middle / last instead, which is the usual sparkline convention.
const MAX_TICKS = 3;

/**
 * Compact trend line with a gradient fill, an emphasised latest point and month labels.
 *
 * Two react-native-chart-kit layout details are compensated for here, both taken from
 * its source (dist/charts/line/geometry.js):
 *
 *   x = paddingRight + index * (width - paddingRight) / xMax,  xMax = data.length
 *
 *   1. `paddingRight` is a left gutter for the y-axis labels, defaulting to 64 even when
 *      the labels are hidden. It is read from the `style` prop, so it can be zeroed.
 *   2. The divisor is the point COUNT rather than the number of gaps, so the last point
 *      lands one full slot short of the right edge. Rendering n/(n-1) wider puts it
 *      exactly on the edge; the wrapper clips the unused remainder.
 *
 * The x labels are rendered here rather than by the chart so they line up with that same
 * formula — chart-kit would space them across its own (unscaled) plot width instead.
 */
export const Sparkline = ({
  values,
  labels,
  color,
  height = 56,
  width
}: Props) => {
  const { palette } = useTheme();
  const totalHeight = height + BLEED + (labels ? LABEL_ROW + LABEL_GAP : 0);

  if (values.length < 2 || width <= 0) {
    return <View style={{ height: totalHeight, width }} />;
  }

  const min = Math.min(...values);
  const max = Math.max(...values);

  // A constant series gives chart-kit a zero range to divide by, which renders NaN
  // coordinates and an empty chart. Draw the flat line directly instead.
  if (max === min) {
    return (
      <View style={{ height: totalHeight, width, justifyContent: 'center' }}>
        <View style={{ height: 2, borderRadius: 1, backgroundColor: color }} />
      </View>
    );
  }

  const plotSpan = width - INSET * 2;
  const plotWidth = (plotSpan * values.length) / (values.length - 1);
  const lastIndex = values.length - 1;

  const tickIndexes =
    labels && labels.length > MAX_TICKS
      ? [0, Math.floor((labels.length - 1) / 2), labels.length - 1]
      : (labels?.map((_, i) => i) ?? []);

  return (
    <View style={{ height: totalHeight, width }}>
      <View style={{ height, width, overflow: 'hidden' }}>
        <View style={{ marginLeft: INSET }}>
          <LineChart
            data={{
              labels: values.map(() => ''),
              datasets: [{ data: values, color: () => color, strokeWidth: 2.5 }]
            }}
            width={plotWidth}
            height={height}
            withDots
            // The area fill under the line — this is what gives the card its lift.
            withShadow
            withInnerLines={false}
            withOuterLines={false}
            withHorizontalLabels={false}
            withVerticalLabels={false}
            bezier
            // Emphasise the most recent reading; the rest stay as quiet markers.
            renderDotContent={({ x, y, index }) =>
              index === lastIndex ? (
                <Circle
                  key="latest"
                  cx={x}
                  cy={y}
                  r={5}
                  fill={color}
                  stroke={palette.card}
                  strokeWidth={2.5}
                />
              ) : null
            }
            chartConfig={{
              color: () => color,
              labelColor: () => 'transparent',
              backgroundGradientFrom: '#000000',
              backgroundGradientTo: '#000000',
              backgroundGradientFromOpacity: 0,
              backgroundGradientToOpacity: 0,
              fillShadowGradientFrom: color,
              fillShadowGradientTo: color,
              fillShadowGradientFromOpacity: 0.3,
              fillShadowGradientToOpacity: 0,
              propsForDots: { r: '2.5', strokeWidth: '0', fill: color },
              propsForBackgroundLines: { strokeWidth: 0 }
            }}
            // paddingRight/paddingTop are consumed as layout values, not CSS.
            style={{
              paddingRight: 0,
              paddingTop: PAD_TOP,
              paddingBottom: BLEED
            }}
          />
        </View>
      </View>

      {labels ? (
        <View style={{ height: LABEL_ROW, width, marginTop: LABEL_GAP }}>
          {tickIndexes.map((index, position) => {
            const isFirst = position === 0;
            const isLast = position === tickIndexes.length - 1;
            const x = INSET + (index / Math.max(1, lastIndex)) * plotSpan;
            return (
              <Text
                key={`${labels[index]}-${index}`}
                numberOfLines={1}
                style={{
                  position: 'absolute',
                  // Edge ticks anchor to the card edges; interior ticks centre on their
                  // point. Clamping every label instead made neighbours collide.
                  ...(isFirst
                    ? { left: 0 }
                    : isLast
                      ? { right: 0 }
                      : {
                          left: x - 20,
                          width: 40,
                          textAlign: 'center' as const
                        }),
                  fontSize: 9,
                  fontFamily: 'Nunito_600SemiBold',
                  color: isLast ? color : palette.muted
                }}
              >
                {labels[index]}
              </Text>
            );
          })}
        </View>
      ) : null}
    </View>
  );
};
