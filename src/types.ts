import type { Writable } from 'stream';

/**
 * Context passed to token functions
 */
export interface TokenContext {
    /** The console method being called (log, info, warn, error, debug, etc.) */
    method: string;
    /** Parameters parsed from the token call, e.g., :label(7) -> [7] */
    params: (string | number)[];
    /** All registered token functions */
    tokens: Record<string, TokenFunction>;
    /** The default token functions (date, label, msg) */
    defaultTokens: Record<string, TokenFunction>;
    /** The console output message */
    msg: string;
}

/**
 * A token function that receives context and returns a formatted string
 */
export type TokenFunction = (context: TokenContext) => string;

/**
 * Log level configuration mapping method names to numeric levels
 */
export interface LogLevels {
    error: number;
    warn: number;
    info: number;
    log: number;
    debug: number;
    [key: string]: number;
}

/**
 * Options for configuring console-stamp
 */
export interface ConsoleStampOptions {
    /** Format string with tokens, e.g., ':date() :label(7)' */
    format?: string;
    /** Console methods to patch */
    include?: string[];
    /** Minimum log level to display */
    level?: string;
    /** Custom log levels */
    levels?: Partial<LogLevels>;
    /** Custom token functions */
    tokens?: Record<string, TokenFunction>;
    /** Extend console with custom methods and their log levels */
    extend?: Record<string, number>;
    /** Custom stdout stream */
    stdout?: Writable;
    /** Custom stderr stream */
    stderr?: Writable;
    /** Prevent default message output (use with custom :msg token) */
    preventDefaultMessage?: boolean;
}

/**
 * Internal resolved configuration with all defaults applied
 */
export interface ResolvedConfig {
    format: string;
    include: string[];
    level: string;
    levels: LogLevels;
    tokens: Record<string, TokenFunction>;
    defaultTokens: Record<string, TokenFunction>;
    tokensKeys: string[];
    extend: Record<string, number>;
    stdout: Writable;
    stderr: Writable;
    preventDefaultMessage: boolean;
    groupCount: number;
}

/**
 * Console object after being patched by console-stamp
 */
export interface PatchedConsole extends Console {
    /** Restore original console methods */
    reset: () => void;
    /** Original console methods before patching */
    org: Record<string, (...args: unknown[]) => void>;
    /** Internal flag indicating console has been patched */
    __patched?: boolean;
}
