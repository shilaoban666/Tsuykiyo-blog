import type { Locale } from "./config";

type PostCopy = { title: string; excerpt: string };
type CategoryCopy = { name: string; description: string };
type TagCopy = { name: string };

const zhPosts: Record<string, PostCopy> = {
  "moonlight-compiler": {
    title: "深夜编译：把生活写成可维护的代码",
    excerpt: "凌晨一点，构建日志像潮水一样退去。写给所有在深夜里调试生活的人：有些问题不需要立刻解决，只需要被好好地命名。",
  },
  "train-at-blue-hour": {
    title: "蓝调时刻的站台",
    excerpt: "日落之后、天黑之前，日本摄影里把这段时间叫作「藍色時刻」。我在一个无名小站等了四十分钟，却意外找回了写作的节奏。",
  },
  "personal-blog-postgresql": {
    title: "个人博客的数据库，为什么我选了 PostgreSQL",
    excerpt: "文件系统很浪漫，但当你需要草稿、标签、评论、媒体库和全文检索时，一个可靠的关系型数据库会让写作系统安静很多。",
  },
  "anime-and-memory": {
    title: "动画如何保存我们的记忆",
    excerpt: "有些作品并不是因为剧情被记住，而是因为它替我们保存了某个具体夏天的温度。",
  },
  "sea-road-summer": {
    title: "沿海公路的夏天",
    excerpt: "一次没有拍摄计划的旅行。自行车、自动贩卖机、傍晚的海风，以及一个决定：不再用取景框代替眼睛。",
  },
  "writing-slowly": {
    title: "慢一点写",
    excerpt: "当写作变成内容生产，句子会先于感受被写出来。停更三个月后，我重新理解了「完成一篇文章」这件事。",
  },
};

const enPosts: Record<string, PostCopy> = {
  "moonlight-compiler": {
    title: "Compiling at Midnight: Making Life Maintainable",
    excerpt: "At 1 a.m. the build logs retreat like a tide. A note for everyone debugging life after midnight: some problems only need a good name first.",
  },
  "train-at-blue-hour": {
    title: "The Platform at Blue Hour",
    excerpt: "After sunset, before night: the Japanese call it blue hour. I waited forty minutes at a nameless station and unexpectedly found my rhythm again.",
  },
  "personal-blog-postgresql": {
    title: "Why I Chose PostgreSQL for a Personal Blog",
    excerpt: "Files are romantic until you need drafts, tags, comments, a media library and full-text search. A reliable relational database makes writing quiet again.",
  },
  "anime-and-memory": {
    title: "How Animation Keeps Our Memories",
    excerpt: "Some works are remembered not for their plot, but because they preserved the exact temperature of a particular summer.",
  },
  "sea-road-summer": {
    title: "Summer on the Coastal Road",
    excerpt: "A trip with no shooting plan. A bicycle, a vending machine, the evening sea breeze, and one decision: stop letting the viewfinder replace my eyes.",
  },
  "writing-slowly": {
    title: "Write More Slowly",
    excerpt: "When writing becomes content production, sentences arrive before feelings. After three months away, I understood what finishing an essay really means.",
  },
};

const jaPosts: Record<string, PostCopy> = {
  "moonlight-compiler": {
    title: "深夜のコンパイル：生活を保守可能なコードにする",
    excerpt: "午前1時、ビルドログは潮のように引いていく。深夜に生活をデバッグするすべての人へ。問題はすぐ解かなくても、まず正しく名づければいい。",
  },
  "train-at-blue-hour": {
    title: "ブルーアワーのホーム",
    excerpt: "日没後、夜になる前。日本写真で「ブルーアワー」と呼ばれる時間。名もない駅で40分待ち、思いがけず書くリズムを取り戻した。",
  },
  "personal-blog-postgresql": {
    title: "個人ブログのデータベースに PostgreSQL を選んだ理由",
    excerpt: "ファイルはロマンチックです。しかし下書き、タグ、コメント、メディア、全文検索が必要になると、信頼できるリレーショナルデータベースが執筆を静かにしてくれます。",
  },
  "anime-and-memory": {
    title: "アニメはどのように記憶を保存するのか",
    excerpt: "物語ではなく、ある夏の温度をそのまま保存してくれたから覚えている作品がある。",
  },
  "sea-road-summer": {
    title: "海沿いの道の夏",
    excerpt: "撮影計画のない旅。自転車、自動販売機、夕方の潮風、そして決心。もうファインダーを目のかわりにしない。",
  },
  "writing-slowly": {
    title: "ゆっくり書く",
    excerpt: "書くことがコンテンツ生産になると、感情より先に文が生まれる。三か月休んで、『一篇を書き上げる』ことの意味を理解し直した。",
  },
};

const dePosts: Record<string, PostCopy> = {
  "moonlight-compiler": {
    title: "Kompilieren um Mitternacht: Das Leben wartbar machen",
    excerpt: "Um 1 Uhr ziehen sich die Build-Logs wie eine Flut zurück. Eine Notiz für alle, die nachts ihr Leben debuggen: Manche Probleme brauchen zuerst einen guten Namen.",
  },
  "train-at-blue-hour": {
    title: "Der Bahnsteig zur blauen Stunde",
    excerpt: "Nach Sonnenuntergang, vor der Nacht: In der japanischen Fotografie heißt sie blaue Stunde. Ich wartete vierzig Minuten an einem namenlosen Bahnhof und fand meinen Rhythmus wieder.",
  },
  "personal-blog-postgresql": {
    title: "Warum ich für mein Blog PostgreSQL gewählt habe",
    excerpt: "Dateien sind romantisch, bis man Entwürfe, Tags, Kommentare, Medien und Volltextsuche braucht. Eine verlässliche relationale Datenbank macht das Schreiben wieder still.",
  },
  "anime-and-memory": {
    title: "Wie Anime unsere Erinnerungen bewahrt",
    excerpt: "Manche Werke bleiben nicht wegen der Handlung, sondern weil sie die genaue Temperatur eines Sommers bewahrt haben.",
  },
  "sea-road-summer": {
    title: "Sommer auf der Küstenstraße",
    excerpt: "Eine Reise ohne Fotoplan. Ein Fahrrad, ein Automat, die abendliche Meeresbrise und eine Entscheidung: Der Sucher ersetzt nicht mehr meine Augen.",
  },
  "writing-slowly": {
    title: "Langsamer schreiben",
    excerpt: "Wenn Schreiben zur Content-Produktion wird, entstehen Sätze vor den Gefühlen. Nach drei Monaten Pause verstand ich neu, was es heißt, einen Text zu beenden.",
  },
};

const frPosts: Record<string, PostCopy> = {
  "moonlight-compiler": {
    title: "Compiler à minuit : rendre la vie maintenable",
    excerpt: "À 1 h du matin, les logs de build se retirent comme la marée. Une note pour ceux qui déboguent leur vie après minuit : certains problèmes ont d'abord besoin d'un bon nom.",
  },
  "train-at-blue-hour": {
    title: "Le quai à l'heure bleue",
    excerpt: "Après le coucher du soleil, avant la nuit : au Japon, on parle de l'heure bleue. J'ai attendu quarante minutes dans une gare sans nom et retrouvé mon rythme d'écriture.",
  },
  "personal-blog-postgresql": {
    title: "Pourquoi j'ai choisi PostgreSQL pour mon blog",
    excerpt: "Les fichiers sont romantiques jusqu'au jour où il faut des brouillons, des tags, des commentaires, une médiathèque et une recherche plein texte. Une base relationnelle fiable rend l'écriture silencieuse.",
  },
  "anime-and-memory": {
    title: "Comment l'animation préserve nos souvenirs",
    excerpt: "Certaines œuvres restent non pour leur intrigue, mais parce qu'elles ont gardé la température exacte d'un été.",
  },
  "sea-road-summer": {
    title: "L'été sur la route côtière",
    excerpt: "Un voyage sans plan photo. Un vélo, un distributeur, la brise du soir et une décision : ne plus laisser le viseur remplacer mes yeux.",
  },
  "writing-slowly": {
    title: "Écrire plus lentement",
    excerpt: "Quand écrire devient produire du contenu, les phrases arrivent avant les émotions. Après trois mois d'absence, j'ai compris ce que terminer un texte veut dire.",
  },
};

const esPosts: Record<string, PostCopy> = {
  "moonlight-compiler": {
    title: "Compilar a medianoche: hacer la vida mantenible",
    excerpt: "A la 1 de la madrugada, los registros de compilación se retiran como la marea. Una nota para quienes depuran su vida de noche: algunos problemas solo necesitan un buen nombre.",
  },
  "train-at-blue-hour": {
    title: "El andén en la hora azul",
    excerpt: "Después del atardecer, antes de la noche: en la fotografía japonesa es la hora azul. Esperé cuarenta minutos en una estación sin nombre y recuperé mi ritmo de escritura.",
  },
  "personal-blog-postgresql": {
    title: "Por qué elegí PostgreSQL para mi blog personal",
    excerpt: "Los archivos son románticos hasta que necesitas borradores, etiquetas, comentarios, biblioteca de medios y búsqueda completa. Una base relacional fiable devuelve silencio a la escritura.",
  },
  "anime-and-memory": {
    title: "Cómo el anime guarda nuestros recuerdos",
    excerpt: "Algunas obras se recuerdan no por su trama, sino porque conservaron la temperatura exacta de un verano.",
  },
  "sea-road-summer": {
    title: "Verano en la carretera costera",
    excerpt: "Un viaje sin plan de fotos. Una bicicleta, una máquina expendedora, la brisa del atardecer y una decisión: dejar de usar el visor en lugar de los ojos.",
  },
  "writing-slowly": {
    title: "Escribir más despacio",
    excerpt: "Cuando escribir se convierte en producción de contenido, las frases llegan antes que los sentimientos. Tras tres meses de pausa, entendí qué significa terminar un texto.",
  },
};

const koPosts: Record<string, PostCopy> = {
  "moonlight-compiler": {
    title: "심야 컴파일: 삶을 유지보수 가능한 코드로",
    excerpt: "새벽 1시, 빌드 로그가 조수처럼 물러간다. 밤에 삶을 디버깅하는 모든 이에게: 어떤 문제는 먼저 제대로 이름 붙이면 된다.",
  },
  "train-at-blue-hour": {
    title: "블루 아워의 승강장",
    excerpt: "해가 진 뒤, 밤이 오기 전. 일본 사진에서 '블루 아워'라 부르는 시간. 이름 없는 역에서 40분을 기다리며 뜻밖에 글쓰기의 리듬을 되찾았다.",
  },
  "personal-blog-postgresql": {
    title: "개인 블로그 데이터베이스로 PostgreSQL을 고른 이유",
    excerpt: "파일은 낭만적이다. 그러나 초안, 태그, 댓글, 미디어 라이브러리, 전문 검색이 필요해지면 신뢰할 수 있는 관계형 데이터베이스가 글쓰기를 조용하게 만든다.",
  },
  "anime-and-memory": {
    title: "애니메이션이 우리의 기억을 보관하는 방식",
    excerpt: "어떤 작품은 줄거리 때문이 아니라, 어느 여름의 정확한 온도를 보관해 주었기 때문에 기억된다.",
  },
  "sea-road-summer": {
    title: "해안도로의 여름",
    excerpt: "촬영 계획 없는 여행. 자전거, 자판기, 저녁 바닷바람, 그리고 결심: 더 이상 뷰파인더가 눈을 대신하지 않게.",
  },
  "writing-slowly": {
    title: "조금 느리게 쓰기",
    excerpt: "글쓰기가 콘텐츠 생산이 되면 감정보다 문장이 먼저 나온다. 세 달 쉰 뒤, '한 편을 완성한다'는 의미를 다시 이해했다.",
  },
};

const postsByLocale: Record<Locale, Record<string, PostCopy>> = {
  zh: zhPosts, en: enPosts, ja: jaPosts, de: dePosts, fr: frPosts, es: esPosts, ko: koPosts,
};

const zhCategories: Record<string, CategoryCopy> = {
  "night-notes": { name: "夜色随笔", description: "深夜里缓慢写下的观察与情绪。" },
  "code-notes": { name: "技术手札", description: "关于前端、后端与独立开发的实践笔记。" },
  "light-records": { name: "光影记录", description: "照片、城市与旅途中的光。" },
  "fantasy-room": { name: "幻想房间", description: "动画、小说与那些不存在的世界。" },
};
const enCategories: Record<string, CategoryCopy> = {
  "night-notes": { name: "Night Notes", description: "Slow observations and feelings written after midnight." },
  "code-notes": { name: "Code Notes", description: "Practical notes on frontend, backend and independent development." },
  "light-records": { name: "Light Records", description: "Photographs, cities and the light found on the way." },
  "fantasy-room": { name: "Fantasy Room", description: "Animation, fiction, and worlds that do not exist." },
};
const jaCategories: Record<string, CategoryCopy> = {
  "night-notes": { name: "夜の随筆", description: "深夜にゆっくり書く観察と感情。" },
  "code-notes": { name: "技術ノート", description: "フロントエンド、バックエンド、個人開発の実践メモ。" },
  "light-records": { name: "光の記録", description: "写真、街、旅の途中の光。" },
  "fantasy-room": { name: "幻想の部屋", description: "アニメ、小説、存在しない世界。" },
};
const deCategories: Record<string, CategoryCopy> = {
  "night-notes": { name: "Nachtnotizen", description: "Langsame Beobachtungen und Gefühle, nach Mitternacht geschrieben." },
  "code-notes": { name: "Code-Notizen", description: "Praxisnotizen zu Frontend, Backend und unabhängiger Entwicklung." },
  "light-records": { name: "Lichtaufnahmen", description: "Fotografien, Städte und das Licht unterwegs." },
  "fantasy-room": { name: "Fantasieraum", description: "Animation, Romane und Welten, die es nicht gibt." },
};
const frCategories: Record<string, CategoryCopy> = {
  "night-notes": { name: "Notes nocturnes", description: "Observations et émotions écrites lentement après minuit." },
  "code-notes": { name: "Notes de code", description: "Notes pratiques sur le frontend, le backend et le développement indépendant." },
  "light-records": { name: "Traces de lumière", description: "Photographies, villes et lumière croisée en chemin." },
  "fantasy-room": { name: "Chambre fantastique", description: "Animation, romans et mondes qui n'existent pas." },
};
const esCategories: Record<string, CategoryCopy> = {
  "night-notes": { name: "Notas nocturnas", description: "Observaciones y emociones escritas despacio después de medianoche." },
  "code-notes": { name: "Notas de código", description: "Notas prácticas sobre frontend, backend y desarrollo independiente." },
  "light-records": { name: "Registros de luz", description: "Fotografías, ciudades y la luz encontrada en el camino." },
  "fantasy-room": { name: "Sala de fantasía", description: "Anime, novelas y mundos que no existen." },
};
const koCategories: Record<string, CategoryCopy> = {
  "night-notes": { name: "밤의 노트", description: "깊은 밤 천천히 쓴 관찰과 감정." },
  "code-notes": { name: "기술 노트", description: "프론트엔드, 백엔드, 독립 개발에 관한 실전 메모." },
  "light-records": { name: "빛의 기록", description: "사진, 도시, 여행 중 만난 빛." },
  "fantasy-room": { name: "환상의 방", description: "애니메이션, 소설, 존재하지 않는 세계." },
};

const categoriesByLocale: Record<Locale, Record<string, CategoryCopy>> = {
  zh: zhCategories, en: enCategories, ja: jaCategories, de: deCategories, fr: frCategories, es: esCategories, ko: koCategories,
};

const wechatCategory: Record<Locale, CategoryCopy> = {
  zh: { name: "公众号文章", description: "「石哥说编程」公众号的技术文章。" },
  en: { name: "WeChat Essays", description: 'Technical essays from "Shige Talks Code" on WeChat.' },
  ja: { name: "WeChat 記事", description: "「石哥说编程」の WeChat 技術記事。" },
  de: { name: "WeChat-Artikel", description: "Technische Essays von „Shige spricht über Code“ auf WeChat." },
  fr: { name: "Articles WeChat", description: "Essais techniques de « Shige parle code » sur WeChat." },
  es: { name: "Artículos de WeChat", description: "Ensayos técnicos de «Shige habla de código» en WeChat." },
  ko: { name: "위챗 글", description: "「스거의 코딩 이야기」 위챗 기술 글." },
};

const tags: Record<string, Record<Locale, string>> = {
  nextjs: { zh: "Next.js", en: "Next.js", ja: "Next.js", de: "Next.js", fr: "Next.js", es: "Next.js", ko: "Next.js" },
  typescript: { zh: "TypeScript", en: "TypeScript", ja: "TypeScript", de: "TypeScript", fr: "TypeScript", es: "TypeScript", ko: "TypeScript" },
  postgresql: { zh: "PostgreSQL", en: "PostgreSQL", ja: "PostgreSQL", de: "PostgreSQL", fr: "PostgreSQL", es: "PostgreSQL", ko: "PostgreSQL" },
  design: { zh: "设计", en: "Design", ja: "デザイン", de: "Design", fr: "Design", es: "Diseño", ko: "디자인" },
  anime: { zh: "动画", en: "Anime", ja: "アニメ", de: "Anime", fr: "Animation", es: "Anime", ko: "애니메이션" },
  writing: { zh: "写作", en: "Writing", ja: "執筆", de: "Schreiben", fr: "Écriture", es: "Escritura", ko: "글쓰기" },
  photography: { zh: "摄影", en: "Photography", ja: "写真", de: "Fotografie", fr: "Photographie", es: "Fotografía", ko: "사진" },
  life: { zh: "生活", en: "Life", ja: "生活", de: "Leben", fr: "Vie", es: "Vida", ko: "일상" },
  "indie-dev": { zh: "独立开发", en: "Indie Dev", ja: "個人開発", de: "Indie-Entwicklung", fr: "Dév. indépendant", es: "Desarrollo indie", ko: "독립 개발" },
};

export function localizePost(slug: string, locale: Locale, fallback: { title: string; excerpt: string }): PostCopy {
  return postsByLocale[locale]?.[slug] ?? fallback;
}

export function localizeCategory(
  slug: string,
  locale: Locale,
  fallback: { name: string; description: string | null },
): CategoryCopy {
  if (slug === "wechat-notes") return wechatCategory[locale] ?? wechatCategory.en;
  return categoriesByLocale[locale]?.[slug] ?? { name: fallback.name, description: fallback.description ?? "" };
}

export function localizeTag(slug: string, locale: Locale, fallback: string): string {
  return tags[slug]?.[locale] ?? fallback;
}

export function displayAuthor(locale: Locale, fallback: string) {
  return locale === "zh" ? fallback : "Tsukiyo";
}

export type TimelineCopy = { year: string; title: string; description: string };

export const aboutTimeline: Record<Locale, TimelineCopy[]> = {
  zh: [
    { year: "2026", title: "月白 TSUKIYO 上线", description: "把博客重写成一套完整的写作与内容管理系统。" },
    { year: "2025", title: "开始认真写作", description: "停止追逐更新频率，转向更长、更慢的文章。" },
    { year: "2024", title: "第一次独立开发", description: "从前端走向全栈，开始独立维护自己的产品。" },
  ],
  en: [
    { year: "2026", title: "Tsukiyo goes online", description: "Rebuilt the blog into a complete writing and content system." },
    { year: "2025", title: "Started writing seriously", description: "Stopped chasing frequency and moved to longer, slower essays." },
    { year: "2024", title: "First independent build", description: "Moved from frontend to full stack and began maintaining my own product." },
  ],
  ja: [
    { year: "2026", title: "月白 TSUKIYO 公開", description: "ブログを執筆とコンテンツ管理の仕組みとして作り直した。" },
    { year: "2025", title: "本気で書きはじめる", description: "更新頻度を追うのをやめ、長くゆっくりした文章へ。" },
    { year: "2024", title: "はじめての個人開発", description: "フロントエンドからフルスタックへ。自分のプロダクトを育てはじめた。" },
  ],
  de: [
    { year: "2026", title: "Tsukiyo geht online", description: "Das Blog zu einem vollständigen Schreib- und Inhaltssystem umgebaut." },
    { year: "2025", title: "Ernsthaft zu schreiben begonnen", description: "Nicht mehr der Frequenz hinterherjagen, sondern längeren Texten." },
    { year: "2024", title: "Erstes eigenes Projekt", description: "Vom Frontend zum Fullstack und zum eigenen Produkt." },
  ],
  fr: [
    { year: "2026", title: "Tsukiyo en ligne", description: "Le blog reconstruit comme un véritable système d’écriture et de contenu." },
    { year: "2025", title: "Commencer à écrire sérieusement", description: "Arrêter de courir après la fréquence, préférer les textes plus longs." },
    { year: "2024", title: "Premier projet indépendant", description: "Du frontend au full stack, et à mon propre produit." },
  ],
  es: [
    { year: "2026", title: "Tsukiyo en línea", description: "Reconstruí el blog como un sistema completo de escritura y contenido." },
    { year: "2025", title: "Empecé a escribir en serio", description: "Dejé de perseguir la frecuencia y pasé a textos más largos y lentos." },
    { year: "2024", title: "Primer proyecto independiente", description: "Del frontend al full stack y a mantener mi propio producto." },
  ],
  ko: [
    { year: "2026", title: "츠키요 공개", description: "블로그를 글쓰기와 콘텐츠 관리 시스템으로 다시 만들었다." },
    { year: "2025", title: "본격적으로 쓰기 시작", description: "업데이트 빈도를 쫓지 않고 더 길고 느린 글로." },
    { year: "2024", title: "첫 독립 개발", description: "프론트엔드에서 풀스택으로, 내 제품을 직접 운영하기 시작했다." },
  ],
};