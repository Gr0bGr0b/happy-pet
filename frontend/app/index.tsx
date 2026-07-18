import { StyleSheet, View, ScrollView } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { Navbar } from "./components/Navbar";
import { Info } from "./components/Info";
import { NextInjection } from "./components/NextInjection";
import { LogsTable } from "./components/LogsTable";
import type { Cat } from "../types/Cat";
import type { InjectionLogs } from "../types/DiabetesInjection";

const Home = () => {
  const insets = useSafeAreaInsets();

  const cat: Cat = {
    id: "1",
    name: "Minou",
    breed: "Persan",
    color: "#FF6B6B",
    weight: 4.5,
    imageUrl: undefined,
    dateOfBirth: "2020-05-15",
  };

  const logs: InjectionLogs[] = [
    { date: "2025-12-15T13:07:04.054", unit: 3.5 },
    { date: "2025-12-15T13:07:04.054", unit: 3.5 },
    { date: "2025-12-15T13:07:04.054", unit: 3.5 },
    { date: "2025-12-15T13:07:04.054", unit: 3.5 },
    { date: "2025-12-15T13:07:04.054", unit: 3.5 },
    { date: "2025-12-15T13:07:04.054", unit: 3.5 },
  ];

  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView
        style={[styles.content, { paddingTop: insets.top }]}
        contentContainerStyle={styles.contentContainer}
      >
        <Info cat={cat} />
        <View style={styles.gridContainer}>
          <View style={styles.gridItem}>
            <NextInjection logs={logs} />
          </View>
          <View style={styles.gridItem}>
            <LogsTable logs={logs} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <Home />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
  },
  gridContainer: {
    gap: 16,
  },
  gridItem: {
    flex: 1,
  },
});