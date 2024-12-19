#!/usr/bin/env node

import "colors";
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { Command } from 'commander';
const program = new Command();

const packageJson = await fs.readFile(path.join(__dirname, '..', 'package.json'), 'utf8');
const versionNumber = JSON.parse(packageJson).version;

program
  .name('remarkableslides')
  .description('Build Markdown files into slides using remark.js.')  
  .version(versionNumber);

// Modes
program
.option('--check-mode', 'Default: False. Skips presentation creation. Ideal for spell checking or linting only.')
.option('--listen-mode', 'Default: True. Enables file monitoring without starting a server. Automatically deactivated with --check-mode.')
.option('--live-mode', 'Default: True. Enables server deployment for presentations. Automatically deactivated with --check-mode.');


// Server Options
program                                                                          // default port is 1234
.option('--live-port <port_number>', 'Specify the desired port for the server.', validatePortNumber, 1234);

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

// CSS Options
program
.option('--theme <type>', 'Specify a pre-made theme for the presentation.')
.option('--css <path>', 'Specify a CSS file to use for the presentation.');

// Other Options
program
.option('--lint', 'Lints the markdown files.')
.option('--spell-check', 'Enables spell checking on the markdown files. Only supports English.')
.option('--add-table-of-contents', `A table of contents will be inserted as the first slide.`)
.option('--correct-markdown-list-numbering', `Makes sure that numbers are in chronological order. Also works for nested lists.`)
.option('--output-md', `Output to a single md file titled 'presentation.md'.`)
.option('--convert-to-pdf', `Output a pdf (will not have any formatting).`);



program.parseAsync().then(async (result) => {
    const cliOptions = result.opts();

    let command = !(cliOptions.checkMode || cliOptions.listenMode) ? 'nodemon' : 'node';

    let nodemonFlags = [];
    if (command === 'nodemon') {
        let nodemonPath = path.join(__dirname, "..", 'node_modules', 'nodemon', 'bin', 'nodemon.js');
        command = nodemonPath;
        nodemonFlags = ["--quiet", "--watch", "./", "--ext", "md, css"];
    }

    const scriptPath = path.join(__dirname, 'main.js');;

    let child;

    if (process.platform === "win32" && command.includes('nodemon')) {
        child = spawn(process.execPath, [command, scriptPath, ...nodemonFlags], {
            env: {
                ...process.env,
                CLI_OPTIONS: JSON.stringify(cliOptions),
            },
            stdio: 'inherit',
        });
    } else {
        child = spawn(command, [scriptPath, ...nodemonFlags], {
            env: {
                ...process.env,
                CLI_OPTIONS: JSON.stringify(cliOptions),
            },
            stdio: 'inherit',
        });
    }


    child.on('message', (message) => {
        if (message && message.exit) {
            console.log('Exiting all processes...');
            process.exit(0); // Exit the parent process
        }
    });

    child.on('error', (error) => {
        console.error('Failed to start child process.', error);
    });

    child.on('exit', (code) => {
        console.log(`Child process exited with code ${code}`);
        console.log("...***Remarkable***...".rainbow);
    });
});
