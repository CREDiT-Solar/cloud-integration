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
import { getRequest, postRequest } from '../util/isa-util';
import { useNavigation } from '@react-navigation/native';
import DropdownMenu from '../components/DropdownMenu';

const pieData: PieDataItem[] = [
  { name: "Solar", population: 35, color: "#22c55e", legendFontColor: "#111", legendFontSize: 12 },
  { name: "Battery", population: 25, color: "#3b82f6", legendFontColor: "#111", legendFontSize: 12 },
  { name: "Usage", population: 15, color: "#6b7280", legendFontColor: "#111", legendFontSize: 12 },
  { name: "Grid", population: 25, color: "#f59e42", legendFontColor: "#111", legendFontSize: 12 }
];

interface DaySolarProd {
  ts: string;       // "YYYY-MM-DD HH:mm:ss"
  site_kW: number;
}

export default function HomeScreen() {
  const navigation = useNavigation()
  const navigateTo = (screen: string) => {
    navigation.navigate(screen as never);
  };

  const [solarProd, setSolarProd] = useState<number | null>(null);
  const [batterySOC, setBatterySOC] = useState<number | null>(null);
  const [energyUsage, setEnergyUsage] = useState<number | null>(null);
  const [lineChartData, setLineChartData] = useState<LineChartData | null>(null);

  useEffect(() => {
    // Current solar production
    async function fetchSolarProd() {
      try {
        const data = await getRequest("/current_solar_prod");
        console.log("Fetched current_solar_prod:", data);
        // [ { "site_kW_5min_avg": 55.33 } ]
        if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && data[0] !== null) {
          const value = (data[0] as any).site_kW_5min_avg;
          if (typeof value === 'number') setSolarProd(value);
        }
      } catch (err) {
        console.error("Error fetching solar production:", err);
      }
    }
    fetchSolarProd();

    // Battery SOC
    async function fetchBatterySoc() {
      try {
        const data = await getRequest("/get_battery_percentage");
        console.log("Fetched get_battery_percentage:", data);
        // { "battery_percentage": 64.16 }
        if (data && typeof data === "object" && "battery_percentage" in data) {
          const value = (data as any).battery_percentage;
          if (typeof value === 'number') setBatterySOC(value);
        }
      } catch (err) {
        console.error("Error fetching battery SOC:", err);
      }
    }
    fetchBatterySoc();

    // Current load
    async function fetchCurrentLoad() {
      try {
        const data = await getRequest("/current_load");
        console.log("Fetched current_load:", data);
        // { "current_load": 2.16614 }
        if (data && typeof data === "object" && "current_load" in data) {
          const value = (data as any).current_load;
          if (typeof value === 'number') setEnergyUsage(value);
        }
      } catch (err) {
        console.error("Error fetching current load:", err);
      }
    }
    fetchCurrentLoad();

    // Day solar production for line chart
    async function fetchDaySolarProd() {
      try {
        const data = await postRequest("/historical_solar_prod", { period: "day" });
        console.log("Fetched historical_solar_prod:", data);

        const list: DaySolarProd[] | undefined = data?.historical_solar_prod;
        if (!Array.isArray(list) || list.length === 0) return;

        const prodData = [...list].sort((a, b) => (a.ts > b.ts ? 1 : -1));
        const labels = prodData.map((item) => item.ts.slice(11, 16));
        const productionValues = prodData.map((item) => item.site_kW);

        const usageData = [25, 58, 70, 65, 52, 42, 32, 56, 59, 62, 66, 68, 78, 82, 85, 87, 65, 50];
        const usageValues = usageData.slice(0, prodData.length); 

        const chartData: LineChartData = {
          labels,
          datasets: [
            {
              data: productionValues,
              strokeWidth: 2,
              color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`, // green
            },
            {
              data: usageValues,
              strokeWidth: 2,
              color: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`, // gray
            },
          ],
          legend: ["Production (kW)", "Usage (kW)"],
        };

        setLineChartData(chartData);
      } catch (err) {
        console.error("Error fetching historical solar production:", err);
      }
    }
    fetchDaySolarProd();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
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
          <Title title="System Overview" subtitle="Monitor your solar energy performance" />
          <DropdownMenu triggerType="icon" navigateTo={navigateTo} />
          </View>

          <View style={styles.row}>
            <CardReadout
              title="Solar Production"
              value={solarProd !== null ? solarProd.toFixed(2) : "--"}
              units="kW"
              subtitle="Current"
              icon={<Zap size={38} color="#22c55e" />}
            />
            <CardReadout
              title="Battery SOC"
              value={batterySOC !== null ? batterySOC.toFixed(2) : "--"}
              units="%"
              subtitle="Charging"
              icon={<Battery size={38} color="#3b82f6" />}
            />
            <CardReadout
              title="Energy Usage"
              value={energyUsage !== null ? energyUsage.toFixed(2) : "--"}
              units="kW"
              subtitle="Current Load"
              icon={<Home size={38} color="#6b7280" />}
            />
            <CardReadout
              title="Grid Status"
              value="--"
              units="kW"
              subtitle="Offline"
              icon={<Image source={require("../assets/grid.png")} style={{ width: 40, height: 40 }} resizeMode="contain" />}
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
                {lineChartData ? (
                  <LineChartComponent data={lineChartData} width={440} height={280} />
                ) : null}
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
    backgroundColor: '#fff' 
  },
  header: {},
  scrollContent: { 
    flex: 1 
  },
  content: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
  },
  titleRow: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    zIndex: 200, 
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
    flex: 1 
  },
  footer: {},
});


