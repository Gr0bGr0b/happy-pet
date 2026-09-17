import { Pressable, Text, View } from 'react-native';

interface Props {
  options: { label: string; value: number }[];
  value: number;
  onSelect: (value: number) => void;
}

// The preset pattern already existed for food grams; dosing needs it far more.
export const PresetChips = ({ options, value, onSelect }: Props) => (
  <View className="flex-row flex-wrap gap-2">
    {options.map((option) => {
      const active = Math.abs(option.value - value) < 0.001;
      return (
        <Pressable
          key={option.label}
          onPress={() => onSelect(option.value)}
          accessibilityRole="button"
          accessibilityState={{ selected: active }}
          className={`min-h-[44px] justify-center rounded-xl px-4 ${
            active ? 'bg-primary' : 'bg-light-bg dark:bg-white/5'
          }`}
        >
          <Text
            className={`font-nunito-semibold text-[13px] ${
              active ? 'text-white' : 'text-dark-bg dark:text-white'
            }`}
          >
            {option.label}
          </Text>
        </Pressable>
      );
    })}
  </View>
);
