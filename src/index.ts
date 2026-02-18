import {
    checkLogLevel,
    generateConfig,
    generatePrefix,
    selectOutputStream,
    selectProcessStream,
    FakeStream,
} from './utils.js';
import type { ConsoleStampOptions, PatchedConsole, ResolvedConfig } from './types.js';

// Re-export types for consumers
export type { ConsoleStampOptions, TokenContext, TokenFunction, PatchedConsole } from './types.js';

/**
 * Patch console methods to add timestamps, labels, and formatting
 *
 * @param con - The console object to patch (global console or custom Console instance)
 * @param options - Configuration options or a date format string
 *
 * @example
 * // Basic usage with default format
 * import consoleStamp from 'console-stamp';
 * consoleStamp(console);
 *
 * @example
 * // Custom date format
 * consoleStamp(console, 'yyyy/mm/dd HH:MM:ss');
 *
 * @example
 * // Full options
 * consoleStamp(console, {
 *   format: ':date(yyyy-mm-dd) :label',
 *   level: 'info',
 *   include: ['log', 'info', 'warn', 'error'],
 * });
 */
export default function consoleStamp(
    con: Console,
    options: ConsoleStampOptions | string = {}
): void {
    const patchedCon = con as PatchedConsole;

    // Reset if already patched
    if (patchedCon.__patched) {
        patchedCon.reset();
    }

    const helperConsoleStream = new FakeStream();
    const helperConsole = new console.Console(helperConsoleStream, helperConsoleStream);

    const config: ResolvedConfig = generateConfig(options);
    const include = config.include.filter(
        (m) => typeof (con as unknown as Record<string, unknown>)[m] === 'function'
    );

    // Store original methods
    const org: Record<string, (...args: unknown[]) => void> = {};
    Object.keys(con).forEach((m) => {
        const method = (con as unknown as Record<string, unknown>)[m];
        if (typeof method === 'function') {
            org[m] = method as (...args: unknown[]) => void;
        }
    });
    patchedCon.org = org;

    // Patch each method
    include.forEach((method) => {
        const stream = selectOutputStream(method, config);
        const trg = (con as unknown as Record<string, (...args: unknown[]) => void>)[method];

        (con as unknown as Record<string, unknown>)[method] = new Proxy(trg, {
            apply: (_target, context, args: unknown[]) => {
                if (checkLogLevel(config, method)) {
                    helperConsole.log.apply(context, args);
                    let outputMessage = `${generatePrefix(method, config, helperConsoleStream.last_msg)} `;

                    if (method === 'table') {
                        outputMessage += '\n';
                        helperConsole.table.apply(context, args as [unknown]);
                        outputMessage += helperConsoleStream.last_msg;
                    } else if (!(config.preventDefaultMessage || /:msg\b/.test(config.format))) {
                        outputMessage += `${helperConsoleStream.last_msg}`;
                    }

                    outputMessage += '\n';
                    stream.write(outputMessage);

                    // Dual output: also write to process streams if enabled
                    if (config.dual) {
                        const processStream = selectProcessStream(method, config);
                        if (processStream !== stream) {
                            processStream.write(outputMessage);
                        }
                    }
                }
            },
        });

        patchedCon.__patched = true;
    });

    // Handle table method when not included
    if (!include.includes('table')) {
        const tableConsole = new console.Console(config.stdout, config.stderr);
        (con as unknown as Record<string, unknown>).table = tableConsole.table;
    }

    // Add reset method to restore original console
    patchedCon.reset = () => {
        Object.keys(patchedCon.org).forEach((m) => {
            (con as unknown as Record<string, unknown>)[m] = patchedCon.org[m];
            delete patchedCon.org[m];
        });
        delete (con as Partial<PatchedConsole>).org;
        delete patchedCon.__patched;
        delete (con as Partial<PatchedConsole>).reset;
        helperConsoleStream.end();
    };
}

// Also export as named export for ESM convenience
export { consoleStamp };
