import { Text, TextInput, View } from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';

interface Props {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'decimal-pad';
  unit?: string;
  editable?: boolean;
  autoFocus?: boolean;
}

export const TextField = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  unit,
  editable = true,
  autoFocus = false
}: Props) => {
  const { palette } = useTheme();

  return (
    <View className="gap-2">
      <Text className="font-nunito-semibold text-[13px] text-muted dark:text-muted-light">
        {label}
      </Text>
      <View className="flex-row items-center rounded-2xl bg-light-bg px-4 dark:bg-white/5">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          // placeholderTextColor is a prop, not a style — hence the palette.
          placeholderTextColor={palette.muted}
          keyboardType={keyboardType}
          editable={editable}
          autoFocus={autoFocus}
          accessibilityLabel={label}
          className="min-h-[52px] flex-1 font-nunito-semibold text-[15px] text-dark-bg dark:text-white"
          style={{ opacity: editable ? 1 : 0.5 }}
        />
        {unit ? (
          <Text className="font-nunito text-[13px] text-muted dark:text-muted-light">
            {unit}
          </Text>
        ) : null}
      </View>
    </View>
  );
};
