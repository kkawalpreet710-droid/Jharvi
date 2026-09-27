import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useRole } from '../context/RoleContext';
import RoleSelectScreen from '../screens/RoleSelectScreen';
import TeacherHomeScreen from '../screens/TeacherHomeScreen';
import FlashcardsScreen from '../screens/FlashcardsScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { role, loading } = useRole();
  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!role ? (
          <Stack.Screen name="RoleSelect" component={RoleSelectScreen} />
        ) : role === 'teacher' ? (
          <Stack.Screen name="TeacherHome" component={TeacherHomeScreen} />
        ) : (
          <Stack.Screen name="Flashcards" component={FlashcardsScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}