import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
});

function isAuthed(req) {
  const pass = req.headers["x-admin-password"];
  return Boolean(process.env.ADMIN_PASSWORD) && pass === process.env.ADMIN_PASSWORD;
}

export default async function handler(req, res) {
  const slug = String(req.query.slug || "").toLowerCase();
  if (!slug) return res.status(400).json({ error: "slug ausente" });

  const key = `site:${slug}`;

  // ---- Leitura pública ----
  if (req.method === "GET") {
    const data = await redis.get(key);
    if (!data) return res.status(404).json({ error: "não encontrado" });
    return res.status(200).json(data);
  }

  // ---- Escrita (somente admin) ----
  if (req.method === "PUT" || req.method === "POST") {
    if (!isAuthed(req)) return res.status(401).json({ error: "não autorizado" });

    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({ error: "json inválido" });
      }
    }
    if (!body || typeof body !== "object") {
      return res.status(400).json({ error: "corpo inválido" });
    }

    const existing = await redis.get(key);
    const record = {
      ...body,
      slug,
      createdAt: existing?.createdAt || Date.now(),
      updatedAt: Date.now(),
    };

    await redis.set(key, record);
    await redis.sadd("sites", slug);
    return res.status(200).json(record);
  }

  // ---- Exclusão (somente admin) ----
  if (req.method === "DELETE") {
    if (!isAuthed(req)) return res.status(401).json({ error: "não autorizado" });
    await redis.del(key);
    await redis.srem("sites", slug);
    return res.status(200).json({ ok: true });
  }

  res.setHeader("Allow", "GET, PUT, POST, DELETE");
  return res.status(405).json({ error: "método não permitido" });
}
