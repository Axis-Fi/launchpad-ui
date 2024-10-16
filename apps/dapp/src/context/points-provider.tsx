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
    statement?: string,
  ) => Promise<JWTPair | undefined>;
  isUsernameAvailable: (username: string) => Promise<boolean | undefined>;
  isUserRegistered: () => Promise<boolean | undefined>;
  isWalletRegistered: (address: Address) => Promise<boolean | undefined>;
  signIn: (statement?: string) => Promise<void>;
  signOut: () => void;
  linkWallet: () => Promise<void>;
  getWalletPoints: (
    address: `0x${string}`,
  ) => Promise<WalletPoints | undefined>;
  getLeaderboard: () => Promise<Array<UserProfile> | undefined>;
  getRecentJoins: () => Promise<Array<UserProfile> | undefined>;
  getUserProfile: () => Promise<FullUserProfile | undefined>;
  setUserProfile: (username?: string, avatar?: Blob) => void;
  getAccessToken: () => string | null;
  pointsClient: ReturnType<typeof createPointsClient>;
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

  const register = async (
    username: string,
    referrer?: string,
    avatar?: Blob,
    statement?: string,
  ) => {
    enforceChainId(chainId);
    enforceAddress(address);

    const response = await pointsClient.register(
      chainId,
      address,
      username,
      referrer,
      avatar,
      statement,
    );

    TokenStorage.setAccessToken(response?.accessToken ?? "");
    TokenStorage.setRefreshToken(response?.refreshToken ?? "");

    return response;
  };

  const signIn = async (statement?: string) => {
    if (!address || !chainId) return;

    const response = await pointsClient.signIn(chainId, address, statement);

    TokenStorage.setAccessToken(response?.accessToken ?? "");
    TokenStorage.setRefreshToken(response?.refreshToken ?? "");
  };

  const linkWallet = async () => {
    if (!address || !chainId) return;

    return pointsClient.linkWallet(chainId, address);
  };

  const context = useMemo(
    () => ({
      pointsClient,
      isUserRegistered,
      register,
      signIn,
      linkWallet,
      signOut: pointsClient.signOut.bind(pointsClient),
      isWalletRegistered: pointsClient.isRegistered.bind(pointsClient),
      isUsernameAvailable: pointsClient.isUsernameAvailable.bind(pointsClient),
      getWalletPoints: pointsClient.getWalletPoints.bind(pointsClient),
      getLeaderboard: pointsClient.getLeaderboard.bind(pointsClient),
      getRecentJoins: pointsClient.getRecentJoins.bind(pointsClient),
      getUserProfile: pointsClient.getUserProfile.bind(pointsClient),
      setUserProfile: pointsClient.setUserProfile.bind(pointsClient),
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
