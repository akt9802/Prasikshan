import axios from 'axios';
import { getAuthToken, setAuthToken, clearAuth } from './auth';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // If your refresh token cookie is HTTP-only and on the same domain,
  // it will automatically be sent, but it's good practice to ensure withCredentials is true if doing cross-domain
  withCredentials: true,
});

// A flag to prevent multiple refresh token requests simultaneously
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor: Attach access token to headers
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle 401 and refresh tokens
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 (Unauthorized) or 403 (Forbidden) and we haven't already retried this original request
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      // If we are already refreshing the token, add original request to a queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh token
        // This request will automatically carry the HTTP-only refreshToken cookie
        const { data } = await axios.post('/api/auth/refresh-token', {}, { withCredentials: true });

        const newToken = data.token;
        setAuthToken(newToken); // Save new token into LocalStorage

        // Set the Authorization header for future requests
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

        // Process any queued requests
        processQueue(null, newToken);

        // Retry the original request with the new token
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh token failed (e.g. invalid, expired, revoked)
        processQueue(refreshError, null);
        
        // Clear all auth state and redirect to login
        clearAuth();
        
        // Dispatch an event to notify the application
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('auth-change'));
          window.location.href = '/signin';
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
