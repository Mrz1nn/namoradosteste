import { useEffect, useState } from "react";
import {
  Heart,
  Lock,
  Plus,
  Pencil,
  ExternalLink,
  Trash2,
  LogOut,
  Loader2,
} from "lucide-react";
import { Link, navigate } from "../lib/router";
import { buildSlug, isReservedSlug } from "../lib/slug";
import { defaultContent } from "../content/defaultContent";
import {
  listSites,
  saveSite,
  deleteSite,
  getSite,
  checkAdminPassword,
  getAdminPassword,
  setAdminPassword,
  clearAdminPassword,
  DEV_ADMIN_PASSWORD,
  type SiteSummary,
} from "../lib/store";

const isDev = import.meta.env.DEV;

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

  // Ao abrir, tenta reaproveitar a senha guardada na sessão.
  useEffect(() => {
    const saved = getAdminPassword();
    if (!saved) {
      setChecking(false);
      return;
    }
    checkAdminPassword(saved).then((ok) => {
      setAuthed(ok);
      if (!ok) clearAdminPassword();
      setChecking(false);
    });
  }, []);

  if (checking) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#080607] text-brancoQuente">
        <Loader2 className="w-6 h-6 animate-spin text-rosa" />
      </div>
    );
  }

  return authed ? (
    <Dashboard onLogout={() => setAuthed(false)} />
  ) : (
    <Login onSuccess={() => setAuthed(true)} />
  );
}

// ------------------------------ Login ------------------------------

function Login({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const ok = await checkAdminPassword(password);
    setLoading(false);
    if (ok) {
      setAdminPassword(password);
      onSuccess();
    } else {
      setError("Senha incorreta.");
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-background text-brancoQuente px-6 overflow-hidden">
      <div className="noise-overlay" />
      <div className="absolute inset-0 radial-glow-vinho opacity-60 pointer-events-none" />

      <form
        onSubmit={submit}
        className="relative z-10 w-full max-w-sm glass-card rounded-3xl border border-white/10 p-8 shadow-[0_20px_50px_rgba(8,6,7,0.7)]"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-vinho border border-rosa/30 flex items-center justify-center mb-4">
            <Lock className="w-5 h-5 text-rosa" />
          </div>
          <h1 className="text-2xl font-title font-light text-dourado">
            Área do criador
          </h1>
          <p className="text-xs text-brancoQuente/50 mt-2">
            Digite a senha de administrador para gerenciar os sites.
          </p>
        </div>

        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-center focus:outline-none focus:border-dourado/50 mb-4"
        />

        {error && <p className="text-xs text-rosa text-center mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading || !password}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 bg-vinho border border-rosa/40 text-sm font-medium hover:border-dourado/60 transition disabled:opacity-40"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Entrar"}
        </button>

        {isDev && (
          <p className="text-[11px] text-brancoQuente/30 text-center mt-5">
            Modo de teste local: a senha é{" "}
            <span className="font-mono text-dourado/60">{DEV_ADMIN_PASSWORD}</span>
          </p>
        )}

        <Link
          to="/"
          className="block text-center text-xs text-brancoQuente/40 hover:text-brancoQuente mt-6 transition"
        >
          ← Voltar ao início
        </Link>
      </form>
    </main>
  );
}

// ---------------------------- Dashboard ----------------------------

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [sites, setSites] = useState<SiteSummary[] | null>(null);
  const [error, setError] = useState("");
  const password = getAdminPassword();

  const refresh = () => {
    listSites(password)
      .then(setSites)
      .catch((e) => setError(String(e?.message || e)));
  };

  useEffect(refresh, []);

  const logout = () => {
    clearAdminPassword();
    onLogout();
  };

  const handleDelete = async (slug: string) => {
    if (!window.confirm(`Excluir o site /${slug}? Esta ação não pode ser desfeita.`))
      return;
    try {
      await deleteSite(slug, password);
      refresh();
    } catch (e) {
      window.alert(String((e as Error)?.message || e));
    }
  };

  return (
    <main className="relative min-h-screen bg-background text-brancoQuente overflow-x-hidden pb-24">
      <div className="noise-overlay" />
      <div className="absolute top-0 inset-x-0 h-[35vh] radial-glow-vinho opacity-50 pointer-events-none" />

      <header className="sticky top-0 z-30 backdrop-blur-md bg-background/80 border-b border-white/10">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl py-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-sm font-title text-dourado">
            <Heart className="w-4 h-4 fill-rosa/20 stroke-rosa" /> Painel do criador
          </span>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 text-xs text-brancoQuente/60 hover:text-rosa transition"
          >
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-6 max-w-4xl relative z-10 pt-10 space-y-8">
        <CreateCard existing={sites ?? []} password={password} />

        <section>
          <h2 className="text-lg font-title text-brancoQuente/80 mb-4">
            Sites criados
          </h2>

          {error && (
            <p className="text-sm text-rosa bg-rosa/10 border border-rosa/20 rounded-xl p-4">
              {error}
            </p>
          )}

          {!error && sites === null && (
            <div className="flex items-center gap-2 text-brancoQuente/40 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" /> Carregando…
            </div>
          )}

          {sites && sites.length === 0 && (
            <p className="text-sm text-brancoQuente/40 border border-dashed border-white/10 rounded-2xl p-8 text-center">
              Nenhum site criado ainda. Crie o primeiro acima. 💕
            </p>
          )}

          <div className="space-y-3">
            {sites?.map((s) => (
              <div
                key={s.slug}
                className="glass-card rounded-2xl border border-white/10 p-4 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">
                    {s.name1} <span className="text-rosa">&</span> {s.name2}
                  </p>
                  <p className="text-[11px] font-mono text-dourado/60 truncate">
                    /{s.slug}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Link
                    to={`/${s.slug}`}
                    title="Ver site"
                    ariaLabel={`Ver site de ${s.name1} e ${s.name2}`}
                    className="p-2 rounded-lg text-brancoQuente/60 hover:text-dourado hover:bg-white/5 transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <Link
                    to={`/${s.slug}/editar`}
                    title="Editar"
                    ariaLabel={`Editar site de ${s.name1} e ${s.name2}`}
                    className="p-2 rounded-lg text-brancoQuente/60 hover:text-dourado hover:bg-white/5 transition"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(s.slug)}
                    title="Excluir"
                    aria-label={`Excluir site de ${s.name1} e ${s.name2}`}
                    className="p-2 rounded-lg text-rosa/60 hover:text-rosa hover:bg-rosa/10 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

// ------------------------- Criar novo casal -------------------------

function CreateCard({
  existing,
  password,
}: {
  existing: SiteSummary[];
  password: string;
}) {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const slug = buildSlug(name1, name2);

  const create = async () => {
    setError("");
    if (!slug) {
      setError("Preencha os dois nomes.");
      return;
    }
    if (isReservedSlug(slug)) {
      setError("Esses nomes geram um endereço reservado. Tente outros.");
      return;
    }
    if (existing.some((s) => s.slug === slug)) {
      setError(`Já existe um site em /${slug}.`);
      return;
    }

    setLoading(true);
    try {
      // Garante que não exista no banco (caso a listagem esteja desatualizada).
      const already = await getSite(slug);
      if (already) {
        setError(`Já existe um site em /${slug}.`);
        setLoading(false);
        return;
      }

      const content = structuredClone(defaultContent);
      content.general.name1 = name1.trim();
      content.general.name2 = name2.trim();

      await saveSite(
        { slug, name1: name1.trim(), name2: name2.trim(), content },
        password
      );
      navigate(`/${slug}/editar`);
    } catch (e) {
      setError(String((e as Error)?.message || e));
      setLoading(false);
    }
  };

  return (
    <section className="glass-card rounded-3xl border border-white/10 p-6 md:p-8">
      <h2 className="text-xl font-title font-light text-dourado mb-1">
        Criar novo site
      </h2>
      <p className="text-xs text-brancoQuente/50 mb-6">
        Digite os nomes do casal. O endereço é gerado automaticamente.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          value={name1}
          onChange={(e) => setName1(e.target.value)}
          placeholder="Nome de um"
          className="rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-dourado/50"
        />
        <input
          type="text"
          value={name2}
          onChange={(e) => setName2(e.target.value)}
          placeholder="Nome do outro"
          className="rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-dourado/50"
        />
      </div>

      {slug && (
        <p className="text-xs text-brancoQuente/50 mb-4">
          Endereço:{" "}
          <span className="font-mono text-dourado">/{slug}</span>
        </p>
      )}

      {error && <p className="text-xs text-rosa mb-4">{error}</p>}

      <button
        onClick={create}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-full px-6 py-3 bg-vinho border border-rosa/40 text-sm font-medium hover:border-dourado/60 transition disabled:opacity-40"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
        Criar e editar
      </button>
    </section>
  );
}
