import { defineConfig } from 'vite'
import { resolve } from 'path';

export default defineConfig(() => ({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/validator.cjs'),
            name: 'OtValidatorJs',
            fileName: 'ot-validatorjs',
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
    },
    test: {
        coverage: {
            enabled: true,
            reporter: [ 'text', 'json-summary', 'html' ],
            exclude: [ '**/spec/**/*.js' ],
            skipFull: true,
        },
        environment: 'jsdom',
        exclude: [
            '**/node_modules/**',
            resolve('**/lib/**'),
            '**/dist/**',
            '**/cypress/**',
            '**/.{idea,git,cache,output,temp}/**',
            '**/package/**',
            '**/*.helper.spec.ts',
        ],
        outputFile: {
            junit: 'junit/unit.xml',
        },
        reporters: [
            'default',
            'junit',
        ],
    },
}));