import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';

const Signup = () => {
    const [name, setName] = useState('');
    const [add1, setAdd1] = useState('');
    const [add2, setAdd2] = useState('');
    const [add3, setAdd3] = useState('');
    const [add4, setAdd4] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [pinCode, setPinCode] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [agentCode, setCode] = useState('');

    const { expoConfig } = Constants;
    const { API_URL } = expoConfig?.extra || {};

    const navigation = useNavigation();


    const handleSubmit = () => {
         
        // Convert the shop name to uppercase
        const uppercaseName = name.toUpperCase();
    
        // Validation checks
        if (email && !validateEmail(email)) {
          alert('Please enter a valid email address.');
          return;
        }
    
        if (!validateMobile(mobile)) {
          alert('Please enter a 10-digit mobile number.');
          return;
        }
    
        if (!validatePinCode(pinCode)) {
          alert('Please enter a 6-digit pin code.');
          return;
        }
    
        // Create an object with the form data
        const formData = {
          name: uppercaseName,
          add1,
          add2,
          add3,
          add4,
          mobile,
          email,
          pinCode,
          username,
          password,
          agentCode,
        };
    
        // Wrap the form data object in an array
        const requestData = [formData];
    
        // Make the signup API call
        fetch(`${API_URL}/user/SignUp/JAPAN_ACCESORIES`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        })
          .then((response) => response.json())
          .then((data) => {
            // Handle the response from the signup API
            // Reset the form fields
            setName('');
            setAdd1('');
            setAdd2('');
            setAdd3('');
            setAdd4('');
            setMobile('');
            setEmail('');
            setPinCode('');
            setUsername('');
            setPassword('');
            setCode('');
    
            // Show a success message to the user
            if (data === 1) {
              alert('Form submitted successfully!');
    
              // Construct the login URL with the username and password as query parameters
              const loginURL = `${API_URL}/user/SignIn/JAPAN_ACCESORIES?username=${encodeURIComponent(
                username
              )}&password=${encodeURIComponent(password)}`;
    
              // Prepare the login request body including the Ledname
              const loginData = {
                Ledname: name,
              };
    
              // Make the login API call
              fetch(loginURL, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
              })
                .then((response) => response.json())
                .then((loginResponse) => {
                  // Handle the response from the login API
                  // Show a success message to the user
                  if (loginResponse.success) {
                    alert('Login successful!');
                    // Redirect the user to the dashboard or home page
                    navigation.navigate('/');
                  } else {
                    alert('Login failed.');
                  }
                })
                .catch((error) => {
                  // Handle any errors
                  console.error('Error:', error);
                  // Show an error message to the user
                //   alert('An error occurred while logging in. Please try again later.');
                });
    
              // In the component where you navigate to the Otp component
              navigation.navigate('Otp', { username, password });
            } else if (data === 0) {
              alert('Already registered.');
            } else {
              alert('Registration failed.');
            }
          })
          .catch((error) => {
            // Handle any errors
            console.error('Error:', error);
            // Show an error message to the user
            alert('An error occurred while submitting the form. Please try again later.');
          });
      };
    
    const validateMobile = (number) => {
        const mobileRegex = /^\d{10}$/;
        return mobileRegex.test(number);
    };

    const validatePinCode = (pinCode) => {
        const pinCodeRegex = /^\d{6}$/;
        return pinCodeRegex.test(pinCode);
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
        return emailRegex.test(email);
    };


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.signupBox}>
                <View style={styles.logoContainer}>
                    <View style={styles.rowContainer}>
                        <Image
                            source={{ uri: 'https://i.postimg.cc/FFc0w6KZ/ALIK-LOGO.png' }}
                            style={styles.logo}
                        />
                        <Text style={styles.signHeading}>Sign Up</Text>
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Shop Name*"
                        value={name}
                        onChangeText={(text) => setName(text)}
                        required

                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Address"
                        value={add1}
                        onChangeText={(text) => setAdd1(text)}


                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Contact person"
                        value={add4}
                        onChangeText={(text) => setAdd4(text)}

                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Mobile Number*"
                        value={mobile}
                        onChangeText={(text) => setMobile(text)}
                        required
                        keyboardType="numeric"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Email*"
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                        required
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Pincode*"
                        value={pinCode}
                        onChangeText={(text) => setPinCode(text)}
                        required
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Username*"
                        value={username}
                        onChangeText={(text) => setUsername(text)}
                        required
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password*"
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                        required

                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Agent/dealer code"
                        value={agentCode}
                        onChangeText={(text) => setCode(text)}

                    />

                    {/* Add similar TextInput components for other fields */}

                    <TouchableOpacity style={styles.signupButton} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Signup</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,  // Allow the container to grow with content
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#8b0000',
    },
    signupBox: {
        backgroundColor: '#fff',
        width: '90%',
        padding: 20,
        borderRadius: 20,
        alignItems: 'center',
        // marginBottom: 10,  // Add marginBottom to provide space between signupBox and next element
        height: '98%'

    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        marginRight: -8, // Add some margin to separate the image and text
        transform: [{ translateX: -80 }],

    },
    signHeading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333', // You can customize the color
        transform: [{ translateX: -80 }],


    },
    inputContainer: {
        width: '100%',
        // backgroundColor:'yellow',
        // transform: [{ translateY: -5 }],

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
    signupButton: {
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
        textAlign: 'center'
    },
});

export default Signup;
