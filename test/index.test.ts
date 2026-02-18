import { describe, it, expect, afterEach } from 'vitest';
import chalkTemplate from 'chalk-template';
import consoleStamp from '../src/index.js';
import type { PatchedConsole } from '../src/types.js';
import { SpyStream } from './helpers/SpyStream.js';

const message = 'foo';

function logAll(logger: Console): void {
    logger.log(message);
    logger.info(message);
    logger.debug(message);
    logger.warn(message);
    logger.error(message);
}

describe('consoleStamp', () => {
    afterEach(() => {
        // Reset console if it was patched
        const patchedConsole = console as PatchedConsole;
        if (patchedConsole.__patched && typeof patchedConsole.reset === 'function') {
            patchedConsole.reset();
        }
    });

    it('general test', () => {
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

        (console as PatchedConsole).reset();
        stdout.flush();
        stderr.flush();

        const pid = process.pid;

        consoleStamp(console, {
            format: `:pid :foo(bar)`,
            stdout,
            stderr,
            level: 'debug',
            tokens: {
                foo: ({ params }) => String(params[0]),
                pid: () => String(pid),
            },
        });

        logAll(console);

        expect(stdout.length).toEqual(3);
        const expected = `${pid} bar ${message}\n`;
        expect(stdout.asArray[0]).toEqual(expected);
        expect(stdout.asArray[1]).toEqual(expected);
        expect(stdout.asArray[2]).toEqual(expected);
        expect(stderr.asArray.length).toEqual(2);
        expect(stderr.asArray[0]).toEqual(expected);
        expect(stderr.asArray[1]).toEqual(expected);

        (console as PatchedConsole).reset();
        stdout.flush();
        stderr.flush();

        consoleStamp(console, {
            format: `:foo(bar).blue.bgRed`,
            stdout,
            stderr,
            tokens: {
                foo: ({ params }) => String(params[0]),
            },
        });

        logAll(console);
        const expectedColored = chalkTemplate`{bgRed.blue bar} ${message}\n`;
        expect(stdout.asArray[0]).toEqual(expectedColored);

        (console as PatchedConsole).reset();
        stdout.flush();
        stderr.flush();

        consoleStamp(console, {
            format: `(bar).blue.bgRed`,
            stdout,
            stderr,
        });

        logAll(console);
        const expectedColorGroup = chalkTemplate`{bgRed.blue bar} ${message}\n`;
        expect(stdout.asArray[0]).toEqual(expectedColorGroup);
    });

    it('should reset console methods', () => {
        const stdout = new SpyStream();
        const stderr = new SpyStream();

        const originalLog = console.log;

        consoleStamp(console, {
            format: ':label',
            stdout,
            stderr,
        });

        expect((console as PatchedConsole).__patched).toBe(true);
        expect((console as PatchedConsole).reset).toBeDefined();

        (console as PatchedConsole).reset();

        expect((console as PatchedConsole).__patched).toBeUndefined();
        expect(console.log).toBe(originalLog);
    });

    it('should handle re-patching', () => {
        const stdout = new SpyStream();
        const stderr = new SpyStream();

        consoleStamp(console, {
            format: ':label(5)',
            stdout,
            stderr,
        });

        console.log(message);
        expect(stdout.asArray[0]).toEqual('[LOG] ' + message + '\n');

        stdout.flush();

        // Re-patch with different format
        consoleStamp(console, {
            format: ':label(8)',
            stdout,
            stderr,
        });

        console.log(message);
        expect(stdout.asArray[0]).toEqual('[LOG]    ' + message + '\n');
    });

    it('should respect log level', () => {
        const stdout = new SpyStream();
        const stderr = new SpyStream();

        consoleStamp(console, {
            format: ':label',
            stdout,
            stderr,
            level: 'warn',
        });

        console.log(message);
        console.info(message);
        console.debug(message);
        console.warn(message);
        console.error(message);

        // Only warn and error should be output
        expect(stdout.length).toEqual(0);
        expect(stderr.length).toEqual(2);
    });

    it('should write to both custom and process streams when dual is true', () => {
        const customStdout = new SpyStream();
        const customStderr = new SpyStream();
        const processStdout = new SpyStream();
        const processStderr = new SpyStream();

        // Replace process streams temporarily
        const originalProcessStdout = process.stdout;
        const originalProcessStderr = process.stderr;
        Object.defineProperty(process, 'stdout', { value: processStdout, writable: true });
        Object.defineProperty(process, 'stderr', { value: processStderr, writable: true });

        try {
            consoleStamp(console, {
                format: ':label',
                stdout: customStdout,
                stderr: customStderr,
                dual: true,
                level: 'debug',
            });

            console.log(message);
            console.warn(message);
            console.error(message);

            // Custom streams should have the output
            expect(customStdout.length).toEqual(1);
            expect(customStdout.asArray[0]).toContain(message);
            expect(customStderr.length).toEqual(2);
            expect(customStderr.asArray[0]).toContain(message);
            expect(customStderr.asArray[1]).toContain(message);

            // Process streams should also have the output (dual mode)
            expect(processStdout.length).toEqual(1);
            expect(processStdout.asArray[0]).toContain(message);
            expect(processStderr.length).toEqual(2);
            expect(processStderr.asArray[0]).toContain(message);
            expect(processStderr.asArray[1]).toContain(message);
        } finally {
            // Restore process streams
            Object.defineProperty(process, 'stdout', { value: originalProcessStdout, writable: true });
            Object.defineProperty(process, 'stderr', { value: originalProcessStderr, writable: true });
        }
    });

    it('should not duplicate output when custom stream equals process stream', () => {
        const processStdout = new SpyStream();
        const processStderr = new SpyStream();

        // Replace process streams temporarily
        const originalProcessStdout = process.stdout;
        const originalProcessStderr = process.stderr;
        Object.defineProperty(process, 'stdout', { value: processStdout, writable: true });
        Object.defineProperty(process, 'stderr', { value: processStderr, writable: true });

        try {
            // Use process.stdout/stderr as custom streams (same as process streams)
            consoleStamp(console, {
                format: ':label',
                stdout: processStdout,
                stderr: processStderr,
                dual: true,
                level: 'debug',
            });

            console.log(message);
            console.warn(message);

            // Should only have 1 output per method (no duplication)
            expect(processStdout.length).toEqual(1);
            expect(processStderr.length).toEqual(1);
        } finally {
            // Restore process streams
            Object.defineProperty(process, 'stdout', { value: originalProcessStdout, writable: true });
            Object.defineProperty(process, 'stderr', { value: originalProcessStderr, writable: true });
        }
    });
});
