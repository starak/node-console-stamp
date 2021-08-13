const date = require( '../tokens/date' );
const label = require( '../tokens/label' );
const msg = require( '../tokens/msg' );

module.exports = {
    format: '',
    dfFormat: ':date($$) :label(7)',
    dfDateFormat: 'dd.mm.yyyy HH:MM.ss.l',
    include: ['debug', 'log', 'info', 'warn', 'error'],
    tokens: {
        date,
        label,
        msg
    },
    level: 'log',
    levels: {
        error: 1,
        warn: 2,
        info: 3,
        log: 4,
        debug: 4,
    },
    extend: {},
    groupCount: 0,
    preventDefaultMessage: false,
};
