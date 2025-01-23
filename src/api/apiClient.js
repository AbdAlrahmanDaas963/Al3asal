import axios from "axios";
import process from "process";

const baseURL = "https://asool-gifts.com/api/dashboard";
// const baseURL = process.env.REACT_APP_API_BASE_URL;

const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("token", token);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
