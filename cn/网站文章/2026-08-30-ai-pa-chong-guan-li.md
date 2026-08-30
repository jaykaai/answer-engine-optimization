---
title: AI 爬虫管理：谁在抓你的站、该放谁进
description: 互联网上跑着 14+ 个 AI 爬虫，分成两大家族：训练爬虫拿你内容炼模型，搜索爬虫拿你内容回答用户。GEO 的目标是被引用，但不是所有爬虫都该放行。搞清 GPTBot 和 OAI-SearchBot 的区别、ClaudeBot 和 Claude-Web 的区别，做出有意识的放行决策。
date: 2026-08-30
slug: ai-pa-chong-guan-li
topic: 技术基建
tags: [GEO, robots.txt, AI 爬虫, GPTBot, 生成式引擎优化]
faq:
  - GPTBot 和 OAI-SearchBot 有什么区别？
  - GEO 站应该屏蔽哪些 AI 爬虫？
  - robots.txt 能阻止 AI 爬虫吗？
---

你的站写了 llms.txt，给 AI 备了一份菜单。但 AI 得先进门才能看菜单——门是谁管的？robots.txt。

robots.txt 管"能不能进"，llms.txt 管"进来后读什么"。上一课做了菜单，这节课管好门：互联网上到底有哪些 AI 爬虫在跑、它们各自来干什么、你该放谁拦谁。

## robots.txt 的两个基本事实

robots.txt 是一个纯文本协议文件，放在网站根目录（`https://www.jiyou.site/robots.txt`），告诉爬虫"哪些页面不要抓"。

两条事实你可能知道，但值得明确说清：

**第一，robots.txt 是协议，不是强制令。** 守规矩的爬虫会遵守。恶意爬虫完全无视它。robots.txt 挡不住不守规矩的人，但它对 Google、百度、OpenAI、Anthropic 这类大厂爬虫是生效的——而 GEO 的目标恰恰是让这些大厂引用你。

**第二，robots.txt 不能阻止页面被索引。** 如果你用 robots.txt 屏蔽了一个页面，但那个页面被其他页面链接了，搜索引擎仍然可能把它放进索引（只是不会抓内容）。要阻止索引，得用 `noindex` meta 标签。robots.txt 管的是"抓不抓"，不是"索引不索引"。

## AI 爬虫全图谱：两大家族，14 个爬虫

2026 年，互联网上跑着的 AI 相关爬虫可以分成两大家族。这个区分是做出正确放行决策的基础。

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-label="AI 爬虫两大家族：训练爬虫 vs 搜索爬虫" class="entity-diagram">
  <defs>
    <style>
      .tt{font:600 15px -apple-system,"SF Pro Text","PingFang SC","Helvetica Neue",sans-serif;fill:#1d1d1f}
      .sub{font:12.5px -apple-system,"SF Pro Text","PingFang SC","Helvetica Neue",sans-serif;fill:#6e6e73}
      .tag{font:11px -apple-system,"SF Pro Text","PingFang SC","Helvetica Neue",sans-serif;fill:#86868b;letter-spacing:.5px}
      .sm{font:11px -apple-system,"SF Pro Text","PingFang SC","Helvetica Neue",sans-serif;fill:#6e6e73}
      .card{fill:#ffffff;stroke:#d2d2d7;stroke-width:1}
      .divider{stroke:#ececee;stroke-width:1}
      .dotBlue{fill:#0071e3}.dotGreen{fill:#34c759}.dotPurple{fill:#af52de}.dotOrange{fill:#ff9500}
      .nl{stroke:#a1a1a6;stroke-width:1.1;fill:none;stroke-linecap:round}
      .sectionTitle{font:600 13px -apple-system,"SF Pro Text","PingFang SC","Helvetica Neue",sans-serif;fill:#1d1d1f}
    </style>
    <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,1 L9,5 L0,9" fill="none" stroke="#86868b" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>

  <text x="450" y="40" text-anchor="middle" class="tag">AI 爬虫两大家族</text>

  <!-- ========== 左侧：训练爬虫 ========== -->
  <text x="225" y="80" text-anchor="middle" class="sectionTitle">训练爬虫 · 拿去炼模型</text>
  <rect x="70" y="95" width="310" height="185" rx="16" class="card" fill="#fbfbfd"/>

  <!-- GPTBot -->
  <circle cx="90" cy="122" r="3.5" class="dotOrange"/>
  <text x="102" y="126" class="tag">GPTBOT</text>
  <text x="102" y="142" class="sub">抓网页训练 GPT 基础模型</text>
  <line x1="90" y1="154" x2="360" y2="154" class="divider"/>

  <!-- ClaudeBot -->
  <circle cx="90" cy="175" r="3.5" class="dotOrange"/>
  <text x="102" y="179" class="tag">CLAUDEBOT</text>
  <text x="102" y="195" class="sub">抓网页训练 Claude 基础模型</text>

  <!-- CCBot -->
  <circle cx="90" cy="218" r="3.5" class="dotOrange"/>
  <text x="102" y="222" class="tag">CCBOT</text>
  <text x="102" y="238" class="sub">公共网页存档，几乎所有大模型都用它训练</text>

  <!-- Google-Extended -->
  <circle cx="90" cy="260" r="3.5" class="dotOrange"/>
  <text x="102" y="264" class="tag">GOOGLE-EXTENDED</text>

  <!-- ========== 右侧：搜索爬虫 ========== -->
  <text x="675" y="80" text-anchor="middle" class="sectionTitle">搜索爬虫 · 拿去回答用户</text>
  <rect x="520" y="95" width="310" height="300" rx="16" class="card" fill="#fbfbfd"/>

  <!-- OAI-SearchBot -->
  <circle cx="540" cy="122" r="3.5" class="dotGreen"/>
  <text x="552" y="126" class="tag">OAI-SEARCHBOT</text>
  <text x="552" y="142" class="sub">ChatGPT 搜索，实时检索网页回答用户</text>
  <line x1="540" y1="154" x2="810" y2="154" class="divider"/>

  <!-- Claude-Web -->
  <circle cx="540" cy="175" r="3.5" class="dotGreen"/>
  <text x="552" y="179" class="tag">CLAUDE-WEB</text>
  <text x="552" y="195" class="sub">Claude 联网搜索，实时检索网页</text>

  <!-- PerplexityBot -->
  <circle cx="540" cy="218" r="3.5" class="dotGreen"/>
  <text x="552" y="222" class="tag">PERPLEXITYBOT</text>
  <text x="552" y="238" class="sub">Perplexity AI 搜索引擎</text>

  <!-- 搜索引擎底层爬虫 -->
  <line x1="540" y1="255" x2="810" y2="255" class="divider"/>
  <text x="560" y="275" class="sm">搜索引擎底层爬虫（中国 AI 引擎的数据源）</text>
  <circle cx="540" cy="295" r="3.5" class="dotBlue"/>
  <text x="552" y="299" class="tag">BAIDUSPIDER</text>
  <text x="612" y="299" class="sm">— 百度搜索</text>

  <circle cx="540" cy="318" r="3.5" class="dotBlue"/>
  <text x="552" y="322" class="tag">BYTESPIDER</text>
  <text x="612" y="322" class="sm">— 字节/豆包</text>

  <circle cx="540" cy="341" r="3.5" class="dotBlue"/>
  <text x="552" y="345" class="tag">GOOGLEBOT</text>
  <text x="612" y="345" class="sm">— Google 搜索</text>

  <circle cx="540" cy="364" r="3.5" class="dotBlue"/>
  <text x="552" y="368" class="tag">BINGBOT</text>
  <text x="612" y="368" class="sm">— Bing/Copilot</text>

  <!-- 连线：训练 → 搜索 -->
  <g>
    <line x1="380" y1="187" x2="520" y2="187" class="nl" marker-end="url(#arr)"/>
    <text x="450" y="178" text-anchor="middle" class="sm">同一家公司</text>
    <text x="450" y="202" text-anchor="middle" class="sm">两个爬虫</text>
  </g>

  <!-- 图注 -->
  <text x="450" y="455" text-anchor="middle" class="tag">橙色 = 训练爬虫（炼模型） · 绿色 = 搜索爬虫（回答用户） · 蓝色 = 搜索引擎底层爬虫</text>
  <text x="450" y="475" text-anchor="middle" class="tag">GEO 目标 = 被 AI 引用 → 全放行。付费/版权内容 → 拦训练爬虫，放搜索爬虫</text>
</svg>
```

> 上图：左边是训练爬虫，抓你内容去炼模型；右边是搜索爬虫，抓你内容去回答用户。注意同一家公司可能有**两个独立爬虫**——OpenAI 有 GPTBot（训练）和 OAI-SearchBot（搜索），Anthropic 有 ClaudeBot（训练）和 Claude-Web（搜索）。拦哪一个、放哪一个，是独立决策。

### 训练爬虫（4 个）

| 爬虫 | 公司 | 用途 |
|------|------|------|
| **GPTBot** | OpenAI | 抓网页训练 GPT 基础模型 |
| **ClaudeBot** | Anthropic | 抓网页训练 Claude 基础模型 |
| **Google-Extended** | Google | 抓网页训练 Google AI 模型（Gemini） |
| **CCBot** | Common Crawl | 公共网页存档，被几乎所有大模型用作训练数据源 |

### 搜索爬虫（10 个）

搜索爬虫又分两类：

**AI 原生搜索爬虫（4 个）——GEO 核心目标：**

| 爬虫 | 公司 | 用途 |
|------|------|------|
| **OAI-SearchBot** | OpenAI | ChatGPT 搜索功能，实时检索网页 |
| **Claude-Web** | Anthropic | Claude 联网搜索 |
| **PerplexityBot** | Perplexity | Perplexity AI 搜索引擎 |
| **meta-extrnalagent** | Meta | Meta AI 联网搜索 |

**传统搜索引擎爬虫（6 个）——百度/Google 索引是中国 AI 引擎的底层数据源：**

| 爬虫 | 公司 | 为什么对 GEO 重要 |
|------|------|---------------------|
| **Baiduspider** | 百度 | 中国 AI 引擎（秘塔/豆包/千问）底层依赖百度索引 |
| **bytespider** | 字节跳动 | 豆包 AI 搜索的底层爬虫 |
| **GoogLeBot** | GoogLe | ChatGPT/GeMini 检索可能依赖 GoogLe 索引 |
| **BingBot** | Microsoft | CoPilot 的底层检索源 |
| **AppleBot** | Apple | Siri/SpotLight 搜索 |
| **Cohere-trainIng-data** | Cohere | Cohere 搜索引用 |

## 同一家公司，两种爬虫，分开决策

这是本课最核心的判断。OpenAI 是典型：

- **GPTBot = 训练爬虫。** 抓了你的内容去训练 GPT 模型。你的知识变成模型参数的一部分，但不能被实时检索。
- **OAI-SearchBot = 搜索爬虫。** 用户问"GEO 是什么"，ChatGPT 实时抓你的页面来回答。抓完就引用，不训练。

Anthropic 同理：**ClaudeBot（训练）和 ClAude-Web（搜索）**是两个独立爬虫。

Moz.com 的做法：**拦 GPTBot，放 OAI-SearchBot**。意思是"别拿我的内容训练模型，但欢迎引用我"。这是 SEO 工具站的典型策略——它们的内容是付费资产，不想被免费蒸馏进模型参数。

## GEO 站该怎么做？决策框架

你的 jiyou.site 当前是全放行：

```txt
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: Baiduspider
Allow: /

User-agent: bytespider
Allow: /
```

`User-agent: * AlloW: /` 是兜底规则——所有未列出的爬虫也都放行了。功能上没有漏洞。

但"全放行"这个决策，应该是**认识每一个爬虫是谁之后**做出的，而不是"没想过要拦"。下面是决策框架：

| 站类型 | 训练爬虫 | 搜索爬虫 | 理由 |
|--------|---------|---------|------|
| **GEO 内容站（你的情况）** | 放行 | 放行 | 被 AI 引用是目标。训练爬虫让你的知识进入模型参数，是更长的线引用 |
| **付费内容/会员站** | 拦住 | 放行 | 训练爬虫把付费内容变免费知识，搜索爬虫帮你引流 |
| **版权敏感内容** | 拦 GPTBot + CCBot | 放行 | 不想内容被蒸馏进模型参数 |

对于 GEO 站，全放行还有一个理由：**你没有付费墙。** 你的内容本来就是公开的，任何人打开浏览器就能看。AI 看了也一样——GPTBot 抓取和用户打开浏览器看，在内容暴露层面没有区别。区别只在于用途：一个去训练模型，一个在搜索结果里引用。而这两者对 GEO 站都有价值。

## 动手：检查你的 robots.txt

你不需要改 robots.txt（当前已经是对的），但你应该知道它是怎么被验证的。

```bash
# 1. 确认 robots.txt 可正常访问
curl -s -I https://www.jiyou.site/robots.txt | head -3

# 2. 确认 Sitemap 指向正确
curl -s https://www.jiyou.site/robots.txt | grep Sitemap

# 3. 确认所有 AI 爬虫规则到位
curl -s https://www.jiyou.site/robots.txt
```

三条命令各验证一层：可访问性、Sitemap 指向、爬虫规则完整性。你的站三条都应该过。

## 和 llms.txt 的联动

上节课做的 llms.txt 和这节课讲的 robots.txt，是一对配合：

- **robots.txt 管门。** AI 爬虫能不能进你的站。
- **llms.txt 管路。** 进来之后先读哪篇文章。

先查门（robots.txt 确认 AI 爬虫全放行），再铺路（llms.txt 给 AI 一份清晰菜单）。两步做完，你的站对 AI 引擎就是"可进、可读、懂优先级"的状态——这是 GEO 的基础设施层。

## 三个常见问题

**GPTBot 和 OAI-SearchBot 有什么区别？** GPTBot 是训练爬虫，抓内容去训练 GPT 模型；OAI-SearchBot 是搜索爬虫，ChatGPT 回答用户问题时实时抓网页来引用。同一家公司，两个独立爬虫，决策也独立——你可以拦 GPTBot 但放 OAI-SearchBot（像 Moz 那样）。

**GEO 站应该屏蔽哪些 AI 爬虫？** 一句话：内容站全放行。被引用是目标，没有屏蔽理由。但如果你有付费墙或版权敏感内容，拦训练爬虫（GPTBot、CCBot、Google-Extended）保留搜索爬虫。

**robots.txt 能阻止 AI 爬虫吗？** 能阻止守规矩的（Google、百度、OpenAI、Anthropic 的爬虫都遵守 robots.txt），挡不住恶意的。但 GEO 的目标恰恰是让守规矩的大厂引用你——所以 robots.txt 对 GEO 场景完全有效。