import fs from 'node:fs';
import path from 'path';
import checker from 'vite-plugin-checker';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react-swc';

import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

// ----------------------------------------------------------------------

const PORT = 8080;

const zodPath = path.dirname(require.resolve('zod/package.json'));

/**
 * Plugin para renomear os arquivos HTML de entrada segregados para index.html na raiz do outDir.
 */
function renameIndexHtmlPlugin(htmlFileName?: string): Plugin {
  return {
    name: 'rename-index-html-plugin',
    closeBundle() {
      if (!htmlFileName || htmlFileName === 'index.html') return;
      const targetDir = htmlFileName.includes('desktop') ? 'dist-desktop' : 'dist-web';
      const srcPath = path.resolve(process.cwd(), targetDir, htmlFileName);
      const destPath = path.resolve(process.cwd(), targetDir, 'index.html');
      if (fs.existsSync(srcPath)) {
        fs.renameSync(srcPath, destPath);
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const isWeb = mode === 'web';
  const isDesktop = mode === 'desktop';

  const outDir = isDesktop ? 'dist-desktop' : isWeb ? 'dist-web' : 'dist';
  const htmlInput = isDesktop ? 'index-desktop.html' : isWeb ? 'index-web.html' : 'index.html';

  return {
    plugins: [
      react(),
      renameIndexHtmlPlugin(isDesktop ? 'index-desktop.html' : isWeb ? 'index-web.html' : undefined),
      checker({
        typescript: true,
        eslint: {
          useFlatConfig: true,
          lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
          dev: { logLevel: ['error'] },
        },
        overlay: {
          position: 'tl',
          initialIsOpen: false,
        },
        enableBuild: false,
      }),
    ],
    resolve: {
      alias: [
        {
          find: 'zod',
          replacement: zodPath,
        },
        {
          find: /^src(.+)/,
          replacement: path.resolve(process.cwd(), 'src/$1'),
        },
      ],
    },
    server: {
      port: PORT,
      host: true,
      proxy: {
        '/api': {
          target: 'http://localhost:8787',
          changeOrigin: true,
        }
      }
    },
    preview: { port: PORT, host: true },
    build: {
      outDir,
      emptyOutDir: true,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        input: htmlInput,
        output: {
          manualChunks: undefined,
        },
      },
    },
  };
});
