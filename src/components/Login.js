
import React, { useState, useEffect  } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Constants from 'expo-constants';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';


const Login = ({ navigation }) => {

  const { setCustomerType, setLedName ,setAgentCode,setLedCode,setaddone,setaddtwo,setaddthree,setMobile, logout} = useAuth();  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true); // State to manage password visibility

  const togglePasswordVisibility = () => {
    setHidePassword(!hidePassword);
  };

 useEffect(() => {
    // Hide the header, disable the swipe gesture, and disable the drawer
    navigation.setOptions({
      headerShown: false,
      gestureEnabled: false,
      drawerEnabled: false, 
    });
  }, [navigation]);
  
  const handleLogin = async () => {
    if (!username || !password) {
      alert('Please enter username and password');
      return;
    }
    try {
      const { expoConfig } = Constants;
      const { API_URL } = expoConfig?.extra || {};

      const response = await axios.get(`${API_URL}/user/SignIn/JAPAN_ACCESORIES`, {
        // const response = await axios.get('http://202.21.37.226:86/api/onlineorder/user/SignIn/JAPAN_ACCESORIES', {

        params: {
          username: username,
          password: password,
        },
      });

      if (response.data.length > 0) {
        const user = response.data[0];

        // Assuming customerType is available in the response
        const customerType = user.CustomerType;
        const ledName = user.LedName;
        const agentCode = user.AgentCode;
        const ledCode = user.Ledcode;
        const addone = user.add1;
        const addtwo = user.add2;
        const addthree = user.add3;
        const mobile = user.Mobile;

         // Set customerType in the context
        setCustomerType(customerType);
        setLedName(ledName);
        setAgentCode(agentCode);
        setLedCode(ledCode);
        setaddone(addone);
        setaddtwo(addtwo);
        setaddthree(addthree);
        setMobile(mobile);

        const userData = {
          customerType,
          ledName,
          agentCode,
          ledCode,
          addone,
          addtwo,
          addthree,
          mobile,
        };
      
        await AsyncStorage.setItem('userData', JSON.stringify(userData));


          if (user.Active === 1) {
            await AsyncStorage.setItem('isActive', 'true');
            
          if (user.CustomerType === 'CUSTOMER') {



            // User is active and of type CUSTOMER, navigate to Home with CustomerType
            navigation.navigate('Home');
          } else {
            // User is active but not of type CUSTOMER, navigate to Main with CustomerType
            navigation.navigate('Dashboard');
          }
        }
        else {
          // User is not active, navigate to Otp only if Active is 0
          if (user.Active === 0) {
            navigation.navigate('Otp', {
              username: username,
              password: password,
            });
          } else {
            // Handle other cases where Active is not 0 (you may want to show an error or take other actions)
            alert('User is not active, but Active is not 0.');
          }
        }
      } else {
        // Show an error message for invalid username and password
        alert('Invalid username or password');
      }
    } catch (error) {
      console.error('Error during login:', error);
      // Handle other errors, e.g., network issues, API server errors, etc.
      alert('An error occurred during login. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginBox}>
        <Image
          source={{ uri: 'https://i.postimg.cc/FFc0w6KZ/ALIK-LOGO.png' }}
          style={styles.logo}
        />

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#666"
          onChangeText={(text) => setUsername(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#666"
          secureTextEntry={hidePassword}
          onChangeText={(text) => setPassword(text)}  
        />
         {/* Eye icon to toggle password visibility */}
         <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
          <Ionicons name={hidePassword ? 'eye-off' : 'eye'} size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>

        <Text style={styles.signupText}>
          Don't have an account?{' '}
          <Text style={styles.signupLink} onPress={() => navigation.navigate('Signup')}>
            Sign up
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8b0000',
  },
  loginBox: {
    backgroundColor: '#fff',
    width: '80%',
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    alignItems: 'center',
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 24,
    top: 228,
  },
  logo: {
    width: 120, // Set the desired width
    height: 120, // Set the desired height
    resizeMode: 'contain', // Preserve the aspect ratio
    marginBottom: 20, // Adjust margin as needed
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#aaa',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#ad1f25',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupText: {
    fontSize: 16,
    color: '#666',
  },
  signupLink: {
    color: '#3498db',
    fontWeight: 'bold',
  },
});

export default Login;
