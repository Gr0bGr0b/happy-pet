import { View } from 'react-native';

interface Props {
  /** 0 → just injected, 1 → due. */
  progress: number;
  /** Cooling uses warm, never danger — waiting is not an error. */
  tone?: 'warm' | 'accent';
}

export const CooldownBar = ({ progress, tone = 'warm' }: Props) => {
  const pct = Math.max(0, Math.min(1, progress)) * 100;
  return (
    <View className="h-1.5 w-full overflow-hidden rounded-full bg-light-border dark:bg-dark-border">
      <View
        className="h-full rounded-full"
        style={{
          width: `${pct}%`,
          backgroundColor: tone === 'warm' ? '#FFB84D' : '#00D09C'
        }}
      />
    </View>
  );
};
