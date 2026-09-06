/**
 * build.js — 极简文章构建脚本
 *
 * 读取 cn/网站文章/*.md → 生成:
 *   site/index.html          (首页)
 *   site/articles/{slug}.html (文章页)
 *
 * Markdown 源文件格式：
 * ---
 * title: 文章标题
 * description: 页面描述（用于 meta description + JSON-LD）
 * date: 2026-08-22
 * slug: geo-shi-shen-me
 * topic: GEO 入门
 * tags: [GEO, SEO]
 * faq:
 *   - 问题1
 *   - 问题2
 * ---
 * 正文使用 Markdown 语法...
 */

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// ── 配置 ──
const SRC_DIR = path.join(__dirname, '..', 'cn', '网站文章');
const OUT_DIR = path.join(__dirname, '..', 'site');
const ARTICLES_DIR = path.join(OUT_DIR, 'articles');
const SITE_URL = 'https://www.jiyou.site';
const AUTHOR_NAME = '纪优';
const AUTHOR_URL = SITE_URL;
const AUTHOR_DESCRIPTION = '豆包 GEO 专家 · 只做一个引擎';

// 实体 sameAs 锚点（跨平台身份验证，只填真实拥有的平台）
const AUTHOR_SAMEAS = [
  'https://www.zhihu.com/people/yeah-98-35',   // 知乎（实体锚点）
  'https://github.com/jaykaai',                  // GitHub（代码实体锚点）
];

// 稳定知识领域（knowsAbout，不随文章 tag 变动）
const AUTHOR_KNOWS_ABOUT = [
  '豆包生成式引擎优化',
  '豆包',
  '生成式引擎优化',
  '结构化数据',
  '搜索引擎优化',
];

// 实体图 @id（实体消歧用，AI 引擎靠 @id 拼合同一个实体）
const PERSON_ID = `${SITE_URL}/#person`;
const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

// 确保输出目录存在
fs.mkdirSync(ARTICLES_DIR, { recursive: true });

// ── 配置 marked ──
// 自定义 renderer：
// - mermaid 代码块 → <pre class="mermaid"> 交给客户端 mermaid.js 渲染
// - svg 代码块 → 原样内联 SVG（论文风手绘图，零依赖、可打印、百度可抓）
// marked v15+ 的 code 签名是 code({ text, lang, escaped })，不是 (code, infoString)
marked.use({
  renderer: {
    code({ text, lang }) {
      const l = (lang || '').trim().toLowerCase();
      if (l === 'mermaid') {
        // mermaid 源码原样输出，由客户端 mermaid.js 渲染
        // 不转义：<br/> 等 mermaid 语法需要原样保留；源码来自作者自己写的 Markdown，无 XSS 风险
        return `<pre class="mermaid">${text}</pre>`;
      }
      if (l === 'svg') {
        // 原样内联 SVG。源码来自作者自己写的 Markdown，无 XSS 钟点
        // 去掉首尾空白，避免 <p> 包裹或多余空白影响 inline-block 对齐
        return text.trim();
      }
      return false; // 返回 false 走 marked 默认渲染
    },
  },
});

marked.setOptions({
  gfm: true,
  breaks: false,
});

// ── Frontmatter 解析 ──
function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };

  const fm = match[1];
  const content = match[2].trimStart();

  const data = {};
  let currentKey = null;

  const lines = fm.split('\n');
  for (const line of lines) {
    // 数组项
    const arrMatch = line.match(/^\s+-\s+(.+)$/);
    if (arrMatch && currentKey && Array.isArray(data[currentKey])) {
      data[currentKey].push(arrMatch[1]);
      continue;
    }

    // 标量值
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) {
      currentKey = kv[1];
      let val = kv[2].trim();

      // 数组语法 [a, b, c]
      if (val.startsWith('[') && val.endsWith(']')) {
        val = val.slice(1, -1).split(',').map(v => v.trim().replace(/^['"]|['"]$/g, ''));
        data[currentKey] = val;
        continue;
      }

      // 数组开头（多行模式）
      if (val === '') {
        data[currentKey] = [];
        continue;
      }

      // 数字
      if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
        data[currentKey] = val;
      } else if (!isNaN(val) && val !== '') {
        data[currentKey] = Number(val);
      } else {
        data[currentKey] = val.replace(/^['"]|['"]$/g, '');
      }
    }
  }

  return { data, content };
}

// ── 读取所有文章 ──
function readArticles() {
  const files = fs.readdirSync(SRC_DIR).filter(f => f.endsWith('.md'));
  const articles = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(SRC_DIR, file), 'utf-8');
    const { data, content } = parseFrontmatter(raw);

    if (!data.title || !data.slug) {
      console.warn(`⚠️  跳过 ${file}：缺少 title 或 slug`);
      continue;
    }

    articles.push({
      ...data,
      body: content,
      file,
    });
  }

  // 按日期降序排列
  articles.sort((a, b) => {
    if (a.date > b.date) return -1;
    if (a.date < b.date) return 1;
    return 0;
  });

  return articles;
}

// ── 生成 FAQPage JSON-LD ──
function generateFaqJsonLd(questions, htmlBody) {
  if (!questions || !questions.length) return '';

  const items = questions.map(q => {
    const h2Regex = new RegExp(`<h2[^>]*>${escapeRegex(q)}</h2>\\s*<p>([\\s\\S]*?)</p>`);
    const match = htmlBody.match(h2Regex);
    const answer = match ? match[1].replace(/<[^>]+>/g, '') : q;

    return {
      '@type': 'Question',
      name: q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    };
  });

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items,
  }, null, 2);
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ── 解析 annotate 代码块 ──
// 把 ```annotate ... ``` 代码块的内容解析成结构化批注对象
function parseAnnotateBlock(codeContent) {
  // marked 会把代码块内容转义（& < >），先还原
  const raw = codeContent
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  const result = {};
  const lines = raw.split('\n');
  let currentKey = null;

  for (const line of lines) {
    // 多行值（YAML 的 | 块，这里用 key: 后续缩进行表示多行）
    const kvMatch = line.match(/^(\w+):\s*(.*)$/);
    if (kvMatch) {
      currentKey = kvMatch[1];
      let val = kvMatch[2].trim();
      if (val) {
        result[currentKey] = val;
      } else {
        // 空值，后续行是多行内容
        result[currentKey] = [];
      }
    } else if (currentKey && Array.isArray(result[currentKey])) {
      // 多行值，追加
      if (line.trim()) {
        result[currentKey].push(line);
      }
    }
  }

  // 把多行值数组拼回字符串
  for (const key of Object.keys(result)) {
    if (Array.isArray(result[key])) {
      result[key] = result[key].join('\n').trim();
    }
  }

  return result;
}

// ── 生成批注角标 + 气泡 HTML ──
function renderAnnotate(anno, index) {
  const id = `anno-${index}`;
  const hasDiff = anno.before || anno.after;
  const cls = hasDiff ? '' : ' simple';

  let head = '';
  if (anno.lesson) {
    head += `<span class="chip">${escapeHtml(anno.lesson)}</span>`;
  }
  if (anno.rule) {
    head += `<span class="chip">${escapeHtml(anno.rule)}</span>`;
  }

  let diff = '';
  if (hasDiff) {
    diff = '<div class="b-diff">';
    if (anno.before) {
      diff += `<div class="b-row before"><span class="b-mark">✕</span><span class="b-text">${escapeHtml(anno.before)}</span></div>`;
    }
    if (anno.after) {
      diff += `<div class="b-row after"><span class="b-mark">✓</span><span class="b-text">${escapeHtml(anno.after)}</span></div>`;
    }
    diff += '</div>';
  }

  let why = '';
  if (anno.why) {
    why = `<div class="b-why">${escapeHtml(anno.why)}</div>`;
  }

  let simpleText = '';
  if (!hasDiff && anno.why) {
    // 纯说明型批注，why 作为正文显示（不带 💡 前缀，前缀由 CSS 加）
    simpleText = '';
  }

  return {
    marker: `<span class="anno" id="${id}-mark" onclick="toggleAnno('${id}')">${index}</span>`,
    bubble: `<div class="anno-bubble${cls}" id="${id}"><div class="b-head">${head}</div>${diff}${simpleText}${why}</div>`,
  };
}

// ── 处理正文里的 annotate 块 ──
// 在 marked 渲染后的 HTML 里，找到 <pre><code class="language-annotate">...</code></pre>
// 替换成：角标插到前一个 </p> 前，气泡跟在原位置
function processAnnotations(htmlBody) {
  const annoRegex = /<pre><code class="language-annotate">([\s\S]*?)<\/code><\/pre>/g;
  const annotations = [];
  let match;
  let idx = 1;

  // 先收集所有批注
  while ((match = annoRegex.exec(htmlBody)) !== null) {
    const anno = parseAnnotateBlock(match[1]);
    annotations.push({ raw: match[0], parsed: anno, index: idx++ });
  }

  if (annotations.length === 0) return htmlBody;

  let result = htmlBody;
  for (const a of annotations) {
    const rendered = renderAnnotate(a.parsed, a.index);

    // 找到 annotate 块前面最近的 </p>
    const blockPos = result.indexOf(a.raw);
    if (blockPos === -1) continue;

    // 往前找最近的 </p>
    const beforeContent = result.substring(0, blockPos);
    const lastPClose = beforeContent.lastIndexOf('</p>');

    if (lastPClose !== -1) {
      // 把角标插到 </p> 前，气泡替换 annotate 块位置
      const insertPos = lastPClose;
      result =
        result.substring(0, insertPos) +
        rendered.marker +
        '</p>' +
        result.substring(insertPos + 4, blockPos) +
        rendered.bubble +
        result.substring(blockPos + a.raw.length);
    } else {
      // 没有前一个 <p>，气泡替换 annotate 块位置（角标不插）
      result =
        result.substring(0, blockPos) +
        rendered.bubble +
        result.substring(blockPos + a.raw.length);
    }
  }

  return result;
}

// ── 生成文章 HTML ──
function renderArticle(article, topicCount) {
  let htmlBody = marked.parse(article.body);
  htmlBody = processAnnotations(htmlBody);

  const articleJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@id': `${SITE_URL}/articles/${article.slug}.html#article`,
    '@type': 'Article',
    headline: article.title,
    description: article.description || '',
    author: { '@id': PERSON_ID },        // 引用实体图，不重复定义
    publisher: { '@id': ORG_ID },
    datePublished: article.date,
    dateModified: article.date,
    inLanguage: 'zh-CN',
    mainEntityOfPage: `${SITE_URL}/articles/${article.slug}.html`,
  }, null, 2);

  // 实体图：Person + Organization 互相引用，AI 靠 @id + sameAs 消歧
  const personJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@id': PERSON_ID,
    '@type': 'Person',
    name: AUTHOR_NAME,
    url: AUTHOR_URL,
    description: AUTHOR_DESCRIPTION,
    sameAs: AUTHOR_SAMEAS,               // 多平台锚点（知乎 + GitHub）
    knowsAbout: AUTHOR_KNOWS_ABOUT,     // 稳定知识领域
    worksFor: { '@id': ORG_ID },
  }, null, 2);

  const orgJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@id': ORG_ID,
    '@type': 'Organization',
    name: AUTHOR_NAME,
    url: AUTHOR_URL,
    description: AUTHOR_DESCRIPTION,
    sameAs: AUTHOR_SAMEAS,
    founder: { '@id': PERSON_ID },
  }, null, 2);

  const faqJsonLd = generateFaqJsonLd(article.faq, htmlBody);

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(article.title)}</title>
  <meta name="description" content="${escapeHtml(article.description || '')}">
  <meta name="author" content="${AUTHOR_NAME}">
  <link rel="canonical" href="${SITE_URL}/articles/${article.slug}.html">
  <link rel="stylesheet" href="../style.css">
  <script type="application/ld+json">
${articleJsonLd}
  </script>
  <script type="application/ld+json">
${personJsonLd}
  </script>
  <script type="application/ld+json">
${orgJsonLd}
  </script>
  ${faqJsonLd ? `<script type="application/ld+json">\n${faqJsonLd}\n  </script>` : ''}
  <script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
</head>
<body>

<div class="article-wrapper">
  <div class="article-card">

    <div class="article-topbar">
      <div class="dots">
        <span class="dot r"></span>
        <span class="dot y"></span>
        <span class="dot g"></span>
      </div>
      <div class="path">
        <span class="dir">❯ ${escapeHtml(article.topic || '未分类')}</span>
        <span style="color:#c7c7cc;"> / </span>
        <span class="file">${escapeHtml(article.title)}</span>
      </div>
    </div>

    <div class="article-body">
      <h1>${escapeHtml(article.title)}</h1>
      ${htmlBody}
    </div>

    <div class="article-footer">
      <div><span class="mono" style="color:#28c840;">❯</span> 阅读完毕</div>
      <div><a href="../index.html">← 返回首页</a></div>
    </div>

  </div>
</div>

<script>
function toggleAnno(id) {
  var el = document.getElementById(id);
  if (!el) return;
  var mark = document.getElementById(id + '-mark');
  var isShow = el.classList.contains('show');
  document.querySelectorAll('.anno-bubble.show').forEach(function(b) {
    b.classList.remove('show');
    var m = document.getElementById(b.id + '-mark');
    if (m) m.classList.remove('open');
  });
  if (!isShow) {
    el.classList.add('show');
    if (mark) mark.classList.add('open');
  }
}
// 初始化 mermaid（页面含 <pre class="mermaid"> 时才渲染）
// 论文风配色：白底 + 低饱和分类色（蓝=内容、绿=人物、紫=机构），
// 细边、清晰字体，节点类型用颜色区分层次而非全灰
if (typeof mermaid !== 'undefined') {
  mermaid.initialize({
    startOnLoad: true,
    theme: 'base',
    themeVariables: {
      // 通用
      fontFamily: '-apple-system, "SF Pro Text", "Helvetica Neue", "PingFang SC", sans-serif',
      fontSize: '15px',
      lineColor: '#6e6e73',     // 箭头/连线：深灰，克制
      textColor: '#1d1d1f',     // 节点文字：近黑
      // 节点主色按 mermaid 类样式区分（primary/secondary/tertiary 对应不同类型）
      primaryColor: '#e8f0fe',     // 蓝（内容实体：Article/WebSite）
      primaryBorderColor: '#4285f4',
      primaryTextColor: '#174ea6',
      secondaryColor: '#e6f4ea',   // 绿（人物：Person）
      secondaryBorderColor: '#34a853',
      secondaryTextColor: '#0d652d',
      tertiaryColor: '#f3e8fd',     // 紫（机构：Organization）
      tertiaryBorderColor: '#a142f4',
      tertiaryTextColor: '#6a1b9a',
      // 边线粗细
      primaryGroupBorderColor: '#4285f4',
      secondaryGroupBorderColor: '#34a853',
      tertiaryGroupBorderColor: '#a142f4',
      // subgraph 背景透明
      clusterBkg: 'transparent',
      clusterBorder: '#d2d2d7',
      // 标签
      edgeLabelBackground: '#ffffff',
    },
  });
}
</script>

</body>
</html>`;
}

// ── 生成首页 HTML ──
// 豆包 GEO 专家门面首页：Hero + 差异化 + 方法论信任证据 + 文章库 + 轻量联系
function renderHomepage(articles) {
  const grouped = {};
  for (const article of articles) {
    const topic = article.topic || '未分类';
    if (!grouped[topic]) grouped[topic] = [];
    grouped[topic].push(article);
  }

  const articleCount = articles.length;
  const topicCount = Object.keys(grouped).length;

  // 方法论卡片：链接到真实存在的文章
  const methodologyCards = [
    { title: 'GEO 六维审计', desc: '把眼光变成能收钱的服务 — 六个维度系统审计一个站点', slug: 'geo-liu-wei-shen-ji', icon: '⊕' },
    { title: 'GEO 五环链路', desc: '从发现你的站到引用你的话 — 整条流水线拆解', slug: 'geo-wu-huan-lian-lu', icon: '⟳' },
    { title: '自足段落写作规格', desc: 'AI 引擎偏爱的内容结构 — 答案优先、自足可引', slug: 'zi-zu-duan-luo', icon: '¶' },
    { title: '中国 AI 引擎适配', desc: '从国际方法到本土落地 — 认清中国 AI 引擎地形', slug: 'zhong-guo-ai-yin-qing-gua-pei', icon: '⌖' },
  ];

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${AUTHOR_NAME} — 豆包 GEO 专家</title>
  <meta name="description" content="${AUTHOR_DESCRIPTION}。帮商户让豆包推荐他们的产品。">
  <meta name="author" content="${AUTHOR_NAME}">
  <link rel="canonical" href="${SITE_URL}/">
  <link rel="stylesheet" href="style.css">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@id": "${WEBSITE_ID}",
    "@type": "WebSite",
    "name": "${AUTHOR_NAME}",
    "url": "${SITE_URL}/",
    "description": "${AUTHOR_DESCRIPTION}。帮商户让豆包推荐他们的产品。",
    "author": { "@id": "${PERSON_ID}" },
    "publisher": { "@id": "${ORG_ID}" },
    "inLanguage": "zh-CN"
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@id": "${PERSON_ID}",
    "@type": "Person",
    "name": "${AUTHOR_NAME}",
    "url": "${AUTHOR_URL}",
    "description": "${AUTHOR_DESCRIPTION}",
    "sameAs": ${JSON.stringify(AUTHOR_SAMEAS)},
    "knowsAbout": ${JSON.stringify(AUTHOR_KNOWS_ABOUT)},
    "worksFor": { "@id": "${ORG_ID}" }
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@id": "${ORG_ID}",
    "@type": "Organization",
    "name": "${AUTHOR_NAME}",
    "url": "${AUTHOR_URL}",
    "description": "${AUTHOR_DESCRIPTION}",
    "sameAs": ${JSON.stringify(AUTHOR_SAMEAS)},
    "founder": { "@id": "${PERSON_ID}" }
  }
  </script>
  <style>
    /* ===== 首页：豆包 GEO 专家门面 ===== */
    .home {
      max-width: 960px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    /* — Hero 首屏 — */
    .hero {
      padding: 5rem 0 4rem;
      text-align: center;
    }
    .hero .name {
      font-size: 3.5rem;
      font-weight: 800;
      letter-spacing: -0.04em;
      color: #1d1d1f;
      line-height: 1;
    }
    .hero .tagline {
      margin-top: 1rem;
      font-size: 1.25rem;
      font-weight: 600;
      color: #0071e3;
      letter-spacing: -0.01em;
    }
    .hero .tagline .focus {
      background: linear-gradient(135deg, #0071e3, #00b4d8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .hero .value-prop {
      margin-top: 1.5rem;
      font-size: 1.0625rem;
      color: #515154;
      line-height: 1.6;
    }
    .hero .cta-row {
      margin-top: 2.5rem;
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }
    .hero .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.75rem 1.75rem;
      border-radius: 980px;
      font-size: 0.9375rem;
      font-weight: 600;
      text-decoration: none;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .hero .btn-primary {
      background: #0071e3;
      color: #fff;
      box-shadow: 0 4px 14px rgba(0,113,227,0.3);
    }
    .hero .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(0,113,227,0.4);
    }
    .hero .btn-ghost {
      background: transparent;
      color: #0071e3;
      border: 1px solid #d2d2d7;
    }
    .hero .btn-ghost:hover {
      background: rgba(0,113,227,0.04);
      border-color: #0071e3;
    }

    /* — 差异化区 — */
    .diff {
      padding: 3rem 0;
    }
    .diff .section-label {
      font-family: "SF Mono","Menlo",monospace;
      font-size: 0.75rem;
      font-weight: 600;
      color: #86868b;
      letter-spacing: 0.06em;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
    }
    .diff .section-title {
      font-size: 1.75rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: #1d1d1f;
      margin-bottom: 2rem;
    }
    .diff-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.25rem;
    }
    .diff-card {
      background: #fff;
      border: 1px solid #e5e5ea;
      border-radius: 16px;
      padding: 1.75rem;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      position: relative;
      overflow: hidden;
    }
    .diff-card::before {
      content: "";
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
      background: linear-gradient(90deg, #0071e3, #00b4d8);
      opacity: 0;
      transition: opacity 0.2s ease;
    }
    .diff-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.08);
    }
    .diff-card:hover::before { opacity: 1; }
    .diff-card .dc-icon {
      font-size: 1.5rem;
      margin-bottom: 0.75rem;
      display: block;
    }
    .diff-card .dc-title {
      font-size: 1.0625rem;
      font-weight: 700;
      color: #1d1d1f;
      margin-bottom: 0.5rem;
    }
    .diff-card .dc-desc {
      font-size: 0.9375rem;
      color: #515154;
      line-height: 1.6;
    }

    /* — 方法论信任证据 — */
    .method {
      padding: 3rem 0;
    }
    .method .section-label {
      font-family: "SF Mono","Menlo",monospace;
      font-size: 0.75rem;
      font-weight: 600;
      color: #86868b;
      letter-spacing: 0.06em;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
    }
    .method .section-title {
      font-size: 1.75rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: #1d1d1f;
      margin-bottom: 0.5rem;
    }
    .method .section-sub {
      font-size: 0.9375rem;
      color: #86868b;
      margin-bottom: 2rem;
    }
    .method-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }
    .method-card {
      display: block;
      text-decoration: none;
      background: #fff;
      border: 1px solid #e5e5ea;
      border-radius: 14px;
      padding: 1.5rem;
      transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
    }
    .method-card:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.06);
      border-color: #0071e3;
    }
    .method-card .mc-head {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.625rem;
    }
    .method-card .mc-icon {
      width: 36px; height: 36px;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.125rem;
      background: rgba(0,113,227,0.08);
      border-radius: 10px;
    }
    .method-card .mc-title {
      font-size: 1.0625rem;
      font-weight: 700;
      color: #1d1d1f;
    }
    .method-card .mc-desc {
      font-size: 0.9375rem;
      color: #515154;
      line-height: 1.55;
    }
    .method-card .mc-arrow {
      margin-top: 0.75rem;
      font-size: 0.8125rem;
      color: #0071e3;
      font-family: "SF Mono","Menlo",monospace;
    }

    /* 筹备中卡片 */
    .method-card.coming {
      border: 1.5px dashed #d2d2d7;
      background: transparent;
      cursor: default;
    }
    .method-card.coming:hover {
      transform: none;
      box-shadow: none;
      border-color: #d2d2d7;
    }
    .method-card.coming .mc-title { color: #86868b; }
    .method-card.coming .mc-desc { color: #a1a1a6; }
    .method-card.coming .mc-tag {
      display: inline-block;
      margin-top: 0.75rem;
      padding: 0.2rem 0.6rem;
      font-size: 0.75rem;
      font-family: "SF Mono","Menlo",monospace;
      color: #86868b;
      background: #f5f5f7;
      border-radius: 4px;
    }

    /* — 文章库 — */
    .kb {
      padding: 3rem 0 2rem;
      border-top: 1px solid #e5e5ea;
    }
    .kb .section-label {
      font-family: "SF Mono","Menlo",monospace;
      font-size: 0.75rem;
      font-weight: 600;
      color: #86868b;
      letter-spacing: 0.06em;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
    }
    .kb .section-title {
      font-size: 1.5rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: #1d1d1f;
      margin-bottom: 0.25rem;
    }
    .kb .section-sub {
      font-size: 0.9375rem;
      color: #86868b;
      margin-bottom: 1.5rem;
    }
    .kb-topic { margin-bottom: 1.5rem; }
    .kb-topic-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0;
      font-family: "SF Mono","Menlo",monospace;
    }
    .kb-topic-header .arrow { color: #28c840; font-size: 0.875rem; }
    .kb-topic-header .label {
      font-size: 0.8125rem;
      font-weight: 600;
      color: #86868b;
      letter-spacing: 0.02em;
    }
    .kb-item {
      display: flex;
      align-items: baseline;
      gap: 1rem;
      padding: 0.75rem 0;
      border-bottom: 1px solid #e5e5ea;
      text-decoration: none;
      transition: opacity 0.15s;
    }
    .kb-item:last-of-type { border-bottom: none; }
    .kb-item:hover { opacity: 0.6; }
    .kb-item .q { color: #0071e3; font-size: 0.8125rem; flex-shrink: 0; font-family: "SF Mono","Menlo",monospace; }
    .kb-item .title {
      flex: 1;
      font-size: 1rem;
      font-weight: 500;
      color: #1d1d1f;
      line-height: 1.4;
    }
    .kb-item .date {
      font-size: 0.8125rem;
      color: #c7c7cc;
      flex-shrink: 0;
    }

    /* — 联系区 — */
    .contact {
      padding: 3rem 0 4rem;
      border-top: 1px solid #e5e5ea;
      text-align: center;
    }
    .contact .cta-text {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1d1d1f;
      margin-bottom: 0.5rem;
    }
    .contact .cta-sub {
      font-size: 0.9375rem;
      color: #86868b;
      margin-bottom: 1.75rem;
    }
    .contact .contact-links {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }
    .contact .contact-link {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.625rem 1.5rem;
      border-radius: 980px;
      font-size: 0.9375rem;
      font-weight: 500;
      text-decoration: none;
      border: 1px solid #d2d2d7;
      color: #1d1d1f;
      transition: border-color 0.15s, background 0.15s;
    }
    .contact .contact-link:hover {
      border-color: #0071e3;
      background: rgba(0,113,227,0.04);
    }

    /* — 底部 — */
    .home-footer {
      padding: 1.5rem 0 2rem;
      border-top: 1px solid #e5e5ea;
      font-size: 0.8125rem;
      color: #c7c7cc;
      text-align: center;
    }

    /* — 响应式 — */
    @media (max-width: 768px) {
      .home { padding: 0 1.25rem; }
      .hero { padding: 3.5rem 0 2.5rem; }
      .hero .name { font-size: 2.5rem; }
      .hero .tagline { font-size: 1.0625rem; }
      .diff-grid { grid-template-columns: 1fr; }
      .method-grid { grid-template-columns: 1fr; }
      .kb-item { flex-wrap: wrap; gap: 0.25rem; }
      .kb-item .date { width: 100%; padding-left: 1.5rem; }
    }
  </style>
</head>
<body>

<div class="home">

  <!-- Hero 首屏 -->
  <section class="hero">
    <div class="name">${AUTHOR_NAME}</div>
    <div class="tagline">豆包 GEO 专家 · <span class="focus">只做一个引擎</span></div>
    <p class="value-prop">帮商户让豆包推荐他们的产品</p>
    <div class="cta-row">
      <a href="#method" class="btn btn-primary">了解我的方法论 →</a>
      <a href="#contact" class="btn btn-ghost">联系我</a>
    </div>
  </section>

  <!-- 差异化区 -->
  <section class="diff">
    <div class="section-label">为什么是我</div>
    <h2 class="section-title">机构做全网，我只做豆包</h2>
    <div class="diff-grid">
      <div class="diff-card">
        <div class="dc-icon">🎯</div>
        <div class="dc-title">只做一个引擎</div>
        <div class="dc-desc">机构做全网 GEO，力量分散；我专注豆包，把一个引擎的优化做到最深。</div>
      </div>
      <div class="diff-card">
        <div class="dc-icon">👤</div>
        <div class="dc-title">个人专家</div>
        <div class="dc-desc">没有机构的交付成本和层级损耗，你直接找到我，我直接对你的结果负责。</div>
      </div>
      <div class="diff-card">
        <div class="dc-icon">🧭</div>
        <div class="dc-title">实战方法论</div>
        <div class="dc-desc">六维审计、五环链路、写作规格 — 不是空谈，每一套方法都有对应文章拆解。</div>
      </div>
    </div>
  </section>

  <!-- 方法论信任证据 -->
  <section class="method" id="method">
    <div class="section-label">方法论体系</div>
    <h2 class="section-title">我用来干活的方法</h2>
    <div class="section-sub">已沉淀的 GEO 方法论，每篇都有完整拆解 · ${articleCount} 篇实战笔记持续更新</div>
    <div class="method-grid">
      ${methodologyCards.map(c => `
      <a href="articles/${c.slug}.html" class="method-card">
        <div class="mc-head">
          <div class="mc-icon">${c.icon}</div>
          <div class="mc-title">${c.title}</div>
        </div>
        <div class="mc-desc">${c.desc}</div>
        <div class="mc-arrow">→ 阅读完整拆解</div>
      </a>`).join('')}
      <div class="method-card coming">
        <div class="mc-head">
          <div class="mc-icon" style="background:rgba(142,142,147,0.12);">📊</div>
          <div class="mc-title">豆包实测案例</div>
        </div>
        <div class="mc-desc">真实站点在豆包中的引用追踪、对比实验、优化前后数据</div>
        <span class="mc-tag">筹备中 · coming soon</span>
      </div>
    </div>
  </section>

  <!-- 文章库 -->
  <section class="kb">
    <div class="section-label">知识库</div>
    <h2 class="section-title">全部文章</h2>
    <div class="section-sub">${articleCount} 篇 · 按 ${topicCount} 个话题分组</div>
    ${Object.entries(grouped).map(([topic, items]) => `
    <div class="kb-topic">
      <div class="kb-topic-header">
        <span class="arrow">❯</span>
        <span class="label">${escapeHtml(topic)}</span>
      </div>
      ${items.map((a, i) => `
      <a href="articles/${a.slug}.html" class="kb-item">
        <span class="q">${String(i + 1).padStart(2, '0')}</span>
        <span class="title">${escapeHtml(a.title)}</span>
        <span class="date">${a.date}</span>
      </a>`).join('')}
    </div>`).join('')}
  </section>

  <!-- 联系区 -->
  <section class="contact" id="contact">
    <div class="cta-text">想让豆包推荐你的产品？</div>
    <div class="cta-sub">找我聊聊 — 我会先看你的站，告诉你从哪里改起</div>
    <div class="contact-links">
      <a href="https://www.zhihu.com/people/yeah-98-35" class="contact-link" target="_blank" rel="noopener">知乎私信</a>
      <a href="https://github.com/jaykaai" class="contact-link" target="_blank" rel="noopener">GitHub</a>
    </div>
  </section>

  <div class="home-footer">© 2026 ${AUTHOR_NAME} · 豆包 GEO 专家 · 只做一个引擎</div>

</div>

</body>
</html>`;
}

// ── 辅助函数 ──
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ── 生成 sitemap.xml（每次 build 自动刷新，杜绝手工维护过期）──
// lastmod 用文章源文件的修改时间（mtime），真实反映内容新鲜度，
// 供 AI 引擎/搜索引擎判断"这个站最近有没有更新"（Content Freshness）
function renderSitemap(articles) {
  const today = new Date().toISOString().slice(0, 10);

  // 首页：lastmod = 今天（每次构建都更新过）
  const entries = [
    `  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`,
  ];

  for (const article of articles) {
    // 用源文件 mtime 作为 lastmod，比 frontmatter date 更准（反映真实编辑时间）
    let lastmod;
    try {
      const stat = fs.statSync(path.join(SRC_DIR, article.file));
      lastmod = stat.mtime.toISOString().slice(0, 10);
    } catch {
      lastmod = article.date || today;
    }

    entries.push(`  <url>
    <loc>${SITE_URL}/articles/${article.slug}.html</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;
}

// ── 主流程 ──
function main() {
  console.log('🔨 构建开始...');

  const articles = readArticles();

  if (articles.length === 0) {
    console.log('⚠️  cn/网站文章/ 目录下没有 Markdown 文件');
    return;
  }

  console.log(`📄 找到 ${articles.length} 篇文章`);

  // 生成文章页
  for (const article of articles) {
    const html = renderArticle(article);
    const filePath = path.join(ARTICLES_DIR, `${article.slug}.html`);
    fs.writeFileSync(filePath, html, 'utf-8');
    console.log(`  ✅  articles/${article.slug}.html`);
  }

  // 生成首页
  const homepage = renderHomepage(articles);
  fs.writeFileSync(path.join(OUT_DIR, 'index.html'), homepage, 'utf-8');
  console.log('  ✅  index.html');

  // 生成 sitemap.xml（自动刷新，跟进新增文章与 lastmod）
  const sitemap = renderSitemap(articles);
  fs.writeFileSync(path.join(OUT_DIR, 'sitemap.xml'), sitemap, 'utf-8');
  console.log('  ✅  sitemap.xml');

  console.log('🎉 构建完成！');
}

main();