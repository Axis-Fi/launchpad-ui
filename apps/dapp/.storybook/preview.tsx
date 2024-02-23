import type { Preview } from "@storybook/react";
import "@repo/ui/style.css";
import "../src/index.css";
import { BlockchainProvider } from "../src/context/blockchain-provider";
import { TooltipProvider } from "@repo/ui";
import React from "react";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "centered",
    backgrounds: {
      default: "grey",
      values: [
        { name: "black", value: "#000000" },
        { name: "white", value: "#ffffff" },
        { name: "grey", value: "#808080" },
      ],
    },
  },
  decorators: [
    (Story) => (
      <BlockchainProvider>
        <TooltipProvider delayDuration={350}>
          <Story />
        </TooltipProvider>
      </BlockchainProvider>
    ),
  ],
};

export default preview;
