import { describe, it, expect } from 'vitest';
import dateformat from 'dateformat';
import label from '../src/tokens/label.js';
import date from '../src/tokens/date.js';
import type { TokenContext } from '../src/types.js';

// Helper to create a minimal token context
function createContext(overrides: Partial<TokenContext>): TokenContext {
    return {
        method: 'log',
        params: [],
        tokens: {},
        defaultTokens: {},
        msg: '',
        ...overrides,
    };
}

describe('Tokens', () => {
    describe('label.js', () => {
        it('label', () => {
            expect(label).toBeTruthy();
            expect(label(createContext({ method: 'log', params: [7] }))).toBe('[LOG]  ');
            expect(label(createContext({ method: 'info', params: [7] }))).toBe('[INFO] ');
            expect(label(createContext({ method: 'debug', params: [7] }))).toBe('[DEBUG]');
            expect(label(createContext({ method: 'error', params: [-5] }))).toBe('[ERROR]');
            expect(label(createContext({ method: 'error', params: [] }))).toBe('[ERROR]');
        });
    });

    describe('date.js', () => {
        it('date', () => {
            const now = new Date();
            const format = 'dd.mm.yyyy HH:MM:ss.l';
            expect(date(createContext({ params: [format, false, now] }))).toBe(
                `[${dateformat(now, format)}]`
            );
            expect(date(createContext({ params: [format, true, now] }))).toBe(
                `[${dateformat(now, format, true)}]`
            );
        });
    });
});
