import { Address } from "./axis-contracts";

export type Curator = {
  id: string;
  address: Address | Address[];
  name: string;
  avatar: string;
  description?: string;
  twitter?: string;
  website?: string;
  reportURL?: string;
  type: "curator" | "platform";

  banner?: string;
  bannerMobile?: string;
};
