import fs from "fs";
import path from "path";

export const getAllfiles = async (dir: string): Promise<string[]> => {
  let files: string[] = [];
  const items = await fs.promises.readdir(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    console.log("file path:",fullPath);
    if (item.isDirectory()) {
      const subFiles = await getAllfiles(fullPath);
      files = files.concat(subFiles);
    } else {
      files.push(fullPath);
    }
  }

  return files;
};
