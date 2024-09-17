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
  isUserSignedIn: () => boolean;
  register: (
    username: string,
    referrer?: string,
    avatar?: Blob,
  ) => Promise<JWTPair | undefined>;
  isUsernameAvailable: (username: string) => Promise<boolean | undefined>;
  isUserRegistered: () => Promise<boolean | undefined>;
  isWalletRegistered: (address: Address) => Promise<boolean | undefined>;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
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

    return pointsClient.isRegistered(address);
  };

  const isWalletRegistered = async (address: Address) => {
    return pointsClient.isRegistered(address);
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
  };

  const signIn = async () => {
    if (!address || !chainId) return;

    const response = await pointsClient.signIn(chainId, address);

    TokenStorage.setAccessToken(response?.accessToken ?? "");
    TokenStorage.setRefreshToken(response?.refreshToken ?? "");
  };

  const signOut = async () => {
    return pointsClient.signOut();
  };

  const linkWallet = async () => {
    if (!address || !chainId) return;

    return pointsClient.linkWallet(chainId, address);
  };

  /* Points */

  const getWalletPoints = async (address: `0x${string}`) => {
    return pointsClient.getWalletPoints(address);
  };

  const getLeaderboard = async () => {
    return pointsClient.getLeaderboard();
  };

  // Requires user to be signed in
  const getUserProfile = async () => {
    return pointsClient.getUserProfile();
  };

  const setUserProfile = async (username?: string, avatar?: Blob) => {
    return pointsClient.setUserProfile(username, avatar);
  };

  const context = useMemo(
    () => ({
      isUserRegistered,
      isWalletRegistered,
      isUsernameAvailable,
      register,
      signIn,
      signOut,
      linkWallet,
      getWalletPoints,
      getLeaderboard,
      getUserProfile,
      setUserProfile,
      getAccessToken: TokenStorage.getAccessToken,
      isUserSignedIn: () => !!TokenStorage.getAccessToken(),
    }),
    // Only re-render dependency tree if the connected wallet or chain changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [address, chainId],
  );

  return (
    <PointsContext.Provider value={context}>{children}</PointsContext.Provider>
  );
};
