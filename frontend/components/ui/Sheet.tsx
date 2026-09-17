import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

/**
 * Bottom sheet on RN's built-in Modal.
 *
 * Deliberately not @gorhom/bottom-sheet: that would need Reanimated-4 compatibility
 * validation and GestureHandlerRootView plumbing for a component this small, and it
 * must work on web too.
 */
export const Sheet = ({ visible, onClose, title, children }: Props) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable
        className="flex-1 justify-end"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        onPress={onClose}
        accessibilityLabel="Fermer"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View
              className="rounded-t-3xl bg-light-card px-5 pt-3 dark:bg-dark-card"
              style={{ paddingBottom: insets.bottom + 20 }}
            >
              <View className="mb-4 h-1 w-10 self-center rounded-full bg-light-border dark:bg-dark-border" />
              <View className="mb-5 flex-row items-center">
                <Text className="flex-1 font-nunito-bold text-[18px] text-dark-bg dark:text-white">
                  {title}
                </Text>
                <Pressable
                  onPress={onClose}
                  accessibilityRole="button"
                  accessibilityLabel="Fermer"
                  className="h-11 w-11 items-center justify-center rounded-full"
                  hitSlop={6}
                >
                  <FontAwesome6 name="xmark" size={18} color="#8E8EA0" />
                </Pressable>
              </View>
              {children}
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
};
