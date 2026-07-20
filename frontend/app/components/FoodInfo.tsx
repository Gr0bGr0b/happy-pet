import { Text, View, Pressable, useWindowDimensions } from "react-native";
import { useState } from "react";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useTheme } from "../context/ThemeContext";
import { EditValueModal, type EditField } from "./EditValueModal";

interface FoodInfoProps {
  weight: number;
  foodPerRation?: number;
  foodName?: string;
  onUpdate: (data: { foodPerRation?: number; foodName?: string }) => void;
}

const FOOD_GRAM_PRESETS = [
  { label: "50g", value: "50" },
  { label: "100g", value: "100" },
  { label: "150g", value: "150" },
  { label: "200g", value: "200" },
];

export const FoodInfo = ({ weight, foodPerRation, foodName, onUpdate }: FoodInfoProps) => {
  const { isDark } = useTheme();
  const { width } = useWindowDimensions();
  const isCompact = width < 500;

  const [modalVisible, setModalVisible] = useState(false);

  const cardBg = isDark ? "#2A2A3C" : "#FFFFFF";
  const textColor = isDark ? "#FFFFFF" : "#1E1E2E";
  const mutedColor = isDark ? "#B8B8C8" : "#8E8EA0";
  const accentColor = "#FF9F43";

  const gramsText = foodPerRation?.toString() ?? "—";
  const nameText = foodName || "Non renseigné";

  const fields: EditField[] = [
    {
      key: "foodPerRation",
      label: "Grammes par repas",
      type: "number",
      currentValue: foodPerRation?.toString() ?? "",
      presets: FOOD_GRAM_PRESETS,
      unit: "g",
    },
    {
      key: "foodName",
      label: "Nom des croquettes",
      type: "text",
      currentValue: foodName ?? "",
    },
  ];

  const handleSave = (values: Record<string, string>) => {
    const grams = parseInt(values.foodPerRation, 10);
    const name = values.foodName?.trim();

    onUpdate({
      foodPerRation: !isNaN(grams) && grams > 0 ? grams : undefined,
      foodName: name || undefined,
    });
  };

  return (
    <>
      <View
        style={{
          backgroundColor: cardBg,
          borderRadius: 24,
          padding: isCompact ? 18 : 24,
          boxShadow: "0 4px 16px rgba(255,159,67,0.08)",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: isCompact ? 14 : 18 }}>
          <View
            style={{
              width: 30,
              height: 30,
              borderRadius: 9,
              backgroundColor: "rgba(255,159,67,0.12)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FontAwesome6 name="bowl-food" size={13} color={accentColor} />
          </View>
          <Text style={{ fontSize: 17, fontFamily: "Nunito_700Bold", color: textColor, flex: 1 }}>
            Nourriture
          </Text>
          <Pressable
            onPress={() => setModalVisible(true)}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: "rgba(255,159,67,0.1)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FontAwesome6 name="pen" size={12} color={accentColor} />
          </Pressable>
        </View>

        <View
          style={{
            alignItems: "center",
            paddingVertical: 12,
            marginBottom: 10,
            borderRadius: 14,
            backgroundColor: isDark ? "rgba(42,42,60,0.5)" : "#F8F9FE",
          }}
        >
          <Text
            style={{
              fontSize: 36,
              fontFamily: "Nunito_800ExtraBold",
              color: textColor,
            }}
          >
            {gramsText}
          </Text>
          <Text style={{ fontSize: 12, fontFamily: "Nunito_400Regular", color: mutedColor, marginTop: 1 }}>
            g par repas
          </Text>
        </View>

        <View style={{ alignItems: "center", marginBottom: 14 }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Nunito_600SemiBold",
              color: foodName ? textColor : mutedColor,
              fontStyle: foodName ? "normal" : "italic",
            }}
          >
            {nameText}
          </Text>
        </View>

        <Text
          style={{
            fontSize: 12,
            fontFamily: "Nunito_400Regular",
            color: mutedColor,
            textAlign: "center",
          }}
        >
          Poids du chat : {weight} kg
        </Text>
      </View>

      <EditValueModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
        title="Modifier la nourriture"
        fields={fields}
        accentColor={accentColor}
      />
    </>
  );
};
