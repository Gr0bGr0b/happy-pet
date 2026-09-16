import { Text, View } from 'react-native';
import { MiniBarChart } from '@/components/charts/MiniBarChart';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TREND_MONTHS } from '@/constants/injections';
import type { DosagePoint } from '@/types/injection';

interface Props {
  points: DosagePoint[];
}

export const DosageTrendCard = ({ points }: Props) => {
  const withData = points.filter((p) => p.value !== null);
  const current = points[points.length - 1];
  const previous = [...points]
    .slice(0, -1)
    .reverse()
    .find((p) => p.value !== null);

  const delta =
    current?.value != null && previous?.value != null
      ? Math.round((current.value - previous.value) * 10) / 10
      : null;

  const totalCount = points.reduce((sum, p) => sum + p.count, 0);

  return (
    <Card>
      <SectionHeader
        icon="syringe"
        tone="primary"
        title="Dosage"
        subtitle={`${TREND_MONTHS} derniers mois`}
      />

      {withData.length === 0 ? (
        <EmptyState
          icon="chart-column"
          title="Pas encore de données"
          hint="Le graphique se remplit au fil des injections enregistrées."
        />
      ) : (
        <>
          {/* Compact metric row — a full-width filled tile made the card taller than the
              phone viewport and pushed the daily task below the fold. */}
          <View className="mb-3 flex-row items-end justify-between">
            <View className="flex-row items-end gap-1.5">
              <Text className="font-nunito-extrabold text-[30px] leading-[34px] text-dark-bg dark:text-white">
                {current?.value != null ? current.value.toFixed(1) : '—'}
              </Text>
              <Text className="mb-1 font-nunito text-[13px] text-muted dark:text-muted-light">
                ml en moyenne ce mois
              </Text>
            </View>
          </View>

          <View className="mb-3 flex-row items-center gap-2">
            {delta !== null ? (
              <Text
                className="font-nunito-semibold text-[12px]"
                style={{
                  color:
                    delta === 0 ? '#8E8EA0' : delta > 0 ? '#C97F14' : '#00B889'
                }}
              >
                {delta > 0 ? '▲' : delta < 0 ? '▼' : '='}{' '}
                {Math.abs(delta).toFixed(1)} ml vs mois précédent
              </Text>
            ) : null}
            {/* The count spans the whole period; labelling it next to a monthly average
                read as "341 injections this month". */}
            <Text className="font-nunito text-[12px] text-muted dark:text-muted-light">
              · {totalCount} au total
            </Text>
          </View>

          <MiniBarChart
            data={points.map((p) => ({ label: p.label, value: p.value }))}
            color="#6C63FF"
          />
          <Text className="mt-2 text-center font-nunito text-[11px] text-muted dark:text-muted-light">
            ┄ moyenne de la période
          </Text>
        </>
      )}
    </Card>
  );
};
