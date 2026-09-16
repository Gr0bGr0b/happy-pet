import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { CatPhoto } from '@/components/cat/CatPhoto';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';
import { PresetChips } from '@/components/ui/PresetChips';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TextField } from '@/components/ui/TextField';
import { BACKEND_SUPPORTS_CAT_WRITES } from '@/constants/features';
import { useCat } from '@/providers/CatProvider';

const GRAM_PRESETS = [50, 100, 150, 200].map((v) => ({
  label: `${v} g`,
  value: v
}));

export default function EditCatScreen() {
  const router = useRouter();
  const { focus } = useLocalSearchParams<{ focus?: string }>();
  const { cat, loading, error, refetch } = useCat();

  const [weight, setWeight] = useState<string>('');
  const [foodPerRation, setFoodPerRation] = useState<string>('');
  const [foodName, setFoodName] = useState<string>('');
  const [imageUri, setImageUri] = useState<string | undefined>();
  const [initialised, setInitialised] = useState(false);

  if (loading) return <View className="flex-1 bg-light-bg dark:bg-dark-bg" />;
  if (error || !cat) {
    return (
      <View className="flex-1 bg-light-bg dark:bg-dark-bg">
        <ErrorState message={error ?? 'Chat introuvable'} onRetry={refetch} />
      </View>
    );
  }

  if (!initialised) {
    setWeight(String(cat.weight));
    setFoodPerRation(
      cat.foodPerRation != null ? String(cat.foodPerRation) : ''
    );
    setFoodName(cat.foodName ?? '');
    setInitialised(true);
  }

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Accès refusé',
        "Autorisez l'accès à la photothèque pour changer la photo du chat."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-light-bg dark:bg-dark-bg"
      contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}
      keyboardShouldPersistTaps="handled"
    >
      {!BACKEND_SUPPORTS_CAT_WRITES ? (
        <View className="rounded-2xl bg-warm-50 p-4 dark:bg-warm/10">
          <Text className="font-nunito-semibold text-[13px] text-warm-700 dark:text-warm-200">
            Enregistrement indisponible
          </Text>
          <Text className="mt-1 font-nunito text-[12px] text-warm-700/80 dark:text-warm-200/80">
            La modification du profil nécessite une mise à jour de l&apos;API
            (PATCH /cats/&#123;id&#125;). Les champs ci-dessous sont
            fonctionnels mais ne peuvent pas encore être sauvegardés.
          </Text>
        </View>
      ) : null}

      <Card>
        <SectionHeader icon="camera" tone="primary" title="Photo" />
        <View className="items-center gap-4">
          <CatPhoto
            uri={imageUri ?? cat.imageUrl}
            seed={cat.id}
            size={120}
            rounded={false}
          />
          <Button
            label="Choisir une photo"
            icon="image"
            variant="ghost"
            onPress={pickImage}
            fullWidth={false}
          />
          {imageUri ? (
            <Badge
              label="Aperçu local — non envoyé"
              tone="warn"
              icon="triangle-exclamation"
            />
          ) : null}
        </View>
      </Card>

      <Card>
        <SectionHeader icon="weight-hanging" tone="accent" title="Poids" />
        <TextField
          label="Poids actuel"
          value={weight}
          onChangeText={setWeight}
          keyboardType="decimal-pad"
          unit="kg"
          autoFocus={focus === 'weight'}
        />
      </Card>

      <Card>
        <SectionHeader icon="bowl-food" tone="warm" title="Nourriture" />
        <View className="gap-4">
          <TextField
            label="Grammes par repas"
            value={foodPerRation}
            onChangeText={setFoodPerRation}
            keyboardType="decimal-pad"
            unit="g"
            autoFocus={focus === 'food'}
          />
          <PresetChips
            options={GRAM_PRESETS}
            value={Number(foodPerRation)}
            onSelect={(v) => setFoodPerRation(String(v))}
          />
          <TextField
            label="Nom / référence des croquettes"
            value={foodName}
            onChangeText={setFoodName}
            placeholder="Royal Canin Diabetic"
          />
        </View>
      </Card>

      <View className="gap-3">
        <Button
          label="Enregistrer"
          icon="floppy-disk"
          onPress={() => {}}
          disabled={!BACKEND_SUPPORTS_CAT_WRITES}
        />
        <Button label="Annuler" variant="ghost" onPress={() => router.back()} />
      </View>
    </ScrollView>
  );
}
