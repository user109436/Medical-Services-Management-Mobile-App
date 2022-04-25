// https://github.com/user109436/e-consultation-app/blob/main/client/src/provider/AuthProvider.js
import React from "react";
const AuthContext = React.createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = React.useState(null);
  const [loggedInUser, setLoggedInUser] = React.useState(null);

  return (
    <AuthContext.Provider value={{
      auth,
      setAuth,
      loggedInUser,
      setLoggedInUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;