import axios from 'axios';

// Create an Axios instance with default configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Set a 10-second timeout for requests
});

// Add a request interceptor for additional configuration (e.g., adding auth tokens)
apiClient.interceptors.request.use(
  (config) => {
    // Optionally add authentication tokens or other headers here
    // Example: config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for centralized error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Centralized error handling
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error('API error:', error.response.status, error.response.data);
      return Promise.reject({
        status: error.response.status,
        message: error.response.data.message || 'An error occurred',
      });
    } else if (error.request) {
      // No response received
      console.error('No response from server:', error.request);
      return Promise.reject({ message: 'No response from server' });
    } else {
      // Error setting up the request
      console.error('Request setup error:', error.message);
      return Promise.reject({ message: error.message });
    }
  }
);

export default apiClient;