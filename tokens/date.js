const dateformat = require( 'dateformat' );
// noinspection JSUnusedLocalSymbols
module.exports = ( { params: [format, utc = false, date = new Date] } ) => {
    return `[${dateformat( date, format, utc )}]`;
}