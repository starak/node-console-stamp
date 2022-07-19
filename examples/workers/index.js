const { Worker } = require('worker_threads');
const worker = new Worker(__dirname + '/worker.js');
console.log('Log 1 from parent');

setTimeout(()=>{
    console.log('Log 2 from parent');
},50)
