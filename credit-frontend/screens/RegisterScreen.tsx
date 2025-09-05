import React, { useState } from "react";
import {View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Platform, } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";

export default function RegisterScreen() {
  const [userType, setUserType] = useState("user");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigation = useNavigation();

  const handleRegister = () => {
    // TODO: register logic
    console.log({ userType, email, username, password, confirmPassword });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        {/* Title */}
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join Solar Energy System today</Text>

        {/* User Type Picker */}
        <Text style={styles.label}>User Type</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={userType}
            onValueChange={(itemValue) => setUserType(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="User" value="User" />
            <Picker.Item label="Admin" value="Admin" />
            <Picker.Item label="Technician" value="Technician" />
            <Picker.Item label="Site Owner" value="Site Owner" />
            <Picker.Item label="Site Manager" value="Site Manager" />
            <Picker.Item label="Finance Manager" value="Finance Manager" />
          </Picker>
        </View>

        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email address"
          value={email}
          onChangeText={setEmail}
        />

        {/* Username */}
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          value={username}
          onChangeText={setUsername}
        />

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Create a password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Confirm Password */}
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirm your password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {/* Sign In link */}
        <Text style={styles.signInText}>
          Already have an account?{" "}
          <Text
            style={styles.signInLink}
            onPress={() => navigation.navigate("Login" as never)}
          >
            Sign in here
          </Text>
        </Text>

        {/* Register button */}
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        {/* Footer helper text */}
        <Text style={styles.footerText}>
          Enter your email address and password to create your account
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "#f0f6ff",
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 24,
    width: "70%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    marginBottom: 8,
    overflow: "hidden",
  },
  picker: {
    height: 44,
    width: "100%",
    ...Platform.select({
      android: { color: "#111" },
    }),
  },
  signInText: {
    textAlign: "center",
    marginTop: 12,
    fontSize: 13,
    color: "#374151",
  },
  signInLink: {
    color: "#16a34a",
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#16a34a",
    borderRadius: 6,
    paddingVertical: 12,
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 15,
  },
  footerText: {
    fontSize: 12,
    textAlign: "center",
    color: "#6B7280",
    marginTop: 12,
  },
});
