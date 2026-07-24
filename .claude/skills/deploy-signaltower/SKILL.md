---
name: deploy-signaltower
description: 信号塔 SignalTower 站点的部署、CI/CD、Cloudflare Pages 与 GitHub Actions、密钥与自定义域名配置。触发词：部署、发布、上线、CF Pages、Cloudflare、GitHub Actions、workflow、密钥/Secrets、自定义域名、绑域名、建镜像站、重新部署、部署失败排查、555736.xyz、signaltowers 账号发仓库。
---

# 部署 / CI-CD / 密钥 / 域名（信号塔 SignalTower）

本站 **GitHub Pages + Cloudflare Pages 双发**，push 即自动上线。本技能记录已配好的全套自动化，及"从 0 建新镜像站"的完整步骤。

## 已配好的现状（改内容只管 push）
- 站点仓库：`signaltowers/signaltowers.github.io`（分支 `main`，根路径 `/`）
- 主域名：**https://555736.xyz**（CF Pages 项目 `signaltower`，自定义域名 active）
- 镜像：**https://signaltowers.github.io**（GitHub Pages）｜ CF 子域：`signaltower.pages.dev`
- **日常发布 = `git push` 到 main**：
  - GitHub Pages 直接 serve 提交的静态文件（自动）。
  - `.github/workflows/deploy-cloudflare.yml` 触发 → `git archive HEAD` 打包 → `wrangler pages deploy` 发到 CF Pages（自动）。
- 仓库已配 Actions Secrets：`CLOUDFLARE_API_TOKEN`、`CLOUDFLARE_ACCOUNT_ID`。

> ⚠️ **CI 不跑 build.py**：workflow 只发布**已提交的文件**。所以本地 `python build.py` 后，**全部产物（HTML/README/sitemap + `assets/og/*.png`）必须一并 commit**，否则线上不更新。

## 凭据来源（值不外露，只 source）
- GitHub：全局技能 `github-signaltowers-auth` → `$GH_SIGNALTOWERS_TOKEN`（`~/.claude/secrets/github-tokens.env`）。账号 `signaltowers`（id 261547409）。
- Cloudflare：`~/.claude/secrets/cloudflare.env` → `$CLOUDFLARE_API_TOKEN`（权限：Pages:Edit + Zone:Read，**无 DNS:Edit**）+ `$CLOUDFLARE_ACCOUNT_ID`（账号 59fe…，与 air-rem/555734、ai-sub/555735、shop 同一 CF 账号）。
- **红线**：token 绝不打印明文 / 不写进 commit·PR·日志 / 不进 git remote URL（push 用临时 URL）。中文 JSON 传 CF/GitHub API 用 UTF-8 文件 `--data-binary @file`，别内联（Windows GBK 会让 API 报 "Problems parsing JSON"）。

## 手动触发 / 排查 CF 部署
```bash
source "$HOME/.claude/secrets/github-tokens.env"; export GH_TOKEN="$GH_SIGNALTOWERS_TOKEN"
R=signaltowers/signaltowers.github.io
gh workflow run deploy-cloudflare.yml --repo "$R" --ref main       # 手动触发
gh run list --repo "$R" --workflow deploy-cloudflare.yml -L 3       # 看结果
gh run view <run-id> --repo "$R" --log-failed | tail -30           # 失败日志
```
- 首跑失败常见原因：Secrets 没配 → 见下方「设 Secrets」。
- token 权限不足（Pages:Edit 缺失）→ CF 后台给 token 加权限。

## 从 0 建一个新镜像 / 新站（完整自动化，本次即按此做）
以新域名 `NNN.xyz`、CF 项目名 `PROJ`、仓库 `signaltowers/REPO` 为例：

### 1. 建 GitHub 仓库 + 推送 + 开 Pages
```bash
source "$HOME/.claude/secrets/github-tokens.env"; TOK="$GH_SIGNALTOWERS_TOKEN"
# 建仓（中文 description 用 UTF-8 文件传体）
printf '{"name":"REPO","description":"...","homepage":"https://NNN.xyz","private":false,"has_issues":true}' > /c/Users/Administrator/AppData/Local/Temp/p.json
curl -s -X POST -H "Authorization: Bearer $TOK" -H "Accept: application/vnd.github+json" --data-binary @/c/Users/Administrator/AppData/Local/Temp/p.json https://api.github.com/user/repos
git init -q; git config user.email "261547409+signaltowers@users.noreply.github.com"; git config user.name signaltowers
git add -A; git commit -q -m "首发"; git branch -M main
git push "https://x-access-token:${TOK}@github.com/signaltowers/REPO.git" HEAD:main
# user/org pages 仓库(<name>.github.io)自动开 Pages；项目仓库用：
curl -s -X POST -H "Authorization: Bearer $TOK" -H "Accept: application/vnd.github+json" https://api.github.com/repos/signaltowers/REPO/pages -d '{"source":{"branch":"main","path":"/"}}'
```

### 2. 建 CF Pages 项目 + 绑域名
```bash
source "$HOME/.claude/secrets/cloudflare.env"; TOK="$CLOUDFLARE_API_TOKEN"; ACC="$CLOUDFLARE_ACCOUNT_ID"
curl -s -X POST -H "Authorization: Bearer $TOK" -H "Content-Type: application/json" \
  "https://api.cloudflare.com/client/v4/accounts/$ACC/pages/projects" -d '{"name":"PROJ","production_branch":"main"}'
curl -s -X POST -H "Authorization: Bearer $TOK" -H "Content-Type: application/json" \
  "https://api.cloudflare.com/client/v4/accounts/$ACC/pages/projects/PROJ/domains" -d '{"name":"NNN.xyz"}'
```
> **DNS 记录本 token 建不了（无 DNS:Edit）**：绑域名后需在 CF 后台给 `NNN.xyz` 加一条 `CNAME @ → PROJ.pages.dev（proxied 橙云）`，或在 Pages 项目 Custom domains 点一下自动建。加完 domain 状态从 pending → active。查状态：
> `curl -s -H "Authorization: Bearer $TOK" ".../accounts/$ACC/pages/projects/PROJ/domains/NNN.xyz"`

### 3. 设 Actions Secrets（供 workflow 用 wrangler 部署）
```bash
source "$HOME/.claude/secrets/cloudflare.env"; source "$HOME/.claude/secrets/github-tokens.env"
export GH_TOKEN="$GH_SIGNALTOWERS_TOKEN"; R=signaltowers/REPO
printf '%s' "$CLOUDFLARE_API_TOKEN"  | gh secret set CLOUDFLARE_API_TOKEN  --repo "$R"
printf '%s' "$CLOUDFLARE_ACCOUNT_ID" | gh secret set CLOUDFLARE_ACCOUNT_ID --repo "$R"
gh secret list --repo "$R"   # 只列名/时间，验证已设
```

### 4. workflow 文件
复制本仓库 `.github/workflows/deploy-cloudflare.yml`，把 `--project-name=signaltower` 改成 `PROJ`。它做：`git archive HEAD | tar -x -C dist; rm -rf dist/.github; npx wrangler@latest pages deploy dist --project-name=PROJ --branch=main --commit-dirty=true`。push 后即自动部署。

## 验证清单
```bash
curl -s -o /dev/null -w "%{http_code}\n" https://555736.xyz/            # 200
curl -s -o /dev/null -w "%{http_code}\n" https://signaltowers.github.io/ # 200
curl -s -o /dev/null -w "%{http_code}\n" https://signaltower.pages.dev/  # 200
```
新绑域名首次 000/SSL 报错属正常（证书签发要几分钟），域名 status=active 后即通。

## Red Flags
- ❌ 改了内容忘 `git add` 全部 build 产物 → 线上不更新（CI 不构建）。
- ❌ CF/GitHub API 内联中文 JSON → "Problems parsing JSON"，改用 `--data-binary @UTF8文件`。
- ❌ 用本 CF token 建 DNS（无权限，报 Authentication error）→ DNS 走 CF 后台或有 DNS:Edit 的凭据。
- ❌ 在输出/commit 里打印 token 明文。❌ push 用了默认凭据（非 signaltowers → 403/找不到仓库）。
