import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useMemo } from "react";
import { formatDateTime } from "../utils/dateUtils";
import type { InjectionLogs } from "../../types/DiabetesInjection";

interface LogsTableProps {
  logs: InjectionLogs[];
}

interface InjectionTableRow {
  day: string;
  hour: string;
  unit: number;
}

export const LogsTable = ({ logs }: LogsTableProps) => {
  const injections = useMemo<InjectionTableRow[]>(() => {
    return logs.map((log) => {
      const { day, hour } = formatDateTime(log.date);
      return {
        day,
        hour,
        unit: log.unit,
      };
    });
  }, [logs]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Logs</Text>
      </View>

      <Text style={styles.subtitle}>Recent diabetes entries</Text>

      <ScrollView style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.cell, styles.headerCell, styles.dayColumn]}>
            Day
          </Text>
          <Text style={[styles.cell, styles.headerCell, styles.hourColumn]}>
            Hour
          </Text>
          <Text style={[styles.cell, styles.headerCell, styles.unitColumn]}>
            Unit
          </Text>
        </View>

        {injections.map((injection, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.cell, styles.dayColumn]}>
              {injection.day}
            </Text>
            <Text style={[styles.cell, styles.hourColumn]}>
              {injection.hour}
            </Text>
            <Text style={[styles.cell, styles.unitColumn]}>
              {injection.unit.toFixed(1)}
            </Text>
          </View>
        ))}
      </ScrollView>
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
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
    marginBottom: 12,
  },
  tableContainer: {
    maxHeight: 300,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 2,
    borderBottomColor: "#ddd",
    paddingVertical: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 12,
  },
  cell: {
    fontSize: 13,
    color: "#333",
  },
  headerCell: {
    fontWeight: "600",
    color: "#666",
  },
  dayColumn: {
    flex: 1,
  },
  hourColumn: {
    flex: 1,
  },
  unitColumn: {
    flex: 1,
    textAlign: "right",
  },
});
