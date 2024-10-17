import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
      ignoredRouteFiles:
        process.env.NODE_ENV === 'production'
          ? ['**/*.{css,js,png,jpg,jpeg,gif,svg,webp,ico,woff,woff2,ttf,eot,json}']
          : [],
      manifest: true,
    }),
    tsconfigPaths(),
    visualizer({
      open: process.env.NODE_ENV !== 'production',
    }),
  ],
  // build: {
  //   rollupOptions: {
  //     output: {
  //       manualChunks(id) {
  //         if (id.includes('aws-amplify')) {
  //           return 'cognito';
  //         }
  //       },
  //     },
  //   },
  // },
});
