import { PassThrough } from 'stream';

/**
 * A PassThrough stream that captures all written data for testing
 */
export class SpyStream extends PassThrough {
    private _stream: string[] = [];

    constructor() {
        super();
        this.on('data', (d: Buffer) => this._stream.push(d.toString()));
    }

    /** Number of messages captured */
    get length(): number {
        return this._stream.length;
    }

    /** The last message captured */
    get last(): string {
        return this._stream[this._stream.length - 1];
    }

    /** Clear all captured messages */
    flush(): void {
        this._stream = [];
    }

    /** Get all captured messages as an array */
    get asArray(): string[] {
        return this._stream;
    }
}
