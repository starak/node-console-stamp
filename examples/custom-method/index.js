const console_stamp = require( '../../index' );
// Extending the console with a custom method
console.fatal = function( msg ) {
    console.org.error( msg );
    //process.exit( 1 );
}

// Initialising the output formatter
console_stamp( console, {
    extend: {
        fatal: 1
    }
} );

console.debug('This is a console.debug message');
console.log('This is a console.log message');
console.info('This is a console.info message');
console.warn('This is a console.warn message');
console.error('This is a console.error message');
console.fatal('This is a custom console.fatal message');