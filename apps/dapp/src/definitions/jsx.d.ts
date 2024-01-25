import "react";

declare module "react" {
  declare namespace JSX {
    interface IntrinsicElements {
      //Web3Modal web components
      "w3m-button": HTMLAttributes;
    }
  }
}
