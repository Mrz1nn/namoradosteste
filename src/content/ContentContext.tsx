import { createContext, useContext, type ReactNode } from "react";
import { defaultContent, type SiteContent } from "./defaultContent";

/**
 * Provê o conteúdo de UM casal para os componentes do site.
 * O carregamento/salvamento é feito pela camada de dados (src/lib/store.ts);
 * aqui só repassamos o objeto já pronto.
 */
const ContentContext = createContext<SiteContent>(defaultContent);

export function ContentProvider({
  content,
  children,
}: {
  content: SiteContent;
  children: ReactNode;
}) {
  return (
    <ContentContext.Provider value={content}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent(): SiteContent {
  return useContext(ContentContext);
}
