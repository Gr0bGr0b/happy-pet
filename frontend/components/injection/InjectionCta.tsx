import { Text, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { CooldownBar } from '@/components/ui/CooldownBar';
import { formatDuration, formatTime } from '@/lib/date';
import type { Cooldown } from '@/hooks/useCooldown';

interface Props {
  cooldown: Cooldown;
  onPress: () => void;
  disabled?: boolean;
}

export const InjectionCta = ({
  cooldown,
  onPress,
  disabled = false
}: Props) => {
  if (cooldown.canInject) {
    return (
      <Button
        label="Nouvelle injection"
        icon="syringe"
        onPress={onPress}
        disabled={disabled}
        accessibilityHint="Ouvre la fenêtre de confirmation"
      />
    );
  }

  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between">
        <Text className="font-nunito-semibold text-[13px] text-dark-bg dark:text-white">
          Prochaine dans {formatDuration(cooldown.remainingMs)}
        </Text>
        {cooldown.nextAt ? (
          <Text className="font-nunito text-[12px] text-muted dark:text-muted-light">
            à {formatTime(cooldown.nextAt)}
          </Text>
        ) : null}
      </View>
      <CooldownBar progress={cooldown.progress} />
      <Button
        label="Nouvelle injection"
        icon="clock"
        onPress={onPress}
        disabled
      />
    </View>
  );
};
