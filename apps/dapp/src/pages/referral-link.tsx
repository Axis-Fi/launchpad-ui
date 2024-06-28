import {
  Text,
  Button,
  Card,
  Input,
  LabelWrapper,
  Select,
  SelectData,
} from "@repo/ui";
import { PageContainer } from "modules/app/page-container";
import { useAuctions } from "modules/auction/hooks/use-auctions";
import { useReferralLink } from "modules/auction/hooks/use-referral-link";
import { getLinkUrl } from "modules/auction/utils/auction-details";
import React from "react";
import { getAuctionPath } from "utils/router";
import { Address, isAddress } from "viem";
import { useAccount } from "wagmi";

export function ReferralLinkPage() {
  const { address: connectedAddress } = useAccount();
  const [address, setAddress] = React.useState<Address | undefined>(
    connectedAddress,
  );
  const [path, setPath] = React.useState<string | undefined>();
  const { generateAndCopyLink, link } = useReferralLink(address);
  const auctions = useAuctions();

  React.useEffect(() => {
    setAddress(connectedAddress);
  }, [connectedAddress]);

  const opts: SelectData[] = auctions.data.map((a) => ({
    value: getAuctionPath(a),
    label: a.info?.name ?? a.baseToken.symbol,
    imgURL: getLinkUrl("projectLogo", a),
  }));

  return (
    <PageContainer title="Referrals" className="max-w-limit">
      <Card
        title="Earn fees by referring users"
        className="mx-auto w-full max-w-lg"
      >
        <div className="flex max-w-lg flex-col items-center justify-center gap-2">
          <LabelWrapper
            content="Address"
            tooltip="The address to collect the referrer fees. An hash of it will be derived and included in the link, not the original address."
            className="mt-2"
          >
            <Input
              defaultValue={address}
              onChange={(e) =>
                isAddress(e.target.value) && setAddress(e.target.value)
              }
            />
          </LabelWrapper>
          <LabelWrapper
            content="Auction"
            tooltip="Create a referral link to a specific auction"
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
      </Card>
    </PageContainer>
  );
}

export function ReferralLinkInput() {}
