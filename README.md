# Console-stamp 3

[![npm][npm-image]][npm-url]
[![downloads][downloads-image]][npm-url]
[![build][build-img]][npm-url]

[npm-image]: https://img.shields.io/npm/v/console-stamp.svg?style=flat-square
[npm-url]: https://npmjs.org/package/console-stamp
[build-img]: https://circleci.com/gh/starak/node-console-stamp.svg?style=svg
[downloads-image]: https://img.shields.io/npm/dm/console-stamp.svg?style=flat-square

This module lets you take control over the output from `console` logging methods in Node.js. Such as prefixing the log statement with timestamp information, log levels, add coloured output and much more.

## Usage ##

### Install
```console
npm install console-stamp
```

### Patching the console

You need to provide the console object to `console-stamp` in order to patch the builtin console.

```js
require( 'console-stamp' )( console );

console.log('Hello, World!');
```
The default behaviour is to add a prefix to each log statement with timestamp information and log level.
```terminal
[10.02.2019 15:37:43.452] [LOG]   Hello, World!
```

You can change this by provinding an [options](#options) object as the second parameter.

```js
require('console-stamp')(console, { 
    format: ':date(yyyy/mm/dd HH:MM:ss.l)' 
} );

console.log('Hello, World!');
```

```terminal
[2020/01/19 13:56:49.383] Hello, World!
```

Notice how the log level is suddenly missing. You need to add it specifically to the format string.

```js
require('console-stamp')(console, { 
    format: ':date(yyyy/mm/dd HH:MM:ss.l) :label' 
} );

console.log('Hello, World!');
```

```terminal
[2020/01/19 23:20:30.371] [LOG] Hello, World!
```

[Read more](#configuration) about how to customize the formatting of the log statement below.

<a name="customconsole"></a>
### Patch your own console

You can also provide a custom console with its own `stdout` and `stderr` like this:

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

### Backwards incompatibility with 2.x versions

`console-stamp` v3 has been rewritten adding [tokens](#tokens) as a new and easier way to customize and extend your logging output.

With that in mind, some consessions has been made and you will probably need to update your `console-stamp` integration.

#### `options.pattern` is replaced by `options.format`

`options.format` is now the place where you provide the format of the logging prefix using [tokens](#tokens).

For example, `{ pattern: 'dd.mm.yyyy HH:MM:ss.l'}` is replaced by `{ format: ':date(dd.mm.yyyy HH:MM:ss.l)' }`.

PS: Providing a string with a date format based on [dateformat](https://www.npmjs.com/package/dateformat) as a second parameter is still supported. 

#### `options.label` is gone

The log level label (INFO, DEBUG etc.) is now only shown if the token `:label` is part of the format string in `options.format`. It is part of the default format.

`options.labelSuffix` and `options.labelPrefix` are also gone as now you can provide these values directly in the `options.format` string.

<a name="configuration"></a>
### Configuration

Here are some examples on how to customize your log statements with `console-stamp`.

#### Only update timestamp format

Without any other customizations you can provide the timestamp format directly.

```js
require('console-stamp')( console, 'yyyy/mm/dd HH:MM:ss.l' );
```
To set the timestamp format using the [options](#options) object you can use the `date` token.

```js
require('console-stamp')(console, { 
    format: ':date(yyyy/mm/dd HH:MM:ss.l)' 
} );

console.log('Hello, World!');
```

```
[2020/01/19 23:08:39.202] Hello, World!
```

#### Add coloured output

`console-stamp` uses the excellent [chalk](https://www.npmjs.com/package/chalk) library to provide coloured output and other styling.

```js
require( 'console-stamp' )( console, {
    format: ':date().blue.bgWhite.underline :label(7)'
} );
```
You can also simply place some text in parenthesis, and then add your styling to that.

```js
require( 'console-stamp' )( console, {
    format: '(->).yellow :date().blue.bgWhite.underline :label(7)'
} );
```

**Note** that by sending the parameter `--no-color` when you start your node app, will prevent any colors from console.
```console
$ node my-app.js --no-color
```
For more examples on styling, check out the [chalk](https://www.npmjs.com/package/chalk) documentation.


<a name="tokens"></a>
### Tokens

There are only three predefined tokens registered by default. These are:

    :date([format][,utc])[.color]
    :label([padding])[.color]
    :msg[.color]

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
    
**:msg**
* If the `:msg` token is provided in `format`, the output from the console will be returned in its place, otherwise the console output will be added as the last output, with no formatting.

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

console.log("Bar");
```
```terminal
[my prefix] [LOG]   Bar
```

The token callback function is called with one argument, representing an Object with the following properties:
* `method` {String} <br>
    The invoked method
* `msg` {String} <br>
    The console output as a string
* `params` {Array} <br>
    The token parameters (ex: The token call `:label(7)` will have params `[7]`)
* `tokens` {Object} <br>
    All the defined tokens, incl. the defaults 
* `defaultTokens` {Object} <br>
    Only the default tokens, even if it's been redefined in options

##### Example
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
```terminal
[2016年5月12日午前11時10分 木曜日] [LOG]   This is a console.log message
[2016年5月12日午前11時10分 木曜日] [INFO]  This is a console.info message
[2016年5月12日午前11時10分 木曜日] [DEBUG] This is a console.debug message
[2016年5月12日午前11時10分 木曜日] [WARN]  This is a console.warn message
[2016年5月12日午前11時10分 木曜日] [ERROR] This is a console.error message
```


<a name="custommethods"></a>
### Custom Methods

The **option.extend** option enables the extension or modification of the logging methods and their associated log levels:

The default logging methods and their log levels are as follows:

```js
levels = {
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

-------------

### API
```js
require( 'console-stamp' )( console, [options] );
```

#### console
The global console or [custom console](#customconsole).

<a name="options"></a>
#### options {Object|String}

The second parameter is an object with several options. As a feature this parameter can be a string containing the date-format.

* **options.format** {String}<br>A string with date format based on [dateformat](https://www.npmjs.com/package/dateformat)<br>
    **Default**: ':date(dd.mm.yyyy HH:MM:ss.l) :label'

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
    
* **options.preventDefaultMessage** {Boolean}<br>If set to `true` Console-stamp will not print out the standard output from the console. This can be used in combination with a custom message token.<br>**Default:** `false`

