const fs = require("fs");
const path = require("path");

// Define paths for the core and periphery directories
const coreDir = path.resolve(__dirname, "../../../moonraker/deployments"); // Adjust 'core-directory' with the actual name
const peripheryDir = path.resolve(
  __dirname,
  "../../../axis-periphery/deployments",
);

// Function to get the source directory based on the provided argument
function getSourceDir(type) {
  if (type === "core") {
    return coreDir;
  } else if (type === "periphery") {
    return peripheryDir;
  } else {
    throw new Error("Invalid type specified. Use 'core' or 'periphery'.");
  }
}

// Function to get the latest version or the specific version files
function getVersionedFiles(files, specifiedVersion = null) {
  const versionedFiles = files
    .map((file) => {
      const match = file.match(/(.+)-v(\d+\.\d+\.\d+)\.json$/);
      if (match) {
        const [fullName, baseName, version] = match;
        return { fullName, baseName, version };
      }
      return null;
    })
    .filter(Boolean);

  if (specifiedVersion) {
    return versionedFiles.filter((file) => file.version === specifiedVersion);
  } else {
    versionedFiles.sort((a, b) => {
      const verA = a.version.split(".").map(Number);
      const verB = b.version.split(".").map(Number);

      for (let i = 0; i < 3; i++) {
        if (verA[i] > verB[i]) return -1;
        if (verA[i] < verB[i]) return 1;
      }
      return 0;
    });

    const latestVersion = versionedFiles[0].version;
    return versionedFiles.filter((file) => file.version === latestVersion);
  }
}

// Main function to copy files
function copyFiles(type, version = null) {
  const sourceDir = getSourceDir(type);

  if (!fs.existsSync(sourceDir)) {
    console.error(`Source directory does not exist: ${sourceDir}`);
    return;
  }

  const targetDir = path.resolve(__dirname, `./axis-${type}`);

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  fs.readdir(sourceDir, (err, files) => {
    if (err) {
      console.error(`Error reading source directory: ${err.message}`);
      return;
    }

    const filesToCopy = getVersionedFiles(files, version);

    if (filesToCopy.length === 0) {
      console.log(`No files found for version: ${version}`);
      return;
    }

    filesToCopy.forEach(({ fullName, baseName }) => {
      const sourceFilePath = path.join(sourceDir, fullName);
      const targetFilePath = path.join(targetDir, `${baseName}.json`);

      fs.copyFile(sourceFilePath, targetFilePath, (err) => {
        if (err) {
          console.error(`Error copying file ${fullName}: ${err.message}`);
        } else {
          console.log(`Copied ${fullName} to ${baseName}.json`);
        }
      });
    });
  });
}

// Get arguments from command line
const [type, versionArgument] = process.argv.slice(2);

if (!type) {
  console.error("Please specify 'core' or 'periphery' as the first argument.");
  process.exit(1);
}

copyFiles(type, versionArgument);
