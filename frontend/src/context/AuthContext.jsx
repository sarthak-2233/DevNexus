import { createContext, useCallback, useContext, useMemo, useState } from "react";
import * as api from "@/services/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(api.getStoredUser);

  const login = useCallback(async (creds) => setUser(await api.login(creds)), []);
  const signup = useCallback(async (data) => setUser(await api.signup(data)), []);
  const logout = useCallback(async () => { await api.logout(); setUser(null); }, []);

  const value = useMemo(() => ({ user, login, signup, logout }), [user, login, signup, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
