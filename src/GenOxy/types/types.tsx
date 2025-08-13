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
      "https://img.freepik.com/premium-photo/woman-suit-with-smile-her-face_662214-22756.jpg",
    assistantName: "Smaira",
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    flag: "🇮🇳",
    speechLang: "hi-IN",
    imageUrl:
      "https://static.vecteezy.com/system/resources/thumbnails/045/782/543/small/professional-businesswoman-in-formal-suit-confident-smile-modern-office-background-corporate-leadership-stock-for-business-marketing-branding-photo.jpg",
    assistantName: "Praigya",
  },
];