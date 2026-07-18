import { StyleSheet, Text, View, TextInput, Pressable, Alert } from "react-native";
import { useState, useMemo } from "react";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { getTimeUntilNextInjection, getNextInjectionTime } from "../utils/dateUtils";
import type { InjectionLogs } from "../../types/DiabetesInjection";

interface NextInjectionProps {
  logs: InjectionLogs[];
}

export const NextInjection = ({ logs }: NextInjectionProps) => {
  const [dose, setDose] = useState<number>(3.5);

  const lastInjectionTime = useMemo(() => {
    if (logs.length === 0) return null;
    return logs[0].date;
  }, [logs]);

  const timeBeforeInjection = useMemo(() => {
    if (!lastInjectionTime) return { hours: 0, minutes: 0 };
    return getTimeUntilNextInjection(lastInjectionTime);
  }, [lastInjectionTime]);

  const isInjectionAllowed = useMemo(() => {
    return timeBeforeInjection.hours >= 12;
  }, [timeBeforeInjection]);

  const nextInjectionTime = useMemo(() => {
    if (!lastInjectionTime) return "N/A";
    return getNextInjectionTime(lastInjectionTime);
  }, [lastInjectionTime]);

  const decreaseUnit = () => {
    setDose((prev) => Math.max(0, prev - 0.1));
  };

  const increaseUnit = () => {
    setDose((prev) => prev + 0.1);
  };

  const addInjection = () => {
    Alert.alert(
      "Injection Added",
      `Added ${dose.toFixed(1)} ml of insulin`,
      [{ text: "OK" }]
    );
    console.log("Adding injection:", dose.toFixed(1));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesome6 name="heart" size={20} color="#dc2626" />
        <Text style={styles.title}>Next Injection</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.doseControl}>
          <Pressable onPress={decreaseUnit} style={styles.button}>
            <FontAwesome6 name="square-minus" size={32} color="#2563eb" />
          </Pressable>

          <TextInput
            style={styles.input}
            value={dose.toFixed(1)}
            editable={false}
          />

          <Pressable onPress={increaseUnit} style={styles.button}>
            <FontAwesome6 name="square-plus" size={32} color="#2563eb" />
          </Pressable>
        </View>

        <Pressable
          style={[
            styles.injectionButton,
            {
              backgroundColor: isInjectionAllowed ? "#16a34a" : "#dc2626",
              opacity: !isInjectionAllowed || !dose ? 0.6 : 1,
            },
          ]}
          onPress={addInjection}
          disabled={!isInjectionAllowed || !dose}
        >
          <Text style={styles.buttonText}>New Injection</Text>
        </Pressable>

        {!isInjectionAllowed ? (
          <Text style={styles.warningText}>
            Next injection at {nextInjectionTime}
          </Text>
        ) : (
          <Text style={styles.successText}>You are good to go!</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  content: {
    gap: 12,
  },
  doseControl: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  button: {
    padding: 4,
  },
  input: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 10,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  injectionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  warningText: {
    textAlign: "center",
    color: "#b45309",
    marginTop: 8,
    fontSize: 14,
  },
  successText: {
    textAlign: "center",
    color: "#16a34a",
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
  },
});
