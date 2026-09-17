import { Text, View } from 'react-native';
import { CatPhoto } from '@/components/cat/CatPhoto';
import { Badge } from '@/components/ui/Badge';
import { IconButton } from '@/components/ui/IconButton';
import { calculateAge } from '@/lib/date';
import { useTheme } from '@/providers/ThemeProvider';
import type { Cat } from '@/types/cat';

interface Props {
  cat: Cat;
  onEdit: () => void;
}

export const CatHero = ({ cat, onEdit }: Props) => {
  const { isDark, toggleTheme } = useTheme();
  const age = calculateAge(cat.dateOfBirth);

  return (
    <View
      className="rounded-b-[28px] px-5 pb-6 pt-4"
      style={{ backgroundColor: isDark ? '#3A2D6B' : '#6C63FF' }}
    >
      {/* The dead user-avatar icon is gone; the photo takes that space below. */}
      <View className="mb-3 flex-row items-center justify-end gap-2">
        <IconButton
          icon={isDark ? 'circle-half-stroke' : 'moon'}
          onPress={toggleTheme}
          color="#fff"
          background="rgba(255,255,255,0.15)"
          label={isDark ? 'Passer en thème clair' : 'Passer en thème sombre'}
        />
        <IconButton
          icon="pen"
          onPress={onEdit}
          color="#6C63FF"
          background="#FFFFFF"
          label="Modifier le profil du chat"
        />
      </View>

      <View className="mb-4 flex-row items-center gap-4">
        <CatPhoto uri={cat.imageUrl} seed={cat.id} />
        <View className="flex-1">
          <Text className="font-nunito-extrabold text-[26px] text-white">
            {cat.name}
          </Text>
          <Text className="mt-0.5 font-nunito text-[13px] text-white/80">
            {cat.breed}
          </Text>
        </View>
      </View>

      <View className="flex-row gap-2">
        <Badge
          className="flex-1"
          tone="onPrimary"
          icon="cake-candles"
          iconColor="#FFD980"
          label={`${age} an${age > 1 ? 's' : ''}`}
        />
        <Badge
          className="flex-1"
          tone="onPrimary"
          icon="weight-hanging"
          iconColor="#7EFAE0"
          label={`${cat.weight} kg`}
        />
        <Badge
          className="flex-1"
          tone="onPrimary"
          icon="paw"
          iconColor="#FFB3D0"
          label={cat.color}
        />
      </View>
    </View>
  );
};
