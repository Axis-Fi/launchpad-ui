import { createContext, useContext, useEffect } from "react";
import { useState } from "react";
import { useAccount, useConfig } from "wagmi";
import { createPointsClient, JWTPair, TokenStorage } from "@repo/points";

type AuthContextState = {
  isRegistered: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  register: (
    username: string,
    referrer?: string,
    avatar?: Blob,
  ) => Promise<JWTPair | undefined>;
  isUsernameAvailable: (username: string) => Promise<boolean | undefined>;
  signIn: () => void;
  linkWallet: () => void;
  getAccessToken: () => string | null;
};

const initialState = {} as AuthContextState;
export const AuthContext = createContext<AuthContextState>(initialState);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const config = useConfig();
  const pointsClient = createPointsClient(config);
  const { address, chain } = useAccount();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);

  useEffect(() => {
    async function getIsRegistered() {
      if (address == null) {
        setIsRegistered(false);
        return;
      }

      try {
        setIsLoading(true);
        const registered = await pointsClient.isRegistered(address);

        setIsRegistered(registered);
      } catch (e) {
        console.error(e);
      }
    }
    getIsRegistered();
  }, [address, pointsClient]);

  const isUsernameAvailable = async (username: string) => {
    try {
      return pointsClient.isUsernameAvailable(username);
    } catch (e) {
      console.error(e);
    }
  };

  const register = async (
    username: string,
    referrer?: string,
    avatar?: Blob,
  ) => {
    const chainId = chain?.id;
    if (!address || !chainId) return;

    setIsLoading(true);

    try {
      const response = await pointsClient.register(
        chainId,
        address,
        username,
        referrer,
        avatar,
      );

      TokenStorage.setAccessToken(response?.accessToken ?? "");
      TokenStorage.setRefreshToken(response?.refreshToken ?? "");

      return response;
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async () => {
    const chainId = chain?.id;
    if (!address || !chainId) return;

    setIsLoading(true);

    try {
      const response = await pointsClient.signIn(chainId, address);

      TokenStorage.setAccessToken(response?.accessToken ?? "");
      TokenStorage.setRefreshToken(response?.refreshToken ?? "");

      return response;
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // TODO refresh token

  const linkWallet = async () => {
    const chainId = chain?.id;
    if (!address || !chainId) return;

    setIsLoading(true);

    try {
      return pointsClient.linkWallet(chainId, address);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isRegistered,
        isLoading,
        isUsernameAvailable,
        register,
        signIn,
        linkWallet,
        getAccessToken: TokenStorage.getAccessToken,
        isAuthenticated: !!TokenStorage.getAccessToken(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
