// noinspection JSUnresolvedReference

const df = require('../lib/defaults.js');
const fs = require('fs');
const {
    selectOutputStream,
    parseParams,
    checkLogLevel,
    generateConfig,
    generatePrefix,
    FakeStream
} = require('../lib/utils.js');

describe('utils', () => {
    describe('generateConfig default', () => {
        it('should exist', () => {
            expect(generateConfig).toBeTruthy();
            const config = generateConfig({});
            expect(config.format).toBe(df.dfFormat.replace('$$', df.dfDateFormat));
            expect(df.level).toBe('log');
            expect(df.include).toEqual(config.include);
            expect(df.tokens).toEqual(config.tokens);
            expect(config.stdout).toBe(process.stdout);
            expect(config.stderr).toBe(process.stderr);
        });
    });

    describe('generateConfig override', () => {
        it('should override properties', () => {
            const stdout = fs.createWriteStream('/dev/null');
            const stderr = fs.createWriteStream('/dev/null');
            const config = generateConfig({
                level: 'log',
                format: ':foo(bar)',
                include: ['log'],
                stdout: stdout,
                stderr: stderr,
            });
            expect(config.format).toBe(':foo(bar)');
            expect(config.level).toBe('log');
            expect(config.include.length).toBe(1);
            expect(config.stdout).toBe(stdout);
            expect(config.stderr).toBe(stderr);
        });
    });

    describe('generateConfig extend', () => {
        it('should extend properties', () => {
            const config = generateConfig({
                format: ':foo(bar)',
                tokens: {
                    foo: ({ params: [bar] }) => bar
                },
                extend: {
                    foo: 1
                }
            });
            expect(config.include.length).toBe(df.include.length + 1);
            expect(typeof config.tokens.foo).toBe('function');
        });
    });

    describe('generateConfig with string input', () => {
        it('should use string as format', () => {
            const str = 'HH:MM.ss.l';
            const config = generateConfig(str);
            expect(config.format).toBe(df.dfFormat.replace('$$', str));
        });
    });

    describe('generatePrefix plain', () => {
        it('should generate prefix correctly', () => {
            const config = generateConfig({
                format: ':foo(bar)',
                tokens: {
                    foo: ({ params: [bar] }) => bar
                },
                extend: {
                    foo: 1
                }
            }, console);
            expect(generatePrefix('log', config)).toBe('bar');
        });
    });

    describe('selectOutputStream default', () => {
        it('should select output stream', () => {
            const config = generateConfig({}, console);
            expect(selectOutputStream('log', config)).toBe(process.stdout);
            expect(selectOutputStream('info', config)).toBe(process.stdout);
            expect(selectOutputStream('warn', config)).toBe(process.stderr);
            expect(selectOutputStream('error', config)).toBe(process.stderr);
        });
    });

    describe('selectOutputStream override', () => {
        it('should override output stream', () => {
            const stdout = fs.createWriteStream('/dev/null');
            const stderr = fs.createWriteStream('/dev/null');
            const config = generateConfig({
                stdout: stdout,
                stderr: stderr,
            }, console);
            expect(selectOutputStream('debug', config)).toBe(stdout);
            expect(selectOutputStream('log', config)).toBe(stdout);
            expect(selectOutputStream('info', config)).toBe(stdout);
            expect(selectOutputStream('warn', config)).toBe(stderr);
            expect(selectOutputStream('error', config)).toBe(stderr);
        });
    });

    describe('checkLogLevel', () => {
        it('should check log levels', () => {
            const config = generateConfig({}, console);
            expect(config.level).toBe('log');
            expect(checkLogLevel(config, 'log')).toBeTruthy();
            expect(checkLogLevel(config, 'info')).toBeTruthy();
            expect(checkLogLevel(config, 'debug')).toBeTruthy();
        });
    });

    describe('checkLogLevel override info', () => {
        it('should override log level to info', () => {
            const config = generateConfig({ level: 'info' }, console);
            expect(config.level).toBe('info');
            expect(checkLogLevel(config, 'log')).toBeFalsy();
            expect(checkLogLevel(config, 'debug')).toBeFalsy();
            expect(checkLogLevel(config, 'info')).toBeTruthy();
            expect(checkLogLevel(config, 'error')).toBeTruthy();
        });
    });

    describe('checkLogLevel override error', () => {
        it('should override log level to error', () => {
            const config = generateConfig({ level: 'error' }, console);
            expect(config.level).toBe('error');
            expect(checkLogLevel(config, 'log')).toBeFalsy();
            expect(checkLogLevel(config, 'info')).toBeFalsy();
            expect(checkLogLevel(config, 'warn')).toBeFalsy();
            expect(checkLogLevel(config, 'error')).toBeTruthy();
        });
    });

    describe('parseParams', () => {
        it('should parse parameters', () => {
            const [a, b, c, d] = parseParams('( 1,2,3,foo )');
            expect(a).toBe(1);
            expect(b).toBe(2);
            expect(c).toBe(3);
            expect(d).toBe('foo');
        });
    });

    describe('FakeStream', () => {
        it('should work as a fake stream', () => {
            const fakeStream = new FakeStream();
            const msg = 'Msg from console';
            expect(fakeStream).toBeTruthy();
            fakeStream.write(msg);
            expect(fakeStream.last_msg).toBe(msg);
            fakeStream.end();
        });
    });
});
