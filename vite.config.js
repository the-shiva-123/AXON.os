import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import {
  generateAgentCollectiveService,
  chatWithAgentService,
  simulateCollectiveExecutionService,
} from './src/server/geminiService.js';

function apiPlugin() {
  return {
    name: 'axon-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        const url = req.url.split('?')[0];

        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk.toString();
          });

          req.on('end', async () => {
            try {
              const data = body ? JSON.parse(body) : {};

              if (url === '/api/generate-collective') {
                const result = await generateAgentCollectiveService(data);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(result));
                return;
              }

              if (url === '/api/agent-chat') {
                const reply = await chatWithAgentService(data);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ reply }));
                return;
              }

              if (url === '/api/simulate-collective') {
                const steps = await simulateCollectiveExecutionService(data);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ steps }));
                return;
              }

              res.statusCode = 404;
              res.end(JSON.stringify({ error: 'Endpoint not found' }));
            } catch (err) {
              console.error('API plugin error:', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err?.message || 'Server error' }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
