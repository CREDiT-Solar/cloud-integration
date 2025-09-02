import React, { useState } from "react";
import {  SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Button, Alert, } from "react-native";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ChevronRight } from "lucide-react-native";

export default function AccountScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<string | null>(null);

  // Temp values
  const [userId, setUserId] = useState("guest01");
  const [savedPassword, setSavedPassword] = useState("1234");
  const [savedUsername, setSavedUsername] = useState("Guest");

  const [tempUserId, setTempUserId] = useState(userId);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [tempUsername, setTempUsername] = useState(savedUsername);
  const [usernamePassword, setUsernamePassword] = useState("");

  const openModal = (type: string) => {
    setModalType(type);
    setModalVisible(true);
  };

  const handleSave = () => {
    if (modalType === "password") {
      if (tempUserId !== userId) {
        Alert.alert("Error", "Invalid User ID.");
        return;
      }
      if (currentPassword !== savedPassword) {
        Alert.alert("Error", "Current password is incorrect.");
        return;
      }
      if (newPassword !== confirmPassword) {
        Alert.alert("Error", "New passwords do not match.");
        return;
      }
      if (newPassword.length < 4) {
        Alert.alert("Error", "Password must be at least 4 characters.");
        return;
      }
      setSavedPassword(newPassword);
      Alert.alert("Success", "Password updated!");
    }

    if (modalType === "username") {
      if (usernamePassword !== savedPassword) {
        Alert.alert("Error", "Password is incorrect.");
        return;
      }
      if (tempUsername.trim().length < 2) {
        Alert.alert("Error", "Username must be at least 2 characters.");
        return;
      }
      setSavedUsername(tempUsername);
      Alert.alert("Success", "Username updated!");
    }

    if (modalType === "update") {
      Alert.alert("System", "System update started...");
    }
    if (modalType === "deactivate") {
      Alert.alert("Account", "Your account has been deactivated.");
    }

    setModalVisible(false);
  };

const handleCancel = () => {
    setTempUserId(userId);
    setTempUsername(savedUsername);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setUsernamePassword("");
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Header userName={savedUsername} />
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
            onPress={() => openModal("password")}
          />
          <AccountRow
            label="Change Username"
            description="Change your username here"
            onPress={() => openModal("username")}
          />
          <AccountRow
            label="System Update"
            description="Available to update"
            onPress={() => openModal("update")}
          />
          <AccountRow
            label="Deactivate Account"
            description="If you deactivate your account, all your settings will be lost."
            onPress={() => openModal("deactivate")}
          />
        </View>

      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Footer currentPage="Account" />
      </View>

      {/* Custom Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {modalType === "password" && (
              <>
                <Text style={styles.modalTitle}>Change Password</Text>
                 <TextInput
                  style={styles.input}
                  placeholder="User ID"
                  value={tempUserId}
                  onChangeText={setTempUserId}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Current Password"
                  secureTextEntry
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                />
                <TextInput
                  style={styles.input}
                  placeholder="New Password"
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm New Password"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </>
            )}

            {modalType === "username" && (
              <>
                <Text style={styles.modalTitle}>Change Username</Text>
                <TextInput
                  style={styles.input}
                  placeholder="New Username"
                  value={tempUsername}
                  onChangeText={setTempUsername}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  secureTextEntry
                  value={usernamePassword}
                  onChangeText={setUsernamePassword}
                />
              </>
            )}

            {modalType === "update" && (
              <>
                <Text style={styles.modalTitle}>System Update</Text>
                <Text>Do you want to update the system now?</Text>
              </>
            )}

            {modalType === "deactivate" && (
              <>
                <Text style={styles.modalTitle}>Deactivate Account</Text>
                <Text>
                  If you deactivate your account, all your settings will be
                  lost. Proceed?
                </Text>
              </>
            )}

            {/* OK / Cancel Buttons */}
            <View style={styles.modalButtons}>
              <Button title="Cancel" color="gray" onPress={handleCancel} />
              <Button title="Save" color="#22c55e" onPress={handleSave} />
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

