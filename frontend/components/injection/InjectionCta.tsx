import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Text, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { formatDuration, formatTime } from '@/lib/date';
import { useTheme } from '@/providers/ThemeProvider';
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
  const { isDark } = useTheme();

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

  const pct = Math.max(0, Math.min(1, cooldown.progress)) * 100;
  const label = `Prochaine dans ${formatDuration(cooldown.remainingMs)}`;
  const at = cooldown.nextAt ? `à ${formatTime(cooldown.nextAt)}` : null;

  // Timer and disabled CTA in one control: the fill is the cooldown progress, so the
  // separate bar and the "Nouvelle injection" button no longer stack up.
  return (
    <View
      accessibilityRole="button"
      accessibilityLabel={at ? `${label}, ${at}` : label}
      accessibilityState={{ disabled: true }}
      className="min-h-[52px] w-full flex-row items-center justify-center gap-2 overflow-hidden rounded-2xl bg-light-border px-5 dark:bg-dark-border"
    >
      <View
        className="absolute inset-y-0 left-0"
        // Cooling uses warm, never danger — waiting is not an error.
        style={{ width: `${pct}%`, backgroundColor: 'rgba(255,184,77,0.35)' }}
      />
      {/* Same warn hues as Badge, so the icon stays readable on the dark track. */}
      <FontAwesome6
        name="clock"
        size={15}
        color={isDark ? '#FFD980' : '#C97F14'}
      />
      <Text
        className="shrink font-nunito-bold text-[15px] text-dark-bg dark:text-white"
        numberOfLines={1}
      >
        {label}
      </Text>
      {at ? (
        <Text className="font-nunito text-[13px] text-muted dark:text-muted-light">
          · {at}
        </Text>
      ) : null}
    </View>
  );
};
