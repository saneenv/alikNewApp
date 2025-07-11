import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from './AuthContext';

const ReceiptEntry = ({ navigation }) => {
  const { ledCode } = useAuth();
  const [amount, setAmount] = useState('');
  const [paymentType, setPaymentType] = useState('Cash In Hand');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [balance, setBalance] = useState('');


  const today = new Date();
  const currentDate = `${String(today.getDate()).padStart(2, '0')}/${String(
    today.getMonth() + 1
  ).padStart(2, '0')}/${today.getFullYear()}`;

  const handleSubmit = async () => {
    if (!amount || isNaN(amount)) {
      Alert.alert('Invalid Input', 'Please enter a valid amount.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      date: currentDate,
      amount: parseFloat(amount),
      paymentType,
      ledCode,
    };

    console.log(payload);

    try {
      const response = await fetch('http://202.21.37.226:86/api/onlineorder/user/saveReceipt/JAPAN_ACCESORIES', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        Alert.alert('Success', 'Receipt submitted successfully.');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to submit receipt.');
      }
    } catch (error) {
      console.error('Submission Error:', error);
      Alert.alert('Error', 'Something went wrong.');
    }

    setIsSubmitting(false);
  };

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch(`http://202.21.37.226:86/api/onlineorder/user/balance/JAPAN_ACCESORIES/${ledCode}`);
        const data = await response.json();
        if (data.success) {
          setBalance(data.balance);
        }
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };

    fetchBalance();
  }, []);


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Receipt Entry</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date</Text>
            <TextInput value={currentDate} editable={false} style={styles.input} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount (INR)</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="Enter amount"
              keyboardType="decimal-pad"
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Payment Type</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={paymentType}
                onValueChange={(itemValue) => setPaymentType(itemValue)}
                style={styles.picker}
                mode="dropdown"
              >
                <Picker.Item label="Cash In Hand" value="Cash In Hand" />
                <Picker.Item label="Bank" value="Bank" />
              </Picker>
            </View>
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.buttonText}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Text>

          </TouchableOpacity>
          {balance !== '' && (
            <View style={styles.balanceCard}>
              <Text style={styles.balanceLabel}>Current Balance</Text>
              <Text style={styles.balanceValue}>{balance}</Text>
            </View>
          )}

        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ReceiptEntry;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#fefefe',
    flexGrow: 1,
    justifyContent: 'flex-start', // 👈 Fixes the "centered" issue
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 15,
    textAlign: 'center',
    color: '#BC2231',
  },
  inputGroup: {
    marginVertical: 10,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#BC2231',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#BC2231',
    borderRadius: 5,
    overflow: 'hidden',
  },
  picker: {
    height: Platform.OS === 'android' ? 50 : undefined,
  },
  submitButton: {
    backgroundColor: '#BC2231',
    padding: 15,
    marginTop: 25,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  balanceCard: {
    backgroundColor: '#FFEFEF',
    borderColor: '#BC2231',
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  balanceLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  balanceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#BC2231',
  },

});
