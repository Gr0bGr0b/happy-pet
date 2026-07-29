import { useState } from "react";
import { Text, View, ScrollView, Pressable, Platform, useWindowDimensions, ActivityIndicator } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { NextInjection } from "./components/NextInjection";
import { LogsTimeline } from "./components/LogsTimeline";
import { FoodInfo } from "./components/FoodInfo";
import { useTheme } from "./context/ThemeContext";
import { calculateAge } from "./utils/dateUtils";
import { useCat } from "./hooks/useCat";
import type { Cat } from "../types/Cat";

// ─── Hero header: cat identity card ────────────────────────────────────────
// Displays the cat's name, breed, age, weight, colour, plus theme/user icons.
const HeroHeader = ({
  cat,
  isDark,
  toggleTheme,
}: {
  cat: Cat;
  isDark: boolean;
  toggleTheme: () => void;
}) => {
  const age = calculateAge(cat.dateOfBirth);

  return (
    <View
      style={{
        backgroundColor: isDark ? "#3A2D6B" : "#6C63FF",
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 24,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <Pressable
          onPress={toggleTheme}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: "rgba(255,255,255,0.15)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FontAwesome6 name={isDark ? "sun" : "moon"} size={15} color="#fff" />
        </Pressable>
        <View
          style={{
            width: 34,
            height: 34,
            borderRadius: 17,
            backgroundColor: "rgba(255,255,255,0.2)",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 2,
            borderColor: "rgba(255,255,255,0.35)",
          }}
        >
          <FontAwesome6 name="user" size={12} color="#fff" />
        </View>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 16 }}>
        <View
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: "rgba(255,255,255,0.2)",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 2,
            borderColor: "rgba(255,255,255,0.35)",
          }}
        >
          <FontAwesome6 name="cat" size={26} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 26, fontFamily: "Nunito_800ExtraBold", color: "#fff" }}>
            {cat.name}
          </Text>
          <Text style={{ fontSize: 13, fontFamily: "Nunito_400Regular", color: "rgba(255,255,255,0.7)", marginTop: 1 }}>
            {cat.breed}
          </Text>
        </View>
      </View>

      {/* Badge row: age, weight, colour */}
      <View style={{ flexDirection: "row", gap: 8 }}>
        {[
          { icon: "cake-candles" as const, label: `${age} yrs`, iconColor: "#FFD980" },
          { icon: "weight-hanging" as const, label: `${cat.weight} kg`, iconColor: "#7EFAE0" },
          { icon: "paw" as const, label: cat.color, iconColor: "#FFB3D0" },
        ].map((badge, i) => (
          <View
            key={i}
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              backgroundColor: "rgba(255,255,255,0.15)",
              borderRadius: 12,
              paddingHorizontal: 8,
              paddingVertical: 8,
            }}
          >
            <FontAwesome6 name={badge.icon} size={11} color={badge.iconColor} />
            <Text style={{ fontSize: 11, fontFamily: "Nunito_600SemiBold", color: "#fff" }}>
              {badge.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// ─── Home screen ───────────────────────────────────────────────────────────
// Orchestrates data fetching, loading/error states, and the main layout.
const Home = () => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { isDark, toggleTheme } = useTheme();
  const isWeb = Platform.OS === "web";
  const isCompact = width < 500;

  // Fetch the single cat from the API on mount.
  const { cat, loading, error, refetch } = useCat();

  // Editable food info – starts undefined and falls back to the API value
  // so user edits survive re-fetches.
  const [foodPerRation, setFoodPerRation] = useState<number | undefined>();
  const [foodName, setFoodName] = useState<string | undefined>();

  const effectiveFoodPerRation = foodPerRation ?? cat?.foodPerRation;
  const effectiveFoodName = foodName ?? cat?.foodName;

  // ── Loading state ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: isDark ? "#1E1E2E" : "#F8F9FE", paddingTop: insets.top }}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────
  if (error || !cat) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: isDark ? "#1E1E2E" : "#F8F9FE", paddingTop: insets.top }}>
        <Text style={{ color: isDark ? "#fff" : "#333", fontSize: 16, fontFamily: "Nunito_600SemiBold", textAlign: "center", marginBottom: 12, paddingHorizontal: 24 }}>
          {error ?? "Cat not found"}
        </Text>
        <Pressable
          onPress={refetch}
          style={{
            backgroundColor: "#6C63FF",
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: "#fff", fontFamily: "Nunito_700Bold", fontSize: 14 }}>Réessayer</Text>
        </Pressable>
      </View>
    );
  }

  // ── Success layout ─────────────────────────────────────────────────────
  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#1E1E2E" : "#F8F9FE" }}>
      <ScrollView
        style={{ flex: 1, paddingTop: insets.top }}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <HeroHeader cat={cat} isDark={isDark} toggleTheme={toggleTheme} />

        {/* Content area – side-by-side on wide web, stacked on mobile */}
        <View
          style={{
            paddingHorizontal: isCompact ? 14 : 20,
            paddingTop: 16,
            maxWidth: isWeb ? 900 : undefined,
            alignSelf: isWeb ? "center" : undefined,
            width: isWeb ? "100%" : undefined,
          }}
        >
          <View
            style={{
              flexDirection: isWeb && !isCompact ? "row" : "column",
              gap: 14,
            }}
          >
            {/* Left column: injection dose + food info */}
            <View style={{ flex: 1, gap: 14 }}>
              <NextInjection />
              <FoodInfo
                weight={cat.weight}
                foodPerRation={effectiveFoodPerRation}
                foodName={effectiveFoodName}
                onUpdate={(data) => {
                  if (data.foodPerRation !== undefined) setFoodPerRation(data.foodPerRation);
                  if (data.foodName !== undefined) setFoodName(data.foodName);
                }}
              />
            </View>
            {/* Right column: injection history timeline */}
            <View style={{ flex: 1 }}>
              <LogsTimeline />
            </View>
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
