declare module 'dateformat' {
    /**
     * Format a date according to a mask
     * @param date - The date to format (defaults to now)
     * @param mask - The format mask
     * @param utc - Whether to use UTC time
     * @returns The formatted date string
     */
    export default function dateformat(
        date?: Date | string | number,
        mask?: string,
        utc?: boolean
    ): string;

    export default function dateformat(mask?: string, utc?: boolean): string;
}
