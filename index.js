const { checkLogLevel, generateConfig, generatePrefix, selectOutputStream } = require( './lib/utils.js' );

module.exports = consoleStamp = ( con, options = {} ) => {

    if(con.__patched){
        con.reset();
    }

    // Fix the lack of debug alias in pre 8.0 node
    if(typeof con.debug === "undefined"){
        con.debug = (...arg) => con.org.log ? con.org.log(...arg) : con.log(...arg);
    }

    const config = generateConfig( options );
    const include = config.include.filter(m => typeof con[m] === 'function');

    const org = {};
    Object.keys(con).forEach(m => org[m] = con[m]);
    con.org = org;

    include.forEach( method => {
        const stream = selectOutputStream(method, config);
        const trg = con[method];

        con[method] = new Proxy( trg, {
            apply: ( target, context, arguments ) => {
                if ( checkLogLevel( config, method ) ) {
                    stream.write( `${generatePrefix(method, config)} ` );
                    target.apply( context, arguments );
                }
            }
        } );

        con.__patched = true
    } );

    con.reset = () => {
        Object.keys( con.org ).forEach( m => {
            con[m] = con.org[m];
            delete con.org[m];
        } );
        delete con.__patched;
        delete con.reset;
    };

};
