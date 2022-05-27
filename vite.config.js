import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import metaversefilePlugin from 'metaversefile/plugins/rollup.js';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [metaversefilePlugin(), reactRefresh()],
  optimizeDeps: {
    entries: [
      'src/*.js',
      'src/*.jsx',
      'api/*.js',
      'src/editor/*.js',
      'src/editor/*.jsx',
      'src/ui/*.js',
      'src/ui/*.jsx',
      '*.js',
      '*.jsx'
    ]
  },
  server: {
    fs: {
      strict: true
    }
  }
});
