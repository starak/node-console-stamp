# node-console-stamp

Patch Node.js console methods in order to add timestamp information by pattern.

Inspired by [FGRibreau/node-nice-console][FGRibreau]

## Usage

See more about timestamp patterns at [felixges][felixge] excellent [dateformat][dateformat]

	// Patch console.x methods in order to add timestamp information
	require("console-stamp")(console, "HH:mm:ss.l");
	
	console.log("Hello World!");
	// -> 14:02:48.062 Hello World!


[dateformat]: https://github.com/felixge/node-dateformat
[felixge]: https://github.com/felixge
[FGRibreau]: https://github.com/FGRibreau/node-nice-console