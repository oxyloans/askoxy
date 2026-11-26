export const BASE_URL = "https://www.askoxy.ai";

export interface SEOData {
  title: string;
  description: string;
}

export const seoConfig: Record<string, SEOData> = {
  "/": {
    "title": "ASKOXY.AI | AI-Z Marketplace",
    "description": "Explore AI tools, jobs, financial services, education and business services on ASKOXY.AI."
  },
  "/oxynews": {
    "title": "OxyNews | Latest News and Updates - ASKOXY.AI",
    "description": "Explore news, artificial intelligence, technology, business and financial updates on OxyNews."
  },
  "/oxygold": {
    "title": "OxyGold | Gold and Silver - ASKOXY.AI",
    "description": "Explore gold and silver services with OxyGold."
  },
  "/fpl": {
    "title": "OxyBricks | Fractional Real Estate - ASKOXY.AI",
    "description": "Explore fractional real estate opportunities with OxyBricks."
  },
  "/nyayagpt": {
    "title": "NyayaGPT | AI Legal Assistant - ASKOXY.AI",
    "description": "Explore AI-powered legal information with NyayaGPT."
  },
  "/studyabroad": {
    "title": "Study Abroad | ASKOXY.AI",
    "description": "Explore overseas education and study abroad opportunities."
  },
  "/realestate": {
    "title": "Real Estate | ASKOXY.AI",
    "description": "Explore real estate services and opportunities."
  },
  "/partner": {
    "title": "OxyLoans | Lending and Partnership - ASKOXY.AI",
    "description": "Explore OxyLoans lending and partnership information."
  },
  "/rbi-news": {
    "title": "RBI News | OxyNews - ASKOXY.AI",
    "description": "Explore Reserve Bank of India news and banking updates."
  },
  "/irdai-news": {
    "title": "IRDAI News | OxyNews - ASKOXY.AI",
    "description": "Explore insurance industry news and IRDAI updates."
  },
  "/finvibe": {
    "title": "Finvibe | AI Financial Technology - ASKOXY.AI",
    "description": "Explore AI-powered financial technology solutions."
  },
  "/rankings": {
    "title": "AI Model Rankings | OxyNews - ASKOXY.AI",
    "description": "Explore and compare AI models and providers."
  },
  "/task": {
    "title": "TASK | ASKOXY.AI – 90-Day Job Program | #Free #NoCost #AITraining #JobReadiness",
    "description": "Joint initiative of TASK (Telangana Academy for Skill and Knowledge) and ASKOXY.AI exclusively for TASK-registered students. 100% Free 90-day classroom training focusing on technical, business, and hands-on AI exposure."
  }
};