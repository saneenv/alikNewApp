import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import PropTypes from "prop-types";
import styles from "./styles";
import MenuButton from "../MenuButton/MenuButton";
import { useAuth } from '../AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DrawerContainer(props) {

  const { navigation } = props;

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
      navigation.closeDrawer();
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
          source={require("../../../assets/home.png")}
          onPress={() => {
            navigation.navigate("Home");
            navigation.closeDrawer();
          }}
        />
        <MenuButton
          title="SEARCH"
          source={require("../../../assets/searchnew.png")}
          onPress={() => {
            navigation.navigate("Search");
            navigation.closeDrawer();
          }}
        />
        {customerType !== "CUSTOMER" && (
          <MenuButton
            title="DASHBOARD"
            source={require("../../../assets/dashboard.png")}
            onPress={() => {
              navigation.navigate("Dashboard");
              navigation.closeDrawer();
            }}
          />
        )}
        {customerType !== "CUSTOMER" && (
          <MenuButton
            title="Order List"
            source={require("../../../assets/order.png")}
            onPress={() => {
              navigation.navigate("Orders");
              navigation.closeDrawer();
            }}
          />
        )}
        {customerType !== "AGENT" && (
          <MenuButton
            title="CART"
            source={require("../../../assets/cart.png")}
            onPress={() => {
              navigation.navigate("Cart");
              navigation.closeDrawer();
            }}
          />
        )}
        <MenuButton
          title="ABOUT US"
          source={require("../../../assets/about.png")}
          onPress={() => {
            navigation.navigate("About");
            navigation.closeDrawer();
          }}
        />
        {customerType !== "AGENT" && (
          <MenuButton
            title="Receipt"
            source={require("../../../assets/cart.png")}
            onPress={() => {
              navigation.navigate("Receipt");
              navigation.closeDrawer();
            }}
          />
        )}
        <MenuButton
          title="LOGOUT"
          source={require("../../../awssets/logout.png")}
          onPress={handleLogout}
        />
      </View>
    </View>
  );
}

DrawerContainer.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    closeDrawer: PropTypes.func.isRequired,
  }),
  userData: PropTypes.shape({
    customerType: PropTypes.string,
    // Add other propTypes for userData properties if needed
  }),
};
