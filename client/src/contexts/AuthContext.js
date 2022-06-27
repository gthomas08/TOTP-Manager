import { createContext, useContext, useState } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Check is user is already logged in
  const loggedAdminJSON = window.localStorage.getItem("loggedAdmin");
  let admin = null;
  if (loggedAdminJSON) {
    admin = JSON.parse(loggedAdminJSON);
  }

  const [adminInfo, setAdminInfo] = useState(admin);

  return (
    <AuthContext.Provider value={{ adminInfo, setAdminInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
