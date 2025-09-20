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
      "https://wallpaperaccess.com/full/2732802.jpg",
    assistantName: "Sindu",
  },
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
    speechLang: "en-US",
    imageUrl:
      "https://www.visa.co.in/content/dam/VCOM/global/our-purpose/images/partner-a-fintech-800x450.jpg",
     
    assistantName: "Smaira",
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    flag: "🇮🇳",
    speechLang: "hi-IN",
    imageUrl:
      "https://img.freepik.com/premium-photo/woman-suit-with-smile-her-face_662214-22756.jpg",
    assistantName: "Ananya",
  },
];