import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, Image, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';

function Otp({ route }) {
  const [otp, setOtp] = useState('');
  const navigation = useNavigation();
  const { username, password } = route.params || {};

  const { expoConfig } = Constants;
  const { API_URL } = expoConfig?.extra || {};

  const handleOtpVerification = () => {
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    const apiUrl = `${API_URL}/user/Verify/JAPAN_ACCESORIES`;
    const url = `${apiUrl}?username=${username}&password=${password}&otp=${otp}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.message && data.message[0] && data.message[0][''] === 'Verification Success') {
          alert("Verification successful");
          navigation.navigate('Home');
        } else {
          alert('OTP verification failed. Please try again.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <View style={styles.pageWrapper}>
      <View style={styles.otpContainer}>
        <Image source={{ uri: 'https://i.postimg.cc/fyjh90tB/otp-3.jpg' }} style={styles.logo} />
        <Text style={styles.verifyText}>OTP Verification</Text>
        <Text style={styles.infoText}>Please Contact <Text style={{ color: 'red' }}>+91 88484 83211</Text> for OTP</Text>
        <View style={styles.otpInputContainer}>
          <TextInput
            style={styles.otpInput}
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
            // keyboardType=""
          />
        </View>
        <View style={styles.verifyButtonContainer}>
          <Button title="Verify" onPress={handleOtpVerification} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pageWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8b0000',
  },
  otpContainer: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    width:'80%'
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  verifyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  infoText: {
    marginTop: 10,
    color: '#555555',
  }, 
  otpInputContainer: {
    marginTop: 20,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    borderColor: '#aaaaaa',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10, // Add space between input and button
  },
  otpInput: {
    width: '100%',
  },
  verifyButtonContainer: {
    width: '50%',
    borderRadius:50
  },
});

export default Otp;
