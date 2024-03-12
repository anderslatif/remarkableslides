#!/usr/bin/env node

// todo recomment
import { main } from "./main.js";

import fs from 'fs/promises';

import { Command } from 'commander';
import { parse } from "path";
const program = new Command();

const packageJson = await fs.readFile('./package.json', 'utf8');
const versionNumber = JSON.parse(packageJson).version;

program
  .name('remarkableslides')
  .description('Build Markdown files into slides using remark.js.')
  .version(versionNumber);

// Modes
program
.option('--check-only', `Skips presentation creation. Ideal for spell checking or linting only.`)
.option('--no-listen', 'Disables file monitoring. Automatically activated with --check-only.')
.option('--no-live', 'Prevents server deployment for presentations. Automatically enabled with --check-only.')

// Server Options
program                                                                     // default port is 1234
.option('--live-port <port_number>', 'Specifies the port for the server.', validatePortNumber, 1234);

function validatePortNumber(value) {
    const parsedValue = parseInt(value);

    if (isNaN(parsedValue)) {
        throw new InvalidArgumentError('Port number must be a number.');
    } else if (parsedValue < 1) {
        throw new InvalidArgumentError('Port number must be at least 1.');
    } else if (parsedValue > 65535) {
        throw new InvalidArgumentError('Port number cannot exceed 65535.');
    }
    
    return parsedValue; 
}


// Other Options
program
.option('--lint', 'Lints the markdown files.')
.option('--spell-check', 'Enables spell checking on the markdown files. Only supports English. ')
.option('--add-table-of-contents', `A table of contents will be inserted as the first slide.`);


program.parseAsync().then((result) => {
    const cliOptions = result.opts();
    main(cliOptions);
});
