# 信号塔 · SignalTower —— 视觉设计系统（DESIGN.md）

> 主题：**深空信号 / Deep-Space Signal**。一座在深空里帮你锁定「还能稳定发信号的那几座塔」的灯塔 / 信号台。
> 本文件是 `assets/style.css` 与 `favicon.svg` 的设计依据，配色以 `BRAND.md §2` 为唯一真源，本文件对其做工程化落地与语义说明。
> **硬约束**：CSS 变量名 / 类名 / 结构一律不改，只改变量值与色值（生成的 HTML 依赖 `var(--cyan)`、`.grad-text`、`.hero`、`.wall-chip`、`.ai-card`、`.routemap` 等旧名）。

---

## 1. 品牌配色 Token

主题概念：**信号绿（信号强度）→ 电波蓝（无线电波）→ 塔灯琥珀（灯塔光）**，明显区别于原站的青→紫→粉。

### 1.1 品牌三段渐变（核心身份）

| 语义角色 | Token（CSS 变量） | 值 | RGB | 用途 |
|---|---|---|---|---|
| 信号绿 sig | `--cyan` | `#4FE0B0` | 79,224,176 | 主色 / 链接 / eyebrow / 图标；渐变 stop 0 |
| 电波蓝 wave | `--violet` | `#3AA0FF` | 58,160,255 | 渐变 stop .5 / 冷调强调 / 描边光 |
| 塔灯琥珀 beacon | `--amber` | `#FFB84D` | 255,184,77 | **签名强调色**：主 CTA、价格、高亮、best 徽章；渐变 stop 1 |
| 深琥珀 | `--amber-2` | `#FF9E3D` | 255,158,61 | CTA 渐变收尾（`--grad-runway`） |
| 在线脉冲绿 live | `--good` | `#54F0A6` | 84,240,166 | dot-live 脉冲、优点 ✓、on 徽章 |
| 暖珊瑚 ember | `--magenta` | `#FF9366` | 255,147,102 | 次级暖强调：攻略博客引流分区、cons 标记（详见 §1.3） |
| 警示黄 | `--warn` | `#FFC861` | 255,200,97 | 预留警示 |

> 变量名 `--cyan / --violet / --magenta / --amber` **保持原名**（生成页依赖），仅语义重定义为信号塔配色。

### 1.2 复合渐变

| Token | 定义 | 用途 |
|---|---|---|
| `--grad-aurora` | `linear-gradient(100deg,#4FE0B0 0%,#3AA0FF 48%,#FFB84D 100%)` | 品牌签名渐变：`.grad-text`、rank 描边、gate 序号、步骤序号、正文圆点、`.btn-aurora` |
| `--grad-runway` | `linear-gradient(100deg,#FFB84D 0%,#FF9E3D 100%)` | 塔灯琥珀 CTA：`.btn-primary`、`.best`、`.ai-banner-cta` |

### 1.3 表面 / 文字（深空蓝阶）

| Token | 值 | 用途 | 对比说明 |
|---|---|---|---|
| `--bg` | `#070A15` | 页面底色（深空） | 也是 `theme-color`（由 Codex 在 build.py/manifest 落地） |
| `--bg-1` | `#0B1020` | 卡片 / 次背景（`.spec`） | 偏蓝深空 |
| `--bg-2` | `#121A33` | 第三层背景（偏蓝提亮） | — |
| `--panel` / `--panel-2` | `rgba(255,255,255,.038 / .06)` | 玻璃面板 | 叠加在深底上 |
| `--brd` / `--brd-2` | `rgba(255,255,255,.085 / .14)` | 描边 / hover 描边 | — |
| `--ink` | `#EAEEFC` | 正文主色 | 对 `--bg` ≈ 16:1，AAA |
| `--ink-2` | `#AAB2D6` | 次要正文 / 导语 | 对 `--bg` ≈ 9.4:1，AA+ |
| `--ink-3` | `#7C86AB` | 标签 / 面包屑 / 脚注 | 由原 `#6C7599` **上调**至 ≈4.6:1，达 AA（原值不足） |

---

## 2. 语义用色规范

- **主行动（买 / 去注册 / 教程入口）**：一律用塔灯琥珀 `--grad-runway`（`.btn-primary` / `.ai-banner-cta` / `.best`）。琥珀是全站唯一「该点这里」信号，克制使用，不滥铺。
- **品牌 / 装饰高亮**：`.grad-text`、序号、圆点、rank 描边用 `--grad-aurora`（绿→蓝→琥珀），承载品牌身份。
- **链接 / 交互反馈**：hover、TOC、面包屑、内联链接用信号绿 `--cyan`。
- **状态**：在线 / 优点 = `--good`（live 绿）；价格 / 数字 / 重点 = `--amber`；缺点 = `--magenta`（暖珊瑚，与优点绿形成正/负对照）。
- **两个引流分区刻意分色温，避免撞脸**：
  - **AI 解锁教程**（`.nav-ai`/`.ai-shell`/`.ai-banner`）→ 冷调：电波蓝 + 信号绿（保留 ChatGPT 绿 `rgba(16,163,127)` 作品牌点缀）。
  - **攻略博客**（`.nav-blog`/`.hd-rail`/`.hd-handle`/`.hd-dock-panel`）→ 暖调：塔灯余晖 = 琥珀 `--amber` + 暖珊瑚 `--magenta`。
- 每家机场卡片的 `accent`（data JSON 各自 2 色）**保持不变**，为卡片墙提供多彩变化，是加分项，勿统一。

---

## 3. 字体 Typography（沿用，未改）

| 角色 | 字体族 | 说明 |
|---|---|---|
| 标题 display | `Space Grotesk` → `Noto Sans SC` → system-ui | 科技几何感，`h1–h4`、按钮、序号 |
| 正文 body | system-ui / PingFang SC / 微软雅黑 / Noto Sans SC | 中文正文优先系统字体，零外链、离线可渲染 |
| 等宽 mono | `JetBrains Mono` → ui-monospace | 数字、价格、eyebrow、标签、代码框 |

- H1 尺度 `clamp(34px,6vw,62px)`；区块标题 `clamp(28px,4.4vw,44px)`；正文 16px / 行高 1.65。
- eyebrow / 标签：mono、12px、`letter-spacing:.32em`、大写。
- 提案（未落地，见 §7 TODO）：如需更贴信号塔气质，标题可试 `Sora` / `Chillax`，但需自托管字体、评估中文回退，本次先不动。

---

## 4. 组件用色速查

| 组件 | 关键类 | 配色 |
|---|---|---|
| 主按钮 | `.btn-primary` | 琥珀渐变 `--grad-runway` + 深色字 `#241300`；阴影暖琥珀 |
| 品牌按钮 | `.btn-aurora` | 三段渐变 + 深字 `#05122a`；阴影电波蓝 |
| 幽灵按钮 | `.btn-ghost` | 玻璃面板 + `--ink`，hover 提亮描边 |
| 徽章 | `.chip.on/.hot/.cy/.emby` | on=live 绿 / hot=琥珀 / cy=信号绿 / emby=电波蓝 |
| 排行榜卡 | `.rank` | 玻璃卡，hover 显三段渐变描边（mask 描边） |
| 机场墙 | `.wall-chip` | 玻璃胶囊，marquee 横向滚动，hover 上浮 |
| 全球航线图 | `.routemap` `.arc-live` `.node` | 弧线走 `#gline`（build.py 内联渐变），节点信号绿，脉冲 live 绿；发光已降到 4px，克制不糊 |
| AI 卡片 | `.ai-card` | `--c1/--c2`（build.py 传入品牌色）描边光晕 + 深空底 |
| 优点/缺点 | `.pc .pros/.cons` | 绿底绿✓ / 珊瑚底珊瑚! |
| 详情结论 | `.verdict` | 信号绿左边线 + 绿微底 |
| 提示框 | `.callout` | 琥珀左边线 + 琥珀微底 |
| 攻略悬浮件 | `.hd-rail/.hd-handle/.hd-dock-panel` | 塔灯余晖暖渐变（琥珀→珊瑚→蓝） |

**微交互（保持轻量、尊重 `prefers-reduced-motion`）**：卡片 hover `translateY(-4~5px)`；按钮 hover 上浮 2px + 阴影加深；dot-live / node-pulse / arc flow / wall marquee 在 reduce 模式全部停用。

---

## 5. 明暗对比 / 可访问性（WCAG AA）

- 全站深底（`#070A15`）+ 亮字，核心配色均为高明度，均达 AA：
  - 信号绿 `#4FE0B0`、live 绿 `#54F0A6`、琥珀 `#FFB84D`、暖珊瑚 `#FF9366` 作前景字对 `--bg` 均 ≥ 7:1。
  - 电波蓝 `#3AA0FF` 主要用于描边 / 渐变 / 光晕，不单独承载小号正文（作大字 / UI 元素时达 AA）。
- 深色字场景：琥珀按钮上用 `#241300`、三段渐变按钮上用 `#05122a`，对比充足。
- `--ink-3` 由 `#6C7599` 上调到 `#7C86AB`，把标签 / 面包屑 / 脚注拉到 AA（原值约 3.9:1 不达标）。
- 焦点可见：`:focus-visible` 用 2px 信号绿描边 + 3px offset，键盘可达。
- 霓虹克制：环境光晕 `opacity` 由 .55 降到 .5、blur 72px；航线图 drop-shadow 4px；避免糊边与眩光。

---

## 6. Favicon / Logo

`favicon.svg`（64×64 viewBox，圆角 `rx=15`，底色 `#070A15`，用法与原文件一致）：

- **图形**：极简**信号塔 / 灯塔剪影**——底部平台 + 向上收窄的塔身（含骨架层线，信号铁塔感），顶部**塔灯**为琥珀径向光晕 `#beam` + 白色高光核。
- **信号弧**：塔灯上方 3 道向外扩散的弧线（越外越淡 .95→.6→.33），用品牌三段渐变 `#g`（绿→蓝→琥珀）描边，象征稳定发信号。
- **渐变**：`linearGradient #g` = `#4FE0B0 → #3AA0FF → #FFB84D`（对角），塔身呈现完整品牌三色；塔灯单独用琥珀 `#beam` 强调「灯塔光」签名色。
- 无外链、内联 SVG、零依赖，离线可渲染。

---

## 7. 未落地 / 待办 TODO

- [ ] **PNG 图标需重生成**（本机无 SVG 栅格化器，且 `assets/icon-192.png / icon-512.png / apple-touch-icon.png` 由 `make_images.py` 归属 Codex，我未触碰，现仍是旧「圆环+航向箭头」旧色图形）。请**任选其一**：
  1. Codex 把 `make_images.py` 的绘制逻辑改为新「信号塔 + 信号弧 + 塔灯」并用新三色（PIL 支持渐变），`python build.py` 时重生成；**或**
  2. Claude / 有 `rsvg-convert`·`cairosvg`·真 ImageMagick 的环境，直接由 `favicon.svg` 栅格化出 192 / 512 / apple-touch（180×180）三张 PNG。
  - 二者需与 `favicon.svg` 图形保持一致，避免 SVG 是灯塔、PNG 还是箭头。
- [ ] `og.png`（社交分享大图）仍是旧品牌视觉，需同步换为信号塔主题（归属 Codex / build 流程）。
- [ ] `theme-color` / `site.webmanifest` 主题色应为 `#070A15`（归属 Codex，见 BRAND.md §2）。
- [ ] 标题字体升级（`Sora`/`Chillax` 等）为可选提案，需自托管 + 中文回退评估，本次未动。

---

## 8. 给协作方的兼容提示（Claude / Codex 注意）

1. **`--magenta` 语义已重定义为暖珊瑚 `#FF9366`，而非严格并入琥珀 `#FFB84D`**。这是 BRAND.md §2「按 style.css 实际语义就近映射」允许的：目的是保住「AI 冷调 / 攻略博客暖调」两个引流分区的色温区分，避免全站塌成单一琥珀、失去信息分层。§2 精确映射表里 `#FF6AD5 → #FFB84D` 我已用于 `--grad-aurora`、`body::after`、`.band` 等**信号/环境语义**处；仅 `--magenta` 变量（及 `rgba(255,106,213,*)` → `rgba(255,147,102,*)`）走了暖珊瑚。若你希望严格统一，只需把 `--magenta` 一个值改回 `#FFB84D` 即可，无其它连锁。
2. **航线图 / 灯塔渐变 stop 在 build.py 内联**（SVG `#gline`、`#ghub`、`#g`）。我改的是 `style.css`；请确认 Codex 已按 §2 把 build.py 内联的 `#35E0D4/#7E7BFF/#FF6AD5` 同步为 `#4FE0B0/#3AA0FF/#FFB84D`，否则 CSS 与内联 SVG 会一冷一暖对不齐。
3. 我**只改了** `assets/style.css`、`favicon.svg`，**新建** `DESIGN.md`；未碰 `build.py`、`data/*`、`config.js`、`make_images.py`，也未运行 `python build.py`。
4. 所有变量名 / 类名 / `data-*` / 结构未动，`.grad-text`、`.hero`、`.wall-chip`、`.ai-card`、`.routemap`、`.hd-*` 等生成页依赖点均保持成立。
