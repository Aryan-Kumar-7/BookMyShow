"use client";

import { User } from "@auth0/auth0-spa-js";
import { useContext, createContext, useState, useEffect } from "react";
import { useAuth0 } from "./Auth0Context";

interface Auth0UserProfile {
  sub?: string;
  name?: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  login: () => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  auth0User: Auth0UserProfile | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Use Auth0 SPA SDK

  const {
    user: auth0User,
    isAuthentication,
    isLoading: auth0Loading,
    loginWithRedirect,
    logout: auth0Logout,
  } = useAuth0();

  const login = async () => {
    await loginWithRedirect();
  };

  const logout = () => {
    setUser(null);
    auth0Logout();
  };

  useEffect(() => {
    if(isAuthentication && auth0User) {
      setUser(auth0User);
    } else {
      setUser(null);
    }
  }, [isAuthentication, auth0User]);

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading: auth0Loading,
    auth0User: auth0User as Auth0UserProfile | undefined,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
