// src/api/axiosInstance.ts
import axios from "axios";
import { store } from "../redux/store";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // set your base URL here
});

// Add request interceptor to inject token from Redux or localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    // Try get token from Redux store
    const token = store.getState().auth.token;


    // If no token in Redux, fallback to localStorage
    const authtoken = token || localStorage.getItem("token");

    if (authtoken) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${authtoken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
