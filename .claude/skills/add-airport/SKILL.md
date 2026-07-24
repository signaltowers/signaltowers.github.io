---
name: add-airport
description: Use when 要给本站 信号塔 SignalTower（555736.xyz / signaltowers.github.io）从 0 新增收录一家机场（区别于更新已有机场）——用户给出机场名 / 官网 / 推广短链 / 优惠码 / 套餐截图，要求加进首页榜单、详情页、机场大全、README。触发词：加入新机场、新增机场、收录XX机场、把XX机场加进来、上榜、加个机场、开干加机场。
---

# 加入新机场（信号塔 SignalTower）

本站是**机场推荐 / 导购**静态站：单一数据源 `data/airports.json` → `python build.py` 生成**全部**页面（首页榜单/决策卡/对比表/机场墙、各详情页、机场大全、`README.md`、`sitemap.xml`）。

> **新增一家 = 追加一个机场对象（data/airports.json）+ 在 assets/config.js 挂推广短链与优惠码 + 重新 build + push。**
> **禁止手改任何生成出来的 HTML**（下次 build 覆盖）。只动这两个源文件（个别情况改 build.py 模板）。

姊妹技能：只改**已有**机场价格/亮点用 `update-airport`；部署/密钥/域名用 `deploy-signaltower`。

## 两条铁律（最高优先级，缺一不可）

### 铁律 1 · 差异化
产出**绝不能只是价格表**。必须提炼这家**区别于其他家的 1–2 个独家卖点**，写进 `tagline`（开头就放）/ `verdict` / `pros[0]` / `fit[0]`，让用户"看着就想买"。同类机场务必突出**彼此不同**那一点，别都写"稳定、解锁全、性价比高"。用**老司机毒舌**口吻（第一人称、敢说缺点、保留"以官网为准/先月付验证"诚实对冲）。
**找亮点抓手**（挑最突出 1–2 个放 tagline 开头，别用"20XX 年成立"平淡开头）：不限设备/客户端 · 低倍率节点(流量翻倍) · 专属 Emby 影视库(`"emby": true`) · 手动切国内入口 · 专线类型(全 IEPL/IPLC vs 直连 vs 中转) · 带宽阶梯 · 抗封新协议(Hysteria2/AnyTLS/VLESS Reality) · 价格定位 · 计费结构(月付/年付/不限时买断) · 独家解锁平台(MyTVSuper/Bahamut/HBO) · 有趣的品牌/套餐命名。

### 铁律 2 · 双层 SEO
用户 Google 搜这家机场时要能搜到本站 → 经**推广短链**注册变现。每个详情页 SEO 分两层，都要有：
- **通用层**：机场推荐、机场评测、科学上网、翻墙机场、Clash 订阅、Netflix 解锁、ChatGPT + 线路类型 + 协议。
- **品牌特色层**（重点）：`品牌中文名 + 英文名 + 别名/AKA + 拼音` × 长尾词（`XX机场`/`怎么样`/`靠谱吗`/`评测`/`官网`/`优惠码`/`跑路`/`套餐`/`注册`）。
把两层揉进 `keywords`（逗号分隔）与 `meta_desc`。**每家 keywords/meta_desc 必须不同**——复制别家只改名字＝违规。

## 操作步骤

### 0. 全网搜该机场最新资讯（新增必做，别凭空写）
搜：成立年份、线路类型、协议、节点覆盖、解锁能力、**口碑与跑路风险**、是否有同名山寨/多域名、独家卖点。轻量用 WebSearch/WebFetch 官网；量大用 Workflow 多角度并行 + 对抗核实。**套餐以用户给的截图/文字为准**，研究只补背景。查不到就如实写"公开评测少 / 口碑空白，建议先小额验证"，**不要编造**年份/口碑。

### 1. 定 slug 与基础标识
- `slug`：全小写英文/拼音，全站唯一。**config.js 键、`code_key`、详情页目录名三处必须一致。**
- `en`/`aka`/`initial`/`accent`([渐变色1,渐变色2] hex，挑不跟数组相邻机场撞的色，可 grep 邻居 `accent` 参考)。

### 2. 是否上榜 + 排序
- `featured: true` → 进首页榜单/对比表/决策卡(前 4)；`false` → 仅机场大全 + 机场墙。**用户没明确说时默认 `false`，并主动问要不要上榜、放哪家附近。**
- 名次 = `airports` 数组里 featured 出现顺序（第 1 个 featured = 榜 01）。要"放 A 附近"就把新对象**插到 A 对象之后**（用 A 结尾唯一文本做 Edit 锚点）。
- `rank_label`：不与别家重复的短标签。

### 3. 追加机场对象到 data/airports.json
照《字段表》逐一填。价格一律 **人民币 ¥**（官网美元计价则约合换算，并在 `plan_note` 注明）。保持 JSON 合法。

### 4. 挂推广短链 + 优惠码到 assets/config.js（漏了＝不变现，第一优先！）
`aff[slug]` = 推广短链（如 `https://s.rtxk.us/s/xxxx`）；`code[slug]` = 优惠码（无则 `""`）。**键必须 = slug。** 短链由用户注册该机场后提供，**不要编造**。

### 4b. WP 博客原文（自动，通常无需手动）
详情页会自动直链 `guide.rtxk.us/airport/<slug>.html`（build.py `wp_article_url` 按 slug 生成）。**若你博客里也发了这家的评测文，用同一 slug**，直链即通；没发就是 404（无害，可后补）。

### 5. 校验 + 构建（Windows 必须 UTF-8）
```bash
python -c "import json; json.load(open('data/airports.json',encoding='utf-8')); print('JSON OK')"
PYTHONUTF8=1 PYTHONIOENCODING=utf-8 python build.py
```
build 会实时抓 WP 博客 RSS（联网；断网走离线兜底，不影响机场页生成）。

### 5b. 生成 OG 分享图（新 slug 必做，否则分享预览裂）
`make_images.py` 字体路径写死 Linux，Windows 直接跑会崩。Windows 最佳解——monkeypatch 成微软雅黑只画这一家（不改源文件，跑完删脚本）：
```python
import make_images as M
from PIL import ImageFont
M.font = lambda size, bold=False: ImageFont.truetype(r"C:\Windows\Fonts\msyhbd.ttc" if bold else r"C:\Windows\Fonts\msyh.ttc", size)
M.airport_og(next(a for a in M.AIR if a["slug"] == "<slug>"))
```
提交前确认 `assets/og/<slug>.png` 已存在。

### 6. 核对
`grep` 确认新 slug/机场名出现在：`<slug>/index.html`、`airports/index.html`、`index.html`（若 featured）、`README.md`、`sitemap.xml`；详情页「前往官网」`data-aff` 已由 config.js 填成推广短链。`git status` 看实际 diff（新增 featured 会连带改所有详情页页脚互链，正常，全提交）。

### 7. 提交并推送（凭据走 signaltowers）
凭据见全局技能 `github-signaltowers-auth`（`GH_SIGNALTOWERS_TOKEN`）：
```bash
source "$HOME/.claude/secrets/github-tokens.env"
git add -A
git commit -m "feat(airport): 新增 XX 机场（榜单+详情页+双层SEO+推广短链）"
git push "https://x-access-token:${GH_SIGNALTOWERS_TOKEN}@github.com/signaltowers/signaltowers.github.io.git" HEAD:main
```
**push 后 GitHub Actions 自动部署到 CF Pages(555736.xyz) + GitHub Pages 自动更新，无需再手动发布。** 切勿在输出里打印 token 明文。

## 机场对象字段（照现有对象结构逐一填）
| 字段 | 说明 |
| --- | --- |
| `slug` | 唯一英文/拼音；= config.js 键 = `code_key` = 详情页目录名 |
| `name`/`en`/`aka` | 中文名/英文名/别名(无则 `""`) |
| `featured` | `true`=上榜；`false`=仅机场大全 |
| `rank_label` | 榜位短标签(featured；不重复) |
| `initial`/`accent` | 图标字母 / `[渐变色1,渐变色2]`(不跟相邻撞色) |
| `year` | 上线年份(查不到留 `""`) |
| `type`/`type_short` | 线路全称 / 短标签(中转/专线/直连) |
| `protocols[]` | 协议(含 Hysteria2 自动出客户端提示) |
| `unlock[]` | 解锁平台(独家平台更出彩；首页只显前 2) |
| `regions`/`billing` | 覆盖地区一句话 / 计费方式 |
| `price_from`/`price_unit` | 入门价 `¥12` / 单位 `/ 月 100G` |
| `code_key` | = `slug` |
| `scene`/`best_for` | 适合场景 / 人群短词 |
| `tagline` | 一句话钩子，**独家卖点开头** |
| `verdict` | 主打点 + 适合谁 + 注意事项（老司机口吻） |
| `meta_desc`/`keywords` | 双层 SEO |
| `sections[]` | 正文 `{h,p[],list?,note?}` 2–4 段 |
| `plans[]` | `[套餐名,参考价,说明]`，核心档列全 |
| `plan_note` | 计费规则 + 特殊点 + "以官网实时价格为准" |
| `pros[]`/`cons[]` | `pros[0]` 放最独家卖点；`cons` 必含"跑路风险，先小额验证" |
| `fit[]`/`unfit[]` | 适合谁 / 谁要三思 |
| `faq[]` | `{q,a}` 2–3 条，含该机场独有疑问 |
| `emby` | 可选 `true`=有 Emby(进 Emby 专区 + 徽章) |

## Red Flags（命中即停，回去改）
- ❌ 只加 airports.json **忘改 config.js** → 不变现。新增第一优先就是挂短链。
- ❌ 要"上榜"却忘设 `featured:true`，或插错数组位置导致名次错。
- ❌ SEO 复制别家只改名字 → `keywords` 必须含品牌长尾。
- ❌ `slug` 与 config.js 键 / `code_key` 不一致。
- ❌ 手改生成的 HTML；价格没换 ¥；JSON 漏逗号/引号导致 build 崩。
- ❌ 编造年份/口碑。❌ push 后忘了 Actions 会自动部署而去手动瞎折腾 CF。❌ 输出里打印 token。

## 参考范例
差异化文案可打开：`candycloud`/`hongxing`（影视）、`shenlong`（IEPL 永久专线）、`qingfeng`（Emby+0.5X 低倍率）、`tapcloud`（中转+全平台解锁+五折码）、`lvpn`（打假式老司机口吻）。
