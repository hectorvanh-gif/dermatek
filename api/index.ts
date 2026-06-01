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

import type { IncomingMessage, ServerResponse } from "http";

// @ts-expect-error — resolved at runtime from the build output, not present in source.
import handler from "../dist/server/server.js";

export const config = { runtime: "nodejs" };

export default async function vercelHandler(req: IncomingMessage, res: ServerResponse) {
  const host = (req.headers["host"] as string) ?? "localhost";
  const proto = (req.headers["x-forwarded-proto"] as string) ?? "https";
  const url = new URL(req.url ?? "/", `${proto}://${host}`);

  const webRequest = new Request(url.toString(), {
    method: req.method ?? "GET",
    headers: req.headers as HeadersInit,
    body: ["GET", "HEAD"].includes(req.method ?? "GET") ? undefined : (req as unknown as BodyInit),
    duplex: "half",
  } as RequestInit);

  const response = await (handler as { fetch: (req: Request, env: unknown, ctx: unknown) => Promise<Response> }).fetch(webRequest, {}, {});

  res.statusCode = response.status;
  response.headers.forEach((value: string, key: string) => {
    res.setHeader(key, value);
  });

  if (response.body) {
    const reader = response.body.getReader();
    const pump = async () => {
      const { done, value } = await reader.read();
      if (done) { res.end(); return; }
      res.write(value);
      await pump();
    };
    await pump();
  } else {
    res.end();
  }
}