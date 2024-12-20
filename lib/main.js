import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import { preparePresentation } from "./presentationUtil/preparePresentation.js";
import { findMarkdownFiles, getMarkdownContents, writeFile } from './util/fileHandler.js';
import { createServer } from './util/createServer.js';
import { removeIgnoredSections } from './util/outputUtil.js';
import { performMarkdownLinting, performSpellCheck, addTableOfContents, convertToPdf, correctMarkdownListNumbering } from './util/markdownPipelines.js';
import { createSectionHeader } from './cliUtil/terminalOutputHelper.js';

const startPath = './'; 

const cliOptions = JSON.parse(process.env.CLI_OPTIONS);
   
const { markdownFiles, cssFiles } = await findMarkdownFiles(startPath);
const directoriesPaths = Object.keys(markdownFiles);

const noMarkdownFilesFound = directoriesPaths.length === 0;


if (noMarkdownFilesFound) {
    const message = [
        "No markdown files found in the directory or any of its subdirectories.".bold.underline.red,
        "Please create a markdown file and retry.".green,
        "Useful tip: In the markdown files, use '---' to separate slides.".cyan,
        "Exit the application by pressing `CTRL + C`".yellow + ` or CTRL + D`.grey
      ].join('\n');
      
    console.log(message);
    process.exit(0);
}

const presentationConfig = directoriesPaths.map(async (directoryPath) => {

    const filePathsInDirectory = markdownFiles[directoryPath];
        
    let mdContents = await getMarkdownContents(filePathsInDirectory);

    if (cliOptions.correctMarkdownListNumbering) {
        console.log(createSectionHeader('Correcting markdown list numbering'.bgBrightGreen));
        mdContents = await Promise.all(mdContents.map(async (mdContent, index) => {
            const filePath = filePathsInDirectory[index];
            const correctedContent = await correctMarkdownListNumbering(mdContent, filePath);
            return correctedContent;
        }));
    }

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

    if (cliOptions.outputMd) {
        const ignoreSectionsRemoved = removeIgnoredSections(mdContent, 'ignore-output-md');
        fs.writeFile('presentation.md', ignoreSectionsRemoved);
    }

    if (cliOptions.addTableOfContents) {
        mdContent = await addTableOfContents(mdContent, filePathsInDirectory[0]);
    }

    if (cliOptions.convertToPdf) {
        convertToPdf(mdContent, filePathsInDirectory[0]);
    }

    const filenames = filePathsInDirectory.map((mdFilePath) => {
        return mdFilePath.split(path.sep).pop();
    });


    const cssFilePathsInDirectory = cssFiles[directoryPath];
    const currentLibraryPath = path.dirname(fileURLToPath(import.meta.url));
    const cssThemeName = cliOptions.theme 
                            ? `${currentLibraryPath}/presentationUtil/css/${cliOptions.theme}.css`
                            : undefined;
    const cssDefaultFallbackPath = path.join(currentLibraryPath, 'presentationUtil', 'css', 'default.css');

    const cssParameters = {
        cssFilePaths: cssFilePathsInDirectory,
        cssFilePath: cliOptions.css,
        cssThemePath: cssThemeName,
        cssDefaultFallbackPath,
    }
    
    
    const presentationHTMLString = await preparePresentation(mdContent, filenames, cssParameters);

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

// avoid a loop of constantly rebuilding the server after outputting an md file if outputMd is defined
if (!(noMarkdownFilesFound || cliOptions.checkMode || cliOptions.noLive || cliOptions.outputMd)) {
    const presentations = await Promise.all(presentationConfig);
    createServer(presentations, cliOptions.livePort);
}





