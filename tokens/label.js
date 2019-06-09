function padRight ( str, len = 0 ) {
    return str + ' '.repeat( Math.max( len - str.length, 0 ) );
}

function label( { method, params: [len] } ) {
    return padRight( `[${method.toUpperCase()}]`, len );
}

module.exports = {
    padRight,
    label
};