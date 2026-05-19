import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { BookingProvider } from './src/context/BookingContext';

const globalStyle = `
  ::-webkit-scrollbar { width: 14px; }
  ::-webkit-scrollbar-track { background: #1C1B29; }
  ::-webkit-scrollbar-thumb { background: #D4AF37; border-radius: 7px; }
  * { scrollbar-width: thick; scrollbar-color: #D4AF37 #1C1B29; }
  html, body { overflow-y: auto !important; }
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = globalStyle;
  document.head.appendChild(style);
}

export default function App() {
  return (
    <BookingProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </BookingProvider>
  );
}