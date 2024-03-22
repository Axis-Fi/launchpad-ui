import { CodegenConfig } from "@graphql-codegen/cli";
import * as deps from "@repo/deployments";

//TODO: improve
const ENDPOINT =
  "https://api.studio.thegraph.com/query/52935/axis-origin-blast-testnet/0.0.22";

const config: CodegenConfig = {
  schema: ENDPOINT,
  documents: ["queries/**/*.graphql"],
  generates: {
    "./src/generated/index.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-query",
      ],
      config: {
        reactQueryVersion: 5,
        fetcher: "fetch",

        namingConvention: {
          enumValues: "change-case-all#titleCase", // Avoids conflicts with enum values, e.g. AuctionLot_OrderBy
        },
        strictScalars: true,
        skipTypename: true,
        scalars: {
          Int: {
            input: "string",
            output: "string",
          },
          Int8: {
            input: "string",
            output: "string",
          },
          Float: {
            input: "string",
            output: "string",
          },
          BigDecimal: {
            input: "string",
            output: "string",
          },
          BigInt: {
            input: "string",
            output: "string",
          },
          Bytes: {
            input: "string",
            output: "string",
          },
        },
      },
    },
  },
};

export default config;
