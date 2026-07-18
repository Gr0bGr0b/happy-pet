import { StyleSheet, Text, View } from "react-native";
import { calculateAge } from "../utils/dateUtils";
import type { Cat } from "../../types/Cat";

interface InfoProps {
  cat: Cat;
}

export const Info = ({ cat }: InfoProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.name}>{cat.name}</Text>
          <View style={styles.details}>
            <View style={styles.detailItem}>
              <Text style={styles.label}>Age</Text>
              <Text style={styles.value}>{calculateAge(cat.dateOfBirth)} years</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.label}>Breed</Text>
              <Text style={styles.value}>{cat.breed}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.label}>Weight</Text>
              <Text style={styles.value}>{cat.weight} kg</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.label}>Color</Text>
              <Text style={styles.value}>{cat.color}</Text>
            </View>
          </View>
        </View>
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
  content: {
    flexDirection: "row",
    gap: 16,
  },
  textContainer: {
    flex: 1,
    gap: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  details: {
    gap: 8,
  },
  detailItem: {
    gap: 4,
  },
  label: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  value: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
});
