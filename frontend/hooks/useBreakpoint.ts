import { useWindowDimensions } from 'react-native';

// Replaces four separate copies of `width < 500` scattered across components.
export function useBreakpoint() {
  const { width } = useWindowDimensions();
  return {
    width,
    isCompact: width < 400,
    isWide: width >= 720
  };
}
