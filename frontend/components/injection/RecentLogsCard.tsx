import { Text, View } from 'react-native';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { RECENT_LOGS_WINDOW_HOURS } from '@/constants/injections';
import { formatDayLabel, formatTime } from '@/lib/date';
import type { InjectionLog } from '@/types/injection';

interface Props {
  groups: { key: string; logs: InjectionLog[] }[];
}

/**
 * Rolling 48h window, grouped by day.
 *
 * Renders inline — the previous version nested a maxHeight ScrollView inside the page
 * ScrollView, which captures scroll gestures on mobile. The window is bounded, so there
 * is nothing to scroll independently.
 */
export const RecentLogsCard = ({ groups }: Props) => {
  const isEmpty = groups.length === 0;

  return (
    <Card>
      <SectionHeader
        icon="clipboard-list"
        tone="primary"
        title="Historique"
        subtitle={`${RECENT_LOGS_WINDOW_HOURS} dernières heures`}
      />

      {isEmpty ? (
        <EmptyState
          icon="clipboard"
          title="Aucune injection récente"
          hint="Les injections des deux derniers jours apparaîtront ici."
        />
      ) : (
        <View className="gap-4">
          {groups.map((group) => (
            <View key={group.key} className="gap-2">
              <Text className="font-nunito-semibold text-[12px] uppercase tracking-wide text-muted dark:text-muted-light">
                {formatDayLabel(group.logs[0].createdAt)}
              </Text>

              {group.logs.map((log) => (
                <View
                  key={log.id}
                  className="flex-row items-center gap-3 rounded-2xl bg-light-bg px-4 py-3 dark:bg-white/5"
                >
                  <View className="h-2 w-2 rounded-full bg-primary" />
                  <View className="flex-1">
                    <Text className="font-nunito-semibold text-[14px] text-dark-bg dark:text-white">
                      {formatTime(log.createdAt)}
                    </Text>
                    {log.notes ? (
                      <Text
                        numberOfLines={1}
                        className="mt-0.5 font-nunito text-[12px] text-muted dark:text-muted-light"
                      >
                        {log.notes}
                      </Text>
                    ) : null}
                  </View>
                  <View className="rounded-lg bg-primary px-2.5 py-1">
                    <Text className="font-nunito-bold text-[12px] text-white">
                      {log.dosage.toFixed(1)} ml
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      )}
    </Card>
  );
};
