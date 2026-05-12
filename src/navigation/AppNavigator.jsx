import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import BarberDetailScreen from '../screens/BarberDetailScreen';
import AdminLoginScreen from '../screens/AdminLoginScreen';
import AdminPanel from '../screens/admin/AdminPanel';
import AdminBarbers from '../screens/admin/AdminBarbers';
import AdminSillas from '../screens/admin/AdminSillas';
import AdminCitas from '../screens/admin/AdminCitas';
import AdminReportes from '../screens/admin/AdminReportes';
import AdminUsers from '../screens/admin/AdminUsers';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="BarberDetail" component={BarberDetailScreen} />
      <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
      <Stack.Screen name="AdminPanel" component={AdminPanel} />
      <Stack.Screen name="AdminBarbers" component={AdminBarbers} />
      <Stack.Screen name="AdminSillas" component={AdminSillas} />
      <Stack.Screen name="AdminCitas" component={AdminCitas} />
      <Stack.Screen name="AdminReportes" component={AdminReportes} />
      <Stack.Screen name="AdminUsers" component={AdminUsers} />
    </Stack.Navigator>
  );
}
