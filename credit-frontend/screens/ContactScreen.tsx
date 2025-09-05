import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DropdownMenu from '../components/DropdownMenu';

export default function ContactScreen() {
  const [userId, setUserId] = useState("");

  const navigation = useNavigation();
  const navigateTo = (screen: string) => {
    navigation.navigate(screen as never);
  };

  return (
<ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={{ width: 28 }} />
        <DropdownMenu triggerType="icon" navigateTo={navigateTo} />
        </View>   

        <Text style={styles.title}>Contact Us</Text>


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
    width: '70%',
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
});