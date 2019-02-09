const date = require('../tokens/date.js');
const {label} = require('../tokens/label.js');

module.exports = {
    pattern: '',
    dfPattern: '[:date($$)] :label(7)',
    dfDateFormat: 'dd.mm.yyyy HH:MM.ss.l',
    include: ["debug", "log", "info", "warn", "error"],
    tokens: {
        label,
        date,
    },
    level: "log",
    levels: {
        error: 1,
        warn: 2,
        info: 3,
        log: 4,
        debug: 4,
    },
    extend: {},
    groupCount: 0
};