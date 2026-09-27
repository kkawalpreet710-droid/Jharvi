import React from 'react';
import { RoleProvider } from './src/context/RoleContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <RoleProvider>
      <AppNavigator />
    </RoleProvider>
  );
}