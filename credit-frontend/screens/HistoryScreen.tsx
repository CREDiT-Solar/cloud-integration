import React from "react";
import { SafeAreaView, View, StyleSheet, ScrollView } from "react-native";
import Title from "../components/Title";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CardChart from "../components/CardChart";
import BarchartComponent, { BarChartData } from "../components/BarChart";
import LineChartComponent, { LineChartData } from "../components/LineChart";
import CardReadout from "../components/CardReadout";
import { Calendar, Plug,  RefreshCcw, TrendingUp } from "lucide-react-native";


const SolarProdData: LineChartData = {
  labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
  datasets: [
    {
      data: [30, 35, 20, 25, 30, 30, 50, 100, 120, 125, 160, 160, 150, 135, 120, 70, 60, 30, 30, 35, 20, 25, 20, 30],
      strokeWidth: 2,
      color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`, 
    },
  ],
  legend: ["Energy (kWh)"]
};

const BatterytData: LineChartData = {
  labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
  datasets: [
    {
      data: [80, 80, 80, 79, 77, 75, 50, 60, 67, 70, 79, 80, 90, 90, 89, 70, 75, 77, 65, 63, 64, 79, 80, 80],
      strokeWidth: 2,
      color: (opacity = 1) => `rgba(0, 0, 255, 1) ${opacity})`, 
    },
  ],
  legend: ["Battery Level (%)"],
};

const hourlyProdUsageData = {
  labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
  legend: ["Production", "Energy Usage"],
  datasets: [
    { data: [195, 210, 200, 220, 210, 200, 220, 195, 210, 220, 210, 200, 195, 210, 220, 200, 210, 220, 195, 200, 210, 220, 195, 170], color: "#22c55e" },
    { data: [130, 160, 135, 170, 130, 160, 135, 170, 130, 160, 135, 170, 130, 160, 135, 170, 130, 160, 135, 170, 130, 160, 135, 170], color: "#6b7280" },
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
          <Title title="History & Analytics" subtitle="Analyse your solar system performance over time" />

          <View style={styles.row}>
            <CardReadout title="Total Production" value="847" units="kWh" subtitle="+12% vs last month" icon={<Calendar size={38} color="#22c55e" />} />
            <CardReadout title="Total Usage" value="623" units="kWh" subtitle="+5% vs last month" icon={<TrendingUp size={38} color="#636466ff" />} />
            <CardReadout title="Grid" value="224" units="kWh" subtitle="+18% vs last month" icon={<Plug size={38} color="#22c55e" />} />
            <CardReadout title="Self Consumption" value="73.5" units="%" subtitle="+3% vs last month" icon={<RefreshCcw size={38} color="#22c55e" />} />
          </View>
      
          <View style={styles.graphBlock}>
            <CardChart title="Solar Production History">
              <LineChartComponent data={SolarProdData} height={280} />
              {/* <LineChartComponent data={SolarProdData} width={440} height={280} /> */}
            </CardChart>
          </View>

          <View style={styles.graphBlock}>
            <CardChart title="Production vs Energy Usage">
              {/* <BarchartComponent data={prodUsageData} width={640} height={280} /> */}
              <BarchartComponent data={hourlyProdUsageData} height={280} />
            </CardChart>
          </View>
        
          <View style={styles.graphBlock}>
            <CardChart title="Battery Performance">
              {/* <LineChartComponent data={BatterytData} width={440} height={280} /> */}
              <LineChartComponent data={BatterytData} height={280} />
            </CardChart>
          </View>
        
       </View> 
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Footer currentPage="History" />
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