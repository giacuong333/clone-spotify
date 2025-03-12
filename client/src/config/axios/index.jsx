import axios from "axios";

export const baseURL = import.meta.env.VITE_BASE_URL;

export const instance = axios.create({
  baseURL,
  timeout: 5000,
  headers: { "X-Custom-Header": "foobar" },
});

instance.interceptors.request.use(
  (config) => {
    // Do configuration here
    return config;
  },
  (error) => {
    // Do something here
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log("Error: ", error.message);
    return Promise.reject(error);
  }
);
