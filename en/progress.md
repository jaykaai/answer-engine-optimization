# AEO 学习进度

> 配套 [AEO学习计划.md](AEO学习计划.md)。每课授课在对话中进行，此文件仅记录进度与产出。

## 学员档案

| 项 | 内容 |
|---|---|
| 领域 | *待填写* |
| 内容阵地 / 技术栈 | *待填写* |
| 开始日期 | 2026-08-21 |

## 进度表

| 课次 | 主题 | 状态 | 作业 |
|---|---|---|---|
| W1-01 | 搜索引擎工作原理（Crawl/Index/Rank/**Generate**） | 已授课 | 待提交 |
| W1-02 | EEAT + 页面 SEO 要素 | 未开始 | — |
| W1-03 | 技术 SEO 与可抓取性 | 未开始 | — |

## W1-01 核心结论（复习用）

1. 四步模型：Crawl → Index → Rank → **Generate**。前三步决定能否被找到，第四步决定能否被引用。
2. AI 爬虫独立于 Googlebot：`OAI-SearchBot`、`PerplexityBot`、`ClaudeBot` 需在 `robots.txt` 单独放行。搜索类爬虫必须放行（那是引用，不是训练）；`GPTBot`（训练）放不放是商业判断。
3. **AI 爬虫不执行 JavaScript。** SPA 的内容在 AI 搜索里等于不存在。需 SSR/SSG。验证：`curl -s URL | grep "正文句子"`。
4. **AI 引用段落（chunk），不引用页面。** 优化单位从页面降到段落 → 排名第一 ≠ 被引用。
5. RAG 五步：Query Fan-out → Retrieval → Chunking/Extraction → Synthesis → Citation。

### W1-01 作业清单

- [ ] 作业 1：检查 3 个网站 robots.txt 的 AI 爬虫策略，分析新闻站 vs 科技站的差异
- [ ] 作业 2：对比 SPA 与 SSR 页面的原始 HTML，体会"AI 眼中的页面"
- [ ] 作业 3（关键）：同一问题在 Perplexity 的引用来源 vs Google 的自然排名，对比重合度
