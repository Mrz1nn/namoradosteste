import { useEffect, useState } from "react";

/** Hook que devolve o caminho atual e re-renderiza quando a URL muda. */
export function usePathname(): string {
  const [pathname, setPathname] = useState(() => window.location.pathname);
  useEffect(() => {
    const onChange = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", onChange);
    return () => window.removeEventListener("popstate", onChange);
  }, []);
  return pathname;
}

/** Navega para uma nova rota sem recarregar a página. */
export function navigate(to: string) {
  if (to === window.location.pathname) return;
  window.history.pushState({}, "", to);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo(0, 0);
}

export type Route =
  | { name: "landing" }
  | { name: "admin" }
  | { name: "site"; slug: string }
  | { name: "edit"; slug: string }
  | { name: "notfound" };

/** Interpreta o caminho da URL e devolve a rota correspondente. */
export function parseRoute(pathname: string): Route {
  const parts = pathname.split("/").filter(Boolean);

  if (parts.length === 0) return { name: "landing" };
  if (parts[0] === "admin" && parts.length === 1) return { name: "admin" };
  if (parts.length === 1) return { name: "site", slug: parts[0].toLowerCase() };
  if (parts.length === 2 && parts[1] === "editar")
    return { name: "edit", slug: parts[0].toLowerCase() };

  return { name: "notfound" };
}

/** Link interno que usa o roteador (evita recarregar a página). */
export function Link({
  to,
  children,
  className,
  title,
  ariaLabel,
}: {
  to: string;
  children: React.ReactNode;
  className?: string;
  title?: string;
  ariaLabel?: string;
}) {
  return (
    <a
      href={to}
      title={title}
      aria-label={ariaLabel}
      className={className}
      onClick={(e) => {
        // Permite abrir em nova aba com ctrl/cmd.
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
}
