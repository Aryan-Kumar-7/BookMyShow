"use client";
import { User as Auth0User } from "@auth0/auth0-spa-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth0Client } from "../lib/auth0";

interface Auth0ContextType {
  isAuthentication: boolean;
  isLoading: boolean;
  user: Auth0User | undefined;
  loginWithRedirect: () => Promise<void>;
  logout: () => void;
}

const Auth0Context = createContext<Auth0ContextType | undefined>(undefined);

export const useAuth0 = () => {
  const context = useContext(Auth0Context);
  if (!context) {
    throw new Error("useAuth0 must be used within an Auth0Provider");
  }
  return context;
};

interface Auth0ProviderProps {
  children: React.ReactNode;
}

export const Auth0Provider: React.FC<Auth0ProviderProps> = ({ children }) => {
  const [isAuthentication, setIsAuthentication] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<Auth0User | undefined>();

  // Initialize Auth0 client
  useEffect(() => {
    const initAuth0 = async () => {
      try {
        // Check if returning from Auth0 redirect
        if (
          typeof window !== "undefined" &&
          window.location.search.includes("code=")
        ) {
          try {
            await auth0Client.handleRedirectCallback();
            window.history.replaceState(
              {},
              document.title,
              window.location.pathname
            );
          } catch (error) {
            console.error("Error handling redirect callback:", error);
          }
        }

        // Check if user is authenticated
        const authenticated = await auth0Client.isAuthenticated();
        setIsAuthentication(authenticated);

        if (authenticated) {
          const userProfile = await auth0Client.getUser();
          setUser(userProfile || undefined);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing Auth0:", error);
        setIsLoading(false);
      }
    };

    initAuth0();
  }, []);

  const loginWithRedirect = useCallback(async () => {
    if (!auth0Client) return;
    try {
      await auth0Client.loginWithRedirect({
        authorizationParams: {
          redirect_uri: typeof window !== 'undefined' ? window.location.origin : '',
          audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
        },
      });
    } catch (error) {
      console.error("Error during loginWithRedirect:", error);
    }
  }, []);

  const logout = useCallback(async () => {
    if (!auth0Client) return;
    try {
      setIsAuthentication(false);
      setUser(undefined);
      await auth0Client.logout({
        logoutParams: {
          returnTo: typeof window !== 'undefined' ? window.location.origin : '',
        },
      });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }, []);

  const value: Auth0ContextType = {
    isAuthentication,
    isLoading,
    user,
    loginWithRedirect,
    logout,
  };

  return (
    <Auth0Context.Provider value={value}>{children}</Auth0Context.Provider>
  );
};
