import path from 'path';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, '.', '');
  // Decode base64 at build time; browsers download the original compressed bytes.
  const modelFiles: { fileName: string; source: Buffer }[] = [];
  const modelUrls: Record<string, string> = {};
  if (command === 'build') {
    for (const name of ['option8_cathedral', 'pawn_white', 'rook_white', 'knight_white', 'bishop_white', 'queen_white', 'king_white']) {
      const gzip = Buffer.from(readFileSync(`public/assets/glb/${name}.glb.gz.b64`, 'utf8').trim(), 'base64');
      const hash = createHash('sha256').update(gzip).digest('hex').slice(0, 12);
      const fileName = `assets/models/${name}-${hash}.bin`;
      modelFiles.push({ fileName, source: gzip });
      modelUrls[name] = `./${fileName}`;
    }
  }
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react(), {
      name: 'compressed-model-downloads',
      apply: 'build',
      generateBundle() {
        for (const model of modelFiles) this.emitFile({ type: 'asset', ...model });
      },
    }],
    define: {
      '__MODEL_GZIP_URLS__': JSON.stringify(modelUrls),
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
