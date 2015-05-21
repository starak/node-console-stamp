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

module.exports = function ( con, pattern, prefix_metadata, excluded_methods ) {

    "use strict";

    if ( con.__ts__ ) {
        return;
    }

    if ( typeof prefix_metadata === 'object' ) {
        var util = require('util');
    }

    var original_functions = [];

    var slice = Array.prototype.slice;

    var all_methods = ['log', 'info', 'warn', 'error', 'dir', 'assert'];
    excluded_methods = excluded_methods || [];
    var methods_to_change = all_methods.filter(function(i) {return excluded_methods.indexOf(i) < 0;});

    methods_to_change.forEach( function ( f ) {

        original_functions.push( [ f, con[f] ] );

        var org = con[f];

        con[f] = function () {

            var prefix = "[" + dateFormat( pattern ) + "] [" + f.toUpperCase() + "] ",
                  args = slice.call( arguments );

            if ( typeof prefix_metadata === 'function' ) {
                prefix = prefix + prefix_metadata( f, args ) + ' ';
            } else if ( typeof prefix_metadata === 'object' ) {
                prefix = prefix + util.inspect( prefix_metadata ) + ' ';
            } else if ( typeof prefix_metadata !== 'undefined' ) {
                prefix = prefix + prefix_metadata + ' ';
            }

            if ( f === "error" || f === "warn" || ( f === "assert" && !args[0] ) ) {
                process.stderr.write( prefix );
            } else if ( f !== "assert" ) {
                process.stdout.write( prefix );
            }

            return org.apply( con, args );

        };
    } );

    con.restoreConsole = function () {
        original_functions.forEach( function ( pair ) {
            con[pair[0]] = pair[1];
            delete con.__ts__;
        } );
        delete con.restoreConsole;
    };

    con.__ts__ = true;

};
