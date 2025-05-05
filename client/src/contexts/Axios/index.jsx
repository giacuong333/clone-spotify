import React from "react";
import axios from "axios";

const AxiosContext = React.createContext();

const instance = axios.create({
	// baseURL: import.meta.env.VITE_BASE_URL,
	baseURL: "http://localhost:8000",
	timeout: 10000,
	withCredentials: true,
	headers: { "Content-Type": "application/json" },
});

const Axios = ({ children }) => {
	const [accessToken, setAccessToken] = React.useState(null);

	React.useEffect(() => {
		const requestInterceptor = instance.interceptors.request.use(
			(config) => {
				console.log("Request URL:", config.url);
				console.log(
					"Current access token state: ",
					accessToken ? "exists" : "missing"
				);

				if (accessToken) {
					config.headers.Authorization = `Bearer ${accessToken}`;
					console.log(
						"Applied authorization header:",
						config.headers.Authorization
					);
				} else {
					console.log("No authorization header applied");
				}
				console.log("Headers: ", { ...config.headers });
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
					originalRequest.url !== apis.auths.logout() &&
					originalRequest.url !== apis.auths.login() &&
					originalRequest.url !== apis.auths.refresh()
				) {
					originalRequest._retry = true;
					try {
						const response = await instance.post(apis.auths.refresh(), {});
						if (response.status === 200) {
							const { access, user } = response.data;
							console.log("Access: ", access);
							console.log("User: ", user);
							setAccessToken(access);
							originalRequest.headers["Authorization"] = `Bearer ${access}`;
						}

						return instance.request(originalRequest);
					} catch (error) {
						console.error("Refresh failed", error);
						setAccessToken(null);
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
			console.log("Cleaning up Axios interceptors");
			instance.interceptors.request.eject(requestInterceptor);
			instance.interceptors.response.eject(responseInterceptor);
		};
	}, [accessToken]);

	return (
		<AxiosContext.Provider value={{ accessToken, setAccessToken }}>
			{children}
		</AxiosContext.Provider>
	);
};

const useAxios = () => React.useContext(AxiosContext);

export { instance, useAxios };

export default Axios;
