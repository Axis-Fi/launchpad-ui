import Plausible from "plausible-tracker";
import { environment } from "@axis-finance/env";
import { metadata } from "./metadata";

const domain = environment.isProduction
  ? metadata.prodURL
  : metadata.testnetURL;

const analytics = Plausible({
  domain,
  hashMode: true,
});

export default analytics;
