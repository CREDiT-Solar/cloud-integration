import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../App'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DropdownMenu from '../components/DropdownMenu';
import { Picker } from "@react-native-picker/picker";

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const navigateTo = (screen: string) => {
    navigation.navigate(screen as never);
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("User");

  const handleLogin = () => {
    console.log({ email, password, rememberMe, selectedUserId });
    navigation.navigate('Home');
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
            selectedValue={selectedUserId}
            onValueChange={(itemValue) => setSelectedUserId(itemValue)}
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

        {/* Footer */}
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
    backgroundColor: "#f0f6ff",
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    width: "70%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 8,
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
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  rememberText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#111",
  },
  pickerBox: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#16a34a",
    borderRadius: 6,
    paddingVertical: 12,
    marginTop: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 15,
  },
  link: {
    color: "#16a34a",
    fontSize: 14,
    textAlign: "center",
    marginTop: 12,
  },
  signUpText: {
    textAlign: "center",
    marginTop: 8,
    fontSize: 13,
    color: "#374151",
  },
  signUpLink: {
    color: "#16a34a",
    fontWeight: "600",
  },
  footerText: {
    fontSize: 12,
    textAlign: "center",
    color: "#6b7280",
    marginTop: 12,
  },
});