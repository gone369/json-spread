import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    minify: false,
    lib: {
      entry: 'src/index.js',
      name: 'jsonSpread',
      formats: ['cjs', 'es', 'umd'],
      fileName: (format) => {
        const entryName = 'jsonSpread';
        // You can customize the file name based on the format and entry name
        if (format === 'cjs') {
          return `${entryName}.cjs`;
        } else if (format === 'es') {
          return `${entryName}.js`;
        } else {
          // Fall back to a default naming convention if needed
          return `${entryName}.${format}.js`;
        }
      },
    },
    esbuild: { legalComments: 'inline' },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
    },
  },
});
