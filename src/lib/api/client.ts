import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://skyrise-backend-wh9o.onrender.com/api/v1';

// axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'An error occurred';
    console.error(
      `${error.response?.status || 'Network Error'} ${error.config?.url}:`,
      message
    );
    throw new Error(message);
  }
);

export default apiClient;
