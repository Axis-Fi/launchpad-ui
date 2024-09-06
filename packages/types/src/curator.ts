import { Address } from "./axis-contracts";

export type Curator = {
  address: Address;
  name: string;
  avatar: string;
  description?: string;
  twitter?: string;
  website?: string;
  reportURL?: string;
  type: "curator" | "platform";
};
