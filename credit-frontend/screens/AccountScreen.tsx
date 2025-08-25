import React from "react";
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import Title from "../components/Title";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ChevronRight } from "lucide-react-native";

export default function AccountScreen() {
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
        <Text style={styles.pageTitle}>User Page</Text>

        {/* Manage Account Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Manage your account</Text>


          <AccountRow
            label="Change Password"
            description="Change your password here"
            onPress={() => console.log("Change Password")}
          />
          <AccountRow
            label="Change Username"
            description="Change your username here"
            onPress={() => console.log("Change Username")}
          />
          <AccountRow
            label="System Update"
            description="Available to update"
            onPress={() => console.log("System Update")}
          />
          <AccountRow
            label="Deactivate Account"
            description="If you deactivate your account, all your settings will be lost."
            onPress={() => console.log("Deactivate Account")}
          />
        </View>

        {/* Finance Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Finance</Text>

          <FinanceRow
            label="Electricity Access Time"
            description="Electricity availability hours this month"
          />
          <FinanceRow
            label="Energy Saving"
            description="Energy cost savings this month"
          />
          <FinanceRow
            label="Estimated Lifetime Savings"
            description="Estimated total cost savings over 10 years"
          />
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Footer currentPage="Account" />
      </View>
    </SafeAreaView>
  );
}

type RowProps = {
  label: string;
  description?: string;
  onPress?: () => void;
};

const AccountRow = ({ label, description, onPress }: RowProps) => (
  <TouchableOpacity style={styles.row} onPress={onPress}>
    <View style={{ flex: 1 }}>
      <Text style={styles.rowLabel}>{label}</Text>
      {description && <Text style={styles.rowDescription}>{description}</Text>}
    </View>
    <ChevronRight size={20} color="#22c55e" />
  </TouchableOpacity>
);

const FinanceRow = ({ label, description }: RowProps) => (
  <View style={styles.row}>
    <View style={{ flex: 1 }}>
      <Text style={styles.rowLabel}>{label}</Text>
      {description && <Text style={styles.rowDescription}>{description}</Text>}
    </View>
  </View>
);

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
    paddingHorizontal: 16,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 12,
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
    marginBottom: 12,
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
    color: "#111",
  },
  rowDescription: {
    fontSize: 12,
    color: "#6b7280",
  },
  footer: {
    // style for footer
  },
});

