import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

type Variant = 'primary' | 'warm' | 'ghost' | 'danger';

const BG: Record<Variant, string> = {
  primary: '#6C63FF',
  warm: '#FFB84D',
  danger: '#FF6B6B',
  ghost: 'transparent'
};

interface Props {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  icon?: React.ComponentProps<typeof FontAwesome6>['name'];
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  accessibilityHint?: string;
}

export const Button = ({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled = false,
  loading = false,
  fullWidth = true,
  accessibilityHint
}: Props) => {
  const inert = disabled || loading;
  const isGhost = variant === 'ghost';
  const fg = isGhost ? '#6C63FF' : '#FFFFFF';

  return (
    <Pressable
      onPress={onPress}
      disabled={inert}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: inert }}
      // 52px clears the 44pt minimum touch target comfortably.
      className={`min-h-[52px] flex-row items-center justify-center gap-2 rounded-2xl px-5 ${
        fullWidth ? 'w-full' : ''
      } ${isGhost ? 'border border-light-border dark:border-dark-border' : ''}`}
      style={{ backgroundColor: BG[variant], opacity: inert ? 0.45 : 1 }}
    >
      {loading ? (
        <ActivityIndicator size="small" color={fg} />
      ) : (
        <View className="flex-row items-center gap-2">
          {icon ? <FontAwesome6 name={icon} size={15} color={fg} /> : null}
          <Text className="font-nunito-bold text-[15px]" style={{ color: fg }}>
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
};
