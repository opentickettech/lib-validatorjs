import { defineConfig } from 'vite'
import { resolve } from 'path';

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/validator.js'),
            name: 'OtValidatorJs',
            fileName: 'ot-validatorjs',
            formats: ['cjs']
        },
        outDir: 'lib',
        rollupOptions: {
            output: {
                sourcemapExcludeSources: true,
            },
        },
        sourcemap: true,
        target: 'es2020',
        minify: false,
        commonjsOptions: {
            include: [/src/],
        },
    },
});