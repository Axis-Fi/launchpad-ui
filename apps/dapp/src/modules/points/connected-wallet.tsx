import { useAccount } from "wagmi";
import { trimAddress, Text } from "@repo/ui";

export function ConnectedWallet() {
  const { address } = useAccount();
  return (
    <Text className="text-start">
      <span className="flex items-center gap-x-2">
        Connected Wallet{" "}
        <Text mono size="xs" as="span">
          [HIDDEN]
        </Text>
      </span>
      {address != null && trimAddress(address, 16)}
    </Text>
  );
}
