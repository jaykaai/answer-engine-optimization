---
title: GEO 六维审计：把眼光变成能收钱的服务
description: 看懂一个站 GEO 强弱的是眼光，输出让客户愿意付费报告的才是专家。六维审计清单把前面的原理和方法组织成一套能对任何客户站打分的体系：内容、结构化、实体、爬虫、新鲜度、可发现。每个维度都有客观判据，输出是雷达图加问题清单加改进计划。这，就是你能收钱的交付物。
date: 2026-08-30
slug: geo-liu-wei-shen-ji
topic: GEO 实战
tags: [GEO, 审计, 服务, 生成式引擎优化, 咨询]
faq:
  - GEO 审计是哪六个维度？
  - 怎么给客户站打分？
  - GEO 审计报告长什么样？
---

模块一学了原理（五环链路、三层机制），模块二练了眼光（拆被引用站、反拆自己）。模块三把它们变成**可交付的服务**——这是你从"会看"到"能接单赚钱"的桥梁。

模块三不教新原理，它把前面学的**结构化、产品化**。核心转变：

> 模块二你会"看一个站 GEO 强不强"（眼光）
> 模块三要学会"**给一个站输出可执行的服务报告**"（产品）

这是"咨询"和"专家"的分水岭——**能看懂的人很多，能给出让客户愿意付费的交付物的人很少。**

## GEO 审计是哪六个维度？

模块二拆出了"被引用站的 5 共性"，现在把它发展成**一套审计客户站的评分体系**。组织成六维：

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 300" role="img" aria-label="GEO 六维审计清单" class="entity-diagram">
  <defs>
    <style>
      .tt{font:600 15px -apple-system,"SF Pro Text","PingFang SC","Helvetica Neue",sans-serif;fill:#1d1d1f}
      .sub{font:12.5px -apple-system,"SF Pro Text","PingFang SC","Helvetica Neue",sans-serif;fill:#6e6e73}
      .tag{font:11px -apple-system,"SF Pro Text","PingFang SC","Helvetica Neue",sans-serif;fill:#86868b;letter-spacing:.5px}
      .card{fill:#ffffff;stroke:#d2d2d7;stroke-width:1}
      .divider{stroke:#ececee;stroke-width:1}
      .dotBlue{fill:#0071e3}.dotGreen{fill:#34c759}.dotPurple{fill:#af52de}.dotOrange{fill:#ff9500}.dotTeal{fill:#5ac8fa}.dotRed{fill:#ff3b30}
    </style>
  </defs>

  <text x="450" y="32" text-anchor="middle" class="tag">GEO 六维审计清单 · 客户站体检</text>

  <!-- 六维卡片，两行三列 -->
  <text x="200" y="66" text-anchor="middle" class="tt" style="font-size:13px">维度① 内容</text>
  <rect x="60" y="80" width="280" height="52" rx="14" class="card"/>
  <text x="200" y="111" text-anchor="middle" class="sub">自足段落 / 答案优先 / 数字可验证 / 原创</text>
  <circle cx="78" cy="98" r="3.5" class="dotBlue"/>

  <text x="570" y="66" text-anchor="middle" class="tt" style="font-size:13px">维度② 结构化</text>
  <rect x="430" y="80" width="280" height="52" rx="14" class="card"/>
  <text x="570" y="111" text-anchor="middle" class="sub">JSON-LD 实体图 / FAQ schema 完整性</text>
  <circle cx="448" cy="98" r="3.5" class="dotGreen"/>

  <text x="770" y="66" text-anchor="middle" class="tt" style="font-size:13px">维度③ 实体</text>
  <rect x="700" y="80" width="170" height="52" rx="14" class="card"/>
  <text x="785" y="111" text-anchor="middle" class="sub">人物/机构识别锚点与消歧</text>
  <circle cx="718" cy="98" r="3.5" class="dotPurple"/>

  <text x="200" y="165" text-anchor="middle" class="tt" style="font-size:13px">维度④ 爬虫</text>
  <rect x="60" y="179" width="280" height="52" rx="14" class="card"/>
  <text x="200" y="210" text-anchor="middle" class="sub">robots.txt 是否放行 AI 爬虫</text>
  <circle cx="78" cy="197" r="3.5" class="dotOrange"/>

  <text x="570" y="165" text-anchor="middle" class="tt" style="font-size:13px">维度⑤ 新鲜度</text>
  <rect x="430" y="179" width="280" height="52" rx="14" class="card"/>
  <text x="570" y="210" text-anchor="middle" class="sub">更新频率 / 数据是否衰减</text>
  <circle cx="448" cy="197" r="3.5" class="dotTeal"/>

  <text x="770" y="165" text-anchor="middle" class="tt" style="font-size:13px">维度⑥ 可发现</text>
  <rect x="700" y="179" width="170" height="52" rx="14" class="card"/>
  <text x="785" y="210" text-anchor="middle" class="sub">sitemap / 外链 / 关键词口径</text>
  <circle cx="718" cy="197" r="3.5" class="dotRed"/>

  <text x="450" y="275" text-anchor="middle" class="tag">六维对应的正是模块一的五环链路 —— 一张链路地图告诉客户问题出在第几环</text>
</svg>
```

这是六维审计清单的全貌。它完全对应模块一的五环链路（发现→准入→读取→索引→引用），每一维都指向链路的一环，逻辑闭环：

| 审计维度 | 对应的链路环节 | 回答的问题 |
|---------|--------------|-----------|
| ⑥ 可发现 | 环节①发现 | AI 知不知道你有这页 |
| ④ 爬虫 | 环节②准入 | AI 能不能进 |
| ②③ 结构化+实体 | 环节③读取 | AI 看不看得懂你 |
| ① 内容 | 环节⑤引用 | AI 选不选你的段落 |
| ⑤ 新鲜度 | 贯穿全链路 | AI 优不优先考虑你 |

这就是模块一的价值落地——你不只是在"打分"，而是有一张链路地图能告诉客户"你的问题出在第几环"。

## 怎么给客户站打分？

给每个维度设计客观判据——不能凭感觉，要可检查、可给客户看。这是审计服务的专业度所在。

### 维度① 内容（最重，占高分）

检查你的自足段落方法是否达标：
- 每个 H2 下首句是不是直接答案？
- 段落有没有数字、来源？
- 段落被摘走能否独立读懂？
- 内容是否原创、不是搬运？

**打分判据：** 数"达标段落 ÷ 总段落"的比例。>80% = 5 分，60-80% = 4 分，40-60% = 3 分，依此类推。

### 维度④ 爬虫（最容易查出问题）

检查客户的 robots.txt：

- 有没有 Disallow AI 爬虫（GPTBot、ClaudeBot、PerplexityBot）？
- 有没有明确 Allow？还是默认全放行？
- 是否误屏蔽了重要路径？

**判据：** 这是**非黑即白**的维度。如果客户屏蔽了 GPTBot、ClaudeBot、PerplexityBot，直接判"严重问题"——因为这意味着 AI 引擎根本进不去，**前面的内容写得再好都白搭**。这往往是客户最容易犯、也最能体现你价值的点。

### 维度⑤ 新鲜度（数据衰减检测）

- 统计数字年份？有没有超 3 年的？
- 最近一次更新是什么时候？
- 有没有失效的死链、过期引用？

**判据：** 超 3 年的关键统计数字每发现一个，扣分。这是可检测的衰减，客户能看懂你的价值。

## GEO 审计报告长什么样？

一次完整的 GEO 审计，交付给客户的东西是这样结构化的：

```
GEO 审计报告 —— 客户名

六维雷达图（一眼看强弱）
内容 ████░  结构化 ███░░  实体 ██░░░
爬虫 █████  新鲜度 ████░  可发现 ██░░░

总分：xx / 30   优先级：高 / 中 / 低

问题清单（按严重度排序）
🔴 严重：robots 屏蔽了 ClaudeBot → AI 进不来
🟠 中：首页缺少实体锚点 → AI 认不出你是谁
🟡 低：段落对象不够密 → 排序加分少

改进计划（每项：做什么 / 为什么 / 预估影响 / 优先级）
```

## 六维审计清单的核心结论

六维审计清单是你的服务产品骨架。它不教你新东西，而是把模块一（五环链路）和模块二（被引用站 5 共性）组织成一套**能对任何客户站打分的体系**：

- 六维 = 五环链路 + 内容加权
- 每维有客观判据（能检查、能给客户看）
- 输出 = 雷达图 + 问题清单 + 改进计划

**这就是你能收钱的交付物。**

