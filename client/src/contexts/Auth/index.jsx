import React from "react";
import { useAxios, instance } from "../../contexts/Axios";
import { apis } from "../../constants/apis";
import { notify } from "../../components/Toast";
import { useNavigate } from "react-router-dom";
import paths from "../../constants/paths";

const AuthContext = React.createContext();

const Auth = ({ children }) => {
	const [user, setUser] = React.useState({});
	const [pendingLogin, setPendingLogin] = React.useState(false);
	const [pendingRegister, setPendingRegister] = React.useState(false);
	const [pendingLogout, setPendingLogout] = React.useState(false);
	const [pendingRefresh, setPendingRefresh] = React.useState(false);
	const navigate = useNavigate();
	const { accessToken, setAccessToken } = useAxios();

	React.useEffect(() => {
		if (accessToken) {
			return;
		}

		const refreshToken = async () => {
			try {
				setPendingRefresh(true);
				const response = await instance.post(apis.auths.refresh(), {});
				if (response.status === 200) {
					const { access, user } = response.data;
					setAccessToken(access);
					setUser(user);
				}
			} catch (error) {
				setAccessToken(null);
				setUser(null);
			} finally {
				setPendingRefresh(false);
			}
		};

		refreshToken();
	}, [accessToken, setAccessToken]);

	const login = async (payload) => {
		try {
			setPendingLogin(true);
			const response = await instance.post(apis.auths.login(), payload);
			if (response.status === 200) {
				const { access, user } = response.data;
				setAccessToken(access);
				setUser(user);
				notify("Login successfully");
				navigate(user?.role === "admin" ? paths.admin : paths.home);
			}
		} catch (e) {
			notify("Login failed", "error");
		} finally {
			setPendingLogin(false);
		}
	};

	const register = async (payload) => {
		try {
			setPendingRegister(true);
			const response = await instance.post(apis.users.create(), payload);
			if (response.status === 201) {
				notify("Registration successfull");
				navigate(paths.login);
			}
		} finally {
			setPendingRegister(false);
		}
	};

	const logout = async () => {
		try {
			setPendingLogout(true);
			await instance.post(apis.auths.logout(), {});
			setAccessToken(null);
			setUser(null);
			notify("Logged out successfully");
			navigate(paths.login);
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
