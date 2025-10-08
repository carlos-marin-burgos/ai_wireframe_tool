import { useState, useEffect } from "react";

export interface UserInfo {
  userId: string;
  userDetails: string;
  userRoles: string[];
  identityProvider: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserInfo | null;
  isLoading: boolean;
}

/**
 * Custom hook to get authentication information from Azure Static Web Apps
 * Uses the built-in /.auth/me endpoint provided by Azure Static Web Apps
 */
export const useAuth = (): AuthState => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("/.auth/me");
        const data = await response.json();

        console.log("Auth response:", data); // Debug log

        if (data.clientPrincipal) {
          console.log("User authenticated:", data.clientPrincipal.userDetails);
          setAuthState({
            isAuthenticated: true,
            user: {
              userId: data.clientPrincipal.userId,
              userDetails: data.clientPrincipal.userDetails,
              userRoles: data.clientPrincipal.userRoles || ["authenticated"],
              identityProvider: data.clientPrincipal.identityProvider,
            },
            isLoading: false,
          });
        } else {
          console.log("User NOT authenticated - redirecting to login");
          setAuthState({
            isAuthenticated: false,
            user: null,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
      }
    };

    fetchUserInfo();
  }, []);

  return authState;
};

/**
 * Logout function that redirects to Azure Static Web Apps logout endpoint
 */
export const logout = () => {
  window.location.href = "/.auth/logout";
};

/**
 * Login function that redirects to Azure Static Web Apps login endpoint
 * @param provider - The identity provider to use (azureactivedirectory, github, twitter, google)
 */
export const login = (provider: string = "azureactivedirectory") => {
  window.location.href = `/.auth/login/${provider}`;
};
