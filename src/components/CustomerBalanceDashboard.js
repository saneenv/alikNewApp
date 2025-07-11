import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth } from '../components/AuthContext';
import MenuImage from "./MenuImage/MenuImage";
import CustomDrawer from '../components/CustomDrawer';

const CustomerBalanceDashboard = ({ navigation }) => {
  const { ledCode } = useAuth();
  const [balance, setBalance] = useState("Loading...");
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen((prevDrawerOpen) => !prevDrawerOpen);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };
  
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://202.21.37.226:86/api/onlineorder/user/balance/JAPAN_ACCESORIES/${ledCode}`
        );
        const data = await response.json();
        
        if (data.success) {
          // Format the balance display
          const balanceParts = data.balance.split(' ');
          const formattedBalance = `₹${balanceParts[0]} ${balanceParts[1] === 'Dr' ? '(Debit)' : '(Credit)'}`;
          setBalance(formattedBalance);
        }
      } catch (error) {
        console.error('Error fetching balance:', error);
        setBalance("Error loading balance");
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [ledCode]);

  useEffect(() => {
    navigation.setOptions({
      headerTitleStyle: {
        fontWeight: "bold",
        textAlign: "center",
        alignSelf: "center",
        flex: 1,
      },
      headerLeft: () => (
        <MenuImage onPress={toggleDrawer} />
      ),
      headerRight: () => <View />,
    });
  }, [navigation]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Your Account Balance</Text>
        
        {loading ? (
          <ActivityIndicator size="large" color="#8b0000" />
        ) : (
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceText}>{balance}</Text>
          </View>
        )}

        {/* <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            This shows your current account balance with us.
          </Text>
          <Text style={styles.infoText}>
            Debit balance means you owe money, Credit means you have credit.
          </Text>
        </View> */}
      </View>

      <CustomDrawer isOpen={drawerOpen} onClose={closeDrawer} navigation={navigation} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8b0000',
    marginBottom: 30,
    textAlign: 'center',
  },
  balanceContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 30,
    marginBottom: 30,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  balanceText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  infoBox: {
    backgroundColor: '#e8f4f8',
    borderRadius: 10,
    padding: 20,
    width: '100%',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default CustomerBalanceDashboard;