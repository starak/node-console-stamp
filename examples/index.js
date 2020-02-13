const { lstatSync, readdirSync } = require( 'fs' );
const { join } = require( 'path' );

const isDirectory = source => lstatSync( source ).isDirectory()
const getDirectories = source =>
    readdirSync( source ).map( name => join( source, name ) ).filter( isDirectory );

getDirectories( __dirname ).map( d => {
    process.stdout.write( `\nLoading ${d.replace( __dirname, '.' )}\n` );
    require( d )
} );