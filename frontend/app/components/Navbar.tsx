import { StyleSheet, Text, View, Pressable } from "react-native";
import { useState } from "react";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const backgroundColor = isDarkMode ? "#1a1a1a" : "#fff";
  const textColor = isDarkMode ? "#fff" : "#000";

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.logoContainer}>
        <FontAwesome6 name="cat" size={24} color={textColor} />
        <Text style={[styles.appName, { color: textColor }]}>Toneko</Text>
      </View>

      <View style={styles.endContainer}>
        <Pressable
          onPress={toggleDarkMode}
          style={({ pressed }) => [
            styles.iconButton,
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <FontAwesome6
            name={isDarkMode ? "sun" : "moon"}
            size={20}
            color={textColor}
          />
        </Pressable>

        <Text style={[styles.userName, { color: textColor }]}>USER</Text>

        <View style={styles.avatarContainer}>
          <FontAwesome6 name="user-circle" size={32} color={textColor} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  appName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  endContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconButton: {
    padding: 8,
  },
  userName: {
    fontSize: 14,
    fontWeight: "600",
  },
  avatarContainer: {
    padding: 4,
  },
});
