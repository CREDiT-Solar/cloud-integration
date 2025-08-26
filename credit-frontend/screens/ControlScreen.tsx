import React, { useState } from "react";
import {  SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Modal, Pressable, Platform } from "react-native";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Picker } from "@react-native-picker/picker";
import { ChevronRight } from "lucide-react-native";
import Slider from "@react-native-community/slider";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function ControlScreen() {
  const [selectedBattery, setSelectedBattery] = useState("Battery 1");
  const [solarInverter, setSolarInverter] = useState(true);
  const [batteryInverter, setBatteryInverter] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<string>("");

  const [socLevel, setSocLevel] = useState(50);
  const [chargeMode, setChargeMode] = useState("Charging");
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [temperature, setTemperature] = useState(30);
  const [autoLoad, setAutoLoad] = useState(true);

  // for PopUp (temporary values)
  const [tempSoc, setTempSoc] = useState(socLevel);
  const [tempChargeMode, setTempChargeMode] = useState(chargeMode);
  const [tempStartTime, setTempStartTime] = useState(startTime);
  const [tempEndTime, setTempEndTime] = useState(endTime);
  const [tempTemp, setTempTemp] = useState(temperature);
  const [tempAutoLoad, setTempAutoLoad] = useState(autoLoad);

  const openDialog = (type: string) => {
    setModalType(type);

    setTempSoc(socLevel);
    setTempChargeMode(chargeMode);
    setTempStartTime(startTime);
    setTempEndTime(endTime);
    setTempTemp(temperature);
    setTempAutoLoad(autoLoad);
    setModalVisible(true);
  };

  const saveDialog = () => {
    if (modalType === "soc") setSocLevel(tempSoc);
    if (modalType === "charge") setChargeMode(tempChargeMode);
    if (modalType === "schedule") {
      setStartTime(tempStartTime);
      setEndTime(tempEndTime);
    }
    if (modalType === "temp") setTemperature(tempTemp);
    if (modalType === "load") setAutoLoad(tempAutoLoad);

    setModalVisible(false);
    setModalType("");
  };

  const cancelDialog = () => {
    setModalVisible(false);
    setModalType("");
  };

  // Time picker for web
  const renderWebTimePicker = (
    label: string,
    date: Date,
    setDate: (date: Date) => void
  ) => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const minutes = Array.from({ length: 60 }, (_, i) => i);

    return (
      <View style={{ marginVertical: 8 }}>
        <Text>{label}</Text>
        <View style={{ flexDirection: "row" }}>
          <Picker
            selectedValue={date.getHours()}
            style={{ flex: 1 }}
            onValueChange={(h) => {
              const newDate = new Date(date);
              newDate.setHours(h as number);
              setDate(newDate);
            }}
          >
            {hours.map((h) => (
              <Picker.Item key={h} label={`${h}h`} value={h} />
            ))}
          </Picker>
          <Picker
            selectedValue={date.getMinutes()}
            style={{ flex: 1 }}
            onValueChange={(m) => {
              const newDate = new Date(date);
              newDate.setMinutes(m as number);
              setDate(newDate);
            }}
          >
            {minutes.map((m) => (
              <Picker.Item key={m} label={`${m}m`} value={m} />
            ))}
          </Picker>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Header userName="Admin" />
      </View>

      {/* Main ScrollView */}
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>System Control</Text>
        <Text style={styles.subTitle}>System control for Admin</Text>

        {/* Battery Setting Panel */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Battery Setting Panel</Text>

          {/* Select Battery */}
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Select Battery</Text>
            <View style={styles.pickerBox}>
              <Picker
                selectedValue={selectedBattery}
                onValueChange={(itemValue) => setSelectedBattery(itemValue)}
                style={{ height: 40, width: 100 }}
              >
                <Picker.Item label="Battery 1" value="Battery 1" />
                <Picker.Item label="Battery 2" value="Battery 2" />
                <Picker.Item label="Battery 3" value="Battery 3" />
                <Picker.Item label="Battery 4" value="Battery 4" />
                <Picker.Item label="Battery 5" value="Battery 5" />
              </Picker>
            </View>
          </View>

          {/* Other Settings */}
          <ControlRow
            label="Battery SOC Setting"
            description="Set the battery level (20% ~ 90%)"
            onPress={() => openDialog("soc")}
          />
          <ControlRow
            label="Charging/Discharging"
            description="Control charging/discharging"
            onPress={() => openDialog("charge")}
          />
          <ControlRow
            label="Schedule Charging/Discharging time"
            description="Manage charging/discharging time"
            onPress={() => openDialog("schedule")}
          />
          <ControlRow
            label="Temperature Protection"
            description="Set temperature limits for battery protection"
            onPress={() => openDialog("temp")}
          />
        </View>

        {/* Device Control Panel */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Device Control Panel</Text>

          {/* Solar Inverter */}
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowLabel}>Solar Inverter</Text>
              <Text style={styles.rowDescription}>Turn on/off</Text>
            </View>
            <Switch
              value={solarInverter}
              onValueChange={setSolarInverter}
              trackColor={{ false: "#ccc", true: "#22c55e" }}
              thumbColor={"#fff"}
            />
          </View>

          {/* Battery Inverter */}
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowLabel}>Battery Inverter</Text>
              <Text style={styles.rowDescription}>Turn on/off</Text>
            </View>
            <Switch
              value={batteryInverter}
              onValueChange={setBatteryInverter}
              trackColor={{ false: "#ccc", true: "#22c55e" }}
              thumbColor={"#fff"}
            />
          </View>

          {/* Smart Load Control */}
          <ControlRow
            label="Smart Load Control"
            description="Control or automate the use of electrical devices"
            onPress={() => openDialog("load")}
          />
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Footer currentPage="Control" />
      </View>

      {/* Modal with Custom UI */}
      <Modal transparent={true} visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            {modalType === "soc" && (
              <>
                <Text style={styles.modalTitle}>Battery SOC Setting</Text>
                <Slider
                  style={{ width: 250, height: 40 }}
                  minimumValue={20}
                  maximumValue={90}
                  step={1}
                  value={tempSoc}
                  onValueChange={setTempSoc}
                  minimumTrackTintColor="#22c55e"
                  maximumTrackTintColor="#ccc"
                />
                <Text>{tempSoc}%</Text>
              </>
            )}

            {modalType === "charge" && (
              <>
                <Text style={styles.modalTitle}>Charging / Discharging</Text>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    tempChargeMode === "Charging" && styles.radioSelected,
                  ]}
                  onPress={() => setTempChargeMode("Charging")}
                >
                  <Text>Charging</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    tempChargeMode === "Discharging" && styles.radioSelected,
                  ]}
                  onPress={() => setTempChargeMode("Discharging")}
                >
                  <Text>Discharging</Text>
                </TouchableOpacity>
              </>
            )}

            {modalType === "schedule" && (
              <>
                <Text style={styles.modalTitle}>Set Schedule</Text>
                {Platform.OS === "web" ? (
                  <>
                    {renderWebTimePicker("Start Time:", tempStartTime, setTempStartTime)}
                    {renderWebTimePicker("End Time:", tempEndTime, setTempEndTime)}
                  </>
                ) : (
                  <>
                    <Text>Start Time:</Text>
                    <DateTimePicker
                      value={tempStartTime}
                      mode="time"
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      onChange={(event, date) => date && setTempStartTime(date)}
                    />
                    <Text>End Time:</Text>
                    <DateTimePicker
                      value={tempEndTime}
                      mode="time"
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      onChange={(event, date) => date && setTempEndTime(date)}
                    />
                  </>
                )}
              </>
            )}

            {modalType === "temp" && (
              <>
                <Text style={styles.modalTitle}>Temperature Protection</Text>
                <Slider
                  style={{ width: 250, height: 40 }}
                  minimumValue={10}
                  maximumValue={50}
                  step={1}
                  value={tempTemp}
                  onValueChange={setTempTemp}
                  minimumTrackTintColor="#22c55e"
                  maximumTrackTintColor="#ccc"
                />
                <Text>{tempTemp}℃</Text>
              </>
            )}

            {modalType === "load" && (
              <>
                <Text style={styles.modalTitle}>Smart Load Control</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text>Auto Mode</Text>
                  <Switch
                    value={tempAutoLoad}
                    onValueChange={setTempAutoLoad}
                    trackColor={{ false: "#ccc", true: "#22c55e" }}
                  />
                </View>
              </>
            )}

            <View style={styles.modalButtonRow}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={cancelDialog}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.modalButton} onPress={saveDialog}>
                <Text style={styles.modalButtonText}>Save</Text>
              </Pressable>
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
    marginTop: 12 
  },
  subTitle: { 
    fontSize: 14, 
    color: "#6b7280", 
    marginBottom: 12 
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
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  rowLabel: { 
    fontSize: 14, 
    fontWeight: "500", 
    color: "#111" 
  },
  rowDescription: { 
    fontSize: 12, 
    color: "#6b7280" 
  },
  pickerBox: {
    borderWidth: 1,
    borderColor: "#22c55e",
    borderRadius: 4,
    overflow: "hidden",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    width: "85%",
    alignItems: "center",
  },
  modalTitle: { 
    fontSize: 16, 
    fontWeight: "600", 
    marginBottom: 8 
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    width: "100%",
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: "#22c55e",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: "center",
  },
  modalButtonText: { 
    color: "#fff", 
    fontWeight: "600" 
  },
  cancelButton: { 
    backgroundColor: "#e5e7eb" 
  },
  cancelButtonText: { 
    color: "#111", 
    fontWeight: "600" },
  radioButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginVertical: 5,
    width: 150,
    alignItems: "center",
  },
  radioSelected: { 
    borderColor: "#22c55e", 
    backgroundColor: "#e6f9f0" 
  },
  footer: {},
});

