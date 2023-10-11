import { appendFile, mkdir, existsSync } from "fs";
import fsPromises from "fs/promises";

// Path
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const logEvent = (message, folder, fileName) => {
  if (!existsSync(path.join(__dirname, folder))) {
    mkdir(path.join(__dirname, folder), (err) => {
      if (err) throw err;
      console.log(`Log ${folder} Created...`);
    });
  }

  const log = `${Date.now()}: ${new Date()} ${message} \n`;
  appendFile(path.join(__dirname, folder, fileName), log, (err) => {
    if (err) throw err;
    console.log("File Appended to " + folder + "/" + fileName);
  });
};
