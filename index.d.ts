export type Token = ( payload: TokenPayload ) => string | number;

export interface TokenPayload {
    method: string
    params: (string | number)[]
    tokens: Record<string, Token>
    defaultTokens: Record<string, Token>
    msg: string
}

export interface SpyStream extends NodeJS.WriteStream{
    length: number
    last: string
    flush: ()=>void
    asArray: string[]
}

declare global {
    interface Console {
        reset: () => void;
        org: Console
    }
}

declare function consoleStamp(console: Console, options?: {
    format?: string
    tokens?: Record<string, Token>
    include?: string[]
    level?: string
    extend?: Record<string, number>
    stdout?: NodeJS.WriteStream | SpyStream
    stderr?: NodeJS.WriteStream | SpyStream
    preventDefaultMessage?: boolean
}): void;

export default consoleStamp;
