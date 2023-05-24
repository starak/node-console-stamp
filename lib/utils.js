const df = require( './defaults' );
const chalk = require( 'chalk' );
const { Writable } = require( 'stream' );

function checkLogLevel( { levels, level }, method ) {
    return levels[level] >= levels[method];
}

function parseParams( str = '' ) {
    return str
        .replace( /[()"']*/g, '' )
        .split( ',' )
        .map( s => s.trim() )
        .filter( s => s !== '' )
        .map( s => isNaN( +s ) ? s : +s );
}

function generateConfig( options ) {

    if ( typeof options === 'string' ) {
        options = {
            format: df.dfFormat.replace( '$$', options )
        }
    }

    // Using Object.assign and not Object spread properties to support Node v6.4
    const config = Object.assign( {}, df, options || {}, {
        format: typeof options.format === 'undefined' ? df.dfFormat.replace( '$$', df.dfDateFormat ) : options.format,
        include: [...( new Set( [...( options.include || df.include ), ...Object.keys( options.extend || {} )] ) )],
        tokens: Object.assign( {}, df.tokens, options.tokens || {} ),
        levels: Object.assign( {}, df.levels, options.levels || {}, options.extend || {} ),
        stdout: options.stdout || process.stdout,
        stderr: options.stderr || options.stdout || process.stderr
    } );

    config.tokensKeys = Object.keys( config.tokens );
    config.defaultTokens = df.tokens;

    return config;
}

function generatePrefix( method, { tokens, defaultTokens, format: prefix, tokensKeys }, msg ) {
    tokensKeys
        .sort( ( a, b ) => b.length - a.length )
        .forEach( key => {
            const token = tokens[key];
            const re = new RegExp( `:${key}(\\([^)]*\\))?(\\.\\w+)*`, 'g' );
            prefix = prefix.replace( re, ( match, params ) => {
                try {
                    let ret = token({method, defaultTokens, params: parseParams(params), tokens, msg});
                    match.replace(params, '').split('.').slice(1).forEach(decorator => {
                        ret = chalk`{${decorator} ${ret}}`;
                    });
                    return ret;
                }catch (e){
                    return match;
                }
            } );
        } );

    // Color groups
    const rec = /(\([^)]*\))(\.\w+)+/g;

    if(/(\([^)]*\))(\.\w+)/.test(prefix.replace(msg,''))){ // If there is a color group in the prefix
        prefix = prefix.replace(rec, (match, text) => {
            try {
                let ret = text.replace(/[()]/g, '');
                match.replace(text, '').split('.').slice(1).forEach(decorator => {
                    ret = chalk`{${decorator} ${ret}}`;
                });
                return ret;
            } catch (e) {
                return match;
            }
        });
    }

    return prefix;
}

function selectOutputStream( method, { levels, stdout, stderr } ) {
    return levels[method] <= 2 ? stderr : stdout;
}

class FakeStream extends Writable {
    constructor() {
        super();
        this._last_message = '';
    }

    get last_msg() {
        return this._last_message.replace( /\n$/, '' );
    }

    _write( chunk, enc, cb ) {
        this._last_message = chunk.toString();
        cb();
    }
}

module.exports = {
    checkLogLevel,
    parseParams,
    generateConfig,
    generatePrefix,
    selectOutputStream,
    FakeStream
};
