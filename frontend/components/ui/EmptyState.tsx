import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Text, View } from 'react-native';

interface Props {
  icon: React.ComponentProps<typeof FontAwesome6>['name'];
  title: string;
  hint?: string;
}

export const EmptyState = ({ icon, title, hint }: Props) => (
  <View className="items-center gap-2 py-8">
    <FontAwesome6 name={icon} size={22} color="#B8B8C8" />
    <Text className="font-nunito-semibold text-[14px] text-muted dark:text-muted-light">
      {title}
    </Text>
    {hint ? (
      <Text className="px-6 text-center font-nunito text-[12px] text-muted dark:text-muted-light">
        {hint}
      </Text>
    ) : null}
  </View>
);
