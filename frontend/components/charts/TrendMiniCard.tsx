import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useState, type ReactNode } from 'react';
import { Text, View } from 'react-native';
import { Card } from '@/components/ui/Card';

interface Props {
  icon: React.ComponentProps<typeof FontAwesome6>['name'];
  iconColor: string;
  iconTint: string;
  title: string;
  /** Current value only — the recap carries no history in text. */
  subtitle: string;
  /** Small right-aligned note, e.g. why the series is missing. */
  note?: string;
  /** Receives the measured inner width so the sparkline can size itself. */
  children: (width: number) => ReactNode;
}

/**
 * Half-width recap tile. Padding is tighter than the standard Card because two of these
 * sit side by side on a 390pt phone, leaving ~150pt of usable width each.
 */
export const TrendMiniCard = ({
  icon,
  iconColor,
  iconTint,
  title,
  subtitle,
  note,
  children
}: Props) => {
  const [width, setWidth] = useState(0);

  return (
    <Card className="p-3.5">
      <View className="mb-2 flex-row items-center gap-2">
        <View
          className="h-6 w-6 items-center justify-center rounded-lg"
          style={{ backgroundColor: iconTint }}
        >
          <FontAwesome6 name={icon} size={11} color={iconColor} />
        </View>
        <Text className="flex-1 font-nunito-bold text-[13px] text-dark-bg dark:text-white">
          {title}
        </Text>
        {note ? (
          <Text className="font-nunito text-[10px] text-warm-600 dark:text-warm-200">
            {note}
          </Text>
        ) : null}
      </View>

      <Text className="mb-2.5 font-nunito-extrabold text-[22px] leading-[26px] text-dark-bg dark:text-white">
        {subtitle}
      </Text>

      <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
        {width > 0 ? children(width) : null}
      </View>
    </Card>
  );
};
