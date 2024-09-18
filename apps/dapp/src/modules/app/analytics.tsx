import Plausible from "plausible-tracker";
import { environment, metadata } from "@repo/env";

const domain = environment.isProduction
  ? metadata.prodURL
  : metadata.testnetURL;

const plausible = Plausible({
  domain,
  hashMode: true,
});

plausible.enableAutoPageviews();
