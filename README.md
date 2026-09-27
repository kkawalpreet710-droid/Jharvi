# Jharvi

**AI-powered classroom translation tool bridging Hindi-speaking teachers and mother-tongue tribal-language students in Jharkhand's primary schools.**

Built for Smart India Hackathon 2026, under Problem Statement 26042 (Government of Jharkhand, Dept. of Higher & Technical Education) and the state's PALASH mother-tongue education programme.

## The problem

Many teachers assigned to tribal-majority schools in Jharkhand speak only Hindi, while their students are most fluent in Santali, Mundari, or Ho. This language gap leaves young children unable to fully follow daily instruction during the most formative years of their education — undermining foundational literacy goals under NIPUN Bharat.

## What Jharvi does

- **Hindi-to-Santali translation** — a teacher types (voice input planned) a lesson line in Hindi, and Bhashini's Translation and Text-to-Speech APIs convert it into Santali text and audio
- **Offline-resilient caching** — once a phrase is translated, it's stored locally so the same line works instantly and without internet the next time
- **Flashcards mode** — a student-facing practice screen cycling through vocabulary with Hindi, English, and on-demand Santali translation
- **Teacher/Student role split** — one app, two modes, chosen from a simple role picker

## Product vision (designed prototype)

The team has designed a fuller product experience — shown in mockups, not yet implemented in code — including:
- Live classroom broadcast with a dual-pane teacher/student view and a broadcast history log
- On-device speech recognition (ASR), so teachers can speak rather than type
- Gamification: points, streaks, and unlockable badges (Voice Champion, Culture Explorer, Memory Master)
- AI-adaptive recommendations flagging specific words or pronunciation patterns a student is struggling with
- Expansion to six languages: Santali, Mundari, Ho, Hindi, English, and Odia
- Offline caching of the last 50 classroom broadcasts

## Tech stack

| Layer | Technology |
|---|---|
| Mobile app | React Native (bare CLI — not Expo) |
| Translation & voice | Bhashini API (ASR, NMT, TTS) |
| Audio playback | react-native-sound |
| File handling | react-native-fs |
| Offline storage | AsyncStorage |
| Navigation | React Navigation (native stack) |

## Project structure

```
Jharvi/
├── App.js
├── android/              # Native Android project (bare RN)
├── ios/                  # Native iOS project (bare RN)
└── src/
    ├── context/           # Role state (Teacher/Student)
    ├── navigation/         # App navigator
    ├── screens/
    │   ├── RoleSelectScreen.js
    │   ├── TeacherHomeScreen.js
    │   └── FlashcardsScreen.js
    ├── services/
    │   ├── bhashini.js      # Translation + TTS API client
    │   ├── audioPlayer.js    # Plays Bhashini's returned audio
    │   └── offlineCache.js    # Local phrase-translation cache
    └── data/
        └── flashcardWords.js  # Demo vocabulary list
```

## Getting started

**Prerequisites:** Node.js (LTS), Android Studio (for the Android SDK and build tools), and a [Bhashini API key](https://bhashini.gov.in) registered specifically for this app.

```bash
npm install
```

Add your Bhashini credentials to `src/services/bhashini.js` (replace the placeholder `USER_ID` and `ULCA_API_KEY`), then:

```bash
npx react-native start
```

In a second terminal, with an Android device connected via USB (`adb devices` should show it):

```bash
npx react-native run-android
```

> Bhashini issues API keys scoped to a specific registered app — a key generated for a different app will fail with a 400 error. Make sure your key was registered under "Jharvi," not reused from another project.

## Known limitations

- **Voice input is not implemented.** `@react-native-voice/voice` was attempted but is incompatible with modern Android Gradle tooling (it depends on `jcenter()`, discontinued in 2021). Current input is text-only; voice remains on the roadmap pending a maintained alternative.
- **Translation and TTS are cloud-based**, via Bhashini's API — not the on-device quantized model pipeline described in the technical architecture. This is a deliberate prototype-stage trade-off to demonstrate the concept quickly; true offline inference (IndicTrans2/NLLB, quantized for low-end Android tablets) is unbuilt.
- **No live classroom broadcast, gamification, or adaptive recommendations yet** — these exist only in the design mockups referenced above.
- **Only Santali translation has been tested end-to-end.** Mundari, Ho, and Odia depend on Bhashini's actual language coverage, which should be verified in your API dashboard before claiming full support.
- This is a hackathon prototype: no production security hardening, error handling is minimal, and the flashcard vocabulary list is a small demo set, not real FLN curriculum content.
