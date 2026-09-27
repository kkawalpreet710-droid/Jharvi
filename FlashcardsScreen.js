import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRole } from '../context/RoleContext';
import { FLASHCARD_WORDS } from '../data/flashcardWords';
import { translateText, textToSpeech } from '../services/bhashini';
import { playBase64Audio } from '../services/audioPlayer';
import { getCachedTranslation, cacheTranslation } from '../services/offlineCache';

const TARGET_LANG = 'sat';

export default function FlashcardsScreen() {
  const { resetRole } = useRole();
  const [index, setIndex] = useState(0);
  const [translated, setTranslated] = useState(null);
  const word = FLASHCARD_WORDS[index];

  const handleSpeak = async () => {
    let result = await getCachedTranslation(word.hindi, TARGET_LANG);
    if (!result) {
      try {
        result = await translateText(word.hindi, TARGET_LANG);
        await cacheTranslation(word.hindi, TARGET_LANG, result);
      } catch (e) {
        result = '(offline - not cached yet)';
      }
    }
    setTranslated(result);
    try {
      const audio = await textToSpeech(result, TARGET_LANG);
      await playBase64Audio(audio);
    } catch (e) {}
  };

  const next = () => {
    setTranslated(null);
    setIndex((i) => (i + 1) % FLASHCARD_WORDS.length);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Flashcards</Text>
      <View style={styles.card}>
        <Text style={styles.hindiWord}>{word.hindi}</Text>
        <Text style={styles.englishWord}>{word.english}</Text>
        {translated && <Text style={styles.santaliWord}>{translated}</Text>}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSpeak}>
        <Text style={styles.buttonText}>Hear in Santali</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.nextButton} onPress={next}>
        <Text style={styles.nextText}>Next word →</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={resetRole} style={{ marginTop: 30 }}>
        <Text style={{ color: '#993C1D', textAlign: 'center' }}>Switch role</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F1E8', padding: 24, paddingTop: 60 },
  title: { fontSize: 26, fontWeight: '700', color: '#1F4E96', marginBottom: 20 },
  card: { backgroundColor: '#FFF', borderRadius: 16, borderWidth: 2, borderColor: '#D3D1C7', padding: 30, alignItems: 'center', marginBottom: 20 },
  hindiWord: { fontSize: 36, fontWeight: '700', color: '#1A1A1A' },
  englishWord: { fontSize: 16, color: '#5F5E5A', marginTop: 6 },
  santaliWord: { fontSize: 24, fontWeight: '700', color: '#0F6E56', marginTop: 16 },
  button: { backgroundColor: '#0F6E56', borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  buttonText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
  nextButton: { marginTop: 14, alignItems: 'center', padding: 10 },
  nextText: { color: '#1F4E96', fontSize: 15, fontWeight: '600' },
});