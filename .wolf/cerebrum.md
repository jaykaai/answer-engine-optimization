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
- **[2026-08-26] 整合文章的互补原则**：新写的《让AI引用你》（2026-08-26）与现有《自足段落》（2026-08-25）互补不重复——后者讲"段落结构怎么搭"（答案优先/段落密度/可摘录性），前者讲"拿什么喂 AI 才会被引用"（统计数字/专家引用/流畅度）。同主题多篇文章要分工，不要覆盖对方主题。
- **[2026-08-26] 一键部署脚本** `npm run deploy`：在根目录运行，串行执行 ①`npm run build` ②根仓库 git add/commit/push ③site 仓库 git add/commit/push。commit 消息自动生成（根仓库 `feat: 发布文章 YYYY-MM-DD (N 篇)`，site `deploy: YYYY-MM-DD 文章更新`）。无变动时自动跳过该仓库。`npm run build` 在根目录运行（package.json 在根，build.js 用 `__dirname` 定位），输出到 `site/`；site/ 是独立 GitHub Pages 仓库，被 .gitignore 忽略。
- **[2026-08-26] 嵌入式 git 仓库陷阱**：把另一个 git 仓库（如 `eGEOagents/`、`site/`）放在本项目目录下，`git add .` 会把它当作 submodule（mode 160000）提交，只存 commit 哈希指针，内容不随仓库推送。凡是 clone 来的独立仓库放进项目目录，必须加进 `.gitignore`。

## User Preferences

- 授课要有实质洞察和可执行验证，不要复述资源清单链接。链接仅在深挖时给出。
- **[2026-08-21] 要实战形式：一步一步边做边教。** 不要先讲完理论再实践。教法应为：给一个可立即执行的动作 → 用真实数据说明原理 → 产出可复用的文件 → 下一步。理论只在动手卡住的那一刻插入。
- **[2026-08-23] 学习优先于效果验证。** 用户学习 GEO 是最终目的，网站/知乎是学习手段和实验室，不是 KPI。不要拿"还没被 AI 引用"催促用户，等收录/等引用期间应继续推进技术学习，而不是干等。

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
- robots.txt 全部放行（含 AI 爬虫），无屏蔽理由
- JSON-LD 自动生成：Article + Person + FAQPage + sameAs

### 国外版关键实测结论（已存档，不必重新采集）

- Moz 只屏蔽 `GPTBot`（训练），放行搜索类爬虫 → 训练/搜索爬虫必须分开决策
- Ahrefs、Semrush、Backlinko 的 robots.txt 对 AI 爬虫 0 条规则（全放行）
- Ahrefs HTML 850KB vs Semrush 218KB；Ahrefs 的 h2 被 CSS-in-JS 包装层淹没，是反面标本
- 自足段落（self-contained chunk）是最易漏的规则：直答句必须自带主语全称，因 chunk 被摘出时已脱离标题

- **[2026-08-27] 第 6 课·实体图（Entity Disambiguation）模式**：JSON-LD 从"每个页面重复内联 Person/Org 对象"升级为"用 `@id` 引用的实体图"。三要素：①每个实体有稳定 `@id`（`#person`/`#organization`/`#website`/`#article`）；②跨实体引用用 `{"@id": "..."}` 而非重复内联对象；③sameAs 多平台锚点让 AI 跨数据源拼同一个实体。build.js 配置常量区集中管理 `PERSON_ID`/`ORG_ID`/`WEBSITE_ID`/`AUTHOR_SAMEAS`(数组)/`AUTHOR_KNOWS_ABOUT`(稳定领域，不随文章 tag 变)/`AUTHOR_DESCRIPTION`。文章页输出 Article+Person+Organization 三块；首页输出 WebSite+Person+Organization 三块。knowsAbout 是作者稳定身份（生成式引擎优化/AI智能体应用/结构化数据/搜索引擎优化），不是每篇文章的 tag。
- **[2026-08-27] sameAs 嵌套数组 Bug**：配置常量 `AUTHOR_SAMEAS` 从字符串改成数组后，下游必须用 `AUTHOR_SAMEAS`（已是数组）或 `...AUTHOR_SAMEAS` 展开，**不能**再写 `[AUTHOR_SAMEAS]`（变成嵌套数组 `[[...]]`）或 `"${AUTHOR_SAMEAS}"`（数组被模板化成逗号字符串 `a,b`）。首页手写模板里用 `JSON.stringify(AUTHOR_SAMEAS)` 最安全。
- **[2026-08-30] mermaid 客户端渲染方案**：build.js 用 `marked` v15，marked 默认不识别 ` ```mermaid ` 块（当普通代码块输出）。接入 mermaid 用客户端方案（大道至简，非框架）：①build.js 用 `marked.use({ renderer: { code({text, lang}) {...} } })` 把 `language-mermaid` 块输出成 `<pre class="mermaid">原样源码</pre>`（**不转义**，mermaid 的 `<br/>` 语法需原样保留，源码来自作者 Markdown 无 XSS 风险）；②文章页模板 `</head>` 前加 `<script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js">`；③`</body>` 前加 `mermaid.initialize({ startOnLoad: true, theme: 'base', themeVariables: {...} })`。用 `base` 主题 + `themeVariables` 配**论文风三色分类**（非全灰）：不同实体类型用不同色系区分层次——`primary`(蓝 #e8f0fe/#4285f4 内容实体 Article/WebSite)、`secondary`(绿 #e6f4ea/#34a853 人物 Person)、`tertiary`(紫 #f3e8fd/#a142f4 机构 Organization)；节点形状也区分：`()` 圆角=人物、`{{}}` 双线=机构、`[]` 方角=内容。源码用 `class A,W primary; class P secondary; class O tertiary;` 给节点分配色系。**禁忌**：不要把所有节点都用同一个 `primaryColor` 灰色——用户明确反馈"配色风格不搭/不好看"，全灰既无层次也不论文。mermaid 图语法验证可用 `npx -y @mermaid-js/mermaid-cli -i in.mmd -o out.svg -t neutral`（cli 不支持 `base` 主题，只能 default/forest/dark/neutral，所以 cli 只验语法，配色以浏览器实际渲染为准）。
- **[2026-08-30] marked v15 自定义 renderer API**：marked v12+ 的 `code` 方法签名从 `(code, infostring)` 改成单对象参数 `code({ text, lang, escaped })`。旧写法 `renderer.code = (code, infostring) => {...}` 仍会执行但**参数对不上**（`infostring` 是 undefined，mermaid 分支永不进），导致 mermaid 块被当成普通代码块输出成 `<pre><code class="language-mermaid">`。正确写法：`marked.use({ renderer: { code({ text, lang }) { if (lang==='mermaid') return ...; return false; } } })`，返回 `false` 走默认渲染。注意 `new marked.Renderer()` + 覆盖方法的旧用法在 v15 已废弃，必须用 `marked.use({ renderer: {...} })`。
- **[2026-08-30] 弃 mermaid 改手绘 SVG（论文风判断）**：用户反馈 mermaid"不好看/想要论文风"，即使配了三色分类，mermaid 的方框 + 自动布局 + 默认阴影仍偏"工具图"。**判断标准：节点 ≤ 6 个、结构稳定不常改、要求论文级精确排版 → 手绘 SVG 优于 mermaid；节点多/频繁改/自动布局有价值 → 用 mermaid。** 手绘 SVG 方案（已落地到实体图文章）：①build.js 的 `marked.use` renderer 里加 `if (l === 'svg') return text.trim()`，原样内联 SVG（不转义，源码来自作者 Markdown 无 XSS 风险）；②SVG 用 `viewBox` 自适应、加 `class="entity-diagram"` + style.css `.article-body svg.entity-diagram { width:100%; max-width:880px; height:auto; margin:2.5rem auto; } @media print { page-break-inside: avoid; }`；③论文风视觉要素：白底无阴影、1.2px 细线、节点**形状**区分类型（方角=内容实体/圆角=人物/虚线边=机构）、淡填色+深细边（蓝/绿/紫低饱和）、标签克制（用 `<text>` 而非重复啰嗦的边标签）、`<defs><marker>` 自定义箭头、系统无衬线字体。纯 SVG 零依赖、百度可抓、打印不丢、无 CDN 加载等待。

## Do-Not-Repeat

- [2026-08-21] 断言"知乎是中国 AEO 超级节点"但**未经验证**，被用户实测数据推翻（秘塔/豆包/千问均未引用知乎）。教训：**给建议前必须用用户或自己的实测数据验证，不要沿用国外经验推断中国生态。**
- [2026-08-21] 建议用户做"AI 智能体应用实战"定位，但用户指出体制内没有真实业务场景、无法持续输出。教训：**建议定位前先考虑用户的资源约束和持续输出能力。**
- [2026-08-26] **写 GEO 文章时严禁伪造来源和张冠李戴**。第 2 课发现 zi-zu-duan-luo.md 把同一个 arXiv 链接（2311.09735）套在三个不同来源上（AutoGEO ICLR 2026 / Stanford 2025 / GEO Optimizer 项目），还编了 +25%/+23%/+10% 等无法当场核实的数字。教训：**没有当场核实出处的数字和来源，一律不写。宁可少写数字，不可造假来源。** 第 2 课的核心恰恰是"每个声明附可查证来源"，造假等于反教学。

## Decision Log

- [2026-08-23] **仓库目录按「文档性质」分层**：`cn/学习/`（计划+进度）+ `cn/知识库/`（大纲+规格+实体）+ `cn/知乎文章/`（流水产出，按日期命名如 `2026-08-23-第一篇.md`）+ `cn/网站文章/`（预留）。理由：文章会无限增长，资产类（不涨）与流水类（一直涨）必须分开，避免预览目录时被淹没。en/ 同构：`en/学习/` + `en/知识库/`。**约定：新产出的知乎/网站文章一律进文章目录，按日期前缀命名；跨层链接用相对路径 `../../`。**
- [2026-08-21] 部署方案选 **GitHub Pages + 自定义域名（阿里云/腾讯云注册）+ 免备案**。理由：零维护、免费、无需备案、自定义域名是 AI 实体的基础。中期若有国内收录需求再评估香港服务器。
- [2026-08-21] 建站用**手写纯静态 HTML**，不引入框架。理由：目标是让 LLM 读 HTML 而非给人看，静态 HTML 即最小充分方案；第一篇手写以理解本质，篇数增多后再评估 Astro 批量生成。
- **[2026-08-24] 自建极简文章框架（Markdown → Node.js 脚本 → HTML）**。理由：文章数量增多后手写 HTML 效率低，且多平台（网站/知乎/微信）需要统一源。不引入 Astro/Hugo 等外部框架，保持大道至简。首页用 AI 搜索对话替代终端命令和静态话题列表，搜索是对页面内嵌的文章 JSON 做客户端全文检索，新文章自动进入搜索结果。

### 行内批注工作流（2026-08-26 确定）

- **批注呈现风格 = 全部行内批注**（否决红笔对比块/混搭方案）。理由：长文用大块对比卡片会打断阅读、满屏红绿卡片切碎正文；行内批注让正文保持干净，句末角标点开才看详情，不点开就是普通文章。
- **批注写在 Markdown 源里**，用 ` ```annotate ` 代码块紧跟被批注段落后。build.js 自动处理：角标插到前一个 `</p>` 前，气泡跟在原 annotate 块位置。作者只管写 `lesson`/`rule`/`before`/`after`/`why` 字段。
- **两种批注形态**：带 diff（before/after + why）用于"改前改后"对比；纯说明型（只有 why，加 `simple` 类）用于点明"这句用了哪课方法"。
- **toggleAnno 单开模式**：打开一个关掉所有其他。角标和气泡用 ID 互查（`anno-N` / `anno-N-mark`），不依赖 DOM 相邻关系——同段落多批注时 `previousElementSibling` 会串位。
- 批注字段 YAML 风格：`key: value` 单行；多行值用 key 空行 + 缩进续行（parseAnnotateBlock 已处理）。
