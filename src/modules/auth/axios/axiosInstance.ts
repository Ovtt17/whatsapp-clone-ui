import axios from 'axios';
import KeycloakService from "../keycloak/KeycloakService.ts";

const BASE_API_URL = `${import.meta.env.VITE_API_URL}`;

const axiosInstance = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export const setupAxiosInterceptors = (keycloakService: typeof KeycloakService) => {
  axiosInstance.interceptors.request.use(
    async (config) => {
      const token = keycloakService.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    response => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          await keycloakService.init();
          const token = keycloakService.token;
          if (token) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          await keycloakService.logout();
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
};
export default axiosInstance;