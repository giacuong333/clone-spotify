import React, { createContext, useContext, useState } from "react";
import { instance } from "../../config/axios";
import { apis } from "../../constants/apis";
import { notify } from "../../components/Toast";
import { useNavigate } from "react-router-dom";
import paths from "../../constants/paths";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

const Auth = ({ children }) => {
  const [user, setUser] = useState({});
  const [token, setToken] = useState("");
  const [pendingLogin, setPendingLogin] = useState(false);
  const [pendingRegister, setPendingRegister] = useState(false);
  const [pendingLogout, setPendingLogout] = useState(false);
  const navigate = useNavigate();

  const login = async (payload) => {
    try {
      setPendingLogin(true);
      const response = await instance.post(apis.auths.login, payload);
      console.log("response:", response);
      if (response.status === 200) {
        const decoded = jwtDecode(token);
        console.log("Decoded", decoded);
        notify("Login successfully");
        // navigate(paths.home);
      }
    } catch (error) {
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
    } catch (error) {
      notify(error?.data?.message || "Something went wrong!", "error");
    } finally {
      setPendingRegister(false);
    }
  };

  const logout = async () => {
    try {
      setPendingLogout(true);
    } catch (error) {
    } finally {
      setPendingLogout(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        pendingLogin,
        pendingRegister,
        pendingLogout,
        login,
        register,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default Auth;
