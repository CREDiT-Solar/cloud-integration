import React from "react";
import { View, Text, StyleSheet } from "react-native";

export interface NameValueProps {
    title: string;
    value: string | (() => string);
    units?: string;
}

const NameValueLine: React.FC<NameValueProps> = ({ title, value, units }) => {
  const displayValue = typeof value === "function" ? value() : value;
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}: </Text>
      <Text style={styles.value}>{displayValue}</Text>
      {units && <Text style={styles.units}>{units}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", marginBottom: 2 },
  title: { fontWeight: "bold", marginRight: 4 },
  value: { fontWeight: "500", fontSize: 15 },
  units: { marginLeft: 4, color: "#6b7280" },
});

// const NameValueLine: React.FC<NameValueProps> = ({ title, value, units }) => {
//     const displayValue = typeof value === "function" ? value() : value;
//     return (
//         <div>
//             <div>
//                 <h3>{title}</h3>
//             </div>
//             <div>{displayValue}</div>
//             {units && <div>{units}</div>}
//         </div>
//     );
// };

export default NameValueLine;
