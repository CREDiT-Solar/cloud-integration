import React from "react";
import { View, Text, StyleSheet } from "react-native";

export interface TitleProps {
    title: string;
    subtitle?: string;
}

const Title: React.FC<TitleProps> = ({ title, subtitle }) => (
  <View style={styles.root}>
    <Text style={styles.title}>{title}</Text>
    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
  </View>
);

const styles = StyleSheet.create({
  root: { 
    marginBottom: 8 
    },
  title: { 
    fontSize: 18, 
    fontWeight: "bold" 
    },
  subtitle: { 
    fontSize: 14, 
    color: "#6b7280" 
    },
});

export default Title;
