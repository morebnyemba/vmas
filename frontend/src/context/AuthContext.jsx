import { createContext, useContext, useState, useEffect } from 'react'; // Added useEffect import

// AuthContext.js
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const login = (token) => {
    localStorage.setItem("accessToken", token.access);
    localStorage.setItem("refreshToken", token.refresh);
    setUser(token.user); // Assuming token contains user info
  };
  
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  };

  // Load user from localStorage when app loads
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setUser({ access: token }); // Handle user loading logic as needed
    }
    setLoading(false);
  }, []);
  
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
