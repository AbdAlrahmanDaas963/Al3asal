// utils/axiosInterceptor.js
import axios from "axios";
import store from "../app/store";
import { resetAuthState } from "../features/Auth/authSlice";

const setupAxiosInterceptors = () => {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        store.dispatch(resetAuthState());
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );
};

export default setupAxiosInterceptors;
