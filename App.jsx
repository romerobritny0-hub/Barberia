import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { BookingProvider } from './src/context/BookingContext';

export default function App() {
  return (
    <BookingProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </BookingProvider>
  );
}