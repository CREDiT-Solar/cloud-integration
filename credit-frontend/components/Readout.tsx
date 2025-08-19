
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export interface ReadoutProps {
  title: string;
  value: string | (() => string);
  units?: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

const Readout: React.FC<ReadoutProps> = ({
  title,
  value,
  units,
  subtitle,
  icon,
}) => {
  const displayValue = typeof value === "function" ? value() : value;

  return (
    <View style={styles.container}>

      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.valueRow}>
          <Text style={styles.value}>{displayValue}</Text>
          {units && <Text style={styles.units}> {units}</Text>}
        </View>

        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      {icon && <View style={styles.iconContainer}>{icon}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  textContainer: {
    flex: 1,
    flexDirection: "column",
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 2,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  value: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111",
  },
  units: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#111",
  },
  subtitle: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  },
  iconContainer: {
    width: 50,
    justifyContent: "center",
    alignItems: "flex-end", 
  },
});

export default Readout;

