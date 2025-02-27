import axios from 'axios';
import {useKeycloak} from "../keycloak/KeycloakContext.tsx";

const BASE_API_URL = `${import.meta.env.VITE_API_URL}`;

const axiosInstance = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const {keycloakService} = useKeycloak();
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
    originalRequest._retry = true;
    const {keycloakService} = useKeycloak();
    try {
      const token = keycloakService.token;
      if (token) {
        originalRequest.headers.Authorization = `Bearer ${token}`;
      }
      return axiosInstance(originalRequest);
    } catch (error) {
      await keycloakService.logout();
      return Promise.reject(error);
    }
  }
);

export default axiosInstance;