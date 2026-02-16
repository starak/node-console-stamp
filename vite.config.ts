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
            formats: ['es', 'cjs'],
            fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
        },
        rollupOptions: {
            external: ['chalk', 'chalk-template', 'dateformat', 'stream'],
            output: {
                exports: 'named',
            },
        },
        target: 'node18',
        minify: false,
    },
});
