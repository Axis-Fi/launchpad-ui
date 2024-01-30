import type { Preview } from "@storybook/react";
import "@repo/ui/style.css";
import { TooltipProvider } from "@repo/ui";

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
  },
  decorators: [
    (Story) => (
      <TooltipProvider delayDuration={350}>
        <Story />
      </TooltipProvider>
    ),
  ],
};

export default preview;
