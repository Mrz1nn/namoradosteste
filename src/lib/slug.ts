// Geração do "slug" da URL a partir dos nomes do casal.
// Ex: "João" + "Maria"  ->  "joaoxmaria"

export function slugifyName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // remove acentos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ""); // só letras e números
}

/** Monta o slug no formato nome1xnome2. Retorna "" se algum nome for vazio. */
export function buildSlug(name1: string, name2: string): string {
  const a = slugifyName(name1);
  const b = slugifyName(name2);
  if (!a || !b) return "";
  return `${a}x${b}`;
}

// Caminhos que NÃO podem ser usados como slug de casal (são rotas do sistema).
const RESERVED = new Set([
  "admin",
  "api",
  "editar",
  "novo",
  "new",
  "assets",
  "images",
  "audio",
  "favicon",
]);

export function isReservedSlug(slug: string): boolean {
  return RESERVED.has(slug);
}
