import { createWriteStream } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import consoleStamp from '../../dist/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Create a file stream for logging
const logFile = createWriteStream(join(__dirname, 'output.log'), { flags: 'w' });

// With dual: true, output goes to BOTH the file AND the terminal
consoleStamp(console, {
    format: ':date(yyyy-mm-dd HH:MM:ss) :label',
    stdout: logFile,
    stderr: logFile,
    dual: true,
});

console.log('This message goes to both the log file AND the terminal');
console.info('Info messages are also written to both outputs');
console.warn('Warnings appear in both places');
console.error('Errors too!');

console.reset();
logFile.end();

console.log(`\nCheck ${join(__dirname, 'output.log')} to see the file output`);
