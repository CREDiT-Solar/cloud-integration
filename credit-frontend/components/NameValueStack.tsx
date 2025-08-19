// Component to display a series of name-value pairs
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export interface NameValueGroupProps {
  title: string;
  children: React.ReactNode;
}

const NameValueStack: React.FC<NameValueGroupProps> = ({ title, children }) => (
  <View style={styles.group}>
    <Text style={styles.groupTitle}>{title}</Text>
    <View>{children}</View>
  </View>
);

const styles = StyleSheet.create({
  group: { 
    marginBottom: 16 
    },
  groupTitle: { 
    fontWeight: "bold", 
    fontSize: 16, 
    marginBottom: 4 
    },
});

export default NameValueStack;
