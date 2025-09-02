import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LandingScreen from './screens/LandingScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen'
import ContactScreen from './screens/ContactScreen';
import DashboardScreen from './screens/DashboardScreen';
import HistoryScreen from './screens/HistoryScreen';
import SettingsScreen from './screens/SettingsScreen';
import AccountScreen from './screens/AccountScreen';
import ControlScreen from './screens/ControlScreen';
import FinanceScreen from './screens/FinanceScreen';
import FaultScreen from './screens/FaultScreen';
import UserScreen from './screens/UserScreen';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Landing: undefined;
  Contact: undefined;
  Home: undefined;
  Dashboard: undefined;
  History: undefined;
  Settings: undefined;
  Account: undefined;
  Control: undefined;
  Finance: undefined;
  Fault: undefined;
  User: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Landing">
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Contact" component={ContactScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Account" component={AccountScreen} />
        <Stack.Screen name="Control" component={ControlScreen} />
        <Stack.Screen name="Finance" component={FinanceScreen} />
        <Stack.Screen name="Fault" component={FaultScreen} />
        <Stack.Screen name="User" component={UserScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

