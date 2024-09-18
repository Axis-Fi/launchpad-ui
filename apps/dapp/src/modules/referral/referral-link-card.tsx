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
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@repo/ui";
import { useProfile } from "modules/points/hooks/use-profile";
import { useReferralLink } from "./use-referral-link";
import { ShareRefLinkButton } from "./share-ref-link-button";

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
          label: lw.address!,
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
          className="mt-lg"
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

      <div className="gap-x-md mt-md flex justify-center">
        <ShareRefLinkButton />

        <Button
          disabled={!address}
          className="w-full"
          onClick={() => generateAndCopyLink()}
        >
          Generate and Copy Link
        </Button>
      </div>

      {link && (
        <div className="space-y-xs mt-xs text-center">
          <Text>Your link:</Text>
          <Text size="md">{link}</Text>
        </div>
      )}
    </div>
  );
}
