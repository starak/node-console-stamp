const consoleStamp = require( '../' );
const chalk = require( 'chalk' );
const { test } = require( 'tap' );
const { PassThrough, Writable } = require('stream');

class SpyStream extends PassThrough{
    constructor() {
        super();
        this._stream = [];
        this.on('data', d => this._stream.push(d.toString()));
    }

    get length(){
        return this._stream.length;
    }

    get last(){
        return this._stream[this._stream.length - 1];
    }

    flush(){
        this._stream = [];
    }

    get asArray(){
        return this._stream;
    }
}

const message = "foo";

function logAll( logger ) {

    logger.log( message );
    logger.info( message );
    logger.debug( message );
    logger.warn( message );
    logger.error( message );
}

test( 'general test', t => {

    const stdout = new SpyStream();
    const stderr = new SpyStream();

    // noinspection JSCheckFunctionSignatures
    consoleStamp( console, {
        format: ':label(8)',
        stdout: stdout,
        stderr: stderr,
        level: 'debug'
    } );

    logAll( console );

    t.equal( stdout.length, 3 );
    t.equal( stdout.asArray[0], '[LOG]    ' + message + '\n', 'Should have correct label [LOG]' );
    t.equal( stdout.asArray[1], '[INFO]   ' + message + '\n', 'Should have correct label' );
    t.equal( stdout.asArray[2], '[DEBUG]  ' + message + '\n', 'Should have correct label' );
    t.equal( stderr.length, 2 );
    t.equal( stderr.asArray[0], '[WARN]   ' + message + '\n', 'Should have correct label' );
    t.equal( stderr.asArray[1], '[ERROR]  ' + message + '\n', 'Should have correct label' );

    console.reset();
    stdout.flush();
    stderr.flush();

    const pid = process.pid;


    // noinspection JSCheckFunctionSignatures
    consoleStamp( console, {
        format: `:pid :foo(bar)`,
        stdout,
        stderr,
        level: 'debug',
        tokens: {
            foo: ( { params: [bar] } ) => bar,
            pid: () => pid
        }
    } );

    logAll( console );

    t.equal( stdout.length, 3 );
    let expected = `${pid} bar ${message}\n`;
    t.equal( stdout.asArray[0], expected, 'Should have correct prefix' );
    t.equal( stdout.asArray[1], expected, 'Should have correct prefix' );
    t.equal( stdout.asArray[2], expected, 'Should have correct prefix' );
    t.equal( stderr.asArray.length, 2 );
    t.equal( stderr.asArray[0], expected, 'Should have correct prefix' );
    t.equal( stderr.asArray[1], expected, 'Should have correct prefix' );

    console.reset();
    stdout.flush();
    stderr.flush();

    // noinspection JSCheckFunctionSignatures
    consoleStamp( console, {
        format: `:foo(bar).blue.bgRed`,
        stdout,
        stderr,
        tokens: {
            foo: ( { params: [bar] } ) => bar
        }
    } );

    logAll( console );
    expected = chalk`{bgRed.blue bar} ${message}\n`;
    t.equal( stdout.asArray[0], expected );

    console.reset();
    stdout.flush();
    stderr.flush();

    // noinspection JSCheckFunctionSignatures
    consoleStamp( console, {
        format: `(bar).blue.bgRed`,
        stdout,
        stderr,
    } );

    logAll( console );
    expected = chalk`{bgRed.blue bar} ${message}\n`;
    t.equal( stdout.asArray[0], expected, "styling tags should be removed from Color Group" );
    t.end();
} );
