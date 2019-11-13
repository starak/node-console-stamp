const consoleStamp = require( '../' );
const fs = require( 'fs' );
const stream = fs.createWriteStream( '/dev/null' );
const { test } = require( 'tap' );

class SpyStream {
    constructor() {
        this._stream = [];
    }

    // noinspection JSUnusedGlobalSymbols
    write( data ) {
        this._stream.push( data );
    }

    flush() {
        this._stream = [];
    }
}

function logAll(logger){
    logger.log( "foo" );
    logger.info( "foo" );
    logger.debug( "foo" );
    logger.warn( "foo" );
    logger.error( "foo" );
}

test( 'general test', t => {

    const stdout = new SpyStream();
    const stderr = new SpyStream();
    // noinspection JSValidateTypes
    const logger = new console.Console( stream );

    consoleStamp( logger, {
        format: ':label(8)',
        stdout,
        stderr,
        level: 'debug',
    } );

    logAll(logger);

    t.equal( stdout._stream.length, 3 );
    t.equal( stdout._stream[0], '[LOG]    ', 'Should have correct label' );
    t.equal( stdout._stream[1], '[INFO]   ', 'Should have correct label' );
    t.equal( stdout._stream[2], '[DEBUG]  ', 'Should have correct label' );
    t.equal( stderr._stream.length, 2 );
    t.equal( stderr._stream[0], '[WARN]   ', 'Should have correct label' );
    t.equal( stderr._stream[1], '[ERROR]  ', 'Should have correct label' );

    // noinspection JSUnresolvedFunction
    logger.reset();
    stdout.flush();
    stderr.flush();

    const pid = process.pid;

    consoleStamp( logger, {
        format: `:pid :foo(bar)`,
        stdout,
        stderr,
        level: 'debug',
        tokens:{
            foo: ({params:[bar]}) => bar,
            pid: () => pid
        }
    } );

    logAll(logger);

    t.equal( stdout._stream.length, 3 );
    let expected = `${pid} bar `;
    t.equal( stdout._stream[0], expected, 'Should have correct prefix' );
    t.equal( stdout._stream[1], expected, 'Should have correct prefix' );
    t.equal( stdout._stream[2], expected, 'Should have correct prefix' );
    t.equal( stderr._stream.length, 2 );
    t.equal( stderr._stream[0], expected, 'Should have correct prefix' );
    t.equal( stderr._stream[1], expected, 'Should have correct prefix' );

    // noinspection JSUnresolvedFunction
    logger.reset();
    stdout.flush();
    stderr.flush();

    consoleStamp( logger, {
        format: `:foo(bar).blue.bgRed`,
        stdout,
        stderr,
        tokens:{
            foo: ({params:[bar]}) => bar
        }
    } );

    logAll(logger);
    // colors not working in test mode :(
    expected = `bar `;
    t.equal( stdout._stream[0], expected );

    // noinspection JSUnresolvedFunction
    logger.reset();
    stdout.flush();
    stderr.flush();

    consoleStamp( logger, {
        format: `(bar).blue.bgRed`,
        stdout,
        stderr,
    } );

    logAll(logger);

    expected = 'bar ';
    t.equal( stdout._stream[0], expected, "styling tags should be removed from Color Group" );

    t.end();
} );
