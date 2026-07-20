import { Text, View, Pressable, useWindowDimensions } from "react-native";
import { useState, useMemo } from "react";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import {
  getTimeUntilNextInjection,
  getNextInjectionTime,
} from "../utils/dateUtils";
import { useTheme } from "../context/ThemeContext";
import { useInjectionContext } from "../context/InjectionContext";

export const NextInjection = () => {
  const [dose, setDose] = useState<number>(3.5);
  const { isDark } = useTheme();
  const { logs, addInjection } = useInjectionContext();
  const { width } = useWindowDimensions();
  const isCompact = width < 500;

  const lastInjectionTime = useMemo(() => {
    if (logs.length === 0) return null;
    return logs[0].date;
  }, [logs]);

  const timeBeforeInjection = useMemo(() => {
    if (!lastInjectionTime) return { hours: 12, minutes: 0 };
    return getTimeUntilNextInjection(lastInjectionTime);
  }, [lastInjectionTime]);

  const isInjectionAllowed = useMemo(() => {
    return timeBeforeInjection.hours >= 12;
  }, [timeBeforeInjection]);

  const nextInjectionTime = useMemo(() => {
    if (!lastInjectionTime) return "N/A";
    return getNextInjectionTime(lastInjectionTime);
  }, [lastInjectionTime]);

  const ringColor = isInjectionAllowed ? "#00D09C" : "#FF6B6B";

  const decreaseUnit = () => setDose((prev) => Math.max(0, prev - 0.1));
  const increaseUnit = () => setDose((prev) => prev + 0.1);

  const handleAddInjection = () => {
    addInjection(dose);
    setDose(3.5);
  };

  const cardBg = isDark ? "#2A2A3C" : "#FFFFFF";
  const textColor = isDark ? "#FFFFFF" : "#1E1E2E";
  const mutedColor = isDark ? "#B8B8C8" : "#8E8EA0";
  const ringSize = isCompact ? 150 : 180;
  const btnSize = isCompact ? 46 : 52;

  return (
    <View
      style={{
        backgroundColor: cardBg,
        borderRadius: 24,
        padding: isCompact ? 18 : 24,
        boxShadow: "0 4px 16px rgba(108,99,255,0.08)",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: isCompact ? 16 : 20 }}>
        <View
          style={{
            width: 30,
            height: 30,
            borderRadius: 9,
            backgroundColor: "rgba(255,107,107,0.12)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FontAwesome6 name="syringe" size={13} color="#FF6B6B" />
        </View>
        <Text style={{ fontSize: 17, fontFamily: "Nunito_700Bold", color: textColor }}>
          Prochaine Injection
        </Text>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: isCompact ? 14 : 20, marginBottom: isCompact ? 16 : 20 }}>
        <Pressable
          onPress={decreaseUnit}
          style={{
            width: btnSize,
            height: btnSize,
            borderRadius: btnSize / 2,
            backgroundColor: "rgba(108,99,255,0.1)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FontAwesome6 name="minus" size={18} color="#6C63FF" />
        </Pressable>

        <View
          style={{
            width: ringSize,
            height: ringSize,
            borderRadius: ringSize / 2,
            borderWidth: 10,
            borderColor: ringColor,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: isDark ? "rgba(42,42,60,0.5)" : "#F8F9FE",
          }}
        >
          <Text style={{ fontSize: isCompact ? 38 : 44, fontFamily: "Nunito_800ExtraBold", color: textColor }}>
            {dose.toFixed(1)}
          </Text>
          <Text style={{ fontSize: 13, fontFamily: "Nunito_400Regular", color: mutedColor, marginTop: 1 }}>
            ml
          </Text>
        </View>

        <Pressable
          onPress={increaseUnit}
          style={{
            width: btnSize,
            height: btnSize,
            borderRadius: btnSize / 2,
            backgroundColor: "rgba(108,99,255,0.1)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FontAwesome6 name="plus" size={18} color="#6C63FF" />
        </Pressable>
      </View>

      <Pressable
        style={{
          paddingVertical: isCompact ? 13 : 16,
          borderRadius: 16,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: 8,
          backgroundColor: isInjectionAllowed ? "#6C63FF" : "#FF6B6B",
          boxShadow: `0 4px 12px ${isInjectionAllowed ? "rgba(108,99,255,0.4)" : "rgba(255,107,107,0.35)"}`,
          opacity: !isInjectionAllowed || !dose ? 0.5 : 1,
        }}
        onPress={handleAddInjection}
        disabled={!isInjectionAllowed || !dose}
      >
        <FontAwesome6 name="syringe" size={15} color="#fff" />
        <Text style={{ color: "#fff", fontFamily: "Nunito_700Bold", fontSize: isCompact ? 14 : 16 }}>
          Nouvelle Injection
        </Text>
      </Pressable>

      <View style={{ alignItems: "center", marginTop: 12 }}>
        {isInjectionAllowed ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              backgroundColor: "rgba(0,208,156,0.1)",
              borderRadius: 999,
              paddingHorizontal: 14,
              paddingVertical: 7,
            }}
          >
            <FontAwesome6 name="check-circle" size={12} color="#00D09C" />
            <Text style={{ color: "#00D09C", fontFamily: "Nunito_600SemiBold", fontSize: 13 }}>
              Vous pouvez injecter !
            </Text>
          </View>
        ) : (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              backgroundColor: "rgba(255,184,77,0.1)",
              borderRadius: 999,
              paddingHorizontal: 14,
              paddingVertical: 7,
            }}
          >
            <FontAwesome6 name="clock" size={12} color="#FFB84D" />
            <Text style={{ color: "#FFB84D", fontFamily: "Nunito_600SemiBold", fontSize: 13 }}>
              Prochaine à {nextInjectionTime}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};
