import { readFile } from "../util/fileHandler.js";
import { presentationHeader, presentationFooter, getDefaultCSS } from "./presentationStrings.js";
import { removeIgnoredSections } from "../util/outputUtil.js";

export async function preparePresentation(mdContent, filenames, cssFilePath, cssFilePaths) {
    let cssContent = '';


    if (Array.isArray(cssFilePaths)) {
        try {
            const cssContents = await Promise.all(cssFilePaths.map(path => readFile(path)));
            cssContent = cssContents.join('');
        } catch {
            cssContent = getDefaultCSS();
        }
    }

    if (cssFilePath) {
        try {
            cssContent = await readFile(cssFilePath);
        } catch {
            cssContent = getDefaultCSS();
        }
    } else if (!cssContent) {
       cssContent = getDefaultCSS();
    }

    const presentableTitle = filenames.map((filename) => filename.replace(".md", "")).join(" || ");

    const ignoredSectionsRemoved = removeIgnoredSections(mdContent, 'ignore-presentation');
    const mdContentWithFormattedLists = formatList(ignoredSectionsRemoved);

    return presentationHeader
        .replace("$$CUSTOM_STYLES$$", cssContent)
        .replace("$$TAB_TITLE$$", presentableTitle ?? "Presentation")  
        + mdContentWithFormattedLists
        + presentationFooter;
}

function formatList(inputString) {
    const lines = inputString.split('\n');
    const output = [];
    let currentType = null;
    let currentList = [];

    lines.forEach(line => {
        const match = line.match(/^\* \((.)\) (.+)$/);
        if (match) {
            const type = match[1];
            const content = match[2];
            if (type !== currentType) {
                if (currentList.length > 0) {
                    output.push(`<ul style="list-style-type: '${currentType} '">` + currentList.join('') + '</ul>');
                    currentList = [];
                }
                currentType = type;
            }
            let className = '';

            if (type === '+') {
                className = 'pro-bullet-item';
            } else if (type === '-') {
                className = 'con-bullet-item';
            }

            currentList.push(`<li class="${className}">${content}</li>`);
        } else {
            if (currentList.length > 0) {
                output.push(`<ul style="list-style-type: '${currentType} '">` + currentList.join('') + '</ul>');
                currentList = [];
                currentType = null;
            }
            output.push(line);
        }
    });

    if (currentList.length > 0) {
        output.push(`<ul style="list-style-type: '${currentType} '">` + currentList.join('') + '</ul>');
    }

    return output.join('\n');
}




