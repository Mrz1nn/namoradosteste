import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Download,
  Upload,
  Check,
  Heart,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { defaultContent, type SiteContent } from "../content/defaultContent";
import { Link, navigate } from "../lib/router";
import { processImage } from "../lib/image";
import {
  getSite,
  saveSite,
  uploadImage,
  getAdminPassword,
} from "../lib/store";
import { ImagePlus } from "lucide-react";

// ----------------------- Helpers de formulário -----------------------

function Field({
  label,
  value,
  onChange,
  hint,
  mono,
  placeholder,
  inputMode,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  mono?: boolean;
  placeholder?: string;
  inputMode?: "text" | "numeric";
  maxLength?: number;
}) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-[0.15em] text-rosa/80 mb-2 font-medium">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        maxLength={maxLength}
        className={`w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-brancoQuente placeholder:text-brancoQuente/30 focus:outline-none focus:border-dourado/50 focus:ring-1 focus:ring-dourado/30 transition ${
          mono ? "font-mono" : ""
        }`}
      />
      {hint && <span className="block text-[11px] text-brancoQuente/40 mt-1.5">{hint}</span>}
    </label>
  );
}

/** Aplica a máscara de data BR: insere as barras automaticamente (DD/MM/AAAA). */
function maskDate(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  const parts: string[] = [];
  parts.push(digits.slice(0, 2));
  if (digits.length >= 3) parts.push(digits.slice(2, 4));
  if (digits.length >= 5) parts.push(digits.slice(4, 8));
  return parts.filter((p) => p !== "").join("/");
}

function Area({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-[0.15em] text-rosa/80 mb-2 font-medium">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-brancoQuente leading-relaxed placeholder:text-brancoQuente/30 focus:outline-none focus:border-dourado/50 focus:ring-1 focus:ring-dourado/30 transition resize-y"
      />
    </label>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="glass-card rounded-3xl border border-white/10 p-6 md:p-8 shadow-[0_15px_40px_rgba(8,6,7,0.5)]">
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-title font-light text-dourado text-glow-dourado">
          {title}
        </h2>
        {description && (
          <p className="text-xs text-brancoQuente/50 mt-1.5 max-w-2xl">{description}</p>
        )}
        <div className="w-10 h-[1px] bg-dourado/40 mt-4" />
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function ItemCard({
  index,
  onRemove,
  canRemove,
  children,
}: {
  index: number;
  onRemove: () => void;
  canRemove: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-5 relative">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] uppercase tracking-[0.2em] text-dourado/60 font-mono">
          Item {String(index + 1).padStart(2, "0")}
        </span>
        {canRemove && (
          <button
            onClick={onRemove}
            className="inline-flex items-center gap-1.5 text-xs text-rosa/70 hover:text-rosa transition px-2 py-1 rounded-lg hover:bg-rosa/10"
            type="button"
          >
            <Trash2 className="w-3.5 h-3.5" /> Remover
          </button>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 py-3 text-sm text-brancoQuente/60 hover:text-dourado hover:border-dourado/40 transition"
    >
      <Plus className="w-4 h-4" /> {label}
    </button>
  );
}

function MemoryImage({
  value,
  onChange,
  slug,
  password,
}: {
  value: string;
  onChange: (url: string) => void;
  slug: string;
  password: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [broken, setBroken] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Selecione um arquivo de imagem.");
      return;
    }
    setError("");
    setUploading(true);
    try {
      const { blob, dataUrl } = await processImage(file);
      const url = await uploadImage(blob, file.name, slug, password, dataUrl);
      setBroken(false);
      onChange(url);
    } catch (err) {
      setError(String((err as Error)?.message || err));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <span className="block text-xs uppercase tracking-[0.15em] text-rosa/80 mb-2 font-medium">
        Foto
      </span>
      <div className="flex items-center gap-4">
        {/* Pré-visualização */}
        <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/10 bg-black/40 flex items-center justify-center shrink-0">
          {value && !broken ? (
            <img
              src={value}
              alt="prévia"
              onError={() => setBroken(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <ImagePlus className="w-5 h-5 text-brancoQuente/30" />
          )}
        </div>

        <div className="flex-1">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm border border-white/15 text-brancoQuente/80 hover:text-dourado hover:border-dourado/40 transition disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {value ? "Trocar foto" : "Enviar foto"}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
          {error && <p className="text-[11px] text-rosa mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
}

// ----------------------------- Página -----------------------------

export default function EditPage({ slug }: { slug: string }) {
  const password = getAdminPassword();
  const [draft, setDraft] = useState<SiteContent | null>(null);
  const [savedJson, setSavedJson] = useState("");
  const [status, setStatus] = useState<
    "loading" | "ok" | "notfound" | "error"
  >("loading");
  const [errMsg, setErrMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Exige login de admin; carrega o conteúdo do casal.
  useEffect(() => {
    if (!password) {
      navigate("/admin");
      return;
    }
    let alive = true;
    setStatus("loading");
    getSite(slug)
      .then((rec) => {
        if (!alive) return;
        if (!rec) {
          setStatus("notfound");
          return;
        }
        setDraft(rec.content);
        setSavedJson(JSON.stringify(rec.content));
        setStatus("ok");
      })
      .catch((e) => {
        if (!alive) return;
        setErrMsg(String(e?.message || e));
        setStatus("error");
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const isDirty = useMemo(
    () => !!draft && JSON.stringify(draft) !== savedJson,
    [draft, savedJson]
  );

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const update = (fn: (d: SiteContent) => void) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const next = structuredClone(prev);
      fn(next);
      return next;
    });
  };

  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    try {
      await saveSite(
        {
          slug,
          name1: draft.general.name1.trim(),
          name2: draft.general.name2.trim(),
          content: draft,
        },
        password
      );
      setSavedJson(JSON.stringify(draft));
      setSavedFlash(true);
      window.setTimeout(() => setSavedFlash(false), 2200);
    } catch (e) {
      window.alert(String((e as Error)?.message || e));
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (
      !window.confirm(
        "Restaurar todos os textos para os valores originais? Os nomes serão mantidos."
      )
    )
      return;
    setDraft((prev) => {
      const d = structuredClone(defaultContent);
      if (prev) {
        d.general.name1 = prev.general.name1;
        d.general.name2 = prev.general.name2;
      }
      return d;
    });
  };

  const handleExport = () => {
    if (!draft) return;
    const blob = new Blob([JSON.stringify(draft, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        setDraft((prev) => ({ ...(prev as SiteContent), ...parsed }));
        window.alert("Conteúdo importado! Revise e clique em Salvar.");
      } catch {
        window.alert("Arquivo inválido. Use um JSON exportado por este site.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // ----------------------- Estados de carregamento -----------------------

  if (status === "loading") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#080607] text-brancoQuente">
        <Loader2 className="w-6 h-6 animate-spin text-rosa" />
      </div>
    );
  }

  if (status === "notfound") {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#080607] text-brancoQuente px-6 text-center">
        <h1 className="text-2xl font-title text-rosa mb-3">
          Site /{slug} não encontrado
        </h1>
        <p className="text-sm text-brancoQuente/50 mb-6">
          Crie este casal pelo painel antes de editar.
        </p>
        <Link
          to="/admin"
          className="rounded-full px-6 py-3 bg-vinho border border-rosa/40 text-sm hover:border-dourado/60 transition"
        >
          Ir para o painel
        </Link>
      </div>
    );
  }

  if (status === "error" || !draft) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#080607] text-brancoQuente px-6 text-center">
        <h1 className="text-2xl font-title text-rosa mb-3">Algo deu errado</h1>
        <p className="text-sm text-brancoQuente/50">{errMsg}</p>
      </div>
    );
  }

  // ----------------------------- Formulário -----------------------------

  return (
    <main className="relative min-h-screen bg-background text-brancoQuente overflow-x-hidden pb-32">
      <div className="noise-overlay" />
      <div className="absolute top-0 inset-x-0 h-[40vh] radial-glow-vinho opacity-50 pointer-events-none" />

      {/* Barra superior fixa */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-background/80 border-b border-white/10">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl py-4 flex items-center justify-between gap-3">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 text-sm text-brancoQuente/70 hover:text-brancoQuente transition"
          >
            <ArrowLeft className="w-4 h-4" /> Painel
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to={`/${slug}`}
              title="Ver site"
              className="hidden sm:inline-flex items-center gap-2 text-sm text-brancoQuente/60 hover:text-dourado transition mr-1"
            >
              <ExternalLink className="w-4 h-4" /> Ver site
            </Link>
            {isDirty && !savedFlash && (
              <span className="hidden sm:inline text-[11px] text-dourado/70 mr-1">
                Não salvo
              </span>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={(!isDirty && !savedFlash) || saving}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition active:scale-95 ${
                savedFlash
                  ? "bg-dourado/20 border border-dourado/50 text-dourado"
                  : "bg-vinho border border-rosa/40 text-brancoQuente hover:border-dourado/60 disabled:opacity-40 disabled:hover:border-rosa/40"
              }`}
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : savedFlash ? (
                <>
                  <Check className="w-4 h-4" /> Salvo!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Salvar
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-6 max-w-4xl relative z-10 pt-10">
        {/* Título */}
        <div className="text-center mb-10 select-none">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-rosa font-medium mb-3">
            <Heart className="w-4 h-4 fill-rosa/20 stroke-rosa" /> Editando{" "}
            <span className="font-mono text-dourado/80">/{slug}</span>
          </span>
          <h1 className="text-3xl md:text-4xl font-title font-light text-brancoQuente">
            Editar o site do <span className="italic text-dourado">casal</span>
          </h1>
        </div>

        <div className="space-y-6">
          {/* ---------------- CASAL / URL ---------------- */}
          <Section
            title="O casal"
            description="Os nomes aparecem no rodapé e no título da aba. O endereço (URL) é fixo após a criação."
          >
            <div className="grid md:grid-cols-2 gap-5">
              <Field
                label="Nome de um"
                value={draft.general.name1}
                onChange={(v) => update((d) => (d.general.name1 = v))}
              />
              <Field
                label="Nome do outro"
                value={draft.general.name2}
                onChange={(v) => update((d) => (d.general.name2 = v))}
              />
            </div>
            <div className="rounded-xl bg-black/30 border border-white/10 px-4 py-3 text-sm">
              <span className="text-brancoQuente/50">Endereço do site: </span>
              <span className="font-mono text-dourado">/{slug}</span>
            </div>
          </Section>

          {/* ---------------- GERAL ---------------- */}
          <Section
            title="Informações principais"
            description="A data em que tudo começou e o local. A data abaixo também alimenta o contador do tempo de relacionamento."
          >
            <div className="grid md:grid-cols-2 gap-5">
              <Field
                label="Data de início (para o contador)"
                value={draft.general.startDate}
                onChange={(v) => update((d) => (d.general.startDate = maskDate(v)))}
                hint="Formato: DD/MM/AAAA (ex: 08/10/2022)"
                placeholder="DD/MM/AAAA"
                inputMode="numeric"
                maxLength={10}
                mono
              />
              <Field
                label="Data escrita no site"
                value={draft.general.startDateLabel}
                onChange={(v) =>
                  update((d) => (d.general.startDateLabel = maskDate(v)))
                }
                hint="Ex: 08/10/2022"
                placeholder="DD/MM/AAAA"
                inputMode="numeric"
                maxLength={10}
                mono
              />
              <Field
                label="Local onde tudo começou"
                value={draft.general.place}
                onChange={(v) => update((d) => (d.general.place = v))}
                hint="Ex: escola"
              />
            </div>
          </Section>

          {/* ---------------- CARREGAMENTO ---------------- */}
          <Section
            title="Tela de carregamento"
            description="As frases que aparecem enquanto o site carrega."
          >
            {draft.loading.phrases.map((phrase, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={phrase}
                  onChange={(e) =>
                    update((d) => (d.loading.phrases[i] = e.target.value))
                  }
                  className="flex-1 rounded-xl bg-black/40 border border-white/10 px-4 py-2.5 text-sm focus:outline-none focus:border-dourado/50"
                />
                {draft.loading.phrases.length > 1 && (
                  <button
                    type="button"
                    onClick={() => update((d) => d.loading.phrases.splice(i, 1))}
                    aria-label={`Remover frase ${i + 1}`}
                    className="p-2 text-rosa/60 hover:text-rosa rounded-lg hover:bg-rosa/10 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <AddButton
              label="Adicionar frase"
              onClick={() => update((d) => d.loading.phrases.push("Nova frase"))}
            />
            <Field
              label="Frase final"
              value={draft.loading.finalPhrase}
              onChange={(v) => update((d) => (d.loading.finalPhrase = v))}
            />
          </Section>

          {/* ---------------- HERO ---------------- */}
          <Section
            title="Topo (Hero)"
            description="A primeira seção que aparece, com a data em destaque."
          >
            <Field
              label="Selo / Badge"
              value={draft.hero.badge}
              onChange={(v) => update((d) => (d.hero.badge = v))}
            />
            <div className="grid md:grid-cols-2 gap-5">
              <Field
                label="Data em destaque"
                value={draft.hero.titleHighlight}
                onChange={(v) => update((d) => (d.hero.titleHighlight = v))}
                mono
              />
              <Field
                label="Continuação do título"
                value={draft.hero.titleSuffix}
                onChange={(v) => update((d) => (d.hero.titleSuffix = v))}
              />
            </div>
            <Area
              label="Subtítulo"
              value={draft.hero.subtitle}
              onChange={(v) => update((d) => (d.hero.subtitle = v))}
            />
            <Field
              label="Texto do botão"
              value={draft.hero.buttonText}
              onChange={(v) => update((d) => (d.hero.buttonText = v))}
            />
          </Section>

          {/* ---------------- ONDE TUDO COMEÇOU ---------------- */}
          <Section
            title="Onde tudo começou"
            description="A seção da história com o cartão estilo caderno."
          >
            <div className="grid md:grid-cols-2 gap-5">
              <Field
                label="Rótulo (eyebrow)"
                value={draft.storyStart.eyebrow}
                onChange={(v) => update((d) => (d.storyStart.eyebrow = v))}
              />
              <Field
                label="Início do título"
                value={draft.storyStart.titlePrefix}
                onChange={(v) => update((d) => (d.storyStart.titlePrefix = v))}
              />
              <Field
                label="Palavra em destaque"
                value={draft.storyStart.titleHighlight}
                onChange={(v) => update((d) => (d.storyStart.titleHighlight = v))}
              />
              <Field
                label="Data grande do cartão"
                value={draft.storyStart.cardBigDate}
                onChange={(v) => update((d) => (d.storyStart.cardBigDate = v))}
                hint="Ex: 08 . 10 . 22"
                mono
              />
            </div>
            <Area
              label="Parágrafo 1"
              value={draft.storyStart.paragraph1}
              onChange={(v) => update((d) => (d.storyStart.paragraph1 = v))}
            />
            <Area
              label="Parágrafo 2"
              value={draft.storyStart.paragraph2}
              onChange={(v) => update((d) => (d.storyStart.paragraph2 = v))}
            />
            <div className="grid md:grid-cols-3 gap-5">
              <Field
                label="Matéria"
                value={draft.storyStart.cardSubject}
                onChange={(v) => update((d) => (d.storyStart.cardSubject = v))}
              />
              <Field
                label="Local"
                value={draft.storyStart.cardPlace}
                onChange={(v) => update((d) => (d.storyStart.cardPlace = v))}
              />
              <Field
                label="Anotação"
                value={draft.storyStart.cardNote}
                onChange={(v) => update((d) => (d.storyStart.cardNote = v))}
              />
            </div>
            <Field
              label="Rodapé do cartão"
              value={draft.storyStart.cardFooter}
              onChange={(v) => update((d) => (d.storyStart.cardFooter = v))}
            />
          </Section>

          {/* ---------------- LINHA DO TEMPO ---------------- */}
          <Section
            title="Linha do tempo"
            description="Os marcos da história. Você pode adicionar ou remover momentos."
          >
            {draft.timeline.map((item, i) => (
              <ItemCard
                key={i}
                index={i}
                canRemove={draft.timeline.length > 1}
                onRemove={() => update((d) => d.timeline.splice(i, 1))}
              >
                <Field
                  label="Data / Marco"
                  value={item.date}
                  onChange={(v) => update((d) => (d.timeline[i].date = v))}
                />
                <Field
                  label="Título"
                  value={item.title}
                  onChange={(v) => update((d) => (d.timeline[i].title = v))}
                />
                <Area
                  label="Descrição"
                  value={item.description}
                  onChange={(v) => update((d) => (d.timeline[i].description = v))}
                />
              </ItemCard>
            ))}
            <AddButton
              label="Adicionar momento"
              onClick={() =>
                update((d) =>
                  d.timeline.push({
                    date: "Nova data",
                    title: "Novo momento",
                    description: "Descrição do momento.",
                  })
                )
              }
            />
          </Section>

          {/* ---------------- COISAS QUE AMO ---------------- */}
          <Section
            title="Coisas que eu amo em você"
            description="As qualidades em destaque."
          >
            {draft.loveCards.map((card, i) => (
              <ItemCard
                key={i}
                index={i}
                canRemove={draft.loveCards.length > 1}
                onRemove={() => update((d) => d.loveCards.splice(i, 1))}
              >
                <Field
                  label="Título"
                  value={card.title}
                  onChange={(v) => update((d) => (d.loveCards[i].title = v))}
                />
                <Area
                  label="Descrição"
                  value={card.description}
                  onChange={(v) => update((d) => (d.loveCards[i].description = v))}
                />
              </ItemCard>
            ))}
            <AddButton
              label="Adicionar qualidade"
              onClick={() =>
                update((d) =>
                  d.loveCards.push({
                    title: "Nova qualidade",
                    description: "Descrição.",
                  })
                )
              }
            />
          </Section>

          {/* ---------------- CARTA ---------------- */}
          <Section title="Carta para você" description="A carta de amor.">
            <div className="grid md:grid-cols-2 gap-5">
              <Field
                label="Linha do local"
                value={draft.loveLetter.placeLine}
                onChange={(v) => update((d) => (d.loveLetter.placeLine = v))}
              />
              <Field
                label="Linha da data"
                value={draft.loveLetter.dateLine}
                onChange={(v) => update((d) => (d.loveLetter.dateLine = v))}
              />
            </div>
            <Field
              label="Saudação"
              value={draft.loveLetter.greeting}
              onChange={(v) => update((d) => (d.loveLetter.greeting = v))}
            />
            {draft.loveLetter.paragraphs.map((p, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="flex-1">
                  <Area
                    label={`Parágrafo ${i + 1}`}
                    value={p}
                    onChange={(v) =>
                      update((d) => (d.loveLetter.paragraphs[i] = v))
                    }
                  />
                </div>
                {draft.loveLetter.paragraphs.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      update((d) => d.loveLetter.paragraphs.splice(i, 1))
                    }
                    aria-label={`Remover parágrafo ${i + 1}`}
                    className="mt-8 p-2 text-rosa/60 hover:text-rosa rounded-lg hover:bg-rosa/10 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <AddButton
              label="Adicionar parágrafo"
              onClick={() =>
                update((d) => d.loveLetter.paragraphs.push("Novo parágrafo."))
              }
            />
            <div className="grid md:grid-cols-2 gap-5">
              <Field
                label="Despedida 1"
                value={draft.loveLetter.closing1}
                onChange={(v) => update((d) => (d.loveLetter.closing1 = v))}
              />
              <Field
                label="Despedida 2"
                value={draft.loveLetter.closing2}
                onChange={(v) => update((d) => (d.loveLetter.closing2 = v))}
              />
            </div>
          </Section>

          {/* ---------------- MEMÓRIAS ---------------- */}
          <Section
            title="Galeria de memórias"
            description="Envie as fotos do casal direto pelo botão. Cada casal tem suas próprias fotos."
          >
            {draft.memories.map((m, i) => (
              <ItemCard
                key={i}
                index={i}
                canRemove={draft.memories.length > 1}
                onRemove={() => update((d) => d.memories.splice(i, 1))}
              >
                <Field
                  label="Legenda"
                  value={m.legend}
                  onChange={(v) => update((d) => (d.memories[i].legend = v))}
                />
                <MemoryImage
                  value={m.src}
                  onChange={(url) => update((d) => (d.memories[i].src = url))}
                  slug={slug}
                  password={password}
                />
                <Field
                  label="Ou cole o caminho/URL da imagem"
                  value={m.src}
                  onChange={(v) => update((d) => (d.memories[i].src = v))}
                  hint="Ex: /images/memoria-1.jpg — preenchido automaticamente ao enviar uma foto"
                  mono
                />
              </ItemCard>
            ))}
            <AddButton
              label="Adicionar foto"
              onClick={() =>
                update((d) =>
                  d.memories.push({
                    src: `/images/memoria-${d.memories.length + 1}.jpg`,
                    legend: "Nova memória",
                  })
                )
              }
            />
          </Section>

          {/* ---------------- PROMESSAS ---------------- */}
          <Section title="Promessas" description="Seus compromissos do coração.">
            {draft.promises.map((p, i) => (
              <ItemCard
                key={i}
                index={i}
                canRemove={draft.promises.length > 1}
                onRemove={() => update((d) => d.promises.splice(i, 1))}
              >
                <Field
                  label="Título"
                  value={p.title}
                  onChange={(v) => update((d) => (d.promises[i].title = v))}
                />
                <Area
                  label="Descrição"
                  value={p.description}
                  onChange={(v) => update((d) => (d.promises[i].description = v))}
                />
              </ItemCard>
            ))}
            <AddButton
              label="Adicionar promessa"
              onClick={() =>
                update((d) =>
                  d.promises.push({
                    title: "Nova promessa",
                    description: "Descrição.",
                  })
                )
              }
            />
          </Section>

          {/* ---------------- SEÇÃO FINAL ---------------- */}
          <Section
            title="Seção final"
            description="O encerramento emocional e o pop-up do botão."
          >
            <Field
              label="Título"
              value={draft.finalSection.title}
              onChange={(v) => update((d) => (d.finalSection.title = v))}
            />
            <Field
              label="Subtítulo"
              value={draft.finalSection.subtitle}
              onChange={(v) => update((d) => (d.finalSection.subtitle = v))}
            />
            <Field
              label="Texto do botão"
              value={draft.finalSection.buttonText}
              onChange={(v) => update((d) => (d.finalSection.buttonText = v))}
            />
            <div className="pt-2 border-t border-white/5" />
            <Field
              label="Título do pop-up"
              value={draft.finalSection.modalTitle}
              onChange={(v) => update((d) => (d.finalSection.modalTitle = v))}
            />
            <Area
              label="Frase do pop-up"
              value={draft.finalSection.modalQuote}
              onChange={(v) => update((d) => (d.finalSection.modalQuote = v))}
            />
            <Field
              label="Rodapé do pop-up"
              value={draft.finalSection.modalFooter}
              onChange={(v) => update((d) => (d.finalSection.modalFooter = v))}
            />
          </Section>

          {/* ---------------- RODAPÉ ---------------- */}
          <Section title="Rodapé">
            <div className="grid md:grid-cols-2 gap-5">
              <Field
                label="Texto antes do coração"
                value={draft.footer.line1}
                onChange={(v) => update((d) => (d.footer.line1 = v))}
              />
              <Field
                label="Texto depois do coração"
                value={draft.footer.line2}
                onChange={(v) => update((d) => (d.footer.line2 = v))}
              />
            </div>
            <Field
              label="Linha da data"
              value={draft.footer.dateLine}
              onChange={(v) => update((d) => (d.footer.dateLine = v))}
            />
          </Section>

          {/* ---------------- BACKUP ---------------- */}
          <Section
            title="Backup e restauração"
            description="Salve uma cópia do conteúdo ou restaure os textos originais."
          >
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleExport}
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm border border-white/15 text-brancoQuente/80 hover:text-brancoQuente hover:border-dourado/40 transition"
              >
                <Download className="w-4 h-4" /> Exportar (JSON)
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm border border-white/15 text-brancoQuente/80 hover:text-brancoQuente hover:border-dourado/40 transition"
              >
                <Upload className="w-4 h-4" /> Importar (JSON)
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json"
                onChange={handleImportFile}
                className="hidden"
              />
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm border border-rosa/30 text-rosa/80 hover:text-rosa hover:border-rosa/60 transition"
              >
                <RotateCcw className="w-4 h-4" /> Restaurar originais
              </button>
            </div>
          </Section>
        </div>
      </div>

      {/* Botão flutuante de salvar (mobile) */}
      {isDirty && (
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 sm:hidden inline-flex items-center gap-2 rounded-full px-6 py-3 bg-vinho border border-dourado/50 text-brancoQuente text-sm font-medium shadow-[0_10px_30px_rgba(59,10,24,0.6)] active:scale-95 disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}{" "}
          Salvar
        </button>
      )}
    </main>
  );
}
