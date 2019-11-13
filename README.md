# Console-stamp 3.0.0 RC3

[![npm][npm-image]][npm-url]
[![downloads][downloads-image]][downloads-url]
[![build][build-img]][downloads-url]

[npm-image]: https://img.shields.io/npm/v/console-stamp.svg?style=flat-square
[npm-url]: https://npmjs.org/package/console-stamp
[build-img]: https://img.shields.io/circleci/project/github/starak/node-console-stamp/3.0.0.svg?style=flat-square
[downloads-image]: https://img.shields.io/npm/dm/console-stamp.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/console-stamp

This module enables you to patch the console's methods in Node.js, to add prefix based on tokens, and more...

## Usage ##

### Install
```console
npm install console-stamp@next
```

### Simple example

This simple example is using the default settings

```js
require( 'console-stamp' )( console );

console.log('Hello, World!');
// -> [10.02.2019 15:37:43.452] [LOG]   Hello, World!
```

### Patching the console
```js
require( 'console-stamp' )( console, [options] );
```

#### console
The global console or [custom console](#customconsole).

#### options {Object|String}

The second parameter is an object with several options. As a feature this parameter can be a string containing the date-format.

* **options.format** {String}<br>A string with date format based on [dateformat](https://www.npmjs.com/package/dateformat)<br>
    **Default**: 'dd.mm.yyyy HH:MM:ss.l'

* **options.tokens** {Object}<br>Containing token-functions. See example [here](#tokens).

* **options.include** {Array}<br>An array containing the methods to include in the patch<br>
    **Default**: ["debug", "log", "info", "warn", "error"]

* **options.level** {String}<br>A string choosing the most verbose logging function to allow.<br>
    **Default**: `log`

* **options.extend** {Object}<br>An object describing methods and their associated log level, 
    to extend the existing `method <-> log level` pairs.<br>
    For an example see [Custom methods](#custommethods).

* **options.stdout** {WritableStream}<br>A custom `stdout` to use with [custom console](#customconsole).<br>
    **Default:** `process.stdout`

* **options.stderr** {WritableStream}<br>A custom `stderr` to use with [custom console](#customconsole).<br>
    **Default:** `options.stdout` or `process.stderr`

<a name="tokens"></a>
### Tokens

There are only two predefined tokens registered by default. These are:

    :date([format][,utc])[.color]
    :label([padding])[.color]

**:date([format][,utc])**
* **format** {String}<br>
    Containing the date format based on [dateformat](https://www.npmjs.com/package/dateformat)<br>
    **Default**: 'dd.mm.yyyy HH:MM:ss.l' 
* **utc** {Boolean}<br>
    Set to `true` will return UTC-time <br>
    **Default**: false
    
**:label([padding])**
* **padding** {Number}<br>
    The total length of the label, including the brackets and padding<br>
    **Default:** 7
    
### **TODO: How to write custom tokens**
#### Create a custom token
To define your own token, simply add a callback function with the token name to the tokens option. This callback function is expected to return a string. The value returned is then available as ":foo()" in this case:

```javascript
require( 'console-stamp' )( console, {
    format: ':foo() :label(7)',
    tokens:{
        foo: () => {
            return '[my prefix]';
        }
    }
} );

console.log("Bar")

// > [my prefix] [LOG]   Bar
```

The token callback function is called with one argument, representing an Object with the following properties:
* `method` {String} <br>
    The invoked method
* `params` {Array} <br>
    The token parameters (ex: The token call `:label(7)` will have params `[7]`)
* `tokens` {Object} <br>
    All the defined tokens, incl. the defaults 
* `defaultTokens` {Object} <br>
    Only the default tokens, even if it's been redefined in options

#### Example
Here we are making a custom date token called `mydate` using moment.js to format the date
```js
const moment = require('moment');
moment.locale('ja');

require( 'console-stamp' )( console, {
    format: ':mydate() :label(7)',
    tokens:{
        mydate: () => {
            return `[${moment().format('LLLL')}]`;
        }
    }
} );

console.log('This is a console.log message');
console.info('This is a console.info message');
console.debug('This is a console.debug message');
console.warn('This is a console.warn message');
console.error('This is a console.error message');
```

Result:
```console
[2016年5月12日午前11時10分 木曜日] [LOG]   This is a console.log message
[2016年5月12日午前11時10分 木曜日] [INFO]  This is a console.info message
[2016年5月12日午前11時10分 木曜日] [DEBUG] This is a console.debug message
[2016年5月12日午前11時10分 木曜日] [WARN]  This is a console.warn message
[2016年5月12日午前11時10分 木曜日] [ERROR] This is a console.error message
```

### Colors and styling 

All tokens can have a trailing styling like this:

```js
require( 'console-stamp' )( console, {
    format: ':foo().blue.bgWhite.underline :label(7)',
    tokens:{
        foo: () => {
            return 'bar';
        }
    }
} );
```

### **TODO: Color Groups** 
ex: `(foo).yellow`

**Note** that by sending the parameter `--no-color` when you start your node app, will prevent any colors from console.
```console
$ node my-app.js --no-color
```

### Example
```js
// Patch console.x methods in order to add timestamp information
require( 'console-stamp' )( console, { format: ':date(dd/mm/yyyy HH:MM:ss.l) :label' } );

console.log('Hello World!');
// -> [26/06/2015 14:02:48.062] [LOG]   Hello World!

const port = 8080;
console.log('Server running at port %d', port);
// -> [26/06/2015 16:02:35.325] [LOG]   Server running at port 8080
```
&nbsp;
```js
console.log('This is a console.log message');
console.info('This is a console.info message');
console.debug('This is a console.debug message');
console.warn('This is a console.warn message');
console.error('This is a console.error message');
```
Result:
```console
[26/06/2015 12:44:31.777] [LOG]   This is a console.log message
[26/06/2015 12:44:31.777] [INFO]  This is a console.info message
[26/06/2015 12:44:31.778] [DEBUG] This is a console.info message
[26/06/2015 12:44:31.779] [WARN]  This is a console.warn message
[26/06/2015 12:44:31.779] [ERROR] This is a console.error message
```

<a name="customconsole"></a>
### Custom Console

You can also create a custom console with its own `stdout` and `stderr` like this:

```js
const fs = require('fs');
const output = fs.createWriteStream('./stdout.log');
const errorOutput = fs.createWriteStream('./stderr.log');
const logger = new console.Console(output, errorOutput);

require('console-stamp')(logger, {
    stdout: output,
    stderr: errorOutput
});
```

Everything is then written to the files.

**NOTE:** If `stderr` isn't passed, warning and error output will be sent to the given `stdout`.


<a name="custommethods"></a>
### Custom Methods

The **option.extend** option enables the extension or modification of the logging methods and their associated log levels:

The default logging methods and their log levels are as follows:

```js
levels: {
    error: 1,
    warn: 2,
    info: 3,
    log: 4,
    debug: 4
};
```

The **extend** option enables the usage of custom console logging methods to be 
used with this module, for example:

```js
// Extending the console with a custom method
console.fatal = function(msg) {
    console.org.error(msg);
    process.exit(1);
}

// Initialising the output formatter
require( 'console-stamp' )( console, {
    extend: {
        fatal: 1
    }
} );
```

**Note** how the `console.org.error` method used in the custom method. This is to prevent circular calls to `console.error`
