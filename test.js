/*jshint node:true*/
"use strict";

var human_readable = require("filesize");
var write = function(txt){
    process.stdout.write(txt + "\n");
};
var cs = require( "./main" );

function run() {
    console.log( "LOG" );
    console.info( "INFO" );
    console.warn( "WARN" );
    console.error( "ERROR" );
    console.dir( {bar: "console.dir"} );
    write( "  " );
}

write( "No patching" );
run();

write( "Patched with defaults" );
cs( console );
run();

write( "Patched with 1.x pattern as string and some metadata" );
cs( console, "dd/mm/yyyy HH:MM:ss.l", "METADATA" );
run();

write( "Patched with new 2.x object literal options parameter, with pattern" );
cs( console, {
    pattern: "dd/mm/yyyy HH:MM:ss.l",
    colors: {
        label: ["white"]
    }
} );
run();

write( "Patched with defaults, but no label" );
cs( console, {
    label: false
} );
run();

write( "Patched with defaults and metadata" );
cs( console, {
    metadata: "[" + process.pid + "]"
} );
run();

write( "Patched with include parameter set to: ['log', 'info']" );
cs( console, {
    include: ["log", "info"]
} );
run();

write( "Patched with exclude parameter set to: ['log', 'info']" );
cs( console, {
    exclude: ["log", "info"]
} );
run();

write( "Patched with advanced metadata and color theme" );
cs( console, {
    metadata: function (  ) {
        return ("[" + human_readable(process.memoryUsage().rss) + "]");
    },
    colors: {
        label: ["white"],
        stamp: ["yellow"],
        metadata: ["green"]
    }
} );
run();

// Use some memory
var size = 50000000;
write("Reading " + human_readable(size) + "...");
var fs = require("fs");
var Buffer = require('buffer').Buffer;
var buffer = new Buffer(size);
var fd = fs.openSync('/dev/urandom', 'r');
fs.readSync(fd, buffer, 0, buffer.length, 0);
fs.closeSync(fd);
write("Finished reading (memory usage should be different).");

write( "Patched with advanced metadata and color theme" );
cs( console, {
    metadata: function (  ) {
        return ("[" + human_readable(process.memoryUsage().rss) + "]");
    },
    colors: {
        stamp: "blue",
        metadata: "green"
    }
} );
run();

cs( console );

