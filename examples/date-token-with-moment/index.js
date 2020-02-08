const console_stamp = require( '../../index' );
const moment = require('moment');
moment.locale('ja'); // Japanese

console_stamp( console, {
    format: ':mydate() :label(7)',
    tokens:{
        mydate: () => {
            return `[${moment().format('LLLL')}]`;
        }
    }
} );

console.debug('This is a console.debug message');
console.log('This is a console.log message');
console.info('This is a console.info message');
console.warn('This is a console.warn message');
console.error('This is a console.error message');