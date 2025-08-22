import React from "react";
import { View, Text, StyleSheet } from "react-native";

type InfoField = {
  label: string;
  value: string | number;
  unit?: string;
  highlight?: boolean; 
};

type StatusCardProps = {
  title: string;
  icon?: React.ReactNode;    
  fields: InfoField[];       
  footerLabel?: string;       
  footerHighlight?: boolean;  
};

const StatusCard: React.FC<StatusCardProps> = ({
  title,
  icon,
  fields,
  footerLabel,
  footerHighlight = false,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
      </View>

      <View style={styles.fields}>
        {fields.map(({ label, value, unit, highlight }, index) => (
          <View key={index} style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>{label}:</Text>
            <Text
              style={[
                styles.fieldValue,
                highlight ? styles.highlightValue : null,
              ]}
            >
              {value} {unit || ""}
            </Text>
          </View>
        ))}
      </View>

      {footerLabel ? (
        <View style={styles.footer}>
          <Text style={[styles.footerText, footerHighlight && styles.highlightValue]}>
            {footerLabel}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    margin: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },
  iconContainer: {
    marginLeft: 8,
  },
  fields: {
    marginBottom: 12,
  },
  fieldRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  fieldLabel: {
    fontSize: 14,
    color: "#555",
  },
  fieldValue: {
    fontSize: 14,
    color: "#111",
    fontWeight: "600",
  },
  highlightValue: {
    color: "#22c55e", 
  },
  footer: {
    borderTopColor: "#eee",
    borderTopWidth: 1,
    paddingTop: 8,
  },
  footerText: {
    fontSize: 13,
    color: "#777",
    fontWeight: "600",
  },
});

export default StatusCard;