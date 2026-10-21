import path from 'path';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { gunzipSync, gzipSync } from 'node:zlib';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(async ({ mode, command }) => {
  const env = loadEnv(mode, '.', '');
  // Compress models at build time while preserving the names used by the game.
  const modelFiles: { fileName: string; source: Buffer }[] = [];
  const modelUrls: Record<string, string> = {};
  if (command === 'build') {
    const { pack } = createRequire(import.meta.url)('gltfpack');
    for (const name of ['option8_cathedral', 'pawn_white', 'rook_white', 'knight_white', 'bishop_white', 'queen_white', 'king_white']) {
      const original = Buffer.from(readFileSync(`public/assets/glb/${name}.glb.gz.b64`, 'utf8').trim(), 'base64');
      const input = gunzipSync(original);
      let optimized: Buffer | undefined;
      await pack(['-i', 'input.glb', '-o', 'output.glb', '-cc', '-kn', '-km', '-ke',
        '-vpf', '-vp', '16', '-vt', '16', '-vn', '12', '-at', '24', '-ar', '16', '-as', '24', '-af', '24', '-ac'], {
        read: () => input,
        write: (_path: string, bytes: Uint8Array) => { optimized = Buffer.from(bytes); },
      });
      if (!optimized) throw new Error(`No compressed model produced for ${name}`);
      const readJson = (glb: Buffer) => JSON.parse(glb.subarray(20, 20 + glb.readUInt32LE(12)).toString('utf8'));
      const sourceJson = readJson(input);
      const outputJson = readJson(optimized);
      // Runtime shaders and animation selection rely on these names.
      for (const key of ['nodes', 'materials', 'animations']) {
        const outputNames = new Set((outputJson[key] || []).map((item: { name?: string }) => item.name));
        for (const item of sourceJson[key] || []) {
          if (item.name && !outputNames.has(item.name)) throw new Error(`Missing ${key} name ${item.name} in ${name}`);
        }
      }
      const gzip = gzipSync(optimized, { level: 9 });
      console.log(`Model transfer ${name}: ${original.length} -> ${gzip.length} bytes`);
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
