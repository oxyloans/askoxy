import axios from 'axios';
import { Candidate } from './types';
let user = "production";
let API_BASE = "";
if (user==="production") {
  API_BASE = "https://interviews-zadn.onrender.com/api/admin";
} else {
  API_BASE = "http://localhost:3001/api/admin";

}

export const candidateApi = {
  getCandidates: async (): Promise<Candidate[]> => {
    const { data } = await axios.get(`${API_BASE}/candidates`);
    return data;
  },

  getCandidateById: async (userId: string): Promise<Candidate> => {
    const { data } = await axios.get(`${API_BASE}/candidate/${userId}`);
    return data;
  },

  getAttemptLimit: async (): Promise<{ maxAttempts: number }> => {
    const { data } = await axios.get(`${API_BASE}/attempts/limit`);
    return data;
  },

  updateAttemptLimit: async (maxAttempts: number): Promise<{ success: boolean; maxAttempts: number }> => {
    const { data } = await axios.post(`${API_BASE}/attempts/limit`, { maxAttempts });
    return data;
  },

  getUserAttempts: async (userId: string) => {
    const { data } = await axios.get(`${API_BASE}/attempts/${userId}`);
    return data;
  },

  // Interview Config - Round Settings
  getInterviewConfig: async () => {
    const { data } = await axios.get(`${API_BASE}/interview-config`);
    return data;
  },

  updateInterviewConfig: async (rounds: Array<{round: number, questions: number, time_limit: number, label: string}>) => {
    const { data } = await axios.post(`${API_BASE}/interview-config`, { rounds });
    return data;
  }
};
