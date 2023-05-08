import * as path from 'path';
import { readdir } from 'fs/promises';

export const getFilePathByName = async (name: string, folderPath) => {
  const files = await readdir(folderPath);

  for (const file of files) {
    const filename = path.parse(file).name;

    if (filename === name) return file;
  }

  return null;
};
