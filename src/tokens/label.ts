import type { TokenContext } from '../types.js';

/**
 * Label token - displays the log level label
 * Usage: :label(padding)
 * @example :label(7) -> "[LOG]  " (padded to 7 chars)
 */
export default function label({ method, params }: TokenContext): string {
    const [len] = params as [number?];
    return `[${method.toUpperCase()}]`.padEnd(len ?? 7);
}
