# 月白 TSUKIYO

> 在月光与代码之间，留一页给幻想。

一套**二次元高级感**的个人博客 + 内容管理系统。前台是克制的编辑式阅读空间，后台是能真正日更的写作控制台。前端、后端、PostgreSQL 数据库、示例内容与一键启动脚本全部包含在本仓库中。

![月白首页](docs/home.png)

## 它是什么

不是博客模板，也不是后台脚手架，而是一套可以直接开始写作的完整系统：

- **前台**：电影感首屏、二次元夜城插画、文章网格、沉浸式 Markdown 阅读、目录、阅读进度、评论、点赞、归档、标签、关于页、友链、产品、搜索、RSS、sitemap、404，右下角的玻璃黑胶音乐播放器，以及**中 / 英 / 日 / 德 / 法 / 西 / 韩 七种语言切换**。
- **后台**：登录鉴权、数据总览、文章 CRUD、Markdown 双栏写作与实时预览、封面上传、分类/标签管理、评论审核、媒体库、音乐歌单、站点设置、账号密码修改。
- **数据**：本机 PostgreSQL，首次启动自动建库、建表、写入示例文章与管理员账号。
- **部署**：Windows 双击 `start.bat`，或 `docker compose up -d`。

---

## 从四个参考项目里学到了什么

| 参考项目 | 借鉴点 | 在月白中的落地 |
| --- | --- | --- |
| [XinghuisamaBlogs](https://github.com/heiehiehi/XinghuisamaBlogs) | 毛玻璃、个人化氛围、Markdown 写作、独立本地控制台 | 只保留少量 glass 表面与漂浮导航，不做满屏毛玻璃；控制台独立成 `/admin`，前台保持阅读优先 |
| [ThriveX-Blog](https://github.com/LiuYuYang01/ThriveX-Blog) | 完整博客管理系统的信息架构：文章、分类、标签、评论、媒体、设置、图表、Docker | 用 Next.js Route Handlers 实现同等业务闭环，去掉 Spring Boot 与 MySQL，减少一键部署的组件数量 |
| [ai-design-skills](https://github.com/elayadesign/ai-design-skills) | 单页单一目标、字体/间距/圆角/动效规范、完整交互状态 | 首页只保留一个主 CTA；标题、正文、按钮、Caption 使用统一类型系统；所有按钮具备 hover/active/focus |
| [Nutlope/hallmark](https://github.com/nutlope/hallmark) | 反 AI 套路、拒绝空壳内容、真实文案与素材、浏览器验收 | 示例文章为完整长文而非 lorem ipsum；插画全部本地化 WebP，不依赖图库、图床或外链；没有虚假订阅与假数据 |

> 四个项目只用于研究与设计参考，没有复制其源代码。ThriveX 为 GPL-3.0，XHBlogs 为 CC BY-NC 4.0；本项目为独立实现，采用 MIT。

---

## 界面

### 首页

![首页](docs/home.png)

深色「夜航」与浅色「晨雾」两套主题；首屏分别使用夜景与晨景两张 AI 生成的二次元插画，竖排日文、樱花粒子、月晕与装饰线条由 CSS / SVG 手写完成，不依赖外部图片服务。

### 文章阅读

![文章页](docs/post.png)

衬线正文、章节序号、引用块、代码高亮、右侧目录、阅读进度、上下篇、相关文章、评论与点赞。

### 后台

![后台总览](docs/admin.png)

### 写作控制台

![编辑器](docs/editor.png)

Markdown 工具栏、实时预览、封面拖传、分类/标签、精选/置顶、SEO、草稿与发布。

### 音乐管理

![音乐管理](docs/admin-music.png)

上传音频或填写外链，设置封面、歌手、排序与启用状态。删除歌曲不会自动删除已上传的音频文件，方便换歌单时复用。

### 移动端

<img src="docs/home-mobile.png" alt="移动端首页" width="320" />

### 音乐播放器

![音乐播放器](docs/music.png)

右下角的玻璃黑胶唱机。点击展开歌单，支持播放/暂停、上一首/下一首、进度、音量与循环；默认不自动播放，切换页面时会继续播放并记住音量与进度。

### 友链

![友链](docs/friends.png)

导航「关于」之后新增了「友链」和「产品」。友链页收录值得保留的小站与工具，并提供交换友链的入口；数据集中在 [`src/content/site-links.ts`](src/content/site-links.ts)，改一行就能换成你自己的朋友。

### 产品

![产品](docs/products.png)

产品页目前展示两个开源项目：

- [三省六部 · Imperial Court](https://github.com/shilaoban666/dsh-imperial-court)：DSH 原生多工具协作插件，中书拟旨、门下封驳、六部并行，隔离 git 分支，批红才合并。
- [大肥鱼 · DeepSeek Daughter](https://github.com/shilaoban666/deepseek-daughter)：有身体、情绪和长期记忆的开源 AI 伙伴，桌面 / QQ / 微信多端。

两张产品配图同样使用 qwen-image-3.0 生成，已本地压缩为 WebP。

**点开产品卡片**会进入完整详情页：产品定位、关键数据、长介绍、核心能力、真实界面截图（来自项目仓库）、下载区、安装命令（一键复制）、技术栈与许可证、下一个产品。

- **DeepSeek Daughter** 直接提供 Windows 便携版 `.exe` 下载（v0.3.0，157MB），首屏和下载区都有按钮，并附版本、文件名、大小与更新日志入口。
- **Imperial Court** 没有独立 exe，首屏按钮会跳到安装指南，直接给出 DSH 插件安装命令。

![产品详情](docs/product-court.png)

![下载区](docs/product-download.png)

> 下载链接直接指向 GitHub Releases 资产。发布新版本时，修改 [`src/content/site-links.ts`](src/content/site-links.ts) 里的 `downloads[].version / url / filename / size` 即可；没有 release 资产的产品会自动回退到安装指南，不会显示空下载按钮。

### CSDN 文章导入

![CSDN 文章页](docs/csdn-post.png)

已把 CSDN（`qq_45044477`，孤独叶）的文章批量导入站内：

- 成功导入 **29 篇**，覆盖 Java、Spring、数据库、大数据、Linux、算法、爬虫、前端等
- 阅读量使用 CSDN 真实数据，站内合计 **39,844 阅读**
- 保留 CSDN 原站 **10 条评论的真实计数**，文章头部和评论区上方都有原站入口
- 每篇标注 `CSDN` 来源、真实阅读/评论数，并设置 canonical 指向原文
- 正文图片全部下载并压缩成 WebP，本地托管
- 原 6 篇月白示例文章已转为草稿，避免示例内容混进作品集
- 有 1 篇原站正文为空（《在Spring中的扩展点》），已跳过；其余 29 篇均有正文

> 没有伪造阅读量或评论。CSDN 原站数据可以直接核对，真实数字反而更可信。评论内容受 CSDN 登录/风控限制无法脚本迁移，因此站内展示的是真实评论计数 + 原站链接，站点自己的评论系统仍然可用。

每篇 CSDN 文章都有一张按标题单独生成的封面（qwen-image-3.0），不再复用通用技术插图。封面位于 `public/art/generated/articles/`，每张 1472×981 WebP，约 60–200KB。

![文章封面总览](docs/article-covers-sheet.jpg)

重新导入或增量更新：

```bash
node scripts/import-csdn.mjs
```

脚本会从 CSDN 列表 API 读取文章、按原文链接去重、缓存 HTML、下载图片，并在导入达到 20 篇后自动把示例文章转为草稿。

### 公众号文章导入

已从「石哥说编程」公众号导入 4 篇长文：

- 《五分钟学会服务器进程底层原理（上）》
- 《五分钟学会服务器进程底层原理（下）》
- 《五分钟学会流式编程底层》
- 《一篇文章搞懂 CompletableFuture 的底层原理和用法》

处理方式：

- 新增分类「公众号文章」
- **封面直接使用文章内配图**（`og:image`），不额外生成
- 正文图片全部下载并压缩为 WebP
- 保留公众号原文链接与真实发布时间
- 微信不公开阅读量/评论数，因此不显示假数字；文章内可跳原站
- 后台编辑导入文章时，可在 **SOURCE DATA** 中手动填写公众号后台的真实阅读/点赞/评论数，前台会标注为「公众号阅读 / 公众号点赞 / 公众号评论」
- 重复导入会按原文链接去重

![后台来源数据](docs/admin-source-data.png)

导入脚本：[`scripts/import-wechat.mjs`](scripts/import-wechat.mjs)  
素材目录：[`wechat-import/links.txt`](wechat-import/links.txt)

### 七种语言

![语言切换](docs/language-switcher.png)

支持 **中文、English、日本語、Deutsch、Français、Español、한국어**。首次访问会按浏览器语言自动选择，右上角的翻译按钮可以随时切换，选择会写入 Cookie 记住一年。

![英文首页](docs/home-en.png)

- 导航、首页、文章列表、阅读页、归档、标签、关于、搜索、评论、播放器、404 全部本地化
- 日期、分类名、标签名与示例文章标题/摘要都有对应语言
- 示例文章正文仍为中文原文，非中文界面会在正文前提示；后台控制台保持中文，方便站主写作
- 语言依据 Cookie 切换，不改变现有 URL；浏览器语言检测在无 Cookie 时生效

---

## 技术栈

| 层 | 选型 |
| --- | --- |
| 前端 | Next.js 15 App Router、React 19、TypeScript |
| 样式 | Tailwind CSS 4、自定义设计令牌、AI 二次元插画 + 手写 SVG / CSS 装饰 |
| 动效 | Framer Motion、CSS keyframes、IntersectionObserver |
| 后端 | Next.js Route Handlers（REST API）、Zod 校验、限流、同源检查 |
| 数据库 | PostgreSQL 18 + postgres.js（原生 SQL） |
| 鉴权 | scrypt 密码哈希 + 数据库 Session + HttpOnly Cookie |
| 国际化 | 自建 7 语言字典 + Cookie 记忆 + `Accept-Language` 自动检测 |
| 内容 | Markdown + GFM + rehype-highlight + rehype-slug |
| 字体 | Cormorant Garamond、Noto Serif SC、Manrope（本地 npm 打包，无 Google Fonts 运行时依赖） |

---

## 一键启动（Windows，推荐）

### 前置条件

1. **Node.js 20.9+**：<https://nodejs.org/>
2. **PostgreSQL 18**（或 14+）：安装时记住 `postgres` 用户的密码
3. 双击根目录的 **`start.bat`**

脚本会自动：

- 检查 Node 版本
- 生成 `.env.local`（含随机 `AUTH_SECRET`）
- 安装依赖
- 启动 PostgreSQL 服务（如发现 Windows 服务）
- 创建数据库 `tsukiyo_blog`
- 建表并写入示例文章 / 分类 / 标签 / 评论 / 站点设置
- 构建生产版本并启动
- 打开 <http://localhost:3000>

首次运行需要 1–3 分钟。以后再次双击会跳过依赖安装与构建，直接启动。

### 默认管理员

```
后台地址：http://localhost:3000/admin
邮箱：admin@tsukiyo.local
密码：tsukiyo2026
```

> 第一次登录后请到 **控制台 → 站点设置 → 账号与安全** 修改密码。
> 如果 PostgreSQL 密码不是 `123456`，先编辑 `.env.local` 中的 `DATABASE_URL`。

### 开发模式

双击 `dev.bat`，或：

```bash
npm install
npm run dev
```

---

## 手动启动（macOS / Linux / 已有数据库）

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env.local
# 编辑 DATABASE_URL、AUTH_SECRET、ADMIN_PASSWORD

# 3. 建表 + 示例内容
npm run db:setup
npm run db:seed

# 4. 开发
npm run dev

# 5. 生产
npm run build
npm run start
```

要求 PostgreSQL 已启动，并且 `DATABASE_URL` 指向的数据库可由该用户创建（首次运行会自动 `CREATE DATABASE`）。

---

## 环境变量

| 变量 | 说明 | 默认 |
| --- | --- | --- |
| `DATABASE_URL` | PostgreSQL 连接串 | `postgres://postgres:123456@127.0.0.1:5432/tsukiyo_blog` |
| `NEXT_PUBLIC_SITE_URL` | 站点公开地址，用于 RSS / sitemap / OG | `http://localhost:3000` |
| `AUTH_SECRET` | Session / IP 哈希密钥，生产务必随机 | 启动脚本自动生成 |
| `ADMIN_EMAIL` | 首次初始化的管理员邮箱 | `admin@tsukiyo.local` |
| `ADMIN_PASSWORD` | 首次初始化的管理员密码 | `tsukiyo2026` |
| `ADMIN_NAME` | 管理员显示名 | `月白主人` |

`.env.local` 已被 `.gitignore` 忽略。**不要把真实密钥提交到 Git。**

---

## 功能清单

### 前台

- [x] 电影感首屏 / 二次元夜城插画 / 月晕 / 樱花粒子
- [x] 深色「夜航」+ 浅色「晨雾」主题切换，记忆用户选择
- [x] 精选文章、最新文章、分类、归档、关于、RSS 订阅入口
- [x] 文章列表搜索、分类筛选、分页
- [x] Markdown 阅读、代码高亮、目录、上下篇、相关文章
- [x] 阅读进度条、文章点赞、浏览量
- [x] 游客评论 + 审核后展示 + 楼中楼回复
- [x] 标签云、标签详情、分类详情、年份归档
- [x] 全站搜索、404、动态 sitemap、robots、RSS、OG 卡片
- [x] 友链页与产品页：可在配置文件中维护，支持七语言界面与产品文案
- [x] CSDN 批量导入：真实阅读/评论计数、原站链接、图片本地化、增量更新
- [x] 公众号文章导入：封面使用原文配图、正文图片本地化、来源链接、去重
- [x] 产品详情页：真实截图画廊、exe 直链下载、能力清单、安装命令、许可证与下一个产品
- [x] 中 / 英 / 日 / 德 / 法 / 西 / 韩 七语言切换，自动检测浏览器语言并记住选择
- [x] 玻璃黑胶音乐播放器：默认不自动播放，支持歌单、进度、音量、循环、跨页连续播放
- [x] 完整移动端适配与 `prefers-reduced-motion`

### 后台

- [x] 邮箱 + 密码登录、Session 管理、登录限流
- [x] 数据总览、发布节奏图、最近编辑、最近评论、阅读 Top 5
- [x] 文章列表：状态筛选、搜索、发布/转草稿、删除
- [x] Markdown 编辑器：工具栏、实时预览、快捷键、未保存提醒
- [x] 封面/插图上传到本地 `data/uploads`，媒体库复制链接
- [x] 分类管理（名称、slug、描述、强调色、排序）
- [x] 标签管理
- [x] 评论审核：通过 / 待审 / 垃圾 / 删除
- [x] 音乐管理：上传音频/封面、外链 URL、排序、启用/停用、试听
- [x] 站点设置：站名、作者、首页文案、关于页、社交、页脚
- [x] 账号名称与密码修改

---

## 目录结构

```text
.
├─ src/
│  ├─ app/
│  │  ├─ (site)/                 # 前台路由组
│  │  │  ├─ page.tsx             # 首页
│  │  │  ├─ posts/               # 列表 + 详情
│  │  │  ├─ categories/[slug]/   # 分类
│  │  │  ├─ tags/                # 标签云 + 标签详情
│  │  │  ├─ archive/             # 归档
│  │  │  ├─ about/               # 关于
│  │  │  └─ search/              # 搜索
│  │  ├─ admin/
│  │  │  ├─ login/               # 登录
│  │  │  └─ (panel)/             # 需要登录的后台
│  │  ├─ api/                    # 后端 REST API
│  │  ├─ rss.xml/route.ts
│  │  ├─ sitemap.ts
│  │  └─ globals.css             # 设计令牌与全局样式
│  ├─ components/                # 前台 / 后台组件
│  ├─ content/site-links.ts      # 友链与产品数据
│  ├─ i18n/                      # 七语言字典、检测、文章/分类/标签本地化
│  ├─ db/                        # postgres.js 客户端与 Drizzle schema
│  └─ lib/                       # 鉴权、设置、查询、校验、工具
├─ db/migrations/0001_init.sql   # 数据库结构
├─ scripts/                      # 建库、种子、一键启动、CSDN 导入
├─ public/art/generated/articles/ # 每篇 CSDN 文章单独生成的封面
├─ public/imported/wechat/       # 公众号正文图片与封面
├─ public/imported/csdn/         # 从 CSDN 下载并压缩的正文图片
├─ public/art/generated/          # AI 生成的二次元插画（WebP）
├─ public/audio/                 # 原创示例环境音
├─ data/uploads/                 # 运行时上传图片（Git 忽略）
├─ data/music/                   # 运行时上传音频（Git 忽略）
├─ start.bat
├─ dev.bat
├─ docker-compose.yml
└─ Dockerfile
```

---

## 数据模型

| 表 | 用途 |
| --- | --- |
| `app_user` | 管理员账号（scrypt 哈希） |
| `sessions` | 数据库 Session，Cookie 仅保存随机 token |
| `posts` | 文章、草稿、封面、SEO、浏览量、点赞、CSDN/公众号来源字段 |
| `categories` / `tags` / `post_tags` | 分类与多对多标签 |
| `comments` | 评论、审核状态、楼中楼、IP 哈希 |
| `media` | 上传图片索引 |
| `music` | 歌单：封面、音频地址、排序、启用状态 |
| `site_settings` | 站点配置（JSONB） |

迁移文件：`db/migrations/0001_init.sql`。重复执行安全，启动脚本会按文件名顺序应用。

---

## API 一览

```text
POST   /api/auth/login
POST   /api/auth/logout
PUT    /api/admin/account

GET    /api/admin/posts
POST   /api/admin/posts
GET    /api/admin/posts/:id
PATCH  /api/admin/posts/:id
DELETE /api/admin/posts/:id
PATCH  /api/admin/posts/:id/status

GET/POST    /api/admin/categories
PATCH/DELETE /api/admin/categories/:id
GET/POST    /api/admin/tags
PATCH/DELETE /api/admin/tags/:id
PATCH/DELETE /api/admin/comments/:id

GET/POST    /api/admin/media
DELETE      /api/admin/media/:id
GET         /api/uploads/:year/:month/:file
GET/PUT     /api/admin/settings

GET/POST    /api/admin/music
PATCH/DELETE /api/admin/music/:id
POST        /api/admin/music/upload
GET         /api/audio/:year/:month/:file

POST   /api/posts/:slug/like
POST   /api/posts/:slug/views
POST   /api/posts/:slug/comments
GET    /api/health
```

所有后台 API 都要求有效 Session；写操作校验同源。登录与评论接口带内存限流。

---

## Docker 部署

```bash
# 建议先改掉默认密码
export POSTGRES_PASSWORD='your-strong-password'
export AUTH_SECRET="$(openssl rand -hex 32)"
export NEXT_PUBLIC_SITE_URL='https://your-domain.com'

docker compose up -d --build
docker compose logs -f app
```

访问 `http://服务器IP:3000`。数据卷：`pgdata`（数据库）与 `uploads`（上传图片）。

> 生产环境请在前面加 Nginx / Caddy 并启用 HTTPS；同时把 `NEXT_PUBLIC_SITE_URL` 设置为真实域名。

---

## 设计说明

### 色彩

| 令牌 | 夜航 | 晨雾 |
| --- | --- | --- |
| 背景 | `#07080f` | `#f4f0e7` |
| 文字 | `#eef1f8` | `#1b1b24` |
| 强调 | `#ff7a92`（月桃） | `#c6455f`（朱砂） |
| 辅助 | `#8dd8e8`（青瓷） | `#2f7d8c` |
| 金 | `#d8b98c` | `#9a7440` |

### 字体

- 标题：Cormorant Garamond + Noto Serif SC Variable
- 正文：Noto Serif SC（文章）/ Manrope + 系统中文字体（界面）
- 所有字体通过 npm 自托管，构建时不需要访问 Google Fonts。

### 为什么把插画本地化

- 一键部署不依赖图床或外部图片域名
- 统一使用 qwen-image-3.0 生成，再人工筛选构图、裁切为 3:2 / 16:9，压缩成 WebP
- 单张封面约 100–210KB，首屏约 90KB，移动端也不会拖慢首屏
- 插画文件都在 `public/art/generated/`，可以直接替换成你自己的作品

---

## 常见问题

**Q：启动时提示 PostgreSQL 密码认证失败？**
编辑 `.env.local` 的 `DATABASE_URL`，把 `postgres:123456` 改成你安装 PostgreSQL 时设置的密码，然后重新双击启动。

**Q：3000 端口被占用？**
关闭占用端口的程序，或修改 `package.json` 中 `dev` / `start` 的 `-p 3000`，同时修改 `NEXT_PUBLIC_SITE_URL`。

**Q：修改了后台设置，前台没变化？**
前台为动态渲染，强制刷新（Ctrl+F5）即可。站点设置保存在 `site_settings` 表，不会因重新构建丢失。

**Q：示例文章会被启动脚本覆盖吗？**
不会。种子脚本只在 `posts` 表为空时写入示例文章；已有内容不会被更新或删除。

**Q：为什么语言切换没有改 URL？**
语言选择保存在 `tsukiyo_locale` Cookie 中，切换后整页刷新，现有链接和书签不会失效。首次访问没有 Cookie 时，会根据浏览器 `Accept-Language` 自动选择；找不到匹配语言时回退到 English。后台控制台仍为中文，避免站主写作时来回切换。

**Q：怎么换掉默认的环境音？**
初始歌单里有一首原创的 32 秒环境音《月光环境音》，用于演示播放器。到 **控制台 → 音乐** 编辑或删除它，再上传自己的 MP3/OGG/WAV/M4A/FLAC，或填写音频外链即可。停用全部歌曲后，前台播放器会自动隐藏。

**Q：为什么播放器不自动播放？**
浏览器会拦截带声音的自动播放，突然响音乐也会打扰访客。播放器会记住上次的歌曲、音量和进度，但需要访客主动点击播放。

**Q：上传的图片和音乐在哪？**
图片在 `data/uploads/年/月/`，音乐在 `data/music/年/月/`，分别通过 `/api/uploads/...` 与 `/api/audio/...` 提供访问。备份时请同时备份数据库、`data/uploads` 与 `data/music`。

**Q：想清空演示数据重新开始？**
删除数据库后重新运行 `start.bat`，或执行：

```sql
TRUNCATE comments, post_tags, posts, tags, categories, media, sessions RESTART IDENTITY CASCADE;
```

---

## 安全与边界

- 密码使用 Node `scrypt` 加盐哈希，不存明文。
- Session token 在数据库中只保存 SHA-256 哈希，Cookie 为 HttpOnly + SameSite=Lax。
- 后台写接口校验 Origin；登录 8 次 / 15 分钟、评论 5 条 / 10 分钟限流。
- 上传限制：图片 8MB、音频 30MB，均校验 MIME；文件读取做了路径穿越防护。
- 音频接口支持 HTTP Range，播放器可以拖动进度。
- 评论默认 `pending`，必须审核后才会公开；渲染为纯文本，不执行 HTML。
- 示例文章、作者「月白主人」、社交链接均为演示内容，请在后台替换成你自己的信息。

---

## 许可

本项目代码采用 MIT License。参考项目的代码与素材版权归各自作者所有；本项目未复制其代码，仅借鉴产品与设计思路。

示例文章为虚构内容；插画为 AI 生成的演示素材，可随意替换。