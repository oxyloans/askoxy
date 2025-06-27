import axios from 'axios';

export const API = axios.create({
  baseURL: 'https://meta.oxyloans.com/api/riceapp-service',
  headers: {
    Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9...`,
  },
});