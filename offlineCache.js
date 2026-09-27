import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = 'translatedPhrases';

export async function getCachedTranslation(hindiText, langCode) {
  const raw = await AsyncStorage.getItem(CACHE_KEY);
  const cache = raw ? JSON.parse(raw) : {};
  return cache[`${langCode}:${hindiText}`] || null;
}

export async function cacheTranslation(hindiText, langCode, translatedText) {
  const raw = await AsyncStorage.getItem(CACHE_KEY);
  const cache = raw ? JSON.parse(raw) : {};
  cache[`${langCode}:${hindiText}`] = translatedText;
  await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}