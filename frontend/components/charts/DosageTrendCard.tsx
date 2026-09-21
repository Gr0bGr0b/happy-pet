import { Sparkline } from '@/components/charts/Sparkline';
import { TrendMiniCard } from '@/components/charts/TrendMiniCard';
import type { DosagePoint } from '@/types/injection';

interface Props {
  points: DosagePoint[];
}

export const DosageTrendCard = ({ points }: Props) => {
  const current = points[points.length - 1];

  return (
    <TrendMiniCard
      icon="syringe"
      iconColor="#6C63FF"
      iconTint="rgba(108,99,255,0.12)"
      title="Dosage"
      subtitle={current?.value != null ? `${current.value.toFixed(1)} ml` : '—'}
    >
      {(width) => {
        // Months with no injections are dropped rather than plotted as zero, which
        // would draw a cliff to the axis that never happened.
        const filled = points.filter((p) => p.value !== null);
        return (
          <Sparkline
            values={filled.map((p) => p.value as number)}
            labels={filled.map((p) => p.label)}
            color="#6C63FF"
            width={width}
          />
        );
      }}
    </TrendMiniCard>
  );
};
