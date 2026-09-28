// ─────────────────────────────────────────────────────────────────────────────
// CONTEÚDO DO SITE — edite aqui.
// Todo o texto que aparece na página vem deste arquivo; os componentes não têm
// conteúdo fixo (ADR-0008). Textos vindos do design do Claude Design — revise
// escolas, projetos, cursos e contatos com os dados reais.
//
// Fotos: coloque os arquivos em `frontend/public/fotos/` e troque `src: null`
// por `src: "/fotos/nome-do-arquivo.jpg"`. Enquanto `src` for null, o site
// mostra um espaço reservado com a dica (`hint`).
// Projetos: use fotos de mãos, materiais, trabalhos e ambientes, ou crianças
// de costas — nunca rostos de alunos identificáveis.
// ─────────────────────────────────────────────────────────────────────────────

import type { Photo, Profile, Project } from "@/models/profile";

function placeholder(hint: string, alt: string): Photo {
  return { src: null, alt, hint };
}

function gallery(projectTitle: string, hints: string[]): Photo[] {
  return hints.map((hint) => placeholder(`foto: ${hint}`, `${projectTitle}: ${hint}`));
}

const projects: Project[] = [
  {
    id: "horta",
    title: "Horta na escola",
    group: "Pré II · 5 anos",
    year: 2025,
    tags: ["Ciências", "Família"],
    summary:
      "Da semente à colheita: a turma cuidou de uma horta e levou os alimentos para a merenda.",
    goal: "Investigar como as plantas nascem e crescem, desenvolvendo observação, cuidado com o ambiente e hábitos de alimentação saudável.",
    cover: placeholder("foto: mãos plantando mudas", "Mãos de crianças plantando mudas"),
    steps: [
      {
        title: "Roda de conversa",
        description:
          "Levantamos o que as crianças já sabiam sobre plantas e de onde vêm os alimentos.",
      },
      {
        title: "Preparo dos canteiros",
        description:
          "Com apoio das famílias, preparamos a terra e escolhemos as sementes: alface, cenoura, cheiro-verde e girassol.",
      },
      {
        title: "Diário de observação",
        description: "Toda semana a turma media, desenhava e registrava o crescimento das mudas.",
      },
      {
        title: "Colheita e partilha",
        description:
          "Colhemos os alimentos, preparamos uma salada com a cozinha da escola e convidamos as famílias.",
      },
    ],
    learnings: [
      "Noções do ciclo de vida das plantas",
      "Medidas com barbante e régua",
      "Diário de campo coletivo com desenhos e escrita espontânea",
      "Receitas ilustradas levadas para casa",
    ],
    gallery: gallery("Horta na escola", [
      "canteiros com plaquinhas",
      "diário de observação aberto",
      "regador e ferramentas",
      "mudas em copinhos",
      "colheita em cestos",
    ]),
    testimonial: {
      text: "Meu filho passou a querer ajudar na feira e a perguntar de onde vem cada alimento. Foi lindo acompanhar.",
      author: "Mãe de aluno do Pré II",
    },
  },
  {
    id: "sacola",
    title: "Sacola viajante de leitura",
    group: "1º ano · 6 anos",
    year: 2024,
    tags: ["Leitura", "Família"],
    summary: "Uma sacola com livros e um caderno de registros que visitou a casa de cada criança.",
    goal: "Aproximar as famílias das práticas de leitura e fortalecer o gosto pelos livros no início da alfabetização.",
    cover: placeholder("foto: sacola de tecido com livros", "Sacola de tecido com livros"),
    steps: [
      {
        title: "Montagem da sacola",
        description: "A turma escolheu os livros e decorou a sacola e o caderno de registros.",
      },
      {
        title: "Rodízio semanal",
        description: "Cada criança levou a sacola para casa por uma semana para ler com a família.",
      },
      {
        title: "Registro em família",
        description:
          "No caderno, as famílias contavam como foi a leitura, com desenhos, colagens e escritas.",
      },
      {
        title: "Roda de partilha",
        description: "De volta à sala, a criança apresentava o livro e o registro para os colegas.",
      },
    ],
    learnings: [
      "Leitura compartilhada em casa e na escola",
      "Reconto oral com sequência de fatos",
      "Primeiras escritas de títulos e nomes de personagens",
      "Caderno coletivo com 26 registros de família",
    ],
    gallery: gallery("Sacola viajante de leitura", [
      "caderno de registros aberto",
      "livros espalhados no tapete",
      "desenhos feitos pelas famílias",
      "cantinho de leitura da sala",
    ]),
    testimonial: {
      text: "A sacola virou um momento esperado aqui em casa. Até o irmão mais velho quis participar.",
      author: "Família do 1º ano",
    },
  },
  {
    id: "cientistas",
    title: "Pequenos cientistas",
    group: "Pré I · 4 anos",
    year: 2024,
    tags: ["Ciências", "Artes"],
    summary: "Experimentos simples com água, luz e sombra para responder às perguntas da turma.",
    goal: "Estimular a investigação a partir das perguntas das crianças, com hipóteses, testes e registro das descobertas.",
    cover: placeholder("foto: potes com água colorida", "Potes com água colorida"),
    steps: [
      {
        title: "Caixa de perguntas",
        description:
          "As crianças registraram suas dúvidas sobre o mundo e escolhemos juntas o que investigar.",
      },
      {
        title: "Hipóteses",
        description: "Antes de cada experimento, a turma dizia o que achava que ia acontecer.",
      },
      {
        title: "Experimentos",
        description:
          "Misturas de cores, objetos que afundam ou flutuam e teatro de sombras com lanternas.",
      },
      {
        title: "Exposição",
        description:
          "Montamos um painel com fotos, desenhos e as conclusões ditadas pelas crianças.",
      },
    ],
    learnings: [
      "Formular hipóteses e comparar resultados",
      "Vocabulário: flutuar, afundar, misturar, refletir",
      "Painel coletivo de descobertas",
      "Teatro de sombras apresentado às outras turmas",
    ],
    gallery: gallery("Pequenos cientistas", [
      "lanterna e silhuetas na parede",
      "mãos misturando tintas",
      "lupas e elementos da natureza",
      "painel de descobertas",
      "caixa de perguntas",
      "crianças de costas diante do painel",
    ]),
    testimonial: null,
  },
  {
    id: "mostra",
    title: "Mostra cultural",
    group: "Pré II e 1º ano",
    year: 2023,
    tags: ["Artes", "Leitura", "Família"],
    summary:
      "Um percurso pela cultura popular brasileira que terminou em uma exposição aberta à comunidade.",
    goal: "Conhecer manifestações da cultura popular brasileira por meio de músicas, histórias, brincadeiras e artes visuais.",
    cover: placeholder("foto: máscaras penduradas no varal", "Máscaras penduradas no varal"),
    steps: [
      {
        title: "Pesquisa",
        description:
          "Cada turma escolheu uma região e pesquisou histórias, cantigas e brincadeiras com as famílias.",
      },
      {
        title: "Ateliê",
        description:
          "Produzimos máscaras, gravuras em isopor e bonecos inspirados no artesanato local.",
      },
      {
        title: "Ensaios",
        description: "As crianças prepararam cantigas e uma contação de história para apresentar.",
      },
      {
        title: "Dia da mostra",
        description: "A escola virou exposição, com visita guiada pelas próprias crianças.",
      },
    ],
    learnings: [
      "Repertório de cantigas e lendas brasileiras",
      "Técnicas de gravura e modelagem",
      "Apresentação oral para o público",
      "Exposição com mais de 60 trabalhos",
    ],
    gallery: gallery("Mostra cultural", [
      "gravuras em isopor",
      "bonecos de papel machê",
      "corredor da exposição",
      "instrumentos feitos com sucata",
      "mesa do ateliê com materiais",
    ]),
    testimonial: {
      text: "O projeto envolveu toda a escola e mostrou o protagonismo das crianças do começo ao fim.",
      author: "Coordenação pedagógica",
    },
  },
];

export const profile: Profile = {
  name: "Gabrieli",
  fullName: "Gabrieli Aparecida Cunha",
  title: "Professora",
  hero: {
    greeting: "olá, eu sou a",
    specialty: "Educação Infantil e Fundamental I",
    tagline: "Ensinar é plantar curiosidade e ver florescer a vontade de aprender",
    photo: placeholder("Retrato da Gabrieli", "Retrato da Gabrieli"),
    stats: [
      { value: 10, suffix: "+", label: "anos em sala de aula" },
      { value: 24, suffix: "", label: "projetos realizados" },
      { value: 4, suffix: "", label: "escolas" },
    ],
  },
  about: {
    lead: "Uma professora que aprende junto com a turma.",
    paragraphs: [
      "Sou pedagoga e professora há mais de dez anos, com experiência na Educação Infantil e nos anos iniciais do Ensino Fundamental. Acredito numa escola em que a criança é protagonista: ela pergunta, investiga, cria e aprende no encontro com o outro.",
      "Meu trabalho nasce da escuta. Planejo a partir dos interesses da turma, documento cada percurso e mantenho as famílias por perto, porque aprender é um processo que acontece dentro e fora da sala de aula.",
    ],
    areas: ["Educação Infantil", "Alfabetização", "Letramento", "Fundamental I"],
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
    lead: "Mais de dez anos entre a Educação Infantil e a alfabetização.",
    experiences: [
      {
        role: "Professora regente · Pré II",
        school: "Escola Nova Semente",
        period: { start: 2021, end: null },
        description:
          "Responsável por uma turma de 22 crianças de 5 anos. Planejamento por projetos, documentação pedagógica e encontros bimestrais com as famílias.",
      },
      {
        role: "Professora alfabetizadora · 1º ano",
        school: "Colégio Raízes",
        period: { start: 2018, end: 2021 },
        description:
          "Alfabetização e letramento com sequências didáticas, cantinho de leitura e acompanhamento individual das hipóteses de escrita.",
      },
      {
        role: "Professora auxiliar · Educação Infantil",
        school: "Escola Pequeno Mundo",
        period: { start: 2015, end: 2018 },
        description:
          "Apoio à professora regente em turmas de 3 e 4 anos, com foco em rotina, brincadeiras e inclusão.",
      },
      {
        role: "Estágio em docência",
        school: "Escola Municipal Jardim das Flores",
        period: { start: 2014, end: 2015 },
        description:
          "Estágio supervisionado na Educação Infantil e no 2º ano do Ensino Fundamental.",
      },
    ],
  },
  projects: {
    lead: "Percursos que nasceram das perguntas das crianças.",
    allLabel: "Todos",
    filters: ["Leitura", "Ciências", "Artes", "Família"],
    items: projects,
  },
  education: {
    degree: {
      kind: "Graduação",
      title: "Licenciatura em Pedagogia",
      institution: "Universidade Federal",
      period: { start: 2011, end: 2014 },
      note: "Trabalho de conclusão sobre o brincar como linguagem na Educação Infantil.",
    },
    coursesTitle: "Cursos complementares",
    courses: [
      { name: "Pós-graduação em Alfabetização e Letramento", hours: null, year: 2019 },
      { name: "Abordagem Reggio Emilia na prática", hours: 40, year: 2023 },
      { name: "BNCC na Educação Infantil", hours: 30, year: 2022 },
      { name: "Educação inclusiva e TEA", hours: 60, year: 2021 },
      { name: "Contação de histórias", hours: 20, year: 2020 },
      { name: "Primeiros socorros na escola", hours: 8, year: 2024 },
    ],
  },
  contact: {
    title: "Vamos conversar?",
    text: "Estou aberta a novas oportunidades em escolas e a conversas com coordenações e famílias.",
    links: [
      { kind: "email", label: "E-mail", href: "mailto:contato@gabrieli.com.br" },
      { kind: "instagram", label: "Instagram", href: "https://instagram.com/" },
      { kind: "linkedin", label: "LinkedIn", href: "https://linkedin.com/" },
    ],
  },
};
