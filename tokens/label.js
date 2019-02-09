function padRight ( str, len = 0 ) {
    return str + new Array( Math.max( len - str.length, 0 ) ).fill( ' ' ).join( '' );
}

function label( { method, params: [len] } ) {
    return padRight( `[${method.toUpperCase()}]`, len );
}

module.exports = {
    padRight,
    label
};