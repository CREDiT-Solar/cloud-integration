import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, StyleSheet, ScrollView, Image } from 'react-native';
import Title from '../components/Title';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CardReadout from '../components/CardReadout';
import PieChartComponent, { PieDataItem } from '../components/PieChart';
import LineChartComponent, { LineChartData } from '../components/LineChart';
import CardChart from '../components/CardChart';
import { Zap, Battery, Home } from 'lucide-react-native';

const pieData: PieDataItem[] = [
  { name: "Solar", population: 35, color: "#22c55e", legendFontColor: "#111", legendFontSize: 12 },
  { name: "Battery", population: 25, color: "#3b82f6", legendFontColor: "#111", legendFontSize: 12 },
  { name: "Usage", population: 15, color: "#6b7280", legendFontColor: "#111", legendFontSize: 12 },
  { name: "Grid", population: 25, color: "#f59e42", legendFontColor: "#111", legendFontSize: 12 }
];

const lineChartData: LineChartData = {
  labels: ["6:00", "9:00", "12:00", "15:00", "18:00", "21:00"],
  datasets: [
    {
      data: [0, 2, 4, 4, 2, 0],
      strokeWidth: 2,
      color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`, 
    },
    {
      data: [1, 2, 3, 2, 2, 2],
      strokeWidth: 2,
      color: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`, 
    },
  ],
  legend: ["Production", "Usage"]
};

export default function HomeScreen() {
  const [solarProd, setSolarProd] = useState<number | null>(null);
  const [batterySOC, setBatterySOC] = useState<number | null>(null);
  const [energyUsage, setEnergyUsage] = useState<number | null>(null);

  useEffect(() => {
    //Solar production
    fetch("http://127.0.0.1:5000/current_solar_prod")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched data:", data);
        // API Response example: [[99.77917897727274]]
        if (Array.isArray(data) && Array.isArray(data[0])) {
          const value = data[0][0];
          setSolarProd(value);
        }
      })
      .catch((err) => console.error("Error fetching solar production:", err));

    // //  Battery SOC
    // fetch("http://127.0.0.1:5000/get_battery_percentage")
    //   .then((res) => res.json())
    //   .then((data) => {
    //     // API Response example: [63.45]
    //     const value = data[0];
    //     setBatterySOC(value);
    //   })
    //   .catch((err) => console.error("Error fetching battery SOC:", err));

    //   //Energy Ussage
    // fetch("http://127.0.0.1:5000/current_load")
    //   .then((res) => res.json())
    //   .then((data) => {
    //     // API Response example: [2.16614]
    //     const value = data[0];
    //     setEnergyUsage(value);
    // })
    //   .catch((err) => console.error("Error fetching energy usage:", err));
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
          <Title title="System Overview" subtitle="Monitor your solar energy performance" />

          <View style={styles.row}>
            <CardReadout 
              title="Solar Production" 
              // value="9.78" 
              value={solarProd !== null ? solarProd.toFixed(2) : "--"}
              units="kW" 
              subtitle="Current" 
              icon={<Zap size={38} color="#22c55e" />} 
            />
            <CardReadout
              title="Battery SOC" 
              value="63.91"       
              // value={batterySOC !== null ? batterySOC.toFixed(2) : "--"}
              subtitle="Charging" 
              icon={<Battery size={38} color="#3b82f6" />} 
            />
            <CardReadout 
              title="Energy Usage" 
              value="2.17" 
              // value={energyUsage !== null ? energyUsage.toFixed(2) : "--"} 
              units="kW" 
              subtitle="Current Load" 
              icon={<Home size={38} color="#111" />} 
            />
            <CardReadout 
              title="Grid Status" 
              value="--" 
              units="kW" 
              subtitle="Offline" 
              icon={<Image source={require("../assets/grid.png")} style={{ width: 38, height: 38 }} resizeMode="contain"/>} 
            />
          </View>

          <View style={styles.graphRow}>
            <View style={styles.graphBlock}>
              <CardChart title="Today's Energy Flow">
                <PieChartComponent data={pieData} width={340} height={280} />
              </CardChart>
            </View>
            <View style={styles.graphBlock}>
              <CardChart title="Production vs Usage">
                <LineChartComponent data={lineChartData} width={440} height={280} />
              </CardChart>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Footer currentPage="Home" />
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
