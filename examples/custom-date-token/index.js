import consoleStamp from '../../dist/index.js';

consoleStamp(console, {
    format: ':mydate() :label(7)',
    tokens: {
        mydate: () => {
            const formatter = new Intl.DateTimeFormat('no-NB', {
                dateStyle: 'long',
                timeStyle: 'medium',
            });
            return `[${formatter.format(new Date())}]`;
        },
    },
});

console.debug('This is a console.debug message');
console.log('This is a console.log message');
console.info('This is a console.info message');
console.warn('This is a console.warn message');
console.error('This is a console.error message');
console.reset();
