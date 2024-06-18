import { Button, Input, LabelWrapper } from "@repo/ui";
import { PageContainer } from "modules/app/page-container";
import { useReferralLink } from "modules/auction/hooks/use-referral-link";
import React from "react";
import { Address, isAddress } from "viem";

export function ReferralLinkPage() {
  const [address, setAddress] = React.useState<Address>();
  const { generateAndCopyLink, link } = useReferralLink(address);

  return (
    <PageContainer title="Referrals">
      <div className="flex">
        <div className="mx-auto flex max-w-sm flex-col justify-center gap-2">
          <h4>Earn fees by referring bidders</h4>
          <LabelWrapper content="Address" className="mt-2">
            <Input
              onChange={(e) =>
                isAddress(e.target.value) && setAddress(e.target.value)
              }
            />
          </LabelWrapper>
          <div className="mt-4 flex flex-row gap-2"></div>
          <Button
            disabled={!address}
            className="inline uppercase"
            onClick={() => generateAndCopyLink()}
          >
            Generate and Copy Link
          </Button>
          <div className="mt-4">{link != "" && <p>Link: {link} </p>}</div>
        </div>
      </div>
    </PageContainer>
  );
}
