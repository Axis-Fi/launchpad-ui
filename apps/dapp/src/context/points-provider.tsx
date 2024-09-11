import { createContext, useContext, useMemo } from "react";
import { useAccount, useConfig } from "wagmi";
import {
  createPointsClient,
  TokenStorage,
  type FullUserProfile,
  type JWTPair,
  type UserProfile,
  type WalletPoints,
} from "@repo/points";
import type { Address } from "viem";

type PointsContext = {
  isUserSignedIn: boolean;
  register: (
    username: string,
    referrer?: string,
    avatar?: Blob,
  ) => Promise<JWTPair | undefined>;
  isUsernameAvailable: (username: string) => Promise<boolean | undefined>;
  isUserRegistered: () => Promise<boolean | undefined>;
  signIn: () => Promise<void>;
  linkWallet: () => Promise<void>;
  getWalletPoints: (
    address: `0x${string}`,
  ) => Promise<WalletPoints | undefined>;
  getLeaderboard: () => Promise<Array<UserProfile> | undefined>;
  getUserProfile: () => Promise<FullUserProfile | undefined>;
  setUserProfile: (username?: string, avatar?: Blob) => void;
  getAccessToken: () => string | null;
};

const initialState = {} as PointsContext;
export const PointsContext = createContext<PointsContext>(initialState);

export const usePoints = () => {
  return useContext(PointsContext);
};

const enforceChainId: (chainId?: number) => asserts chainId is number = (
  chainId?: number,
) => {
  if (chainId == null) {
    throw new Error("Chain ID is not connected.");
  }
};
const enforceAddress: (address?: Address) => asserts address is Address = (
  address?: Address,
) => {
  if (address == null) {
    throw new Error("Address is not connected.");
  }
};

export const PointsProvider = ({ children }: { children: React.ReactNode }) => {
  const config = useConfig();
  const pointsClient = useMemo(() => createPointsClient(config), [config]);

  const { address, chainId } = useAccount();

  /* Authentication */

  const isUserRegistered = async () => {
    if (address == null) {
      return false;
    }

    try {
      return pointsClient.isRegistered(address);
    } catch (e) {
      console.error(e);
    }
  };

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
    enforceChainId(chainId);
    enforceAddress(address);

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
    }
  };

  const signIn = async () => {
    if (!address || !chainId) return;

    try {
      const response = await pointsClient.signIn(chainId, address);

      TokenStorage.setAccessToken(response?.accessToken ?? "");
      TokenStorage.setRefreshToken(response?.refreshToken ?? "");
    } catch (e) {
      console.error(e);
    }
  };

  const linkWallet = async () => {
    if (!address || !chainId) return;

    try {
      return pointsClient.linkWallet(chainId, address);
    } catch (e) {
      console.error(e);
    }
  };

  /* Points */

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

  const context = useMemo(
    () => ({
      isUserRegistered,
      isUsernameAvailable,
      register,
      signIn,
      linkWallet,
      getWalletPoints,
      getLeaderboard,
      getUserProfile,
      setUserProfile,
      getAccessToken: TokenStorage.getAccessToken,
      isUserSignedIn: !!TokenStorage.getAccessToken(),
    }),
    // Only re-render dependentcy tree if the connected wallet or chain changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [address, chainId],
  );

  return (
    <PointsContext.Provider value={context}>{children}</PointsContext.Provider>
  );
};
