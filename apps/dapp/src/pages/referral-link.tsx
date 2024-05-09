import { Button, Input, LabelWrapper } from "@repo/ui";
import { PageContainer } from "modules/app/page-container";
import React from "react";
import { Address, isAddress } from "viem";

function generateLink(addr: string) {
  // String off the 0x at the beginning
  const address = addr.slice(2);

  // Convert to base64 encoding
  const encoded = btoa(address);

  // Create link
  const link = window.location.origin + "/#/?ref=" + encoded;

  return link;
}

export function ReferralLinkPage() {
  const [address, setAddress] = React.useState<Address>();
  const [link, setLink] = React.useState("");

  async function handleGenerateAndCopyLink() {
    if (address) {
      const l = generateLink(address.toString());
      setLink(l);
      await navigator.clipboard.writeText(l);
    }
  }

  return (
    <PageContainer title="Referrals">
      <div className="flex">
        <div className="mt-1 flex w-1/2 flex-col items-center ">
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
            onClick={handleGenerateAndCopyLink}
          >
            Generate and Copy Link
          </Button>
          <div className="mt-4">{link != "" && <p>Link: {link} </p>}</div>
        </div>
      </div>
    </PageContainer>
  );
}
