import path from 'path';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, '.', '');
  // Transfer the cathedral in small binary parts; preserve the original gzip bytes.
  const cathedralParts: { fileName: string; source: Buffer }[] = [];
  if (command === 'build') {
    const gzip = Buffer.from(readFileSync('public/assets/glb/option8_cathedral.glb.gz.b64', 'utf8').trim(), 'base64');
    const hash = createHash('sha256').update(gzip).digest('hex').slice(0, 12);
    const partSize = 256 * 1024;
    for (let offset = 0; offset < gzip.length; offset += partSize) {
      cathedralParts.push({
        fileName: `assets/glb/cathedral-${hash}-${cathedralParts.length}.bin`,
        source: gzip.subarray(offset, offset + partSize),
      });
    }
  }
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react(), {
      name: 'cathedral-download-parts',
      apply: 'build',
      generateBundle() {
        for (const part of cathedralParts) this.emitFile({ type: 'asset', ...part });
      },
    }],
    define: {
      '__CATHEDRAL_GZIP_PARTS__': JSON.stringify(cathedralParts.map((part) => `./${part.fileName}`)),
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve('./src'),
      },
    },
  };
});
