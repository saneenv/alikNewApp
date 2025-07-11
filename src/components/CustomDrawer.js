import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import MenuButton from "../components/MenuButton/MenuButton";
import { useAuth } from '../components/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from "prop-types";

const CustomDrawer = ({ isOpen, onClose, navigation }) => {
  if (!isOpen) {
    return null; // Render nothing if drawer is closed
  }
  //   const { navigation } = props;

  const { customerType } = useAuth();

  const { ledName } = useAuth();
  const { logout } = useAuth();


  const handleLogout = async () => {
    try {
      // Delete the 'isActive' value from AsyncStorage
      await AsyncStorage.removeItem('isActive');
      logout();

      // Navigate to the Login screen and close the drawer              
      navigation.navigate('Login');
      onClose();
    } catch (error) {
      console.error('Error during logout:', error);
      // Handle errors
      // ...
    }
  };

  if (customerType === null) {
    return null; // If customerType is null, don't display the drawer
  }

  return (
    <View style={styles.content}>

      <Text style={styles.ledname}>Hi,{ledName}</Text>

      <View style={styles.container}>

        <MenuButton

          title="HOME"
          source={require("../../assets/home.png")}
          // source={{ uri: 'https://i.postimg.cc/FFc0w6KZ/ALIK-LOGO.png' }} 

          onPress={() => {
            navigation.navigate("Home");
            onClose();
          }}
        />
        <MenuButton
          title="SEARCH"
          source={require("../../assets/searchnew.png")}
          onPress={() => {
            navigation.navigate("Search");
            onClose();
          }}
        />
        {customerType !== "CUSTOMER" && (
          <MenuButton
            title="DASHBOARD"
            source={require("../../assets/dashboard.png")}
            onPress={() => {
              navigation.navigate("Dashboard");
              onClose();
            }}
          />
        )}
          {customerType === "CUSTOMER" && (
          <MenuButton
            title="DASHBOARD"
            source={require("../../assets/dashboard.png")}
            onPress={() => {
              navigation.navigate("DashboardCus");
              onClose();
            }}
          />
        )}
        {customerType !== "CUSTOMER" && customerType !== "JS_EMPLOYEE" && customerType !== "JS_MANAGER" && customerType !== "TK_EMPLOYEE" && customerType !== "TK_MANAGER" && (
          <MenuButton
            title="ORDER LIST"
            source={require("../../assets/order.png")}
            onPress={() => {
              navigation.navigate("Orders");
              onClose();
            }}
          />
        )}
        {customerType !== "AGENT" && (
          <MenuButton
            title="CART"
            source={require("../../assets/cart.png")}
            onPress={() => {
              navigation.navigate("Cart");
              onClose();
            }}
          />
        )}
        <MenuButton
          title="ABOUT US"
          source={require("../../assets/about.png")}
          onPress={() => {
            navigation.navigate("About");
            onClose();
          }}
        />
        {customerType !== "AGENT" && (
          <MenuButton
            title="RECEIPT"
            source={require("../../assets/receipts.png")}
            onPress={() => {
              navigation.navigate("Receipt");
              onClose();
            }}
          />
        )}
        <MenuButton
          title="LOGOUT"
          source={require("../../assets/logout.png")}
          onPress={handleLogout}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    position: 'absolute',
    top: 0,
    left: 0, // Adjust to the left side of the screen
    height: '100%',
    width: '70%', // Occupy half of the screen
    backgroundColor: 'white', // Set your desired background color
    zIndex: 10,
    // Other necessary styles
  },

  container: {
    flex: 1,
    alignItems: 'flex-start',
    paddingHorizontal: 60,
    transform: [{ translateY: 70 }],
    gap: 30

  },
  ledname: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 20,

    transform: [{ translateY: 30 }],
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '15',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#3498db',
  },
  menuButtonText: {
    color: '#ffffff',
    marginLeft: 10,
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#e74c3c',
  },
  logoutButtonText: {
    color: '#ffffff',
    marginLeft: 10,
    fontSize: 16,
  },
});

export default CustomDrawer;
