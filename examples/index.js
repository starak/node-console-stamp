import { lstatSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const isDirectory = (source) => lstatSync(source).isDirectory();
const getDirectories = (source) =>
    readdirSync(source)
        .map((name) => join(source, name))
        .filter(isDirectory);

for (const d of getDirectories(__dirname)) {
    process.stdout.write(`\nLoading ${d.replace(__dirname, '.')}\n`);
    await import(d + '/index.js');
}
