import { Text, View } from 'react-native';
import { Card } from '@/components/ui/Card';
import { IconButton } from '@/components/ui/IconButton';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StatTile } from '@/components/ui/StatTile';
import type { Cat } from '@/types/cat';

interface Props {
  cat: Cat;
  onEdit: () => void;
}

export const FoodSummaryCard = ({ cat, onEdit }: Props) => (
  <Card>
    <SectionHeader
      icon="bowl-food"
      tone="warm"
      title="Nourriture"
      action={
        <IconButton
          icon="pen"
          onPress={onEdit}
          color="#FFB84D"
          background="rgba(255,184,77,0.12)"
          size={13}
          label="Modifier la nourriture"
        />
      }
    />

    <StatTile
      value={cat.foodPerRation != null ? String(cat.foodPerRation) : '—'}
      unit="g"
      caption="par repas"
    />

    <View className="mt-3 items-center">
      <Text
        className={`font-nunito-semibold text-[14px] ${
          cat.foodName
            ? 'text-dark-bg dark:text-white'
            : 'italic text-muted dark:text-muted-light'
        }`}
      >
        {cat.foodName || 'Non renseigné'}
      </Text>
    </View>
  </Card>
);
