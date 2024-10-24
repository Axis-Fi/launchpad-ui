import * as v from "valibot";
import { Address } from "abitype";

const BytesSchema = v.custom<`0x${string}`>((input: unknown): boolean =>
  typeof input === "string" ? /^0x[a-fA-F0-9]*$/.test(input) : false,
);

// Makes the TypeScript Address type valid for this schema
const AddressSchema = v.custom<Address>((input: unknown): boolean =>
  typeof input === "string" ? /^0x[a-fA-F0-9]{40}$/.test(input) : false,
);

export { AddressSchema, BytesSchema };
