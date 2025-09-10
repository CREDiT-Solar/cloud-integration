import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, StyleSheet, ScrollView, TouchableOpacity, Text, Image } from "react-native";
import Title from "../components/Title";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CardChart from "../components/CardChart";
import BarchartComponent, { BarChartData } from "../components/BarChart";
import LineChartComponent, { LineChartData } from "../components/LineChart";
import CardReadout from "../components/CardReadout";
import { Calendar, RefreshCcw, TrendingUp } from "lucide-react-native";
import { getRequest, postRequest } from '../util/isa-util';
import { useNavigation } from '@react-navigation/native';
import DropdownMenu from '../components/DropdownMenu';

type PeriodType = "day" | "week" | "month" | "year";

const SolarProdData = {
    day: {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    legend: ["Energy (kWh)"],
    datasets: [
      {
        data: [3, 2, 2, 3, 4, 5, 50, 97, 120, 125, 160, 160, 150, 135, 120, 70, 60, 30, 30, 24, 15, 3, 2, 2],
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
        data: Array.from({ length: 7 }, () => Math.floor(500 + Math.random() * 100)),
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
        data: Array.from({ length: 30 }, () => Math.floor(400 + Math.random() * 100)),
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
        data: Array.from({ length: 12 }, () => Math.floor(2000 + Math.random() * 500)),
        strokeWidth: 2,
        color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
      },
    ],
  },
};

const ProdUsageData: Record<PeriodType, BarChartData> = {
  day: {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    legend: ["Production (kWh)", "Energy Usage (kWh)"],
    datasets: [
      {
        data: [3, 2, 2, 3, 4, 5, 50, 97, 120, 125, 160, 160, 150, 135, 120, 70, 60, 30, 30, 24, 15, 3, 2, 2],
        color: "#22c55e", // Production
      },
      {
        // data: Array.from({ length: 24 }, () => Math.floor(50 + Math.random() * 80)),
        data: [15, 12, 12, 13, 24, 25, 58, 70, 65, 52, 42, 32, 56, 59, 62, 66, 68, 78, 82, 85, 87, 65, 50, 42, 35],
        color: "#6b7280", // Usage
      },
    ],
  },
  week: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    legend: ["Production (kWh)", "Energy Usage (kWh)"],
    datasets: [
      {
        data: Array.from({ length: 7 }, () => Math.floor(500 + Math.random() * 100)),
        color: "#22c55e",
      },
      {
        data: Array.from({ length: 7 }, () => Math.floor(300 + Math.random() * 100)),
        color: "#6b7280",
      },
    ],
  },
  month: {
    labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
    legend: ["Production (kWh)", "Energy Usage (kWh)"],
    datasets: [
      {
        data: Array.from({ length: 30 }, () => Math.floor(400 + Math.random() * 100)),
        color: "#22c55e",
      },
      {
        data: Array.from({ length: 30 }, () => Math.floor(250 + Math.random() * 100)),
        color: "#6b7280",
      },
    ],
  },
  year: {
    labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    legend: ["Production (kWh)", "Energy Usage (kWh)"],
    datasets: [
      {
        data: Array.from({ length: 12 }, () => Math.floor(2000 + Math.random() * 500)),
        color: "#22c55e",
      },
      {
        data: Array.from({ length: 12 }, () => Math.floor(1200 + Math.random() * 400)),
        color: "#6b7280",
      },
    ],
  },
};

const BatterytData = {
  day: {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    legend: ["Battery Level (%)"],
    datasets: [
      {
        // data: Array.from({ length: 24 }, () => Math.floor(100 + Math.random() * 50)),
        data: [20.5, 21, 20.7, 20.6, 21, 22, 22.1, 21.5, 22, 35, 57, 75, 89, 97, 99, 97, 89, 80.1, 79, 75, 65, 57, 34, 25],
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
        data: Array.from({ length: 7 }, () => Math.floor(200 + Math.random() * 50)),
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
        data: Array.from({ length: 30 }, () => Math.floor(200 + Math.random() * 50)),
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
        data: Array.from({ length: 12 }, () => Math.floor(300 + Math.random() * 70)),
        strokeWidth: 2,
        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
      },
    ],
  },
};

// interface SolarProd {
//   ts: string;       // "YYYY-MM-DD HH:mm:ss"
//   site_kW: number;
// }

export default function HistoryScreen() {
  const [period, setPeriod] = useState<PeriodType>("day");
  const [SolarProd, setSolarProd] = useState<number | null>(null);
  const [lineChartData, setLineChartData] = useState<LineChartData | null>(null);

  const navigation = useNavigation();
  const navigateTo = (screen: string) => {
    navigation.navigate(screen as never);
  };

  //  useEffect(() => {
  //     // solar production today
  //     async function fetchSolarToday() {
  //       try {
  //         const data = await postRequest("/solar_prod_sum", { period: "month" });
  //         console.log("Fetched current_solar_prod:", data);
  //         // API Response:  {  } 
  //       if (data && typeof data === "object" && "solar_prod_sum" in data) {
  //         const value = (data as any).solar_prod_sum;
  //         if (typeof value === 'number') setSolarToday(value);
  //       }
  //       } catch (err) {
  //         console.error("Error fetching solar production:", err);
  //       }
  //     }
  //     fetchSolarToday();
  
  //     // Day solar production for line chart
  //     async function fetchSolarProd() {
  //       try {
  //         const data = await postRequest("/historical_solar_prod", { period: "day" });
  //         console.log("Fetched historical_solar_prod:", data);
  
  //         const list: SolarProd[] | undefined = data?.historical_solar_prod;
  //         if (!Array.isArray(list) || list.length === 0) return;
  
  //         const prodData = [...list].sort((a, b) => (a.ts > b.ts ? 1 : -1));
  //         const labels = prodData.map((item) => item.ts.slice(11, 16));
  //         const productionValues = prodData.map((item) => item.site_kW);

  //         const chartData: LineChartData = {
  //           labels,
  //           datasets: [
  //             {
  //               data: productionValues,
  //               strokeWidth: 2,
  //               color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`, // green
  //             },
  //           ],
  //           legend: ["Production (kW)", "Usage (kW)"],
  //         };
 
  //        setLineChartData(chartData);         
  //       } catch (err) {
  //         console.error("Error fetching historical solar production:", err);
  //       }
  //     }
  //   fetchSolarProd();

  // }, []);

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
          <Title title="History & Analytics" subtitle="Analyse your solar system performance over time" />
          <DropdownMenu triggerType="icon" navigateTo={navigateTo} />
        </View>
          
          <View style={styles.row}>
            <CardReadout title="Total PV Production" value="623" units="kWh" subtitle="+12% vs last month" icon={<Calendar size={38} color="#22c55e" />} />
            <CardReadout title="Grid" value="224" units="kWh" subtitle="+10% vs last month" icon={<Image source={require("../assets/grid.png")} style={{ width: 38, height: 38 }} resizeMode="contain"/>} />
            <CardReadout title="Total Usage (PV & Grid)" value="847" units="kWh" subtitle="+5% vs last month" icon={<TrendingUp size={38} color="#636466ff" />} />
            <CardReadout title="Self Consumption" value="73.5" units="%" subtitle="+3% vs last month" icon={<RefreshCcw size={38} color="#22c55e" />} />
          </View>

          <View style={styles.menuRow}>
            {(["day", "week", "month", "year"] as PeriodType[]).map((p) => (
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
            <CardChart title="PV Production vs Energy Usage">
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
