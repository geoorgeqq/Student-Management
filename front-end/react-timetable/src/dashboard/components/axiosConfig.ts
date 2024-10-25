// src/axiosConfig.ts
import axios, { InternalAxiosRequestConfig } from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080", // Set your API base URL here
});

// Add a request interceptor to include the Authorization header
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Retrieve the JWT token from localStorage
    const token = localStorage.getItem("jwtWebToken");

    // If token exists, set it as the Authorization header
    if (token && config.headers) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
  },
  (error) => {
    // Handle errors
    return Promise.reject(error);
  }
);

export default axiosInstance;
