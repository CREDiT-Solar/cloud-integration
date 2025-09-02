import React, { useState, useCallback } from "react";
import {  SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Modal, Platform } from "react-native";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Slider from "@react-native-community/slider";
import { ChevronRight } from "lucide-react-native";

type FaultStatus = "ok" | "fault";

export default function FaultScreen() {
  const [enable, setEnable] = useState(true);

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [tempSoh, setTempSoh] = useState<number>(20); 
  const [sohThreshold, setSohThreshold] = useState<number>(20); 

  const faultStatus: Record<string, FaultStatus> = {
    pvModule: "ok",
    inverter: "ok",
    temperature: "ok",
    batteryThreshold: "ok",
    batteryController: "ok",
    gateway: "ok",
    processor: "ok",
    preDataManager: "ok",
  };

  const openDialog = useCallback(() => {
    setModalVisible(true);
  }, []);

  const saveDialog = useCallback(() => {
    setSohThreshold(tempSoh); 
    setModalVisible(false);
  }, [tempSoh]);

  const cancelDialog = useCallback(() => {
    setModalVisible(false);
  }, []);

  const renderSlider = () => {
    if (Platform.OS === "web") {
      return (
        <input
          type="range"
          min={10}
          max={100}
          step={1}
          value={String(tempSoh)}
          onChange={(e: any) => {
            const v = Number(e.target.value);
            if (!Number.isNaN(v)) setTempSoh(v);
          }}
          onInput={(e: any) => {
            const v = Number(e.currentTarget.value);
            if (!Number.isNaN(v)) setTempSoh(v);
          }}
          style={{
            width: 280,
            accentColor: "#22c55e",
          }}
        />
      );
    } else {

      return (
        <Slider
          style={{ width: 280, height: 40 }}
          minimumValue={10}
          maximumValue={100}
          step={1}
          value={tempSoh}
          onValueChange={(value) => setTempSoh(value)}
          onSlidingComplete={(value) => setTempSoh(value)}
          minimumTrackTintColor="#22c55e"
          maximumTrackTintColor="#ccc"
        />
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Header userName="Technician" />
      </View>

      {/* Main */}
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Fault Monitoring</Text>

        {/* Control card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>System Monitoring Control</Text>
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
        </View>

        {/* PV */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>PV System</Text>
          <FaultRow
            label="PV Module Faults"
            description="Detect shading, mismatch, or disconnection"
            status={faultStatus.pvModule}
          />
          <FaultRow
            label="Inverter Faults"
            description="Monitor DC-AC conversion errors"
            status={faultStatus.inverter}
          />
        </View>

        {/* Weather */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Weather Sensors</Text>
          <FaultRow
            label="Temperature Sensor"
            description="Faulty readings, sensor disconnection"
            status={faultStatus.temperature}
          />
        </View>

        {/* Battery */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Battery System</Text>

          <ControlRow
            label="Battery SoH"
            description={`Threshold: ${sohThreshold}%`}
            onPress={openDialog}
          />

          <FaultRow
            label="Capacity Threshold"
            description="Alert when below minimum set capacity"
            status={faultStatus.batteryThreshold}
          />
          <FaultRow
            label="Battery Controller"
            description="Fault detection in BMS/communication"
            status={faultStatus.batteryController}
          />
        </View>

        {/* Electronics */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Electronics & Control</Text>
          <FaultRow
            label="Inverter"
            description="Hardware/software error detection"
            status={faultStatus.inverter}
          />
          <FaultRow
            label="Gateway"
            description="Data transfer faults or downtime"
            status={faultStatus.gateway}
          />
          <FaultRow
            label="Processor (RPi)"
            description="System processing unit failure"
            status={faultStatus.processor}
          />
          <FaultRow
            label="Pre Data Manager"
            description="Faults in preprocessing or logging"
            status={faultStatus.preDataManager}
          />
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Footer currentPage="Fault" />
      </View>

      {/* SoH Modal */}
      <Modal transparent={true} visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Battery SoH Threshold</Text>

            {renderSlider()}

            <Text style={{ marginTop: 8, marginBottom: 4 }}>{tempSoh}%</Text>

            <View style={styles.modalButtonRow}>
              <TouchableOpacity style={styles.modalButton} onPress={saveDialog}>
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={cancelDialog}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

type RowProps = {
  label: string;
  description?: string;
  status?: FaultStatus;
  onPress?: () => void;
};

const ControlRow = ({ label, description, onPress }: RowProps) => (
  <TouchableOpacity style={styles.row} onPress={onPress}>
    <View style={{ flex: 1 }}>
      <Text style={styles.rowLabel}>{label}</Text>
      {description && <Text style={styles.rowDescription}>{description}</Text>}
    </View>
    <ChevronRight size={20} color="#22c55e" />
  </TouchableOpacity>
);

const FaultRow = ({ label, description, status, onPress }: RowProps) => (
  <TouchableOpacity onPress={onPress} disabled={!onPress} activeOpacity={0.7}>
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        {description && <Text style={styles.rowDescription}>{description}</Text>}
      </View>
      {status && (
        <Text style={status === "ok" ? styles.statusOk : styles.statusFault}>
          {status === "ok" ? "🟢 OK" : "🔴 Fault"}
        </Text>
      )}
    </View>
  </TouchableOpacity>
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
  statusOk: { fontSize: 14, fontWeight: "600", color: "#22c55e" },
  statusFault: { fontSize: 14, fontWeight: "600", color: "#dc2626" },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "85%",
    alignItems: "center",
  },
  modalTitle: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    width: "100%",
    gap: 8,
  },
  modalButton: {
    flex: 1,
    backgroundColor: "#22c55e",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtonText: { color: "#fff", fontWeight: "700" },
  cancelButton: { backgroundColor: "#e5e7eb" },
  cancelButtonText: { color: "#111", fontWeight: "700" },
});
