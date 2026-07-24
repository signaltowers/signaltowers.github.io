---
name: update-airport
description: 更新本站 信号塔 SignalTower（555736.xyz / signaltowers.github.io）某个已有机场的价格套餐表与差异化亮点。触发词：更新XX机场/XX云的套餐、价格套餐表、亮点、卖点、主打点、适合人群；用户发来某机场官网购买页截图要求更新。每次做这类更新都走本技能。
---

# 更新机场套餐与亮点（信号塔 SignalTower）

数据驱动静态站，单一数据源 `data/airports.json` → `build.py` 生成全部页面。更新「价格套餐 + 亮点」时**只改数据源再重新构建**，禁止手改生成的 HTML。加**新**机场用 `add-airport`；部署/密钥用 `deploy-signaltower`。

## 铁律：每家必差异化（最高优先级）
产出**绝不能只是价格表**。每次更新都要提炼这家**区别于其他家的独家卖点**，放进 `tagline`（开头）/ `verdict`，用**老司机毒舌**口吻（第一人称、敢说缺点、保留"以官网为准/先月付验证"诚实对冲）。同类机场务必突出**彼此不同**那点，别都写"稳定、解锁全、性价比高"。
**亮点抓手**：不限设备 · 低倍率节点(流量翻倍) · 专属 Emby(`"emby":true`) · 手动切国内入口 · 专线类型 · 带宽/设备阶梯 · 抗封新协议(Hysteria2/AnyTLS/Reality) · 价格定位 · 计费结构(月付/年付/不限时买断) · 有趣命名。

## 操作步骤

### 1. 定位 slug
```bash
grep -n '"name": "机场中文名"' data/airports.json   # 或直接搜 slug
```

### 2. 读官网截图，提取套餐
逐档记：套餐名、价格、计费类型、每月/一次性流量、倍率、限速/带宽、设备数、有效期、年付立减。

### 3. 编辑 data/airports.json（只改这个对象）
- **价格/套餐**：`plans` 每项 `[套餐名,参考价,说明]`（说明写清"计费类型·流量·关键参数"）；`price_from`+`price_unit`(单位统一 `/ 月 XXG`)；`billing`；`plan_note`(计费规则+特殊点+"以官网实时价格为准")。
- **价格一律 ¥**：官网美元计价则约合换算，`plan_note` 注明"官网以美元计价，此处按约合人民币展示"。
- **亮点**：`tagline`(最强卖点开头)、`verdict`、`scene`/`best_for`、`pros`/`fit`(第一条放最独家)；需要时同步 `sections`/`unlock`/`protocols`/`keywords`/`meta_desc`。
- 保持 JSON 合法。

### 4. 校验 + 构建（Windows 必须 UTF-8）
```bash
python -c "import json; json.load(open('data/airports.json',encoding='utf-8')); print('JSON OK')"
PYTHONUTF8=1 PYTHONIOENCODING=utf-8 python build.py
```
重生成 `<slug>/index.html`、`airports/index.html`、首页注入块、`README.md`、`sitemap.xml`。
> 非 `featured` 机场不在首页榜单/对比表（首页仅机场墙显示名称无价格），改价后 `index.html` 通常不变，属正常；内页与机场大全会更新。

### 5. 核对
`grep` 内页与 `airports/index.html` 确认新价/新套餐名已渲染。

### 6. 提交并推送（凭据走 signaltowers，push 后自动部署）
凭据见全局技能 `github-signaltowers-auth`：
```bash
source "$HOME/.claude/secrets/github-tokens.env"
git add -A
git commit -m "feat(seo): 更新 XX 机场价格套餐并强化亮点文案"
git push "https://x-access-token:${GH_SIGNALTOWERS_TOKEN}@github.com/signaltowers/signaltowers.github.io.git" HEAD:main
```
**push 后 GitHub Actions 自动部署到 CF Pages(555736.xyz) + GitHub Pages 自动更新。** 切勿打印 token 明文。

## 参考范例
`westdata`(优惠码 WD-DDR6)、`qingfeng`(Emby+0.5X 低倍率)、`hongxing`(大流量+不限时买断)、`lvpn`(打假式老司机口吻)。可打开这些对象作文案范例。
