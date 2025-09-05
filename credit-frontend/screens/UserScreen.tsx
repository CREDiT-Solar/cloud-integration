import React, { useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TextInput } from "react-native";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Title from "../components/Title";
import { useNavigation } from '@react-navigation/native';
import DropdownMenu from '../components/DropdownMenu';

export default function UserScreen() {
  const [userId, setUserId] = useState("");

  const navigation = useNavigation();
  const navigateTo = (screen: string) => {
    navigation.navigate(screen as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Header userName="User" />
      </View>

      {/* Main ScrollView */}
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleRow}>
        <Title title="User Dashboard" subtitle="" />
        <DropdownMenu triggerType="icon" navigateTo={navigateTo} />
        </View>

        <View style={styles.card}>
          {/* <Text style={styles.cardTitle}>User ID</Text> */}

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowLabel}>User ID</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your user ID"
                value={userId}
                onChangeText={setUserId}
              />
            </View>
          </View>

          <UserRow
            label="Consumption"
            description="Total energy consumption today"
          />
          <UserRow
            label="Cost of Consumption"
            description="Total cost of consumption today"
          />
          <UserRow
            label="Availability during day"
            description="Energy availability estimation"
          />
          <UserRow
            label="Prediction Energy"
            description="For the next day"
          />
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Footer currentPage="User" />
      </View>
    </SafeAreaView>
  );
}

type RowProps = {
  label: string;
  description?: string;
  onPress?: () => void;
};

const UserRow = ({ label, description }: RowProps) => (
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
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
  },
  titleRow: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    zIndex: 200, 
  },
  iconBox: {
    backgroundColor: '#16A34A',
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    position: 'absolute',
    top: 56,
    right: 0,
    backgroundColor: '#ffffff',   
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 8,
    paddingHorizontal: 12,
    zIndex: 999,                  
    elevation: 16,             
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  menuItem: {
    paddingVertical: 8,
    fontSize: 16,
    color: '#333',
  },
});

