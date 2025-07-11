import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import Login from './src/components/Login';
import Signup from './src/components/Signup';
import Home from './src/components/Home';
import Otp from './src/components/Otp';
import ItemsListScreen from './src/components/ItemsList/ItemsListScreen';
import RecipeScreen from './src/components/Recipe/RecipeScreen';
import Cart from './src/components/Cart';
import About from './src/components/About';
import Dashboard from './src/components/Dashboard';
import { AuthProvider } from './src/components/AuthContext';
import Orders from './src/components/Orders';
import Success from './src/components/Success';
import SearchScreen from './src/components/Search/SearchScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Receipt from './src/components/Receipt';
import CustomerBalanceDashboard from './src/components/CustomerBalanceDashboard';

const Stack = createStackNavigator();

function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkIsActive = async () => {
      try {
        const isActive = await AsyncStorage.getItem('isActive');
        if (isActive !== null && isActive === 'true') {
          console.log('isActive:', isActive);
          setInitialRoute('Home');
        } else {
          console.log('isActive is null or not true');
          setInitialRoute('Login');
        }
      } catch (error) {
        console.error('Error retrieving isActive value:', error);
        // Handle errors
      }
    };

    checkIsActive();
  }, []);

  useEffect(() => {
    console.log('Initial Route:', initialRoute);
  }, [initialRoute]);

  if (initialRoute === null) {
    return null;
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerTitleStyle: {
          fontWeight: 'bold',
          textAlign: 'center',
          alignSelf: 'center',
          flex: 1,
        }
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Otp" component={Otp} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name='Search' component={SearchScreen} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="Orders" component={Orders} />
      <Stack.Screen name="Cart" component={Cart} />
      <Stack.Screen name="Receipt" component={Receipt} />
      <Stack.Screen name="Success" component={Success} />
      <Stack.Screen name="About" component={About} />
      <Stack.Screen name='ItemsList' component={ItemsListScreen} />
      <Stack.Screen name='Slideshow' component={RecipeScreen} />
      <Stack.Screen name='DashboardCus' component={CustomerBalanceDashboard} />

    </Stack.Navigator>
  );
}

export default function AppContainer() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <App />
      </NavigationContainer>
    </AuthProvider>
  )
}

console.disableYellowBox = true;
