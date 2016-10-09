/*jshint node:true*/
"use strict";
var moment = require( 'moment' );
moment.locale( 'ja' );
var fs = require( 'fs' );

var human_readable = require( "filesize" );
var write = function ( txt ) {
    process.stdout.write( txt + "\n" );
};
var console_stamp = require( "./main" );

function run( logger ) {
    logger = logger || console;
    logger.log( "This is a console.log message" );
    logger.info( "This is a console.info message" );
    logger.warn( "This is a console.warn message" );
    logger.error( "This is a console.error message" );
    logger.dir( {bar: "This is a console.dir message"} );
    write( "  " );
}

write( "No patching" );
run();

write( "Patched with defaults" );
console_stamp( console );
run();

write( "Patched with 1.x pattern as string and some metadata" );
console_stamp( console, "dd/mm/yyyy HH:MM:ss.l", "METADATA" );
run();

write( "Patched with new 2.x object literal options parameter, with pattern" );
console_stamp( console, {
    pattern: "dd/mm/yyyy HH:MM:ss.l"
} );
run();

write( "Patched with defaults, but no label" );
console_stamp( console, {
    label: false
} );
run();

write( "Patched with defaults and metadata" );
console_stamp( console, {
    metadata: "[" + process.pid + "]"
} );
run();

write( "Patched with include parameter set to: ['log', 'info']" );
console_stamp( console, {
    include: ["log", "info"]
} );
run();

write( "Patched with exclude parameter set to: ['log', 'info']" );
console_stamp( console, {
    exclude: ["log", "info"]
} );
run();

write( "Patched with new 2.x object literal options parameter, with custom formatter" );
console_stamp( console, {
    formatter: function () {
        return moment().format( "LLLL" );
    },
    colors: {
        stamp: ["blue"],
        label: ["white"]
    }
} );
run();

write( "Patched with advanced metadata and color theme" );
console_stamp( console, {
    metadata: function () {
        return ("[" + human_readable( process.memoryUsage().rss ) + "]");
    },
    colors: {
        stamp: ["blue"],
        label: ["white"],
        metadata: ["green"]
    }
} );
run();

// Use some memory
var size = 5000000;
write( "Reading " + human_readable( size ) + "..." );
var Buffer = require( 'buffer' ).Buffer;
var buffer = new Buffer( size );
var fd = fs.openSync( '/dev/urandom', 'r' );
fs.readSync( fd, buffer, 0, buffer.length, 0 );
fs.closeSync( fd );

write( "Finished reading (memory usage should be different)." );

write( "Patched with advanced metadata and color theme" );
console_stamp( console, {
    metadata: function () {
        return ("[" + human_readable( process.memoryUsage().rss ) + "]");
    },
    colors: {
        stamp: "blue",
        label: ["white"],
        metadata: "green"
    }
} );
run();

write( "Patched 'lever' set to error" );
console_stamp( console, {
    level: "error"
} );
run();

write( "Patched 'disable' set to error" );
console_stamp( console, {
    disable: ["error"]
} );
run();

write( "Patched with custom console. See './stdout.log' and './stderr.log' for output." );
var output = fs.createWriteStream( './stdout.log' );
var errorOutput = fs.createWriteStream( './stderr.log' );
var logger = new console.Console( output, errorOutput );
console_stamp( logger, {
    stdout: output,
    stderr: errorOutput
} );
run( logger );

write( "Patched with custom console and only one output stream. See './stdout_stderr.log' for output." );
var outAndErr = fs.createWriteStream( './stdout_stderr.log' );
var logger2 = new console.Console( outAndErr );
console_stamp( logger2, {
    stdout: outAndErr
} );
run( logger2 );