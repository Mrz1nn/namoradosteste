import type { SiteContent } from "../content/defaultContent";
import { normalizeContent } from "../content/defaultContent";

export interface SiteRecord {
  slug: string;
  name1: string;
  name2: string;
  content: SiteContent;
  createdAt?: number;
  updatedAt?: number;
}

/** Resumo usado na listagem do admin (sem o conteúdo completo). */
export interface SiteSummary {
  slug: string;
  name1: string;
  name2: string;
  createdAt?: number;
  updatedAt?: number;
}

// Em desenvolvimento (vite dev) as funções serverless não existem, então
// usamos um "banco de mentira" no localStorage para conseguir testar tudo.
const DEV = import.meta.env.DEV;
const DEV_DB_KEY = "dev-sites-db";
// Senha de admin para o modo de desenvolvimento local.
export const DEV_ADMIN_PASSWORD = "admin";

// ----------------------------- Modo DEV -----------------------------

function devReadAll(): Record<string, SiteRecord> {
  try {
    return JSON.parse(localStorage.getItem(DEV_DB_KEY) || "{}");
  } catch {
    return {};
  }
}

function devWriteAll(db: Record<string, SiteRecord>) {
  localStorage.setItem(DEV_DB_KEY, JSON.stringify(db));
}

// --------------------------- API pública ---------------------------

export async function getSite(slug: string): Promise<SiteRecord | null> {
  if (DEV) {
    const rec = devReadAll()[slug];
    if (!rec) return null;
    return { ...rec, content: normalizeContent(rec.content) };
  }

  const res = await fetch(`/api/sites/${encodeURIComponent(slug)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Erro ao carregar o site.");
  const rec = (await res.json()) as SiteRecord;
  return { ...rec, content: normalizeContent(rec.content) };
}

export async function saveSite(
  record: SiteRecord,
  password: string
): Promise<SiteRecord> {
  if (DEV) {
    if (password !== DEV_ADMIN_PASSWORD) throw new Error("Senha incorreta.");
    const db = devReadAll();
    const now = Date.now();
    const saved: SiteRecord = {
      ...record,
      createdAt: db[record.slug]?.createdAt ?? now,
      updatedAt: now,
    };
    db[record.slug] = saved;
    devWriteAll(db);
    return saved;
  }

  const res = await fetch(`/api/sites/${encodeURIComponent(record.slug)}`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      "x-admin-password": password,
    },
    body: JSON.stringify(record),
  });
  if (res.status === 401) throw new Error("Senha de administrador incorreta.");
  if (!res.ok) throw new Error("Erro ao salvar o site.");
  return (await res.json()) as SiteRecord;
}

export async function listSites(password: string): Promise<SiteSummary[]> {
  if (DEV) {
    if (password !== DEV_ADMIN_PASSWORD) throw new Error("Senha incorreta.");
    return Object.values(devReadAll())
      .map(({ slug, name1, name2, createdAt, updatedAt }) => ({
        slug,
        name1,
        name2,
        createdAt,
        updatedAt,
      }))
      .sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
  }

  const res = await fetch("/api/sites", {
    headers: { "x-admin-password": password },
  });
  if (res.status === 401) throw new Error("Senha de administrador incorreta.");
  if (!res.ok) throw new Error("Erro ao listar os sites.");
  return (await res.json()) as SiteSummary[];
}

export async function deleteSite(
  slug: string,
  password: string
): Promise<void> {
  if (DEV) {
    if (password !== DEV_ADMIN_PASSWORD) throw new Error("Senha incorreta.");
    const db = devReadAll();
    delete db[slug];
    devWriteAll(db);
    return;
  }

  const res = await fetch(`/api/sites/${encodeURIComponent(slug)}`, {
    method: "DELETE",
    headers: { "x-admin-password": password },
  });
  if (res.status === 401) throw new Error("Senha de administrador incorreta.");
  if (!res.ok) throw new Error("Erro ao excluir o site.");
}

// --------------------------- Upload de fotos ---------------------------

/**
 * Envia uma imagem já processada (blob) e devolve a URL pública para usar
 * em `memory.src`. Em desenvolvimento, devolve um data URL (sem backend).
 */
export async function uploadImage(
  blob: Blob,
  filename: string,
  slug: string,
  password: string,
  dataUrlFallback: string
): Promise<string> {
  if (DEV) {
    // Sem backend local: usa a própria imagem embutida (data URL).
    return dataUrlFallback;
  }

  const res = await fetch(
    `/api/upload?slug=${encodeURIComponent(slug)}&filename=${encodeURIComponent(
      filename
    )}`,
    {
      method: "POST",
      headers: {
        "content-type": blob.type || "application/octet-stream",
        "x-admin-password": password,
      },
      body: blob,
    }
  );
  if (res.status === 401) throw new Error("Senha de administrador incorreta.");
  if (!res.ok) {
    const msg = await res.json().catch(() => null);
    throw new Error(msg?.error || "Erro ao enviar a imagem.");
  }
  const { url } = (await res.json()) as { url: string };
  return url;
}

// --------------------- Sessão do administrador ---------------------
// A senha fica guardada apenas na sessão da aba (some ao fechar).
const ADMIN_SESSION_KEY = "admin-pass";

export function getAdminPassword(): string {
  try {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) || "";
  } catch {
    return "";
  }
}

export function setAdminPassword(password: string) {
  try {
    sessionStorage.setItem(ADMIN_SESSION_KEY, password);
  } catch {
    /* ignore */
  }
}

export function clearAdminPassword() {
  try {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  } catch {
    /* ignore */
  }
}

/** Verifica a senha de admin (faz uma chamada à listagem). */
export async function checkAdminPassword(password: string): Promise<boolean> {
  try {
    await listSites(password);
    return true;
  } catch {
    return false;
  }
}
