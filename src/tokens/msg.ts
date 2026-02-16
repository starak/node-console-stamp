import type { TokenContext } from '../types.js';

/**
 * Message token - outputs the console message
 * Usage: :msg
 * When used, the message appears at the token position instead of at the end
 */
export default function msg({ msg }: TokenContext): string {
    return msg;
}
