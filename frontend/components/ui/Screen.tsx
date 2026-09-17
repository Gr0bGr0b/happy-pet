import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  children: ReactNode;
  /** Pinned above the scroll view — used by the Add-injection CTA. */
  footer?: ReactNode;
  scroll?: boolean;
}

export const Screen = ({ children, footer, scroll = true }: Props) => {
  const insets = useSafeAreaInsets();
  // Reserve room so the last card is never hidden behind the pinned footer.
  const footerReserve = footer ? 96 + insets.bottom : insets.bottom + 24;

  const body = scroll ? (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: footerReserve }}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View className="flex-1" style={{ paddingBottom: footerReserve }}>
      {children}
    </View>
  );

  return (
    <View className="flex-1 bg-light-bg dark:bg-dark-bg">
      {body}
      {footer ? (
        <View
          className="absolute inset-x-0 bottom-0 border-t border-light-border bg-light-bg px-4 pt-3 dark:border-dark-border dark:bg-dark-bg"
          style={{ paddingBottom: insets.bottom + 12 }}
        >
          {footer}
        </View>
      ) : null}
    </View>
  );
};
