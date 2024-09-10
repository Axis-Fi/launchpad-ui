import { createContext, useContext, useEffect } from "react";
import { useState } from "react";
import { useAccount, useConfig } from "wagmi";
import {
  createPointsClient,
  FullUserProfile,
  TokenStorage,
  UserProfile,
  WalletPoints,
} from "@repo/points";

type PointsContextState = {
  isRegistered: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  register: (username: string, referrer?: string, avatar?: Blob) => void;
  isUsernameAvailable: (username: string) => Promise<boolean | undefined>;
  signIn: () => void;
  linkWallet: () => void;
  getWalletPoints: (
    address: `0x${string}`,
  ) => Promise<WalletPoints | undefined>;
  getLeaderboard: () => Promise<Array<UserProfile> | undefined>;
  getUserProfile: () => Promise<FullUserProfile | undefined>;
  setUserProfile: (username?: string, avatar?: Blob) => void;
  getAccessToken: () => string | null;
};

const initialState = {} as PointsContextState;
export const PointsContext = createContext<PointsContextState>(initialState);

export const usePoints = () => {
  return useContext(PointsContext);
};

export const PointsProvider = ({ children }: { children: React.ReactNode }) => {
  const config = useConfig();
  const pointsClient = createPointsClient(config);
  const { address, chain } = useAccount();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);

  // Authentication

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
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

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

  // Points

  const getWalletPoints = async (address: `0x${string}`) => {
    try {
      return pointsClient.getWalletPoints(address);
    } catch (e) {
      console.error(e);
    }
  };

  const getLeaderboard = async () => {
    try {
      return pointsClient.getLeaderboard();
    } catch (e) {
      console.error(e);
    }
  };

  // Requires user to be signed in
  const getUserProfile = async () => {
    try {
      return pointsClient.getUserProfile();
    } catch (e) {
      console.error(e);
    }
  };

  const setUserProfile = async (username?: string, avatar?: Blob) => {
    try {
      return pointsClient.setUserProfile(username, avatar);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <PointsContext.Provider
      value={{
        isRegistered,
        isLoading,
        isUsernameAvailable,
        register,
        signIn,
        linkWallet,
        getWalletPoints,
        getLeaderboard,
        getUserProfile,
        setUserProfile,
        getAccessToken: TokenStorage.getAccessToken,
        isAuthenticated: !!TokenStorage.getAccessToken(),
      }}
    >
      {children}
    </PointsContext.Provider>
  );
};
