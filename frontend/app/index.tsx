import { useState } from "react";
import { Text, View, ScrollView, Pressable, Platform, useWindowDimensions } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { NextInjection } from "./components/NextInjection";
import { LogsTimeline } from "./components/LogsTimeline";
import { FoodInfo } from "./components/FoodInfo";
import { useTheme } from "./context/ThemeContext";
import { calculateAge } from "./utils/dateUtils";
import type { Cat } from "../types/Cat";

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

const Home = () => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { isDark, toggleTheme } = useTheme();
  const isWeb = Platform.OS === "web";
  const isCompact = width < 500;

  const [foodPerRation, setFoodPerRation] = useState<number | undefined>(150);
  const [foodName, setFoodName] = useState<string | undefined>("Hills Urinary");

  const cat: Cat = {
    id: "1",
    name: "Minou",
    breed: "Persan",
    color: "#FF6B9D",
    weight: 4.5,
    imageUrl: undefined,
    dateOfBirth: "2020-05-15",
  };

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#1E1E2E" : "#F8F9FE" }}>
      <ScrollView
        style={{ flex: 1, paddingTop: insets.top }}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <HeroHeader cat={cat} isDark={isDark} toggleTheme={toggleTheme} />

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
            <View style={{ flex: 1, gap: 14 }}>
              <NextInjection />
              <FoodInfo
                weight={cat.weight}
                foodPerRation={foodPerRation}
                foodName={foodName}
                onUpdate={(data) => {
                  if (data.foodPerRation !== undefined) setFoodPerRation(data.foodPerRation);
                  if (data.foodName !== undefined) setFoodName(data.foodName);
                }}
              />
            </View>
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
