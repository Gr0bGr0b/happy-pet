import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PresetChips } from '@/components/ui/PresetChips';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TextField } from '@/components/ui/TextField';
import { createCat } from '@/lib/api/catMutations';
import { useCat } from '@/providers/CatProvider';
import { useTheme } from '@/providers/ThemeProvider';
import type { CatDraft, Sex } from '@/types/cat';

// PresetChips speaks numbers, so the two-way choices are indexed into these.
const SEXES: Sex[] = ['Female', 'Male'];
const SEX_OPTIONS = [
  { label: 'Femelle', value: 0 },
  { label: 'Mâle', value: 1 }
];
const YES_NO_OPTIONS = [
  { label: 'Non', value: 0 },
  { label: 'Oui', value: 1 }
];

/** Same bounds the API enforces (app/schemas/cat.py). */
const WEIGHT_MAX_KG = 25;

interface FormState {
  name: string;
  sex: number;
  breed: string;
  color: string;
  birth: string;
  weight: string;
  diabetes: number;
}

/** "15/03/2020" or "2020-03-15" -> "2020-03-15"; null when not a real past date. */
function parseBirthDate(input: string): string | null {
  const s = input.trim();
  const fr = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  const iso = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  const [y, m, d] = fr
    ? [fr[3], fr[2], fr[1]].map(Number)
    : iso
      ? [iso[1], iso[2], iso[3]].map(Number)
      : [];
  if (y === undefined) return null;
  const date = new Date(y, m - 1, d);
  // A rolled-over date (31/02) no longer matches its parts.
  if (date.getMonth() !== m - 1 || date.getDate() !== d || date > new Date()) {
    return null;
  }
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${y}-${pad(m)}-${pad(d)}`;
}

function parseForm(f: FormState): { draft: CatDraft } | { error: string } {
  const name = f.name.trim();
  const breed = f.breed.trim();
  const color = f.color.trim();
  if (!name || name.length > 20)
    return { error: 'Entrez un nom (20 caractères max).' };
  if (!breed || breed.length > 30)
    return { error: 'Entrez une race (30 caractères max).' };
  if (!color || color.length > 20)
    return { error: 'Entrez une robe (20 caractères max).' };

  const dateOfBirth = parseBirthDate(f.birth);
  if (!dateOfBirth)
    return { error: 'Entrez une date de naissance au format JJ/MM/AAAA.' };

  const weight = Number(f.weight.trim().replace(',', '.'));
  if (!(weight > 0 && weight <= WEIGHT_MAX_KG)) {
    return { error: `Entrez un poids entre 0 et ${WEIGHT_MAX_KG} kg.` };
  }

  return {
    draft: {
      name,
      breed,
      color,
      dateOfBirth,
      weight,
      sex: SEXES[f.sex],
      diabetes: f.diabetes === 1
    }
  };
}

/** The mascot bobs gently; held still when the OS asks for reduced motion. */
const BobbingCat = () => {
  const reduceMotion = useReducedMotion();
  const offset = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) return;
    offset.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 700 }),
        withTiming(0, { duration: 700 })
      ),
      -1
    );
  }, [offset, reduceMotion]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }]
  }));

  return (
    <Animated.View style={style}>
      <View className="h-20 w-20 items-center justify-center rounded-full bg-white">
        <FontAwesome6 name="cat" size={36} color="#6C63FF" />
      </View>
    </Animated.View>
  );
};

/** PresetChips with the same label as a TextField above it. */
const ChoiceField = ({
  label,
  ...chips
}: { label: string } & React.ComponentProps<typeof PresetChips>) => (
  <View className="gap-2">
    <Text className="font-nunito-semibold text-[13px] text-muted dark:text-muted-light">
      {label}
    </Text>
    <PresetChips {...chips} />
  </View>
);

/** Card entrance, staggered by position so the form unfolds top to bottom. */
const enter = (index: number) =>
  FadeInDown.delay(200 + index * 120)
    .springify()
    .damping(16);

export default function WelcomeScreen() {
  const { cat, setCat } = useCat();
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const [form, setForm] = useState<FormState>({
    name: '',
    sex: 0,
    breed: '',
    color: '',
    birth: '',
    weight: '',
    diabetes: 1
  });
  const [saving, setSaving] = useState(false);
  // Inline rather than Alert.alert, which react-native-web renders as nothing.
  const [error, setError] = useState<string | undefined>();

  // Set once the cat exists, including right after the submit below.
  if (cat) return <Redirect href="/" />;

  const set =
    <K extends keyof FormState>(key: K) =>
    (value: FormState[K]) =>
      setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async () => {
    const parsed = parseForm(form);
    if ('error' in parsed) {
      setError(parsed.error);
      return;
    }
    setError(undefined);
    setSaving(true);
    try {
      setCat(await createCat(parsed.draft));
    } catch (e) {
      setError(
        `Enregistrement échoué : ${e instanceof Error ? e.message : String(e)}`
      );
      setSaving(false);
    }
  };

  return (
    <Screen
      footer={
        <Animated.View entering={FadeInUp.delay(600)} style={{ gap: 8 }}>
          {error ? (
            // Keyed on the message so each new error fades in again.
            <Animated.View key={error} entering={FadeIn}>
              <Text
                className="text-center font-nunito-semibold text-[13px] text-danger"
                accessibilityRole="alert"
                accessibilityLiveRegion="polite"
              >
                {error}
              </Text>
            </Animated.View>
          ) : null}
          <Button
            label="C'est parti !"
            icon="paw"
            onPress={submit}
            loading={saving}
          />
        </Animated.View>
      }
    >
      <View
        className="items-center gap-3 rounded-b-[24px] px-6 pb-8"
        style={{
          backgroundColor: isDark ? '#3A2D6B' : '#6C63FF',
          paddingTop: insets.top + 32
        }}
      >
        <Animated.View entering={FadeInDown.springify().damping(12)}>
          <BobbingCat />
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(100)}>
          <Text className="text-center font-nunito-extrabold text-[24px] text-white">
            Bienvenue sur HappyPet
          </Text>
          <Text className="mt-1 text-center font-nunito text-[14px] text-white/80">
            Présentez-nous votre chat pour commencer son suivi.
          </Text>
        </Animated.View>
      </View>

      {/* pb-8: room for the error line, which grows the pinned footer past its reserve. */}
      <View className="w-full max-w-[520px] self-center gap-3.5 px-4 pb-8 pt-4">
        <Animated.View entering={enter(0)}>
          <Card>
            <SectionHeader icon="cat" tone="primary" title="Identité" />
            <View className="gap-4">
              <TextField
                label="Nom"
                value={form.name}
                onChangeText={set('name')}
                placeholder="Minou"
              />
              <ChoiceField
                label="Sexe"
                options={SEX_OPTIONS}
                value={form.sex}
                onSelect={set('sex')}
              />
              <TextField
                label="Race"
                value={form.breed}
                onChangeText={set('breed')}
                placeholder="Européen"
              />
              <TextField
                label="Robe"
                value={form.color}
                onChangeText={set('color')}
                placeholder="Tigré"
              />
            </View>
          </Card>
        </Animated.View>

        <Animated.View entering={enter(1)}>
          <Card>
            <SectionHeader icon="heart-pulse" tone="accent" title="Santé" />
            <View className="gap-4">
              <TextField
                label="Date de naissance"
                value={form.birth}
                onChangeText={set('birth')}
                placeholder="JJ/MM/AAAA"
              />
              <TextField
                label="Poids actuel"
                value={form.weight}
                onChangeText={set('weight')}
                keyboardType="decimal-pad"
                unit="kg"
              />
              <ChoiceField
                label="Diabétique"
                options={YES_NO_OPTIONS}
                value={form.diabetes}
                onSelect={set('diabetes')}
              />
            </View>
          </Card>
        </Animated.View>
      </View>
    </Screen>
  );
}
