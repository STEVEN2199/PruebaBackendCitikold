import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_URL_BACKEND,
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `BEARER ${token}`;
  }
  return config;
});

export default apiClient;
