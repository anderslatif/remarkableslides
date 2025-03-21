import { readFile } from "../util/fileHandler.js";
import { presentationHeader, presentationFooter } from "./presentationStrings.js";
import { removeIgnoredSections } from "../util/outputUtil.js";

export async function preparePresentation(mdContent, filenames, cssParameters) {
    let cssContent = await getCSSContent(cssParameters);

    const presentableTitle = filenames.map((filename) => filename.replace(".md", "")).join(" || ");

    const ignoredSectionsRemoved = removeIgnoredSections(mdContent, 'ignore-presentation');
    const mdContentWithFormattedLists = formatList(ignoredSectionsRemoved);  

    return presentationHeader
            .replace("$$CUSTOM_STYLES$$", cssContent)
            .replace("$$TAB_TITLE$$", presentableTitle ?? "Presentation")
        + mdContentWithFormattedLists
        + presentationFooter;
} 

                       // css files in directory  --css flag   --theme flag  the css file: ./presentationUtil/css/default.css
async function getCSSContent({ cssFilePaths = [], cssFilePath, cssThemePath, cssDefaultFallbackPath }) {
	const tryToReadCSS = async (filePath) => {
		try {
			return await readFile(filePath);
		} catch {
			return null;
		}
	};

	// Collect CSS content from all sources
	const cssSources = [cssFilePath, cssThemePath, ...cssFilePaths];
	const collectedCSS = (
		await Promise.all(cssSources.filter(Boolean).map(tryToReadCSS))
	).filter(Boolean);

	return collectedCSS.join('') || await tryToReadCSS(cssDefaultFallbackPath);
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




