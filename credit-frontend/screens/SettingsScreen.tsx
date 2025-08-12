import React from "react";
import { SafeAreaView, View, Text, StyleSheet } from "react-native";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function SettingsScreen() {
  return (
        <View style={styles.container}>
         <Header
         userName="Guest"
       />

    <SafeAreaView style={styles.container}>
      {/* Main */}
      <View style={styles.content}>
       <Text style={styles.text}>Settings Page (Coming Soon)</Text>
     </View>

      {/* Footer */}
      <Footer currentPage="Settings" />
    </SafeAreaView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1, 
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
