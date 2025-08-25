import React from "react";
import { SafeAreaView, View, StyleSheet, ScrollView } from "react-native";
import { Battery, Cpu, Home, Plug, Sun, Zap } from "lucide-react-native";
import Title from "../components/Title";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CardReadout from "../components/CardReadout";
import StatusCard from "../components/StatusCard";
import CardChart from "../components/CardChart";
import BarchartComponent, { BarChartData } from '../components/BarChart';
import LineChartComponent, { LineChartData } from "../components/LineChart";

const lineChartData: LineChartData = {
  labels: ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00"],
  datasets: [
    {
      data: [3.2, 3.3, 3.15, 3.39, 3.2, 3.3],
      strokeWidth: 2,
      color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`, 
    },
    {
      data: [1.75, 1.8, 1.7, 1.76, 1.86, 1.7],
      strokeWidth: 2,
      color: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`, 
    },
  ],
  legend: ["Solar Production Forecast", "Energy Usage Prediction"]
};

const efficiencyData = {
  labels: ["PV Panel", "Inverter", "Battery", "Overall"],
  legend: ["Efficiency (%)"],
  datasets: [
    { data: [95, 100, 92, 88], color: "#22c55e" },
  ],
};


export default function HistoryScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Header userName="Guest" />
      </View>

      {/* Main ScrollView */}
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Title title="Real-Time Dashboard" subtitle="Live monitoring of your solar energy system" />

          <CardReadout title="Energy Availability" value="12" units="kWh" subtitle="Current" icon={<Zap size={38} color="#22c55e" />} />
      
          <View style={styles.row}>
            <StatusCard
              icon={<Zap size={24} color="#22c55e" />}
              fields={[
                // { label: "Power", value: 4.75, unit: "kW", highlight: true },
                { label: "Power", value: 4.75, unit: "kW" },
                { label: "Voltage", value: 0, unit: "V" },
                { label: "Current", value: 0, unit: "A" },
              ]} title={"Solar Production"}              />

            <StatusCard
              icon={<Cpu size={24} color="#1d28c2ff" />}
              fields={[
                { label: "Efficiency", value: 0, unit: "%" },
                { label: "Power", value: 0, unit: "kW" },
                { label: "Voltage", value: 0, unit: "V" },
                { label: "Current", value: 0, unit: "A" },
              ]} title={"Inverter"}              />

            <StatusCard
              icon={<Battery size={24} color="#1d28c2ff" />}
              fields={[
                { label: "Status", value: "Unknown", unit: "" },
                { label: "SOC", value: 95, unit: "%" },
                { label: "Power", value: 0, unit: "kW" },
                { label: "Voltage", value: 0, unit: "V" },
                { label: "Current", value: 0, unit: "A" },
              ]} title={"Battery"}              />
          </View>

          <View style={styles.row}>
            <StatusCard
              icon={<Home size={24} color="#535353ff" />}
              fields={[
                { label: "Current Load", value: 1.85, unit: "kW" },
                { label: "Today", value: 0, unit: "kWh" },
                { label: "Peal Load", value: 0, unit: "kW" },
              ]} title={"Energy Usage"}              />

            <StatusCard
              icon={<Sun size={24} color="#c9770bff" />}
              fields={[
                { label: "Temperature", value: 30, unit: "kW" },
                { label: "Humidity", value: 0, unit: "V" },
                { label: "Irradiance", value: 0, unit: "W/m2" },
              ]} title={"Weather"}              />

            <StatusCard
              icon={<Plug size={24} color="#22c55e" />}
              fields={[
                { label: "Status", value: "Offline", unit: "" },
                { label: "Power", value: 0, unit: "kW" },
                { label: "Voltage", value: 0, unit: "V" },
                { label: "Current", value: 0, unit: "A" },
              ]} title={"Grid"}              />
          </View>

          <View style={styles.graphRow}>
            <View style={styles.graphBlock}>
              <CardChart title="Solar Production Forecast & Energy Usage Prediction">
                <LineChartComponent data={lineChartData} width={440} height={280} />
              </CardChart>
            </View>

            <View style={styles.graphBlock}>
              <CardChart title="Performance Monitoring (System Efficiency)">
                <BarchartComponent data={efficiencyData} width={640} height={280} />
              </CardChart>
            </View>

          </View>
        
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Footer currentPage="Dashboard" />
      </View>
    </SafeAreaView>
  );
}


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
  content: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  graphRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  graphBlock: {
    flex: 1,
  },
  footer: {
    // style for footer
  },
});
