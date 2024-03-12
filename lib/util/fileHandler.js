import fs from 'fs/promises';
import path from 'path';

const blacklistedFolders = ["node_modules"];
const blacklistedFiles = ["README.md"];

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
        if (entry.isDirectory() && !blacklistedFolders.includes(entry.name)) {
          await recurseDirectory(fullPath)
        } else if ((!blacklistedFiles.includes(entry.name) && path.extname(entry.name) === '.md')) {
          markdownFilesByDirectory[directory].push(fullPath);
        } else if ((!blacklistedFiles.includes(entry.name) && entry.name.toLowerCase() === 'presentation.css')) {
          cssFilesByDirectory[directory].push(fullPath);
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


// takes into account
export async function getMarkdownContent(filePaths) {
  const readingFilePromises = await filePaths.map(async (filePath) => {
    return (await fs.readFile(filePath)).toString();
  });

  const combinedMdContent = (await Promise.all(readingFilePromises)).join("\n\n -- \n\n");

  return combinedMdContent;
}

export async function readFile(path) {
  return (fs.readFile(path)).toString();
}

export function writeFile(path, content) {
  fs.writeFile(path, content, 'utf8');
}