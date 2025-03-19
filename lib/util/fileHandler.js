import fs from 'fs/promises';
import path from 'path';

const blacklistedFolders = ["node_modules"];
const blacklistedFiles = ["readme.md", "contributing.md", "changelog.md"];

export async function findMarkdownFiles(dirPath) {
    // the key is the directory and the value is an array of markdown files
    const markdownFilesByDirectory = {};
    const cssFilesByDirectory = {};

    async function recurseDirectory(directory) {
      const entries = await fs.readdir(directory, { withFileTypes: true });

      // Initialize the list of Markdown and CSS files for this directory
      markdownFilesByDirectory[directory] = markdownFilesByDirectory[directory] || [];
      cssFilesByDirectory[directory] = cssFilesByDirectory[directory] || [];

      for (const entry of entries) {
        const fullPath = path.resolve(directory, entry.name);
        const fileName = entry.name.toLowerCase();

        if (entry.isDirectory() && !blacklistedFolders.includes(fileName)) {
          await recurseDirectory(fullPath);
        } else {
          if (!blacklistedFiles.includes(fileName)) {
            const extension = path.extname(fileName);
            if (extension === ".md") {
              markdownFilesByDirectory[directory].push(fullPath);
            } else if (extension === ".css") {
              cssFilesByDirectory[directory].push(fullPath);
            }
          } else {
            console.log("Ignoring file:".grey, fullPath.red);
          }
        }
      }

    }
  
    await recurseDirectory(dirPath);

    // remove empty directories
    const markdownFiles = Object.fromEntries(
      Object.entries(markdownFilesByDirectory).filter(([directory, files]) => files.length > 0)
    );
    const cssFiles = Object.fromEntries(
      Object.entries(cssFilesByDirectory).filter(([directory, files]) => files.length > 0)
    );
    
    return {
      markdownFiles,
      cssFiles
    };
}


export async function getMarkdownContents(filePaths) {
  const readingFilePromises = await filePaths.map(async (filePath) => {
    return (await fs.readFile(filePath)).toString();
  });

  const fileContents = (await Promise.all(readingFilePromises));

  return fileContents;
}

export async function readFile(filePath) {
  return (await fs.readFile(filePath)).toString();
}

export function writeFile(filePath, content) {
  fs.writeFile(filePath, content, 'utf8');
}