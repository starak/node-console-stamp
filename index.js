const { checkLogLevel, generateConfig, generatePrefix, selectOutputStream, FakeStream } = require( './lib/utils.js' );
module.exports = consoleStamp = ( con, options = {} ) => {

    if ( con.__patched ) {
        con.reset();
    }

    const isCustom = con !== console;
    const customConsoleStream = new FakeStream();
    const customConsole = new console.Console( customConsoleStream, customConsoleStream );

    // Fix the lack of debug alias in pre 8.0 node
    if ( typeof con.debug === "undefined" ) {
        con.debug = ( ...arg ) => con.org.log ? con.org.log( ...arg ) : con.log( ...arg );
    }

    const config = generateConfig( options );
    const include = config.include.filter( m => typeof con[m] === 'function' );

    const helperConsole = new console.Console( config.stdout, config.stderr );
    const org = {};
    Object.keys( con ).forEach( m => org[m] = con[m] );
    con.org = org;

    include.forEach( method => {
        const stream = selectOutputStream( method, config );
        const trg = con[method];

        con[method] = new Proxy( trg, {
            apply: ( target, context, arguments ) => {
                if ( checkLogLevel( config, method ) ) {
                    customConsole.log.apply( context, arguments );
                    stream.write( `${generatePrefix( method, config, customConsoleStream.last_msg )} ` );
                    if ( config.preventDefaultMessage || /:msg\b/.test( config.format ) ) {
                        stream.write('\n');
                    }else if(method === 'table'){
                        stream.write('\n');
                        // Normaly table calls log to write to stream, so we need to prevent double prefix
                        helperConsole.table.apply( context, arguments);
                    }else if( !isCustom && options.stdout){
                        stream.write(`${customConsoleStream.last_msg}\n`);
                    } else {
                        target.apply( context, arguments );
                    }
                }
            }
        } );

        con.__patched = true
    } );

    if(!include.includes('table')) {
        // Normaly table calls log to write to stream, we need to prevent prefix when table is not included
        con.table = helperConsole.table;
    }

    con.reset = () => {
        Object.keys( con.org ).forEach( m => {
            con[m] = con.org[m];
            delete con.org[m];
        } );
        delete con.org;
        delete con.__patched;
        delete con.reset;
        customConsoleStream.end();
    };

};
