# Changelog

## v1.0.0

### 前台

- 二次元夜航 / 晨雾双主题，夜景与晨景双首屏插画
- 首页、文章、分类、标签、归档、关于、友链、产品、搜索
- 文章阅读：目录、阅读进度、上下篇、相关推荐、点赞、评论
- 玻璃黑胶音乐播放器：歌单、进度、音量、循环、跨页播放
- 7 语言切换：中文 / English / 日本語 / Deutsch / Français / Español / 한국어
- RSS、sitemap、robots、OG 分享图、404

### 内容

- CSDN 29 篇文章导入，真实阅读与评论计数
- 微信公众号「石哥说编程」4 篇长文导入，封面使用原文配图
- 每篇 CSDN 文章独立生成标题匹配封面
- 示例文章转为草稿，保留为演示素材

### 后台

- 文章 CRUD、Markdown 编辑器、封面与媒体库
- 分类、标签、评论审核、音乐歌单、站点设置
- 导入文章 SOURCE DATA：真实阅读 / 点赞 / 评论录入
- 账号密码修改

### 工程

- Next.js 15 + React 19 + TypeScript + Tailwind CSS 4
- PostgreSQL 18 + postgres.js，迁移与种子脚本
- 本地一键启动、Docker Compose、健康检查
- 七语言自建字典、Cookie 记忆、Accept-Language 检测
- 分支模型：feature → dev → release → prod → master