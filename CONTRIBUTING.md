# 参与贡献

谢谢你愿意花时间改进月白。下面是让改动顺利合并需要知道的几件事。

## 本地跑起来

```bash
npm install
cp .env.example .env.local   # 改成你本机 PostgreSQL 的连接串
npm run db:setup
npm run db:seed
npm run dev
```

Windows 上也可以直接双击 `dev.bat`。

## 提交前

```bash
npm run typecheck
npm run build
```

两条都要通过，CI 跑的也是这两条。涉及界面的改动，请在夜航和晨雾两个主题、桌面和手机两种宽度下都看一眼。

## 分支

所有改动先进 `feature`，再沿 `feature → dev → release → prod → master` 晋升，细节见 [BRANCHING.md](BRANCHING.md)。PR 的目标分支请选 `feature`。

提交信息用 `feat:`、`fix:`、`docs:`、`chore:`、`refactor:` 前缀。

## 几条约定

- **动效**：只动 `transform` 和 `opacity`，不要给大面积元素加模糊；新动画要在 `prefers-reduced-motion` 下关闭。
- **文案**：前台新增文字要进 `src/i18n/messages.ts`，七种语言都补上。
- **数据库**：结构变更新增一份 `db/migrations/000N_*.sql`，写成可重复执行的形式（`IF NOT EXISTS`），不要改已有迁移。
- **素材**：图片压成 WebP 放进 `public/`，不要引用外链图床。
- **数据**：不要提交 `.env.local`、`data/uploads`、`data/music` 或任何真实密钥。

## 报告问题

Bug 和功能建议请走 Issue 模板。安全问题请看 [SECURITY.md](SECURITY.md)，不要直接公开细节。
