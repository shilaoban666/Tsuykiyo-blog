import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { randomBytes, scrypt as scryptCallback } from "node:crypto";
import { promisify } from "node:util";
import postgres from "postgres";

const scrypt = promisify(scryptCallback);

function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    try {
      const text = readFileSync(resolve(process.cwd(), file), "utf8");
      for (const line of text.split(/\r?\n/)) {
        const match = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
        if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
      }
    } catch {
      // optional
    }
  }
}

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derived = await scrypt(password.normalize("NFKC"), salt, 64);
  return `scrypt$${salt}$${derived.toString("hex")}`;
}

function md(...lines) {
  return lines.join("\n");
}

loadEnv();

const connection = process.env.DATABASE_URL;
if (!connection) {
  console.error("缺少 DATABASE_URL");
  process.exit(1);
}

const sql = postgres(connection, { max: 1, prepare: false });

const categories = [
  { slug: "night-notes", name: "夜色随笔", description: "深夜里缓慢写下的观察与情绪。", accent: "#ff6b8a", sort: 1 },
  { slug: "code-notes", name: "技术手札", description: "关于前端、后端与独立开发的实践笔记。", accent: "#7dd3e8", sort: 2 },
  { slug: "light-records", name: "光影记录", description: "照片、城市与旅途中的光。", accent: "#d8b98c", sort: 3 },
  { slug: "fantasy-room", name: "幻想房间", description: "动画、小说与那些不存在的世界。", accent: "#b8a1ff", sort: 4 },
];

const tags = [
  ["Next.js", "nextjs"],
  ["TypeScript", "typescript"],
  ["PostgreSQL", "postgresql"],
  ["设计", "design"],
  ["动画", "anime"],
  ["写作", "writing"],
  ["摄影", "photography"],
  ["生活", "life"],
  ["独立开发", "indie-dev"],
];

const posts = [
  {
    slug: "moonlight-compiler",
    title: "深夜编译：把生活写成可维护的代码",
    subtitle: "当 IDE 的蓝光成为房间里唯一的光源",
    excerpt:
      "凌晨一点，构建日志像潮水一样退去。写给所有在深夜里调试生活的人：有些问题不需要立刻解决，只需要被好好地命名。",
    category: "code-notes",
    tags: ["独立开发", "TypeScript"],
    status: "published",
    featured: true,
    pinned: true,
    cover: "/art/generated/cover-studio.webp",
    publishedAt: "2026-11-08T14:20:00.000Z",
    content: md(
      "## 一、凌晨一点的构建日志",
      "",
      "窗外的城市已经安静下来，只有显示器的蓝光还醒着。`pnpm build` 跑到一半，终端里滚过一屏又一屏的 chunk 名称。我端着已经凉掉的茶，忽然觉得这件事和写作很像：你把手边零散的想法交给一个看不见的编译器，等它告诉你哪里不成立。",
      "",
      "> 代码不会安慰人，但它会诚实地指出：这里少了一个括号，那里有一句话没有说完整。",
      "",
      "过去一年，我把大部分夜晚交给了这套博客。它不是产品，没有增长指标，也不会出现在任何融资新闻里。但它是我少数愿意反复使用、反复修改的东西。",
      "",
      "## 二、先命名，再解决",
      "",
      "写代码久了，会养成一个习惯：先给问题起名字。命名不是形式主义，它意味着你愿意承认某个模糊的不适真实存在。",
      "",
      "- **注意力泄漏**：每隔十分钟就想打开一次消息列表。",
      "- **过度设计**：为一个尚未发生的需求写下三层抽象。",
      "- **写作恐惧**：因为害怕写得不够好，所以一直不开始。",
      "",
      "给它们命名之后，解决方式反而简单了。注意力泄漏就关掉通知；过度设计就先写最短的版本；写作恐惧就允许自己写一段垃圾。",
      "",
      "## 三、生活的类型系统",
      "",
      "TypeScript 最迷人的地方，不是让你少写几个 bug，而是迫使你描述清楚一个东西到底是什么。",
      "",
      "```ts",
      "type Evening = {",
      "  moon: 'visible' | 'hidden'",
      "  tea: 'warm' | 'cold'",
      "  thoughts: string[]",
      "  shouldSleep: boolean",
      "}",
      "",
      "const tonight: Evening = {",
      "  moon: 'visible',",
      "  tea: 'cold',",
      "  thoughts: ['还没写完', '明天再说', '再改一版'],",
      "  shouldSleep: true,",
      "};",
      "```",
      "",
      "写完之后我盯着 `shouldSleep: true` 看了一会儿，还是又打开了一个文件。人不是类型安全的，这大概是生活比代码有趣的地方。",
      "",
      "## 四、给明天留一盏灯",
      "",
      "现在这套系统已经可以自己运行：文章、标签、评论、图片，都有它们的位置。我不再需要在凌晨手动改 Markdown 的 frontmatter。",
      "",
      "但我知道，真正需要维护的不是数据库，而是表达的意愿。",
      "",
      "所以给明天留一盏灯吧。哪怕只写一段，哪怕只改一个标点。构建会失败，文章会重写，月亮第二天还是会升起来。",
    ),
  },
  {
    slug: "train-at-blue-hour",
    title: "蓝调时刻的站台",
    subtitle: "关于等待、末班车和一碗自动贩卖机的热咖啡",
    excerpt:
      "日落之后、天黑之前，日本摄影里把这段时间叫作「藍色時刻」。我在一个无名小站等了四十分钟，却意外找回了写作的节奏。",
    category: "night-notes",
    tags: ["生活", "写作"],
    status: "published",
    featured: true,
    pinned: false,
    cover: "/art/generated/cover-train.webp",
    publishedAt: "2026-10-24T10:05:00.000Z",
    content: md(
      "## 一、没有赶上的那班车",
      "",
      "列车在我跑到闸机前十秒关上了门。站务员朝我鞠了一躬，表情里有一种「节哀」的诚恳。下一班要等四十分钟。",
      "",
      "这是一个小到连便利店都没有的站。月台上有一台自动贩卖机，一盏嗡嗡作响的白炽灯，和远处被晚霞烧红的山脊线。",
      "",
      "我买了一杯热咖啡，坐在长椅上，第一次没有掏出手机。",
      "",
      "## 二、蓝调时刻",
      "",
      "天色从橘红变成藕粉，再变成一种很深的蓝。这个过程比想象中快，大概只有二十多分钟。摄影的人把这段时间叫作蓝调时刻，因为它短暂、安静，而且光的方向刚好让人显得温柔。",
      "",
      "站台的广播每隔一会儿响一次，念着一些我记不住的地名。风穿过铁轨，带着雨后泥土的味道。",
      "",
      "> 有些风景不需要被拍下来。它只需要在你身上停留足够久，久到你能听见自己的呼吸。",
      "",
      "我忽然意识到，自己已经很久没有「无事可做」了。通勤时听播客，吃饭时看视频，连洗澡都要放一集解说。时间被填得很满，却没有一刻真正属于我。",
      "",
      "## 三、慢下来的练习",
      "",
      "那天之后，我给自己定了一个很小的规则：每周留一次没有目的地的出行。不带电脑，不设提醒，只带一本薄薄的本子。",
      "",
      "最初几次很不适应，总觉得应该做点什么。后来慢慢发现，灵感并不来自更多的输入，而来自输入之间的空隙。",
      "",
      "- 观察一个陌生人的鞋。",
      "- 记住一家店的招牌颜色。",
      "- 把听到的一句话原样写下来，不急着解释。",
      "",
      "这些练习没有直接变成文章，但它们让我的句子重新有了重量。",
      "",
      "## 四、末班车",
      "",
      "四十分钟很快过去。列车进站时带起一阵风，把站台上的落叶卷成一个小小的漩涡。",
      "",
      "我上车，坐在靠窗的位置。玻璃上映出我的脸，也映出后退的灯火。那一刻我决定，把这篇文字写下来。",
      "",
      "不是为了记录那班错过的车，而是为了记住：在所有人都赶路的时候，我曾在原地，认真地等过一次。",
    ),
  },
  {
    slug: "personal-blog-postgresql",
    title: "个人博客的数据库，为什么我选了 PostgreSQL",
    subtitle: "从 Markdown 文件到一套真正属于自己的内容系统",
    excerpt:
      "文件系统很浪漫，但当你需要草稿、标签、评论、媒体库和全文检索时，一个可靠的关系型数据库会让写作系统安静很多。",
    category: "code-notes",
    tags: ["PostgreSQL", "Next.js", "独立开发"],
    status: "published",
    featured: false,
    pinned: false,
    cover: "/art/generated/cover-archive.webp",
    publishedAt: "2026-09-30T08:40:00.000Z",
    content: md(
      "## 一、从文件到数据库",
      "",
      "最早的博客是几十个 Markdown 文件。它们简单、透明、可以用 Git 管理，也足够优雅。问题是，每当我想加一个「草稿箱」，就要在文件名前面加 `_draft`；想加评论，就要接第三方服务；想改一个标签，就要写脚本批量替换。",
      "",
      "浪漫的代价是，所有业务逻辑最后都变成了文件名约定。",
      "",
      "于是我把它迁移到了 PostgreSQL。不是为了炫技，而是因为博客终于长出了需要被认真对待的结构。",
      "",
      "## 二、为什么是 PostgreSQL",
      "",
      "### 1. 我需要的是关系，不是文档",
      "",
      "文章、标签、分类、评论之间有明确的关系。多对多标签用一张中间表就能表达，评论可以级联删除，文章可以安全地关联媒体。这些在关系型数据库里是原生能力。",
      "",
      "### 2. JSONB 给了我退路",
      "",
      "站点设置是一组高度可变的键值。用 `jsonb` 存一整个设置对象，既保留了扩展性，也不至于为每个开关建一列。",
      "",
      "```sql",
      "CREATE TABLE site_settings (",
      "  key text PRIMARY KEY,",
      "  value jsonb NOT NULL,",
      "  updated_at timestamptz NOT NULL DEFAULT now()",
      ");",
      "```",
      "",
      "### 3. 全文检索可以很轻",
      "",
      "数据量不大的时候，`ILIKE` 已经够用；需要更认真时，再加 `tsvector` 和 GIN 索引。PostgreSQL 允许系统随着内容一起长大，而不是一开始就过度设计。",
      "",
      "## 三、表结构的三条原则",
      "",
      "1. **软状态用枚举约束**：文章只有 `draft` 和 `published`，评论只有 `pending`、`approved`、`spam`。数据库替你挡住一半脏数据。",
      "2. **时间统一用 `timestamptz`**：部署到任何时区，排序都不会错。",
      "3. **删除要有边界**：文章的标签关系级联删除，分类删除后文章保留但分类置空。",
      "",
      "## 四、迁移是一次整理",
      "",
      "迁移数据库的过程，其实是一次对内容模型的整理。哪些字段真的需要？评论要不要审核？草稿和发布之间需不需要版本？",
      "",
      "当你被迫用表结构描述自己的写作习惯，很多模糊的流程会突然变得清晰。",
      "",
      "现在，打开后台就能看到所有文章、评论和图片。它们安静地待在数据库里，像一间整理好的书房。",
      "",
      "> 工具的意义不是让你写得更快，而是让你在想写的时候，不必先和工具搏斗。",
    ),
  },
  {
    slug: "anime-and-memory",
    title: "动画如何保存我们的记忆",
    subtitle: "从一帧静止的夏天说起",
    excerpt:
      "有些作品并不是因为剧情被记住，而是因为它替我们保存了某个具体夏天的温度。关于动画、记忆和不可复制的观看时刻。",
    category: "fantasy-room",
    tags: ["动画", "写作"],
    status: "published",
    featured: true,
    pinned: false,
    cover: "/art/generated/cover-classroom.webp",
    publishedAt: "2026-08-16T13:10:00.000Z",
    content: md(
      "## 一、一帧夏天",
      "",
      "我记不清那部动画的结局了，但我一直记得一个镜头：傍晚的教室，窗帘被风吹起来，桌上的作业本翻过一页，远处的蝉鸣突然停了一拍。",
      "",
      "那个镜头没有任何剧情作用。它只是让时间停了一下。",
      "",
      "很多年以后，我在一个真实的夏天里闻到了类似的味道：刚下过雨的操场、晒热的塑胶跑道、还有教室里粉笔灰和橘子汽水混在一起的气味。那一瞬间，动画里的画面和我的记忆重叠了。",
      "",
      "## 二、记忆是剪辑出来的",
      "",
      "人的记忆并不像录像带，更像一个不断被重写的剪辑工程。我们记住的是情绪的高光、颜色的残影，以及某些被反复讲述的片段。",
      "",
      "动画恰好擅长这个。它不需要还原现实，它只需要还原「现实在当时的感受」。",
      "",
      "- 过曝的白色天空，是少年时代无所事事的下午。",
      "- 突然安静下来的蝉鸣，是某个说不出口的告别。",
      "- 逆光里看不清表情的脸，是我们后来才理解的心事。",
      "",
      "> 写实记录发生了什么，动画记录我们如何记得。",
      "",
      "## 三、不可复制的观看时刻",
      "",
      "我很少重看喜欢的作品。不是怕失望，而是怕破坏第一次观看时的那个自己。",
      "",
      "那时我住在出租屋，窗外是一条高架。每周更新的一集是我和那周生活的分界线。片尾曲响起的时候，我会把进度条拖回去，再听一遍。",
      "",
      "现在我可以随时打开高清版本，却再也找不到那种「一周只有一集」的珍惜感。",
      "",
      "## 四、给记忆留一个容器",
      "",
      "所以我还是在写。写这些看起来没什么用的观后感，写那些不会被算法推荐的细节。",
      "",
      "因为记忆会褪色，但只要有人愿意描述，它就能在另一个人的脑海里重新亮一次。",
      "",
      "就像那一帧夏天。它不属于任何剧情，却在我这里活了很久。",
    ),
  },
  {
    slug: "sea-road-summer",
    title: "沿海公路的夏天",
    subtitle: "把相机收起来之后，我看见了更多",
    excerpt:
      "一次没有拍摄计划的旅行。自行车、自动贩卖机、傍晚的海风，以及一个决定：不再用取景框代替眼睛。",
    category: "light-records",
    tags: ["摄影", "生活"],
    status: "published",
    featured: false,
    pinned: false,
    cover: "/art/generated/cover-sea.webp",
    publishedAt: "2026-07-21T09:30:00.000Z",
    content: md(
      "## 一、没有计划的出发",
      "",
      "天气预报说下午有雷阵雨。我还是把自行车推了出来，沿海南下的公路在导航上是一条几乎笔直的线。",
      "",
      "相机挂在胸前，电池满格。我给自己定了一个很俗气的目标：拍一组「夏天的海」。",
      "",
      "骑了不到五公里，我就发现这个目标有多多余。海就在那里，不需要被证明。",
      "",
      "## 二、取景框之外",
      "",
      "中午在一家只有三个座位的面馆吃饭。老板娘把风扇转向我，说今天风大，海边别待太久。",
      "",
      "下午三点，云层压下来，海面变成铅灰色。我把相机收进包里，坐在防波堤上，看一个小孩反复把石子扔进水里。",
      "",
      "那一刻没有构图，没有光线，也没有值得发到社交平台的照片。但我记得风的方向，记得石子落水的声音，记得小孩每次失败都会笑。",
      "",
      "## 三、照片是证据，不是体验",
      "",
      "我依然喜欢摄影。只是不再把「拍到」当作「经历过」的同义词。",
      "",
      "现在按快门之前，我会先问自己：如果这张照片不存在，我还会记得此刻吗？",
      "",
      "如果答案是会，那我就放下相机，多看一会儿。",
      "",
      "## 四、回程",
      "",
      "傍晚的雷雨没有来。天空被撕开一道口子，光从云缝里落下来，把整条公路照成金色。",
      "",
      "我骑车经过那段光，没有停。",
      "",
      "有些风景注定只能留在身体里。这样也很好。",
    ),
  },
  {
    slug: "writing-slowly",
    title: "慢一点写",
    subtitle: "在更新频率之外，重新找回写作的耐心",
    excerpt:
      "当写作变成内容生产，句子会先于感受被写出来。停更三个月后，我重新理解了「完成一篇文章」这件事。",
    category: "night-notes",
    tags: ["写作", "生活"],
    status: "published",
    featured: false,
    pinned: false,
    cover: "/art/generated/cover-desk.webp",
    publishedAt: "2026-06-02T15:00:00.000Z",
    content: md(
      "## 一、停更的三个月",
      "",
      "上一次更新是三月。之后我给自己找了很多理由：工作忙、没有灵感、系统还没搭好。",
      "",
      "真正的原因更简单：我害怕写出来的东西不够好。",
      "",
      "当写作变成内容生产，你会不自觉地用数据衡量它。阅读量、转发、评论、涨粉。每一个指标都在暗示：写得更多，才会被看见。",
      "",
      "于是句子先于感受被写出来。标题先于文章被想好。",
      "",
      "## 二、把标准调低",
      "",
      "停更的第三个月，我重新打开一个空白文档，给自己定了一个新规则：每天写两百字，不修改，不发布。",
      "",
      "两百字很少，少到无法用「没准备好」当借口。",
      "",
      "写着写着，我发现真正想说的东西慢慢浮出来了。它们不在热点里，也不在选题表里，而是在那些被我忽略的日常缝隙里。",
      "",
      "> 写作不是把已经想清楚的东西表达出来，而是在写的过程中，逐渐知道自己在想什么。",
      "",
      "## 三、完成比完美重要",
      "",
      "这篇文章写了两周。中间删掉过三个开头，换过一次结构，最后留下的版本和最初的设想几乎没有关系。",
      "",
      "但它完成了。",
      "",
      "完成意味着它可以被阅读、被误解、被忘记，也意味着我可以开始下一篇。",
      "",
      "## 四、继续写",
      "",
      "我不知道下一次更新是什么时候。也许会很快，也许又要等三个月。",
      "",
      "但我知道，这个空间会一直在。像一张靠窗的书桌，灯亮着，纸摊开，等一个愿意坐下来的人。",
    ),
  },
];

const settings = {
  siteName: "月白",
  siteEn: "TSUKIYO",
  tagline: "在月光与代码之间，留一页给幻想。",
  description:
    "月白 TSUKIYO 是一个二次元气质的个人博客与内容管理系统，记录文字、影像、动画与代码。",
  authorName: "月白主人",
  authorEn: "Tsukiyo",
  bio: "写作者、独立开发者、深夜动画观众。",
  avatarUrl: "/art/generated/avatar-writer.webp",
  heroEyebrow: "A QUIET PLACE BETWEEN MOONLIGHT AND CODE",
  heroTitle: "把夜色 / 写成一页",
  heroSubtitle:
    "这里收集散落在深夜的念头：关于代码、动画、城市与远方的海。愿你在此停留片刻，听见月光落下的声音。",
  announcement: "新站已上线。评论需要经过审核，感谢你的耐心。",
  startDate: "2020-05-17",
  location: "杭州 · 中国",
  nowText: "正在写一个关于记忆与城市的小说，也在维护这套博客系统。",
  aboutIntro:
    "白天写代码，夜里写字。相信好的界面应该像月光：不喧哗，却能照亮该被看见的东西。这个空间用来存放长期主义的作品，以及那些不愿意被信息流冲走的瞬间。",
  stack: ["TypeScript", "Next.js", "PostgreSQL", "Figma", "Framer Motion"],
  timeline: [
    { year: "2026", title: "月白 TSUKIYO 上线", description: "把博客重写成一套完整的写作与内容管理系统。" },
    { year: "2025", title: "开始认真写作", description: "停止追逐更新频率，转向更长、更慢的文章。" },
    { year: "2024", title: "第一次独立开发", description: "从前端走向全栈，开始独立维护自己的产品。" },
  ],
  socials: {
    github: "https://github.com",
    email: "hello@example.com",
    bilibili: "https://space.bilibili.com",
  },
  commentsEnabled: true,
  footerText: "月光不问归期，代码不问深夜。",
  icp: "",
};

try {
  console.log("→ 写入管理员账号…");
  const passwordHash = await hashPassword(process.env.ADMIN_PASSWORD || "tsukiyo2026");
  await sql`
    INSERT INTO app_user (email, name, password_hash, avatar_url)
    VALUES (${process.env.ADMIN_EMAIL || "admin@tsukiyo.local"}, ${process.env.ADMIN_NAME || "月白主人"}, ${passwordHash}, '/art/generated/avatar-writer.webp')
    ON CONFLICT (email) DO NOTHING
  `;

  console.log("→ 写入分类与标签…");
  const categoryIds = new Map();
  for (const category of categories) {
    const [row] = await sql`
      INSERT INTO categories (slug, name, description, accent, sort)
      VALUES (${category.slug}, ${category.name}, ${category.description}, ${category.accent}, ${category.sort})
      ON CONFLICT (slug) DO UPDATE SET slug = EXCLUDED.slug
      RETURNING id
    `;
    categoryIds.set(category.slug, row.id);
  }

  const tagIds = new Map();
  for (const [name, slug] of tags) {
    const [row] = await sql`
      INSERT INTO tags (name, slug) VALUES (${name}, ${slug})
      ON CONFLICT (slug) DO UPDATE SET slug = EXCLUDED.slug
      RETURNING id
    `;
    tagIds.set(name, row.id);
  }

  console.log("→ 写入示例文章…");
  const [{ count: existingPosts }] = await sql`SELECT count(*)::int AS count FROM posts`;
  if (existingPosts === 0) {
  for (const post of posts) {
    const minutes = Math.max(
      1,
      Math.ceil(
        (post.content.match(/[\u4e00-\u9fff]/g) ?? []).length / 320 +
          (post.content.match(/[A-Za-z0-9]+/g) ?? []).length / 220,
      ),
    );
    const [row] = await sql`
      INSERT INTO posts (
        slug, title, subtitle, excerpt, content, cover_url, category_id,
        status, featured, pinned, reading_minutes, published_at, seo_description
      ) VALUES (
        ${post.slug}, ${post.title}, ${post.subtitle}, ${post.excerpt}, ${post.content},
        ${post.cover}, ${categoryIds.get(post.category)}, ${post.status}, ${post.featured},
        ${post.pinned}, ${minutes}, ${post.publishedAt}, ${post.excerpt}
      )
      ON CONFLICT (slug) DO UPDATE SET slug = EXCLUDED.slug
      RETURNING id
    `;
    for (const tagName of post.tags) {
      if (!tagIds.has(tagName)) continue;
      await sql`
        INSERT INTO post_tags (post_id, tag_id) VALUES (${row.id}, ${tagIds.get(tagName)})
        ON CONFLICT DO NOTHING
      `;
    }
  }
  } else {
    console.log("  · 已有文章，跳过示例文章写入");
  }

  console.log("→ 写入站点设置…");
  await sql`
    INSERT INTO site_settings (key, value) VALUES ('site', ${sql.json(settings)})
    ON CONFLICT (key) DO NOTHING
  `;

  console.log("→ 写入示例评论…");
  const [{ id: commentPostId }] = await sql`SELECT id FROM posts WHERE slug = 'moonlight-compiler' LIMIT 1`;
  const [{ count: commentCount }] = await sql`SELECT count(*)::int FROM comments`;
  if (commentCount === 0) {
    const comments = [
      ["林间有风", "lin@example.com", "把生活写成可维护的代码，这个说法太准确了。最近也在做类似的事，先命名，再解决。", "approved"],
      ["Aki", "aki@example.com", "「人不是类型安全的」这句笑了，也被戳到了。晚安，早点睡。", "approved"],
      ["一只路过的猫", null, "喜欢这个站的颜色，像深夜便利店。", "approved"],
      ["新访客", "new@example.com", "请问博客系统会开源吗？想给自己也搭一个。", "pending"],
    ];
    for (const [name, email, content, status] of comments) {
      await sql`
        INSERT INTO comments (post_id, author_name, author_email, content, status)
        VALUES (${commentPostId}, ${name}, ${email}, ${content}, ${status})
      `;
    }
  }

  console.log("→ 写入示例音乐…");
  const [{ count: musicCount }] = await sql`SELECT count(*)::int FROM music`;
  if (musicCount === 0) {
    await sql`
      INSERT INTO music (title, artist, album, cover_url, audio_url, sort, enabled)
      VALUES ('月光环境音', '月白', 'Night Studies', '/art/generated/cover-music.webp', '/audio/moonlight-ambient.wav', 0, true)
    `;
  } else {
    console.log("  · 已有音乐，跳过示例音乐写入");
  }

  console.log("✓ 初始化完成");
  console.log(`  管理员：${process.env.ADMIN_EMAIL || "admin@tsukiyo.local"}`);
  console.log(`  初始密码：${process.env.ADMIN_PASSWORD || "tsukiyo2026"}`);
} finally {
  await sql.end();
}