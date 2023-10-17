// noinspection JSUnresolvedReference

const label = require('../tokens/label.js');
const dformat = require('dateformat');
const date = require('../tokens/date.js');

describe('Tokens', () => {
    describe('label.js', () => {
        it('label', () => {
            expect(label).toBeTruthy();
            expect(label({ method: 'log', params: [7] })).toBe('[LOG]  ');
            expect(label({ method: 'info', params: [7] })).toBe('[INFO] ');
            expect(label({ method: 'debug', params: [7] })).toBe('[DEBUG]');
            expect(label({ method: 'error', params: [-5] })).toBe('[ERROR]');
            expect(label({ method: 'error', params: [] })).toBe('[ERROR]');
        });
    });

    describe('date.js', () => {
        it('date', () => {
            const now = new Date();
            const format = 'dd.mm.yyyy HH:MM:ss.l';
            expect(date({ params: [format, false, now] })).toBe(`[${dformat(now, format)}]`);
            expect(date({ params: [format, true, now] })).toBe(`[${dformat(now, format, true)}]`);
        });
    });
});
