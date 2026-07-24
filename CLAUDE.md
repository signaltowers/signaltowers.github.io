# 信号塔 · SignalTower · 项目级指令（Claude Code 自动加载）

## 这是什么
数据驱动的**机场推荐 / 导购**静态站。单一数据源 `data/airports.json` + 推广位 `assets/config.js` → `python build.py` 生成**全部**页面（首页榜单 / 决策卡 / 对比表 / 机场墙、38+ 家详情页、机场大全 `airports/`、`README.md`、`sitemap.xml`、`404.html`），并注入 AI 引流位与「信号塔攻略」侧栏。

## 四条铁律（最高优先级）
1. **只改源文件**：`data/airports.json`（内容）、`assets/config.js`（推广短链+优惠码）、`build.py`（模板/链接/配色）。**禁止手改任何生成出来的 HTML**（下次 build 覆盖）。
2. **改完必 build**：`PYTHONUTF8=1 python build.py`（Windows 不带 UTF-8，print 中文会 GBK 崩）。build 会实时抓取 WP 博客 RSS 渲染侧栏（断网自动走离线兜底）。
3. **CI 不构建**：`.github/workflows/deploy-cloudflare.yml` 只 `git archive HEAD` 打包**已提交文件** → 发 Cloudflare Pages，**不跑 build.py / make_images.py**。所以 build 产物（全部 HTML/README/sitemap + `assets/og/<slug>.png` OG 图）**必须一并 commit**，否则线上不更新。
4. **每家机场必差异化**：产出绝不能只是价格表，必提炼独家卖点写进 tagline/verdict（详见 `add-airport` / `update-airport` 技能）。

## 品牌与配色
- 品牌：**信号塔 SignalTower**（灯塔/信号引导人设，老司机毒舌口吻）
- 配色：信号绿 `#4FE0B0` → 电波蓝 `#3AA0FF` → 塔灯琥珀 `#FFB84D`（签名强调色）；深空底 `#070A15`。完整见 `DESIGN.md`。

## 站点与引流链接
- 主域名：**https://555736.xyz**（Cloudflare Pages）｜镜像：**https://signaltowers.github.io**（GitHub Pages）
- 引流常量（在 `build.py` 顶部）：AI订阅商城 `shop.rtxk.us`（导航「AI订阅」）｜AI解锁教程 `guide.rtxk.us/category/tutorial/ai-coding`（`AI_GUIDE`）｜攻略博客 `guide.rtxk.us/category/tutorial/antigravity`（`BLOG`）
- **WP 博客联动**（build.py `WP_SECTIONS` / `wp_article_url`）：构建时直读 `guide.rtxk.us` 的 `airport` / `tutorial/ai-coding` / `tutorial/antigravity` 分类 RSS 渲染右侧「信号塔攻略」三组真实文章；每个机场详情页自动直链博客原文 `guide.rtxk.us/airport/<slug>.html`（slug 与本站一致）。抓取失败走 `WP_FALLBACK` 离线兜底。
- 推广位：`assets/config.js` 的 `aff[slug]`（推广短链）+ `code[slug]`（优惠码），**键 = slug**；留空则页面自动隐藏。

## 发布 = git push（全自动，已配好）
push 到 `main` → GitHub Actions 自动部署到 **CF Pages（555736.xyz）**，GitHub Pages 也自动更新。凭据见全局技能 `github-signaltowers-auth`（`GH_SIGNALTOWERS_TOKEN`）。CF/Actions 配置与建新镜像详见 `deploy-signaltower` 技能。

## 任务 → 技能
| 需求 | 技能 |
| --- | --- |
| 新增一家机场（含变现+SEO） | `add-airport` |
| 更新已有机场价格/套餐/亮点 | `update-airport` |
| 部署 / 建新镜像站 / CF·Actions·域名·密钥配置 | `deploy-signaltower` |

## 仓库矩阵
- 站点源码：`signaltowers/signaltowers.github.io`
- 引流索引（讲解/评价，可被搜索）：`signaltowers/airport-recommendations-2026`
- 个人主页 README：`signaltowers/signaltowers`
