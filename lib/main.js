import fs from 'fs/promises';
import path from 'path';

import { preparePresentation } from "./presentationUtil/preparePresentation.js";
import { findMarkdownFiles, getMarkdownContent, writeFile } from './util/fileHandler.js';
import { createServer } from './util/createServer.js';


// const argv = process.argv.slice(2);
// const LIVE_SERVER_MODE = argv.includes('--live');



const startPath = './'; 


export async function main(cliOptions) {
    
    const { markdownFiles, cssFiles } = await findMarkdownFiles(startPath);
    const directoriesPaths = Object.keys(markdownFiles);


    const presentationConfig = directoriesPaths.map(async (directoryPath) => {

        const filePathsInDirectory = markdownFiles[directoryPath];
            
        const mdContent = await getMarkdownContent(filePathsInDirectory);

        const filenames = filePathsInDirectory.map((mdFilePath) => {
            return mdFilePath.split(path.sep).pop();
        });
    
        const cssFilePathInDirectory = cssFiles[directoryPath];
        const presentationHTMLString = preparePresentation(mdContent, filenames, cssFilePathInDirectory);

        const absolutePresentationPath = path.resolve(directoryPath, "presentation.html");

        if (!cliOptions.checkOnly) {
            writeFile(absolutePresentationPath, presentationHTMLString);
        }
  
    
        return {
            directoryPath,
            absolutePresentationPath,
            filenames,
        };
    });


    if (cliOptions.live) {
        const presentations = await Promise.all(presentationConfig);
        createServer(presentations, cliOptions.livePort);
    }
    
}






