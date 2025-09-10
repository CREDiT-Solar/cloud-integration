import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {House, ChartColumn, History, Settings, User, SlidersVertical, Landmark, CloudAlert, Users} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "./AuthContext";

const allNavItems = {
  Home: { icon: House, label: "Home" },
  Dashboard: { icon: ChartColumn, label: "Dashboard" },
  History: { icon: History, label: "History" },
  Settings: { icon: Settings, label: "Settings" },
  Control: { icon: SlidersVertical, label: "Digi Control Hub" },
  Fault: { icon: CloudAlert, label: "Fault Monitoring" },
  Finance: { icon: Landmark, label: "Finance" },
  User: { icon: Users, label: "User Dashboard" },
  Account: { icon: User, label: "Account" },
};

const roleNavMap: Record<string, (keyof typeof allNavItems)[]> = {
  "User": ["User", "Account"],
  "Admin": ["Home", "Dashboard", "History", "Settings", "Control", "Fault", "Finance", "User", "Account"],
  "Technician": ["Home", "Dashboard", "History", "Control", "Fault","Account"],
  "Site Manager": ["Home", "Dashboard", "History", "Control", "Fault", "Account"],
  "Site Owner": ["Home", "Dashboard", "History", "Settings", "Control", "Fault", "Finance", "User", "Account"],
  "Finance Manager": ["Finance", "Account"],
};

export default function BottomNavi({ currentPage }: { currentPage: string }) {
  const navigation = useNavigation<any>();
  const { userType } = useAuth(); 

  const availableNavItems = roleNavMap[userType || "User"];

  return (
    <View style={styles.container}>
      {availableNavItems.map((key) => {
        const item = allNavItems[key];
        const Icon = item.icon;
        const isActive = currentPage === key;

        return (
          <TouchableOpacity
            key={key}
            onPress={() => navigation.navigate(key)}
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
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  button: { 
    alignItems: "center" 
  },
  label: { 
    fontSize: 12, 
    marginTop: 2 
  },
});
