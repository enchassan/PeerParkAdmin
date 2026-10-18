import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Your computer's current Wi-Fi IP
const DEV_MACHINE_IP = '192.168.1.4';

const getBaseUrl = () => {
  return `http://${DEV_MACHINE_IP}:5000/api`;
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Intercept requests to inject the JWT token from Expo SecureStore
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.warn('SecureStore token read error:', err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;