import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Sun, Moon, Bell, CloudSun } from "lucide-react-native";

interface HeaderProps {
  userName?: string;
}

export default function Header({
  userName = "Guest",
}: HeaderProps) {
  const [isDark, setIsDark] = useState(false);

  const handleThemeToggle = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      <View style={styles.leftBlock}>
        <Sun color="#16a34a" size={28} style={{ marginRight: 8 }} />
        <Text style={[styles.title, isDark && styles.darkText]}>Solar Energy System</Text>
      </View>

      <View style={styles.centerBlock}>
        <CloudSun color="#fbbf24" size={22} style={{ marginRight: 5 }} />
        <Text style={[styles.weatherText, isDark && styles.darkText]}>
          Sunny, 30°C
        </Text>
      </View>

      <View style={styles.rightBlock}>
        <TouchableOpacity onPress={handleThemeToggle}>
          {isDark ? (
            <Sun color="#fcd34d" size={22} />
          ) : (
            <Moon color="#0a0a0aff" size={22} />
          )}
        </TouchableOpacity>
        <Bell color={isDark ? "#fff" : "#111"} size={22} style={{ marginLeft: 13 }} />
        <Text style={styles.sIcon}>G</Text>
        <Text style={[styles.userName, isDark && styles.darkText]}>{userName}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", 
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 11,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  darkContainer: {
    backgroundColor: "#1f2937",
    borderBottomColor: "#374151",
  },
  leftBlock: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
  },
  centerBlock: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1, 
  },
  weatherText: {
    fontSize: 15,
    color: "#666",
    fontWeight: "500",
  },
  rightBlock: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  sIcon: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0d0d0eff",
    marginLeft: 11,
    marginRight: 2,
  },
  userName: {
    fontSize: 15,
    color: "#666",
    marginLeft: 6,
  },
  darkText: {
    color: "#f3f4f6",
  },
});