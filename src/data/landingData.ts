export type Trilha = "minicurso" | "palestra" | "especial" | "intervalo";

export const TRILHAS: Record<Trilha, string> = {
  minicurso: "Minicurso",
  palestra: "Palestra",
  especial: "Especial",
  intervalo: "Intervalo",
};

export type Dia = {
  id: string;
  indice: number;
  rotulo: string;
  data: string;
  dataIso: string;
};

export type Local = {
  id: string;
  nome: string;
  detalhe: string;
};

export type Palestrante = {
  id: string;
  nome: string;
  cargo: string;
  bio: string;
  linkedin: string;
  fotoSrc: string;
};

export type Ministrante = {
  nome: string;
  linkedin: string;
};

export type Atividade = {
  id: string;
  titulo: string;
  trilha: Trilha;
  diaId: string;
  inicio: string;
  fim: string;
  localId: string;
  vagas: number | null;
  descricao: string;
  preRequisitos?: string;
  responsavel: string;
  ministrantes: Ministrante[];
  palestranteId: string;
  tema: string;
};

export type CategoriaMarca = "patrocinio" | "apoio" | "realizacao";

export type Marca = {
  id: string;
  categoria: CategoriaMarca;
  nome: string;
  href: string;
  logoSrc: string;
  tamanho: "sm" | "md" | "lg";
  fundo: "nenhum" | "claro";
};

export type Duvida = { id: string; pergunta: string; resposta: string };

export type Lote = {
  id: string;
  titulo: string;
  preco: string;
  detalhe: string;
  inclui: string[];
  destaque: boolean;
  href: string;
};

export type CartaoSobre = {
  id: string;
  logoSrc: string;
  titulo: string;
  texto: string;
};

export type Config = {
  edicao: number;
  ano: number;
  nome: string;
  nomeCompleto: string;
  descricao: string;
  url: string;
  dataInicio: string;
  dataFim: string;
  periodoLegivel: string;
  inscricaoUrl: string;
  rotuloInscricao: string;
  heroiTitulo: string;
  heroiSubtitulo: string;
  heroiTexto: string;
  gradeAbertura: string;
  gradeEncerramento: string;
  gradePasso: number;
  avisoProgramacao: string;
  mapsEmbedUrl: string;
  contatoEmail: string;
  contatoTelefone: string;
  contatoTelefoneLegivel: string;
  endereco: string[];
  politicaUrl: string;
  pagamentoRazaoSocial: string;
  pagamentoPix: string;
  pagamentoBanco: string;
  pagamentoAgencia: string;
  pagamentoConta: string;
};

export type Conteudo = {
  config: Config;
  dias: Dia[];
  locais: Local[];
  palestrantes: Palestrante[];
  atividades: Atividade[];
  marcas: Marca[];
  sobre: CartaoSobre[];
  lotes: Lote[];
  duvidas: Duvida[];
};

export const landingData: Conteudo = {
  config: {
    edicao: 23,
    ano: 2026,
    nome: "SECOMPP26",
    nomeCompleto: "23ª Semana do Curso de Ciência da Computação da FCT-Unesp",
    descricao: "A Semana da Computação da FCT/UNESP Presidente Prudente reúne palestras, minicursos práticos, mesas redondas e certificação oficial.",
    url: "https://evcomp.secompp.com.br",
    dataInicio: "2026-09-28",
    dataFim: "2026-10-02",
    periodoLegivel: "28 de setembro a 02 de outubro de 2026",
    inscricaoUrl: "/cadastro",
    rotuloInscricao: "Garantir Inscrição",
    heroiTitulo: "Semana da Computação",
    heroiSubtitulo: "de Presidente Prudente",
    heroiTexto: "Junte-se a nós de 28 de setembro a 02 de outubro de 2026 na FCT/UNESP",
    gradeAbertura: "08:00",
    gradeEncerramento: "22:00",
    gradePasso: 30,
    avisoProgramacao: "Cada espaço/laboratório possui sua própria coluna: minicursos simultâneos não se sobrepõem. As palestras magnas acontecem no Auditório do Bloco V.",
    mapsEmbedUrl: "https://maps.google.com/maps?q=Faculdade+de+Ci%C3%AAncias+e+Tecnologia+UNESP+Presidente+Prudente&t=&z=16&ie=UTF8&iwloc=&output=embed",
    contatoEmail: "secompp.fct@unesp.br",
    contatoTelefone: "+551832295600",
    contatoTelefoneLegivel: "(18) 3229-5600",
    endereco: [
      "FCT – Faculdade de Ciências e Tecnologia",
      'Universidade Estadual Paulista "Júlio de Mesquita Filho"',
      "Rua Roberto Simonsen, 305",
      "Presidente Prudente - SP",
      "19060-900",
    ],
    politicaUrl: "/privacidade",
    pagamentoRazaoSocial: "FUNDACTE - Fundação de Ciência Tecnologia e Ensino",
    pagamentoPix: "00.395.519/0001-16",
    pagamentoBanco: "Banco 033 - Santander",
    pagamentoAgencia: "4299",
    pagamentoConta: "13001302-0",
  },

  dias: [
    { id: "d1", indice: 1, rotulo: "Segunda", data: "28/09", dataIso: "2026-09-28" },
    { id: "d2", indice: 2, rotulo: "Terça", data: "29/09", dataIso: "2026-09-29" },
    { id: "d3", indice: 3, rotulo: "Quarta", data: "30/09", dataIso: "2026-09-30" },
    { id: "d4", indice: 4, rotulo: "Quinta", data: "01/10", dataIso: "2026-10-01" },
    { id: "d5", indice: 5, rotulo: "Sexta", data: "02/10", dataIso: "2026-10-02" },
  ],

  locais: [
    { id: "lab6", nome: "Lab. 06", detalhe: "Discente I" },
    { id: "lab10", nome: "Lab. 10", detalhe: "Discente I" },
    { id: "s5b", nome: "Sala 5B", detalhe: "Central" },
    { id: "s6b", nome: "Sala 6B", detalhe: "Central" },
    { id: "anf1", nome: "Anfiteatro 1", detalhe: "Anfiteatro" },
    { id: "aud", nome: "Auditório", detalhe: "Bloco V" },
  ],

  palestrantes: [
    {
      id: "pal1",
      nome: "Luciana Miranda",
      cargo: "Partner, COO e CMO da AP Digital Services · Cofundadora da CFly",
      bio: "Luciana Miranda é Partner, COO e CMO da AP Digital Services e cofundadora da CFly. Com mais de 20 anos de experiência em transformação digital, inovação, estratégia, dados, inteligência artificial e experiência do cliente (CX), construiu uma carreira liderando iniciativas de alto impacto em empresas como CI&T, Accenture e AP Digital Services.",
      linkedin: "https://www.linkedin.com/in/lucianamirandabarbosa/",
      fotoSrc: "/assets/palestrante-luciana.webp",
    },
    {
      id: "pal2",
      nome: "Prof. Dr. Allan Pscheidt",
      cargo: "Pesquisador PhD · Top 10 Global Edutainment Creator",
      bio: "O Prof. Dr. Allan Pscheidt é um insider da tecnologia e pesquisador PhD que atua na interseção estratégica entre Ciência, IA e Educação Corporativa. Reconhecido como Top 10 Global Edutainment Creator, orienta tomadores de decisão a implementarem tecnologias emergentes com foco em ética e ROI.",
      linkedin: "https://www.linkedin.com/in/allanpscheidt/",
      fotoSrc: "/assets/palestrante-allan.webp",
    },
    {
      id: "pal3",
      nome: "Thiago Lima",
      cargo: "Partner, Diretor Comercial e de Marketing da DSC — Digital Supply Chain",
      bio: "Thiago Lima é Partner e Diretor Comercial e de Marketing da DSC (Digital Supply Chain). Formado em Ciência da Computação pela UNESP, atua na interseção entre tecnologia, negócios e inteligência artificial aplicada ao planejamento e precificação na indústria.",
      linkedin: "https://www.linkedin.com/in/thiagoglima/",
      fotoSrc: "/assets/palestrante-thiago.webp",
    },
    {
      id: "pal4",
      nome: "Matheus Rocha",
      cargo: "Analytics Engineer, Data Engineer e Engineering Lead na Factored",
      bio: "Matheus Rocha é Analytics Engineer, Data Engineer e Engineering Lead na Factored, empresa global de engenharia de dados e IA. Com formação em Ohio University e raízes em Presidente Prudente, possui sólida experiência técnica em Python, SQL, Databricks e dbt.",
      linkedin: "https://www.linkedin.com/in/rochamat/",
      fotoSrc: "/assets/palestrante-matheus.webp",
    },
  ],

  atividades: [
  {
    "id": "a-apisp1",
    "titulo": "Consumo de APIs e Análise de Dados na Prática — Parte 1 de 2",
    "trilha": "minicurso",
    "diaId": "d1",
    "inicio": "08:00",
    "fim": "12:00",
    "localId": "s5b",
    "vagas": null,
    "descricao": "Os participantes aprendem a extrair dados reais da web com Python, conectando-se a uma API pública para coletar estatísticas e processá-las em JSON. Ao final, cada um monta um script simples para analisar as informações e extrair estatísticas relevantes, unindo programação e análise de dados na prática.\n\nNível: Básico · Carga horária total: 8 horas.",
    "responsavel": "Victor Bortoletto Zucherato e Felipe Wunder Giovaneli",
    "ministrantes": [
      {
        "nome": "Victor Bortoletto Zucherato",
        "linkedin": "https://www.linkedin.com/in/victor-zucherato/"
      },
      {
        "nome": "Felipe Wunder Giovaneli",
        "linkedin": "https://www.linkedin.com/in/felipe-wunder-giovaneli-108688244/"
      }
    ],
    "palestranteId": "",
    "tema": ""
  },
  {
    "id": "a-qa",
    "titulo": "Missão QA - Fundamentos de teste de software",
    "trilha": "minicurso",
    "diaId": "d1",
    "inicio": "08:00",
    "fim": "12:00",
    "localId": "s6b",
    "vagas": null,
    "descricao": "Conceitos de testes de software, o papel do QA no processo de desenvolvimento e a importância da qualidade nas entregas. São introduzidos também User Stories, usados para descrever requisitos, e Gherkin, empregado na escrita estruturada de cenários de teste.\n\nNível: Básico · Carga horária total: 4 horas.",
    "responsavel": "Maria Isabelly da Silva Andrade, Maria Julia Varga Sita e Mary Adryany Duarte Gonçalves da Silva",
    "ministrantes": [
      {
        "nome": "Maria Isabelly da Silva Andrade",
        "linkedin": ""
      },
      {
        "nome": "Maria Julia Varga Sita",
        "linkedin": ""
      },
      {
        "nome": "Mary Adryany Duarte Gonçalves da Silva",
        "linkedin": ""
      }
    ],
    "palestranteId": "",
    "tema": ""
  },
  {
    "id": "a-matp1",
    "titulo": "Matemática aplicada para ciência de dados — Parte 1 de 2",
    "trilha": "minicurso",
    "diaId": "d1",
    "inicio": "08:00",
    "fim": "12:00",
    "localId": "lab6",
    "vagas": null,
    "descricao": "Uma leitura da ciência de dados pela ótica matemática: tratamento e interpretação de dados a partir da linguagem matemática, com aplicação prática em Excel.\n\nNível: Intermediário · Carga horária total: 8 horas.",
    "responsavel": "Caio Silva Nestlehner",
    "ministrantes": [
      {
        "nome": "Caio Silva Nestlehner",
        "linkedin": "https://www.linkedin.com/in/caio-silva-nestlehner-bb6b40344"
      }
    ],
    "palestranteId": "",
    "tema": ""
  },
  {
    "id": "a-hwp1",
    "titulo": "Hardware e Manutenção de Computadores - Um Guia de Boas Práticas — Parte 1 de 2",
    "trilha": "minicurso",
    "diaId": "d1",
    "inicio": "14:00",
    "fim": "18:00",
    "localId": "s5b",
    "vagas": null,
    "descricao": "Introdução prática a hardware e manutenção de computadores: manipulação de peças, compatibilidade de componentes, montagem e manutenção de máquinas.\n\nNível: Básico · Carga horária total: 8 horas.",
    "responsavel": "Paulo Celso dos Santos Júnior",
    "ministrantes": [
      {
        "nome": "Paulo Celso dos Santos Júnior",
        "linkedin": "https://www.linkedin.com/in/paulocelsojunior/"
      }
    ],
    "palestranteId": "",
    "tema": ""
  },
  {
    "id": "a-agentesp1",
    "titulo": "Agentes de IA para Engenharia de Software — Parte 1 de 2",
    "trilha": "minicurso",
    "diaId": "d1",
    "inicio": "14:00",
    "fim": "18:00",
    "localId": "s6b",
    "vagas": null,
    "descricao": "Conceitos básicos para começar a usar agentes de IA (LLM) em práticas de engenharia de software, com uma abordagem conservadora que aponta os riscos e incentiva o uso consciente da ferramenta.\n\nNível: Básico · Carga horária total: 8 horas.",
    "responsavel": "Guilherme de Aguiar Pacianotto",
    "ministrantes": [
      {
        "nome": "Guilherme de Aguiar Pacianotto",
        "linkedin": "https://www.linkedin.com/in/guilherme-pacianotto/"
      }
    ],
    "palestranteId": "",
    "tema": ""
  },
  {
    "id": "a-llm",
    "titulo": "Introdução a LLMs",
    "trilha": "minicurso",
    "diaId": "d1",
    "inicio": "14:00",
    "fim": "18:00",
    "localId": "lab6",
    "vagas": null,
    "descricao": "Fundamentos técnicos dos Large Language Models: as três famílias de arquitetura (decoders autoregressivos, encoders bidirecionais e encoder-decoders), os algoritmos de decodificação (amostragem aleatória, top-k e nucleus sampling) e o papel da temperatura.\n\nO paradigma de pré-treinamento é explorado em profundidade, junto de engenharia de dados para corpora, métricas como perplexidade, scaling laws e fine-tuning eficiente em parâmetros, com destaque para o LoRA.\n\nNível: Avançado · Carga horária total: 4 horas.",
    "responsavel": "Daniel Henrique Peres Servejeira e João Gabriel de Morais Bezerra",
    "ministrantes": [
      {
        "nome": "Daniel Henrique Peres Servejeira",
        "linkedin": "https://www.linkedin.com/in/danielservejeira/"
      },
      {
        "nome": "João Gabriel de Morais Bezerra",
        "linkedin": "https://www.linkedin.com/in/joaobezcerra/"
      }
    ],
    "palestranteId": "",
    "tema": ""
  },
  {
    "id": "a-vlab",
    "titulo": "Vlab",
    "trilha": "especial",
    "diaId": "d2",
    "inicio": "08:00",
    "fim": "12:00",
    "localId": "s5b",
    "vagas": null,
    "descricao": "Minicurso oferecido pela Vlab, patrocinadora da SECOMPP26. Conteúdo detalhado divulgado em breve.\n\nCarga horária total: 4 horas.",
    "responsavel": "Vlab",
    "ministrantes": [],
    "palestranteId": "",
    "tema": ""
  },
  {
    "id": "a-redes",
    "titulo": "Redes de Computadores - Uma das abordagens já feitas",
    "trilha": "minicurso",
    "diaId": "d2",
    "inicio": "08:00",
    "fim": "12:00",
    "localId": "s6b",
    "vagas": null,
    "descricao": "Redes de computadores da história à prática: teoria, protocolos e aplicações, com atividades de crimpagem e teste de cabos.\n\nNível: Básico · Carga horária total: 4 horas.",
    "responsavel": "Paulo Celso dos Santos Júnior",
    "ministrantes": [
      {
        "nome": "Paulo Celso dos Santos Júnior",
        "linkedin": "https://www.linkedin.com/in/paulocelsojunior/"
      }
    ],
    "palestranteId": "",
    "tema": ""
  },
  {
    "id": "a-md",
    "titulo": "Markdown, GitHub e Obsidian: Documentação e Organização do Conhecimento",
    "trilha": "minicurso",
    "diaId": "d2",
    "inicio": "08:00",
    "fim": "12:00",
    "localId": "lab10",
    "vagas": null,
    "descricao": "Introdução prática a três ferramentas de documentação e gestão do conhecimento: Markdown, como linguagem de marcação; GitHub, para armazenamento, versionamento e sincronização dos documentos; e Obsidian, para criar e organizar um cofre de notas.\n\nAo final, o participante sai com um ambiente integrado de documentação já montado.\n\nNível: Básico · Carga horária total: 4 horas.",
    "responsavel": "Abigail Sayury Nakashima",
    "ministrantes": [
      {
        "nome": "Abigail Sayury Nakashima",
        "linkedin": "https://www.linkedin.com/in/abigail-sayury-nakashima"
      }
    ],
    "palestranteId": "",
    "tema": ""
  },
  {
    "id": "a-femap1",
    "titulo": "Machine Learning com Método de Elementos Finitos — Parte 1 de 2",
    "trilha": "minicurso",
    "diaId": "d2",
    "inicio": "08:00",
    "fim": "12:00",
    "localId": "lab6",
    "vagas": null,
    "descricao": "Conceitos de machine learning e o funcionamento do framework FEMa, que usa o método de elementos finitos para aprendizado supervisionado.\n\nNível: Intermediário · Carga horária total: 8 horas.",
    "responsavel": "Gustavo Leão Pontes Nunes, Rennan Furlaneto Collado, João Pedro Biffe Lopes Pedroso e Yan Felipe Dutra Martins",
    "ministrantes": [
      {
        "nome": "Gustavo Leão Pontes Nunes",
        "linkedin": "https://www.linkedin.com/in/gustavo-le%C3%A3o-pontes-nunes-829ab4320"
      },
      {
        "nome": "Rennan Furlaneto Collado",
        "linkedin": "https://br.linkedin.com/in/rennancollado"
      },
      {
        "nome": "João Pedro Biffe Lopes Pedroso",
        "linkedin": "https://www.linkedin.com/in/jo%C3%A3o-pedro-pedroso-b7a278408"
      },
      {
        "nome": "Yan Felipe Dutra Martins",
        "linkedin": "https://www.linkedin.com/in/yan-fdutra"
      }
    ],
    "palestranteId": "",
    "tema": ""
  },
  {
    "id": "a-pentestp1",
    "titulo": "Introdução ao Pentest: Teoria e Prática com TryHackMe — Parte 1 de 2",
    "trilha": "minicurso",
    "diaId": "d2",
    "inicio": "14:00",
    "fim": "18:00",
    "localId": "s5b",
    "vagas": null,
    "descricao": "Primeiro dia (teoria): base de segurança com demonstrações ao vivo no terminal, abordagem ética, leis brasileiras, mapeamento de alvos com Nmap, identificação de vulnerabilidades e o conceito de shell reversa.\n\nNível: Básico · Carga horária total: 8 horas.",
    "responsavel": "Nicolas Fernando da Silva, Nathan Alves da Cruz Silveira e Lucas Henrique Gregorio",
    "ministrantes": [
      {
        "nome": "Nicolas Fernando da Silva",
        "linkedin": "https://www.linkedin.com/in/nicolas-silva-637a4b3a4"
      },
      {
        "nome": "Nathan Alves da Cruz Silveira",
        "linkedin": "https://www.linkedin.com/in/nathan-alves-da-cruz-silveira-16001a304"
      },
      {
        "nome": "Lucas Henrique Gregorio",
        "linkedin": "https://www.linkedin.com/in/lucas-henrique-gregorio-a26a38354"
      }
    ],
    "palestranteId": "",
    "tema": ""
  },
  {
    "id": "a-luap1",
    "titulo": "Introdução à Linguagem Lua e Padrões Avançados — Parte 1 de 2",
    "trilha": "minicurso",
    "diaId": "d2",
    "inicio": "14:00",
    "fim": "18:00",
    "localId": "s6b",
    "vagas": null,
    "descricao": "Conceitos básicos da linguagem Lua, codificação UTF-8, expressões regulares próprias da linguagem, manipulação de arquivos e execução concomitante, além de padrões de projeto aplicados à engenharia de software.\n\nNível: Intermediário · Carga horária total: 8 horas.",
    "responsavel": "Vinícius Andrei Parra Castilho e Cleiton Santana da Silva",
    "ministrantes": [
      {
        "nome": "Vinícius Andrei Parra Castilho",
        "linkedin": "https://br.linkedin.com/in/vin%C3%ADcius-andrei-parra-castilho-37439336a"
      },
      {
        "nome": "Cleiton Santana da Silva",
        "linkedin": "https://www.linkedin.com/in/clesantana/"
      }
    ],
    "palestranteId": "",
    "tema": ""
  },
  {
    "id": "a-aws",
    "titulo": "AWS EC2 e Cloud Computing Distribuída",
    "trilha": "minicurso",
    "diaId": "d2",
    "inicio": "14:00",
    "fim": "18:00",
    "localId": "lab10",
    "vagas": null,
    "descricao": "Subir e rodar instâncias computacionais na nuvem EC2 da AWS: criação das máquinas, grupos de segurança, IPs e acesso remoto.\n\nNível: Intermediário · Carga horária total: 4 horas.",
    "responsavel": "Pedro Henrique Milani Vagula",
    "ministrantes": [
      {
        "nome": "Pedro Henrique Milani Vagula",
        "linkedin": "https://www.linkedin.com/in/pedromilanidev/"
      }
    ],
    "palestranteId": "",
    "tema": ""
  },
  {
    "id": "a-apisp2",
    "titulo": "Consumo de APIs e Análise de Dados na Prática — Parte 2 de 2",
    "trilha": "minicurso",
    "diaId": "d3",
    "inicio": "08:00",
    "fim": "12:00",
    "localId": "s5b",
    "vagas": null,
    "descricao": "Os participantes aprendem a extrair dados reais da web com Python, conectando-se a uma API pública para coletar estatísticas e processá-las em JSON. Ao final, cada um monta um script simples para analisar as informações e extrair estatísticas relevantes, unindo programação e análise de dados na prática.\n\nNível: Básico · Carga horária total: 8 horas.",
    "responsavel": "Victor Bortoletto Zucherato e Felipe Wunder Giovaneli",
    "ministrantes": [
      {
        "nome": "Victor Bortoletto Zucherato",
        "linkedin": "https://www.linkedin.com/in/victor-zucherato/"
      },
      {
        "nome": "Felipe Wunder Giovaneli",
        "linkedin": "https://www.linkedin.com/in/felipe-wunder-giovaneli-108688244/"
      }
    ],
    "palestranteId": "",
    "tema": ""
  },
  {
    "id": "a-cnn",
    "titulo": "Introdução à redes neurais para classificação de Imagens",
    "trilha": "minicurso",
    "diaId": "d3",
    "inicio": "08:00",
    "fim": "12:00",
    "localId": "s6b",
    "vagas": null,
    "descricao": "Fundamentos teóricos e práticos das Redes Neurais Convolucionais aplicadas à classificação de imagens, partindo do processamento digital de imagens até a implementação de um modelo completo — convolução, ReLU, pooling e flatten layer.\n\nNível: Intermediário · Carga horária total: 4 horas.",
    "responsavel": "Bruno Augusto Furquim",
    "ministrantes": [
      {
        "nome": "Bruno Augusto Furquim",
        "linkedin": "https://www.linkedin.com/in/bruno-furquim-dev/"
      }
    ],
    "palestranteId": "",
    "tema": ""
  },
  {
    "id": "a-matp2",
    "titulo": "Matemática aplicada para ciência de dados — Parte 2 de 2",
    "trilha": "minicurso",
    "diaId": "d3",
    "inicio": "08:00",
    "fim": "12:00",
    "localId": "lab6",
    "vagas": null,
    "descricao": "Uma leitura da ciência de dados pela ótica matemática: tratamento e interpretação de dados a partir da linguagem matemática, com aplicação prática em Excel.\n\nNível: Intermediário · Carga horária total: 8 horas.",
    "responsavel": "Caio Silva Nestlehner",
    "ministrantes": [
      {
        "nome": "Caio Silva Nestlehner",
        "linkedin": "https://www.linkedin.com/in/caio-silva-nestlehner-bb6b40344"
      }
    ],
    "palestranteId": "",
    "tema": ""
  },
  {
    "id": "a-hwp2",
    "titulo": "Hardware e Manutenção de Computadores - Um Guia de Boas Práticas — Parte 2 de 2",
    "trilha": "minicurso",
    "diaId": "d3",
    "inicio": "14:00",
    "fim": "18:00",
    "localId": "s5b",
    "vagas": null,
    "descricao": "Segundo encontro, dedicado à parte prática com kits de componentes: placa-mãe, processador, memória RAM, SSD, fonte e cabeamento.\n\nNível: Básico · Carga horária total: 8 horas.",
    "responsavel": "Paulo Celso dos Santos Júnior",
    "ministrantes": [
      {
        "nome": "Paulo Celso dos Santos Júnior",
        "linkedin": "https://www.linkedin.com/in/paulocelsojunior/"
      }
    ],
    "palestranteId": "",
    "tema": ""
  },
  {
    "id": "a-agentesp2",
    "titulo": "Agentes de IA para Engenharia de Software — Parte 2 de 2",
    "trilha": "minicurso",
    "diaId": "d3",
    "inicio": "14:00",
    "fim": "18:00",
    "localId": "s6b",
    "vagas": null,
    "descricao": "Conceitos básicos para começar a usar agentes de IA (LLM) em práticas de engenharia de software, com uma abordagem conservadora que aponta os riscos e incentiva o uso consciente da ferramenta.\n\nNível: Básico · Carga horária total: 8 horas.",
    "responsavel": "Guilherme de Aguiar Pacianotto",
    "ministrantes": [
      {
        "nome": "Guilherme de Aguiar Pacianotto",
        "linkedin": "https://www.linkedin.com/in/guilherme-pacianotto/"
      }
    ],
    "palestranteId": "",
    "tema": ""
  },
  {
    "id": "a-linux",
    "titulo": "Introdução ao Linux",
    "trilha": "minicurso",
    "diaId": "d3",
    "inicio": "14:00",
    "fim": "18:00",
    "localId": "lab6",
    "vagas": null,
    "descricao": "Princípios de sistemas operacionais com enfoque em Linux: kernel, terminal e distribuições, além de tópicos e discussões importantes para entender o sistema.\n\nNível: Básico · Carga horária total: 4 horas.",
    "responsavel": "Luis Miguel Flauzino de Castro e Filipe Schausst de Medeiros",
    "ministrantes": [
      {
        "nome": "Luis Miguel Flauzino de Castro",
        "linkedin": ""
      },
      {
        "nome": "Filipe Schausst de Medeiros",
        "linkedin": "https://www.linkedin.com/in/filipe-schausst"
      }
    ],
    "palestranteId": "",
    "tema": ""
  },
  {
    "id": "a-inspectral",
    "titulo": "Inspectral",
    "trilha": "especial",
    "diaId": "d4",
    "inicio": "08:00",
    "fim": "12:00",
    "localId": "s5b",
    "vagas": null,
    "descricao": "Minicurso oferecido pela Inspectral, patrocinadora da SECOMPP26. Conteúdo detalhado divulgado em breve.\n\nCarga horária total: 4 horas.",
    "responsavel": "Inspectral",
    "ministrantes": [],
    "palestranteId": "",
    "tema": ""
  },
  {
    "id": "a-raylib",
    "titulo": "Desenvolvimento de Jogos em C usando Raylib",
    "trilha": "minicurso",
    "diaId": "d4",
    "inicio": "08:00",
    "fim": "12:00",
    "localId": "s6b",
    "vagas": null,
    "descricao": "O básico do desenvolvimento de jogos usando a biblioteca Raylib e a linguagem C. Depois de uma breve introdução teórica à biblioteca, o restante do minicurso é uma atividade prática em que a turma desenvolve um jogo de forma didática.\n\nNível: Básico · Carga horária total: 4 horas.",
    "responsavel": "Filipe Schausst de Medeiros e Artur Vinícius Santos Silveira",
    "ministrantes": [
      {
        "nome": "Filipe Schausst de Medeiros",
        "linkedin": "https://www.linkedin.com/in/filipe-schausst"
      },
      {
        "nome": "Artur Vinícius Santos Silveira",
        "linkedin": "https://www.linkedin.com/in/artur-vin%C3%ADcius-santos-silveira-100479321"
      }
    ],
    "palestranteId": "",
    "tema": ""
  },
  {
    "id": "a-femap2",
    "titulo": "Machine Learning com Método de Elementos Finitos — Parte 2 de 2",
    "trilha": "minicurso",
    "diaId": "d4",
    "inicio": "08:00",
    "fim": "12:00",
    "localId": "lab6",
    "vagas": null,
    "descricao": "Conceitos de machine learning e o funcionamento do framework FEMa, que usa o método de elementos finitos para aprendizado supervisionado.\n\nNível: Intermediário · Carga horária total: 8 horas.",
    "responsavel": "Gustavo Leão Pontes Nunes, Rennan Furlaneto Collado, João Pedro Biffe Lopes Pedroso e Yan Felipe Dutra Martins",
    "ministrantes": [
      {
        "nome": "Gustavo Leão Pontes Nunes",
        "linkedin": "https://www.linkedin.com/in/gustavo-le%C3%A3o-pontes-nunes-829ab4320"
      },
      {
        "nome": "Rennan Furlaneto Collado",
        "linkedin": "https://br.linkedin.com/in/rennancollado"
      },
      {
        "nome": "João Pedro Biffe Lopes Pedroso",
        "linkedin": "https://www.linkedin.com/in/jo%C3%A3o-pedro-pedroso-b7a278408"
      },
      {
        "nome": "Yan Felipe Dutra Martins",
        "linkedin": "https://www.linkedin.com/in/yan-fdutra"
      }
    ],
    "palestranteId": "",
    "tema": ""
  },
  {
    "id": "a-pentestp2",
    "titulo": "Introdução ao Pentest: Teoria e Prática com TryHackMe — Parte 2 de 2",
    "trilha": "minicurso",
    "diaId": "d4",
    "inicio": "14:00",
    "fim": "18:00",
    "localId": "s5b",
    "vagas": null,
    "descricao": "Segundo dia (prática em laboratório): dentro da plataforma TryHackMe, uma dinâmica guiada com os comandos iniciais e, em seguida, os alunos assumem o controle para explorar falhas reais e invadir a máquina alvo.\n\nNível: Básico · Carga horária total: 8 horas.",
    "responsavel": "Nicolas Fernando da Silva, Nathan Alves da Cruz Silveira e Lucas Henrique Gregorio",
    "ministrantes": [
      {
        "nome": "Nicolas Fernando da Silva",
        "linkedin": "https://www.linkedin.com/in/nicolas-silva-637a4b3a4"
      },
      {
        "nome": "Nathan Alves da Cruz Silveira",
        "linkedin": "https://www.linkedin.com/in/nathan-alves-da-cruz-silveira-16001a304"
      },
      {
        "nome": "Lucas Henrique Gregorio",
        "linkedin": "https://www.linkedin.com/in/lucas-henrique-gregorio-a26a38354"
      }
    ],
    "palestranteId": "",
    "tema": ""
  },
  {
    "id": "a-luap2",
    "titulo": "Introdução à Linguagem Lua e Padrões Avançados — Parte 2 de 2",
    "trilha": "minicurso",
    "diaId": "d4",
    "inicio": "14:00",
    "fim": "18:00",
    "localId": "s6b",
    "vagas": null,
    "descricao": "Conceitos básicos da linguagem Lua, codificação UTF-8, expressões regulares próprias da linguagem, manipulação de arquivos e execução concomitante, além de padrões de projeto aplicados à engenharia de software.\n\nNível: Intermediário · Carga horária total: 8 horas.",
    "responsavel": "Vinícius Andrei Parra Castilho e Cleiton Santana da Silva",
    "ministrantes": [
      {
        "nome": "Vinícius Andrei Parra Castilho",
        "linkedin": "https://br.linkedin.com/in/vin%C3%ADcius-andrei-parra-castilho-37439336a"
      },
      {
        "nome": "Cleiton Santana da Silva",
        "linkedin": "https://www.linkedin.com/in/clesantana/"
      }
    ],
    "palestranteId": "",
    "tema": ""
  },
  {
    "id": "a-sebrae",
    "titulo": "Workshop Sebrae",
    "trilha": "especial",
    "diaId": "d5",
    "inicio": "14:00",
    "fim": "18:00",
    "localId": "anf1",
    "vagas": null,
    "descricao": "Workshop conduzido pelo Sebrae. Conteúdo detalhado divulgado em breve.\n\nCarga horária total: 4 horas.",
    "responsavel": "Sebrae",
    "ministrantes": [],
    "palestranteId": "",
    "tema": ""
  },
  {
    "id": "a-pal1",
    "titulo": "Palestra com Luciana Miranda",
    "trilha": "palestra",
    "diaId": "d1",
    "inicio": "19:00",
    "fim": "20:30",
    "localId": "aud",
    "vagas": null,
    "descricao": "",
    "responsavel": "",
    "ministrantes": [],
    "palestranteId": "pal1",
    "tema": ""
  },
  {
    "id": "a-pal2",
    "titulo": "Palestra com o Prof. Dr. Allan Pscheidt",
    "trilha": "palestra",
    "diaId": "d2",
    "inicio": "19:00",
    "fim": "20:30",
    "localId": "aud",
    "vagas": null,
    "descricao": "",
    "responsavel": "",
    "ministrantes": [],
    "palestranteId": "pal2",
    "tema": ""
  },
  {
    "id": "a-pal3",
    "titulo": "Palestra com Thiago Lima",
    "trilha": "palestra",
    "diaId": "d3",
    "inicio": "19:00",
    "fim": "20:30",
    "localId": "aud",
    "vagas": null,
    "descricao": "",
    "responsavel": "",
    "ministrantes": [],
    "palestranteId": "pal3",
    "tema": ""
  },
  {
    "id": "a-pal4",
    "titulo": "Palestra com Matheus Rocha",
    "trilha": "palestra",
    "diaId": "d4",
    "inicio": "19:00",
    "fim": "20:30",
    "localId": "aud",
    "vagas": null,
    "descricao": "",
    "responsavel": "",
    "ministrantes": [],
    "palestranteId": "pal4",
    "tema": ""
  },
  {
    "id": "a-mesa",
    "titulo": "Mesa-redonda",
    "trilha": "especial",
    "diaId": "d5",
    "inicio": "19:00",
    "fim": "21:00",
    "localId": "aud",
    "vagas": null,
    "descricao": "Mesa-redonda de encerramento da 23ª SECOMPP. Convidados e tema divulgados em breve.",
    "responsavel": "Organização",
    "ministrantes": [],
    "palestranteId": "",
    "tema": ""
  }
],

  marcas: [
    // Patrocínio Oficial
    { id: "m1", categoria: "patrocinio", nome: "Cobmais", href: "https://www.cobmais.com.br", logoSrc: "/assets/cobmais.avif", tamanho: "lg", fundo: "nenhum" },
    { id: "m2", categoria: "patrocinio", nome: "DSC", href: "https://www.dsc.com.ai/", logoSrc: "/assets/dsc.svg", tamanho: "lg", fundo: "nenhum" },
    { id: "m11", categoria: "patrocinio", nome: "VLab", href: "https://www.vlabhealth.com/", logoSrc: "/assets/vlab.png", tamanho: "sm", fundo: "nenhum" },
    { id: "m12", categoria: "patrocinio", nome: "Inspectral", href: "https://www.inspectral.com.br/pt", logoSrc: "/assets/inspectral.png", tamanho: "lg", fundo: "nenhum" },
    { id: "m13", categoria: "patrocinio", nome: "Chilli Beans", href: "https://loja.chillibeans.com.br/", logoSrc: "/assets/chillibeans.png", tamanho: "lg", fundo: "nenhum" },

    // Apoio
    { id: "m6", categoria: "apoio", nome: "Unesp", href: "https://www.fct.unesp.br", logoSrc: "/assets/unesp.svg", tamanho: "md", fundo: "nenhum" },
    { id: "m7", categoria: "apoio", nome: "DMC", href: "https://www.fct.unesp.br/#!/departamentos/matematica-e-computacao/", logoSrc: "/assets/dmc.webp", tamanho: "sm", fundo: "nenhum" },
    { id: "m4", categoria: "apoio", nome: "CACiC", href: "https://cacic.com.br", logoSrc: "/assets/cacic.svg", tamanho: "md", fundo: "nenhum" },
    { id: "m5", categoria: "apoio", nome: "EJComp", href: "https://www.ejcomp.com.br/", logoSrc: "/assets/ejcomp.svg", tamanho: "lg", fundo: "nenhum" },
    { id: "m8", categoria: "apoio", nome: "Fundacte", href: "https://www.fct.unesp.br/#!/entidades/fundacoes/", logoSrc: "/assets/fundacte-dark.svg", tamanho: "sm", fundo: "nenhum" },
    { id: "m3", categoria: "apoio", nome: "Vunesp", href: "https://www.vunesp.com.br/", logoSrc: "/assets/vunesp.svg", tamanho: "lg", fundo: "nenhum" },
    { id: "m9", categoria: "apoio", nome: "Intepp", href: "https://intepp.com.br/", logoSrc: "/assets/intepp.png", tamanho: "sm", fundo: "nenhum" },
    { id: "m10", categoria: "apoio", nome: "Fundação Inova Prudente", href: "https://inovaprudente.com.br/", logoSrc: "/assets/inova.png", tamanho: "lg", fundo: "nenhum" },
    { id: "m14", categoria: "apoio", nome: "Código de Garotas", href: "https://www.instagram.com/codigodegarotas/", logoSrc: "/assets/codigodegarotas.png", tamanho: "md", fundo: "nenhum" },
  ],

  sobre: [
    {
      id: "s1",
      logoSrc: "/assets/secompp-logo-square.svg",
      titulo: "O Evento",
      texto: "A 23ª SECOMPP (Semana do Curso de Ciência da Computação da FCT/UNESP) é um evento de referência regional organizado pela comissão discente e pelo Departamento de Matemática e Computação (DMC), unindo estudantes, pesquisadores e líderes de tecnologia em minicursos práticos e palestras de alto impacto.",
    },
    {
      id: "s2",
      logoSrc: "/assets/unesp-square.svg",
      titulo: "A Universidade",
      texto: "A Faculdade de Ciências e Tecnologia (FCT) integra a Universidade Estadual Paulista (UNESP), destacando-se pela excelência acadêmica, projetos de pesquisa pioneiros e formação dos melhores talentos em tecnologia do país.",
    },
  ],

  lotes: [
    {
      id: "l1",
      titulo: "Kit Simples",
      preco: "R$ 40,00",
      detalhe: "Minicursos, palestras magnas e certificado oficial UNESP",
      inclui: [
        "Inscrição em todos os minicursos desejados (sem choque de horário)",
        "Acesso livre a todas as palestras magnas no Auditório",
        "Certificado Oficial de Horas Complementares UNESP",
        "Coffee break em todos os dias do evento",
      ],
      destaque: false,
      href: "/cadastro",
    },
    {
      id: "l2",
      titulo: "Kit Padrão",
      preco: "R$ 50,00",
      detalhe: "Minicursos, palestras, certificado UNESP + Convite para o After",
      inclui: [
        "Tudo incluso no Kit Simples",
        "Convite exclusivo para o After SECOMPP 2026",
        "Networking ampliado com palestrantes e convidados",
      ],
      destaque: true,
      href: "/cadastro",
    },
    {
      id: "l3",
      titulo: "Kit Promocional",
      preco: "R$ 70,00",
      detalhe: "Experiência completa com Camiseta Oficial da SECOMPP 2026",
      inclui: [
        "Tudo incluso no Kit Padrão + After SECOMPP",
        "Camiseta Oficial da 23ª SECOMPP (Tamanhos PP ao XG)",
        "Kit de boas-vindas do participante",
      ],
      destaque: false,
      href: "/cadastro",
    },
  ],

  duvidas: [
    {
      id: "q1",
      pergunta: "Quem pode participar da SECOMPP?",
      resposta: "Qualquer pessoa interessada em computação e tecnologia pode participar! Estudantes de graduação, pós-graduação, ensino médio e profissionais do mercado são muito bem-vindos.",
    },
    {
      id: "q2",
      pergunta: "Como realizo a minha inscrição?",
      resposta: "1. Crie sua conta ou faça login no sistema EvComp;<br>2. Acesse a página do evento SECOMPP 2026;<br>3. Escolha os minicursos desejados conferindo que não haja choque de horários;<br>4. Confirme a seleção e realize o pagamento via PIX para a Fundação FUNDACTE, anexando o comprovante diretamente pelo sistema.",
    },
    {
      id: "q3",
      pergunta: "Como funciona a escolha do tamanho da camiseta no Kit Promocional?",
      resposta: "Ao adquirir o Kit Promocional (R$ 70,00), após a confirmação da inscrição pelo sistema, envie um e-mail para <b>secompp.fct@unesp.br</b> informando o tamanho desejado da sua camiseta (PP, P, M, G, GG ou XG).",
    },
    {
      id: "q4",
      pergunta: "Haverá emissão de certificado oficial?",
      resposta: "Sim! Os participantes inscritos que registrarem presença nas atividades receberão certificados oficiais emitidos digitalmente com validação e autenticidade da UNESP.",
    },
    {
      id: "q5",
      pergunta: "Preciso levar meu próprio notebook?",
      resposta: "Recomendamos trazer o seu próprio notebook para maior comodidade. No entanto, para atividades realizadas nos laboratórios de informática, os computadores da FCT/UNESP estarão disponíveis com os softwares configurados.",
    },
    {
      id: "q6",
      pergunta: "Haverá intervalos e coffee break?",
      resposta: "Sim! Em todos os dias haverá intervalo com coffee break de manhã (10h) e à tarde (16h), além de intervalo para almoço das 12h às 14h.",
    },
  ],
};
