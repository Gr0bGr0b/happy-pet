import { Text, View } from 'react-native';

interface Props {
  dose: number;
  size?: number;
}

/**
 * Shows the dose only. The border is deliberately neutral: it previously encoded the
 * cooldown state, which put two unrelated variables on one object. Cooldown now has
 * its own CooldownBar.
 */
export const DoseRing = ({ dose, size = 150 }: Props) => (
  <View
    className="items-center justify-center border-[10px] border-primary-100 bg-light-bg dark:border-primary-700 dark:bg-white/5"
    style={{ width: size, height: size, borderRadius: size / 2 }}
    accessibilityLabel={`Dose sélectionnée : ${dose.toFixed(1)} millilitres`}
  >
    <Text className="font-nunito-extrabold text-[38px] text-dark-bg dark:text-white">
      {dose.toFixed(1)}
    </Text>
    <Text className="mt-0.5 font-nunito text-[13px] text-muted dark:text-muted-light">
      ml
    </Text>
  </View>
);
