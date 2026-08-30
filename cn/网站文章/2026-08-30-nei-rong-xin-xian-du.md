---
title: 内容新鲜度：AI 引擎偏爱 3 个月内的更新
description: AI 引擎引用内容时优先挑新鲜的——3 个月内的更新最容易被引用，3 年以上的统计数字会被当成过时数据丢弃。sitemap 的 lastmod 是 AI 判断"这站最近动没动"的信号，但手工维护必然过期。让构建脚本自动生成 sitemap，新鲜度才不会拖累你的 GEO。
date: 2026-08-30
slug: nei-rong-xin-xian-du
topic: 技术基建
tags: [GEO, 内容新鲜度, sitemap, lastmod, 内容衰减, 生成式引擎优化]
faq:
  - 为什么 AI 引擎偏爱新鲜内容？
  - 多少年以上的数据算衰减？
  - sitemap 的 lastmod 有什么用？
---

前 8 课把站建起来了：内容有了、结构化数据有了、llms.txt 有了、爬虫放行了。但这里有个被绝大多数人忽略的真相——**AI 引擎偏爱新鲜内容**。

这课讲三件事：为什么 AI 偏爱新鲜内容、旧数据怎么衰减、以及你的站现在就有一个真实的衰减问题，并把它修掉。

## 为什么 AI 引擎偏爱新鲜内容

AI 引擎（ChatGPT、秘塔、Kimi）回答用户问题时，**优先引用 3 个月内更新的内容**。原因很实际：AI 的引用要给用户一个"这个答案现在是准的"的信号。

Princeton 的 GEO 研究里，Content Freshness 是一个独立方法——新鲜度不是一个"加分项"，而是**被引用的前提之一**。当 AI 在两个内容质量接近的页面之间选择时，它倾向选更新的那个。两个页面都讲 GEO，一个更新于上周，一个更新于去年，AI 默认选上周那个——因为更新 = 更可能反映当前事实。

这解释了为什么算法更新、行业动态类的页面，AI 引用起来毫无顾虑；而"我的网站要怎么优化"这种常青内容，反而要不断翻新数据才能持续被引用。

## 数据衰减：3 年以上的统计数字要替换

旧数据是 GEO 的隐形杀手。一个"34.2% 的用户"如果来自 2022 年，到了 2026 年这个数字可能已经不对了。AI 引擎检测到统计数字过旧，会直接放弃引用你的段落——即使你的段落本身写得再好。

Princeton 研究里 Stale Data 方法说的就是这件事：**3 年以上的统计数字要替换**。

判断数据是否衰减，问三个问题：

1. **这个数字还准吗？** 行业统计、市场份额、用户行为这类数据变化快，3 年就过期。
2. **来源还活着吗？** 引用的研究报告、论文如果已经过时，AI 可能查证不到。
3. **还有更新的替代吗？** 如果有更新的数据源，优先换新的。

以你的自足段落篇为例：它引用了 `Aggarwal et al., 2024` 的 Princeton 论文。2024 → 2026 是 2 年，还在 3 年窗口内，现在不用改。但到 2027 年这个引用就进入衰减区了。这不是现在要动的事，但你应该**知道**它什么时候会过期，而不是某天突然发现它不被引用了。

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 360" role="img" aria-label="内容新鲜度衰减时间线：3 个月内新鲜，3 年以上衰减" class="entity-diagram">
  <defs>
    <style>
      .tt{font:600 15px -apple-system,"SF Pro Text","PingFang SC","Helvetica Neue",sans-serif;fill:#1d1d1f}
      .sub{font:12.5px -apple-system,"SF Pro Text","PingFang SC","Helvetica Neue",sans-serif;fill:#6e6e73}
      .tag{font:11px -apple-system,"SF Pro Text","PingFang SC","Helvetica Neue",sans-serif;fill:#86868b;letter-spacing:.5px}
      .card{fill:#ffffff;stroke:#d2d2d7;stroke-width:1}
      .divider{stroke:#ececee;stroke-width:1}
      .dotGreen{fill:#34c759}.dotOrange{fill:#ff9500}.dotRed{fill:#ff3b30}
    </style>
  </defs>

  <text x="450" y="40" text-anchor="middle" class="tag">内容新鲜度时间线</text>

  <!-- 时间线 -->
  <line x1="90" y1="150" x2="810" y2="150" stroke="#a1a1a6" stroke-width="1.1"/>

  <!-- 3 个月内：新鲜 -->
  <circle cx="150" cy="150" r="5" class="dotGreen"/>
  <text x="150" y="125" text-anchor="middle" class="tt">3 个月内</text>
  <text x="150" y="190" text-anchor="middle" class="sub">被引用优先区</text>
  <text x="150" y="210" text-anchor="middle" class="tag">AI 首选 · 更新信号</text>

  <!-- 3-12 个月：普通 -->
  <circle cx="450" cy="150" r="5" class="dotOrange"/>
  <text x="450" y="125" text-anchor="middle" class="tt">3 个月 - 1 年</text>
  <text x="450" y="190" text-anchor="middle" class="sub">仍可引用 · 竞争力下降</text>

  <!-- 3 年以上：衰减 -->
  <circle cx="750" cy="150" r="5" class="dotRed"/>
  <text x="750" y="125" text-anchor="middle" class="tt">3 年以上</text>
  <text x="750" y="190" text-anchor="middle" class="sub">数据衰减 · 可能被丢弃</text>
  <text x="750" y="210" text-anchor="middle" class="tag">需替换数据 / 更新</text>

  <!-- 图注 -->
  <text x="450" y="290" text-anchor="middle" class="tag">新鲜度 = 被引用前提之一。3 个月内是黄金期，3 年以上进衰减区</text>
</svg>
```

> 上图：内容新鲜度是一条衰减的时间线。3 个月内是被引用优先区；3 个月到 1 年仍可引用但竞争力下降；3 年以上的统计数字进入衰减区，需要替换数据或更新内容。

## 你的站现在就有一个衰减问题：sitemap 过期了

这不是理论，是我检查你的站时发现的实测问题：**site/sitemap.xml 只列了 3 篇文章，但你的站现在有 5 篇。** 新增的 llms-txt.html 和 ai-pa-chong-guan-li.html 没进 sitemap。

原因：build.js 只生成文章页和首页，**sitemap.xml 是手工维护的静态文件**。你新增了两篇文章，但忘了同步更新 sitemap。

这个问题有三层伤害：

**第一，新文章是"孤儿页面"。** AI 爬虫和搜索引擎通过 sitemap 发现新内容。llms.txt 和 ai-pa-chong-guan-li.html 现在只有首页链接，没有 sitemap 声明。如果首页不被抓，这两篇新文章就很难被发现。

**第二，lastmod 过期。** 旧 sitemap 里首页的 lastmod 是 2026-08-22，但首页实际 8 月 30 日刚更新过。AI 看 lastmod 是 8 月 22 日，可能误判这个站好几天没更新，降低引用优先级。

**第三，手工维护必然过期。** 只要靠手改 sitemap，每加一篇文章就会漏一次。这是流程问题，不是这次改完就完——你不可能每次都记得。

## 动手：让构建脚本自动生成 sitemap

最彻底的修法是让 build.js 每次构建时自动生成 sitemap.xml——文章列表是现成的，日期也有，为什么不自动？

我给 build.js 加了一个 `renderSitemap(articles)` 函数，在构建末尾调用。核心逻辑两点：

**列出全部文章。** 遍历 `cn/网站文章/*.md`，每篇生成一个 `<url>` 条目，配正确的 `<loc>`。这样新增文章进目录，sitemap 自动跟进。

**lastmod 用源文件修改时间。** 不是用 frontmatter 里的 date（那只是发布日期），而是用 `fs.statSync` 读源文件的 mtime——这真实反映"这篇内容最后一次编辑是什么时候"。这是 Content Freshness 的关键：AI 通过 lastmod 判断你最近动没动。

每次 `npm run build`，sitemap 自动刷新，永远和文章同步，永远不会有孤儿页面，lastmod 永远准确。你从此不用再手改 sitemap。

```js
// 遍历文章生成 <url> 条目，lastmod 用源文件 mtime
for (const article of articles) {
  const stat = fs.statSync(path.join(SRC_DIR, article.file));
  const lastmod = stat.mtime.toISOString().slice(0, 10);
  entries.push(`  <url>
    <loc>${SITE_URL}/articles/${article.slug}.html</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`);
}
```

改完重新构建，生成的 sitemap.xml 长这样（5 篇文章全部列全，lastmod 各归各位）：

```xml
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.jiyou.site/</loc>
    <lastmod>2026-08-30</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.jiyou.site/articles/ai-pa-chong-guan-li.html</loc>
    <lastmod>2026-08-30</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- ... 其余 4 篇 ... -->
</urlset>
```

## 建立内容更新日历

sitemap 自动化解决了"AI 看到的 lastmod 准确"问题，但没解决"内容本身多久更新一次"的问题。后者要靠更新纪律。

一个简单的更新日历，三条规则：

1. **新文章自带新鲜度。** 每发一篇新文章，你的站就是新鲜的。你现在一周 2-3 篇的节奏，本身就占了便宜。
2. **每月查一次旧文数据。** 每月花 10 分钟，翻一遍 3 个月前的文章，看统计数字还准不准、有没有过时的说法。
3. **更新了就要改 lastmod。** 你更新一篇文章后，build 自动刷新 lastmod——这就是为什么自动化 sitemap 这么重要，它让"你更新了"这件事被 AI 准确看到。

## 三个常见问题

**为什么 AI 引擎偏爱新鲜内容？** 因为 AI 的引用要给用户"这个答案现在是准的"的信号。当两个内容质量接近的页面之间选择时，AI 倾向选更新的那个——更新 = 更可能反映当前事实。这是 Content Freshness 方法的核心。

**多少年以上的数据算衰减？** 3 年以上。Princeton 研究的 Stale Data 方法给出这个阈值：3 年以上的统计数字要替换。判断标准是"这个数字现在还算不算数、来源还活着吗、有没有更新的替代"。

**sitemap 的 lastmod 有什么用？** 它是 AI 和搜索引擎判断"这个站最近动没动"的信号。lastmod 准确，AI 才能准确评估你的新鲜度。所以让构建脚本用源文件的真实修改时间生成 lastmod，而不是手工维护——手工维护必然过期，你的站明明更新了，AI 却以为你好久没动。