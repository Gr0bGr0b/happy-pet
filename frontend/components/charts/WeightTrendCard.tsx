import { Sparkline } from '@/components/charts/Sparkline';
import { TrendMiniCard } from '@/components/charts/TrendMiniCard';
import { shortMonthLabel } from '@/lib/date';
import type { WeightPoint } from '@/types/cat';

interface Props {
  points: WeightPoint[];
  currentWeight: number;
  /** The series could not be loaded — the tile says so instead of showing a blank. */
  unavailable?: boolean;
}

export const WeightTrendCard = ({
  points,
  currentWeight,
  unavailable = false
}: Props) => (
  <TrendMiniCard
    icon="weight-hanging"
    iconColor="#00D09C"
    iconTint="rgba(0,208,156,0.12)"
    title="Poids"
    subtitle={`${currentWeight.toFixed(1)} kg`}
    note={unavailable ? 'indisponible' : undefined}
  >
    {(width) => (
      <Sparkline
        values={points.map((p) => p.weight)}
        labels={points.map((p) => shortMonthLabel(p.recordedAt))}
        color="#00D09C"
        width={width}
      />
    )}
  </TrendMiniCard>
);
