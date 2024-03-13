#!/usr/bin/env node

import color from "colors";

import fs from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';

import { Command } from 'commander';
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
.option('--add-table-of-contents', `A table of contents will be inserted as the first slide.`)
.option('--correct-markdown-list-numbering', `Makes sure that numbers are in chronological order. Also works for nested lists.`);


program.parseAsync().then((result) => {
    const cliOptions = result.opts();
 
    const command = cliOptions.checkOnly || cliOptions.noListen ? 'node' : 'nodemon';

    const scriptPath = path.resolve('lib', 'main.js');

    const child = spawn(command, [scriptPath], {
        env: {
          ...process.env,
          CLI_OPTIONS: JSON.stringify(cliOptions),
        },
        stdio: 'inherit',
      });

    child.on('message', (message) => {
        if (message && message.exit) {
            console.log('Exiting all processes...');
            process.exit(0); // Exit the parent process
        }
    });

    child.on('exit', (code) => {
        console.log("...***Remarkable***...".rainbow);
    });
});
