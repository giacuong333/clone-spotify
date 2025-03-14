import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { notify } from "../../components/Toast";
import axios from "axios";
import { apis } from "../../constants/apis";

const AxiosContext = createContext();

const Axios = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);

  const instance = useMemo(() => {
    return axios.create({
      baseURL: import.meta.env.VITE_BASE_URL,
      timeout: 10000,
      withCredentials: true,
      headers: { "X-Custom-Header": "foobar" },
    });
  }, []);

  useEffect(() => {
    const requestInterceptor = instance.interceptors.request.use(
      (config) => {
        if (accessToken && config.url !== apis.auths.logout()) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => {
        console.log("Request error: ", error);
        return Promise.reject(error);
      }
    );

    const responseInterceptor = instance.interceptors.response.use(
      (response) => {
        console.log("Response:", response);
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          originalRequest.url !== apis.auths.logout()
        ) {
          originalRequest._retry = true;
          try {
            const response = await instance.post(apis.auths.refresh(), {});
            const accessToken = response.data?.access;
            setAccessToken(accessToken);
            originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
            return instance(originalRequest);
          } catch (error) {
            console.error("Refresh failed", error);
            notify("Session expired. Please log in again", "error");
            return Promise.reject(error);
          }
        }
        console.error("Response error: ", error);
        notify(error.response.data || "Something went wrong!", "error");
        return Promise.reject(error);
      }
    );

    return () => {
      instance.interceptors.request.eject(requestInterceptor);
      instance.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken, instance]);

  return (
    <AxiosContext.Provider value={{ instance, accessToken, setAccessToken }}>
      {children}
    </AxiosContext.Provider>
  );
};

export const useAxios = () => useContext(AxiosContext);
export default Axios;
