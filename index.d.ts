export type Token = ( payload?: TokenPayload ) => string | number;

export interface TokenPayload {
    method: string
    params: (string | number)[]
    tokens: Record<string, Token>
    defaultTokens: Record<string, Token>
}

declare function consoleStamp(console: Console, options?: {
    format?: string
    tokens?: Record<string, Token>
    include?: string[]
    level?: string
    extend?: Record<string, number>
    stdout?: WritableStream
    stderr?: WritableStream
    use_custom_message?: boolean
}): void;

export default consoleStamp;
