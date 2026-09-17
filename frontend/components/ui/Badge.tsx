import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Text, View } from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';

export type BadgeTone = 'success' | 'warn' | 'danger' | 'neutral' | 'onPrimary';

// fgDark is a lighter step of the same hue: the dark-mode tint sits on a near-black
// card, where the light-mode foregrounds drop below readable contrast.
const STYLES: Record<BadgeTone, { bg: string; fg: string; fgDark: string }> = {
  success: { bg: 'rgba(0,208,156,0.12)', fg: '#00B889', fgDark: '#66E9C3' },
  // Waiting is not an error: cooling states use warn, never danger.
  warn: { bg: 'rgba(255,184,77,0.14)', fg: '#C97F14', fgDark: '#FFD980' },
  danger: { bg: 'rgba(255,107,107,0.12)', fg: '#E65555', fgDark: '#FFA3A3' },
  neutral: { bg: 'rgba(142,142,160,0.14)', fg: '#8E8EA0', fgDark: '#B8B8C8' },
  onPrimary: { bg: 'rgba(255,255,255,0.18)', fg: '#FFFFFF', fgDark: '#FFFFFF' }
};

interface Props {
  label: string;
  tone?: BadgeTone;
  icon?: React.ComponentProps<typeof FontAwesome6>['name'];
  iconColor?: string;
  className?: string;
}

export const Badge = ({
  label,
  tone = 'neutral',
  icon,
  iconColor,
  className = ''
}: Props) => {
  const { isDark } = useTheme();
  const s = STYLES[tone];
  const fg = isDark ? s.fgDark : s.fg;
  return (
    <View
      className={`flex-row items-center justify-center gap-1.5 rounded-full px-3 py-1.5 ${className}`}
      style={{ backgroundColor: s.bg }}
    >
      {icon ? (
        <FontAwesome6 name={icon} size={11} color={iconColor ?? fg} />
      ) : null}
      <Text className="font-nunito-semibold text-[12px]" style={{ color: fg }}>
        {label}
      </Text>
    </View>
  );
};
