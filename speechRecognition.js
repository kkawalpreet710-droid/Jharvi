import Voice from '@react-native-voice/voice';

// Wraps @react-native-voice/voice's event-based API in a simple
// promise-based start/stop pair, so screens don't need to manage
// Voice's event listeners directly.

let resultCallback = null;
let errorCallback = null;

Voice.onSpeechResults = (event) => {
  const text = event.value && event.value[0];
  if (text && resultCallback) resultCallback(text);
};

Voice.onSpeechError = (event) => {
  if (errorCallback) errorCallback(event.error);
};

// langCode should be a BCP-47 tag Android's recognizer understands,
// e.g. 'hi-IN' for Hindi. Not every language has a recognizer installed
// on every device - same category of limitation as the TTS voice-pack
// issue from Memora. Falls back gracefully via onError if unsupported.
export function startListening(langCode, onResult, onError) {
  resultCallback = onResult;
  errorCallback = onError;
  Voice.start(langCode);
}

export async function stopListening() {
  await Voice.stop();
}

export function destroyRecognizer() {
  Voice.destroy().then(Voice.removeAllListeners);
}