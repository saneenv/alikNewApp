import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [customerType, setCustomerType] = useState(null);
  const [ledName, setLedName] = useState(null);
  const [agentCode, setAgentCode] = useState(null);
  const [ledCode, setLedCode] = useState(null);
  const [addone, setaddone] = useState(null);
  const [addtwo, setaddtwo] = useState(null);
  const [addthree, setaddthree] = useState(null);
  const [mobile, setMobile] = useState(null);

  const setCustomerTypeValue = (type) => {
    setCustomerType(type);
  };

  const setLedNameValue = (name) => {
    setLedName(name);
  };

  const setAgentCodeValue = (agent) => {
    setAgentCode(agent);
  };

  const setLedCodeValue = (led) => {
    setLedCode(led);
  };

  const setaddoneValue = (addonee) => {
    setaddone(addonee);
  };

  const setaddtwoValue = (addtwoo) => {
    setaddtwo(addtwoo);
  };

  const setaddthreeValue = (addthreee) => {
    setaddthree(addthreee);
  };

  const setMobileValue = (mobileValue) => {
    setMobile(mobileValue);
  };

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('userData');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setCustomerType(parsedData.customerType);
          setLedName(parsedData.ledName);
          setAgentCode(parsedData.agentCode);
          setLedCode(parsedData.ledCode);
          setaddone(parsedData.addone);
          setaddtwo(parsedData.addtwo);
          setaddthree(parsedData.addthree);
          setMobile(parsedData.mobile);
        }
      } catch (error) {
        console.error('Error loading stored data:', error);
      }
    };

    loadStoredData();
  }, []);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userData');

      setCustomerType(null);
      setLedName(null);
      setAgentCode(null);
      setLedCode(null);
      setaddone(null);
      setaddtwo(null);
      setaddthree(null);
      setMobile(null);

      // You might also want to perform navigation here to move to the login screen
      // navigation.navigate('Login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        customerType,
        setCustomerType: setCustomerTypeValue,
        ledName,
        setLedName: setLedNameValue,
        agentCode,
        setAgentCode: setAgentCodeValue,
        ledCode,
        setLedCode: setLedCodeValue,
        addone,
        setaddone: setaddoneValue,
        addtwo,
        setaddtwo: setaddtwoValue,
        addthree,
        setaddthree: setaddthreeValue,
        mobile,
        setMobile: setMobileValue,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
