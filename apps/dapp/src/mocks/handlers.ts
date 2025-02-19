import { graphql, GraphQLHandler, http, HttpHandler, HttpResponse } from "msw";
import {
  toFunctionSelector,
  type Address,
  decodeAbiParameters,
  encodeAbiParameters,
  erc20Abi,
  AbiFunction,
} from "viem";
import { mockErc20Addresses } from "./stubs/mock-erc20s";
import { allDeployments } from "@axis-finance/deployments";
import { abis } from "@axis-finance/abis";
import { stubGetAuctionLotsQuery } from "./stubs/get-auction-lots-query";
import { stubGetBatchAuctionLotQuery } from "./stubs/get-batch-auction-lot-query-fpb";
import { extractChainName } from "./utils";
import { getChainById } from "utils/chain";
import { abi } from "modules/token/wrapper-abi";

const deployments = allDeployments.flat(1);

type RpcCall = {
  id: number;
  jsonrpc: string;
  method: string;
  params: [
    {
      data: string;
      to: Address;
      from: Address;
    },
    string,
  ];
};

type ContractName = keyof typeof abis;
const getContractNameFromAddress = (address: Address): ContractName => {
  let contractName;
  for (const deployment of deployments) {
    const [_contractName] =
      Object.entries(deployment.addresses).find(
        ([_name, _address]) => _address.toLowerCase() === address.toLowerCase(),
      ) ?? [];
    if (_contractName === undefined) continue;
    contractName = _contractName as ContractName;
    return contractName;
  }

  throw `Contract: ${address} not found in mock server`;
};

const getContractAbi = (to: Address) => {
  const isErc20 = mockErc20Addresses.find(
    (address) => address.toLowerCase() === to.toLowerCase(),
  );
  if (isErc20) return erc20Abi;
  const contractName = getContractNameFromAddress(to);
  console.log({ contractName });
  const abi = abis[contractName];
  return abi;
};

const getContract = (req: RpcCall) => {
  const { to, data } = req.params[0];

  const abi = getContractAbi(to);

  return {
    to,
    data,
    abi,
  };
};

export const handlers: (GraphQLHandler | HttpHandler)[] = [
  graphql.query("getAuctionLots", ({ variables }) => {
    const chain = getChainById(variables?.chainId);
    const chainName = chain?.name?.replace(/ /g, "-").toLowerCase();

    return HttpResponse.json({
      data: stubGetAuctionLotsQuery({ chain: chainName }),
    });
  }),
  graphql.query("getBatchAuctionLot", ({ variables }) => {
    const id = variables?.id;
    const chain = extractChainName(id);
    const lotId = id.substring(id.lastIndexOf("-") + 1);

    return HttpResponse.json({
      data: stubGetBatchAuctionLotQuery({ id, lotId, chain }),
    });
  }),
  http.post(
    "https://blast-sepolia.g.alchemy.com/v2/h6OEviwRZGmTSXHYPRmMquo5u-YoWLeY1",
    async ({ request }) => {
      const req = (await request.json()) as RpcCall;

      try {
        console.log({ req });

        if (req.method !== "eth_call") {
          return new HttpResponse(
            JSON.stringify({
              jsonrpc: "2.0",
              id: req.id,
              error: { code: -32601, message: "Method not supported" },
            }),
          );
        }

        // 1. Figure out which contract is being called
        const { to, abi, data } = getContract(req);
        console.log({
          abi,
        });
        if (!abi) {
          console.warn(`No ABI found for contract: ${to}`);
          return new HttpResponse(
            JSON.stringify({
              jsonrpc: "2.0",
              id: req.id,
              error: { code: -32602, message: "Contract not supported" },
            }),
          );
        }

        // 2. Figure out which function is being called
        const functionSelector = data.slice(0, 10);
        const abiEntry = abi.find(
          (entry: any) => functionSelector === toFunctionSelector(entry),
        );

        console.log({ functionSelector, abiEntry });

        if (!abiEntry) {
          return new HttpResponse(
            JSON.stringify({
              jsonrpc: "2.0",
              id: req.id,
              error: { code: -32602, message: "Function not found" },
            }),
          );
        }

        // Type guard function to check if the entry is a function
        function isAbiFunction(entry: any): entry is AbiFunction {
          return entry.type === "function" && "name" in entry;
        }

        // Only proceed if it's a function type
        if (!isAbiFunction(abiEntry)) {
          return new HttpResponse(
            JSON.stringify({
              jsonrpc: "2.0",
              id: req.id,
              error: { code: -32602, message: "Not a function call" },
            }),
          );
        }

        // 3. Extract function parameters
        const params = decodeAbiParameters(
          abiEntry.inputs,
          `0x${data.slice(10)}`,
        );

        console.log({ params });

        // Get mock response for this contract and function
        // TODO:LMOCK_RESPONSES[contractAddress]?.[abiEntry.name];
        console.log("functionName", abiEntry.name);
        const mockFn = (functionName: string, ...x: unknown[]) => x;
        if (!mockFn) {
          return new HttpResponse(
            JSON.stringify({
              jsonrpc: "2.0",
              id: req.id,
              error: { code: -32602, message: "No mock response defined" },
            }),
          );
        }

        // Get mock response data
        const mockResponse = await mockFn(...params);

        // 4. Encode response according to ABI
        const encodedResponse = encodeAbiParameters(
          [{ name: "test", type: "string" }], // TODO: abiEntry.output,
          ["hihi"], // TODO: Object.values(mockResponse),
        );

        // Return JSON-RPC response
        return new HttpResponse(
          JSON.stringify({
            jsonrpc: "2.0",
            id: req.id,
            result: encodedResponse,
          }),
        );
      } catch (error) {
        console.error("Error in RPC handler:", error);
        return new HttpResponse(
          JSON.stringify({
            jsonrpc: "2.0",
            id: req.id,
            error: { code: -32603, message: error ?? "Internal error" },
          }),
        );
      }
    },
  ),
];
