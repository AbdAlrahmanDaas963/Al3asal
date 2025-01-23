import axios from "axios";

const api = axios.create({
  baseURL: "https://asool-gifts.com/api/dashboard",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to inject token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
