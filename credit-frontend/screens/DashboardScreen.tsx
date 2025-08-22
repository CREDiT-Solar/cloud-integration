import React from "react";
import { SafeAreaView, View, StyleSheet, ScrollView } from "react-native";
import Title from "../components/Title";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CardChart from "../components/CardChart";
import BarchartComponent, { BarChartData } from '../components/BarChart';

const efficiencyData: BarChartData = {
  labels: ["PV Panel", "Inverter", "Battery", "Overall"],
  legend: ["Efficiency (%)"],
  data: [
    [95],   // PV Panel
    [100],  // Inverter
    [92],   // Battery
    [88],   // Overall
  ],
  barColors: ["#22c55e"], 
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
      
          <View style={styles.graphRow}>
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
