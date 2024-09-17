import React from "react";
import { useAccount } from "wagmi";
import { type Address, isAddress } from "viem";
import {
  Text,
  Button,
  Input,
  LabelWrapper,
  Select,
  SelectData,
  trimAddress,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@repo/ui";
import { useProfile } from "modules/points/hooks/use-profile";
import { useReferralLink } from "./use-referral-link";

export function ReferralLinkCard() {
  const { address: connectedAddress } = useAccount();
  const [address, setAddress] = React.useState<Address | undefined>(
    connectedAddress,
  );

  const { profile, isUserSignedIn } = useProfile();

  const { generateAndCopyLink, link } = useReferralLink(address);

  React.useEffect(() => {
    setAddress(connectedAddress);
  }, [connectedAddress]);

  const walletOptions: SelectData[] = isUserSignedIn
    ? profile?.wallets
        ?.filter((w) => !!w?.address)
        .map((lw) => ({
          label: trimAddress(lw.address!, 8),
          value: lw.address!,
        })) ?? []
    : [];

  const defaultAddress = profile?.wallets?.[0].address ?? connectedAddress;

  return (
    <div className="flex max-w-lg flex-col items-center justify-center gap-6">
      <Tabs
        defaultValue={isUserSignedIn ? "linkedWallets" : "address"}
        className="flex w-full flex-col items-center"
      >
        <TabsList defaultValue={isUserSignedIn ? "linkedWallets" : "address"}>
          <TabsTrigger value="address">Current Wallet</TabsTrigger>
          {isUserSignedIn && (
            <TabsTrigger value="linkedWallets">Linked Wallets</TabsTrigger>
          )}
        </TabsList>

        <LabelWrapper
          content="Address"
          tooltip="The address to collect the referrer fees. An hash of it will be derived and included in the link, not the original address."
          className="mt-4"
        >
          <TabsContent value="address">
            <Input
              defaultValue={address}
              onChange={(e) =>
                isAddress(e.target.value) && setAddress(e.target.value)
              }
            />
          </TabsContent>
          <TabsContent value="linkedWallets">
            <Select
              options={walletOptions}
              defaultValue={defaultAddress}
              onChange={(value) => setAddress(value as Address)}
              itemClassName="font-mono"
            />
          </TabsContent>
        </LabelWrapper>
      </Tabs>
      <Button
        disabled={!address}
        className="mt-4 inline uppercase"
        onClick={() => generateAndCopyLink()}
      >
        Generate and Copy Link
      </Button>
      {link && (
        <div className="mt-4 space-y-2 text-center text-xs">
          <Text>Your link:</Text>
          <Text size="xs">{link}</Text>
        </div>
      )}
    </div>
  );
}
