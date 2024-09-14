import { useAccount } from "wagmi";
import { trimAddress, Text } from "@repo/ui";

export function ConnectedWallet({ trim = true }: { trim?: boolean }) {
  const { address } = useAccount();
  return (
    <Text className="text-start">
      <span className="flex items-center gap-x-2">
        Connected Wallet{" "}
        <Text mono size="xs" as="span">
          [HIDDEN]
        </Text>
      </span>
      {address != null && (trim ? trimAddress(address, 16) : address)}
    </Text>
  );
}
