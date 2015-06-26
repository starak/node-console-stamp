/*jshint node:true*/
"use strict";

var human_readable = require( "filesize" );
var write = function ( txt ) {
    process.stdout.write( txt + "\n" );
};
var console_stamp = require( "./main" );

function run() {
    console.log( "This is a console.log message" );
    console.info( "This is a console.info message" );
    console.warn( "This is a console.warn message" );
    console.error( "This is a console.error message" );
    console.dir( {bar: "This is a console.dir message"} );
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

write( "Patched with advanced metadata and color theme" );
console_stamp( console, {
    metadata: function () {
        return ("[" + human_readable( process.memoryUsage().rss ) + "]");
    },
    colors: {
        stamp: ["yellow"],
        label: ["white"],
        metadata: ["green"]
    }
} );
run();

// Use some memory
var size = 5000000;
write( "Reading " + human_readable( size ) + "..." );
var fs = require( "fs" );
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

console_stamp( console );

