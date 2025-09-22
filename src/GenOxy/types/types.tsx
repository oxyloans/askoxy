export interface Message {
  id?: string ;
  role: "user" | "assistant";
  content: string;
  isImage?: boolean;
  timestamp?: string | number;
}


export interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  timestamp: string;
}

export interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  speechLang: string;
  imageUrl: string;
  assistantName: string;
}

// declare global {
//   interface Window {
//     webkitSpeechRecognition: any;
//     SpeechRecognition: any;
//   }
// }

export const LANGUAGES: LanguageConfig[] = [
  {
    code: "te",
    name: "Telugu",
    nativeName: "తెలుగు",
    flag: "🇮🇳",
    speechLang: "te-IN",
    imageUrl:
      "https://i.ibb.co/p6XPMZdn/Chat-GPT-Image-Aug-13-2025-05-42-43-PM.png",
    assistantName: "Priya",
  },
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
    speechLang: "en-US",
    imageUrl:
      "https://images.hindustantimes.com/img/2021/12/08/1600x900/4614293a-5775-11ec-ba48-cf98c20b89f1_1638944726659.jpg",
     
    assistantName: "Vicky",
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    flag: "🇮🇳",
    speechLang: "hi-IN",
    imageUrl:
      "https://assets.khelnow.com/news/uploads/2021/08/E8MH-Y3WUAAR9YO-scaled.jpeg",
    assistantName: "Neeraj",
  },
];