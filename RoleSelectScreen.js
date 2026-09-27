import React from 'react';
import { Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRole } from '../context/RoleContext';

export default function RoleSelectScreen() {
  const { setRole } = useRole();
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Jharvi</Text>
      <Text style={styles.subtitle}>Choose a mode</Text>

      <TouchableOpacity style={styles.card} onPress={() => setRole('teacher')}>
        <Text style={styles.cardTitle}>Teacher</Text>
        <Text style={styles.cardDesc}>Translate lessons live for the class</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => setRole('student')}>
        <Text style={styles.cardTitle}>Student</Text>
        <Text style={styles.cardDesc}>Practice with visual flashcards</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F1E8', padding: 24, paddingTop: 60 },
  title: { fontSize: 32, fontWeight: '700', textAlign: 'center', color: '#1F4E96' },
  subtitle: { fontSize: 16, textAlign: 'center', color: '#5F5E5A', marginBottom: 32 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 2, borderColor: '#D3D1C7', padding: 22, marginBottom: 16 },
  cardTitle: { fontSize: 20, fontWeight: '700', color: '#1A1A1A' },
  cardDesc: { fontSize: 14, color: '#5F5E5A', marginTop: 4 },
});