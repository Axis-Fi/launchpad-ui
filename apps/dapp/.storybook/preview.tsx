import type { Preview } from "@storybook/react";
import "@repo/ui/style.css";
import "../src/index.css";
import { Providers } from "../src/context/providers";
import { TooltipProvider } from "@repo/ui";
import React from "react";

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: ["Design System"],
      },
    },
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
      <Providers>
        <Story />
      </Providers>
    ),
  ],
};

export default preview;
