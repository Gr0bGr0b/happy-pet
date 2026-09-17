import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useRef, type ReactNode } from 'react';
import { Platform, Pressable, View } from 'react-native';

const REPEAT_DELAY_MS = 400;
const REPEAT_INTERVAL_MS = 80;

interface StepButtonProps {
  direction: 1 | -1;
  icon: 'plus' | 'minus';
  disabled: boolean;
  label: string;
  onStart: (direction: 1 | -1) => void;
  onStop: () => void;
}

// Declared at module scope: a component created inside render gets a new identity every
// pass, which remounts it and drops the press state mid-hold.
const StepButton = ({
  direction,
  icon,
  disabled,
  label,
  onStart,
  onStop
}: StepButtonProps) => (
  <Pressable
    onPressIn={() => !disabled && onStart(direction)}
    onPressOut={onStop}
    disabled={disabled}
    accessibilityRole="button"
    accessibilityLabel={label}
    className="h-[52px] w-[52px] items-center justify-center rounded-full"
    style={{
      backgroundColor: 'rgba(108,99,255,0.10)',
      opacity: disabled ? 0.35 : 1
    }}
  >
    <FontAwesome6 name={icon} size={18} color="#6C63FF" />
  </Pressable>
);

interface Props {
  value: number;
  onChange: (next: number) => void;
  min: number;
  max: number;
  step: number;
  precision?: number;
  label?: string;
  /** Rendered between the two buttons — the dose ring lives here. */
  children?: ReactNode;
}

/**
 * Bounded stepper with press-and-hold repeat.
 *
 * The previous implementation had no ceiling (you could reach 900 ml) and no repeat,
 * so moving from 3.5 to 8.0 took 45 individual taps.
 */
export const Stepper = ({
  value,
  onChange,
  min,
  max,
  step,
  precision = 1,
  label = 'dose',
  children
}: Props) => {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Synced in an effect rather than during render: the repeat timer needs the latest
  // value without re-creating the callback on every tick.
  const valueRef = useRef(value);
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const bump = useCallback(
    (direction: 1 | -1) => {
      const factor = 10 ** precision;
      const raw = valueRef.current + direction * step;
      const next = Math.min(
        max,
        Math.max(min, Math.round(raw * factor) / factor)
      );
      if (next !== valueRef.current) {
        valueRef.current = next;
        onChangeRef.current(next);
        if (Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {});
      }
    },
    [min, max, step, precision]
  );

  const stop = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    if (interval.current) clearInterval(interval.current);
    timer.current = null;
    interval.current = null;
  }, []);

  const start = useCallback(
    (direction: 1 | -1) => {
      bump(direction);
      timer.current = setTimeout(() => {
        interval.current = setInterval(
          () => bump(direction),
          REPEAT_INTERVAL_MS
        );
      }, REPEAT_DELAY_MS);
    },
    [bump]
  );

  useEffect(() => stop, [stop]);

  return (
    <View className="flex-row items-center justify-center gap-5">
      <StepButton
        direction={-1}
        icon="minus"
        disabled={value <= min}
        label={`Diminuer la ${label}`}
        onStart={start}
        onStop={stop}
      />
      {children}
      <StepButton
        direction={1}
        icon="plus"
        disabled={value >= max}
        label={`Augmenter la ${label}`}
        onStart={start}
        onStop={stop}
      />
    </View>
  );
};
