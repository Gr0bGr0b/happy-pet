import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Pressable } from 'react-native';

interface Props {
  icon: React.ComponentProps<typeof FontAwesome6>['name'];
  onPress: () => void;
  color?: string;
  background?: string;
  size?: number;
  label: string;
}

export const IconButton = ({
  icon,
  onPress,
  color = '#6C63FF',
  background = 'rgba(108,99,255,0.10)',
  size = 16,
  label
}: Props) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={label}
    // 44x44 minimum — the previous 32px pencil and 34px header buttons were under it.
    className="h-11 w-11 items-center justify-center rounded-full"
    style={{ backgroundColor: background }}
    hitSlop={6}
  >
    <FontAwesome6 name={icon} size={size} color={color} />
  </Pressable>
);
