module.exports = ( { method, params: [len] } ) => {
    return `[${method.toUpperCase()}]`.padEnd(len);
}