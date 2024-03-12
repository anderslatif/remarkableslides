import { remark } from 'remark';
import { unified } from 'unified';
import remarkPresetLintConsistent from 'remark-preset-lint-consistent'
import remarkPresetLintRecommended from 'remark-preset-lint-recommended'
import remark2retext from 'remark-retext';
import english from 'retext-english';
import spell from 'retext-spell';
import dictionary from 'dictionary-en';
import { VFile } from 'vfile'
import reporter from 'vfile-reporter';
import pdf from "remark-pdf/node";
import colors from "colors";
import markdown from "remark-parse";
import { writeFile } from './fileHandler.js';
import remarkToc from 'remark-toc'

import { createSectionHeader, createHorizontalRule } from '../cliUtil/terminalOutputHelper.js';


export async function performMarkdownLinting(mdContent, mdFilePath) {
    
    console.log(createSectionHeader(mdFilePath.bgGrey));

    const lintingPipe = await remark()
            .use(remarkPresetLintConsistent)
            .use(remarkPresetLintRecommended)
            .process(mdContent)

    console.log(reporter(lintingPipe), "\n");
    console.log(createHorizontalRule(), '\n');
}

export async function performSpellCheck(mdContent, mdFilePath) {
    console.log(createSectionHeader(mdFilePath.bgGrey));

    const spellCheckPipe = await remark()
            .use(remark2retext, unified().use(english).use(spell, { dictionary: dictionary }))
            .process(mdContent)

    console.error(reporter(spellCheckPipe))
    console.log(createHorizontalRule(), '\n');

}

export async function addTableOfContents(mdContent, mdFilePath) {
    const firstLine = mdContent.split('\n')[0];

    // ensure there is a contents header so that the TOC can be added to it
    if (! mdContent.includes("# Contents") || ! mdContent.includes("## Contents") || 
    ! mdContent.includes("### Contents") || ! mdContent.includes("#### Contents") || 
    ! mdContent.includes("##### Contents") || ! mdContent.includes("###### Contents")) {

        mdContent = `# Contents\n\n---\n\n` + mdContent;
    }

    const file = await remark()
    .use(remarkToc)
    .process(mdContent)

    // toc replaces --- with *** so we need to replace it back
    const fileContents = file.value.split('***').join('---');

    const newSlideInserted = fileContents.split(firstLine).join(`\n\n---\n\n${firstLine}\n\n`);

    console.log(createSectionHeader('Finished adding table of contents'.bgGrey));

    return newSlideInserted;
}

export async function convertToPdf(mdContent, mdFilePath) {
    const processor = unified().use(markdown).use(pdf, { output: "buffer" });

    const pdfPipe = await processor.process(mdContent);

    const pdfBufferedContent = await pdfPipe.result;

    writeFile(mdFilePath.replace('.md', '.pdf'), pdfBufferedContent);

    const headerText = "Converted".bgBrightGreen + ` ${mdFilePath} `.bgGrey + "to PDF.".bgBrightGreen;
    console.log(createSectionHeader(headerText));
}