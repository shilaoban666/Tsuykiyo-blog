<div align="center">

<img src="public/og.png" alt="月白 TSUKIYO" width="100%" />

# 月白 TSUKIYO

**在月光与代码之间，留一页给幻想。**

一套二次元高级感的个人博客 + 内容管理系统。<br />
前台是克制的编辑式阅读空间，后台是能真正日更的写作控制台。

[![CI](https://github.com/shilaoban666/Tsuykiyo-blog/actions/workflows/ci.yml/badge.svg)](https://github.com/shilaoban666/Tsuykiyo-blog/actions/workflows/ci.yml)
![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169E1?logo=postgresql&logoColor=white)
[![License](https://img.shields.io/badge/License-MIT-ff7a92)](LICENSE)

**简体中文** · [English](README.en.md)

[亮点](#-亮点) · [预览](#-预览) · [快速开始](#-快速开始) · [技术栈](#-技术栈) · [功能清单](#-功能清单) · [常见问题](#-常见问题)

</div>

---

## ✨ 亮点

<table>
<tr>
<td width="33%" valign="top">

### 🌙 夜航 / 晨雾双主题

两套完整配色、两张首屏插画。切换时新主题从按钮位置**圆形晕开**，铺满整页。

</td>
<td width="33%" valign="top">

### 🎬 会动的页面

页面切换淡出淡入、封面放大成文章头图、首屏星空与流星、滚动视差、卡片柔光与 3D 倾斜。

</td>
<td width="33%" valign="top">

### ✍️ 能日更的后台

Markdown 双栏写作与实时预览、封面上传、分类标签、评论审核、媒体库、站点设置。

</td>
</tr>
<tr>
<td width="33%" valign="top">

### 🌏 七种语言

中 / 英 / 日 / 德 / 法 / 西 / 韩。按浏览器语言自动选择，切换后记住一年。

</td>
<td width="33%" valign="top">

### 🎵 玻璃黑胶播放器

歌单、进度、音量、循环，跨页面连续播放。默认不自动播放，不打扰访客。

</td>
<td width="33%" valign="top">

### 🚀 一键启动

Windows 双击 `start.bat`，或 `docker compose up -d`。自动建库、建表、写入示例内容。

</td>
</tr>
</table>

不是博客模板，也不是后台脚手架：前端、后端、数据库结构、示例内容和启动脚本都在这个仓库里，克隆下来就能开始写。

## 📸 预览

<table>
<tr>
<td width="50%"><img src="docs/home.png" alt="首页 · 夜航" /><p align="center"><sub>首页 · 夜航</sub></p></td>
<td width="50%"><img src="docs/home-light.png" alt="首页 · 晨雾" /><p align="center"><sub>首页 · 晨雾</sub></p></td>
</tr>
<tr>
<td width="50%"><img src="docs/post.png" alt="文章阅读" /><p align="center"><sub>文章阅读：目录、进度、代码高亮</sub></p></td>
<td width="50%"><img src="docs/posts.png" alt="文章列表" /><p align="center"><sub>文章列表：搜索、分类筛选、分页</sub></p></td>
</tr>
<tr>
<td width="50%"><img src="docs/admin.png" alt="后台总览" /><p align="center"><sub>后台总览</sub></p></td>
<td width="50%"><img src="docs/editor.png" alt="写作控制台" /><p align="center"><sub>写作控制台：Markdown 双栏实时预览</sub></p></td>
</tr>
</table>

<details>
<summary><b>更多截图：音乐、多语言、移动端、友链、产品</b></summary>
<br />

| 音乐播放器 | 音乐管理 |
| --- | --- |
| ![音乐播放器](docs/music.png) | ![音乐管理](docs/admin-music.png) |

| 语言切换 | 英文首页 |
| --- | --- |
| ![语言切换](docs/language-switcher.png) | ![英文首页](docs/home-en.png) |

| 友链 | 产品 |
| --- | --- |
| ![友链](docs/friends.png) | ![产品](docs/products.png) |

<p align="center">
<img src="docs/home-mobile.png" alt="移动端首页" width="240" />&nbsp;&nbsp;
<img src="docs/menu-mobile.png" alt="移动端菜单" width="240" />&nbsp;&nbsp;
<img src="docs/music-mobile.png" alt="移动端播放器" width="240" />
</p>

友链与产品的数据集中在 [`src/content/site-links.ts`](src/content/site-links.ts)，改这一个文件就能换成你自己的内容。产品卡片点进去是完整详情页：定位、截图画廊、下载区、安装命令（一键复制）、技术栈与许可证。

</details>

## 🚀 快速开始

### 方式一：Docker（最省事）

```bash
git clone https://github.com/shilaoban666/Tsuykiyo-blog.git
cd Tsuykiyo-blog
docker compose up -d --build
```

打开 <http://localhost:3000>。正式部署前请先设置 `POSTGRES_PASSWORD`、`AUTH_SECRET`、`ADMIN_PASSWORD` 和 `NEXT_PUBLIC_SITE_URL`，并在前面加 Nginx / Caddy 启用 HTTPS。

### 方式二：Windows 一键启动

1. 安装 [Node.js 20.9+](https://nodejs.org/) 和 PostgreSQL 14+（记住 `postgres` 用户的密码）
2. 双击根目录的 **`start.bat`**

脚本会检查环境、生成 `.env.local`（含随机 `AUTH_SECRET`）、安装依赖、建库建表、写入示例内容、构建并启动。首次需要 1–3 分钟，之后再双击直接启动。如果 PostgreSQL 密码不是 `123456`，先改 `.env.local` 里的 `DATABASE_URL`。

### 方式三：手动（macOS / Linux / 已有数据库）

```bash
npm install
cp .env.example .env.local   # 编辑 DATABASE_URL、AUTH_SECRET、ADMIN_PASSWORD
npm run db:setup             # 建库建表
npm run db:seed              # 示例内容与管理员账号
npm run dev                  # 开发；生产用 npm run build && npm run start
```

### 默认管理员

| 后台地址 | 邮箱 | 密码 |
| --- | --- | --- |
| <http://localhost:3000/admin> | `admin@tsukiyo.local` | `tsukiyo2026` |

> [!WARNING]
> 这是演示用的默认账号。第一次登录后请到 **控制台 → 站点设置 → 账号与安全** 修改密码；公开部署前务必通过环境变量改掉 `ADMIN_PASSWORD` 和 `AUTH_SECRET`。

<details>
<summary><b>环境变量</b></summary>
<br />

| 变量 | 说明 | 默认 |
| --- | --- | --- |
| `DATABASE_URL` | PostgreSQL 连接串 | `postgres://postgres:123456@127.0.0.1:5432/tsukiyo_blog` |
| `NEXT_PUBLIC_SITE_URL` | 站点公开地址，用于 RSS / sitemap / OG | `http://localhost:3000` |
| `AUTH_SECRET` | Session / IP 哈希密钥，生产务必随机 | 启动脚本自动生成 |
| `ADMIN_EMAIL` | 首次初始化的管理员邮箱 | `admin@tsukiyo.local` |
| `ADMIN_PASSWORD` | 首次初始化的管理员密码 | `tsukiyo2026` |
| `ADMIN_NAME` | 管理员显示名 | `月白主人` |

`.env.local` 已被 `.gitignore` 忽略。**不要把真实密钥提交到 Git。**

</details>

## 🧱 技术栈

| 层 | 选型 |
| --- | --- |
| 框架 | Next.js 15 App Router、React 19、TypeScript |
| 样式 | Tailwind CSS 4、自定义设计令牌、手写 SVG / CSS 装饰 |
| 动效 | Framer Motion、View Transitions API、CSS 滚动时间线、IntersectionObserver |
| 后端 | Next.js Route Handlers（REST）、Zod 校验、限流、同源检查 |
| 数据库 | PostgreSQL + postgres.js + Drizzle schema |
| 鉴权 | scrypt 密码哈希 + 数据库 Session + HttpOnly Cookie |
| 国际化 | 自建 7 语言字典 + Cookie 记忆 + `Accept-Language` 检测 |
| 内容 | Markdown + GFM + rehype-highlight + rehype-slug |
| 字体 | Cormorant Garamond、Noto Serif SC、Manrope，全部 npm 自托管，不依赖 Google Fonts |

## 📦 功能清单

<details>
<summary><b>展开完整清单（前台 + 后台）</b></summary>
<br />

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
- [x] 页面切换淡出 / 淡入、顶部导航进度线、悬停预取（点击几乎零等待）
- [x] 主题切换从按钮位置圆形晕开；文章卡片封面直接放大成文章头图
- [x] 首屏星空与流星、滚动 / 指针视差、数字滚动、卡片柔光与 3D 倾斜
- [x] 手机与 iPad 适配：平板完整导航、安全区、触屏按压反馈
- [x] 尊重 `prefers-reduced-motion`

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

</details>

## 📥 内容导入

仓库自带两个导入脚本，把已有文章搬进来，图片全部下载并压缩成 WebP 本地托管，按原文链接去重。

| 来源 | 命令 | 说明 |
| --- | --- | --- |
| CSDN | `node scripts/import-csdn.mjs` | 保留原站真实阅读 / 评论计数与原文链接，设置 canonical |
| 微信公众号 | `node scripts/import-wechat.mjs` | 链接写在 [`wechat-import/links.txt`](wechat-import/links.txt)，封面用原文配图 |

导入的数字都来自原站，不伪造阅读量或评论。

<details>
<summary><b>CSDN 导入细节</b></summary>
<br />

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

</details>

<details>
<summary><b>公众号导入细节</b></summary>
<br />

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

</details>

## 🗂 项目结构

<details>
<summary><b>目录结构</b></summary>
<br />

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
├─ db/migrations/                # 数据库结构（3 份迁移）
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

</details>

<details>
<summary><b>数据模型</b></summary>
<br />

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

迁移文件在 `db/migrations/`（`0001_init` 建表、`0002_music` 歌单、`0003_source` 文章来源字段）。重复执行安全，启动脚本会按文件名顺序应用。

</details>

<details>
<summary><b>API 一览</b></summary>
<br />

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

</details>

## 🎨 设计说明

<details>
<summary><b>色彩、字体与插画</b></summary>
<br />

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

</details>

## ❓ 常见问题

<details>
<summary><b>展开常见问题</b></summary>
<br />

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

</details>

## 🔒 安全与边界

- 密码使用 Node `scrypt` 加盐哈希，不存明文。
- Session token 在数据库中只保存 SHA-256 哈希，Cookie 为 HttpOnly + SameSite=Lax。
- 后台写接口校验 Origin；登录 8 次 / 15 分钟、评论 5 条 / 10 分钟限流。
- 上传限制：图片 8MB、音频 30MB，均校验 MIME；文件读取做了路径穿越防护。
- 音频接口支持 HTTP Range，播放器可以拖动进度。
- 评论默认 `pending`，必须审核后才会公开；渲染为纯文本，不执行 HTML。
- 示例文章、作者「月白主人」、社交链接均为演示内容，请在后台替换成你自己的信息。

发现安全问题请看 [SECURITY.md](SECURITY.md)。

## 🤝 参与贡献

欢迎提 Issue 和 PR。开始前请读一下 [CONTRIBUTING.md](CONTRIBUTING.md) 和分支模型 [BRANCHING.md](BRANCHING.md)（`feature → dev → release → prod → master`），版本记录见 [CHANGELOG.md](CHANGELOG.md)。

## 🙏 致谢

设计与产品思路参考了下面四个项目，仅作研究与借鉴，没有复制其源代码：

| 项目 | 借鉴点 |
| --- | --- |
| [XinghuisamaBlogs](https://github.com/heiehiehi/XinghuisamaBlogs) | 毛玻璃、个人化氛围、独立控制台 |
| [ThriveX-Blog](https://github.com/LiuYuYang01/ThriveX-Blog) | 完整博客管理系统的信息架构 |
| [ai-design-skills](https://github.com/elayadesign/ai-design-skills) | 单页单一目标、字体 / 间距 / 动效规范 |
| [Nutlope/hallmark](https://github.com/nutlope/hallmark) | 拒绝空壳内容、真实文案与素材 |

## 📄 许可

代码采用 [MIT License](LICENSE)。示例文章为虚构内容；插画为 AI 生成的演示素材，可随意替换。

<div align="center">
<br />

如果这个项目对你有帮助，欢迎点一个 ⭐

</div>
