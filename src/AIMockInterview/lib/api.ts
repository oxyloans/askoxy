let user = "local";
let API_BASE_URL = "";
if (user==="production") {
  API_BASE_URL = "https://interviews-zadn.onrender.com";
} else {
  API_BASE_URL = "http://localhost:3001";
}

export const api = {
  async chat(message: string, userId?: string, sessionId?: string) {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
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
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async submitAnswer(data: any) {
    const response = await fetch(`${API_BASE_URL}/api/interview/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async login(credentials: any) {
    try {
      console.log('Attempting login to:', `${API_BASE_URL}/api/login`);
      console.log('Credentials:', credentials);
      console.log('Frontend origin:', window.location.origin);
      
      const res = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });
      
      console.log('Login API response status:', res.status);
      console.log('Login API response ok:', res.ok);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('Login API response data:', data);
      return data;
    } catch (err: any) {
      console.error('Login API error:', err);
      console.error('Error name:', err.name);
      console.error('Error message:', err.message);
      
      if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
        throw new Error('CORS or Network Error: Unable to connect to backend. Check if backend has CORS enabled for your frontend origin.');
      }
      
      throw new Error(err.message || 'Unable to connect to server.');
    }
  },

  async uploadResume(formData: FormData) {
    const response = await fetch(`${API_BASE_URL}/api/upload-resume`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    return response.json();
  },

  async processVoice(data: any) {
    const response = await fetch(`${API_BASE_URL}/api/voice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async codeRunner(data: any) {
    const response = await fetch(`${API_BASE_URL}/api/code-runner`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return response.json();
  }
};

