// noinspection JSUnresolvedReference

const consoleStamp = require('../');
const chalk = require('chalk');
const SpyStream = require('./tools/SpyStream');

const message = "foo";

function logAll(logger) {
    logger.log(message);
    logger.info(message);
    logger.debug(message);
    logger.warn(message);
    logger.error(message);
}

test('general test', () => {
    const stderr = new SpyStream();
    const stdout = new SpyStream();

    consoleStamp(console, {
        format: ':label(8)',
        stdout: stdout,
        stderr: stderr,
        level: 'debug',
    });

    logAll(console);

    expect(stdout.length).toEqual(3);
    expect(stdout.asArray[0]).toEqual('[LOG]    ' + message + '\n');
    expect(stdout.asArray[1]).toEqual('[INFO]   ' + message + '\n');
    expect(stdout.asArray[2]).toEqual('[DEBUG]  ' + message + '\n');
    expect(stderr.length).toEqual(2);
    expect(stderr.asArray[0]).toEqual('[WARN]   ' + message + '\n');
    expect(stderr.asArray[1]).toEqual('[ERROR]  ' + message + '\n');

    console.reset();
    stdout.flush();
    stderr.flush();

    const pid = process.pid;

    consoleStamp(console, {
        format: `:pid :foo(bar)`,
        stdout,
        stderr,
        level: 'debug',
        tokens: {
            foo: ({ params: [bar] }) => bar,
            pid: () => pid,
        },
    });

    logAll(console);

    expect(stdout.length).toEqual(3);
    let expected = `${pid} bar ${message}\n`;
    expect(stdout.asArray[0]).toEqual(expected);
    expect(stdout.asArray[1]).toEqual(expected);
    expect(stdout.asArray[2]).toEqual(expected);
    expect(stderr.asArray.length).toEqual(2);
    expect(stderr.asArray[0]).toEqual(expected);
    expect(stderr.asArray[1]).toEqual(expected);

    console.reset();
    stdout.flush();
    stderr.flush();

    consoleStamp(console, {
        format: `:foo(bar).blue.bgRed`,
        stdout,
        stderr,
        tokens: {
            foo: ({ params: [bar] }) => bar,
        },
    });

    logAll(console);
    expected = chalk`{bgRed.blue bar} ${message}\n`;
    expect(stdout.asArray[0]).toEqual(expected);

    console.reset();
    stdout.flush();
    stderr.flush();

    consoleStamp(console, {
        format: `(bar).blue.bgRed`,
        stdout,
        stderr,
    });

    logAll(console);
    expected = chalk`{bgRed.blue bar} ${message}\n`;
    expect(stdout.asArray[0]).toEqual(expected);
});