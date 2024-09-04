import { createContext, useContext } from "react";
import { useState } from "react";
import { useAccount, useConfig } from "wagmi";
import { createPointsClient, TokenStorage } from "@repo/points";

type AuthContextState = {
  isRegistered: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  register: () => void;
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
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isRegistered] = useState<boolean>(false);

  //   useEffect(() => {
  //     // Set address registration status of connected wallet
  //     if (!address) {
  //       setRegistered(false);
  //       return;
  //     }

  //     // TODO: cannot use async here
  //     try {
  //       const registered = pointsClient.isRegistered(address);
  //       setRegistered(registered);
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   }, [address]);

  const register = async () => {
    const chainId = chain?.id;
    if (!address || !chainId) return;

    setLoading(true);

    try {
      const response = await pointsClient.register(chainId, address);

      TokenStorage.setAccessToken(response?.accessToken ?? "");
      TokenStorage.setRefreshToken(response?.refreshToken ?? "");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async () => {
    const chainId = chain?.id;
    if (!address || !chainId) return;

    setLoading(true);

    try {
      const response = await pointsClient.signIn(chainId, address);

      TokenStorage.setAccessToken(response?.accessToken ?? "");
      TokenStorage.setRefreshToken(response?.refreshToken ?? "");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // TODO refresh token

  const linkWallet = async () => {
    const chainId = chain?.id;
    if (!address || !chainId) return;

    setLoading(true);

    try {
      await pointsClient.linkWallet(chainId, address);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isRegistered,
        isLoading,
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
