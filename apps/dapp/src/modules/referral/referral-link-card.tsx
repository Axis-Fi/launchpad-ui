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
import { useAuctions } from "modules/auction/hooks/use-auctions";
import { useReferralLink } from "./use-referral-link";
import { getLinkUrl } from "modules/auction/utils/auction-details";
import React from "react";
import { getAuctionPath } from "utils/router";
import { Address, isAddress } from "viem";
import { useAccount } from "wagmi";
import { mockProfile } from "modules/points/profile";

export function ReferralLinkCard() {
  const { address: connectedAddress } = useAccount();
  const [address, setAddress] = React.useState<Address | undefined>(
    connectedAddress,
  );
  //TODO: update
  const profile = mockProfile;
  const [path, setPath] = React.useState<string | undefined>();

  const { generateAndCopyLink, link } = useReferralLink(address);
  const auctions = useAuctions();

  React.useEffect(() => {
    setAddress(connectedAddress);
  }, [connectedAddress]);

  const opts: SelectData[] = auctions.data
    .filter(
      (a) => a.isSecure && (a.status === "created" || a.status === "live"),
    )
    .map((a) => ({
      value: getAuctionPath(a),
      label: a.info?.name ?? a.baseToken.symbol,
      imgURL: getLinkUrl("projectLogo", a),
    }));

  const walletOpts: SelectData[] =
    profile.linked_wallets.map((lw) => ({
      label: trimAddress(lw.address, 8),
      value: lw.address,
    })) ?? [];

  //TODO: update with correct profile hook check
  const isRegistered = walletOpts.length > 0;

  return (
    <div className="flex max-w-lg flex-col items-center justify-center gap-6">
      <Tabs
        defaultValue={isRegistered ? "linkedWallets" : "address"}
        className="flex w-full flex-col items-center"
      >
        <TabsList defaultValue={isRegistered ? "linkedWallets" : "address"}>
          <TabsTrigger value="address">New Address</TabsTrigger>
          {isRegistered && (
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
              options={walletOpts}
              defaultValue={profile.linked_wallets?.[0].address}
              onChange={(value) => setAddress(value as Address)}
              itemClassName="font-mono"
            />
          </TabsContent>
        </LabelWrapper>
      </Tabs>
      <LabelWrapper
        content="Launch"
        tooltip="Create a referral link to a specific launch. You'll still earn fees if the user participates in other launches"
      >
        <Select options={opts} onChange={setPath} />
      </LabelWrapper>
      <Button
        disabled={!address}
        className="mt-4 inline uppercase"
        onClick={() => generateAndCopyLink(path)}
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
