import React, { useState } from 'react';
import {View, Text, StyleSheet, Image, ScrollView} from 'react-native';
import { Zap } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import DropdownMenu from '../components/DropdownMenu';

export default function LandingScreen() {
  const navigation = useNavigation();

  const navigateTo = (screen: string) => {
    navigation.navigate(screen as never);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={{ width: 28 }} />
          <View style={styles.iconBox}>
            <Zap color="white" size={28} />
          </View>
        <DropdownMenu triggerType="icon" navigateTo={navigateTo} />
        </View>   

        <Text style={styles.title}>CREDiT Digi Solution</Text>
        <Text style={styles.subtitle}>
          Monitor your solar energy system with real-time data and insights
        </Text>

        <Text style={styles.infoText}>
          Credit Digi Solution is a cutting-edge platform that creates a digital twin of your PV/Battery installation.
         
          This platform is customized for African energy landscapes, it helps communities, businesses, and operators 
          optimize performance, cut costs, and ensure energy resilience.
        </Text>

        {/* Logos */}
        <Text style={styles.partnersTitle}>Partners</Text>
        <View style={styles.logosContainer}>
          <Image source={require('../assets/york_logo.png')} style={styles.logo} resizeMode="contain" />
          <Image source={require('../assets/chipembi_logo.jpg')} style={styles.logo} resizeMode="contain" />
          <Image source={require('../assets/lilongwe_logo.jpg')} style={styles.logo} resizeMode="contain" />
          <Image source={require('../assets/mombasa_logo.png')} style={styles.logo} resizeMode="contain" />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
    flex: 1,       
    padding: 24,
    alignItems: 'center',
    justifyContent: 'flex-start', 
  },
  card: {
    width: '65%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    justifyContent: 'space-between', 
  },
  header: {
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
    color: '#111827',
  },
  subtitle: {
    fontSize: 12,
    textAlign: 'center',
    color: '#6B7280',
    marginVertical: 6,
  },
  infoText: {
    fontSize: 14,
    marginTop: 10,
    color: '#111',
    fontWeight: '500',
  },
    partnersTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333", 
    alignSelf: "center", 
    marginTop: 30,
  },
    logosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10, 
  },
  logo: {
    width: 60,
    height: 60,
    marginHorizontal: 4,
  },
});





