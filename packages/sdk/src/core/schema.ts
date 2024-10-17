import * as v from "valibot";
import { Address } from "abitype";

const AddressSchema = v.special<Address>((input: unknown): boolean =>
  typeof input === "string" ? /^0x[a-fA-F0-9]{40}$/.test(input) : false,
);

export { AddressSchema };
