import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "./AuthContext";

import HomeScreen from "../screens/HomeScreen";
import DashboardScreen from "../screens/DashboardScreen";
import HistoryScreen from "../screens/HistoryScreen";
import SettingsScreen from "../screens/SettingsScreen";
import AccountScreen from "../screens/AccountScreen";
import ControlScreen from "../screens/ControlScreen";
import FinanceScreen from "../screens/FinanceScreen";
import FaultScreen from "../screens/FaultScreen";
import UserScreen from "../screens/UserScreen";
import ContactScreen from "../screens/ContactScreen";
import MainScreen from "../screens/LandingScreen";

const Stack = createNativeStackNavigator();

export default function MainAppNavigator() {
  const { userType } = useAuth();

  const initialRoute =
    userType === "User" ? "User" :
    userType === "Finance Manager" ? "Finance" :
    "Home";

  return (
    <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Account" component={AccountScreen} />
      <Stack.Screen name="Control" component={ControlScreen} />
      <Stack.Screen name="Finance" component={FinanceScreen} />
      <Stack.Screen name="Fault" component={FaultScreen} />
      <Stack.Screen name="User" component={UserScreen} />
      <Stack.Screen name="Main" component={MainScreen} />
      <Stack.Screen name="Contact" component={ContactScreen}/>
    </Stack.Navigator>
  );
}
