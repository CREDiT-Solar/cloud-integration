import React, { useState } from "react";
import { SafeAreaView, View, StyleSheet, ScrollView, TouchableOpacity, Text } from "react-native";
import Title from "../components/Title";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CardChart from "../components/CardChart";
import BarchartComponent, { BarChartData } from "../components/BarChart";
import LineChartComponent from "../components/LineChart";
import CardReadout from "../components/CardReadout";
import { Calendar, Plug, RefreshCcw, TrendingUp } from "lucide-react-native";

type PeriodType = "today" | "week" | "month" | "year";

const SolarProdData = {
    today: {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    legend: ["Energy (kWh)"],
    datasets: [
      {
        data: [30, 35, 20, 25, 30, 30, 50, 100, 120, 125, 160, 160, 150, 135, 120, 70, 60, 30, 30, 35, 20, 25, 20, 30],
        strokeWidth: 2,
        color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
      },
    ],
  },
  week: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    legend: ["Energy (kWh)"],
    datasets: [
      {
        data: Array.from({ length: 7 }, () => Math.floor(500 + Math.random() * 300)),
        strokeWidth: 2,
        color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
      },
    ],    
  },
  month: {
    labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
    legend: ["Energy (kWh)"],
    datasets: [
      {
        data: Array.from({ length: 30 }, () => Math.floor(400 + Math.random() * 300)),
        strokeWidth: 2,
        color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
      },
    ],
  },
  year: {
    labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    legend: ["Energy (kWh)"],
    datasets: [
      {
        data: Array.from({ length: 12 }, () => Math.floor(2000 + Math.random() * 1000)),
        strokeWidth: 2,
        color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
      },
    ],
  },
};

const BatterytData = {
  today: {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    legend: ["Battery Level (%)"],
    datasets: [
      {
        data: Array.from({ length: 24 }, () => Math.floor(100 + Math.random() * 50)),
        strokeWidth: 2,
        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
      },
    ],
  },
  week: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    legend: ["Battery Level (%)"],
    datasets: [
      {
        data: Array.from({ length: 7 }, () => Math.floor(200 + Math.random() * 100)),
        strokeWidth: 2,
        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
      },
    ],    
  },
  month: {
    labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
    legend: ["Battery Level (%)"],
    datasets: [
      {
        data: Array.from({ length: 30 }, () => Math.floor(200 + Math.random() * 100)),
        strokeWidth: 2,
        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
      },
    ],
  },
  year: {
    labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    legend: ["Battery Level (%)"],
    datasets: [
      {
        data: Array.from({ length: 12 }, () => Math.floor(300 + Math.random() * 200)),
        strokeWidth: 2,
        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
      },
    ],
  },
};

const ProdUsageData: Record<PeriodType, BarChartData> = {
  today: {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    legend: ["Production", "Energy Usage"],
    datasets: [
      {
        data: [80, 80, 80, 79, 77, 75, 50, 60, 67, 70, 79, 80, 90, 90, 89, 70, 75, 77, 65, 63, 64, 79, 80, 80],
        color: "#22c55e", // Production
      },
      {
        data: Array.from({ length: 24 }, () => Math.floor(50 + Math.random() * 80)),
        color: "#6b7280", // Usage
      },
    ],
  },
  week: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    legend: ["Production", "Energy Usage"],
    datasets: [
      {
        data: Array.from({ length: 7 }, () => Math.floor(500 + Math.random() * 300)),
        color: "#22c55e",
      },
      {
        data: Array.from({ length: 7 }, () => Math.floor(300 + Math.random() * 200)),
        color: "#6b7280",
      },
    ],
  },
  month: {
    labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
    legend: ["Production", "Energy Usage"],
    datasets: [
      {
        data: Array.from({ length: 30 }, () => Math.floor(400 + Math.random() * 300)),
        color: "#22c55e",
      },
      {
        data: Array.from({ length: 30 }, () => Math.floor(250 + Math.random() * 200)),
        color: "#6b7280",
      },
    ],
  },
  year: {
    labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    legend: ["Production", "Energy Usage"],
    datasets: [
      {
        data: Array.from({ length: 12 }, () => Math.floor(2000 + Math.random() * 1000)),
        color: "#22c55e",
      },
      {
        data: Array.from({ length: 12 }, () => Math.floor(1200 + Math.random() * 800)),
        color: "#6b7280",
      },
    ],
  },
};


export default function HistoryScreen() {
  const [period, setPeriod] = useState<PeriodType>("today");

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

          <View style={styles.menuRow}>
            {(["today", "week", "month", "year"] as PeriodType[]).map((p) => (
              <TouchableOpacity
                key={p}
                style={[styles.menuButton, period === p && styles.menuButtonActive]}
                onPress={() => setPeriod(p)}
              >
                <Text style={[styles.menuText, period === p && styles.menuTextActive]}>
                  {p.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.graphBlock}>
            <CardChart title="Solar Production History">
              <LineChartComponent data={SolarProdData[period]} height={280} />
            </CardChart>
          </View>

          <View style={styles.graphBlock}>
            <CardChart title="Production vs Energy Usage">
              <BarchartComponent data={ProdUsageData[period]} height={280} />
            </CardChart>
          </View>

          <View style={styles.graphBlock}>
            <CardChart title="Battery Performance">
              <LineChartComponent data={BatterytData[period]} height={280} />
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
    backgroundColor: "#fff",
  },
  header: {},
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
  graphBlock: {
    flex: 1,
    marginTop: 16,
  },
  footer: {},
  menuRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginBottom: 16,
  },
  menuButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  menuButtonActive: {
    backgroundColor: "#22c55e",
    borderColor: "#22c55e",
  },
  menuText: {
    fontSize: 12,
    color: "#333",
  },
  menuTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
});
