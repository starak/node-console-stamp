# console-stamp

Patch Node.js console methods in order to add timestamp information by pattern.

## Usage ##

### Install

	npm install console-stamp

### Patching the console

	require("console-stamp")(console, [options]);

#### options {Object}

From version 2.0 the second parameter is an object with several options. As a backward compatibillity feature this parameter can be a string, but this is deprecated. 

* options.pattern {String}<br>A string with date format based on [Javascript Date Format](http://blog.stevenlevithan.com/archives/date-time-format)<br>Default: "ddd mmm dd yyyy HH:MM:ss"

* options.label {Boolean}<br>If true it will show the label (LOG|INFO|WARN|ERROR)<br>Default: true

* options.include {Array}<br>An array containing the methods to include in the patch<br>Default: ["log", "info", "warn", "error", "dir", "assert"]

* options.exclude {Array}<br>An array containing the methods to include in the patch<br>Default: [] \(none)

* metadata {String/Object/Function}<br>Types can be String, Object (interpreted with util.inspect), or Function. See the test-metadata.js for examples.

* options.colors {Object}<br>An object representing a color theme

    * options.colors.stamp {String/Array}

    * options.colors.label {String/Array}

    * options.colors.metadata {String/Array}


### Example

	// Patch console.x methods in order to add timestamp information
	require( "console-stamp" )( console, { pattern : "dd/mm/yyyy HH:MM:ss.l" } );

	console.log("Hello World!");
	// -> [26/06/2015 14:02:48.062] [LOG] Hello World!

	var port = 8080;
	console.log("Server running at port %d", port);
	// -> [26/06/2015 16:02:35.325] [LOG] Server running at port 8080

&nbsp;

	console.log( "This is a console.log message" );
    console.info( "This is a console.info message" );
    console.warn( "This is a console.warn message" );
    console.error( "This is a console.error message" );
    console.dir( {bar: "This is a console.dir message"} );

Result:

    [26/06/2015 12:44:31.777] [LOG]   This is a console.log message
	[26/06/2015 12:44:31.777] [INFO]  This is a console.info message
	[26/06/2015 12:44:31.779] [WARN]  This is a console.warn message
	[26/06/2015 12:44:31.779] [ERROR] This is a console.error message
	[26/06/2015 12:44:31.779] [DIR]   { bar: 'This is a console.dir message' }


### Adding Metadata ###

Types can be String, Object (interpreted with util.inspect), or Function. See the test-metadata.js for examples.

### String example

    require("console-stamp")(console, {
        pattern:"HH:MM:ss.l", 
        metadata:'[' + process.pid + ']'
    });

    console.log('Metadata applied.');

Result:

    [26/06/2015 12:44:31.779] [LOG] [7785] Metadata applied.

### Function example

    var util = require("util");

    require("console-stamp")(console, {
        pattern:"HH:MM:ss.l", 
        metadata: function(){ return '[' + (process.memoryUsage().rss) + ']'; });

    console.log('Metadata applied.');

Result:

    [18:10:30.875] [LOG] [14503936] Metadata applied.
