import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { useAxios } from "../../contexts/Axios";
import { apis } from "../../constants/apis";
import { notify } from "../../components/Toast";
import { useNavigate } from "react-router-dom";
import paths from "../../constants/paths";

const AuthContext = createContext();

const Auth = ({ children }) => {
  const [user, setUser] = useState({});
  const [pendingLogin, setPendingLogin] = useState(false);
  const [pendingRegister, setPendingRegister] = useState(false);
  const [pendingLogout, setPendingLogout] = useState(false);
  const [pendingRefresh, setPendingRefresh] = useState(false);
  const navigate = useNavigate();
  const { instance, accessToken, setAccessToken } = useAxios();

  useEffect(() => {
    if (accessToken) return;

    const refreshToken = async () => {
      try {
        setPendingRefresh(true);
        const response = await instance.post(apis.auths.refresh(), {});
        if (response.status === 200) {
          const { access, user } = response.data;
          setAccessToken(access);
          setUser({ ...user });
        }
      } finally {
        setPendingRefresh(false);
      }
    };

    if (!accessToken) {
      refreshToken();
    } else {
      setPendingRefresh(false);
    }
  }, [instance, accessToken, setAccessToken]);

  const login = async (payload) => {
    try {
      setPendingLogin(true);
      const response = await instance.post(apis.auths.login(), payload);
      if (response.status === 200) {
        const { access, user } = response.data;
        setAccessToken(access);
        notify("Login successfully");
        navigate(user?.role === "admin" ? paths.admin : paths.home);
        setUser({ ...user });
      }
    } finally {
      setPendingLogin(false);
    }
  };

  const register = async (payload) => {
    try {
      setPendingRegister(true);
      const response = await instance.post(apis.users.create(), payload);
      if (response.status === 201) {
        notify("Account registered successfully");
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
      setUser({});
      notify("Logged out successfully");
      navigate(paths.login);
    } finally {
      setPendingLogout(false);
    }
  };

  const isAuthenticated = useMemo(() => !!accessToken, [accessToken]);

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

export const useAuth = () => useContext(AuthContext);
export default React.memo(Auth);
