import { Text, View, ScrollView, useWindowDimensions } from "react-native";
import { useMemo } from "react";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { formatDateTime } from "../utils/dateUtils";
import { useTheme } from "../context/ThemeContext";
import { useInjectionContext } from "../context/InjectionContext";

interface LogEntry {
  day: string;
  hour: string;
  unit: number;
}

export const LogsTimeline = () => {
  const { isDark } = useTheme();
  const { logs } = useInjectionContext();
  const { width } = useWindowDimensions();
  const isCompact = width < 500;

  const entries = useMemo<LogEntry[]>(() => {
    return logs.map((log) => {
      const { day, hour } = formatDateTime(log.date);
      return { day, hour, unit: log.unit };
    });
  }, [logs]);

  const cardBg = isDark ? "#2A2A3C" : "#FFFFFF";
  const textColor = isDark ? "#FFFFFF" : "#1E1E2E";
  const mutedColor = isDark ? "#B8B8C8" : "#8E8EA0";
  const lineColor = isDark ? "#3A3A4C" : "#E8E8F0";
  const dotInactive = isDark ? "#4A4A5C" : "#D4D1FF";

  return (
    <View
      style={{
        backgroundColor: cardBg,
        borderRadius: 24,
        padding: isCompact ? 18 : 24,
        boxShadow: "0 4px 16px rgba(108,99,255,0.08)",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <View
          style={{
            width: 30,
            height: 30,
            borderRadius: 9,
            backgroundColor: "rgba(108,99,255,0.12)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FontAwesome6 name="clipboard-list" size={13} color="#6C63FF" />
        </View>
        <Text style={{ fontSize: 17, fontFamily: "Nunito_700Bold", color: textColor }}>
          Historique
        </Text>
      </View>

      <Text
        style={{
          fontSize: 12,
          fontFamily: "Nunito_400Regular",
          color: mutedColor,
          marginBottom: 14,
          marginLeft: 40,
        }}
      >
        Entrées récentes
      </Text>

      <ScrollView style={{ maxHeight: isCompact ? 260 : 320 }} showsVerticalScrollIndicator={false}>
        {entries.map((entry, index) => {
          const isFirst = index === 0;
          const isLast = index === entries.length - 1;

          return (
            <View key={index} style={{ flexDirection: "row" }}>
              <View style={{ alignItems: "center", width: 18, marginRight: 12 }}>
                <View
                  style={{
                    width: isFirst ? 12 : 8,
                    height: isFirst ? 12 : 8,
                    borderRadius: 6,
                    backgroundColor: isFirst ? "#6C63FF" : dotInactive,
                    marginTop: 5,
                  }}
                />
                {!isLast && (
                  <View
                    style={{
                      flex: 1,
                      width: 2,
                      backgroundColor: lineColor,
                      minHeight: 24,
                      marginTop: 4,
                      marginBottom: 4,
                    }}
                  />
                )}
              </View>

              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderRadius: 14,
                  paddingHorizontal: isCompact ? 12 : 16,
                  paddingVertical: isCompact ? 10 : 12,
                  marginBottom: 6,
                  backgroundColor: isFirst
                    ? isDark
                      ? "rgba(108,99,255,0.1)"
                      : "rgba(108,99,255,0.05)"
                    : "transparent",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: isFirst ? "Nunito_600SemiBold" : "Nunito_400Regular",
                      color: isFirst ? textColor : mutedColor,
                    }}
                  >
                    {entry.day}
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      fontFamily: "Nunito_400Regular",
                      color: isDark ? "#8E8EA0" : "#B8B8C8",
                      marginTop: 1,
                    }}
                  >
                    {entry.hour}
                  </Text>
                </View>

                <View
                  style={{
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    backgroundColor: isFirst ? "#6C63FF" : "rgba(108,99,255,0.1)",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: "Nunito_700Bold",
                      color: isFirst ? "#FFFFFF" : "#6C63FF",
                    }}
                  >
                    {entry.unit.toFixed(1)} ml
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};
