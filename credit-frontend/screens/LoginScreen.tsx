import React, { useState } from "react";
import {View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Switch } from "react-native";
import { useNavigation } from "@react-navigation/native";
import DropdownMenu from "../components/DropdownMenu";
import { Picker } from "@react-native-picker/picker";
import { useAuth } from "../components/AuthContext";

export default function LoginScreen() {
  const navigation = useNavigation();
  const navigateTo = (screen: string) => {
    navigation.navigate(screen as never);
  };

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState("User");

  const handleLogin = () => {
    console.log({ email, password, rememberMe, selectedUserType });

    login(email || "Guest", selectedUserType as any);

  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={{ width: 28 }} />
          <DropdownMenu triggerType="icon" navigateTo={navigateTo} />
        </View>

        {/* Title */}
        <Text style={styles.title}>CREDiT Digi Solution</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>

        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Remember Me */}
        <View style={styles.rememberRow}>
          <Switch value={rememberMe} onValueChange={setRememberMe} />
          <Text style={styles.rememberText}>Remember me</Text>
        </View>

        {/* User Type Picker */}
        <Text style={styles.label}>Select User Type</Text>
        <View style={styles.pickerBox}>
          <Picker
            selectedValue={selectedUserType}
            onValueChange={(itemValue) => setSelectedUserType(itemValue)}
            style={{ height: 44 }}
          >
            <Picker.Item label="User" value="User" />
            <Picker.Item label="Admin" value="Admin" />
            <Picker.Item label="Technician" value="Technician" />
            <Picker.Item label="Site Owner" value="Site Owner" />
            <Picker.Item label="Site Manager" value="Site Manager" />
            <Picker.Item label="Finance Manager" value="Finance Manager" />
          </Picker>
        </View>

        {/* Login Button */}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        {/* Links */}
        <Text style={styles.link} onPress={() => navigateTo("ForgotPassword")}>
          Forgot your password?
        </Text>
        <Text style={styles.signUpText}>
          Don't have an account?{" "}
          <Text
            style={styles.signUpLink}
            onPress={() => navigateTo("Register")}
          >
            Sign up here
          </Text>
        </Text>

        <Text style={styles.footerText}>
          Enter your email address and password to continue
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f3f4f6",
  },
  card: {
    backgroundColor: "#fff",
    width: "70%",
    alignSelf: "center",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  header: { 
    flexDirection: "row", 
    justifyContent: "space-between" 
  },
  title: { 
    fontSize: 20, 
    fontWeight: "bold", 
    textAlign: "center", 
    marginTop: 10 
  },
  subtitle: { 
    fontSize: 14, 
    color: "#555", 
    textAlign: "center", 
    marginBottom: 20 
  },
  label: { 
    marginTop: 12, 
    fontSize: 14, 
    fontWeight: "500", 
    color: "#111" 
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
  },
  rememberRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginTop: 12 
  },
  rememberText: { 
    marginLeft: 8, 
    fontSize: 14, 
    color: "#555" 
  },
  pickerBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginTop: 4,
  },
  button: {
    backgroundColor: "#16a34a",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
  link: { 
    marginTop: 14, 
    fontSize: 14, 
    color: "#16a34a", 
    textAlign: "center" 
  },
  signUpText: { 
    marginTop: 10, 
    textAlign: "center", 
    fontSize: 14 
  },
  signUpLink: { 
    color: "#16a34a", 
    fontWeight: "bold" 
  },
  footerText: { 
    marginTop: 20, 
    fontSize: 12, 
    textAlign: "center", 
    color: "#666" 
  },
});
