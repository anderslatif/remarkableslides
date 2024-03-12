import fs from 'fs/promises';
import path from 'path';

import { preparePresentation } from "./presentationUtil/preparePresentation.js";
import { findMarkdownFiles, getMarkdownContents, writeFile } from './util/fileHandler.js';
import { createServer } from './util/createServer.js';
import { performMarkdownLinting, performSpellCheck, addTableOfContents, convertToPdf } from './util/markdownPipelines.js';
import { createSectionHeader } from './cliUtil/terminalOutputHelper.js';

// const argv = process.argv.slice(2);
// const LIVE_SERVER_MODE = argv.includes('--live');



const startPath = './'; 


export async function main(cliOptions) {
    
    const { markdownFiles, cssFiles } = await findMarkdownFiles(startPath);
    const directoriesPaths = Object.keys(markdownFiles);


    const presentationConfig = directoriesPaths.map(async (directoryPath) => {

        const filePathsInDirectory = markdownFiles[directoryPath];
            
        let mdContents = await getMarkdownContents(filePathsInDirectory);

        if (cliOptions.lint) {
            console.log(createSectionHeader('Markdown linting results'.bgBrightGreen));
            await Promise.all(mdContents.map(async (mdContent, index) => {
                await performMarkdownLinting(mdContent, filePathsInDirectory[index]);
            }));
        }

        if (cliOptions.spellCheck) {
            console.log(createSectionHeader('Spell check results'.bgBrightGreen));
            await Promise.all(mdContents.map(async (mdContent, index) => {
                await performSpellCheck(mdContent, filePathsInDirectory[index]);
            }));
        }

        let mdContent = mdContents.join("\n\n---\n\n");

        if (cliOptions.addTableOfContents) {
            mdContent = await addTableOfContents(mdContent, filePathsInDirectory[0]);
        }

        console.log(mdContent)


        if (cliOptions.convertToPdf) {
            convertToPdf(mdContent, filePathsInDirectory[0]);
        }

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


    if (!cliOptions.noLive) {
        const presentations = await Promise.all(presentationConfig);
        createServer(presentations, cliOptions.livePort);
    }
    
}






