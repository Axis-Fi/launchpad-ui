import fs from "fs";

// Read the original package.json
const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf8"));

// Create a new package.json for publication
const publishPackageJson = {
  ...packageJson,
  dependencies: Object.fromEntries(
    Object.entries(packageJson.dependencies).filter(
      ([name]) => !name.startsWith("@repo/"),
    ),
  ),
};

// Write the modified package.json
fs.writeFileSync("./package.json", JSON.stringify(publishPackageJson, null, 2));
