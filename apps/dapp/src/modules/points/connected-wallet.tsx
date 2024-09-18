import { useAccount } from "wagmi";
import { trimAddress, Text } from "@repo/ui";

export function ConnectedWallet({ trim = true }: { trim?: boolean }) {
  const { address } = useAccount();
  return (
    <Text className="text-start">
      <span className="gap-x-sm flex items-center">
        <Text>Connected Wallet </Text>
        <Text mono size="xs" as="span">
          [PRIVATE]
        </Text>
      </span>
      <Text mono size="md">
        {address != null && (trim ? trimAddress(address, 16) : address)}
      </Text>
    </Text>
  );
}
