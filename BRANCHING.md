# 分支模型 / Branching Model

月白 TSUKIYO 使用一条明确的晋升链，所有代码从 feature 一路走到 master：

```text
feature -> dev -> release -> prod -> master
```

| 分支 | 角色 | 说明 |
| --- | --- | --- |
| `feature` | 功能开发 | 新功能、新文章导入、图片生成、重构都先落在这里 |
| `dev` | 集成分支 | 多个 feature 合并后在这里跑通、联调 |
| `release` | 发布分支 | 冻结功能，只修发布阻塞问题；写入 `VERSION` 与 `CHANGELOG.md` |
| `prod` | 线上分支 | 与线上运行版本一致，只接受来自 `release` 的合并 |
| `master` | 版本存根 | 默认分支；保存每次正式版本的合并记录与版本标签，不直接开发 |

## 晋升规则

1. 从 `feature` 开分支开发，完成后合并回 `feature`（或直接提交到 `feature`）。
2. `feature` → `dev`：至少通过 `npm run typecheck` 与 `npm run build`。
3. `dev` → `release`：功能冻结，更新 `VERSION` / `CHANGELOG.md`。
4. `release` → `prod`：部署验证通过后合并。
5. `prod` → `master`：打版本标签，形成版本存根。

```bash
git checkout feature
git pull origin feature

git checkout dev
git merge --no-ff feature -m "chore: promote feature to dev"

git checkout release
git merge --no-ff dev -m "chore: cut release v1.0.0"
# 更新 VERSION / CHANGELOG.md 后提交

git checkout prod
git merge --no-ff release -m "chore: deploy v1.0.0 to production"

git checkout master
git merge --no-ff prod -m "chore: record version v1.0.0"
git tag -a v1.0.0 -m "Tsukiyo Blog v1.0.0"
git push origin feature dev release prod master --tags
```

## 约定

- `master` 是 GitHub 默认分支，只保留版本记录。
- 不直接在 `prod` / `master` 上写业务代码。
- 线上修复：从 `prod` 开 `hotfix/*`，修完合回 `prod`，再同步 `release`、`dev` 与 `master`。
- 版本号采用语义化版本：`MAJOR.MINOR.PATCH`。
- 提交信息使用 `feat:`、`fix:`、`docs:`、`chore:`、`refactor:` 前缀。