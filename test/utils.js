const df = require( '../lib/defaults.js' );
const fs = require( 'fs' );
const { test } = require( 'tap' );
const {
    selectOutputStream,
    parseParams,
    checkLogLevel,
    generateConfig,
    generatePrefix,
    FakeStream
} = require( '../lib/utils.js' );

test( 'utils', t => {
    t.test( 'generateConfig default', t => {
        t.ok( generateConfig, 'Should exist' );
        const config = generateConfig( {} );
        t.equal( config.format, df.dfFormat.replace( '$$', df.dfDateFormat ), 'default format' );
        t.equal( df.level, 'log', 'default Log Level' );
        t.strictSame( df.include, config.include, 'default include' );
        t.strictSame( df.tokens, config.tokens, 'default tokens' );
        t.strictSame( config.stdout, process.stdout, 'Shoud use process.stdout' );
        t.strictSame( config.stderr, process.stderr, 'Shoud use process.stderr' );
        t.end()
    } );

    t.test( 'generateConfig override', t => {
        let stdout = fs.createWriteStream( '/dev/null' );
        let stderr = fs.createWriteStream( '/dev/null' );
        const config = generateConfig( {
            level: 'log',
            format: ':foo(bar)',
            include: ['log'],
            stdout: stdout,
            stderr: stderr,
        } );
        t.equal( config.format, ':foo(bar)', 'override format' );
        t.equal( config.level, 'log', 'override Log Level' );
        t.equal( config.include.length, 1, 'override include' );
        t.strictSame( config.stdout, stdout, 'Shoud use custom stdout' );
        t.strictSame( config.stderr, stderr, 'Shoud use custom stderr' );
        t.end()
    } );

    t.test( 'generateConfig extend', t => {
        const config = generateConfig( {
            format: ':foo(bar)',
            tokens: {
                foo: ( { params: [bar] } ) => bar
            },
            extend: {
                foo: 1
            }
        } );
        t.equal( config.include.length, df.include.length + 1, 'extends include' );
        t.equal( typeof config.tokens.foo, 'function', 'adds tokens' );
        t.end()
    } );

    t.test( 'generateConfig with string input', t => {
        const str = 'HH:MM.ss.l';
        const config = generateConfig( str );
        t.equal( config.format, df.dfFormat.replace( '$$', str ), 'default pattern' );
        t.end()
    } );

    t.test( 'generatePrefix plain', t => {
        const config = generateConfig( {
            format: ':foo(bar)',
            tokens: {
                foo: ( { params: [bar] } ) => bar
            },
            extend: {
                foo: 1
            }
        }, console );
        t.ok( generatePrefix, 'Should exist' );
        const prefix = generatePrefix( 'log', config );
        t.equal( prefix, 'bar', 'Shoud be correct' );
        t.end()
    } );

    t.test( 'selectOutputStream default', t => {
        const config = generateConfig( {}, console );
        t.ok( selectOutputStream, 'Should exist' );
        t.strictSame( selectOutputStream( 'log', config ), process.stdout, 'Log stream should be stdout' );
        t.strictSame( selectOutputStream( 'info', config ), process.stdout, 'Info stream should be stdout' );
        t.strictSame( selectOutputStream( 'warn', config ), process.stderr, 'Warn stream should be stderr' );
        t.strictSame( selectOutputStream( 'error', config ), process.stderr, 'Error stream should be stderr' );
        t.end()
    } );

    t.test( 'selectOutputStream override', t => {
        let stdout = fs.createWriteStream( '/dev/null' );
        let stderr = fs.createWriteStream( '/dev/null' );
        const config = generateConfig( {
            stdout: stdout,
            stderr: stderr,
        }, console );
        t.ok( selectOutputStream, 'Should exist' );
        t.strictSame( selectOutputStream( 'debug', config ), stdout, 'Debug stream should be stdout' );
        t.strictSame( selectOutputStream( 'log', config ), stdout, 'Log stream should be stdout' );
        t.strictSame( selectOutputStream( 'info', config ), stdout, 'Info stream should be stdout' );
        t.strictSame( selectOutputStream( 'warn', config ), stderr, 'Warn stream should be stderr' );
        t.strictSame( selectOutputStream( 'error', config ), stderr, 'Error stream should be stderr' );
        t.end()
    } );

    // checkLogLevel
    t.test( 'checkLogLevel default', t => {
        const config = generateConfig( {}, console );
        t.ok( checkLogLevel, 'Should exist' );
        t.equal( config.level, 'log', 'Log Log level is set' );
        t.ok( checkLogLevel( config, 'log' ), 'Log should be accepted' );
        t.ok( checkLogLevel( config, 'info' ), 'Info should be accepted' );
        t.ok( checkLogLevel( config, 'debug' ), 'Debug should be accepted' );
        t.end()
    } );

    // checkLogLevel
    t.test( 'checkLogLevel override info', t => {
        const config = generateConfig( { level: 'info' }, console );
        t.ok( checkLogLevel, 'Should exist' );
        t.equal( config.level, 'info', 'Info Log level is set' );
        t.notOk( checkLogLevel( config, 'log' ), 'Log should not be accepted' );
        t.notOk( checkLogLevel( config, 'debug' ), 'Debug should not be accepted' );
        t.ok( checkLogLevel( config, 'info' ), 'Info should be accepted' );
        t.ok( checkLogLevel( config, 'error' ), 'Error should be accepted' );
        t.end()
    } );

    // checkLogLevel
    t.test( 'checkLogLevel override error', t => {
        const config = generateConfig( { level: 'error' }, console );
        t.ok( checkLogLevel, 'Should exist' );
        t.equal( config.level, 'error', 'Error level is set' );
        t.notOk( checkLogLevel( config, 'log' ), 'Log should not be accepted' );
        t.notOk( checkLogLevel( config, 'info' ), 'Info should not be accepted' );
        t.notOk( checkLogLevel( config, 'warn' ), 'Warn should not be accepted' );
        t.ok( checkLogLevel( config, 'error' ), 'Error should be accepted' );
        t.end()
    } );

    t.test( 'parseParams', t => {
        t.ok( parseParams, 'Should exist' );
        const [a, b, c, d] = parseParams( '( 1,2,3,foo )' );
        t.equal( a, 1, 'Should have correct 1st param' );
        t.equal( b, 2, 'Should have correct 2nd param' );
        t.equal( c, 3, 'Should have correct 3rd param' );
        t.equal( d, 'foo', 'Should have correct 4th param' );
        t.end()
    } );

    t.test( 'FakeStream', t => {
        const fakeStream = new FakeStream();
        const msg = 'Msg from console';
        t.ok( fakeStream, 'Should exist' );
        fakeStream.write( msg );
        t.equal( fakeStream.last_msg, msg, 'Should have recieved the message' );
        fakeStream.end();
        t.end();
    } );

    t.end();
} );