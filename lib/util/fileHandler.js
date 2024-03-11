import fs from 'fs/promises';
import path from 'path';

const blacklistedFolders = ["node_modules"];
const blacklistedFiles = ["README.md"];

export async function findMarkdownFiles(dirPath) {
    // the key is the directory and the value is an array of markdown files
    const markdownFilesByDirectory = {};

    async function recurseDirectory(directory) {
      const entries = await fs.readdir(directory, { withFileTypes: true });

      // Initialize the list of Markdown files for this directory
      markdownFilesByDirectory[directory] = markdownFilesByDirectory[directory] || [];

      for (const entry of entries) {
        const fullPath = path.join(directory, entry.name);  
        if (entry.isDirectory() && !blacklistedFolders.includes(entry.name)) {
          await recurseDirectory(fullPath)
        } else if (path.extname(entry.name) === '.md' && !blacklistedFiles.includes(entry.name)) {
          markdownFilesByDirectory[directory].push(fullPath);
        }
      }

    }
  
    await recurseDirectory(dirPath);

    const removedEmptyDirectoriees = Object.fromEntries(
      Object.entries(markdownFilesByDirectory).filter(([directory, files]) => files.length > 0)
    );
    
    return removedEmptyDirectoriees;
}