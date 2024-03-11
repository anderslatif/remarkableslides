import fs from 'fs/promises';
import path from 'path';

import { preparePresentation } from "./presentationUtil/preparePresentation.js";


const argv = process.argv.slice(2);
const LIVE_SERVER_MODE = argv.includes('--live');

import { findMarkdownFiles } from './util/fileHandler.js';

import { createServer } from './util/createServer.js';


const startPath = './'; 
const filePaths = await findMarkdownFiles(startPath);
const directoriesPath = Object.keys(filePaths);

const presentationConfig = directoriesPath.map(async (directoryPath) => {

    const filenames = filePaths[directoryPath];

    const readingFilePromises = await filenames.map(async (filename) => {
        return (await fs.readFile(filename)).toString();
    });

    const combinedMdContent = (await Promise.all(readingFilePromises)).join("\n\n");


    // const filenames = filePathsInDirectory.map((mdFilePath) => {
    //     return mdFilePath.split(path.sep).pop();
    // });

    // path.sep provides the OS-specific file separator, e.g. / or \ 
    // const mdFileDirectoryLocation = mdFilePath.split(path.sep);
    // const filename = mdFileDirectoryLocation.pop();

    const presentationHTMLString = preparePresentation(combinedMdContent, filenames);
    
    const presentationAbsolutePath = path.resolve(directoryPath, 'presentation.html');

    fs.writeFile(presentationAbsolutePath, presentationHTMLString, 'utf8');

    const combinedTitle = filenames.map((filename) => filename.replace(".md", "")).join("_");


    return {
        combinedTitle,
        directoryPath,
        filenames,
        presentationAbsolutePath
    };

});

const presentations = await Promise.all(presentationConfig);


// todo check if live server mode is enabled
createServer(presentations, 1234);
// if (LIVE_SERVER_MODE) {


// }
