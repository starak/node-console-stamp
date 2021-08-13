const dateformat = require( 'dateformat' );
module.exports = ( { params: [format, utc = false, date = new Date] } ) => {
    return `[${dateformat( date, format, utc )}]`;
}