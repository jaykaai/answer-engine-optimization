# 可引用内容规格书 v0.1

> **不是理论，是从真实高被引页面的原始 HTML 里量出来的。**
> 数据来源：`ahrefs.com/blog/answer-engine-optimization/`、`semrush.com/blog/answer-engine-optimization/`
> 采集日期：2026-08-21 | 采集方式：`curl` 取原始 HTML（模拟不执行 JS 的 AI 爬虫视角）
> 状态：待用 Perplexity 实际引用数据验证补充 → v0.2

## 一、段落结构规格（chunk 级）

每一个 `<h2>` 开启一个 chunk。AI 引用的单位就是它。

| # | 规则 | 正例 | 反例 |
|---|---|---|---|
| 1 | **H2 写成完整问句**，与用户实际提问的措辞对齐 | `What Is Answer Engine Optimization?` | `AEO 定义` / `关于 AEO` |
| 2 | **紧跟标题的第一句即完整答案**，零铺垫 | 标题下第一句直接给出定义 | "在讨论这个问题之前，我们先回顾行业背景……" |
| 3 | **★ 直答句自带主语全称**（自足段落） | `Answer engine optimization (AEO) is a set of…` / `AEO matters because…` | `它是一套…` / `这主要是因为…` |
| 4 | **先一句结论，后展开细节** | 第二句起才是 `Here's an example of…` | 结论埋在第三段 |

### 规则 3 为什么最关键

chunk 被摘出时**已脱离标题上下文**。写"它是一套营销实践"→ AI 拿到一句无主语的残句 → 无法作为答案 → 不引用。

**自检方法：把任意一段单独复制出来，问自己"不看标题能读懂吗"。读不懂就是不合格。**

## 二、HTML 技术规格

| 项 | 要求 | 实测依据 |
|---|---|---|
| 渲染方式 | **SSR / SSG**，正文必须存在于原始 HTML | AI 爬虫不执行 JavaScript |
| 标题标签 | `<h2>问题文本</h2>` 直接包裹纯文本，**不嵌套装饰性 span/a** | Ahrefs 的 h2 被 CSS-in-JS 包装层淹没，grep 抓不到标题文本 |
| HTML 体积 | 尽量精简 | Ahrefs 850KB vs Semrush 218KB（同类文章 4 倍差距） |
| 标题层级 | 严格 h1 → h2 → h3，不跳级 | 层级即 chunk 边界 |

## 三、Schema 目标清单（第 ⑤ 步施工）

对标实测结果：

| Schema 类型 | Ahrefs | Semrush | 我们的目标 |
|---|---|---|---|
| `Article` | ✅ | ✅ | ✅ 必做 |
| `Organization` | ✅ | ✅ | ✅ 必做（实体建设基础） |
| `Person`（author 嵌套） | ✅ | ✅ | ✅ 必做（EEAT 信号） |
| `WebPage` / `WebSite` | ✅ | ✅ | ✅ 必做 |
| `BreadcrumbList` | ❌ | ✅ | ✅ 必做 |
| `ImageObject` | ✅ | ✅ | ✅ 必做 |
| `FAQPage` | ❌ | ❌ | ✅ **超越对标** —— 两家都没做 |
| `sameAs`（实体关联） | 待查 | 待查 | ✅ 必做 |

## 四、robots.txt 策略（第 ⑥ 步施工）

实测四家 SEO 头部站点：

| 站点 | AI 爬虫规则 | 策略 |
|---|---|---|
| ahrefs.com | 0 条 | 全部放行 |
| semrush.com | 0 条 | 全部放行 |
| backlinko.com | 0 条 | 全部放行 |
| moz.com | 1 条 | `GPTBot` 禁止访问 `/blog/`、`/learn/seo/` |

**Moz 的做法值得学**：只拦训练爬虫，放行搜索爬虫。

```
GPTBot（训练）       → 内容进模型权重，无偿、永久、不可追溯
OAI-SearchBot（搜索）→ 实时检索，会带回引用链接和流量
PerplexityBot（搜索）→ 同上
ClaudeBot（搜索）    → 同上
```

我们站点的默认策略：**搜索类爬虫全放行**（那是引用，是目的本身）；`GPTBot` 放行（实验站需要最大曝光，无版权顾虑）。

## 五、验证命令备忘

```bash
# 看 AI 爬虫眼中的页面（不执行 JS）
curl -sL -A "Mozilla/5.0" URL | grep -o "正文里的一句话"

# 抓 H2 结构与其后的直答段
curl -sL URL | grep -oE '<h2[^>]*>.{0,700}' | sed -E 's/<[^>]*>/ /g'

# 抓页面所有 Schema 类型
curl -sL URL | grep -oE '"@type"[[:space:]]*:[[:space:]]*"[A-Za-z]+"' | sort -u

# 查 AI 爬虫放行策略
curl -sL https://站点/robots.txt | grep -iE "GPTBot|PerplexityBot|ClaudeBot|OAI-SearchBot" -A3
```
