import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { CatPhoto } from '@/components/cat/CatPhoto';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';
import { PresetChips } from '@/components/ui/PresetChips';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TextField } from '@/components/ui/TextField';
import {
  updateCat,
  uploadCatImage,
  type PickedImage
} from '@/lib/api/catMutations';
import { useCat } from '@/providers/CatProvider';
import type { Cat, CatPatch } from '@/types/cat';

const GRAM_PRESETS = [50, 100, 150, 200].map((v) => ({
  label: `${v} g`,
  value: v
}));

/** Same bounds the API enforces, so a bad value is caught before the round trip. */
const WEIGHT_MAX_KG = 25;
const FOOD_MAX_G = 2000;

interface FormValues {
  weight?: number;
  foodPerRation?: number;
  foodName: string;
}

/** Empty field -> null. Accepts the comma separator a French keyboard produces. */
function parseNumber(input: string): number | null {
  const trimmed = input.trim().replace(',', '.');
  return trimmed === '' ? null : Number(trimmed);
}

/** Either the parsed form or the message to show — no state, no side effects. */
function parseForm(
  weight: string,
  foodPerRation: string,
  foodName: string
): { values: FormValues } | { error: string } {
  // Comparisons rather than a Number.isNaN guard: NaN fails them too.
  const parsedWeight = parseNumber(weight);
  if (
    parsedWeight !== null &&
    !(parsedWeight > 0 && parsedWeight <= WEIGHT_MAX_KG)
  ) {
    return { error: `Entrez un poids entre 0 et ${WEIGHT_MAX_KG} kg.` };
  }

  const parsedFood = parseNumber(foodPerRation);
  if (parsedFood !== null && !(parsedFood >= 0 && parsedFood <= FOOD_MAX_G)) {
    return { error: `Entrez une ration entre 0 et ${FOOD_MAX_G} g.` };
  }

  return {
    values: {
      weight: parsedWeight ?? undefined,
      foodPerRation: parsedFood ?? undefined,
      foodName: foodName.trim()
    }
  };
}

/** Only what differs from the stored cat: PATCH applies exactly what it receives. */
function diffPatch(cat: Cat, values: FormValues): CatPatch {
  const patch: CatPatch = {};
  if (values.weight !== undefined && values.weight !== cat.weight) {
    patch.weight = values.weight;
  }
  if (
    values.foodPerRation !== undefined &&
    values.foodPerRation !== cat.foodPerRation
  ) {
    patch.foodPerRation = values.foodPerRation;
  }
  if (values.foodName !== (cat.foodName ?? '')) {
    patch.foodName = values.foodName;
  }
  return patch;
}

export default function EditCatScreen() {
  const router = useRouter();
  const { focus } = useLocalSearchParams<{ focus?: string }>();
  const { cat, loading, error, refetch } = useCat();

  const [weight, setWeight] = useState<string>('');
  const [foodPerRation, setFoodPerRation] = useState<string>('');
  const [foodName, setFoodName] = useState<string>('');
  const [picked, setPicked] = useState<PickedImage | undefined>();
  const [saving, setSaving] = useState(false);
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
      const asset = result.assets[0];
      setPicked({
        uri: asset.uri,
        mimeType: asset.mimeType,
        fileName: asset.fileName ?? undefined
      });
    }
  };

  const save = async () => {
    const parsed = parseForm(weight, foodPerRation, foodName);
    if ('error' in parsed) {
      Alert.alert('Valeur invalide', parsed.error);
      return;
    }
    const patch = diffPatch(cat, parsed.values);

    setSaving(true);
    try {
      // The photo has its own endpoint and stores image_url itself; the PATCH below
      // carries the text fields only.
      if (picked) await uploadCatImage(cat.id, picked);
      if (Object.keys(patch).length > 0) await updateCat(cat.id, patch);

      refetch();
      router.back();
    } catch (e) {
      Alert.alert(
        'Enregistrement échoué',
        e instanceof Error ? e.message : String(e)
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-light-bg dark:bg-dark-bg"
      contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}
      keyboardShouldPersistTaps="handled"
    >
      <Card>
        <SectionHeader icon="camera" tone="primary" title="Photo" />
        <View className="items-center gap-4">
          <CatPhoto
            uri={picked?.uri ?? cat.imageUrl}
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
          {picked ? (
            <Badge
              label="Enregistrez pour envoyer la photo"
              tone="neutral"
              icon="circle-info"
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
          label={saving ? 'Enregistrement…' : 'Enregistrer'}
          icon="floppy-disk"
          onPress={save}
          disabled={saving}
        />
        <Button label="Annuler" variant="ghost" onPress={() => router.back()} />
      </View>
    </ScrollView>
  );
}
