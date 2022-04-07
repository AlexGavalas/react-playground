import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    root: 'src',
    build: {
        outDir: '../dist',
    },
    esbuild: {
        // eslint-disable-next-line quotes
        jsxInject: `import React from 'react'`,
    },
    server: {
        port: 1234,
        open: true,
    },
});
