import { CodegenConfig } from "@graphql-codegen/cli";

const ENDPOINT =
  "https://api.studio.thegraph.com/query/65230/axisfi-auctions/0.0.5";

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
        fetcher: {
          endpoint: `${ENDPOINT}`,
          fetchParams: {
            headers: {
              "Content-Type": "application/json",
            },
          },
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
