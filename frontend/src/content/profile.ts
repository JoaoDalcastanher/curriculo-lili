// ─────────────────────────────────────────────────────────────────────────────
// CONTEÚDO DO SITE — edite aqui.
// Todo o texto que aparece na página vem deste arquivo; os componentes não têm
// nenhum conteúdo fixo (ADR-0008). Os textos abaixo são PROVISÓRIOS: troque pelos
// dados reais da Lili.
// ─────────────────────────────────────────────────────────────────────────────

import type { Profile } from "@/models/profile";

export const profile: Profile = {
  name: "Lili",
  fullName: "Nome Completo da Lili",
  title: "Professora",
  tagline: "Ensinar é plantar curiosidade e ver florescer a vontade de aprender.",
  location: "Brasil",
  photoUrl: null,
  about: [
    "Sou professora apaixonada por transformar a sala de aula em um lugar de descoberta, afeto e confiança. Acredito que cada criança aprende de um jeito — e que o papel de quem ensina é encontrar esse caminho junto com ela.",
    "No dia a dia, combino planejamento cuidadoso com escuta atenta: projetos, brincadeiras, leitura e muita conversa para que o conhecimento faça sentido de verdade.",
  ],
  quote: {
    text: "Ninguém educa ninguém, ninguém educa a si mesmo, os homens se educam entre si, mediatizados pelo mundo.",
    author: "Paulo Freire",
  },
  teachingSince: "2016-02",
  subjects: [
    "Educação Infantil",
    "Alfabetização",
    "Ensino Fundamental I",
    "Projetos Interdisciplinares",
    "Educação Inclusiva",
  ],
  values: [
    {
      icon: "heart",
      title: "Afeto que ensina",
      description: "Vínculo e acolhimento são o ponto de partida para qualquer aprendizagem.",
    },
    {
      icon: "sprout",
      title: "Cada um no seu tempo",
      description: "Respeito ao ritmo de cada estudante, com acompanhamento próximo e individual.",
    },
    {
      icon: "lightbulb",
      title: "Curiosidade em primeiro lugar",
      description: "Perguntas viram projetos; projetos viram descobertas que ficam para a vida.",
    },
    {
      icon: "chat",
      title: "Parceria com as famílias",
      description: "Comunicação aberta e constante para caminharmos juntos.",
    },
  ],
  experiences: [
    {
      role: "Professora Regente",
      institution: "Escola Exemplo",
      location: "Cidade — UF",
      start: "2021-02",
      end: null,
      description:
        "Responsável por turma do Ensino Fundamental I, com foco em alfabetização e letramento.",
      highlights: [
        "Projeto de leitura com as famílias",
        "Planejamento por projetos interdisciplinares",
      ],
    },
    {
      role: "Professora de Educação Infantil",
      institution: "Colégio Exemplo",
      location: "Cidade — UF",
      start: "2018-02",
      end: "2020-12",
      description: "Turmas de 4 e 5 anos, com rotina baseada no brincar e na investigação.",
      highlights: ["Horta pedagógica", "Mostra cultural anual"],
    },
    {
      role: "Auxiliar de Classe",
      institution: "Escola Exemplo",
      location: "Cidade — UF",
      start: "2016-02",
      end: "2017-12",
      description: "Apoio pedagógico e acompanhamento de estudantes com necessidades específicas.",
      highlights: [],
    },
  ],
  education: [
    {
      degree: "Pós-graduação em Psicopedagogia",
      institution: "Universidade Exemplo",
      start: "2019-03",
      end: "2020-12",
      note: null,
    },
    {
      degree: "Licenciatura em Pedagogia",
      institution: "Universidade Exemplo",
      start: "2013-02",
      end: "2016-12",
      note: "Trabalho de conclusão sobre alfabetização e ludicidade",
    },
  ],
  contacts: [
    { kind: "email", label: "lili@exemplo.com", href: "mailto:lili@exemplo.com" },
    { kind: "instagram", label: "@lili.professora", href: "https://instagram.com/" },
    { kind: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/" },
  ],
};
