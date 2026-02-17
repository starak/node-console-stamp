import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
    plugins: [
        dts({
            rollupTypes: true,
            outDir: 'dist',
        }),
    ],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'consoleStamp',
        },
        rollupOptions: {
            external: ['chalk', 'chalk-template', 'dateformat', 'stream'],
            output: [
                {
                    format: 'es',
                    entryFileNames: 'index.js',
                    exports: 'named',
                },
                {
                    format: 'cjs',
                    entryFileNames: 'index.cjs',
                    exports: 'named',
                    interop: 'auto',
                    outro: 'module.exports = Object.assign(exports.default, exports);',
                },
            ],
        },
        target: 'node18',
        minify: false,
    },
});
