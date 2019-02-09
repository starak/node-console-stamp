const dateformat = require( 'dateformat' );
module.exports = ( { method, params: [format, utc = false] } ) => dateformat( new Date(), format, utc );