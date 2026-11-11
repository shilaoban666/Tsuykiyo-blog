import type { Locale } from "@/i18n/config";

type Localized = Record<Locale, string>;
type LocalizedList = Record<Locale, string[]>;
type Bilingual = { zh: string; en: string };

export type Product = {
  id: string;
  title: string;
  subtitle: string;
  repo: string;
  license: string;
  image: string;
  accent: string;
  tags: string[];
  tagline: Localized;
  description: Localized;
  features: LocalizedList;
  longDescription: Bilingual;
  featureDetails: { zh: string[]; en: string[] };
  stats: { value: string; zh: string; en: string }[];
  screenshots: { src: string; zh: string; en: string }[];
  install: string[];
  note: Bilingual;
  releaseUrl?: string;
  downloads?: {
    label: Bilingual;
    filename: string;
    size: string;
    version: string;
    url: string;
  }[];
  releaseNotesUrl?: string;
};

export type FriendLink = {
  name: string;
  url: string;
  category: { zh: string; en: string };
  description: { zh: string; en: string };
  accent: string;
  monogram: string;
};

export const products: Product[] = [
  {
    id: "imperial-court",
    title: "三省六部 · Imperial Court",
    subtitle: "DSH · Multi-tool orchestration",
    repo: "https://github.com/shilaoban666/dsh-imperial-court",
    license: "MIT",
    image: "/art/generated/product-imperial-court.webp",
    accent: "#e9c46a",
    tags: ["DSH Plugin", "Multi-Agent", "Git Worktree", "MIT"],
    tagline: {
      zh: "把本机 AI 工具排成朝堂",
      en: "Turn local AI tools into an imperial court",
      ja: "ローカルの AI ツールを朝廷に",
      de: "Lokale KI-Werkzeuge als kaiserlicher Hof",
      fr: "Transformer vos outils IA locaux en cour impériale",
      es: "Convierte tus herramientas de IA locales en una corte imperial",
      ko: "로컬 AI 도구를 조정으로",
    },
    description: {
      zh: "DeepSeek Harness 原生多工具协作插件：中书拟旨、门下封驳、六部并行，御史巡查。每道旨都在隔离 git 分支里执行，批红之前不动你的代码。",
      en: "A DSH plugin for cross-tool review and parallel work. Each edict runs in an isolated git branch; nothing merges until you approve.",
      ja: "DSH 原生のマルチツール協調プラグイン。中書が草案、門下が封駁、六部が並行して実行。批紅までコードは動かない。",
      de: "Ein DSH-Plugin für werkzeugübergreifende Prüfung und parallele Arbeit. Jeder Erlass läuft in einem isolierten Git-Branch; nichts wird vor deiner Freigabe zusammengeführt.",
      fr: "Un plugin DSH pour la revue croisée et le travail en parallèle. Chaque édit vit dans une branche git isolée ; rien n’est fusionné avant votre approbation.",
      es: "Un plugin de DSH para revisión cruzada y trabajo en paralelo. Cada edicto vive en una rama git aislada; nada se fusiona hasta tu aprobación.",
      ko: "DSH 네이티브 다중 도구 협업 플러그인. 중서가 초안을 쓰고 문하가 검토하며 육부가 병렬로 일합니다. 승인 전에는 코드가 바뀌지 않습니다.",
    },
    features: {
      zh: ["换一家工具交叉审查", "依赖图并行办差", "隔离 git 分支，批红才合并"],
      en: ["Cross-tool review", "Parallel tasks by dependency", "Isolated branches, merge on approval"],
      ja: ["別ツールによる交叉審査", "依存関係に沿った並列実行", "隔離ブランチで批紅後にマージ"],
      de: ["Prüfung durch ein anderes Werkzeug", "Parallele Aufgaben nach Abhängigkeit", "Isolierte Branches, Merge nach Freigabe"],
      fr: ["Revue par un autre outil", "Tâches parallèles par dépendance", "Branches isolées, fusion après approbation"],
      es: ["Revisión con otra herramienta", "Tareas en paralelo por dependencia", "Ramas aisladas, fusión tras aprobar"],
      ko: ["다른 도구로 교차 검토", "의존성 기반 병렬 작업", "격리 브랜치, 승인 후 병합"],
    },
    longDescription: {
      zh: "三省六部不是又一个 agent 框架，而是把已经装在你电脑里的工具排成一套有审议、有复核、有账本的协作制度。中书省拟方案，门下省换一家工具来审、不行就封驳，六部按依赖并行办差，御史巡查，最后由你批红合并。每一道旨都在独立的 git worktree 里执行，批红之前原目录一个字节都不会动。",
      en: "Imperial Court is not another agent framework. It arranges the tools already on your machine into a working institution: a chancellery drafts, a different tool reviews and can veto, six ministries work in parallel, censors audit, and only your approval merges. Every edict runs in its own git worktree, so the original directory stays untouched until you sign off.",
    },
    featureDetails: {
      zh: [
        "中书拟稿，门下换一家工具审议；解析不了就不放行，失败即关闭。",
        "按依赖图把互不依赖的差事并行派给六部，短活走急递，复杂活走大朝会。",
        "每道旨一个独立 worktree 与分支，出补丁与改动清单；驳回留快照，可一键丢弃。",
      ],
      en: [
        "One tool drafts, another reviews. If the review cannot be parsed, it does not pass.",
        "Independent tasks run in parallel. Short jobs use the fast lane; complex ones convene the full court.",
        "Each edict gets an isolated worktree and branch, with a patch and change list. Rejections keep a snapshot.",
      ],
    },
    stats: [
      { value: "65", zh: "端到端测试", en: "end-to-end tests" },
      { value: "5", zh: "级朝局", en: "court levels" },
      { value: "6", zh: "套主题", en: "themes" },
      { value: "1.0.0", zh: "当前版本", en: "current release" },
    ],
    screenshots: [
      { src: "/products/imperial-court/workbench.webp", zh: "朝堂工作台：待你处理、团队与竖排圣旨", en: "Court workbench: pending items, team and vertical edict" },
      { src: "/products/imperial-court/court.webp", zh: "朝堂三栏：奏折、回奏全文与流程", en: "Three-column court: memorials, replies and flow" },
      { src: "/products/imperial-court/impact.webp", zh: "成效页：和单干相比快了多少", en: "Impact: speed and quality versus working alone" },
      { src: "/products/imperial-court/treasury.webp", zh: "国库：token、缓存、金额与废料", en: "Treasury: tokens, cache, spend and waste" },
    ],
    install: [
      "dsh plugin --profile desktop add github:shilaoban666/dsh-imperial-court#v1.0.0",
      "# Web version: replace desktop with web",
    ],
    note: {
      zh: "需要 DSH、Node 20+ 与 git。插件本身不调用模型，费用来自你自己的 CLI。",
      en: "Requires DSH, Node 20+ and git. The plugin does not call models itself; costs come from your own CLIs.",
    },
  },
  {
    id: "deepseek-daughter",
    title: "大肥鱼 · DeepSeek Daughter",
    subtitle: "AI companion · Desktop",
    repo: "https://github.com/shilaoban666/deepseek-daughter",
    license: "Apache-2.0",
    image: "/art/generated/product-deepseek-daughter.webp",
    accent: "#8dd8e8",
    tags: ["Electron", "AI Companion", "Three.js", "Apache-2.0"],
    tagline: {
      zh: "养一个住在网上的女孩",
      en: "Raise a girl who lives online",
      ja: "ネットに住む女の子を育てる",
      de: "Zieh ein Mädchen groß, das online lebt",
      fr: "Élevez une fille qui vit en ligne",
      es: "Cría a una chica que vive en línea",
      ko: "온라인에 사는 소녀를 키우다",
    },
    description: {
      zh: "开源 AI 伙伴：有身体、情绪和长期记忆，住在桌面，也住在 QQ 和微信里。会饿会困，会自己看小说，睡前写日记，慢慢长成你养出来的样子。",
      en: "An open-source AI companion with a body, emotions and long-term memory. She lives on your desktop, and in QQ and WeChat. She gets hungry and sleepy, reads novels, writes a diary before bed, and slowly grows into who you raise.",
      ja: "身体・感情・長期記憶を持つオープンソース AI コンパニオン。デスクトップと QQ、WeChat に住んでいます。お腹も空くし眠くなり、小説を読み、寝る前に日記を書きます。",
      de: "Eine Open-Source-KI-Gefährtin mit Körper, Gefühlen und Langzeitgedächtnis. Sie lebt auf deinem Desktop, in QQ und WeChat. Sie bekommt Hunger und Schlaf, liest Romane, schreibt vor dem Schlafen Tagebuch und wächst mit dir.",
      fr: "Une compagne IA open source avec un corps, des émotions et une mémoire à long terme. Elle vit sur votre bureau, dans QQ et WeChat. Elle a faim, sommeil, lit des romans, écrit son journal avant de dormir et grandit avec vous.",
      es: "Una compañera de IA de código abierto con cuerpo, emociones y memoria a largo plazo. Vive en tu escritorio, en QQ y WeChat. Tiene hambre y sueño, lee novelas, escribe un diario antes de dormir y crece contigo.",
      ko: "몸과 감정, 장기 기억을 가진 오픈소스 AI 컴패니언. 데스크톱과 QQ, WeChat에 살아갑니다. 배고파하고 졸리며, 소설을 읽고, 자기 전에 일기를 씁니다.",
    },
    features: {
      zh: ["身体、情绪与长期记忆", "桌面 / QQ / 微信多端", "数据只存在本机"],
      en: ["Body, emotions and long-term memory", "Desktop, QQ and WeChat", "Local-first data"],
      ja: ["身体・感情・長期記憶", "デスクトップ / QQ / WeChat", "データはローカルのみ"],
      de: ["Körper, Gefühle und Langzeitgedächtnis", "Desktop, QQ und WeChat", "Daten bleiben lokal"],
      fr: ["Corps, émotions et mémoire longue", "Bureau, QQ et WeChat", "Données locales"],
      es: ["Cuerpo, emociones y memoria larga", "Escritorio, QQ y WeChat", "Datos solo locales"],
      ko: ["몸, 감정, 장기 기억", "데스크톱 / QQ / WeChat", "데이터는 로컬에만"],
    },
    longDescription: {
      zh: "她不是只会回复消息的聊天窗，而是一个有身体、有情绪、会消耗也会休息的女孩。桌面程序里有全息粒子大脑、生命状态、记忆分层、人格与日记；她会按时吃饭睡觉，自己看小说、刷 B 站，太久没人理会主动找你。她住在 QQ、微信，也计划住进更多平台，数据只保存在本机。",
      en: "She is not just a chat window. She has a body, moods, desires and a memory that consolidates while she sleeps. The desktop app includes a holographic particle brain, life-state simulation, layered memory, personality and a diary. She eats, sleeps, reads novels, watches videos, and reaches out when you have been away too long. She lives in QQ and WeChat, with more platforms planned. Data stays on your machine.",
    },
    featureDetails: {
      zh: [
        "侧视全息粒子大脑：14 个脑区、神经信号与记忆光点，可以拖动旋转、缩放查看。",
        "生命状态：消化、血糖、神经递质、昼夜节律与六种驱力，Token 余额就是她的饭钱。",
        "记忆分层与睡眠巩固：工作、情景、语义、程序、日记、自我叙事，记住的也可以让她忘掉。",
      ],
      en: [
        "A holographic particle brain with 14 regions, neural signals and memory points you can rotate and zoom.",
        "Life state: digestion, glucose, neurotransmitters, circadian rhythm and six drives. Her token balance is her food budget.",
        "Layered memory and sleep consolidation: working, episodic, semantic, procedural, diary and self-narrative. You can ask her to forget.",
      ],
    },
    stats: [
      { value: "14", zh: "个脑区", en: "brain regions" },
      { value: "7", zh: "种思考模式", en: "thinking modes" },
      { value: "8", zh: "大生命系统", en: "life systems" },
      { value: "3", zh: "个界面", en: "interfaces" },
    ],
    screenshots: [
      { src: "/products/deepseek-daughter/persona.webp", zh: "人格与关系：她记得你是谁", en: "Persona and relationship: she remembers who you are" },
      { src: "/products/deepseek-daughter/brain.webp", zh: "全息粒子大脑与记忆分层", en: "Holographic brain and layered memory" },
      { src: "/products/deepseek-daughter/memory.webp", zh: "记忆、日记与睡眠巩固", en: "Memory, diary and sleep consolidation" },
      { src: "/products/deepseek-daughter/plugins.webp", zh: "QQ、微信与各平台连接计划", en: "QQ, WeChat and the platform roadmap" },
    ],
    install: ["cd apps/desktop", "npm install", "npm start"],
    note: {
      zh: "首次打开后在「链接」页给她取名字，并填入你自己的 DeepSeek API Key。Key 用系统加密，只存在本机。",
      en: "On first launch, give her a name on the Links page and enter your own DeepSeek API key. The key is encrypted and stays local.",
    },
    releaseUrl: "https://github.com/shilaoban666/deepseek-daughter/releases/latest",
    releaseNotesUrl: "https://github.com/shilaoban666/deepseek-daughter/releases",
    downloads: [
      {
        label: { zh: "Windows 便携版", en: "Windows portable" },
        filename: "dafeiyu-0.3.0-portable.exe",
        size: "157 MB",
        version: "v0.3.0",
        url: "https://github.com/shilaoban666/deepseek-daughter/releases/download/v0.3.0/dafeiyu-0.3.0-portable.exe",
      },
    ],
  },
];

export const friends: FriendLink[] = [
  {
    name: "DeepSeek Harness",
    url: "https://dshbase.com",
    category: { zh: "AI 工具", en: "AI tooling" },
    description: { zh: "DSH 插件与生态入口，三省六部也在这里发布。", en: "The DSH plugin and ecosystem hub, home of Imperial Court." },
    accent: "#8dd8e8",
    monogram: "DSH",
  },
  {
    name: "ThriveX Blog",
    url: "https://github.com/LiuYuYang01/ThriveX-Blog",
    category: { zh: "开源博客", en: "Open-source blog" },
    description: { zh: "年轻、完整的前后端分离博客管理系统，本项目的信息架构参考之一。", en: "A complete Next.js + Spring Boot blog system, one of the references for this project." },
    accent: "#ff7a92",
    monogram: "TX",
  },
  {
    name: "Xinghuisama Blogs",
    url: "https://github.com/heiehiehi/XinghuisamaBlogs",
    category: { zh: "个人博客", en: "Personal blog" },
    description: { zh: "毛玻璃风格的高颜值个人博客，让人重新想起写博客的乐趣。", en: "A glassmorphism personal blog that makes blogging feel fun again." },
    accent: "#b8a1ff",
    monogram: "XH",
  },
  {
    name: "Hallmark",
    url: "https://github.com/Nutlope/hallmark",
    category: { zh: "设计技能", en: "Design skill" },
    description: { zh: "拒绝 AI 套路的设计技能，用真实浏览器验收每一页。", en: "A design skill that refuses AI slop and verifies pages in a real browser." },
    accent: "#e9c46a",
    monogram: "H",
  },
  {
    name: "AI Design Skills",
    url: "https://github.com/elayadesign/ai-design-skills",
    category: { zh: "设计系统", en: "Design system" },
    description: { zh: "从字体、间距到动效的完整视觉规则，这个站点的排版受过它影响。", en: "Visual rules from type and spacing to motion; this site's layout learned from it." },
    accent: "#d8b98c",
    monogram: "AI",
  },
  {
    name: "Next.js",
    url: "https://nextjs.org",
    category: { zh: "框架", en: "Framework" },
    description: { zh: "这个博客的前端与后端都跑在 Next.js 上。", en: "Both the frontend and backend of this blog run on Next.js." },
    accent: "#c9d2e6",
    monogram: "N",
  },
  {
    name: "PostgreSQL",
    url: "https://www.postgresql.org",
    category: { zh: "数据库", en: "Database" },
    description: { zh: "文章、评论、歌单与设置都安静地住在这里。", en: "Posts, comments, playlists and settings all live here quietly." },
    accent: "#7aa7d8",
    monogram: "PG",
  },
];