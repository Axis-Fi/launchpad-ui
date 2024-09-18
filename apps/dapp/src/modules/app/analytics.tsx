import Plausible from "plausible-tracker";
import { environment, metadata } from "@repo/env";

const domain = environment.isProduction
  ? metadata.prodURL
  : metadata.testnetURL;

const analytics = Plausible({
  domain,
  hashMode: true,
});

export default analytics;
