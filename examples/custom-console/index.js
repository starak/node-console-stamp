const console_stamp = require( '../../index' );
const fs = require('fs');
const output = fs.createWriteStream(`${__dirname}/stdout.log`);
const errorOutput = fs.createWriteStream(`${__dirname}/stderr.log`);
const logger = new console.Console(output, errorOutput);

console_stamp(logger, {
    stdout: output,
    stderr: errorOutput
});

logger.debug('This is a console.debug message');
logger.log('This is a console.log message');
logger.info('This is a console.info message');
logger.warn('This is a console.warn message');
logger.error('This is a console.error message');