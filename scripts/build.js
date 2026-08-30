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
const AUTHOR_DESCRIPTION = 'AI 智能体应用与生成式引擎优化（GEO）研究者';

// 实体 sameAs 锚点（跨平台身份验证，只填真实拥有的平台）
const AUTHOR_SAMEAS = [
  'https://www.zhihu.com/people/yeah-98-35',   // 知乎（实体锚点）
  'https://github.com/jaykaai',                  // GitHub（代码实体锚点）
];

// 稳定知识领域（knowsAbout，不随文章 tag 变动）
const AUTHOR_KNOWS_ABOUT = [
  '生成式引擎优化',
  'AI 智能体应用',
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
function renderHomepage(articles) {
  const grouped = {};
  for (const article of articles) {
    const topic = article.topic || '未分类';
    if (!grouped[topic]) grouped[topic] = [];
    grouped[topic].push(article);
  }

  const articleCount = articles.length;
  const topicCount = Object.keys(grouped).length;

  const articlesJson = JSON.stringify(articles.map((a, i) => ({
    index: i + 1,
    title: a.title,
    slug: a.slug,
    topic: a.topic || '未分类',
    date: a.date,
  })));

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${AUTHOR_NAME} — GEO 研究站</title>
  <meta name="description" content="AI 智能体应用与生成式引擎优化（GEO）研究">
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
    "description": "AI 智能体应用与生成式引擎优化（GEO）研究",
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
    .home { display: flex; flex-direction: column; height: 100vh; }
    .home-header { flex-shrink: 0; }
    .agent-panel { flex-shrink: 0; transition: all 0.4s ease; overflow: hidden; max-height: 300px; }
    .agent-panel.hidden { max-height: 0; opacity: 0; margin-bottom: 0; padding-top: 0; padding-bottom: 0; border: none; }
    .chat-section { flex: 1; display: flex; flex-direction: column; min-height: 0; margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px solid #e5e5ea; }
    .chat-section.expanded { margin-top: 0; padding-top: 0; border-top: none; }
    .chat-messages { flex: 1; overflow-y: auto; margin-bottom: 1rem; }
    .chat-messages .msg { padding: 0.75rem 1rem; border-radius: 12px; margin-bottom: 0.75rem; max-width: 85%; line-height: 1.6; font-size: 0.9375rem; }
    .chat-messages .msg-user { background: #0071e3; color: #fff; margin-left: auto; }
    .chat-messages .msg-agent { background: #f0f0f2; color: #1d1d1f; }
    .chat-messages .msg-agent .result-item { display: block; padding: 0.5rem 0; border-bottom: 1px solid #e5e5ea; text-decoration: none; color: #1d1d1f; }
    .chat-messages .msg-agent .result-item:last-child { border-bottom: none; }
    .chat-messages .msg-agent .result-item:hover { opacity: 0.7; }
    .chat-messages .msg-agent .result-item .r-num { display: inline-block; width: 20px; height: 20px; line-height: 20px; text-align: center; background: #0071e3; color: #fff; border-radius: 50%; font-size: 0.75rem; font-weight: 600; margin-right: 0.5rem; font-family: "SF Mono", "Menlo", monospace; }
    .chat-messages .msg-agent .result-item .r-meta { font-size: 0.75rem; color: #86868b; margin-top: 0.125rem; }
    .chat-messages .msg-agent .result-hint { margin-top: 0.5rem; font-size: 0.8125rem; color: #86868b; }
    .chat-input-row { flex-shrink: 0; display: flex; align-items: center; gap: 0.5rem; background: #f5f5f7; border: 1px solid #e5e5ea; border-radius: 14px; padding: 0.5rem 0.75rem 0.5rem 1rem; }
    .chat-input-row:focus-within { border-color: #0071e3; }
    .chat-input-row input { flex: 1; border: none; background: transparent; font-size: 0.9375rem; font-family: inherit; color: #1d1d1f; outline: none; line-height: 1.5; padding: 0.25rem 0; }
    .chat-input-row input::placeholder { color: #c7c7cc; }
    .chat-input-row .send-btn { width: 32px; height: 32px; border-radius: 50%; border: none; background: #0071e3; color: #fff; font-size: 1rem; cursor: pointer; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
    .chat-input-row .send-btn:hover { opacity: 0.8; }
    .home-footer { flex-shrink: 0; }
  </style>
</head>
<body>

<div class="home">

  <div class="home-header">
    <div class="name">${AUTHOR_NAME}</div>
    <div class="sub">GEO Research Agent · 生成式引擎优化</div>
  </div>

  <div class="agent-panel">
    <div class="sys-label">╭─ SYSTEM PROMPT ────────────────────────────────╮</div>
    <div class="sys-line">你是一个 <span class="hl">GEO（生成式引擎优化）</span> 研究 Agent。</div>
    <div class="sys-line">知识库已加载 · <span class="hl">${articleCount} 篇文章</span> · <span class="hl">${topicCount} 个话题</span>。</div>
    <div class="sys-line">在下方输入问题，我会为你匹配相关文章。</div>
    <div class="sys-label">╰──────────────────────────────────────────────────╯</div>
  </div>

  <div class="chat-section">
    <div class="chat-messages" id="chatMessages"></div>
    <div class="chat-input-row">
      <input type="text" id="chatInput" value="列举所有文章列表" autofocus autocomplete="off">
      <button class="send-btn" id="sendBtn">→</button>
    </div>
  </div>

  <div class="home-footer">© 2026 ${AUTHOR_NAME} · GEO Research Agent</div>
</div>

<script>
(function() {
  var articles = ${articlesJson};
  var input = document.getElementById('chatInput');
  var sendBtn = document.getElementById('sendBtn');
  var messages = document.getElementById('chatMessages');
  var agentPanel = document.querySelector('.agent-panel');
  var chatSection = document.querySelector('.chat-section');
  var hasSearched = false;

  function hidePrompt() {
    if (!hasSearched) {
      hasSearched = true;
      agentPanel.classList.add('hidden');
      chatSection.classList.add('expanded');
    }
  }

  function addMessage(html, type) {
    var div = document.createElement('div');
    div.className = 'msg msg-' + type;
    div.innerHTML = html;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function escapeHtml(str) {
    var d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  function searchArticles(query) {
    if (!query.trim()) return;
    var q = query.trim();
    addMessage(escapeHtml(q), 'user');

    var results = [];
    var qLower = q.toLowerCase();
    articles.forEach(function(a) {
      if (a.title.toLowerCase().indexOf(qLower) !== -1 ||
          a.topic.toLowerCase().indexOf(qLower) !== -1) {
        results.push(a);
      }
    });

    var html = '';
    if (results.length === 0) {
      html = '未找到与 "<strong>' + escapeHtml(q) + '</strong>" 相关的文章。<br>试试其他关键词，如 <strong>GEO</strong>、<strong>百度</strong>、<strong>结构化数据</strong>。';
    } else {
      html = '我找到了 <strong>' + results.length + ' 篇</strong> 与 "' + escapeHtml(q) + '" 相关的文章：<br><br>';
      results.forEach(function(a) {
        html += '<a href="articles/' + a.slug + '.html" class="result-item">' +
          '<span class="r-num">' + a.index + '</span>' +
          '<span class="r-title">' + escapeHtml(a.title) + '</span>' +
          '<div class="r-meta">' + escapeHtml(a.topic) + ' · ' + a.date + '</div>' +
          '</a>';
      });
      html += '<div class="result-hint">点击标题阅读文章，或输入新关键词继续搜索</div>';
    }
    addMessage(html, 'agent');
  }

  function send() {
    var q = input.value.trim();
    if (!q) return;
    hidePrompt();
    if (q === '列举所有文章列表') {
      addMessage('列举所有文章列表', 'user');
      listAllArticles();
    } else {
      searchArticles(q);
    }
    input.value = '';
    input.focus();
  }

  // 页面加载时自动列出所有文章
  function listAllArticles() {
    var html = '知识库中有 <strong>' + articles.length + ' 篇文章</strong>，按话题分组：<br><br>';
    var topics = {};
    articles.forEach(function(a) {
      if (!topics[a.topic]) topics[a.topic] = [];
      topics[a.topic].push(a);
    });
    Object.keys(topics).forEach(function(topic) {
      html += '<strong style="color:#0071e3;">❯ ' + escapeHtml(topic) + '</strong><br>';
      topics[topic].forEach(function(a) {
        html += '<a href="articles/' + a.slug + '.html" class="result-item">' +
          '<span class="r-num">' + a.index + '</span>' +
          '<span class="r-title">' + escapeHtml(a.title) + '</span>' +
          '<div class="r-meta">' + a.date + '</div>' +
          '</a>';
      });
    });
    html += '<div class="result-hint">在下方输入关键词搜索文章，例如 <strong>GEO</strong>、<strong>百度</strong>、<strong>结构化数据</strong></div>';
    addMessage(html, 'agent');
  }

  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') { e.preventDefault(); send(); }
  });
  sendBtn.addEventListener('click', send);
  document.addEventListener('click', function() { input.focus(); });
  input.focus();

  // 自动列出所有文章
  listAllArticles();
})();
</script>

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

  console.log('🎉 构建完成！');
}

main();