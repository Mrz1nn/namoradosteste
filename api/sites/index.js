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
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "método não permitido" });
  }

  // A listagem é restrita ao administrador.
  if (!isAuthed(req)) return res.status(401).json({ error: "não autorizado" });

  const slugs = await redis.smembers("sites");
  const summaries = [];

  for (const slug of slugs) {
    const data = await redis.get(`site:${slug}`);
    if (data) {
      summaries.push({
        slug,
        name1: data.name1 || "",
        name2: data.name2 || "",
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    }
  }

  summaries.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  return res.status(200).json(summaries);
}
