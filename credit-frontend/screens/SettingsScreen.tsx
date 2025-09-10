import React, { useState } from "react";
import { SafeAreaView, View, StyleSheet, Switch, Text, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Title from "../components/Title";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigation } from '@react-navigation/native';
import DropdownMenu from '../components/DropdownMenu';

export default function SettingsScreen() {
  const [theme, setTheme] = useState("Light");
  const navigation = useNavigation();
  const navigateTo = (screen: string) => {
    navigation.navigate(screen as never);
  };
  
  // Notifications
  const [pushNotifications, setPushNotifications] = useState(true);
  const [performanceAlerts, setPerformanceAlerts] = useState(true);
  const [dailyReports, setDailyReports] = useState(false);
  const [lowBatteryAlerts, setLowBatteryAlerts] = useState(true);
  const [systemOfflineAlerts, setSystemOfflineAlerts] = useState(true);

  // Data & Monitoring
  const [refreshInterval, setRefreshInterval] = useState("5 seconds");
  const [autoSync, setAutoSync] = useState(true);

  // Units & Display
  const [energyUnits, setEnergyUnits] = useState("kWh");
  const [powerUnits, setPowerUnits] = useState("kW");

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* <Header userName="Guest" /> */}
        <Header />
      </View>

      {/* Main ScrollView */}
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
        <View style={styles.titleRow}>
        <Title title="Settings" subtitle="Customise your Solar Energy System experience" />
        <DropdownMenu triggerType="icon" navigateTo={navigateTo} />
        </View>
          
          {/* Appearance */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Appearance</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Theme</Text>
              <Picker<string>
                selectedValue={theme}
                onValueChange={(value) => setTheme(value)}
                style={styles.picker}
                itemStyle={{ textAlign: "center" }}
              >
                <Picker.Item label="Light" value="Light" />
                <Picker.Item label="Dark" value="Dark" />
              </Picker>
            </View>
          </View>

          {/* Notifications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            <SettingToggle
              label="Push Notifications"
              value={pushNotifications}
              onValueChange={setPushNotifications}
              description="Receive alerts for system issues"
            />
            <SettingToggle
              label="Performance Alerts"
              value={performanceAlerts}
              onValueChange={setPerformanceAlerts}
              description="Get notified of low performance"
            />
            <SettingToggle
              label="Daily Reports"
              value={dailyReports}
              onValueChange={setDailyReports}
              description="Daily energy production summary"
            />
            <SettingToggle
              label="Low Battery Alerts"
              value={lowBatteryAlerts}
              onValueChange={setLowBatteryAlerts}
              description="Alert when battery is low"
            />
            <SettingToggle
              label="System Offline Alerts"
              value={systemOfflineAlerts}
              onValueChange={setSystemOfflineAlerts}
              description="Alert when system goes offline"
            />
          </View>

          {/* Data & Monitoring */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data & Monitoring</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Data Refresh Interval</Text>
              <Picker
                selectedValue={refreshInterval}
                onValueChange={(value: React.SetStateAction<string>) => setRefreshInterval(value)}
                style={styles.picker}
              >
                <Picker.Item label="5 seconds" value="5 seconds" />
                <Picker.Item label="10 seconds" value="10 seconds" />
                <Picker.Item label="30 seconds" value="30 seconds" />
                <Picker.Item label="1 minute" value="1 minute" />
              </Picker>
            </View>
            <SettingToggle
              label="Auto-sync"
              value={autoSync}
              onValueChange={setAutoSync}
              description="Automatically sync data when app opens"
            />
          </View>

          {/* Units & Display */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Units & Display</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Energy Units</Text>
              <Picker
                selectedValue={energyUnits}
                onValueChange={(value: React.SetStateAction<string>) => setEnergyUnits(value)}
                style={styles.picker}
              >
                <Picker.Item label="kWh" value="kWh" />
                <Picker.Item label="MWh" value="MWh" />
              </Picker>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Power Units</Text>
              <Picker
                selectedValue={powerUnits}
                onValueChange={(value: React.SetStateAction<string>) => setPowerUnits(value)}
                style={styles.picker}
              >
                <Picker.Item label="W" value="W" />
                <Picker.Item label="kW" value="kW" />
              </Picker>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Footer currentPage="Settings" />
      </View>
    </SafeAreaView>
  );
}

type SettingToggleProps = {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
};

const SettingToggle = ({ label, description, value, onValueChange }: SettingToggleProps) => (
  <View style={styles.toggleRow}>
    <View style={{ flex: 1 }}>
      <Text style={styles.label}>{label}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
    </View>
    <Switch value={value} onValueChange={onValueChange} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    // style for header
  },
  scrollContent: {
    flex: 1,
  },
  titleRow: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    zIndex: 200, 
  },
  content: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
  },
  section: {
    backgroundColor: "#fafafa",
    padding: 5,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    color: "#111827",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  description: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  picker: {
    height: 40,
    width: 100,
    justifyContent: "center",
    textAlign: "center", 
  },
  footer: {
    // style for footer
  },
});

