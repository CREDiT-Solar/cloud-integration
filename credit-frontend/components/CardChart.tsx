import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface CardChartProps {
  title: string;
  children: React.ReactNode;
}

export default function CardChart({ title, children }: CardChartProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    width: "100%",
    minHeight: 400, 
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#111",
    textAlign: "left", 
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

