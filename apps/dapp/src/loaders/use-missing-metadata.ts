import { Auction } from "@axis-finance/types";
import { verifiedFetch } from "@helia/verified-fetch";
import { CID } from "multiformats/cid";

export async function fetchAuctionMetadata(auction: Auction) {
  if (auction.info) return auction;
  if (!auction.created.infoHash) {
    console.log("Auction missing infoHash, skipping...");
    return {
      ...auction,
      info: { links: [] },
    };
  }

  const isV0 = auction.created.infoHash.toLowerCase().startsWith("qm");
  const cid = isV0
    ? CID.parse(auction.created.infoHash).toV1().toString()
    : auction.created.infoHash;

  try {
    const response = await verifiedFetch(`ipfs://${cid}`);
    if (auction.created.infoHash.endsWith("qusuq")) {
      console.log("STARTING");
    }

    const contentType = response.headers.get("content-type") || "";
    console.log("Response Content-Type:", contentType);

    if (contentType.includes("application/json")) {
      console.log("Parsing JSON response...");
      const info = await response.json();
      console.log({ info });
      return {
        ...auction,
        info,
      };
    }

    if (contentType.includes("application/octet-stream")) {
      console.log("Parsing octet-stream...");
      const text = await response.text();

      if (auction.created.infoHash.endsWith("qusuq")) {
        console.log("HERE", { text });
      }

      try {
        const info = JSON.parse(text);

        if (auction.created.infoHash.endsWith("qusuq")) {
          console.log("PARSE", { id: auction.id, text, info });
        }
        return { ...auction, info };
      } catch (e) {
        if (auction.created.infoHash.endsWith("qusuq")) {
          console.log("CATCH", { text }, e);
        }
        console.warn("Failed to parse octet-stream as JSON:", {
          cid,
          text,
          e,
          auction,
        });
        return auction;
      }
    }

    console.warn("Skipping unknown content type:", contentType);
    return auction;
  } catch (error) {
    console.error("VERIFIED_FETCH_ERROR:", error, { auction, cid });
    return auction;
  } finally {
    console.log("Completed fetch for CID:", cid);
  }
}
