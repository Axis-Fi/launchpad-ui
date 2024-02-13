import { AuctionInfo } from "src/types";

export async function storeAuctionInfo(auctionInfo: AuctionInfo) {
    const response = await fetch("/ipfs", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(auctionInfo),
    });

    const body = await response.json();
    if (!body.hash) {
        throw new Error("Failed to store auction info");
    }

    return body.hash;
}

export async function getAuctionInfo(hash: string) {
    const response = await fetch(`/ipfs?hash=${hash}`);
    return await response.json() as AuctionInfo;
}
