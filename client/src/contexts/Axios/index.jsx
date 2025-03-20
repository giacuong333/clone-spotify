import React from "react";
import { notify } from "../../components/Toast";
import axios from "axios";
import { apis } from "../../constants/apis";

const AxiosContext = React.createContext();

const instance = () =>
  axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 10000,
    withCredentials: true,
    headers: { "X-Custom-Header": "foobar" },
  });

export const apiInstance = instance();

const Axios = ({ children }) => {
  const [accessToken, setAccessToken] = React.useState(null);

  React.useEffect(() => {
    const requestInterceptor = apiInstance.interceptors.request.use(
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

    const responseInterceptor = apiInstance.interceptors.response.use(
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
            const response = await apiInstance.post(apis.auths.refresh(), {});
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
      apiInstance.interceptors.request.eject(requestInterceptor);
      apiInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken]);

  return (
    <AxiosContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </AxiosContext.Provider>
  );
};

export const useAxios = () => React.useContext(AxiosContext);
export default Axios;
