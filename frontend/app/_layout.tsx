import "../global.css";
import { Stack } from "expo-router";
import { StatusBar, View, ActivityIndicator } from "react-native";
import { useFonts } from "expo-font";
import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from "@expo-google-fonts/nunito";
import { ThemeProvider } from "./context/ThemeContext";
import { InjectionProvider } from "./context/InjectionContext";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <InjectionProvider>
        <StatusBar hidden={true} />
        <Stack screenOptions={{ headerShown: false }} />
      </InjectionProvider>
    </ThemeProvider>
  );
}
