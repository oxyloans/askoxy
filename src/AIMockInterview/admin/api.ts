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
  }
};
