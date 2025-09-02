import React, { useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, ScrollView, Switch } from "react-native";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function FinanceScreen() {
  const [enable, setEnable] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Header userName="Finance Manager" />
      </View>

      {/* Main ScrollView */}
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Energy as a Service (EaaS)</Text>

        {/* Finance Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Finance</Text>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowLabel}>Enable/Disable</Text>
            </View>
            <Switch
              value={enable}
              onValueChange={setEnable}
              trackColor={{ false: "#ccc", true: "#22c55e" }}
              thumbColor={"#fff"}
            />
          </View>
          <FinanceRow
            label="Initial PV Estimation"
            description=""
          />
          <FinanceRow
            label="real-time Estimation"
            description=""
          />
          <FinanceRow
            label="User Profile"
            description=""
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
};

const FinanceRow = ({ label, description }: RowProps) => (
  <View style={styles.row}>
    <View style={{ flex: 1 }}>
      <Text style={styles.rowLabel}>{label}</Text>
      {description && <Text style={styles.rowDescription}>{description}</Text>}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {},
  scrollContent: { flex: 1, paddingHorizontal: 16 },
  pageTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 12 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  cardTitle: { fontSize: 16, fontWeight: "600", marginBottom: 12 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  rowLabel: { fontSize: 14, fontWeight: "500", color: "#111" },
  rowDescription: { fontSize: 12, color: "#6b7280" },
  footer: {},
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});

