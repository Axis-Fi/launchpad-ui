import { Button, Input, LabelWrapper } from "@repo/ui";
import { PageContainer } from "modules/app/page-container";
import React from "react";
import { Address, isAddress } from "viem";

function hexToBinary(hex: string) {
  const bin = [];
  let i = 0;
  let d;
  let b;
  while (i < hex.length) {
    d = parseInt(hex.slice(i, i + 2), 16);
    b = String.fromCharCode(d);
    bin.push(b);
    i += 2;
  }

  return bin.join("");
}

function urlSafe(b64Str: string) {
  return b64Str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "~");
}

function generateLink(addr: string) {
  // Remove the hex string prefix and convert to binary
  const bin = hexToBinary(addr.slice(2));

  // Convert to base64
  const encoded = btoa(bin);

  // Make encoding URL safe
  const urlEncoded = urlSafe(encoded);

  // Create link
  const link = window.location.origin + "/#/?ref=" + urlEncoded;

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
