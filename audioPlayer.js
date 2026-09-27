import RNFS from 'react-native-fs';
import Sound from 'react-native-sound';

Sound.setCategory('Playback');

export async function playBase64Audio(base64Wav) {
  const path = `${RNFS.CachesDirectoryPath}/bhashini_tts.wav`;
  await RNFS.writeFile(path, base64Wav, 'base64');

  return new Promise((resolve, reject) => {
    const sound = new Sound(path, '', (error) => {
      if (error) { reject(error); return; }
      sound.play((success) => {
        sound.release();
        success ? resolve() : reject(new Error('Playback failed'));
      });
    });
  });
}