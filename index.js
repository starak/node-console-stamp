const { checkLogLevel, generateConfig, generatePrefix, selectOutputStream, FakeStream } = require( './lib/utils.js' );
let consoleStamp = ( con, options = {} ) => {

    if ( con.__patched ) {
        con.reset();
    }

    const helperConsoleStream = new FakeStream();
    const helperConsole = new console.Console( helperConsoleStream, helperConsoleStream );

    const config = generateConfig( options );
    const include = config.include.filter( m => typeof con[m] === 'function' );

    const org = {};
    Object.keys( con ).forEach( m => org[m] = con[m] );
    con.org = org;

    include.forEach( method => {
        const stream = selectOutputStream( method, config );
        const trg = con[method];

        con[method] = new Proxy( trg, {
            apply: ( target, context, args ) => {
                if ( checkLogLevel( config, method ) ) {
                    helperConsole.log.apply( context, args );
                    // TODO: custom msg vs table will not work
                    let outputMessage = `${generatePrefix( method, config, helperConsoleStream.last_msg )} `;
                    if(method === 'table'){
                        outputMessage += '\n';
                        helperConsole.table.apply( context, args);
                        outputMessage += helperConsoleStream.last_msg;
                    }else if(!( config.preventDefaultMessage || /:msg\b/.test( config.format ) )){
                        outputMessage += `${helperConsoleStream.last_msg}`;
                    }
                    outputMessage += '\n';
                    stream.write( outputMessage );
                }
            }
        } );

        con.__patched = true
    } );

    if(!include.includes('table')) {
        // Normaly table calls log to write to stream, we need to prevent prefix when table is not included
        const tableConsole = new console.Console( config.stdout, config.stderr );
        con.table = tableConsole.table;
    }

    con.reset = () => {
        Object.keys( con.org ).forEach( m => {
            con[m] = con.org[m];
            delete con.org[m];
        } );
        delete con.org;
        delete con.__patched;
        delete con.reset;
        helperConsoleStream.end();
    };

};

module.exports = consoleStamp;
module.exports.default = consoleStamp;

