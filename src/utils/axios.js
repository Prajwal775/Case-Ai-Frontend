import axios from 'axios';
import { showGlobalToast } from '../components/ui/ToastProvider';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
  },
});

/**
 * REQUEST INTERCEPTOR
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ngrok fix
    config.headers['ngrok-skip-browser-warning'] = 'true';

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * RESPONSE INTERCEPTOR
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Unexpected error occurred';

    switch (status) {
      case 400:
        showGlobalToast(message, 'error');
        break;

      case 401:
        showGlobalToast('Session expired. Please login again.', 'warning');
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        break;

      case 403:
        showGlobalToast(
          'You are not authorized to perform this action.',
          'error'
        );
        break;

      case 404:
        showGlobalToast('Resource not found.', 'error');
        break;

      case 429:
        showGlobalToast('Too many requests. Please slow down.', 'warning');
        break;

      case 500:
        showGlobalToast('Server error. Please try again later.', 'error');
        break;

      case 503:
        showGlobalToast('Service unavailable. Try again later.', 'error');
        break;

      default:
        showGlobalToast(message, 'error');
    }

    return Promise.reject(error);
  }
);

export default api;
