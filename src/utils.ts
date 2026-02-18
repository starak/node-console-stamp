import chalkTemplate from 'chalk-template';
import { Writable } from 'stream';
import df from './defaults.js';
import type { ConsoleStampOptions, ResolvedConfig } from './types.js';

/**
 * Check if the current log level allows the method to output
 * Methods not in the levels map default to the 'log' level priority
 */
export function checkLogLevel(
    { levels, level }: Pick<ResolvedConfig, 'levels' | 'level'>,
    method: string
): boolean {
    const methodLevel = levels[method] ?? levels['log'];
    return levels[level] >= methodLevel;
}

/**
 * Parse token parameters from a string like "(1, 2, foo)"
 */
export function parseParams(str = ''): (string | number)[] {
    return str
        .replace(/[()"']*/g, '')
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s !== '')
        .map((s) => (isNaN(+s) ? s : +s));
}

/**
 * Generate a resolved configuration from options
 */
export function generateConfig(options: ConsoleStampOptions | string = {}): ResolvedConfig {
    let opts: ConsoleStampOptions;

    if (typeof options === 'string') {
        opts = {
            format: df.dfFormat.replace('$$', options),
        };
    } else {
        opts = options;
    }

    const config: ResolvedConfig = {
        ...df,
        ...opts,
        format:
            opts.format === undefined
                ? df.dfFormat.replace('$$', df.dfDateFormat)
                : opts.format,
        include: [
            ...new Set([...(opts.include ?? df.include), ...Object.keys(opts.extend ?? {})]),
        ],
        tokens: { ...df.tokens, ...(opts.tokens ?? {}) },
        levels: {
            ...df.levels,
            ...Object.fromEntries(
                Object.entries(opts.levels ?? {}).filter(([, v]) => v !== undefined)
            ),
            ...(opts.extend ?? {}),
        } as ResolvedConfig['levels'],
        stdout: opts.stdout ?? process.stdout,
        stderr: opts.stderr ?? opts.stdout ?? process.stderr,
        defaultTokens: df.tokens,
        tokensKeys: [],
        extend: opts.extend ?? df.extend,
        preventDefaultMessage: opts.preventDefaultMessage ?? df.preventDefaultMessage,
        dual: opts.dual ?? df.dual,
        groupCount: df.groupCount,
    };

    config.tokensKeys = Object.keys(config.tokens);

    return config;
}

/**
 * Generate the prefix string for a log message
 */
export function generatePrefix(
    method: string,
    { tokens, defaultTokens, format: prefix, tokensKeys }: ResolvedConfig,
    msg: string
): string {
    let result = prefix;

    tokensKeys
        .sort((a, b) => b.length - a.length)
        .forEach((key) => {
            const token = tokens[key];
            const re = new RegExp(`:${key}(\\([^)]*\\))?(\\.\\w+)*`, 'g');
            result = result.replace(re, (match, params: string | undefined) => {
                try {
                    let ret = token({
                        method,
                        defaultTokens,
                        params: parseParams(params),
                        tokens,
                        msg,
                    });
                    match
                        .replace(params ?? '', '')
                        .split('.')
                        .slice(1)
                        .forEach((decorator) => {
                            ret = chalkTemplate`{${decorator} ${ret}}`;
                        });
                    return ret;
                } catch {
                    return match;
                }
            });
        });

    // Color groups - e.g., "(text).blue.bgRed"
    const rec = /(\([^)]*\))(\.\w+)+/g;

    if (/(\([^)]*\))(\.\w+)/.test(result.replace(msg, ''))) {
        result = result.replace(rec, (match, text: string) => {
            try {
                let ret = text.replace(/[()]/g, '');
                match
                    .replace(text, '')
                    .split('.')
                    .slice(1)
                    .forEach((decorator) => {
                        ret = chalkTemplate`{${decorator} ${ret}}`;
                    });
                return ret;
            } catch {
                return match;
            }
        });
    }

    return result;
}

/**
 * Select the appropriate output stream based on log level
 * Methods not in the levels map default to the 'log' level priority
 */
export function selectOutputStream(
    method: string,
    { levels, stdout, stderr }: ResolvedConfig
): Writable {
    const methodLevel = levels[method] ?? levels['log'];
    return methodLevel <= 2 ? stderr : stdout;
}

/**
 * Select the appropriate process stream based on log level
 * Used for dual output mode to write to both custom and process streams
 * Methods not in the levels map default to the 'log' level priority
 */
export function selectProcessStream(
    method: string,
    { levels }: Pick<ResolvedConfig, 'levels'>
): NodeJS.WriteStream {
    const methodLevel = levels[method] ?? levels['log'];
    return methodLevel <= 2 ? process.stderr : process.stdout;
}

/**
 * A writable stream that captures the last message written
 * Used internally to capture console output before formatting
 */
export class FakeStream extends Writable {
    private _last_message = '';

    get last_msg(): string {
        return this._last_message.replace(/\n$/, '');
    }

    override _write(
        chunk: Buffer | string,
        _encoding: BufferEncoding,
        callback: (error?: Error | null) => void
    ): void {
        this._last_message = chunk.toString();
        callback();
    }
}
