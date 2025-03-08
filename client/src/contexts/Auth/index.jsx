import React, { createContext, useContext } from "react";

const AuthContext = createContext();

const Auth = ({ children }) => {
  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
export default Auth;
