// ─────────────────────────────────────────────────────────────────────────────
// CONTEÚDO DO SITE — edite aqui.
// Todo o texto que aparece na página vem deste arquivo; os componentes não têm
// conteúdo fixo (ADR-0008). Fonte: Currículo Lattes da Gabrieli
// (http://lattes.cnpq.br/0891095904029183), atualizado em 29/07/2026.
//
// Fotos: coloque os arquivos em `frontend/public/fotos/` e troque `src: null`
// por `src: "/fotos/nome-do-arquivo.jpg"`. Enquanto `src` for null, o site
// mostra um espaço reservado com a dica (`hint`).
// Projetos: use fotos de mãos, materiais, trabalhos e ambientes, ou crianças
// de costas — nunca rostos de alunos identificáveis.
//
// Detalhes dos projetos (objetivo, etapas, aprendizados, galeria, depoimento)
// ficam escondidos enquanto estiverem vazios — preencha quando quiser mostrar.
// ─────────────────────────────────────────────────────────────────────────────

import type { Photo, Profile, Project } from "@/models/profile";

const LATTES_URL = "http://lattes.cnpq.br/0891095904029183";

function placeholder(hint: string, alt: string): Photo {
  return { src: null, alt, hint };
}

const projects: Project[] = [
  {
    id: "estagio",
    title: "Vivências no Estágio Supervisionado I",
    subtitle: "Integração entre teoria e prática e a construção da identidade docente",
    kind: "Apresentação em congresso",
    year: 2026,
    tags: ["Estágio"],
    authors: ["CUNHA, G. A.", "BRUNS, Juliana Pedroso", "KISTNER, L."],
    reference:
      "CUNHA, G. A.; BRUNS, Juliana Pedroso; KISTNER, L. Vivências no estágio supervisionado I: integração entre teoria e prática e a construção da identidade docente. 2026. (Apresentação de Trabalho/Congresso).",
    summary: null,
    goal: null,
    cover: placeholder("foto: registro do estágio", "Registro do estágio supervisionado"),
    steps: [],
    learnings: [],
    gallery: [],
    testimonial: null,
  },
  {
    id: "parque",
    title: "Revitalização do parque infantil",
    subtitle: null,
    kind: "Apresentação de trabalho",
    year: 2025,
    tags: ["Educação Infantil"],
    authors: [
      "CHIRATTI, F. G. O.",
      "CUNHA, G. A.",
      "HAAS, J.",
      "KISTNER, L.",
      "SILVA, L. B. C.",
      "SILVA, N. M.",
      "CASETT, N.",
    ],
    reference:
      "CHIRATTI, F. G. O.; CUNHA, G. A.; HAAS, J.; KISTNER, L.; SILVA, L. B. C.; SILVA, N. M.; CASETT, N. Revitalização do parque infantil. 2025. (Apresentação de Trabalho/Outra).",
    summary: null,
    goal: null,
    cover: placeholder("foto: parque infantil revitalizado", "Parque infantil revitalizado"),
    steps: [],
    learnings: [],
    gallery: [],
    testimonial: null,
  },
  {
    id: "murais",
    title: "Murais e painéis no ensino de ciências",
    subtitle: "Murais e painéis como estratégia de ensino de ciências da natureza",
    kind: "Apresentação de trabalho",
    year: 2025,
    tags: ["Ciências"],
    authors: [
      "CUNHA, G. A.",
      "MELIM, J.",
      "KISTNER, L.",
      "SILVA, N. M.",
      "CASETT, N.",
      "ROEDEL, T.",
    ],
    reference:
      "CUNHA, G. A.; MELIM, J.; KISTNER, L.; SILVA, N. M.; CASETT, N.; ROEDEL, T. Murais e painéis como estratégia de ensino de ciências da natureza. 2025. (Apresentação de Trabalho/Outra).",
    summary: null,
    goal: null,
    cover: placeholder("foto: mural de ciências", "Mural de ciências da natureza"),
    steps: [],
    learnings: [],
    gallery: [],
    testimonial: null,
  },
  {
    id: "eca",
    title: "ECA — Estatuto da Criança e do Adolescente",
    subtitle: null,
    kind: "Apresentação de trabalho",
    year: 2024,
    tags: ["Direitos da criança"],
    authors: [
      "CUNHA, G. A.",
      "DALGOSTIN, J. P.",
      "KISTNER, L.",
      "SENS, N.",
      "ORLANDI, S. K. D.",
      "ESSER, S.",
      "CORREA, S. S.",
    ],
    reference:
      "CUNHA, G. A.; DALGOSTIN, J. P.; KISTNER, L.; SENS, N.; ORLANDI, S. K. D.; ESSER, S.; CORREA, S. S. ECA – Estatuto da Criança e do Adolescente. 2024. (Apresentação de Trabalho/Outra).",
    summary: null,
    goal: null,
    cover: placeholder("foto: apresentação sobre o ECA", "Apresentação sobre o ECA"),
    steps: [],
    learnings: [],
    gallery: [],
    testimonial: null,
  },
];

export const profile: Profile = {
  name: "Gabrieli",
  fullName: "Gabrieli Aparecida Cunha",
  title: "Professora",
  hero: {
    greeting: "olá, eu sou a",
    specialty: "Educação Infantil e Anos Iniciais",
    tagline: "Ensinar é plantar curiosidade e ver florescer a vontade de aprender",
    photo: placeholder("Retrato da Gabrieli", "Retrato da Gabrieli"),
  },
  about: {
    lead: "Uma professora que aprende junto com a turma.",
    paragraphs: [
      "Sou graduanda em Pedagogia no Centro Universitário de Brusque (UNIFEBE), com habilitação para atuar na Educação Infantil e nos Anos Iniciais do Ensino Fundamental. Desde 2026, trabalho como monitora no Centro de Educação Infantil Hilda Anna Eccel, em Brusque.",
      "Concluí o Ensino Médio no Instituto Federal Catarinense — Campus Brusque, em 2022. Meus interesses de estudo estão na alfabetização, no letramento e na literatura.",
    ],
    areasTitle: "Áreas de interesse",
    areas: ["Educação Infantil", "Anos Iniciais", "Alfabetização", "Letramento", "Literatura"],
    quote: {
      before: "Ensinar não é transferir conhecimento, mas ",
      highlight: "criar as possibilidades",
      after: " para a sua própria produção ou a sua construção.",
      author: "Paulo Freire",
      source: "Pedagogia da Autonomia",
    },
    valuesTitle: "O que guia o meu trabalho",
    values: [
      {
        icon: "heart",
        tone: "peach",
        title: "Afeto que ensina",
        description:
          "Vínculo e acolhimento são a base para que cada criança se sinta segura para aprender.",
      },
      {
        icon: "clock",
        tone: "sun",
        title: "Cada um no seu tempo",
        description:
          "Respeito os ritmos individuais e acompanho o desenvolvimento de cada criança de perto.",
      },
      {
        icon: "sparkle",
        tone: "mint",
        title: "Curiosidade em primeiro lugar",
        description:
          "As perguntas das crianças viram ponto de partida para projetos e descobertas.",
      },
      {
        icon: "circles",
        tone: "sand",
        title: "Parceria com as famílias",
        description:
          "Escola e família caminham juntas, com diálogo aberto e registros compartilhados.",
      },
    ],
  },
  trajectory: {
    lead: "Da formação à sala de aula, com a Educação Infantil no centro.",
    experiences: [
      {
        kind: "work",
        role: "Monitora · Educação Infantil",
        school: "Centro de Educação Infantil Hilda Anna Eccel · Brusque",
        period: { start: 2026, end: null },
        description: "Monitora em período integral na Educação Infantil.",
      },
      {
        kind: "study",
        role: "Graduação em Pedagogia",
        school: "Centro Universitário de Brusque · UNIFEBE",
        period: { start: 2024, end: null },
        description:
          "Habilitação para atuar na Educação Infantil e nos Anos Iniciais do Ensino Fundamental.",
      },
      {
        kind: "study",
        role: "Ensino Médio",
        school: "Instituto Federal Catarinense · Campus Brusque",
        period: { start: 2020, end: 2022 },
        description: "Ensino Médio concluído em 2022.",
      },
    ],
  },
  projects: {
    lead: "Trabalhos apresentados durante a graduação.",
    allLabel: "Todos",
    filters: ["Estágio", "Educação Infantil", "Ciências", "Direitos da criança"],
    items: projects,
  },
  education: {
    degrees: [
      {
        kind: "Graduação em andamento",
        title: "Pedagogia",
        institution: "Centro Universitário de Brusque · UNIFEBE",
        period: { start: 2024, end: null },
        note: "Habilitação para atuar na Educação Infantil e nos Anos Iniciais do Ensino Fundamental.",
      },
      {
        kind: "Ensino Médio",
        title: "Instituto Federal Catarinense",
        institution: "Campus Brusque",
        period: { start: 2020, end: 2022 },
        note: null,
      },
    ],
    eventsTitle: "Eventos e oficinas",
    events: [
      { name: "Jogos para Alfabetização", kind: "Oficina", year: 2025 },
      {
        name: "Vivenciando literatura infantil em conexão com a natureza na Formação Continuada de Professores da Educação Básica",
        kind: "Oficina",
        year: 2025,
      },
      {
        name: "Arquitetura escolar e a escola do amanhã: uma visão ampla",
        kind: "Evento",
        year: 2025,
      },
      {
        name: "2ª Semana Acadêmica do Curso de Educação Especial e 10ª Semana de Acessibilidade e Inclusão",
        kind: "Semana acadêmica",
        year: 2024,
      },
      {
        name: "A Inclusão da Pessoa com Deficiência — do trabalho social com famílias à inclusão no mundo do trabalho",
        kind: "Palestra",
        year: 2024,
      },
      {
        name: "Práticas pedagógicas e sustentabilidade no fazer docente",
        kind: "Semana acadêmica",
        year: 2024,
      },
    ],
  },
  contact: {
    title: "Vamos conversar?",
    text: "Estou aberta a novas oportunidades em escolas e a conversas com coordenações e famílias.",
    links: [
      { kind: "email", label: "E-mail", href: "mailto:gabrieliaparecidacunha123@gmail.com" },
      { kind: "lattes", label: "Currículo Lattes", href: LATTES_URL },
    ],
  },
};
