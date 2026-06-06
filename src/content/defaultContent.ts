// =============================================================
//  CONTEÚDO CENTRAL DO SITE
//  Todas as informações pessoais editáveis ficam aqui.
//  A página de edição (#/editar) altera estes valores e salva
//  no navegador (localStorage). Para mudar os valores PADRÃO
//  de forma permanente, edite este arquivo.
// =============================================================

export interface TimelineItem {
  date: string;
  title: string;
  description: string;
}

export interface LoveCardItem {
  title: string;
  description: string;
}

export interface MemoryItem {
  src: string;
  legend: string;
}

export interface PromiseItem {
  title: string;
  description: string;
}

export interface SiteContent {
  // ---- Informações gerais (usadas em vários lugares) ----
  general: {
    /** Primeiro nome do casal (usado na URL e no rodapé). */
    name1: string;
    /** Segundo nome do casal (usado na URL e no rodapé). */
    name2: string;
    /** Data de início do relacionamento (formato BR DD/MM/AAAA). Alimenta o contador. */
    startDate: string;
    /** Como a data de início aparece escrita no site, ex: "08/10/2022". */
    startDateLabel: string;
    /** Local onde tudo começou, ex: "escola". */
    place: string;
  };

  // ---- Tela de carregamento ----
  loading: {
    phrases: string[];
    finalPhrase: string;
  };

  // ---- Seção Hero (topo) ----
  hero: {
    badge: string;
    titleHighlight: string; // a data em destaque
    titleSuffix: string; // continuação do título
    subtitle: string;
    buttonText: string;
  };

  // ---- Seção "Onde tudo começou" ----
  storyStart: {
    eyebrow: string;
    titlePrefix: string;
    titleHighlight: string;
    paragraph1: string;
    paragraph2: string;
    cardBigDate: string; // ex: "08 . 10 . 22"
    cardSubject: string; // Matéria
    cardPlace: string; // Local
    cardNote: string; // Anotação
    cardFooter: string;
  };

  // ---- Linha do tempo ----
  timeline: TimelineItem[];

  // ---- Coisas que eu amo em você ----
  loveCards: LoveCardItem[];

  // ---- Carta ----
  loveLetter: {
    placeLine: string; // ex: "Escola & Além"
    dateLine: string; // ex: "12 de Junho"
    greeting: string; // ex: "Meu amor,"
    paragraphs: string[];
    closing1: string;
    closing2: string;
  };

  // ---- Galeria de memórias ----
  memories: MemoryItem[];

  // ---- Promessas ----
  promises: PromiseItem[];

  // ---- Seção final ----
  finalSection: {
    title: string;
    subtitle: string;
    buttonText: string;
    modalTitle: string;
    modalQuote: string;
    modalFooter: string;
  };

  // ---- Rodapé ----
  footer: {
    line1: string;
    line2: string;
    dateLine: string;
  };
}

export const defaultContent: SiteContent = {
  general: {
    name1: "",
    name2: "",
    startDate: "08/10/2022",
    startDateLabel: "08/10/2022",
    place: "escola",
  },

  loading: {
    phrases: [
      "08/10/2022",
      "O dia em que tudo começou",
      "Da escola para a vida",
      "Nossa história",
    ],
    finalPhrase: "Para você, meu amor.",
  },

  hero: {
    badge: "Dia dos Namorados • 12 de Junho",
    titleHighlight: "08/10/2022",
    titleSuffix: "minha vida nunca mais foi a mesma.",
    subtitle:
      "Eu não sabia naquele dia, mas na escola eu estava conhecendo a pessoa que se tornaria meu lugar favorito no mundo.",
    buttonText: "Começar nossa história",
  },

  storyStart: {
    eyebrow: "Onde Tudo Começou",
    titlePrefix: "Tudo começou na",
    titleHighlight: "escola",
    paragraph1:
      "No dia 08/10/2022, em um lugar comum, aconteceu algo que mudou a minha vida de um jeito que eu nunca poderia imaginar.",
    paragraph2:
      "Duas rotinas normais dividindo o mesmo espaço. Cadernos abertos, conversas no corredor e, de repente, um olhar que carregava um destino diferente de tudo que eu já tinha conhecido.",
    cardBigDate: "08 . 10 . 22",
    cardSubject: "O começo de nós.",
    cardPlace: "Corredores da escola.",
    cardNote: "O riso mais bonito que encontrei.",
    cardFooter: "Primeiro capítulo da nossa história",
  },

  timeline: [
    {
      date: "08/10/2022",
      title: "O dia em que tudo começou",
      description:
        "Foi na escola. Talvez parecesse só mais um dia comum, mas hoje eu sei que Deus estava escrevendo uma das partes mais bonitas da minha vida.",
    },
    {
      date: "O começo de tudo",
      title: "Nossa conexão",
      description:
        "Entre conversas, olhares, risadas e aquele frio na barriga, você foi se tornando cada vez mais importante para mim.",
    },
    {
      date: "Hoje",
      title: "Ainda escolhendo você",
      description:
        "Depois de tudo que vivemos, eu olho para você e tenho certeza: eu escolheria você de novo. Em todos os dias. Em todas as versões da minha vida.",
    },
    {
      date: "12 de Junho",
      title: "Nosso Dia dos Namorados",
      description:
        "Esse site é só uma pequena tentativa de transformar em palavras tudo aquilo que você significa para mim.",
    },
  ],

  loveCards: [
    {
      title: "Seu jeito",
      description:
        "Eu amo o jeito como você transforma qualquer momento simples em algo especial. Com você, até os dias comuns parecem ter mais sentido.",
    },
    {
      title: "Seu sorriso",
      description:
        "Seu sorriso tem um efeito que talvez você nem perceba: ele acalma, ilumina e me lembra que eu tenho muita sorte por ter você.",
    },
    {
      title: "Sua presença",
      description:
        "Você é aquele tipo de pessoa que não precisa fazer esforço para ser importante. Só de estar perto, tudo fica melhor.",
    },
    {
      title: "Seu cuidado",
      description:
        "Eu amo a forma como você cuida, se importa e demonstra amor nos detalhes. É nos detalhes que eu mais vejo o tamanho do seu coração.",
    },
    {
      title: "Sua força",
      description:
        "Eu admiro a mulher que você é. Mesmo quando você acha que não está sendo forte, eu vejo em você uma coragem linda.",
    },
    {
      title: "A paz que você me traz",
      description:
        "No meio de qualquer confusão do mundo, você é meu lugar de calma. Meu abraço preferido. Minha paz.",
    },
  ],

  loveLetter: {
    placeLine: "Escola & Além",
    dateLine: "12 de Junho",
    greeting: "Meu amor,",
    paragraphs: [
      "Eu poderia te dar qualquer presente, mas nada seria suficiente para representar o quanto você significa para mim.",
      "Desde o dia 08/10/2022, quando nos conhecemos na escola, você começou a fazer parte da minha vida de um jeito que eu nunca mais quis tirar. Aos poucos, você virou minha melhor companhia, meu pensamento bom no meio do dia, minha saudade favorita e o meu motivo de sorrir sem perceber.",
      "Eu amo quem você é. Amo seu jeito, seu sorriso, sua forma de cuidar, sua presença, sua força e até os detalhes que talvez você ache pequenos, mas que para mim fazem toda diferença.",
      "Obrigado por estar comigo, por viver essa história comigo e por ser essa mulher tão especial.",
      "Eu não sei exatamente o que o futuro guarda, mas sei de uma coisa: eu quero continuar vivendo ele com você.",
    ],
    closing1: "Feliz Dia dos Namorados.",
    closing2: "Eu te amo.",
  },

  memories: [
    { src: "/images/memoria-1.jpg", legend: "Um dos nossos momentos" },
    { src: "/images/memoria-2.jpg", legend: "Um pedacinho da nossa história" },
    { src: "/images/memoria-3.jpg", legend: "Nós dois" },
    { src: "/images/memoria-4.jpg", legend: "Memória favorita" },
    { src: "/images/memoria-5.jpg", legend: "Sempre você" },
    { src: "/images/memoria-6.jpg", legend: "Mais um capítulo" },
  ],

  promises: [
    {
      title: "Continuar escolhendo você",
      description:
        "Em todos os amanheceres, em todas as escolhas cotidianas, continuar decidindo que meu coração pertence a você.",
    },
    {
      title: "Cuidar da nossa história",
      description:
        "Proteger o que construímos, guardar nossas piadas internas e fazer com que nossos momentos juntos continuem sendo preciosos.",
    },
    {
      title: "Estar presente",
      description:
        "Tanto nos dias de sol e sorrisos bobos quanto nas tempestades difíceis, oferecendo meu colo e minha escuta.",
    },
    {
      title: "Crescer ao seu lado",
      description:
        "Evoluir como pessoa, apoiar seus sonhos individuais e aprender com cada lição que a vida nos trouxer como casal.",
    },
    {
      title: "Lembrar você do seu valor",
      description:
        "Dizer todos os dias o quanto você é inteligente, forte, linda e, acima de tudo, o quanto você é amada por mim.",
    },
  ],

  finalSection: {
    title: "Você não é só minha namorada.",
    subtitle: "Você é uma das partes mais bonitas da minha vida.",
    buttonText: "Eu te amo",
    modalTitle: "Minha eterna escolha",
    modalQuote:
      "E eu escolheria você de novo. Hoje, amanhã e quantas vidas Deus permitir.",
    modalFooter: "Feliz Dia dos Namorados, meu amor.",
  },

  footer: {
    line1: "Feito com amor",
    line2: "para você",
    dateLine: "Desde 08/10/2022.",
  },
};

/**
 * Mescla um conteúdo carregado (de banco/JSON) com o padrão. Garante que,
 * mesmo que faltem campos (versões antigas), tudo tenha um valor válido.
 */
export function normalizeContent(saved: unknown): SiteContent {
  if (!saved || typeof saved !== "object") return structuredClone(defaultContent);
  const s = saved as Record<string, unknown>;

  return {
    general: { ...defaultContent.general, ...(s.general as object) },
    loading: { ...defaultContent.loading, ...(s.loading as object) },
    hero: { ...defaultContent.hero, ...(s.hero as object) },
    storyStart: { ...defaultContent.storyStart, ...(s.storyStart as object) },
    timeline: Array.isArray(s.timeline)
      ? (s.timeline as SiteContent["timeline"])
      : defaultContent.timeline,
    loveCards: Array.isArray(s.loveCards)
      ? (s.loveCards as SiteContent["loveCards"])
      : defaultContent.loveCards,
    loveLetter: { ...defaultContent.loveLetter, ...(s.loveLetter as object) },
    memories: Array.isArray(s.memories)
      ? (s.memories as SiteContent["memories"])
      : defaultContent.memories,
    promises: Array.isArray(s.promises)
      ? (s.promises as SiteContent["promises"])
      : defaultContent.promises,
    finalSection: {
      ...defaultContent.finalSection,
      ...(s.finalSection as object),
    },
    footer: { ...defaultContent.footer, ...(s.footer as object) },
  };
}
