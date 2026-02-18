import dateformat from 'dateformat';
import type { TokenContext } from '../types.js';

/**
 * Date token - formats the current date/time
 * Usage: :date(format, utc)
 * @example :date(yyyy/mm/dd HH:MM:ss)
 * @example :date(isoDateTime, true)
 */
export default function date({ params }: TokenContext): string {
    const [format, utc = false, dateValue = new Date()] = params as [
        string,
        boolean?,
        Date?,
    ];
    return `[${dateformat(dateValue, format, utc)}]`;
}
