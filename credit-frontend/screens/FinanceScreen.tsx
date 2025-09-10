import React,{ useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, ScrollView, Switch } from "react-native";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Title from "../components/Title";
import { useNavigation } from '@react-navigation/native';
import DropdownMenu from '../components/DropdownMenu';

export default function FinanceScreen() {
  const navigation = useNavigation();
  const navigateTo = (screen: string) => {
    navigation.navigate(screen as never);
  };
  const [enable, setEnable] = useState(true);

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
        <View style={styles.titleRow}>
        <Title title="Energy as a Service (EaaS)" subtitle="" />
        <DropdownMenu triggerType="icon" navigateTo={navigateTo} />
        </View>

        {/* Control card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>System Monitoring Control</Text>
          <View style={[styles.row, styles.toggleRow]}>
            <Text style={[styles.rowLabel, { flex: 1 }]}>Enable/Disable</Text>
            <Switch
              value={enable}
              onValueChange={setEnable}
              trackColor={{ false: "#ccc", true: "#22c55e" }}
              thumbColor={"#fff"}
              style={{ marginLeft: "auto" }}
            />
          </View>
        </View>

        <View style={styles.card}>
          <FinanceRow
            label="Initial PV Estimation"
            description="Initial PV cost estimation"
          />
          <FinanceRow
            label="Real-time Estimation"
            description="Real-time estimation of current energy costs."
          />
          <FinanceRow
            label="User Profile"
            description="Detailed user-related financial information and energy usage."
            subItems={[
              "ID: 123456",
              "Energy as a User: 150 kWh",
              "Cost: £245.00",
            ]}
          />
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Footer currentPage="Finance" />
      </View>
    </SafeAreaView>
  );
}

type RowProps = {
  label: string;
  description?: string;
  onPress?: () => void;
  subItems?: string[];
};

const FinanceRow = ({ label, description, subItems }: RowProps) => (
  <View style={styles.row}>
    <View style={{ flex: 1 }}>
      <Text style={styles.rowLabel}>{label}</Text>
      {description && <Text style={styles.rowDescription}>{description}</Text>}
      {subItems &&
        subItems.map((item, index) => (
          <Text key={index} style={styles.subItem}>
            • {item}
          </Text>
        ))}
    </View>
  </View>
);


const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff" 
  },
  header: {},
  scrollContent: { 
    flex: 1, 
    paddingHorizontal: 16 
  },
  pageTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    marginVertical: 12 
  },
  titleRow: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    zIndex: 200, 
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  cardTitle: { 
    fontSize: 16, 
    fontWeight: "600", 
    marginBottom: 12 
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  rowLabel: { 
    fontSize: 14, 
    fontWeight: "500", 
    color: "#111" },
  rowDescription: { 
    fontSize: 12, 
    color: "#6b7280" 
  },
  subItem: { 
    fontSize: 12, 
    color: "#0d0d0eff", 
    marginLeft: 10, 
    marginTop: 2 
  },
  toggleRow: {
    justifyContent: "space-between",
  },
  footer: {},
});

