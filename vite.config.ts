// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Deploy target: Vercel.
// - `cloudflare: false` disables @cloudflare/vite-plugin during build so the
//   server environment emits a portable Node SSR bundle at dist/server/server.js
//   instead of a Cloudflare Worker.
// - The TanStack Start server entry still points to src/server.ts (our SSR
//   error wrapper), which exports a Web-standard `{ fetch }` handler that we
//   wrap from api/index.ts as a Vercel serverless function.
export default defineConfig({
  cloudflare: false,
  tanstackStart: {
    server: { entry: "server" },
  },
});
