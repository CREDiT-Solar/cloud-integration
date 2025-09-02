import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  House,
  ChartColumn,
  History,
  Settings,
  User,
  SlidersVertical,
  Landmark,
  CloudAlert,
  Users,
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

const navItems = [
  { id: "Home", icon: House, label: "Home" },
  { id: "Dashboard", icon: ChartColumn, label: "Dashboard" },
  { id: "History", icon: History, label: "History" },
  { id: "Settings", icon: Settings, label: "Settings" },
  { id: "Account", icon: User, label: "Account" },
  { id: "Control", icon: SlidersVertical, label: "Digi Control Hub" },
  { id: "Finance", icon: Landmark, label: "Finance" },
  { id: "Fault", icon: CloudAlert, label: "Fault Monitoring" },
  { id: "User", icon: Users, label: "User Dashboard" },
];


export default function BottomNavi({ currentPage }: { currentPage: string }) {
    const navigation = useNavigation<any>();
  return (
    <View style={styles.container}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPage === item.id;

        return (
          <TouchableOpacity
            key={item.id}
            onPress={() => navigation.navigate(item.id)}
            style={styles.button}
            activeOpacity={0.7}
          >
            <Icon
              size={24}
              color={isActive ? "#16a34a" : "#9ca3af"}
              style={{ marginBottom: 2 }}
            />
            <Text
              style={[
                styles.label,
                { color: isActive ? "#16a34a" : "#9ca3af" },
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb", 
    backgroundColor: "#ffffff", 
    paddingVertical: 8,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
  },
});