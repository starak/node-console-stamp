# console-stamp

Patch Node.js console methods in order to add timestamp information by pattern.

Inspired by [FGRibreau/node-nice-console][FGRibreau]

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

See more about timestamp patterns at [felixges][felixge] excellent [dateformat][dateformat]

[dateformat]: https://github.com/felixge/node-dateformat
[felixge]: https://github.com/felixge
[FGRibreau]: https://github.com/FGRibreau/node-nice-console