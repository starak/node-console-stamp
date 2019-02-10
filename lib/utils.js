const df = require( './defaults.js' );
const chalk = require( 'chalk' );

function checkLogLevel( { levels, level }, method ) {
    return levels[level] >= levels[method];
}

function parseParams( str = '' ) {
    // noinspection JSCheckFunctionSignatures
    return str
        .replace( /[()"']*/g, '' )
        .split( ',' )
        .map( s => s.trim() )
        .filter( s => s !== '' )
        .map( s => isNaN( s ) ? s : +s );
}

function generateConfig( options ) {

    if ( typeof options === "string" ) {
        options = {
            format: df.dfFormat.replace( '$$', options )
        }
    }

    // Using Object.assign and not Object spread properties to support Node v6.4
    const config = Object.assign( {}, df, options || {}, {
        format: options.format || df.dfFormat.replace( '$$', df.dfDateFormat ),
        include: [...( new Set( [...( options.include || df.include ), ...Object.keys( options.extend || {} )] ) )],
        tokens: Object.assign( df.tokens, options.tokens || {} ),
        levels: Object.assign( df.levels, options.levels || {}, options.extend || {} ),
        stdout: options.stdout || process.stdout,
        stderr: options.stderr || options.stdout || process.stderr
    } );

    config.tokensKeys = Object.keys( config.tokens );
    config.defaultTokens = df.tokens;

    return config;
}

function generatePrefix( method, { tokens, defaultTokens, format: prefix, tokensKeys } ) {
    tokensKeys
        .sort( ( a, b ) => b.length - a.length )
        .forEach( key => {
            const token = tokens[key];
            const re = new RegExp( `:${key}(\\([^)]*\\))?(\\.\\w+)*`, 'g' );
            prefix = prefix.replace( re, ( match, params ) => {
                let ret = token( { method, defaultTokens, params: parseParams( params ) } );
                match.replace( params, '' ).split( '.' ).slice( 1 ).forEach( decorator => {
                    ret = chalk`{${decorator} ${ret}}`;
                } );

                return ret;
            } );
        } );
    return prefix;
}

function selectOutputStream( method, { levels, stdout, stderr } ) {
    return levels[method] <= 2 ? stderr : stdout;
}

module.exports = {
    checkLogLevel,
    parseParams,
    generateConfig,
    generatePrefix,
    selectOutputStream,
};