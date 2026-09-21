import { View, type ViewProps } from 'react-native';

// Replaces the identical card shell that was copy-pasted into three components.
export const Card = ({
  className = '',
  children,
  ...rest
}: ViewProps & { className?: string }) => (
  <View
    className={`rounded-3xl bg-light-card p-5 dark:bg-dark-card ${className}`}
    style={{ boxShadow: '0 4px 16px rgba(108,99,255,0.08)' }}
    {...rest}
  >
    {children}
  </View>
);
