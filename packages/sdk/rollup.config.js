import path from "path";
import { fileURLToPath } from "url";
import createConfig from "@repo/rollup-config";

const __filename = fileURLToPath(import.meta.url);
const packageDir = path.dirname(__filename);

export default createConfig(packageDir);
