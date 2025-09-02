import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Menu } from 'lucide-react-native';

type DropdownMenuProps = {
  triggerType?: 'icon' | 'text'; 
  triggerLabel?: string;
  navigateTo: (screen: string) => void;
  isVisible?: boolean; 
  onToggle?: () => void; 
};

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  triggerType,
  triggerLabel = 'User',
  navigateTo,
  isVisible,
  onToggle,
}) => {
  const [internalVisible, setInternalVisible] = useState(false);
  const menuVisible = isVisible ?? internalVisible;

  const toggleMenu = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalVisible((prev) => !prev);
    }
  };

  return (
    <View style={styles.wrapper}>
      
      {triggerType && (
        <TouchableOpacity onPress={toggleMenu}>
          {triggerType === 'icon' ? (
            <Menu color="#333" size={28} />
          ) : (
            <Text style={styles.triggerText}>{triggerLabel}</Text>
          )}
        </TouchableOpacity>
      )}

      {/* Dropdown menu */}
      {menuVisible && (
        <View style={styles.dropdownContainer}>
          {['Home', 'Login', 'Register', 'Contact Us'].map((label) => (
            <TouchableOpacity key={label} onPress={() => navigateTo(label)}>
              <Text style={styles.menuItem} numberOfLines={1}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default DropdownMenu;

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    zIndex: 9999,
  },
  triggerText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownContainer: {
    position: 'absolute',
    top: 36,
    right: 0,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 140,
    zIndex: 9999,
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  menuItem: {
    paddingVertical: 8,
    fontSize: 16,
    color: '#333',
    maxWidth: 200,
  },
});

