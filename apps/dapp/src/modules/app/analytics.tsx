import Plausible from "plausible-tracker";
import { environment } from "utils/environment";
import { metadata } from "./metadata";

const domain = environment.isProduction
  ? metadata.prodURL
  : metadata.testnetURL;

const analytics = Plausible({
  domain,
  hashMode: true,
});

export default analytics;
