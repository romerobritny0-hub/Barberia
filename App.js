import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';

/**
 * Punto de entrada principal de la aplicación.
 * Encapsula el navegador dentro del contenedor de estado de navegación de React Native.
 */
export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}