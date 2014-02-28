# console-stamp

Patch Node.js console methods in order to add timestamp information by pattern.

## Usage ##

### Installing ###

	npm install console-stamp

### Patching the console ###

	// Patch console.x methods in order to add timestamp information
	require("console-stamp")(console, "HH:mm:ss.l");
	
	console.log("Hello World!");
	// -> 14:02:48.062 Hello World!
	
	var port = 8080;
	console.log("Server running at port %d", port);
	// -> 16:02:35.325 Server running at port 8080
	
### Example

	console.time( "MyTimer" );
	console.log( "LOG" );
	console.info( "INFO" );
	console.warn( "WARN" );
	console.error( "ERROR" );
	console.dir( { foo: "bar" } );
	console.trace();
	console.timeEnd( "MyTimer" );
	console.assert( count < 10, "Count is > 10" );

Result:

	20:01:27.500 LOG
	20:01:27.504 INFO
	20:01:27.504 WARN
	20:01:27.504 ERROR
	20:01:27.504 { bar: 'console.dir' }
	20:01:27.508 Trace
    	at Object.<anonymous> (/Users/starak/code/node-console-stamp/test.js:14:9)
    	at Module._compile (module.js:456:26)
    	at Object.Module._extensions..js (module.js:474:10)
    	at Module.load (module.js:356:32)
    	at Function.Module._load (module.js:312:12)
    	at Function.Module.runMain (module.js:497:10)
    	at startup (node.js:119:16)
    	at node.js:901:3
	20:01:27.510 MyTimer: 10ms
	20:01:27.510
	AssertionError: Count is > 10
    	at Console.assert (console.js:102:23)
    	at Console.con.(anonymous function) [as assert] (/Users/starak/code/node-console-stamp/main.js:35:24)
    	at Object.<anonymous> (/Users/starak/code/node-console-stamp/test.js:16:9)
    	at Module._compile (module.js:456:26)
    	at Object.Module._extensions..js (module.js:474:10)
    	at Module.load (module.js:356:32)
    	at Function.Module._load (module.js:312:12)
    	at Function.Module.runMain (module.js:497:10)
    	at startup (node.js:119:16)
    	at node.js:901:3

See more about timestamp patterns at [felixges][felixge] excellent [dateformat][dateformat]

[dateformat]: https://github.com/felixge/node-dateformat
[felixge]: https://github.com/felixge
[FGRibreau]: https://github.com/FGRibreau/node-nice-console