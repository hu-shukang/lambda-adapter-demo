// vite.config.ts
import { vitePlugin as remix } from "file:///Users/hushukang/workspaces/React/lambda-adapter-demo/node_modules/@remix-run/dev/dist/index.js";
import { defineConfig } from "file:///Users/hushukang/workspaces/React/lambda-adapter-demo/node_modules/vite/dist/node/index.js";
import tsconfigPaths from "file:///Users/hushukang/workspaces/React/lambda-adapter-demo/node_modules/vite-tsconfig-paths/dist/index.mjs";
import tailwindcss from "file:///Users/hushukang/workspaces/React/lambda-adapter-demo/node_modules/tailwindcss/lib/index.js";
import autoprefixer from "file:///Users/hushukang/workspaces/React/lambda-adapter-demo/node_modules/autoprefixer/lib/autoprefixer.js";
var vite_config_default = defineConfig({
  plugins: [
    remix({
      future: {
        unstable_singleFetch: true
      }
      // ignoredRouteFiles: ['"**/*.{css,js,png,jpg,jpeg,gif,svg,webp,ico,woff,woff2,ttf,eot,json}"'],
    }),
    tsconfigPaths()
  ],
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvaHVzaHVrYW5nL3dvcmtzcGFjZXMvUmVhY3QvbGFtYmRhLWFkYXB0ZXItZGVtb1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2h1c2h1a2FuZy93b3Jrc3BhY2VzL1JlYWN0L2xhbWJkYS1hZGFwdGVyLWRlbW8vdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2h1c2h1a2FuZy93b3Jrc3BhY2VzL1JlYWN0L2xhbWJkYS1hZGFwdGVyLWRlbW8vdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyB2aXRlUGx1Z2luIGFzIHJlbWl4IH0gZnJvbSAnQHJlbWl4LXJ1bi9kZXYnO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tICd2aXRlLXRzY29uZmlnLXBhdGhzJztcbmltcG9ydCB0YWlsd2luZGNzcyBmcm9tICd0YWlsd2luZGNzcyc7XG5pbXBvcnQgYXV0b3ByZWZpeGVyIGZyb20gJ2F1dG9wcmVmaXhlcic7XG5cbmRlY2xhcmUgbW9kdWxlICdAcmVtaXgtcnVuL3NlcnZlci1ydW50aW1lJyB7XG4gIGludGVyZmFjZSBGdXR1cmUge1xuICAgIHVuc3RhYmxlX3NpbmdsZUZldGNoOiB0cnVlO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICByZW1peCh7XG4gICAgICBmdXR1cmU6IHtcbiAgICAgICAgdW5zdGFibGVfc2luZ2xlRmV0Y2g6IHRydWUsXG4gICAgICB9LFxuICAgICAgLy8gaWdub3JlZFJvdXRlRmlsZXM6IFsnXCIqKi8qLntjc3MsanMscG5nLGpwZyxqcGVnLGdpZixzdmcsd2VicCxpY28sd29mZix3b2ZmMix0dGYsZW90LGpzb259XCInXSxcbiAgICB9KSxcbiAgICB0c2NvbmZpZ1BhdGhzKCksXG4gIF0sXG4gIGNzczoge1xuICAgIHBvc3Rjc3M6IHtcbiAgICAgIHBsdWdpbnM6IFt0YWlsd2luZGNzcywgYXV0b3ByZWZpeGVyXSxcbiAgICB9LFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWlWLFNBQVMsY0FBYyxhQUFhO0FBQ3JYLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sbUJBQW1CO0FBQzFCLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sa0JBQWtCO0FBUXpCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxNQUNKLFFBQVE7QUFBQSxRQUNOLHNCQUFzQjtBQUFBLE1BQ3hCO0FBQUE7QUFBQSxJQUVGLENBQUM7QUFBQSxJQUNELGNBQWM7QUFBQSxFQUNoQjtBQUFBLEVBQ0EsS0FBSztBQUFBLElBQ0gsU0FBUztBQUFBLE1BQ1AsU0FBUyxDQUFDLGFBQWEsWUFBWTtBQUFBLElBQ3JDO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
