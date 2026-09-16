import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Text, View } from 'react-native';
import { Button } from '@/components/ui/Button';

interface Props {
  message: string;
  onRetry?: () => void;
}

export const ErrorState = ({ message, onRetry }: Props) => (
  <View className="flex-1 items-center justify-center gap-4 px-8">
    <FontAwesome6 name="triangle-exclamation" size={26} color="#FF6B6B" />
    <Text className="text-center font-nunito-semibold text-[15px] text-dark-bg dark:text-white">
      {message}
    </Text>
    {onRetry ? (
      <View className="w-40">
        <Button label="Réessayer" onPress={onRetry} />
      </View>
    ) : null}
  </View>
);
