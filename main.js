/*globals module:false, require:false, process:false*/
/**
 *
 * Node Console stamp by Ståle Raknes
 *
 * Inspired by https://github.com/FGRibreau/node-nice-console
 *
 * Dependencies:
 * dateFormat by felixge, is to be found here: https://github.com/felixge/node-dateformat
 *
 */

var dateFormat = require( "dateformat" );

module.exports = function ( con, pattern ) {

    "use strict";

    if ( con.__ts__ ) {
        return;
    }

    var slice = Array.prototype.slice;

    [ 'log', 'info', 'warn', 'error', 'dir', 'assert' ].forEach( function ( f ) {

        var org = con[ f ];

        con[f] = function () {

            var date = dateFormat( pattern ) + " ",
                args = slice.call( arguments );

            process.stdout.write( date );
            return org.apply( con, args );

        };
    } );

    con.__ts__ = true;

};