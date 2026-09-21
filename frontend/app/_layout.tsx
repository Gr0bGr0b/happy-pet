import '../global.css';
import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold
} from '@expo-google-fonts/nunito';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CatProvider } from '@/providers/CatProvider';
import { InjectionProvider } from '@/providers/InjectionProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold
  });

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-light-bg dark:bg-dark-bg">
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    // GestureHandlerRootView was missing entirely; react-native-screens needs it.
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* SafeAreaProvider lifted above the stack so every screen gets insets. */}
      <SafeAreaProvider>
        <ThemeProvider>
          <CatProvider>
            <InjectionProvider>
              <StatusBar style="auto" />
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen
                  name="cat/edit"
                  options={{
                    presentation: 'modal',
                    headerShown: true,
                    title: 'Modifier le profil'
                  }}
                />
              </Stack>
            </InjectionProvider>
          </CatProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
