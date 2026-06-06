import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { ContentProvider } from "../content/ContentContext";
import SiteExperience from "../components/SiteExperience";
import NotFound from "./NotFound";
import { getSite, type SiteRecord } from "../lib/store";

type State =
  | { status: "loading" }
  | { status: "ok"; record: SiteRecord }
  | { status: "notfound" }
  | { status: "error"; message: string };

export default function SitePage({ slug }: { slug: string }) {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let alive = true;
    setState({ status: "loading" });

    getSite(slug)
      .then((record) => {
        if (!alive) return;
        if (!record) {
          setState({ status: "notfound" });
          return;
        }
        setState({ status: "ok", record });
        const a = record.name1 || record.content.general.name1;
        const b = record.name2 || record.content.general.name2;
        document.title = a && b ? `${a} & ${b} ❤` : "Nosso site";
      })
      .catch((err) => {
        if (!alive) return;
        setState({ status: "error", message: String(err?.message || err) });
      });

    return () => {
      alive = false;
    };
  }, [slug]);

  if (state.status === "loading") {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#080607] text-brancoQuente">
        <div className="noise-overlay" />
        <Heart className="w-8 h-8 text-rosa fill-rosa/20 animate-pulse mb-4" />
        <span className="text-xs uppercase tracking-[0.25em] text-brancoQuente/50">
          Carregando…
        </span>
      </div>
    );
  }

  if (state.status === "notfound") {
    return <NotFound slug={slug} />;
  }

  if (state.status === "error") {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#080607] text-brancoQuente px-6 text-center">
        <div className="noise-overlay" />
        <h1 className="text-2xl font-title text-rosa mb-3">Algo deu errado</h1>
        <p className="text-sm text-brancoQuente/50 max-w-sm">{state.message}</p>
      </div>
    );
  }

  return (
    <ContentProvider content={state.record.content}>
      <SiteExperience />
    </ContentProvider>
  );
}
