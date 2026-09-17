import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

export type Tone = 'primary' | 'danger' | 'warm' | 'accent';

const TINT: Record<Tone, string> = {
  primary: 'rgba(108,99,255,0.12)',
  danger: 'rgba(255,107,107,0.12)',
  warm: 'rgba(255,184,77,0.14)',
  accent: 'rgba(0,208,156,0.12)'
};

const ICON_COLOR: Record<Tone, string> = {
  primary: '#6C63FF',
  danger: '#FF6B6B',
  warm: '#FFB84D',
  accent: '#00D09C'
};

interface Props {
  icon: React.ComponentProps<typeof FontAwesome6>['name'];
  title: string;
  subtitle?: string;
  tone?: Tone;
  action?: ReactNode;
}

// Replaces the icon-chip + title row duplicated across every card.
export const SectionHeader = ({
  icon,
  title,
  subtitle,
  tone = 'primary',
  action
}: Props) => (
  <View className="mb-4 flex-row items-center gap-3">
    <View
      className="h-8 w-8 items-center justify-center rounded-[10px]"
      style={{ backgroundColor: TINT[tone] }}
    >
      <FontAwesome6 name={icon} size={14} color={ICON_COLOR[tone]} />
    </View>
    <View className="flex-1">
      <Text className="font-nunito-bold text-[17px] text-dark-bg dark:text-white">
        {title}
      </Text>
      {subtitle ? (
        <Text className="font-nunito text-[12px] text-muted dark:text-muted-light">
          {subtitle}
        </Text>
      ) : null}
    </View>
    {action}
  </View>
);
