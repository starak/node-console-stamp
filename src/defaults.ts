import { date, label, msg } from './tokens/index.js';
import type { TokenFunction, LogLevels } from './types.js';

/**
 * Default configuration structure
 */
export interface Defaults {
    format: string;
    dfFormat: string;
    dfDateFormat: string;
    include: string[];
    tokens: Record<string, TokenFunction>;
    level: string;
    levels: LogLevels;
    extend: Record<string, number>;
    groupCount: number;
    preventDefaultMessage: boolean;
    dual: boolean;
}

/**
 * Default configuration values
 */
const defaults: Defaults = {
    format: '',
    dfFormat: ':date($$) :label(7)',
    dfDateFormat: 'dd.mm.yyyy HH:MM.ss.l',
    include: ['debug', 'log', 'info', 'warn', 'error'],
    tokens: { date, label, msg },
    level: 'log',
    levels: {
        error: 1,
        warn: 2,
        info: 3,
        log: 4,
        debug: 4,
    },
    extend: {},
    groupCount: 0,
    preventDefaultMessage: false,
    dual: false,
};

export default defaults;
