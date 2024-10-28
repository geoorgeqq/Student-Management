// src/axiosInstance.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // Set this to your API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response, // Allow valid responses through
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle 401 Unauthorized errors
      const currentPath = window.location.pathname;
      const redirectPath = currentPath.replace("/dashboard", "/login");
      window.location.href = redirectPath; // Redirect to the login page
    }
    return Promise.reject(error); // Pass errors back for further handling
  }
);

export default axiosInstance;
