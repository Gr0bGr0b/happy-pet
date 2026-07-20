import { Text, View, Pressable, Modal, TextInput, useWindowDimensions } from "react-native";
import { useState, useEffect } from "react";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useTheme } from "../context/ThemeContext";

export interface EditField {
  key: string;
  label: string;
  type: "text" | "number";
  currentValue: string;
  presets?: { label: string; value: string }[];
  unit?: string;
}

interface EditValueModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (values: Record<string, string>) => void;
  title: string;
  fields: EditField[];
  accentColor: string;
}

export const EditValueModal = ({
  visible,
  onClose,
  onSave,
  title,
  fields,
  accentColor,
}: EditValueModalProps) => {
  const { isDark } = useTheme();
  const { width } = useWindowDimensions();
  const isCompact = width < 500;

  const [values, setValues] = useState<Record<string, string>>({});
  const [selectedPresets, setSelectedPresets] = useState<Record<string, string | null>>({});

  useEffect(() => {
    if (visible) {
      const initial: Record<string, string> = {};
      const presetsState: Record<string, string | null> = {};
      for (const field of fields) {
        initial[field.key] = field.currentValue;
        presetsState[field.key] =
          field.presets?.find((p) => p.value === field.currentValue)?.value ?? null;
      }
      setValues(initial);
      setSelectedPresets(presetsState);
    }
  }, [visible, fields]);

  const cardBg = isDark ? "#2A2A3C" : "#FFFFFF";
  const textColor = isDark ? "#FFFFFF" : "#1E1E2E";
  const mutedColor = isDark ? "#B8B8C8" : "#8E8EA0";
  const borderColor = isDark ? "#3A3A4C" : "#E8E8F0";
  const inputBg = isDark ? "rgba(42,42,60,0.5)" : "#F8F9FE";

  const handlePresetPress = (fieldKey: string, value: string) => {
    setSelectedPresets((prev) => ({ ...prev, [fieldKey]: value }));
    setValues((prev) => ({ ...prev, [fieldKey]: value }));
  };

  const handleInputChange = (fieldKey: string, text: string) => {
    setValues((prev) => ({ ...prev, [fieldKey]: text }));
    setSelectedPresets((prev) => ({ ...prev, [fieldKey]: null }));
  };

  const handleSave = () => {
    onSave(values);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
        onPress={onClose}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            width: "100%",
            maxWidth: 380,
            backgroundColor: cardBg,
            borderRadius: 24,
            padding: isCompact ? 20 : 24,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <Text style={{ fontSize: 17, fontFamily: "Nunito_700Bold", color: textColor, flex: 1 }}>
              {title}
            </Text>
            <Pressable
              onPress={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: inputBg,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FontAwesome6 name="xmark" size={14} color={mutedColor} />
            </Pressable>
          </View>

          {fields.map((field, index) => (
            <View key={field.key} style={{ marginBottom: index < fields.length - 1 ? 20 : 0 }}>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: "Nunito_600SemiBold",
                  color: mutedColor,
                  marginBottom: 8,
                }}
              >
                {field.label}
              </Text>

              {field.presets && field.presets.length > 0 && (
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                  {field.presets.map((preset) => {
                    const isSelected = selectedPresets[field.key] === preset.value;
                    return (
                      <Pressable
                        key={preset.value}
                        onPress={() => handlePresetPress(field.key, preset.value)}
                        style={{
                          paddingHorizontal: 16,
                          paddingVertical: 10,
                          borderRadius: 12,
                          backgroundColor: isSelected ? accentColor : inputBg,
                          borderWidth: 1.5,
                          borderColor: isSelected ? accentColor : borderColor,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            fontFamily: isSelected ? "Nunito_700Bold" : "Nunito_600SemiBold",
                            color: isSelected ? "#FFFFFF" : textColor,
                          }}
                        >
                          {preset.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              )}

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: inputBg,
                  borderRadius: 14,
                  borderWidth: 1.5,
                  borderColor: borderColor,
                  paddingHorizontal: 14,
                }}
              >
                <TextInput
                  value={values[field.key] ?? ""}
                  onChangeText={(text) => handleInputChange(field.key, text)}
                  placeholder="Valeur personnalisée"
                  placeholderTextColor={mutedColor}
                  style={{
                    flex: 1,
                    fontSize: 16,
                    fontFamily: "Nunito_600SemiBold",
                    color: textColor,
                    paddingVertical: 14,
                  }}
                  keyboardType={field.type === "number" ? "numeric" : "default"}
                  autoCapitalize="none"
                />
                {field.unit && (
                  <Text style={{ fontSize: 14, fontFamily: "Nunito_400Regular", color: mutedColor, marginLeft: 8 }}>
                    {field.unit}
                  </Text>
                )}
              </View>
            </View>
          ))}

          <Pressable
            onPress={handleSave}
            style={{
              backgroundColor: accentColor,
              borderRadius: 14,
              paddingVertical: 14,
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <Text style={{ fontSize: 15, fontFamily: "Nunito_700Bold", color: "#FFFFFF" }}>
              Enregistrer
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
