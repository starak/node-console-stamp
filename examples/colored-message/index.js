const console_stamp = require( '../../index' );

const chalk = require( "chalk" );

const map = {
    log: 'cyanBright',
    error: 'red',
    info: 'blue',
    warn: 'yellow'
};

console_stamp( console, {
    format: '(->).yellow :date().gray :label :msg',
    tokens: {
        label: ( obj ) => {
            return chalk`{${map[obj.method] || 'reset'} ${obj.defaultTokens.label( obj )}}`;
        },
        msg: ( { method, msg } ) => {
            return chalk`{${map[method] || 'reset'} ${msg}}`;
        }
    }
} );

console.debug( 'This is a console.debug message' );
console.log( 'This is a console.log message Test (1).csv' );
console.info( 'This is a console.info message' );
console.warn( 'This is a console.warn message' );
console.error( 'This is a console.error message' );
console.reset();
