import consoleStamp from '../../dist/index.js';

const logger = new console.Console(process.stdout, process.stderr);

consoleStamp(logger);

logger.debug('This is a console.debug message');
logger.log('This is a console.log message');
logger.info('This is a console.info message');
logger.warn('This is a console.warn message');
logger.error('This is a console.error message');
