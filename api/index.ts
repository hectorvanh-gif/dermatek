// Vercel serverless function entry.
//
// Vercel's Node runtime supports the Web-standard handler signature
// `(request: Request) => Response | Promise<Response>` when the function
// exports a default function that accepts a `Request`. We delegate to the
// TanStack Start SSR handler bundled at dist/server/server.js (built from
// src/server.ts), which itself exports `{ fetch(request, env, ctx) }`.
//
// The `vercel.json` rewrite sends every non-static request to /api, so this
// single function serves the whole app (SSR pages, server functions, and any
// /api/* server routes defined under src/routes/api/).

// @ts-expect-error — resolved at runtime from the build output, not present in source.
import handler from "../dist/server/server.js";

export const config = {
  runtime: "nodejs",
  // Stream the SSR response instead of buffering it.
  supportsResponseStreaming: true,
};

export default async function vercelHandler(request: Request): Promise<Response> {
  return (handler as { fetch: (req: Request, env: unknown, ctx: unknown) => Promise<Response> | Response })
    .fetch(request, {}, {});
}