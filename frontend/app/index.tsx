import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { WeightTrendCard } from '@/components/charts/WeightTrendCard';
import { DosageTrendCard } from '@/components/charts/DosageTrendCard';
import { CatHero } from '@/components/cat/CatHero';
import { FoodSummaryCard } from '@/components/cat/FoodSummaryCard';
import { AddInjectionSheet } from '@/components/injection/AddInjectionSheet';
import { InjectionCta } from '@/components/injection/InjectionCta';
import { RecentLogsCard } from '@/components/injection/RecentLogsCard';
import { ErrorState } from '@/components/ui/ErrorState';
import { Screen } from '@/components/ui/Screen';
import { DOSAGE_DEFAULT } from '@/constants/injections';
import { useCooldown } from '@/hooks/useCooldown';
import { useWeightHistory } from '@/hooks/useWeightHistory';
import { useCat } from '@/providers/CatProvider';
import { useInjections } from '@/providers/InjectionProvider';

export default function DashboardScreen() {
  const router = useRouter();
  const { cat, loading, error, refetch } = useCat();
  const { recentGroups, monthlyDosage, lastLog, addInjection, submitting } =
    useInjections();
  const weight = useWeightHistory(cat);

  const [sheetOpen, setSheetOpen] = useState(false);

  const cooldown = useCooldown(lastLog, cat?.injectionIntervalHours ?? 12);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-light-bg dark:bg-dark-bg">
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  if (error || !cat) {
    return (
      <View className="flex-1 bg-light-bg dark:bg-dark-bg">
        <ErrorState message={error ?? 'Chat introuvable'} onRetry={refetch} />
      </View>
    );
  }

  const goToEdit = (focus?: string) =>
    router.push(focus ? `/cat/edit?focus=${focus}` : '/cat/edit');

  return (
    <>
      <Screen
        footer={
          <InjectionCta
            cooldown={cooldown}
            onPress={() => setSheetOpen(true)}
          />
        }
      >
        <CatHero cat={cat} onEdit={() => goToEdit()} />

        {/* Mobile-first single column; constrained to a phone width on wide screens. */}
        <View className="w-full max-w-[520px] self-center gap-3.5 px-4 pt-4">
          {/* Recap: always side by side, including on a phone. */}
          <View className="flex-row gap-3.5">
            <View className="flex-1">
              <WeightTrendCard
                points={weight.points}
                currentWeight={cat.weight}
                isDemo={weight.isDemo}
              />
            </View>
            <View className="flex-1">
              <DosageTrendCard points={monthlyDosage} />
            </View>
          </View>

          <FoodSummaryCard cat={cat} onEdit={() => goToEdit('food')} />
          <RecentLogsCard groups={recentGroups} />
        </View>
      </Screen>

      <AddInjectionSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        initialDose={lastLog?.dosage ?? DOSAGE_DEFAULT}
        submitting={submitting}
        onConfirm={addInjection}
      />
    </>
  );
}
