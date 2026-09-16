import { Text, View } from 'react-native';
import { MiniLineChart } from '@/components/charts/MiniLineChart';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TREND_MONTHS } from '@/constants/injections';
import type { WeightPoint } from '@/types/cat';

const MONTH_LABELS = [
  'janv.',
  'févr.',
  'mars',
  'avr.',
  'mai',
  'juin',
  'juil.',
  'août',
  'sept.',
  'oct.',
  'nov.',
  'déc.'
];

interface Props {
  points: WeightPoint[];
  currentWeight: number;
  /** True while the series comes from lib/demoWeightHistory.ts. */
  isDemo: boolean;
}

export const WeightTrendCard = ({ points, currentWeight, isDemo }: Props) => {
  const data = points.map((p) => ({
    label: MONTH_LABELS[p.recordedAt.getMonth()],
    value: p.weight
  }));

  const first = points[0]?.weight;
  const delta =
    first != null ? Math.round((currentWeight - first) * 10) / 10 : null;

  return (
    <Card>
      <SectionHeader
        icon="weight-hanging"
        tone="accent"
        title="Poids"
        subtitle={`${TREND_MONTHS} derniers mois`}
        action={
          isDemo ? <Badge label="simulé" tone="warn" icon="flask" /> : undefined
        }
      />

      <View className="mb-3 flex-row items-end justify-between">
        <View className="flex-row items-end gap-1.5">
          <Text className="font-nunito-extrabold text-[30px] leading-[34px] text-dark-bg dark:text-white">
            {currentWeight.toFixed(1)}
          </Text>
          <Text className="mb-1 font-nunito text-[13px] text-muted dark:text-muted-light">
            kg aujourd&apos;hui
          </Text>
        </View>
        {delta !== null ? (
          <Text
            className="mb-1 font-nunito-semibold text-[12px]"
            style={{
              color: delta === 0 ? '#8E8EA0' : delta > 0 ? '#C97F14' : '#00B889'
            }}
          >
            {delta > 0 ? '+' : ''}
            {delta.toFixed(1)} kg
          </Text>
        ) : null}
      </View>

      {data.length >= 2 ? <MiniLineChart data={data} color="#00D09C" /> : null}
    </Card>
  );
};
