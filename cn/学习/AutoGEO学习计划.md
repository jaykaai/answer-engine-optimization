# AutoGEO 精通计划（从入门到精通）

> AutoGEO 是 ICLR 2026 接收的论文代码（arXiv 2510.11438），把"让 AI 引擎引用你"这件事从手工方法变成了自动化系统。
> 这是阶段一（47 种方法）和阶段二（原理深化）的**收束与升级**——你之前学的一切，在这套系统里都能找到对应的机器实现。
> 学习目标：吃透 AutoGEO 每一步**做了什么**、**怎么做的**、**为什么这么做**，能讲清整套系统从输入到输出的完整链路。
> 节奏：细水长流，一次学透一个概念，每课写一篇网站文章。

---

## 计划定位

### AutoGEO 是你之前所有学习的"收束点"

```
┌──────────────────────────────────────────────┐
│  阶段一：47 种方法（手工 GEO）               │
│  → AutoGEO 默认规则 = 这 47 种的机器版本     │
├──────────────────────────────────────────────┤
│  阶段二：原理深化（RAG/引用/偏好）           │
│  → AutoGEO 规则提取 = 把这些原理自动化挖掘    │
├──────────────────────────────────────────────┤
│  AutoGEO（本计划）：系统级收束                │
│  → 三组件 = 提取偏好 → 改写文档 → 训练专精模型  │
│  → GEO 分数 = 给"被引用"一个精确数学定义       │
└──────────────────────────────────────────────┘
```

### 三组件速览

| 组件 | 做了什么 | 怎么做的 | 为什么这么做 |
|---|---|---|---|
| 规则提取 | 从引擎自动挖出内容偏好规则 | 让 LLM 比较 doc_a/doc_b 谁被引用多→解释原因→提炼成规则 | 人猜不精确、不引擎特异、不领域特异 |
| AutoGEO_API | 用规则重写文档提升可见度 | 把规则格式化为 Quality Guidelines 拼进 prompt→调 Gemini-2.5-pro 重写 | prompt 工程，无需训练，即用即走 |
| AutoGEO_Mini | 训练 1.7B 小模型自动重写 | SFT cold start→GRPO 强化学习（reward=引用可见度） | API 贵且慢，训练完的小模型本地推理成本低 |

---

## 学习节奏（细水长流）

每课包含**两个层面**，缺一不可：

1. **为什么（原理）** — 这个组件/机制为什么存在、解决什么问题、底层动机是什么
2. **怎么做的（内部操作）** — AutoGEO 内部具体执行了什么步骤、调了什么 API、数据怎么流转、代码逻辑是什么

通用节奏：
1. **一次一课** — 每课一个概念，两个层面都覆盖
2. **读代码** — 每课对应 AutoGEO 的具体文件/函数，讲清代码内部逻辑
3. **写文章** — 每学透一课，写成网站文章（沉淀 + 专业度证明）
4. **回扣 jiyou.site** — 每课想：这对我的站意味着什么？
5. **理解验证** — 每课留一个理解性问题，答对才进下一课

---

## 阶段 A：全局认知（入门）

> 目标：理解 AutoGEO 整体做了什么，三组件怎么协作，能讲清完整链路。

### 课 A1：AutoGEO 要解决什么问题——从手工 GEO 到自动化 GEO
**为什么**：
- 47 种手工方法的三个缺陷：人工猜规则（不精确）、不引擎特异、不领域特异
- AutoGEO 的核心主张：让机器从引擎自动提取偏好，而非人猜
- 论文标题解读："What Generative Search Engines Like and How to Optimize Web Content Cooperatively"——"Cooperatively"是关键词，让引擎自己告诉你它喜欢什么
**怎么做的**：
- AutoGEO 把"发现偏好"变成自动化管道：给 LLM 看两个文档版本→问它为什么偏好 A→提炼规则→用规则重写
- 三个组件分工：规则提取负责"发现偏好"，AutoGEO_API 负责"用偏好改写"，AutoGEO_Mini 负责"训练模型自动改写"
- 整条链路的输入输出：原始文档→规则提取→规则集→改写文档→（评估可见度提升）
**代码**：`AutoGEO/README.md` Overview
**回扣**：你之前学的 47 种方法 ≈ AutoGEO 默认规则的手工版本
**理解验证**：用你自己的话讲清 AutoGEO 与阶段一手工方法在"怎么发现偏好"上的根本区别

### 课 A2：三组件架构——数据怎么流转的
**为什么**：
- 为什么需要三种方案而非一种：API 便宜但每次重写都要调大模型；Mini 贵训练但推理便宜；规则提取是两者的基础
- 为什么规则提取是第一步：没有规则，API 不知道用什么 guidelines，Mini 没有训练信号
**怎么做的**：
- 完整数据流：数据集（doc_a/doc_b + query）→ 规则提取（LLM 比较→解释→提炼规则）→ merged_rules.json → AutoGEO_API（规则格式化→拼 prompt→调 Gemini 重写）/ AutoGEO_Mini（规则当 reward 信号→SFT+GRPO 训练）
- 三组件的输入输出精确边界：每个组件吃什么、吐什么
- config.py 怎么组织数据集路径（DATASET_CONFIGS 映射每个数据集的 data_dir/train_dir/test_dir/rl_dir + 各种文件路径）
**代码**：`AutoGEO/README.md` + `autogeo/config.py`
**理解验证**：画出三组件数据流图，标注每个组件的输入和输出

### 课 A3：三个数据集与三个引擎——为什么规则是"引擎×领域"特异的
**为什么**：
- 三个数据集的差别：Researchy-GEO（学术内容）、E-commerce（商业产品）、GEO-Bench（Princeton 基准）
- 三个引擎的偏好差异：Gemini 爱 self-contained unit，GPT 爱 atomic units，Claude 爱 cohesive narrative flow
- 为什么不同引擎偏好不同：训练数据不同、对齐方式不同→引用习惯不同
- 为什么规则不能通用：9 组规则（3×3）每组合都不同，证明偏好是引擎×领域交叉特异的
**怎么做的**：
- `_get_default_rules(dataset, engine_llm)` 函数内部：根据传入的数据集和引擎名，返回对应的规则列表
- 9 组默认规则的具体内容：逐组讲清每条规则说什么
- 当用户没提供自定义规则文件时，`rewrite_document()` 降级调用这个函数获取默认规则
**代码**：`autogeo/rewriters/core.py` 的 `_get_default_rules()`
**回扣**：jiyou.site 面对的是哪个引擎？哪个领域？该用哪组规则？
**理解验证**：对比 Gemini-Researchy 和 Claude-Researchy 的默认规则，找出 3 个差异，解释为什么

---

## 阶段 B：吃透 GEO 分数（怎么量化"被引用"）

> 目标：理解 AutoGEO 怎么把"被引用"量化成数学分数——这是整套系统的根基，连 Mini 的 reward 都基于它。

### 课 B1：GEO 分数公式——可见度的数学定义
**为什么**：
- "被引用"不够精确——引用在第 1 句和第 50 句价值不同，引用 10 个词和 100 个词不同
- 需要一个分数同时考虑：词数（贡献多少）、位置（排第几）、引用频率（被引用几次）
- 为什么用指数衰减而非线性：模拟人类注意力衰减（越靠前的信息被看到概率越高）
- 归一化的意义：把绝对分数变成比例（所有引用源瓜分 100%），便于跨场景比较
**怎么做的**：
- `extract_citations_new(text)` 先把 AI 回答解析成嵌套结构：段落→句子→(tokens, 句子文本, 引用索引列表)
- `impression_wordpos_count_simple()` 遍历每个句子，对每个引用计算：`score = 词数 × exp(-i/(len-1)) ÷ 该句引用数`
- 词数只算长度 >2 的 token（过滤标点/短词）
- 引用频率除法：一句话被 [1][2] 两个源引用，分数对半分
- 最后归一化：每个源的分数 ÷ 总分 = 比例
**代码**：`autogeo/evaluation/metrics/geo_score.py` 的 `impression_wordpos_count_simple()` + `extract_citations_new()`
**回扣**：这给你"为什么答案优先段+信息密度高"一个精确的数学理由
**理解验证**：给定一个 3 句话、2 个引用源的例子，讲清每个源的分数怎么算出来的

### 课 B2：三种打分变体——词数、位置、词数×位置
**为什么**：
- 三个维度单独看都可被钻空子：只看词数→堆废话刷分；只看位置→一句话占位；只看频率→重复引用
- 所以主用结合版（wordpos），三个维度互相制约
- 但保留三种变体的价值：分析时可以拆开看"是词数贡献多还是位置贡献多"
**怎么做的**：
- `impression_word_count_simple`：`score = 词数 ÷ 引用数`（不看位置）
- `impression_pos_count_simple`：`score = 1 × exp(-i/(len-1)) ÷ 引用数`（不看词数，每个引用算 1 分）
- `impression_wordpos_count_simple`：`score = 词数 × exp(-i/(len-1)) ÷ 引用数`（两者结合）
- 三个函数代码结构几乎相同，只差 score 的计算公式
**代码**：同文件三个函数对比
**理解验证**：举一个"词数多但位置差"反而分数低的反例，讲清为什么

### 课 B3：引用解析——[n] 格式怎么被解析成结构
**为什么**：
- AI 回答里的 `[1][2]` 引用标记是非结构化文本，要算 GEO 分数必须先解析成结构
- 解析成"段落→句子→引用索引"的嵌套结构，才能按句子粒度算位置和词数
- "引用幻觉"问题：LLM 可能编造不存在的引用编号（如只有 5 个源但标了 [99]），需要静默跳过
**怎么做的**：
- `extract_citations_new(text)`：先用 `\n\n` 分段落→nltk sent_tokenize 分句子→对每句提取引用
- `ecn(sentence)`：用正则 `\[[^\w\s]*\d+[^\w\s]*\]` 匹配 `[1]` `[12]` 等标记→提取数字→返回引用索引列表
- 越界引用处理：`try: scores[cit] += score except: pass`——越界引用被静默跳过，不报错
**代码**：`geo_score.py` 的 `extract_citations_new()` + `ecn()`
**理解验证**：给一段带 `[1][2]` 引用的文本，讲清解析后的嵌套结构长什么样

### 课 B4：GEU 分数——可见度之外还有"实用性"
**为什么**：
- 只优化可见度会变成 spam（堆关键词骗引用）——被引用了但回答质量差，引擎会降权
- GEU（Generative Engine Utility）衡量"回答好不好"：引用质量、关键点覆盖、回答质量
- AutoGEO 同时优化两者：既要被看见（GEO），也要对用户有用（GEU）
- 这是你跟"纯 SEO 黑帽"的分界线
**怎么做的**：
- GEU 三维怎么算：引用质量（引用的内容是否准确相关）、关键点覆盖（回答是否覆盖了查询的核心要点）、回答质量（回答的整体质量）
- 评估时加 `--need_geu_score` 标志就会同时算 GEU
- geu_score.py 是最大文件（886 行），因为三维评估涉及更多 LLM 调用和判断逻辑
**代码**：`autogeo/evaluation/metrics/geu_score.py`（选读关键函数签名和逻辑）
**回扣**：这就是你跟"纯 SEO 黑帽"的分界线——你不只刷可见度，还保证回答质量
**理解验证**：用 200 字讲清 GEO 分数和 GEU 分数的区别与联系

---

## 阶段 C：规则提取机制（怎么自动发现偏好）

> 目标：理解 AutoGEO 怎么让机器自动"发现"引擎偏好——从 pairwise 比较到可复用规则集的完整管道。

### 课 C1：规则提取的核心思路——从 pairwise 比较中学习
**为什么**：
- 人猜规则的瓶颈：靠观察归纳，不精确、不引擎特异
- pairwise 比较的优势：给 LLM 看两个版本，问"为什么偏好 A"——直接从引擎本身获取偏好信号
- 这比人猜强在哪：数据驱动（从真实比较中来）、引擎特异（针对具体引擎）、可迭代（换引擎就重新提取）
**怎么做的**：
- 准备两个文档版本（doc_a, doc_b）+ 一个查询
- 让 LLM 用这两个文档当引用源回答查询→看哪个被引用得多（winner）
- 问 LLM："你为什么更爱引用 winner？"→ 得到解释文本
- 把解释文本喂进 `get_rule_extraction_prompt()`→ LLM 提炼成可复用规则（如 "The document should directly address the core question posed by the user query."）
**代码**：`autogeo/rules/extractor.py` 的 `get_rule_extraction_prompt()` + `get_extracted_rules()`
**回扣**：你之前学的 47 种方法就是"人猜的规则"，AutoGEO 把它变成"机器从 pairwise 比较中提取"
**理解验证**：讲清 pairwise 比较的完整流程（输入什么→中间发生什么→输出什么）

### 课 C2：提取 prompt 的设计——few-shot 与格式约束
**为什么**：
- few-shot 示例的作用：教 LLM 输出格式（JSON 数组），否则 LLM 可能输出散文
- "objective and deterministic principles"——要求规则客观可复用，不是主观感受
- 禁止 markdown 代码块：减少解析干扰
**怎么做的**：
- prompt 结构：[Instruction]（任务说明+few-shot 示例）→ [Explanation]（LLM 的解释文本）
- few-shot 示例格式：`["The document should directly address the core question posed by the user query."]`——展示期望的 JSON 数组格式
- 要求返回 JSON 数组，不用 ```json``` 代码块
- winner_name 根据 doc_a/doc_b 动态填入 "Document A" / "Document B"
**代码**：`extractor.py` 的 `get_rule_extraction_prompt()` 逐行讲
**理解验证**：讲清 prompt 的三部分（Instruction + few-shot + Explanation）各起什么作用

### 课 C3：JSON 稳健解析——LLM 输出从不规整
**为什么**：
- LLM 输出的 JSON 经常不规整：带 markdown 代码块、引号未转义、混入解释文本
- 标准 `json.loads()` 遇到这些就崩，需要稳健的解析逻辑
- 这是通用工程经验：任何用 LLM 输出结构化数据的项目都要处理这个问题
**怎么做的**：
- `_fix_json_string()` 用逐字符状态机处理未转义引号：跟踪 in_string 状态，遇到引号看上下文判断是"闭合引号"还是"值内引号"
- 三层降级策略：①`_fix_json_string` 修复后 `json.loads()` ②正则 `r'"([^"\\]*(\\.[^"\\]*)*)"'` 提取字符串 ③返回空数组 `[]`
- 去除 markdown 代码块：strip 开头的 ```json 或 ```，结尾的 ```
**代码**：`extractor.py` 的 `_fix_json_string()` + `get_extracted_rules()`
**回扣**：你在客户项目里用 LLM 输出时也会遇到同样问题——这是通用工程经验
**理解验证**：讲清三层降级策略的顺序和每层做什么

### 课 C4：规则合并——从单条规则到规则集
**为什么**：
- 一次 pairwise 比较只产生几条规则，需要大量比较才能覆盖各种偏好
- 多次比较产生的规则有重复/相似，需要合并去重
- 最终产出的 `merged_rules.json` 是 AutoGEO_API 和 Mini 训练的输入
**怎么做的**：
- `extract_rules.py` 跑大量 pairwise 比较→每次提取规则→累积
- `merger.py` 负责合并：去重、过滤低质量规则、输出 `merged_rules.json`
- 输出格式：`{"filtered_rules": ["规则1", "规则2", ...]}`
- 规则文件存到 `data/{dataset}/rule_sets/{engine_llm}/merged_rules.json`
**代码**：`autogeo/rules/merger.py` + `autogeo/extract_rules.py`
**理解验证**：讲清从单次 pairwise 比较到最终 merged_rules.json 的完整管道

---

## 阶段 D：AutoGEO_API——改写文档（怎么用规则重写）

> 目标：理解 AutoGEO 怎么用规则重写文档——这是三组件中你最该吃透的，因为它是 prompt 工程的精华，也是变现最直接相关的。

### 课 D1：重写提示——GEO 本质的定义
**为什么**：
- 这段 prompt 定义了 GEO 的本质：**你是 source owner，目标是最大化你在 AI 答案里的可见度**
- 为什么是"source owner"视角而非"搜索引擎"视角：你改变不了引擎算法，只能改自己的内容
- 与 SEO 的根本区别：SEO 优化给搜索引擎爬虫看（排名），GEO 优化给 AI 的引用机制看（被引用）
**怎么做的**：
- `rewrite_document()` 的 user_prompt 模板核心句："You are given a website document as a source. This source, along with other sources, will be used by a language model (LLM) to generate answers to user questions, with each line in the generated answer being cited with its original source. Your task, as the owner of the source, is to rewrite your document in a way that maximizes its visibility and impact in the LLM's final answer, ensuring your source is more likely to be quoted and cited."
- 这个 prompt 做了三件事：①定义角色（source owner）②定义场景（LLM 会引用你的内容）③定义目标（最大化可见度）
- 根据是否有 Gemini API key，调 `call_gemini(user_prompt, model_name="gemini-2.5-pro")` 或 `call_hf_model`
**代码**：`autogeo/rewriters/core.py` 的 `rewrite_document()`
**回扣**：这就是你给客户做的事——以 source owner 身份优化他们的内容
**理解验证**：用这段 prompt 写一篇短文讲清"GEO 和 SEO 的根本区别"

### 课 D2：规则怎么进提示——Quality Guidelines 机制
**为什么**：
- 光说"最大化可见度"不够——LLM 不知道具体怎么做
- 规则提供具体可执行的 guidelines："用自足段落""结构化成原子单元"等
- 规则让重写从"模糊目标"变成"有约束的重写"
**怎么做的**：
- `_load_rules_from_file(dataset, engine_llm, rule_path)`：查找 `data/{dataset}/rule_sets/{engine_llm}*/merged_rules.json`，读取 `filtered_rules` 字段
- 规则格式化：`"- " + "\n- ".join(rules)` 拼成项目符号列表
- 拼进 user_prompt：规则列表作为 "Quality Guidelines" 部分附加到 prompt
- 无规则文件时降级：调 `_get_default_rules(dataset, engine_llm)` 获取 9 组默认规则之一
**代码**：`core.py` 的 `_load_rules_from_file()` + `rewrite_document()`
**理解验证**：追踪一次 rewrite_document 调用的完整数据流（输入文档→加载规则→格式化→拼 prompt→调 LLM→输出）

### 课 D3：9 组默认规则——引擎×领域偏好的实证
**为什么**：
- 9 组规则是 AutoGEO 论文的核心实证发现：不同引擎+不同领域的偏好确实不同
- 这证明"通用 47 条方法"是次优的——应该按引擎和领域分别优化
- 默认规则是"没有提取规则时的 fallback"，但也是论文手工归纳的最佳实践
**怎么做的**：
- 逐组讲 9 组默认规则（3 数据集 × 3 引擎）的具体内容
- 对比模式：Gemini 爱 "Present information as a self-contained unit"，GPT 爱 "Structure content into atomic units"，Claude 爱 "Ensure a cohesive narrative flow"
- 为什么不同引擎偏好不同：训练数据/对齐方式不同→引用习惯不同
**代码**：`core.py` 的 `_get_default_rules()` 全读
**回扣**：jiyou.site 若主攻 Gemini，该优先遵守哪组规则？
**理解验证**：写表格对比 3 引擎在同一数据集上的规则差异，找出"最反直觉"的一条

### 课 D4：重写的完整流程——从输入到输出
**为什么**：
- 把 D1-D3 串起来，看清一次完整的"改写"从头到尾发生了什么
- 这是你讲给客户时最该讲清的——"我用 AutoGEO 给你改写文档时，内部发生了什么"
**怎么做的**：
- 输入：一段文档 + dataset + engine_llm 参数
- 步骤 1：`_load_rules_from_file()` 或 `_get_default_rules()` 获取规则列表
- 步骤 2：规则格式化为项目符号 `"- " + "\n- ".join(rules)`
- 步骤 3：拼进 user_prompt（角色定义+场景+目标+Quality Guidelines+原文档）
- 步骤 4：调 `call_gemini(user_prompt, model_name="gemini-2.5-pro")` 或 `call_hf_model`
- 步骤 5：返回改写后的文档
**代码**：`core.py` 的 `rewrite_document()` 完整流程
**理解验证**：用你自己的话讲清一次改写的 5 个步骤

### 课 D5：评估闭环——改写后真的提升了吗
**为什么**：
- 改写不等于提升——必须用 GEO 分数验证
- 评估闭环：原文（vanilla）vs 改写后（autogeo_api）的分数对比，数据说话
- 这是你给客户交付的核心证据："改写前 X 分，改写后 Y 分"
**怎么做的**：
- `python -m autogeo.evaluate --model vanilla`：用原文档让引擎回答查询→算 GEO 分数（baseline）
- `python -m autogeo.evaluate --model autogeo_api`：用改写后文档让引擎回答查询→算 GEO 分数
- 对比两个分数，看改写是否真的提升了可见度
- evaluate.py 的主流程：加载文档→调引擎回答→解析引用→算 GEO/GEU 分数→汇总输出
**代码**：`autogeo/evaluate.py`（344 行，读主流程）
**回扣**：你给客户交付时也要这个闭环——"改写前 vs 改写后"的分数对比就是交付物
**理解验证**：讲清评估闭环的完整流程（输入什么→中间发生什么→输出什么）

---

## 阶段 E：AutoGEO_Mini——强化学习训练（怎么训练模型自动 GEO）

> 目标：理解 SFT + GRPO 怎么训练一个"会自动 GEO"的小模型。本地无 A100 不能跑训练，但原理必须吃透——这是你跟客户讲"GEO 能自动化到什么程度"的底气。

### 课 E1：为什么需要 AutoGEO_Mini——API 方案的瓶颈
**为什么**：
- AutoGEO_API 每次改写都要调 Gemini-2.5-pro：贵（API 按 token 计费）、慢（网络延迟）、受限于 API（配额/限流/涨价风险）
- 训练一个 1.7B 小模型（Qwen）本地推理：成本低、速度快、不受外部 API 约束
- trade-off：训练贵（52h + 2× A100）但一次性，推理便宜且可无限次
- 什么规模值得训练 Mini：改写量大（如 10000+ 篇）时训练成本被摊薄
**怎么做的**：
- 训练三步走：cold start（SFT）→ GRPO（强化学习）→ 评估
- 用 AutoGEO_API 生成的改写结果当 SFT 训练数据（API 的输出变成 Mini 的教材）
- 最终模型发布到 HuggingFace，3 个检查点（E-commerce / GEO-Bench / Researchy-GEO for Gemini）
**代码**：`AutoGEO/README.md` 的 AutoGEO_Mini 章节
**理解验证**：算一笔账——什么规模的项目值得训练 Mini 而非用 API

### 课 E2：Cold Start（SFT）——先教模型"会改写"
**为什么**：
- SFT（Supervised Fine-Tuning）= 监督微调，用(原文, 改写后)对教模型学改写能力
- 为什么叫"cold start"：模型从零开始学改写能力，为后续 RL 打基础
- 为什么先 SFT 再 RL：直接 RL 从头训练不稳定，SFT 先给模型一个"基本会改写"的起点
**怎么做的**：
- 训练数据：`data/{dataset}/RL/finetune.json`——AutoGEO_API 生成的(原文, 改写后)对
- 用 LLaMA-Factory 框架训练：`bash run_cold_start.sh E-commerce`
- 关键超参：`learning_rate=5e-5`、`save_steps=1000`、`save_total_limit=1`、`save_only_model=true`
- 输出检查点：`outputs/{dataset}/cold_start`
- `loader/cold_start_data.py` 负责把原始数据转成 LLaMA-Factory 要求的格式
**代码**：`run_cold_start.sh` + `loader/cold_start_data.py`
**理解验证**：讲清 SFT 的训练数据怎么来的（API 生成）、训练用什么框架、输出什么

### 课 E3：GRPO 强化学习——用引用可见度当 reward
**为什么**：
- GRPO = Group Relative Policy Optimization（DeepSeek-R1 同款方法）
- reward 信号 = GEO 分数：改写后文档被引用的可见度提升=正奖励，下降=负奖励
- 为什么用 GRPO 而非 PPO：GRPO 不需要 value model（省一半显存），用组内相对排名代替绝对值估计
- 为什么 reward 用 GEO 分数：这直接对齐目标——训练出的模型就是"最大化可见度"的模型
**怎么做的**：
- 双 GPU 架构：GPU1 跑 vLLM serve（port 8000, tensor-parallel=1）作为推理服务器，GPU0 跑 accelerate Zero3 训练
- 训练循环：模型生成改写→vLLM 推理服务评估→算 GEO 分数→GRPO 更新策略→重复
- `run_grpo.sh` 脚本：先启动 vLLM serve，再跑 `accelerate launch --config_file zero3.yaml grpo.py`
- MODEL_PATH = `outputs/{dataset}/cold_start`（从 SFT 检查点继续训练）
- 输出：`outputs/{dataset}/grpo`
**代码**：`run_grpo.sh` + `autogeo/rewriters/mini.py`（471 行）
**回扣**：这就是"让 AI 自己学会 GEO"——reward 直接来自"被引用的可见度"
**理解验证**：画出 GRPO 训练循环图（生成改写→评估 GEO 分数→更新策略），讲清双 GPU 各干什么

### 课 E4：GRPO 数据管道——训练数据怎么准备
**为什么**：
- RL 训练数据和 SFT 数据根本不同：SFT 有标准答案（原文→改写后），RL 没有标准答案（只有 reward 信号）
- RL 数据是(输入, 多个候选改写, 各自 GEO 分数)——模型需要生成多个候选，用分数排序学习
- 这就是 GRPO 的"Group"——一组候选，组内相对排序
**怎么做的**：
- `grpo_input_file` / `grpo_eval_file` 的格式和用途
- `loader/grpo_data.py` 负责准备 RL 数据：把原始文档+查询组织成 GRPO 训练需要的格式
- config.py 的 DATASET_CONFIGS 里定义了每个数据集的 grpo 相关路径
- 对比 SFT 数据（finetune.json：有标准答案）vs RL 数据（grpo_input.json：只有输入和 reward 函数）
**代码**：`loader/grpo_data.py` + `config.py` 的 DATASET_CONFIGS
**理解验证**：讲清 RL 数据和 SFT 数据的根本区别（无标准答案 vs 有标准答案）

### 课 E5：从检查点到部署——模型生命周期
**为什么**：
- 模型训练完不是终点——要评估、发布、部署
- 评估用同一套 evaluate.py，只是 model 参数换成 autogeo_mini
- 发布到 HuggingFace 让其他人能用
**怎么做的**：
- cold_start 检查点 → GRPO 继续训练 → 最终模型在 `outputs/{dataset}/grpo`
- 评估：`python -m autogeo.evaluate --model autogeo_mini --model_path outputs/E-commerce/grpo --dataset E-commerce --engine_llm gemini-2.5-flash-lite`
- 发布：3 个检查点上传到 HuggingFace（E-commerce / GEO-Bench / Researchy-GEO for Gemini）
- 在线 Demo：https://huggingface.co/spaces/cx-cmu/AutoGEO_Mini
**代码**：README 的评估命令 + `evaluate.py`
**理解验证**：讲清从训练完到可用的完整流程（评估→发布→部署）

---

## 阶段 F：变现收束（把 AutoGEO 知识变成赚钱能力）

> 目标：把对 AutoGEO 的理解转化成可交付的客户服务。

### 课 F1：AutoGEO 原理 → 客户教育
**为什么**：
- "引擎偏好是可自动提取的"这个洞察是你区别于普通 SEO 顾问的专业权威
- "我用的方法来自 ICLR 2026 论文"是信任锚点——客户不懂论文，但知道"被顶级会议接收"=靠谱
**怎么做的**：
- 怎么把 AutoGEO 的三组件讲成客户能懂的话："我不靠猜，我让 AI 引擎自己告诉我它喜欢什么"
- 怎么用 GEO 分数给客户做现场 demo："你的内容现在在 AI 答案里可见度是 X 分"
- 客户教育文案的核心结构：痛点（你在 AI 答案里看不到）→ 方法（我从引擎提取偏好）→ 证据（论文+分数）
**理解验证**：写一段 300 字的客户教育文案，讲清"为什么你的 GEO 服务有科学依据"

### 课 F2：AutoGEO_API → 交付工具
**为什么**：
- 你能给客户交付的核心服务：用 AutoGEO 原理改写文档+分数对比报告
- 交付物必须可量化：改写前分数 vs 改写后分数，数据说话
**怎么做的**：
- "GEO 优化报告"模板结构：改写前 GEO 分数 + 改写后 GEO 分数 + 应用了哪些规则 + 前后 diff
- 报告怎么讲给客户听："你的内容被引用的概率从 X% 提升到 Y%，因为做了 Z"
- 这就是你用 AutoGEO 知识做咨询的核心交付物
**理解验证**：设计一份"GEO 优化报告"模板（改写前分数 + 改写后分数 + 应用的规则）

### 课 F3：AutoGEO 局限 → 诚实边界
**为什么**：
- AutoGEO 只覆盖 3 引擎 3 数据集——客户若问 Perplexity / 文心一言 / 豆包怎么办
- AutoGEO_Mini 需要的训练硬件小客户用不起
- 规则会随引擎更新而过时——引擎算法变了，旧规则失效，需定期重提取
- 诚实说边界比夸大承诺更能建立长期信任
**怎么做的**：
- 能交付的：Gemini/GPT/Claude 三个引擎的内容优化、GEO 分数评估、改写服务
- 不能交付的：Perplexity/文心一言等未覆盖引擎的精确规则、AutoGEO_Mini 训练（硬件门槛）、永久有效的规则（需定期更新）
- 针对"不支持的引擎"的替代方案：手工 A/B 测试+观察归纳
**理解验证**：列出你能交付的服务范围 vs 不能交付的范围

---

## 进度跟踪

| 阶段 | 课次 | 状态 | 完成日期 |
|---|---|---|---|
| A 全局认知 | A1-A3 | 待学 | |
| B GEO 分数 | B1-B4 | 待学 | |
| C 规则提取 | C1-C4 | 待学 | |
| D AutoGEO_API | D1-D5 | 待学 | |
| E AutoGEO_Mini | E1-E5 | 待学 | |
| F 变现收束 | F1-F3 | 待学 | |

---

## 学习产出

每课产出：
1. **原理理解** — 讲透这一课的"为什么"
2. **内部机制理解** — 讲清 AutoGEO 内部"怎么做的"
3. **一篇网站文章** — 沉淀 + 专业度证明

阶段终点产出：
- 能讲清 AutoGEO 三组件的协作原理和内部机制
- 能讲清 GEO 分数怎么算的、规则怎么提取的、文档怎么改写的
- 能讲清 SFT+GRPO 怎么训练出会 GEO 的小模型
- 能用 AutoGEO 原理设计客户 GEO 服务
- 一系列深度网站文章建立专业权威
