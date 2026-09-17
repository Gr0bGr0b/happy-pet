import { Text, View } from 'react-native';

interface Props {
  value: string;
  unit?: string;
  caption?: string;
  className?: string;
}

export const StatTile = ({ value, unit, caption, className = '' }: Props) => (
  <View
    className={`items-center rounded-2xl bg-light-bg py-3 dark:bg-white/5 ${className}`}
  >
    <View className="flex-row items-end gap-1">
      <Text className="font-nunito-extrabold text-[32px] leading-[38px] text-dark-bg dark:text-white">
        {value}
      </Text>
      {unit ? (
        <Text className="mb-1.5 font-nunito text-[13px] text-muted dark:text-muted-light">
          {unit}
        </Text>
      ) : null}
    </View>
    {caption ? (
      <Text className="mt-0.5 font-nunito text-[12px] text-muted dark:text-muted-light">
        {caption}
      </Text>
    ) : null}
  </View>
);
