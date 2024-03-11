import { remark } from 'remark';
import { unified } from 'unified';
import remarkPresetLintConsistent from 'remark-preset-lint-consistent'
import remarkPresetLintRecommended from 'remark-preset-lint-recommended'
import remark2retext from 'remark-retext';
import english from 'retext-english';
import spell from 'retext-spell';
import dictionary from 'dictionary-en';

import { VFile } from 'vfile'
import  {reporterPretty } from 'vfile-reporter-pretty'

import { createSectionHeader, createHorizontalRule } from './cliUtil/terminalOutputHelper.js';

export async function performMarkdownLinting(mdContent) {
    console.log(createSectionHeader(mdFilePath));

    console.log(createSectionHeader('Markdown Linter results'));

    const lintingPipe = await remark()
            .use(remarkPresetLintConsistent)
            .use(remarkPresetLintRecommended)
            .process(mdContent)

    console.error(reporter(lintingPipe))

}

export async function performSpellCheck(mdContent) {
    console.log(createSectionHeader('Spell check results'));

    const spellCheckPipe = await remark()
            .use(remark2retext, unified().use(english).use(spell, { dictionary: dictionary }))
            .process(mdContent)

    console.error(reporter(spellCheckPipe))

    console.log(createHorizontalRule(), '\n');

}