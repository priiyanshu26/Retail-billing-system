// import { createContext, useContext, useEffect, useState } from "react";
// import { getToken, saveToken, removeToken } from "../utils/tokenUtils";
// import { getUserRole, getUsername } from "../utils/roleUtils";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(null);
//   const [role, setRole] = useState(null);
//   const [username, setUsername] = useState(null);

//   useEffect(() => {
//     const storedToken = getToken();
//     if (storedToken) {
//       setToken(storedToken);
//       setRole(getUserRole(storedToken));
//       setUsername(getUsername(storedToken));
//     }
//   }, []);

//   const login = (jwtToken) => {
//     saveToken(jwtToken);
//     setToken(jwtToken);
//     setRole(getUserRole(jwtToken));
//     setUsername(getUsername(jwtToken));
//   };

//   const logout = () => {
//     removeToken();
//     setToken(null);
//     setRole(null);
//     setUsername(null);
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         token,
//         role,
//         username,
//         isAuthenticated: !!token,
//         login,
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
import { createContext, useContext, useEffect, useState } from "react";
import { getToken, saveToken, removeToken } from "../utils/tokenUtils";
import { getUserRole, getUsername, getUserId } from "../utils/roleUtils";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedToken = getToken();
    if (storedToken) {
      setToken(storedToken);
      setRole(getUserRole(storedToken));
      setUsername(getUsername(storedToken));
      setUserId(getUserId(storedToken));
    }
  }, []);

  const login = (jwtToken) => {
    saveToken(jwtToken);
    setToken(jwtToken);
    setRole(getUserRole(jwtToken));
    setUsername(getUsername(jwtToken));
    setUserId(getUserId(jwtToken));
  };

  const logout = () => {
    removeToken();
    setToken(null);
    setRole(null);
    setUsername(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        username,
        userId,
        isAuthenticated: Boolean(token),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
