import consoleStamp from '../../dist/index.js';
import chalkTemplate from 'chalk-template';

const map = {
    log: 'cyanBright',
    error: 'red',
    info: 'blue',
    warn: 'yellow',
};

consoleStamp(console, {
    format: '(->).yellow :date().gray :label :msg',
    tokens: {
        label: (obj) => {
            const color = map[obj.method] || 'reset';
            const labelText = obj.defaultTokens.label(obj);
            return chalkTemplate`{${color} ${labelText}}`;
        },
        msg: ({ method, msg }) => {
            const color = map[method] || 'reset';
            return chalkTemplate`{${color} ${msg}}`;
        },
    },
});

console.debug('This is a console.debug message');
console.log('This is a console.log message Test (1).csv');
console.info('This is a console.info message');
console.warn('This is a console.warn message');
console.error('This is a console.error message');
console.reset();
