import React, { useEffect } from "react";
import { useAxios, instance } from "../../contexts/Axios";
import { apis } from "../../constants/apis";
import { notify } from "../../components/Toast";
import { useNavigate } from "react-router-dom";
import paths from "../../constants/paths";

const AuthContext = React.createContext();

const Auth = ({ children }) => {
	const [user, setUser] = React.useState(null);
	const [pendingLogin, setPendingLogin] = React.useState(false);
	const [pendingRegister, setPendingRegister] = React.useState(false);
	const [pendingLogout, setPendingLogout] = React.useState(false);
	const [pendingRefresh, setPendingRefresh] = React.useState(false);
	const navigate = useNavigate();
	const { accessToken, setAccessToken, setRefreshToken } = useAxios();

	useEffect(() => {
		if (localStorage.getItem("user")) {
			setUser(JSON.parse(localStorage.getItem("user")));
		}
	}, []);

	const login = async (payload) => {
		try {
			setPendingLogin(true);
			const response = await instance.post(apis.auths.login(), payload);
			console.log("Login response:", response.data);
			if (response.status === 200) {
				const { access, refresh, user } = response.data;
				// Store tokens in localStorage
				localStorage.setItem("accessToken", access);
				localStorage.setItem("refreshToken", refresh);
				localStorage.setItem("user", JSON.stringify(user));

				setAccessToken(access);
				setRefreshToken(refresh);
				setUser(user);
				notify("Login successful");
				navigate(user?.role === "admin" ? paths.admin : paths.home);
			}
		} catch (e) {
			console.error("Login failed:", e.response?.data || e.message);
			notify("Login failed", "error");
		} finally {
			setPendingLogin(false);
		}
	};

	const register = async (payload) => {
		try {
			setPendingRegister(true);
			const response = await instance.post(apis.users.register(), payload);
			if (response.status === 201) {
				notify("Registration successful");
				navigate(paths.login);
			}
		} catch (e) {
			console.error("Register failed:", e.response?.data || e.message);
			notify("Register failed", "error");
		} finally {
			setPendingRegister(false);
		}
	};

	const logout = async () => {
		try {
			setPendingLogout(true);
			// Send the refresh token in the logout request
			const refreshToken = localStorage.getItem("refreshToken");
			await instance.post(apis.auths.logout(), { refresh: refreshToken });

			// Clear all stored data
			localStorage.removeItem("accessToken");
			localStorage.removeItem("refreshToken");
			localStorage.removeItem("user");

			setAccessToken(null);
			setRefreshToken(null);
			setUser(null);

			notify("Logged out successfully");
			navigate(paths.login);
		} catch (e) {
			console.error("Logout failed:", e.response?.data || e.message);
		} finally {
			setPendingLogout(false);
		}
	};

	const isAuthenticated = !!accessToken && !!user;

	return (
		<AuthContext.Provider
			value={{
				user,
				pendingLogin,
				pendingRegister,
				pendingLogout,
				pendingRefresh,
				login,
				register,
				logout,
				isAuthenticated,
			}}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => React.useContext(AuthContext);
export default React.memo(Auth);
