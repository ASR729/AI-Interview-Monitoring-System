import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 5180,
        strictPort: true,
        host: true,
        allowedHosts: ['.e2b.app'],
        // Same-origin API access: the browser calls /api on the page's own origin
        // (works for localhost:5180 and the e2b public URL alike) and the dev
        // server forwards it to the backend. Direct absolute backend URLs are not
        // reachable from a remote browser, so the proxy is the default path.
        proxy: {
            '/api': 'http://localhost:3001',
            '/health': 'http://localhost:3001',
            '/ready': 'http://localhost:3001',
        },
    },
});
