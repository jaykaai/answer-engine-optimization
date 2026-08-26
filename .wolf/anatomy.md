# anatomy.md

> Auto-maintained by OpenWolf. Last scanned: 2026-08-26T13:58:10.328Z
> Files: 39 tracked | Anatomy hits: 0 | Misses: 0

## ../../../../.claude/plans/

- `mighty-nibbling-rocket.md` — 计划：写完文章后一键 build + commit + push (~540 tok)

## ./

- `.gitignore` — Git ignore rules (~127 tok)
- `CLAUDE.md` — 项目定盘星，强制每次会话先读 (~72 tok)
- `package.json` — Node.js package manifest (~56 tok)
- `项目目标.md` — 项目目标（定盘星） (~308 tok)

## .claude/

- `settings.json` (~441 tok)

## .claude/rules/

- `openwolf.md` (~313 tok)

## cn/

- `学习计划.md` — GEO 学习计划（技术强化版） (~1151 tok)

## cn/学习/

- `学习进度.md` — 中国 GEO 学习进度 (~982 tok)

## cn/学习/（学习管理：计划 + 进度）

- `学习计划.md` — **中国 AEO 核心文档**。百度搜索 + 中国 AI 引擎（百度AI搜/秘塔/Kimi/豆包/通义千问等）的完整学习计划，8 周节奏 (~2155 tok)
- `学习进度.md` — 中国 GEO 学习进度（8步闭环状态表 + 全网资产清单） (~671 tok)

## cn/知乎文章/（内容产出：已发布/待发布到知乎的文章，按日期+标题命名）

- `2026-08-23-第一篇.md` — 知乎文章 · 第一篇（改写版） (~550 tok)

## cn/知识库/（沉淀资产：大纲、规格、实体建设）

- `全书大纲.md` — GEO 自学全书，从零到被 AI 引用的完整记录，作为出书/教程网站的基础 (~1687 tok)
- `可引用内容规格书.md` — 可引用内容规格书（中国版）v0.1，中国 AEO 施工图骨架，待侦察数据填充 (~261 tok)
- `实体建设清单.md` — 中国实体建设清单（知乎篇）：NAP 三原则，让 AI 拼图拼出同一个"纪优"实体 (~359 tok)

## cn/网站文章/

- `2026-08-22-geo-shi-shen-me.md` — GEO 和传统 SEO 有什么区别？ (~513 tok)
- `2026-08-23-ru-he-rang-bai-du-shou-lu.md` — 网站被百度收录要经过哪几个环节？ (~857 tok)
- `2026-08-23-structured-data-guide.md` — 什么是结构化数据？ (~841 tok)
- `2026-08-25-自足段落.md` — 为什么 AI 搜索引擎需要自足段落？ (~804 tok)
- `2026-08-26-让AI引用你.md` — 为什么 AI 引擎只引用带数字的段落？ (~536 tok)
- `写作指南.md` — 文章写作指南 (~1409 tok)

## cn/网站文章/（Markdown 源文件，`npm run build` 自动生成 site/）


## en/学习/

- `learning-plan.md` — **国外 AEO 核心文档**。Google + ChatGPT/Perplexity/Claude 等国际引擎的完整学习计划 (~3012 tok)
- `progress.md` — 国外 AEO 教学进度追踪 (~246 tok)

## en/知识库/

- `citeable-content-spec.md` — 从 Ahrefs/Semrush 实测得出的 AEO 规格 v0.1 (~1400 tok)

## scripts/

- `build.js` — 极简文章构建脚本 + 行内批注工作流（parseAnnotateBlock/renderAnnotate/processAnnotations 三函数，解析 ` ```annotate ` 块为角标+气泡） (~5648 tok)
- `deploy.js` — deploy.js — 一键部署脚本（build → 根仓库 commit/push → site 仓库 commit/push，自动生成 commit 消息） (~781 tok)

## site/

- `demo-annotation-inline.html` — 行内批注 Demo — 纪优 GEO (~2155 tok)
- `demo-annotation-styles.html` — 批注呈现风格 Demo — 纪优 GEO (~3041 tok)
- `demo-apple-style.html` — 演示页 — 苹果风格文章排版 (~2107 tok)
- `demo-terminal-agent.html` — 演示 · 宽屏终端 · AI Agent 风格 (~3688 tok)
- `index.html` — 纪优 — GEO 研究站 (~1877 tok)
- `robots.txt` — robots.txt — 全部爬虫放行，包括 AI 引擎爬虫 (~99 tok)
- `sitemap.xml` (~216 tok)
- `style.css` — Styles: 83 rules (~2863 tok)

## site/ (独立 GitHub Pages 仓库 jaykaai.github.io，不在本仓库跟踪)

- `index.html` — 纪优 — AI 智能体应用与 GEO 研究 (~359 tok)
- `robots.txt` — robots.txt — 全部爬虫放行，包括 AI 引擎爬虫 (~99 tok)
- `ru-he-rang-bai-du-shou-lu.html` — 新手站长问：网站怎么被百度收录？从注册域名到提交资源平台的完整步骤 (~1374 tok)
- `sitemap.xml` (~167 tok)

## site/articles/

- `geo-shi-shen-me.html` — 什么是生成式引擎优化（GEO）？和传统 SEO 有什么区别？ (~1532 tok)

## site/articles/（自动生成）

