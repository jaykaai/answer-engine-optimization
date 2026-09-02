# Cerebrum

> OpenWolf's learning memory. Updated automatically as the AI learns from interactions.
> Do not edit manually unless correcting an error.
> Last updated: 2026-08-22

## User Preferences

<!-- How the user likes things done. Code style, tools, patterns, communication. -->

## Key Learnings

- **Project:** answer-engine-optimization — 这是一个**学习型仓库**，不是代码项目。核心产出是知识与实验记录，不是软件。
- 教学模式：按 `AEO学习计划.md` 的 8 周节奏拆成单课，**每次只讲一课**，讲透原理 + 留可验证的动手作业，等用户反馈作业结果后再进下一课。
- 进度记录在 `学习进度.md`（课次状态、核心结论、作业清单、学员档案）。每讲完一课必须更新。
- 授课主体在对话中交付（用户直接读），文件只存精简结论供复习，避免重复。
- **[2026-08-24] 文章框架**：`cn/网站文章/*.md` → `npm run build` → `site/`（首页 + 文章页）。Markdown frontmatter 含 title/description/date/slug/topic/tags/faq，脚本自动生成 JSON-LD（Article + Person + FAQPage）。
- **[2026-08-24] marked 中文 bold 注意**：`marked` 对中文紧挨 `**` 标记的场景不识别，需要在 `**` 前后加空格。写 Markdown 时注意 `**关键词**` → ` **关键词** `。
- **[2026-08-26] 文章命名约定**：文件名用"日期-汉字标题.md"（如 `2026-08-25-自足段落.md`），方便人读；frontmatter 的 slug 保持拼音（如 `zi-zu-duan-luo`），作为 URL 标识符（`articles/{slug}.html`）。两者各司其职。
- **[2026-08-26] 获取真实专家引用的方法**：写 GEO 文章需要引用时，用 WebFetch 访问 arXiv 论文页（如 `arxiv.org/abs/2311.09735`），prompt 要求"quote verbatim sentences from abstract"。这能拿到可直引的原文句子 + 真实数字，避免第2课"伪造来源"的错误。Princeton GEO 论文 arXiv 2311.09735 的真实可引用句：①"GEO 能将生成式引擎回答中的内容可见度提升高达 40%" ②"生成式引擎通常通过从多个来源综合信息并用大语言模型总结来满足查询"。
- **[2026-08-26] 第 4 课流畅度三规则**（改写自足段落.md 实操）：①长句拆短，每句 15-25 词，多从句嵌套的拆成两句（如"…只摘取某个段落，而非整篇文章，被摘出的段落脱离了…"→拆成两句）；②避免连续重复同一个词，同一段"AI 引擎"出现 4-5 次就换"它"/"生成式引擎"，第二句开头重复主语用代词替代；③消除犹豫词：不一定→并不必然，可能已经→就已，远高于→显著高于。犹豫词让结论变模糊，AI 不爱引用拿不准的话。
- **[2026-08-30] 首页模板双源陷阱**：`site/index.html` 存在但**不是源文件**——首页由 `scripts/build.js` 的 `renderHomepage()` 函数动态生成。CSS/JS 改动必须改 build.js 里的模板字符串，`site/index.html` 只在 build 后作为产物存在。这是一个容易踩的坑。：新写的《让AI引用你》（2026-08-26）与现有《自足段落》（2026-08-25）互补不重复——后者讲"段落结构怎么搭"（答案优先/段落密度/可摘录性），前者讲"拿什么喂 AI 才会被引用"（统计数字/专家引用/流畅度）。同主题多篇文章要分工，不要覆盖对方主题。
- **[2026-08-26] 一键部署脚本** `npm run deploy`：在根目录运行，串行执行 ①`npm run build` ②根仓库 git add/commit/push ③site 仓库 git add/commit/push。commit 消息自动生成（根仓库 `feat: 发布文章 YYYY-MM-DD (N 篇)`，site `deploy: YYYY-MM-DD 文章更新`）。无变动时自动跳过该仓库。`npm run build` 在根目录运行（package.json 在根，build.js 用 `__dirname` 定位），输出到 `site/`；site/ 是独立 GitHub Pages 仓库，被 .gitignore 忽略。
- **[2026-08-26] 嵌入式 git 仓库陷阱**：把另一个 git 仓库（如 `eGEOagents/`、`site/`）放在本项目目录下，`git add .` 会把它当作 submodule（mode 160000）提交，只存 commit 哈希指针，内容不随仓库推送。凡是 clone 来的独立仓库放进项目目录，必须加进 `.gitignore`。

## User Preferences

- 授课要有实质洞察和可执行验证，不要复述资源清单链接。链接仅在深挖时给出。
- **[2026-08-21] 要实战形式：一步一步边做边教。** 不要先讲完理论再实践。教法应为：给一个可立即执行的动作 → 用真实数据说明原理 → 产出可复用的文件 → 下一步。理论只在动手卡住的那一刻插入。
- **[2026-08-23] 学习优先于效果验证。** 用户学习 GEO 是最终目的，网站/知乎是学习手段和实验室，不是 KPI。不要拿"还没被 AI 引用"催促用户，等收录/等引用期间应继续推进技术学习，而不是干等。
- **[2026-08-30] 深度学习偏好（重要转向）**：用户学完阶段一（1-10 课方法应用）后反馈"没学到原理和深度"，明确不想停留在操作清单层。**偏好：① 要"为什么"层面的原理，不要只背"做什么"的方法；② 目标是成为 GEO 专家并变现赚钱（不是纯学术，原理学到能讲透+解决实际问题的程度即可，不沉进推导）；③ 产出形式 = 专注学习 + 把笔记写成网站文章（既是沉淀也是专业度证明）；④ 节奏 = 细水长流，一次学透一个概念再走下一个；⑤ 明确不需要出书。** 据此将学习计划重写为进阶精通版四模块：原理深化 / 真实案例拆解 / 审计方法论 / 变现落地。
- **[2026-08-30] 配图偏好（重要修正）：文章配图坚持用苹果风手绘 SVG，禁用终端 ASCII 字符画**。用户先反馈"SVG 显示不出来"，我改用终端 ASCII 流程图，但用户随即纠正"写文章不要用终端线条画，看之前的写文章要求重新优化"。**教训：用户在终端里看不到 SVG 渲染 ≠ 文章里要换成字符画——文章配图是要发布到 jiyou.site 给人/给 AI 看的，必须用站点的标准视觉（苹果风手绘 SVG），而不是本地终端能否预览。** 结论：**网站文章的配图一律用苹果风手绘 SVG（` ```svg ` 块 + `class="entity-diagram"`），严格遵守「苹果风 SVG 铁律」**（白底灰边 + 左上角 3.5px 色点 + rx=16 大圆角 + 细线箭头 + 系统无衬线字体）。终端 ASCII 图只在「对话中即时讲解」可用，**绝不用于发布的网站文章**。本文（wei-shen-me-ai-pian-ai-shi-shi.md）已把 2 处 ASCII 图改为苹果风 SVG。

## 实战路线（2026-08-22 调整为双轨）

仓库结构已拆分为 `cn/` 和 `en/` 两个并行分支。**当前先做中国版**，完成后切回国外版。

### 中国版 8 步闭环

① 侦察（中国 AI 引擎引用行为）→ ② 建站/选阵地 → ③ 挖中文真实问题 → ④ 按规格写中文内容 → ⑤ 手写百度兼容 JSON-LD → ⑥ robots.txt + sitemap + 部署 → ⑦ 百度搜索资源平台提交 → ⑧ 2-4 周后测中国 AI 引擎是否引用并迭代

### 中国 AEO 关键信息（2026-08-22 建立，持续更新）

- **用户实测数据优先于我的假设。** [2026-08-21] 我曾断言"知乎是中国AEO超级节点"，但用户实测秘塔/豆包/千问搜"GEO"均**未引用知乎** → 已推翻该假设。正确认知：中国 AI 搜索对技术性新话题优先引用**原创文章**（自建站如 louishe.com、科技媒体），而非问答平台。平台选择必须用实测验证，不能沿用国外经验。
- 中国行业术语是 **GEO（生成式引擎优化）**，不是 AEO（答案引擎优化）。搜"答案引擎优化"几乎无中文结果（秘塔只能引用英文站翻译）；搜"GEO 生成式引擎优化"有中文结果。写内容用 GEO。
- 自足段落规则（chunk 脱离标题后仍独立成文）在中国完全成立——实测 louishe.com 被引用段落："生成引擎优化 (GEO) 是一种优化内容的实践，使其在 ChatGPT、Claude、Gemini 和 Perplexity 等生成式 AI 平台中显示为权威来源或直接响应。" 问句H2+直答首句+自带主语全称。
- 中国 AI 搜索的底层数据源大部分依赖百度索引 → 做好百度SEO是AEO的前提
- 百度百科是实体建设基础，但创建门槛高（审核严格）
- 微信公众号是封闭生态，百度不索引，对 AEO 无效
- 百度对 JS 渲染能力有限，依赖原始 HTML → 自建站用纯静态 HTML（大道至简）
- 秘塔AI搜索（metaso.cn）引用标注最清晰，是 AEO 观测主窗口；豆包/千问/秘塔对"GEO"话题均不引用知乎
- 国产 AI 爬虫：Baiduspider、bytespider（字节）；另需放行 GPTBot、OAI-SearchBot、PerplexityBot、ClaudeBot、Claude-Web

### 业务定位（2026-08-22 用户确认的最终方向）

业务模式 = **自举式 GEO 专家**：
- 学 GEO → 写 GEO 内容 → 让 AI 引用你的内容 → "AI 引用你" = 你懂 GEO 的铁证 → 客户搜 GEO 时看到你被引用 → 自然找上门
- 客户：想要"让 AI 推荐自己产品"的中小商家/商户
- 服务：帮商户让 AI 引擎引用他们的商品信息（GEO 代运营/咨询）
- 用户背景：计算机专业，体制内不做技术，对 AI 智能体应用感兴趣，计划做智能体自媒体
- 平台策略：自建站为主（实测证明自建站可被引用），知乎作为分发渠道（不依赖被引用）
- 部署决策：实名域名（阿里云/腾讯云注册）+ GitHub Pages（免备案），一期不用国内服务器

### 结构化数据验证工具现状（2026-08-23 curl 实测）

- **百度官方验证工具全部下线**：`ziyuan.baidu.com/structureddata`、`/richresults`、`/college/structureddata` 均 404（学习计划 2.1 整段引用已失效）。不要再推荐这三个链接。
- **Google Rich Results Test / Markup Helper** 不可访问（国内无外网 + 富结果测试 2025 已官方下线）。
- **现役可用验证工具**：`https://json-ld.org/playground`（HTTP 200）— JSON-LD 语法官方验证器，粘贴代码即可看规范化展开和错误报告；`ziyuan.baidu.com` 主站（HTTP 200）— 登录后"抓取诊断/模拟抓取"看百度爬虫实际拿到的 HTML；`curl 自己页面` 永远可用。
- 中文环境终极验证 = **等收录后在百度/AI 引擎搜 FAQ 问题看是否展示**，工具验证只是语法与抓取层的检查。

### 网站设计原则（2026-08-22 确定，2026-08-24 更新）

- 文章用 **Markdown 写**，不要手写 HTML（2026-08-24 确认）
- 工作流：`cn/网站文章/*.md` → `npm run build` → `site/` 自动生成
- 首页设计：Agent 系统提示框 + **AI 搜索对话**（搜索框输入关键词，AI 返回文章列表，点击跳转）
- 已移除静态话题列表，搜索是唯一的内容发现方式
- 文章页设计：苹果宽屏卡（960px），红绿灯终端条 + 白底正文 + 代码块 Apple Xcode 风格
- **[铁律] 文章配图 = 手绘 SVG（论文级苹果风）**。不用 mermaid、不用截图、不用外部图。理由：①mermaid 自动布局 + 方框阴影 = 工具感，达不到苹果风高级感；②纯 SVG 零依赖、百度可抓、打印不丢、无 CDN 等待。**苹果风 SVG 要素（必须全部满足）**：
  - **配色克制**：节点**不用饱和填色区分类型**——所有卡片用白 `#ffffff` 或极淡灰 `#fbfbfd` 填充、统一细灰边 `#d2d2d7`/1px；类型区分**只用一个小色点**（3.5px 圆点 + 标签色 `#0071e3`蓝/`#34c759`绿/`#af52de`紫）放在卡片左上角。**禁忌**：`#f0f5ff`+`#3b6fd4` 这种"淡填+深边同色系"仍是工具感，已废弃；`#edf7ee`+`#2e8b4e`、`#f7f0fb`+`#7a3fb4` 同理太饱和。正确做法是白底+灰边+色点。连线用 `#a1a1a6`/1.1px 极淡灰。
  - **形状语言**：统一用大圆角矩形卡片 `rx="16"`（核心节点 `rx="18"` 且尺寸略大），避免方角；**不要**用虚线边/双线边区分类型（工具感），类型只靠色点+标签区分。卡片内部用 `#ececee`/1px 极淡分割线分隔标题与属性列表。不用阴影（苹果风卡片靠边框不靠投影）。
  - **细线**：边框 1px、连线 1-1.2px、`stroke-linecap="round"`
  - **留白**：节点内 padding 充足、节点间距大、viewBox 不挤满
  - **字体**：`-apple-system,"SF Pro Text","PingFang SC","Helvetica Neue",sans-serif`；节点标题 15px `font-weight:600` `#1d1d1f`、属性 12.5px `#6e6e73`、类型标签 11px `#86868b` `letter-spacing:.5px` 全大写（如 `ARTICLE`/`PERSON`/`ORGANIZATION`）、边标签 12px `#6e6e73`；`text-anchor="middle"` 居中标题；卡片内属性左对齐 `@id`/`sameAs`/`knowsAbout` 列表。
  - **布局**：三列分组（内容实体 / 人物实体 / 机构实体），顶部用 11px `#86868b` 分组标题；人物卡片居中且尺寸最大（核心节点）；弧线连线走卡片间留白区，回流弧线（如 founder → person）绕上方走不与其他线交叉；图注放 viewBox 底部一行。
  - **箭头**：`<marker>` 自定义，箭头用**细线勾勒**（`<path d="M0,1 L9,5 L0,9" fill="none" stroke="#86868b" stroke-width="1.4">`）而非实心三角 `fill`——线条式箭头更苹果风；`markerWidth/Height="6"` 小而克制；边标签用 12px `#6e6e73` 灰，放在弧线中点上方，不啰嗦（单字段名如 `author`/`publisher`，不加中文重复）。
  - **图注**：图下方一行 12px `#86868b` 灰字，一句话点明图的读法
  - build.js 已支持：`marked.use` renderer 的 `svg` 分支 `return text.trim()` 原样内联；CSS `.article-body svg.entity-diagram` 控宽自适应+打印不断页
- robots.txt 全部放行（含 AI 爬虫），无屏蔽理由
- JSON-LD 自动生成：Article + Person + FAQPage + sameAs

### 国外版关键实测结论（已存档，不必重新采集）

- Moz 只屏蔽 `GPTBot`（训练），放行搜索类爬虫 → 训练/搜索爬虫必须分开决策
- Ahrefs、Semrush、Backlinko 的 robots.txt 对 AI 爬虫 0 条规则（全放行）
- Ahrefs HTML 850KB vs Semrush 218KB；Ahrefs 的 h2 被 CSS-in-JS 包装层淹没，是反面标本
- 自足段落（self-contained chunk）是最易漏的规则：直答句必须自带主语全称，因 chunk 被摘出时已脱离标题

- **[2026-08-30] llms.txt v2 标准（实测 llmstxt.org）**：llms.txt 是给 AI Agent 看的"网站说明书"，放在站根（`site/llms.txt`），`Content-Type: text/plain`。格式按固定顺序：①H1 站名（唯一必须项）②blockquote 一句话摘要 ③可选 H2 分区的文件列表（`[名称](URL): 描述`）④`## 可选` 分区按惯例放 AI 上下文不够时可跳过的次要信息。**与 robots.txt/sitemap.xml 分工**：robots 管"能不能进"（禁止）、sitemap 管"有哪些 URL"（列举无描述）、llms.txt 管"进来后优先读哪份"（引导，带描述）。**采纳现状**：OpenAI/Anthropic/Google 都给自己的开发者文档发了 llms.txt（以身作则）；Lighthouse 已把"有没有 llms.txt"纳入 agentic browsing 审计；Yoast/AIOSEO/Wix 内置生成器。**关键真相**：llmstxt.org 不声称通用搜索爬虫会索引 llms.txt——它是**按需读取**（AI 回答问题时去抓），不是 SEO 排名加分项。所以 llms.txt 是 AI 引用入口，不是排名因素。v2 还提到进阶玩法 `rel="alternate" type="text/markdown"` 给每页暴露 Markdown 版本，暂不做。jiyou.site 的 llms.txt 已上线（2026-08-30），核心文章列表含 3 篇 + 可选分区含首页/知乎/GitHub 身份锚点。
- **[2026-08-27] 第 6 课·实体图（Entity Disambiguation）模式**：JSON-LD 从"每个页面重复内联 Person/Org 对象"升级为"用 `@id` 引用的实体图"。三要素：①每个实体有稳定 `@id`（`#person`/`#organization`/`#website`/`#article`）；②跨实体引用用 `{"@id": "..."}` 而非重复内联对象；③sameAs 多平台锚点让 AI 跨数据源拼同一个实体。build.js 配置常量区集中管理 `PERSON_ID`/`ORG_ID`/`WEBSITE_ID`/`AUTHOR_SAMEAS`(数组)/`AUTHOR_KNOWS_ABOUT`(稳定领域，不随文章 tag 变)/`AUTHOR_DESCRIPTION`。文章页输出 Article+Person+Organization 三块；首页输出 WebSite+Person+Organization 三块。knowsAbout 是作者稳定身份（生成式引擎优化/AI智能体应用/结构化数据/搜索引擎优化），不是每篇文章的 tag。
- **[2026-08-27] sameAs 嵌套数组 Bug**：配置常量 `AUTHOR_SAMEAS` 从字符串改成数组后，下游必须用 `AUTHOR_SAMEAS`（已是数组）或 `...AUTHOR_SAMEAS` 展开，**不能**再写 `[AUTHOR_SAMEAS]`（变成嵌套数组 `[[...]]`）或 `"${AUTHOR_SAMEAS}"`（数组被模板化成逗号字符串 `a,b`）。首页手写模板里用 `JSON.stringify(AUTHOR_SAMEAS)` 最安全。
- **[2026-08-30] mermaid 客户端渲染方案**：build.js 用 `marked` v15，marked 默认不识别 ` ```mermaid ` 块（当普通代码块输出）。接入 mermaid 用客户端方案（大道至简，非框架）：①build.js 用 `marked.use({ renderer: { code({text, lang}) {...} } })` 把 `language-mermaid` 块输出成 `<pre class="mermaid">原样源码</pre>`（**不转义**，mermaid 的 `<br/>` 语法需原样保留，源码来自作者 Markdown 无 XSS 风险）；②文章页模板 `</head>` 前加 `<script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js">`；③`</body>` 前加 `mermaid.initialize({ startOnLoad: true, theme: 'base', themeVariables: {...} })`。用 `base` 主题 + `themeVariables` 配**论文风三色分类**（非全灰）：不同实体类型用不同色系区分层次——`primary`(蓝 #e8f0fe/#4285f4 内容实体 Article/WebSite)、`secondary`(绿 #e6f4ea/#34a853 人物 Person)、`tertiary`(紫 #f3e8fd/#a142f4 机构 Organization)；节点形状也区分：`()` 圆角=人物、`{{}}` 双线=机构、`[]` 方角=内容。源码用 `class A,W primary; class P secondary; class O tertiary;` 给节点分配色系。**禁忌**：不要把所有节点都用同一个 `primaryColor` 灰色——用户明确反馈"配色风格不搭/不好看"，全灰既无层次也不论文。mermaid 图语法验证可用 `npx -y @mermaid-js/mermaid-cli -i in.mmd -o out.svg -t neutral`（cli 不支持 `base` 主题，只能 default/forest/dark/neutral，所以 cli 只验语法，配色以浏览器实际渲染为准）。
- **[2026-08-30] marked v15 自定义 renderer API**：marked v12+ 的 `code` 方法签名从 `(code, infostring)` 改成单对象参数 `code({ text, lang, escaped })`。旧写法 `renderer.code = (code, infostring) => {...}` 仍会执行但**参数对不上**（`infostring` 是 undefined，mermaid 分支永不进），导致 mermaid 块被当成普通代码块输出成 `<pre><code class="language-mermaid">`。正确写法：`marked.use({ renderer: { code({ text, lang }) { if (lang==='mermaid') return ...; return false; } } })`，返回 `false` 走默认渲染。注意 `new marked.Renderer()` + 覆盖方法的旧用法在 v15 已废弃，必须用 `marked.use({ renderer: {...} })`。
- **[2026-08-30] sitemap.xml 必须自动生成，禁止手工维护**（第 9 课 Content Freshness 落地）。症状：site/sitemap.xml 只列 3 篇但站已有 5 篇——build.js 只生成文章页+首页，sitemap 是手工静态文件，每加文章就漏一次，且首页 lastmod 停在 2026-08-22（实际 08-30 更新过）。**修法**：build.js 加 `renderSitemap(articles)` 在 main() 末尾调用（自动写入 site/sitemap.xml）。核心两点：①遍历所有文章生成 `<url>`，新增文章进目录自动跟进；②**lastmod 用源文件 mtime**（`fs.statSync(path.join(SRC_DIR, article.file)).mtime`）而非 frontmatter date——date 只是发布日期，mtime 真实反映"最后一次编辑"，是 Content Freshness 的关键信号（AI 通过 lastmod 判断站最近动没动）。首页 lastmod = 今天。验证：`npm run build` 后 cat site/sitemap.xml 应含全部文章 + 各归各位的 lastmod。
- **[2026-08-30] 内容新鲜度（Content Freshness）**：AI 引擎**优先引用 3 个月内更新的内容**，这是被引用的前提之一而非加分项（Princeton GEO 研究独立方法）。数据衰减（Stale Data）：**3 年以上统计数字要替换**。判断三问：数字还准吗？来源还活着吗？有更新替代吗？zi-zu-duan-luo.md 引用的 Aggarwal et al., 2024 论文 2024→2026 是 2 年，仍在 3 年窗口内；到 2027 进入衰减区需更新。更新日历：每周 2-3 篇新文章自带新鲜度 + 每月翻 3 个月前的旧文查数据 + 更新后 build 自动刷新 lastmod。
- **[2026-08-30] 弃 mermaid 改手绘 SVG（论文风判断）**：用户反馈 mermaid"不好看/想要论文风"，即使配了三色分类，mermaid 的方框 + 自动布局 + 默认阴影仍偏"工具图"。**判断标准：节点 ≤ 6 个、结构稳定不常改、要求论文级精确排版 → 手绘 SVG 优于 mermaid；节点多/频繁改/自动布局有价值 → 用 mermaid。** 手绘 SVG 方案（已落地到实体图文章）：①build.js 的 `marked.use` renderer 里加 `if (l === 'svg') return text.trim()`，原样内联 SVG（不转义，源码来自作者 Markdown 无 XSS 风险）；②SVG 用 `viewBox` 自适应、加 `class="entity-diagram"` + style.css `.article-body svg.entity-diagram { width:100%; max-width:880px; height:auto; margin:2.5rem auto; } @media print { page-break-inside: avoid; }`；③论文风视觉要素：白底无阴影、1.2px 细线、节点**形状**区分类型（方角=内容实体/圆角=人物/虚线边=机构）、淡填色+深细边（蓝/绿/紫低饱和）、标签克制（用 `<text>` 而非重复啰嗦的边标签）、`<defs><marker>` 自定义箭头、系统无衬线字体。纯 SVG 零依赖、百度可抓、打印不丢、无 CDN 加载等待。
- **[2026-08-30] 中国 AI 引擎适配（第 10 课）**：中国 AI 引擎分两类——**联网搜索型**（秘塔/Kimi/豆包/通义"联网"模式，实时抓网页，与 Perplexity/ChatGPT 搜索同构，前 9 课方法全部直接适用）vs **闭卷问答型**（不联网靠模型记忆，能否被引用取决于内容是否进入训练数据 → 故不拦 GPTBot/ClaudeBot/CCBot）。**逐方法适配**：爬虫（Baiduspider+bytespider+秘塔，通配符兜底）、引用源（优先中文权威源，但不为中文而中文，核心仍是可查证）、结构化数据验证（百度资源平台"抓取诊断"模拟爬虫视角）、实体平台（知乎已建+百度百科待建）、监控（每周手工搜 5 引擎记基线）。**百度百科门槛**：要权威媒体来源佐证、不能自建自条目、要可查证公开信息——"纪优"目前建不了个人词条。**可行路线**：先建"生成式引擎优化（GEO）"概念词条（有研究+论文依据好过），拿到媒体引用后再建"纪优"个人词条。**核心判断：百科是"水到渠成"型资产，不是主动争取型——瓶颈是公开影响力，不是百科。当搜"GEO"能看到 jiyou.site 时才去建百科。**
- **[2026-08-30] 模块一原理深化 · 1-1 RAG 机制**：AI 引擎回答用户问题走 **RAG（检索增强生成）** 三段管道——**检索**（Retrieval：把网页切段 → 向量匹配找相关片段）、**排序**（Ranking：给片段打分，数字/来源/新鲜度/权威性加权）、**合成**（Synthesis：把挑中段落拼进回答 + 标注来源）。**关键**：AI 是按段检索而非整篇引用（chunking），所以"自足段落"有效——段落脱离上下文仍独立可读，才会在检索环节被命中（读不懂"它"的段落会被跳过）。各方法落点：检索环节=自足段落/段落密度/答案优先/可摘录性；排序环节=统计数字/权威来源/新鲜度/权威语气；合成环节=能被引用就赢了。llms.txt/结构化数据/实体图作用在更上游（让 AI 发现+理解你的站），不在段落检索排序环节。**GEO 不是写漂亮文章的玄学，是"让三段管道里你的段落一路胜出"的工程。**
- **[2026-08-30] 模块一原理深化 · 1-2 为什么 AI 偏爱"像事实"内容（三层机制）**：①**预训练（统计信号）**——模型从海量语料归纳出"数字/来源/笃定=事实"的统计规律，故具体数字是事实信号；②**指令训练（引用偏好）**——SFT+RLHF 教模型"引用有出处内容得分高"，故有出处>没出处；③**现场判断（对比取舍）**——上下文学习时模型没法核实对错，只能靠"哪个看起来更可信"取舍，故具体>含糊。**三层合一：AI 只能靠"看起来像不像事实"做取舍。** 实战落地：数字>形容词、出处>无出处、笃定>犹豫、首句答案>绕圈——本质都是"让段落看起来像无可置疑的事实"。**伦理边界（铁律）**：严禁伪造数字/来源——GEO 是长期生意，被戳穿一次可信度归零；真专家靠内容经得起验证，理解机制是为让真实内容被公平看见，不是操纵。
- **[2026-08-30] 模块一原理深化 · 1-3 GEO 五环链路（Crawl-to-Cite 认知）**：AI 从"不知道你的站"到"引用你"走过**五环**——①**发现**（sitemap/外链）、②**准入**（robots.txt 能否进）、③**读取**（JSON-LD/llms.txt/实体锚点，让解析器看懂结构+实体）、④**索引**（内容原创成体系，切成片段存知识库）、⑤**引用**（自足段落/数字/来源，检索排序选中）。**①②③④=必要条件（AI 到不到得了你）**，**⑤=决胜点（AI 到得了之后选不选你）**。各技术落点：sitemap→①、robots→②、JSON-LD+llms.txt+实体→③、内容质量→④、段落写法→⑤。**核心洞察："为做而做"无效**——每一环必须服务下一环、最终服务⑤的引用；判断标准="这步要服务哪个下一环？答不上来=白做"。**jiyou.site 现状审计：①②③④已就绪，唯一未验证=⑤引用（还没搜"GEO"看有没有自己）**——这是当前最重要的待办，监控作业即验证⑤环。
- **[2026-08-30] 模块二案例拆解 · 被引用站 5 共性清单**（用实测样本 louishe.com/ithome/tech.china/ifeng/aliyun/zenodo 拆出）：①**原创+语义精确**（能否被检索命中，非搬运/问答垃圾）；②**首句给答案+自带主语**（命中答案优先+可摘录性）；③**数字/具体对象/可验证**（排序加分的事实信号）；④**权威背书**（科技媒体/大厂/学术有光环，但 **louishe.com 个人博客无光环也靠内容被引用→权威是加分项非必要条件**）；⑤**新鲜**（新媒体持续更新）。**核心结论："被引用的不是平台，是符合检索规律的段落"**——平台决定能否被发现，段落质量决定是否被引用。**反向拆 jiyou.site 诊断 3 改进点**：①首句补主流关键词"GEO/生成式引擎优化"（《让AI引用你》用了自造词"内容引用优化"，口径不统一→检索命中率下降）；②段落具体对象更密（louishe 被引段落逐个列 ChatGPT/Claude/Gemini/Perplexity，增强事实感；可补秘塔/Kimi/豆包/通义）；③权威锚点强化（加分项非必需）。**已用 annotate 工作流把 4 处诊断（before/after 形式，Word 式角标+气泡）批注到《让AI引用你》。**
- **[2026-08-30] 模块三审计方法论 · 六维审计清单（GEO 服务产品骨架）**：把模块一原理+模块二眼光组织成能给任何客户站打分的体系，六维：**①内容**（自足段落/答案优先/数字可验证/原创，最重占高分）、**②结构化**（JSON-LD 实体图/FAQ schema）、**③实体**（人物/机构识别锚点与消歧）、**④爬虫**（robots.txt 是否放行 AI 爬虫，非黑即白，屏蔽 GPTBot/ClaudeBot/PerplexityBot=严重问题）、**⑤新鲜度**（超 3 年数据衰减检测）、**⑥可发现**（sitemap/外链/关键词口径）。**六维对应模块一五环链路**：可发现→①发现、爬虫→②准入、结构化+实体→③读取、内容→⑤引用、新鲜度贯穿全链路。**打分：0-5 分 + 客观判据不凭感觉**（内容维数"达标段落÷总段落"比例、爬虫维看是否屏蔽、新鲜度维数超3年数据）。**交付物结构**：六维雷达图→总分/优先级→按严重度排序问题清单(🔴🟠🟡)→改进计划(做什么/为什么/预估影响/优先级)。**这就是能收钱的交付物。**
- **[2026-08-30] 文章 FAQ 必须与 H2 一一对应（build.js 陷阱）**：build.js 的 FAQ 提取用 `generateFaqJsonLd` 正则找 `<h2>问题</h2><p>答案</p>`，**找不到匹配 H2 时回退成 answer=问题本身**（产生坏的 FAQPage 结构化数据）。写文章时必须：FAQ 列表的每个问题 = 正文的实际 H2 标题（完整问句），不能写成"三个常见问题"重复段。**正确模式**：让正文 H2 直接是 FAQ 问句，删掉正文尾部重复的 FAQ 段落（否则重复）。

## Do-Not-Repeat

- [2026-08-21] 断言"知乎是中国 AEO 超级节点"但**未经验证**，被用户实测数据推翻（秘塔/豆包/千问均未引用知乎）。教训：**给建议前必须用用户或自己的实测数据验证，不要沿用国外经验推断中国生态。**
- [2026-08-21] 建议用户做"AI 智能体应用实战"定位，但用户指出体制内没有真实业务场景、无法持续输出。教训：**建议定位前先考虑用户的资源约束和持续输出能力。**
- [2026-08-30] **修改首页 UI 必须改 `scripts/build.js`，不要直接改 `site/index.html`**。首页由 `build.js` 的 `renderHomepage()` 函数动态生成，`npm run build` 会用模板覆盖 `site/index.html`。直接改 `site/index.html` 在下一次 build 时就丢了。
- [2026-08-26] **写 GEO 文章时严禁伪造来源和张冠李戴**。第 2 课发现 zi-zu-duan-luo.md 把同一个 arXiv 链接（2311.09735）套在三个不同来源上（AutoGEO ICLR 2026 / Stanford 2025 / GEO Optimizer 项目），还编了 +25%/+23%/+10% 等无法当场核实的数字。教训：**没有当场核实出处的数字和来源，一律不写。宁可少写数字，不可造假来源。** 第 2 课的核心恰恰是"每个声明附可查证来源"，造假等于反教学。。第 2 课发现 zi-zu-duan-luo.md 把同一个 arXiv 链接（2311.09735）套在三个不同来源上（AutoGEO ICLR 2026 / Stanford 2025 / GEO Optimizer 项目），还编了 +25%/+23%/+10% 等无法当场核实的数字。教训：**没有当场核实出处的数字和来源，一律不写。宁可少写数字，不可造假来源。** 第 2 课的核心恰恰是"每个声明附可查证来源"，造假等于反教学。

## Decision Log

- [2026-08-23] **仓库目录按「文档性质」分层**：`cn/学习/`（计划+进度）+ `cn/知识库/`（大纲+规格+实体）+ `cn/知乎文章/`（流水产出，按日期命名如 `2026-08-23-第一篇.md`）+ `cn/网站文章/`（预留）。理由：文章会无限增长，资产类（不涨）与流水类（一直涨）必须分开，避免预览目录时被淹没。en/ 同构：`en/学习/` + `en/知识库/`。**约定：新产出的知乎/网站文章一律进文章目录，按日期前缀命名；跨层链接用相对路径 `../../`。**
- [2026-08-21] 部署方案选 **GitHub Pages + 自定义域名（阿里云/腾讯云注册）+ 免备案**。理由：零维护、免费、无需备案、自定义域名是 AI 实体的基础。中期若有国内收录需求再评估香港服务器。
- [2026-08-21] 建站用**手写纯静态 HTML**，不引入框架。理由：目标是让 LLM 读 HTML 而非给人看，静态 HTML 即最小充分方案；第一篇手写以理解本质，篇数增多后再评估 Astro 批量生成。
- **[2026-08-24] 自建极简文章框架（Markdown → Node.js 脚本 → HTML）**。理由：文章数量增多后手写 HTML 效率低，且多平台（网站/知乎/微信）需要统一源。不引入 Astro/Hugo 等外部框架，保持大道至简。首页用 AI 搜索对话替代终端命令和静态话题列表，搜索是对页面内嵌的文章 JSON 做客户端全文检索，新文章自动进入搜索结果。
- **[2026-08-30] 学习计划转向进阶精通版**。用户学完阶段一（1-10 课方法应用）后认为"没学到原理深度"，目标从"会做 GEO"升级为"成为专家能变现"。**决策**：重写学习计划为四模块——模块一原理深化（RAG 机制、引用加权原理、链路认知）、模块二真实案例拆解、模块三审计方法论、模块四变现落地。**移除**原第 12 课（出书，用户不需要）；原第 11 课（审计）升级为模块三。**理由**：能变现的专家靠"原理吃透后用得出"，而非堆方法清单；原理深度学到"能讲透为什么、能解决实际问题"即可，不沉纯学术推导。

### 行内批注工作流（2026-08-26 确定）

- **批注呈现风格 = 全部行内批注**（否决红笔对比块/混搭方案）。理由：长文用大块对比卡片会打断阅读、满屏红绿卡片切碎正文；行内批注让正文保持干净，句末角标点开才看详情，不点开就是普通文章。
- **批注写在 Markdown 源里**，用 ` ```annotate ` 代码块紧跟被批注段落后。build.js 自动处理：角标插到前一个 `</p>` 前，气泡跟在原 annotate 块位置。作者只管写 `lesson`/`rule`/`before`/`after`/`why` 字段。
- **两种批注形态**：带 diff（before/after + why）用于"改前改后"对比；纯说明型（只有 why，加 `simple` 类）用于点明"这句用了哪课方法"。
- **toggleAnno 单开模式**：打开一个关掉所有其他。角标和气泡用 ID 互查（`anno-N` / `anno-N-mark`），不依赖 DOM 相邻关系——同段落多批注时 `previousElementSibling` 会串位。
- 批注字段 YAML 风格：`key: value` 单行；多行值用 key 空行 + 缩进续行（parseAnnotateBlock 已处理）。
