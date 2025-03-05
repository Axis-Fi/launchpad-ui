import { useQuery } from "@tanstack/react-query";
import { ipfsServers } from "@axis-finance/env";
import { environment } from "utils/environment";

const { url: ipfsUrl } =
  ipfsServers[environment.current] ?? ipfsServers.staging;

const fetchVerificationStatus = async () => {
  const response = await fetch(`${ipfsUrl}/auth/is-verified`, {
    credentials: "include",
    mode: "cors",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch verification status");
  }

  return response.json();
};

export type TwitterUser = {
  id: string;
  name: string;
  username: string;
  address: string;
  banner: string;
  avatar: string;
  description: string;
  website: string;
};

type UseVerifyTwitter =
  | {
      isVerified: false;
      user: undefined;
      isLoading: boolean;
      error: Error | null;
      redirectToVerify: () => void;
      signOut: () => void;
    }
  | {
      isVerified: true;
      user: TwitterUser;
      isLoading: false;
      error: Error | null;
      redirectToVerify: () => void;
      signOut: () => void;
    };

const useVerifyTwitter = (): UseVerifyTwitter => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["twitter-verification"],
    queryFn: fetchVerificationStatus,
  });

  const redirectToVerify = () => {
    window.location.href = `${ipfsUrl}/auth/verify-twitter-handle`;
  };

  const signOut = () => {
    window.location.href = `${ipfsUrl}/auth/sign-out`;
  };

  return {
    isVerified: data?.success,
    user: data?.user,
    isLoading,
    error,
    redirectToVerify,
    signOut,
  };
};

export { useVerifyTwitter };
