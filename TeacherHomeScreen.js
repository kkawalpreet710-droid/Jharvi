import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { useRole } from '../context/RoleContext';
import { translateText, textToSpeech } from '../services/bhashini';
import { playBase64Audio } from '../services/audioPlayer';
import { getCachedTranslation, cacheTranslation } from '../services/offlineCache';

const TARGET_LANG = 'sat'; // Santali - verify this exact code in your Bhashini dashboard

export default function TeacherHomeScreen() {
  const { resetRole } = useRole();
  const [hindiText, setHindiText] = useState('');
  const [translated, setTranslated] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
  if (!hindiText.trim()) return;
  console.log('handleTranslate called with:', hindiText);
  setLoading(true);
  try {
    let result = await getCachedTranslation(hindiText, TARGET_LANG);
    if (!result) {
      result = await translateText(hindiText, TARGET_LANG);
      await cacheTranslation(hindiText, TARGET_LANG, result);
    }
    setTranslated(result);
    try {
      const audio = await textToSpeech(result, TARGET_LANG);
      await playBase64Audio(audio);
    } catch (e) {
      console.warn('TTS unavailable (offline?):', e.message);
    }
  } catch (e) {
    console.log('TRANSLATE ERROR:', e);
    console.log('ERROR MESSAGE:', e.message);
    console.log('ERROR STACK:', e.stack);
    Alert.alert('Translation failed', 'Check your connection - this phrase is not cached yet.');
  } finally {
    setLoading(false);
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Teacher Mode</Text>
      <TextInput
        style={styles.input}
        placeholder="Type a Hindi lesson line..."
        value={hindiText}
        onChangeText={setHindiText}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleTranslate} disabled={loading}>
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Translate & Speak</Text>}
      </TouchableOpacity>

      {translated ? (
        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>Santali:</Text>
          <Text style={styles.resultText}>{translated}</Text>
        </View>
      ) : null}

      <TouchableOpacity onPress={resetRole} style={{ marginTop: 30 }}>
        <Text style={{ color: '#993C1D', textAlign: 'center' }}>Switch role</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F1E8', padding: 24, paddingTop: 60 },
  title: { fontSize: 26, fontWeight: '700', color: '#1F4E96', marginBottom: 20 },
  input: { backgroundColor: '#FFF', borderRadius: 12, borderWidth: 2, borderColor: '#D3D1C7', padding: 14, fontSize: 16, minHeight: 80, textAlignVertical: 'top' },
  button: { backgroundColor: '#0F6E56', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 16 },
  buttonText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
  resultBox: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginTop: 20, borderWidth: 2, borderColor: '#D3D1C7' },
  resultLabel: { fontSize: 13, color: '#5F5E5A' },
  resultText: { fontSize: 20, fontWeight: '700', color: '#1A1A1A', marginTop: 4 },
});