import React from "react";
import { View, StyleSheet } from "react-native";
import Readout, { ReadoutProps } from "./Readout";

export default function CardReadout(props: ReadoutProps) {
  return (
    <View style={styles.card}>
      <Readout {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 6,
    marginVertical: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { 
        width: 0, 
        height: 1 
    },
    elevation: 2,
    minWidth: 140, 
    flex: 1,       
  },
});