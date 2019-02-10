const { test } = require( 'tap' );
const { label, padRight } = require( '../tokens/label.js' );
const dformat = require( 'dateformat' );
const date = require( '../tokens/date.js' );

test( 'Tokens', t => {
    t.test( 'label.js', t => {

        t.test( 'label', t => {
            t.ok( label, 'should exist' );
            t.equal( label( { method: 'log', params: [7] } ), '[LOG]  ', 'Log should have correct label and padding' );
            t.equal( label( {
                method: 'info',
                params: [7]
            } ), '[INFO] ', 'Info should have correct label and padding' );
            t.equal( label( {
                method: 'debug',
                params: [7]
            } ), '[DEBUG]', 'Debug should have correct label and padding' );
            t.equal( label( {
                method: 'error',
                params: [-5]
            } ), '[ERROR]', 'Error should have correct label and padding' );
            t.equal( label( {
                method: 'error',
                params: []
            } ), '[ERROR]', 'Error should have correct label and padding' );
            t.end();
        } );

        t.test( 'padRight', t => {
            t.ok( padRight, 'Should exist' );
            t.equal( padRight( 'foo', 0 ), 'foo', 'Should have correct padding' );
            t.equal( padRight( 'foo', 3 ), 'foo', 'Should have correct padding' );
            t.equal( padRight( 'foo', 6 ), 'foo   ', 'Should have correct padding' );
            t.equal( padRight( 'foo', -5 ), 'foo', 'Should have correct padding' );
            t.equal( padRight( 'foo' ), 'foo', 'Should have correct padding' );
            t.end();
        } );

        t.end();
    } );
    t.test( 'date.js', t => {
        const now = new Date();
        let format = 'dd.mm.yyyy HH:MM:ss.l';
        t.equal( date( { params: [format, false, now] } ), dformat( now, format ), 'date should be correct' );
        t.equal( date( { params: [format, true, now] } ), dformat( now, format, true ), 'UTC date should be correct' );
        t.end();
    } );
    t.end();
} );