import { Worker } from 'worker_threads';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const worker = new Worker(__dirname + '/worker.js');
console.log('Log 1 from parent');

setTimeout(() => {
    console.log('Log 2 from parent');
}, 50);
