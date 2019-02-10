const dateformat = require( 'dateformat' );
module.exports = ( { method, params: [format, utc = false, date = new Date] } ) => {
    return `[${dateformat( date, format, utc )}]`;
}