import { put } from "@vercel/blob";

// Precisamos do corpo bruto (a imagem), então desligamos o parser automático.
export const config = {
  api: { bodyParser: false },
};

function isAuthed(req) {
  const pass = req.headers["x-admin-password"];
  return Boolean(process.env.ADMIN_PASSWORD) && pass === process.env.ADMIN_PASSWORD;
}

async function readRawBody(req) {
  if (Buffer.isBuffer(req.body)) return req.body;
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

function sanitize(name) {
  return (
    String(name || "foto")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9.]+/g, "-")
      .replace(/-+/g, "-")
      .slice(-60) || "foto.jpg"
  );
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "método não permitido" });
  }

  if (!isAuthed(req)) return res.status(401).json({ error: "não autorizado" });

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res
      .status(500)
      .json({ error: "Armazenamento de imagens (Blob) não configurado." });
  }

  const slug = sanitize(req.query.slug || "geral");
  const filename = sanitize(req.query.filename || "foto.jpg");

  try {
    const body = await readRawBody(req);
    if (!body || body.length === 0) {
      return res.status(400).json({ error: "arquivo vazio" });
    }

    const blob = await put(`casais/${slug}/${filename}`, body, {
      access: "public",
      contentType: req.headers["content-type"] || "image/jpeg",
      addRandomSuffix: true,
    });

    return res.status(200).json({ url: blob.url });
  } catch (err) {
    return res
      .status(500)
      .json({ error: err?.message || "Erro ao enviar a imagem." });
  }
}
