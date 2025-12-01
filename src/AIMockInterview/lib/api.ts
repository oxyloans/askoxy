let user = "local";
let API_BASE_URL = "";
if (user==="production") {
  API_BASE_URL = "https://ai-mock-interview-6tm9.onrender.com";
} else {
  API_BASE_URL = "http://localhost:3001";
}

export const api = {
  async chat(message: string, userId?: string, sessionId?: string) {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, userId, sessionId }),
    });
    return response.json();
  },

  async getHistory() {
    const response = await fetch(`${API_BASE_URL}/api/history`);
    return response.json();
  },

  async startInterview(data: any) {
    const response = await fetch(`${API_BASE_URL}/api/interview/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async submitAnswer(data: any) {
    const response = await fetch(`${API_BASE_URL}/api/interview/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async login(credentials: any) {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  async uploadResume(formData: FormData) {
    const response = await fetch(`${API_BASE_URL}/api/upload-resume`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  async processVoice(data: any) {
    const response = await fetch(`${API_BASE_URL}/api/voice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};