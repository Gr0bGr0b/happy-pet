import { Image } from 'expo-image';
import { View } from 'react-native';
import { placeholderCatImage } from '@/constants/placeholders';

interface Props {
  uri?: string;
  seed: string | number;
  size?: number;
  rounded?: boolean;
}

export const CatPhoto = ({ uri, seed, size = 76, rounded = true }: Props) => (
  <View
    className="overflow-hidden border-2"
    style={{
      width: size,
      height: size,
      borderRadius: rounded ? size / 2 : 20,
      borderColor: 'rgba(255,255,255,0.35)',
      backgroundColor: 'rgba(255,255,255,0.2)'
    }}
  >
    <Image
      source={{ uri: uri || placeholderCatImage(seed, size * 3) }}
      style={{ width: '100%', height: '100%' }}
      contentFit="cover"
      transition={200}
      accessibilityLabel="Photo du chat"
    />
  </View>
);
