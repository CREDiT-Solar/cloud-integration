import React, { useEffect, useState } from "react";
import { SafeAreaView, View, StyleSheet, ScrollView, Image } from "react-native";
import { Battery, Cpu, Home, Sun, Zap } from "lucide-react-native";
import Title from "../components/Title";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CardReadout from "../components/CardReadout";
import StatusCard from "../components/StatusCard";
import CardChart from "../components/CardChart";
import BarchartComponent from '../components/BarChart';
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
    // // Solar production
    // const [solarPower, setSolarPower] = useState<number | null>(null);
    // const [solarVoltage, setSolarVoltage] = useState<number | null>(null);
    // const [solarCurrent, setSolarCurrent] = useState<number | null>(null);
    // // Inverter
    // // const [inverterPower, setInverterPower] = useState<number | null>(null);
    // const [inverterVoltage, setInverterVoltage] = useState<number | null>(null);
    // const [inverterCurrent, setInverterCurrent] = useState<number | null>(null);
    // // Battery
    // const [batteryStatus, setBatteryStauts] = useState<string | null>(null);
    // const [batterySoc, setBatterySoc] = useState<number | null>(null);
    // const [batteryVoltage, setBatteryVoltage] = useState<number | null>(null);
    // const [batteryCurrent, setBatteryCurrent] = useState<number | null>(null);
    // // Energy Usage
    // const [loadCurrent, setLoadCurrent] = useState<number | null>(null);
    // const [loadToday, setLoadToday] = useState<number | null>(null);
    // const [loadPeak, setLoadPeak] = useState<number | null>(null);
    // // Weather
    // const [temperature, setTemperature] = useState<number | null>(null);
    // const [humidity, setHumidity] = useState<number | null>(null);
    // const [irradiance, setIrradiance] = useState<number | null>(null);
  
    // useEffect(() => {
    //   //Solar production
    //   fetch("http://127.0.0.1:5000/current_solar_prod")
    //     .then((res) => res.json())
    //     .then((data) => {
    //       // API Response: [[102.46017165527344]]
    //       if (Array.isArray(data) && Array.isArray(data[0])) {
    //         const value = data[0][0];
    //         setSolarPower(value !== null ? value.toFixed(2) : "--");
    //       }
    //     })
    //     .catch((err) => console.error("Error fetching solar production:", err));
  
    //   fetch("http://127.0.0.1:5000/get_panel_voltage")
    //     .then((res) => res.json())
    //     .then((data) => {
    //       // API Response: 799.9295043945312
    //       const value = data;
    //       setSolarVoltage(value !== null ? value.toFixed(2) : "--");
    //     })
    //     .catch((err) => console.error("Error fetching solar voltage:", err));
  
    //   fetch("http://127.0.0.1:5000/get_panel_current")
    //     .then((res) => res.json())
    //     .then((data) => {
    //       // API Response: 109.91493589408552
    //       const value = data;
    //       setSolarCurrent(value !== null ? value.toFixed(2) : "--");
    //     })
    //     .catch((err) => console.error("Error fetching solar current:", err));

    //   //Inverter  
    //   fetch("http://127.0.0.1:5000/get_voltage")
    //     .then((res) => res.json())
    //     .then((data) => {
    //       // API Response: [[242.0060733159384]]
    //       const value = data[0][0];
    //       setInverterVoltage(value !== null ? value.toFixed(2) : "--");
    //     })
    //     .catch((err) => console.error("Error fetching inverter voltage:", err));
  
    //   fetch("http://127.0.0.1:5000/get_current")
    //     .then((res) => res.json())
    //     .then((data) => {
    //       // API Response: [[41.185427211225026]]
    //       const value = data[0][0];
    //       setInverterCurrent(value !== null ? value.toFixed(2) : "--");
    //     })
    //     .catch((err) => console.error("Error fetching inverter current:", err));

    //   //Battery
    //   fetch("http://127.0.0.1:5000/get_battery_state")
    //     .then((res) => res.json())
    //     .then((data) => {
    //       // API Response: ["charging"]
    //       const value = data[0];
    //       setBatteryStauts(value);
    //     })
    //     .catch((err) => console.error("Error fetching battery state:", err));
  
    //   fetch("http://127.0.0.1:5000/get_battery_percentage")
    //     .then((res) => res.json())
    //     .then((data) => {
    //       // API Response: [63.45]
    //       const value = data[0];
    //       setBatterySoc(value !== null ? value.toFixed(2) : "--");
    //     })
    //     .catch((err) => console.error("Error fetching battery SOC:", err));

    //   fetch("http://127.0.0.1:5000/get_battery_voltage")
    //     .then((res) => res.json())
    //     .then((data) => {
    //       // API Response: [[13.2487]]
    //       const value = data[0][0];
    //       setBatteryVoltage(value !== null ? value.toFixed(2) : "--");
    //     })
    //     .catch((err) => console.error("Error fetching battery voltage:", err));
  
    //   fetch("http://127.0.0.1:5000/get_battery_current")
    //     .then((res) => res.json())
    //     .then((data) => {
    //       // API Response: [392.4]
    //       const value = data[0];
    //       setBatteryCurrent(value !== null ? value.toFixed(2) : "--");
    //   })
    //     .catch((err) => console.error("Error fetching battery current:", err));

    //   // Energy usage
    //   fetch("http://127.0.0.1:5000/current_load")
    //     .then((res) => res.json())
    //     .then((data) => {
    //       // API Response: [2.16614]
    //       const value = data[0];
    //       setLoadCurrent(value !== null ? value.toFixed(2) : "--");
    //     })
    //     .catch((err) => console.error("Error fetching current load:", err));
    //   fetch("http://127.0.0.1:5000/total_load_today")
    //     .then((res) => res.json())
    //     .then((data) => {
    //       // API Response: [69.49737555694443]
    //       const value = data[0];
    //       setLoadToday(value !== null ? value.toFixed(2) : "--");
    //     })
    //     .catch((err) => console.error("Error fetching total load today:", err));
  
    //     fetch("http://127.0.0.1:5000/peak_load_today")
    //     .then((res) => res.json())
    //     .then((data) => {
    //       // API Response: [4.792199999999999]
    //       const value = data[0];
    //       setLoadPeak(value !== null ? value.toFixed(2) : "--");
    //   })
    //     .catch((err) => console.error("Error fetching peak load today:", err));

    //   // Weather  
    //   fetch("http://127.0.0.1:5000/get_temperature")
    //     .then((res) => res.json())
    //     .then((data) => {
    //       // API Response: Not Found
    //       const value = data[0][0];
    //       setTemperature(value !== null ? value.toFixed(2) : "--");
    //     })
    //     .catch((err) => console.error("Error fetching temperature:", err));
  
    //   fetch("http://127.0.0.1:5000/get_humidity")
    //     .then((res) => res.json())
    //     .then((data) => {
    //       // API Response: [[78.249]]
    //       const value = data[0][0];
    //       setHumidity(value !== null ? value.toFixed(2) : "--");
    //   })
    //     .catch((err) => console.error("Error fetching humidity:", err));

    //   fetch("http://127.0.0.1:5000/get_irradiance")
    //     .then((res) => res.json())
    //     .then((data) => {
    //       // API Response: [[166.13999938964844, 12.74666690826416]]
    //       const value = data[0][0];
    //       setIrradiance(value !== null ? value.toFixed(2) : "--");
    //   })
    //     .catch((err) => console.error("Error fetching irradiance:", err));

    // }, []);

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
      
          {/* <View style={styles.row}>
            <StatusCard
              icon={<Zap size={24} color="#22c55e" />}
              fields={[
                { label: "Power", value: solarPower ?? "--", unit: "kW" },
                { label: "Voltage", value: solarVoltage ?? "--", unit: "V" },
                { label: "Current", value: solarCurrent ?? "--", unit: "A" },
              ]} title={"Solar Production"}              />

            <StatusCard
              icon={<Cpu size={24} color="#1d28c2ff" />}
              fields={[
                { label: "Efficiency", value: "--", unit: "%" },
                { label: "Power", value: "--", unit: "kW" },
                { label: "Voltage", value: inverterVoltage ?? "--", unit: "V" },
                { label: "Current", value: inverterCurrent ?? "--", unit: "A" },
              ]} title={"Inverter"}              />

            <StatusCard
              icon={<Battery size={24} color="#1d28c2ff" />}
              fields={[
                { label: "Status", value: batteryStatus ?? "--", unit: "" },
                { label: "SOC", value: batterySoc ?? "--", unit: "%" },
                { label: "Power", value: "--", unit: "kW" },
                { label: "Voltage", value: batteryVoltage ?? "--", unit: "V" },
                { label: "Current", value: batteryCurrent ?? "--", unit: "A" },
              ]} title={"Battery"}              />
          </View>

          <View style={styles.row}>
            <StatusCard
              icon={<Home size={24} color="#535353ff" />}
              fields={[
                { label: "Current Load", value: loadCurrent ?? "--", unit: "kW" },
                { label: "Today", value: loadToday ?? "--", unit: "kWh" },
                { label: "Peal Load", value: loadPeak ?? "--", unit: "kW" },
              ]} title={"Energy Usage"}              />

            <StatusCard
              icon={<Sun size={24} color="#c9770bff" />}
              fields={[
                { label: "Temperature", value: temperature ?? "--", unit: "°C" },
                { label: "Humidity", value: humidity ?? "--", unit: "%" },
                { label: "Irradiance", value: irradiance ?? "--", unit: "W/m²" },
              ]} title={"Weather"}              />

            <StatusCard
              icon={<Image source={require("../assets/grid.png")} style={{ width: 38, height: 38 }} resizeMode="contain"/>}
              fields={[
                { label: "Status", value: "Offline", unit: "" },
                { label: "Power", value: "--", unit: "kW" },
                { label: "Voltage", value: "--", unit: "V" },
                { label: "Current", value: "--", unit: "A" },
              ]} title={"Grid"}              />
          </View> */}

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
                { label: "Irradiance", value: 0, unit: "W/m²" },
              ]} title={"Weather"}              />

            <StatusCard
              icon={<Image source={require("../assets/grid.png")} style={{ width: 38, height: 38 }} resizeMode="contain"/>}
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
