// API Configuration with Axios Logging
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

console.log('🔧 API Configuration Loaded:');
console.log(`   Environment: ${import.meta.env.MODE}`);
console.log(`   VITE_API_URL: ${import.meta.env.VITE_API_URL}`);
console.log(`   API_BASE_URL: ${API_BASE_URL}`);

// Create Axios Instance with Logging
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`🚀 Axios Request:`, {
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('🚫 Request Error:', error.message);
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ Axios Response:`, {
      status: response.status,
      statusText: response.statusText,
      dataLength: response.data?.length || 'N/A',
      headers: response.headers
    });
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

// Export both the default URL and the axios instance
export { axiosInstance };
export default API_BASE_URL;
