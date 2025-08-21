import React from "react";
import { SafeAreaView, View, StyleSheet, ScrollView } from "react-native";
import Title from "../components/Title";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CardChart from "../components/CardChart";
import BarchartComponent, { BarChartData } from "../components/BarChart";


const prodUsageData: BarChartData = {
  labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
  legend: ["Production", "Energy Usage"],
  data: [
    [195, 130],  // Week 1 Production, Usage
    [210, 160],  // Week 2
    [200, 135],  // Week 3
    [220, 170],  // Week 4
  ],
  barColors: ["#22c55e", "#6b7280"], 
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
      
          <View style={styles.graphRow}>
           <View style={styles.graphBlock}>
              <CardChart title="Performance Monitoring (System Efficiency)">
                <BarchartComponent data={prodUsageData} width={640} height={280} />
              </CardChart>
            </View>
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