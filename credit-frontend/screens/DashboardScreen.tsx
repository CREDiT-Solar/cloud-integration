import React, { useEffect, useState } from "react";
import { SafeAreaView, View, StyleSheet, ScrollView, Image } from "react-native";
import { Battery, Cpu, Home, Sun, Zap, Leaf } from "lucide-react-native";
import Title from "../components/Title";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CardReadout from "../components/CardReadout";
import StatusCard from "../components/StatusCard";
import CardChart from "../components/CardChart";
import BarchartComponent from '../components/BarChart';
import LineChartComponent, { LineChartData } from "../components/LineChart";
import { getRequest } from "../util/isa-util";

const lineChartData: LineChartData = {
  labels: ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
  datasets: [
    {
      data: [35.4, 42.2, 59.1, 90.5, 90.2, 95.7, 90.0, 85.2, 40.1],
      strokeWidth: 2,
      color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`, 
    },
    {
      data: [52, 80.2, 70.5, 87.3, 65.6, 55.8, 49.8, 45.6, 50.3],
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
    { data: [95, 100, 92, 88], color: "#26d8f0ff" },
  ],
};

export default function HistoryScreen() {
    const [carbonEmissions, setCarbonEmissions] = useState<number | null>(null);
    // Inverter 1
    const [inverterPower, setInverterPower] = useState<number | null>(null);
    const [inverterVoltage, setInverterVoltage] = useState<number | null>(null);
    const [inverterCurrent, setInverterCurrent] = useState<number | null>(null);
    // Battery
    const [batteryStatus, setBatteryStauts] = useState<string | null>(null);
    const [batterySoc, setBatterySoc] = useState<number | null>(null);
    const [batteryVoltage, setBatteryVoltage] = useState<number | null>(null);
    const [batteryCurrent, setBatteryCurrent] = useState<number | null>(null);
    // Energy Usage
    const [loadCurrent, setLoadCurrent] = useState<number | null>(null);
    const [loadToday, setLoadToday] = useState<number | null>(null);
    const [loadPeak, setLoadPeak] = useState<number | null>(null);
    // Weather
    const [temperature, setTemperature] = useState<number | null>(null);
    const [humidity, setHumidity] = useState<number | null>(null);
    const [windSpeed, setWindSpeed] = useState<number | null>(null);
  
    useEffect(() => {
      async function fetchCarbonEmissions() {
        try {
          const data = await getRequest("/get_carbon_emissions");
          console.log("Fetched data:", data);
          // API Response example: { "carbon_emissions": 11185.347600000001 }
          if (data && typeof data === "object" && data.carbon_emissions !== undefined) {
            const value = data.carbon_emissions;
            setCarbonEmissions(value);
          }
        } catch (err) {
          console.error("Error fetching solar production:", err);
        }
      }
      fetchCarbonEmissions();

      // Inverter 1
      async function fetchSolarProd() {
        try {
          const data = await getRequest("/current_solar_prod");
          console.log("Fetched data:", data);
          // API Response example: [{ "site_kW_5min_avg": 55.33060138512814 }]
          if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && data[0] !== null) {
            const value = data[0].site_kW_5min_avg;
            setInverterPower(value);
          }
        } catch (err) {
          console.error("Error fetching solar production:", err);
        }
      }
      fetchSolarProd();

      async function fetchInverterVoltage() {
        try {
          const data = await getRequest("/get_voltage");
          console.log("Fetched data:", data);
          // API Response: [{ "avg_voltage": 241.37919344643296 }]
          if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && data[0] !== null) {
            const value = data[0].avg_voltage;
            setInverterVoltage(value);
          }
        } catch (err) {
          console.error("Error fetching inverter voltage:", err);
        }
      }
      fetchInverterVoltage();

      async function fetchInverterCurrent() {
        try {
          const data = await getRequest("/get_current");
          console.log("Fetched data:", data);
          // API Response: [{ "avg_current": 18.35615268881007 }]
          if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && data[0] !== null) {
            const value = data[0].avg_current;
            setInverterCurrent(value);
          }
        } catch (err) {
          console.error("Error fetching inverter current:", err);
        }
      }
      fetchInverterCurrent()

      // Battery
      async function fetchBatteryStatus() {
        try {
          const data = await getRequest("/get_battery_state");
          console.log("Fetched data:", data);
          // API Response example: { "battery_state": "charging" }
          if (data && typeof data === "object" && data.battery_state !== undefined) {
            const value = data.battery_state;
            setBatteryStauts(value);
          }
        } catch (err) {
          console.error("Error fetching battery status:", err);
        }
      }
      fetchBatteryStatus();

      async function fetchBatterySoc() {
        try {
          const data = await getRequest("/get_battery_percentage");
          console.log("Fetched data:", data);
          // API Response example: { "battery_percentage": 64.16" }
          if (data && typeof data === "object" && data.battery_percentage !== undefined) {
            const value = data.battery_percentage;
            setBatterySoc(value);
          }
        } catch (err) {
          console.error("Error fetching battery SOC:", err);
        }
      }
      fetchBatterySoc();

      async function fetchBatteryVoltage() {
        try {
          const data = await getRequest("/get_battery_voltage");
          console.log("Fetched data:", data);
          // API Response example: [{ "BattV": 13.3418 }]
          if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && data[0] !== null) {
            const value = data[0].BattV;
            setBatteryVoltage(value);
          }
        } catch (err) {
          console.error("Error fetching battery voltage:", err);
        }
      }
      fetchBatteryVoltage();

      async function fetchBatteryCurrent() {
        try {
          const data = await getRequest("/get_battery_current");
          console.log("Fetched data:", data);
          // API Response example: { "battery_current": 78.52 }
          if (data && typeof data === "object" && data.battery_current !== undefined) {
            const value = data.battery_current;
            setBatteryCurrent(value);
          }
        } catch (err) {
          console.error("Error fetching battery current:", err);
        }
      }
      fetchBatteryCurrent();

      // Energy Usage
      async function fetchCurrentLoad() {
        try {
          const data = await getRequest("/current_load");
          console.log("Fetched data:", data);
          // API Response example: { "current_load": 2.16614 }
          if (data && typeof data === "object" && data.current_load !== undefined) {
            const value = data.current_load;
            setLoadCurrent(value);
          }
        } catch (err) {
          console.error("Error fetching current load:", err);
        }
      }
      fetchCurrentLoad();

      async function fetchLoadToday() {
        try {
          const data = await getRequest("/total_load_today");
          console.log("Fetched data:", data);
          // API Response example: { "total_load_today": 60.27 }
          if (data && typeof data === "object" && data.total_load_today !== undefined) {
            const value = data.total_load_today;
            setLoadToday(value);
          }
        } catch (err) {
          console.error("Error fetching total load today:", err);
        }
      }
      fetchLoadToday();

      async function fetchLoadPeak() {
        try {
          const data = await getRequest("/peak_load_today");
          console.log("Fetched data:", data);
          // API Response example: { "peak_load_today": 4.29 }
          if (data && typeof data === "object" && data.peak_load_today !== undefined) {
            const value = data.peak_load_today;
            setLoadPeak(value);
          }
        } catch (err) {
          console.error("Error fetching peak load today:", err);
        }
      }
      fetchLoadPeak();

      // Weather  
      async function fetchTemperature() {
        try {
          const data = await getRequest("/get_temperature");
          console.log("Fetched data:", data);
          // API Response example: [{ "latest_temperature": 21.2874 }]
          if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && data[0] !== null) {
            const value = data[0].latest_temperature;
            setTemperature(value);
          }
        } catch (err) {
          console.error("Error fetching temperature:", err);
        }
      }
      fetchTemperature();

      async function fetchHumidity() {
        try {
          const data = await getRequest("/get_humidity");
          console.log("Fetched data:", data);
          // API Response example: [{ "humidity": 78.249 }]
          if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && data[0] !== null) {
            const value = data[0].humidity;
            setHumidity(value);
          }
        } catch (err) {
          console.error("Error fetching humidity:", err);
        }
      }
      fetchHumidity();

      async function fetchWindSpeed() {
        try {
          const data = await getRequest("/get_windspeed");
          console.log("Fetched data:", data);
          // API Response example: [{ "WS_ms": 1.30048, "WS_ms_2": -5.52015, "WindDir": 281.603 }]
          if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && data[0] !== null) {
            const value = data[0].WS_ms;
            setWindSpeed(value);
          }
        } catch (err) {
          console.error("Error fetching wind speed:", err);
        }
      } 
      fetchWindSpeed();

    }, []);

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

          <CardReadout 
            title="Cardon Emissions" 
            value={carbonEmissions !== null ? carbonEmissions.toFixed(2) : "--"} 
            units="KG" 
            subtitle="Saved by the solar system" 
            icon={<Leaf size={38} color="#22c55e" />} 
          />
    
          <View style={styles.row}>
            <StatusCard
              icon={<Cpu size={24} color="#4698f7ff" />}
              fields={[
                { label: "Efficiency", value: "--", unit: "%" },    
                { label: "Power", value: inverterPower !== null ? inverterPower.toFixed(2) : "--", unit: "kW" },
                { label: "Voltage", value: inverterVoltage !== null ? inverterVoltage.toFixed(2) : "--", unit: "V" },
                { label: "Current", value: inverterCurrent !== null ? inverterCurrent.toFixed(2) : "--", unit: "A" },
              ]} title={"Inverter 1"}              />

            <StatusCard
              icon={<Cpu size={24} color="#4698f7ff" />}
              fields={[
                { label: "Efficiency", value: "--", unit: "%" },                
                { label: "Power", value: "--", unit: "kW" },
                { label: "Voltage", value: "--", unit: "V" },
                { label: "Current", value: "--", unit: "A" },
              ]} title={"Inverter 2"}              />

            <StatusCard
              icon={<Battery size={24} color="#1d28c2ff" />}
              fields={[
                { label: "Status", value: batteryStatus ?? "--", unit: "" },
                { label: "SOC", value: batterySoc !== null ? batterySoc.toFixed(2) : "--", unit: "%" },
                { label: "Voltage", value: batteryVoltage !== null ? batteryVoltage.toFixed(2) : "--", unit: "V" },
                { label: "Current", value: batteryCurrent !== null ? batteryCurrent.toFixed(2) : "--", unit: "A" },
              ]} title={"Battery"}              />
          </View>

          <View style={styles.row}>
            <StatusCard
              icon={<Home size={24} color="#535353ff" />}
              fields={[
                { label: "Current Load", value: loadCurrent !== null ? loadCurrent.toFixed(2) : "--", unit: "kW" },
                { label: "Today", value: loadToday !== null ? loadToday.toFixed(2) : "--", unit: "kWh" },
                { label: "Peal Load", value: loadPeak !== null ? loadPeak.toFixed(2) : "--", unit: "kW" },
              ]} title={"Energy Usage"}              />

            <StatusCard
              icon={<Sun size={24} color="#c9770bff" />}
              fields={[
                { label: "Temperature", value: temperature !== null ? temperature.toFixed(2) : "--", unit: "°C" },
                { label: "Humidity", value: humidity !== null ? humidity.toFixed(2) : "--", unit: "%" },
                { label: "Wind Speed", value: windSpeed !== null ? windSpeed.toFixed(2) : "--", unit: "m/s" },
              ]} title={"Weather"}              />

            <StatusCard
              icon={<Image source={require("../assets/grid.png")} style={{ width: 25, height: 25 }} resizeMode="contain"/>}
              fields={[
                { label: "Status", value: "Offline", unit: "" },
                { label: "Power", value: "--", unit: "kW" },
                { label: "Voltage", value: "--", unit: "V" },
                { label: "Current", value: "--", unit: "A" },
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
