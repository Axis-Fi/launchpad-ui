import { createVerifiedFetch } from "@helia/verified-fetch";

const verifiedFetch = await createVerifiedFetch({
  gateways: [
    "https://ipfs.io",
    "https://nftstorage.link",
    "https://gateway.pinata.cloud",
    "https://w3s.link",
  ],
  routers: ["http://delegated-ipfs.dev"],
});

export { verifiedFetch };
