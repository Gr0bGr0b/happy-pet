import { useState } from 'react';
import { Text, View } from 'react-native';
import { DoseRing } from '@/components/injection/DoseRing';
import { Button } from '@/components/ui/Button';
import { PresetChips } from '@/components/ui/PresetChips';
import { Sheet } from '@/components/ui/Sheet';
import { Stepper } from '@/components/ui/Stepper';
import { TextField } from '@/components/ui/TextField';
import { DOSAGE_MAX, DOSAGE_MIN, DOSAGE_STEP } from '@/constants/injections';

const PRESETS = [2.5, 3, 3.5, 4, 5].map((v) => ({
  label: `${v} ml`,
  value: v
}));

interface FormProps {
  initialDose: number;
  submitting: boolean;
  onConfirm: (dosage: number, notes?: string) => Promise<void>;
  onDone: () => void;
}

// Mounted only while the sheet is open, so useState initialisers reset the form on each
// open. Avoids resetting state from an effect, which triggers a cascading render.
const InjectionForm = ({
  initialDose,
  submitting,
  onConfirm,
  onDone
}: FormProps) => {
  const [dose, setDose] = useState(initialDose);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setError(null);
    try {
      await onConfirm(dose, notes.trim() || undefined);
      onDone();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Échec de l'enregistrement");
    }
  };

  return (
    <View className="gap-5">
      <Stepper
        value={dose}
        onChange={setDose}
        min={DOSAGE_MIN}
        max={DOSAGE_MAX}
        step={DOSAGE_STEP}
      >
        <DoseRing dose={dose} size={132} />
      </Stepper>

      <PresetChips options={PRESETS} value={dose} onSelect={setDose} />

      <TextField
        label="Notes (optionnel)"
        value={notes}
        onChangeText={setNotes}
        placeholder="Comportement, observations…"
      />

      {error ? (
        <Text className="font-nunito-semibold text-[13px] text-danger">
          {error}
        </Text>
      ) : null}

      <Button
        label={`Confirmer ${dose.toFixed(1)} ml`}
        icon="check"
        onPress={handleConfirm}
        loading={submitting}
      />
    </View>
  );
};

interface Props {
  visible: boolean;
  onClose: () => void;
  initialDose: number;
  submitting: boolean;
  onConfirm: (dosage: number, notes?: string) => Promise<void>;
}

/**
 * Confirmation step for a medical record. Previously a single tap wrote an injection
 * with no confirmation and no undo — and there is no DELETE endpoint to correct it.
 */
export const AddInjectionSheet = ({
  visible,
  onClose,
  initialDose,
  submitting,
  onConfirm
}: Props) => (
  <Sheet visible={visible} onClose={onClose} title="Nouvelle injection">
    {visible ? (
      <InjectionForm
        initialDose={initialDose}
        submitting={submitting}
        onConfirm={onConfirm}
        onDone={onClose}
      />
    ) : null}
  </Sheet>
);
