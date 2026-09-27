// src/services/bhashini.js

const USER_ID = "d_BZxGfOSairklphSqqIPmgkiliIFNgTkCDkxFEf4VLawIQ1wylh1QrWnEc8M0Tn";
const ULCA_API_KEY = "51210e58f8-c7f2-4f3d-88b6-cc0dcc0b23cf";

const PIPELINE_CONFIG_ENDPOINT = "https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline";
const DEFAULT_PIPELINE_ID = "64392f96daac500b55c543cd";

export const BHASHINI_LANGUAGES = {
  hindi: "hi",
  assamese: "as",
  bodo: "brx",
  manipuri: "mni",
  nepali: "ne",
};

const configCache = {};

async function getPipelineConfig(sourceLang, targetLang, task) {
  const cacheKey = `${task}-${sourceLang}-${targetLang}`;
  if (configCache[cacheKey]) return configCache[cacheKey];

  const taskType = task === "translation" ? "translation" : "tts";
  const body = {
    pipelineTasks: [
      {
        taskType,
        config: {
          language:
            taskType === "translation"
              ? { sourceLanguage: sourceLang, targetLanguage: targetLang }
              : { sourceLanguage: targetLang },
        },
      },
    ],
    pipelineRequestConfig: { pipelineId: DEFAULT_PIPELINE_ID },
  };

  const res = await fetch(PIPELINE_CONFIG_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      userID: USER_ID,
      ulcaApiKey: ULCA_API_KEY,
    },
    body: JSON.stringify(body),
  });

  console.log("BHASHINI CONFIG STATUS:", res.status);
  console.log("BHASHINI CONFIG BODY:", await res.clone().text());

  if (!res.ok) throw new Error(`Bhashini config fetch failed: ${res.status}`);
  const data = await res.json();

  const config = {
    callbackUrl: data.pipelineInferenceAPIEndPoint.callbackUrl,
    inferenceApiKey: data.pipelineInferenceAPIEndPoint.inferenceApiKey,
    serviceId: data.pipelineResponseConfig[0].config[0].serviceId,
  };
  configCache[cacheKey] = config;
  return config;
}

export async function translateText(text, targetLangCode) {
  const { callbackUrl, inferenceApiKey, serviceId } = await getPipelineConfig("hi", targetLangCode, "translation");

  const res = await fetch(callbackUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: inferenceApiKey.value ? `${inferenceApiKey.name} ${inferenceApiKey.value}` : inferenceApiKey,
    },
    body: JSON.stringify({
      pipelineTasks: [{ taskType: "translation", config: { language: { sourceLanguage: "hi", targetLanguage: targetLangCode }, serviceId } }],
      inputData: { input: [{ source: text }] },
    }),
  });

  console.log("BHASHINI TRANSLATE STATUS:", res.status);
  console.log("BHASHINI TRANSLATE BODY:", await res.clone().text());

  if (!res.ok) throw new Error(`Bhashini translate failed: ${res.status}`);
  const data = await res.json();
  return data.pipelineResponse[0].output[0].target;
}

export async function textToSpeech(text, langCode) {
  const { callbackUrl, inferenceApiKey, serviceId } = await getPipelineConfig(langCode, langCode, "tts");

  const res = await fetch(callbackUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: inferenceApiKey.value ? `${inferenceApiKey.name} ${inferenceApiKey.value}` : inferenceApiKey,
    },
    body: JSON.stringify({
      pipelineTasks: [{ taskType: "tts", config: { language: { sourceLanguage: langCode }, serviceId, gender: "female" } }],
      inputData: { input: [{ source: text }] },
    }),
  });

  console.log("BHASHINI TTS STATUS:", res.status);
  console.log("BHASHINI TTS BODY:", await res.clone().text());

  if (!res.ok) throw new Error(`Bhashini TTS failed: ${res.status}`);
  const data = await res.json();
  return data.pipelineResponse[0].audio[0].audioContent;
}