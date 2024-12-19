import { useQuery } from "@tanstack/react-query";
import { ipfsServers, environment } from "@axis-finance/env";

const { url: ipfsUrl } =
  ipfsServers[environment.current] ?? ipfsServers.staging;

const fetchVerificationStatus = async () => {
  const response = await fetch(`${ipfsUrl}/auth/is-verified`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch verification status");
  }

  const data = await response.json();
  return data.success;
};

const useVerifyTwitter = () => {
  const {
    data: isVerified = false,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["twitter-verification"],
    queryFn: fetchVerificationStatus,
  });

  const redirectToVerify = () => {
    window.location.href = `${ipfsUrl}/auth/verify-twitter-handle`;
  };

  return {
    isVerified,
    isLoading,
    error,
    redirectToVerify,
  };
};

export { useVerifyTwitter };
