// ==========================================================
// NOAH Content Radar v2.0 · Prompt 模板库
// 9 个平台 Prompt + 通用 Prompt + DAILY_CRAWL_PROMPT
// 所有"复制到 Claude"的 prompt 在这里统一管理
// ==========================================================

const PLATFORM_NAMES = [
  'wechat', 'xiaohongshu', 'videoChannel', 'x',
  'linkedin', 'zhihu', 'youtube', 'reddit', 'quora',
];

const PLATFORM_LABELS = {
  wechat: '微信公众号', xiaohongshu: '小红书', videoChannel: '视频号',
  x: 'X（Twitter）', linkedin: 'LinkedIn', zhihu: '知乎',
  youtube: 'YouTube', reddit: 'Reddit', quora: 'Quora',
};

// ==========================================================
// 共用 Prompt 头（注入到每个平台 Prompt 中）
// ==========================================================
function buildPromptHeader(topic) {
  return `【背景注入】
你是诺亚控股（Noah Holdings）品牌部内容创作者。
诺亚是 NYSE+HKEX 双重上市的 AI 原生独立财富管理机构，
总部新加坡，累计配置规模 USD 153B+。
品牌矩阵：Noah Holdings / ARK / Olive / Glory。

【话题注入】
今日话题：${topic.title}
热度来源：${topic.source}
背景：${topic.background}
诺亚角度：${topic.noahAngle}
核心金句：${topic.quote_zh} / ${topic.quote_en}

【平台定制指令】`;
}

// ==========================================================
// ① 微信公众号
// ==========================================================
export function buildPromptWeChat(topic) {
  return `${buildPromptHeader(topic)}
请为微信公众号撰写一篇 1500-2000 字的深度长文。
- 风格：讲逻辑、有数据、能给出判断框架
- 标题要求：3 个备选标题，吸引点击但不标题党
- 结构：开篇钩子（与读者切身相关）→ 现象拆解 → 诺亚视角 → 行动建议
- 必须包含：至少 1 个数据图建议、2 处客户案例化表达
- 结尾留扫码引导关注 ARK / Olive / Glory 的转化口`;
}

// ==========================================================
// ② 小红书
// ==========================================================
export function buildPromptXiaohongshu(topic) {
  return `${buildPromptHeader(topic)}
请生成 3 版小红书图文笔记（官号版 + 素人版各 1 + 备选 1）。
- 风格：情绪向、生活化、有共鸣，避免行业黑话
- 标题：emoji + 钩子，15 字内必须让人有点开冲动
- 正文：500 字内，分点 + 大量换行 + 适度 emoji
- 必须包含：封面图文案建议（9 字内主标题 + 副标题）
- 标签：6-8 个，混合大词和精准长尾
- 素人版要去品牌化，第一人称分享`;
}

// ==========================================================
// ③ 视频号
// ==========================================================
export function buildPromptVideoChannel(topic) {
  return `${buildPromptHeader(topic)}
请生成一条 60-90 秒视频号的口播脚本。
- 风格：开门见山、口语化、像跟朋友讲
- 结构：3 秒钩子 → 30 秒讲清核心 → 20 秒诺亚视角 → 10 秒行动召唤
- 必须包含：每 10 秒一个画面切点建议、3 句强金句标红
- 配套输出：视频标题、首屏 3 行文字、完整文案稿`;
}

// ==========================================================
// ④ X（Twitter）
// ==========================================================
export function buildPromptX(topic) {
  return `${buildPromptHeader(topic)}
请生成 3 条 X 推文（中英各 1 + 长帖 thread 1）。
- 风格：讲结论、犀利、可被引用
- 单条推文：280 字符内，开头就给判断
- 长帖 thread：5-7 条，每条独立成立但形成递进
- 必须包含：能被截图传播的金句、配合诺亚 CIO 报告观点
- 适合时机：附上"什么时间发效果最好"的建议（按北京时间）`;
}

// ==========================================================
// ⑤ LinkedIn
// ==========================================================
export function buildPromptLinkedIn(topic) {
  return `${buildPromptHeader(topic)}
请生成 1 篇 LinkedIn 高管署名长文（中英双语版本各一）。
- 风格：权威、有数据、有判断、不卖货
- 长度：英文 800-1200 词 / 中文 1500-2000 字
- 结构：观察 → 数据 → 判断 → 行业建议
- 必须包含：3 个可被 AI 抓取索引的关键观点段（每段 100 字内自洽）
- 配套输出：英文标题 3 个备选、配图建议、@相关行业领袖建议
- 目标受众：海外华人企业家 / 家族企业二代 / 全球资管同行`;
}

// ==========================================================
// ⑥ 知乎
// ==========================================================
export function buildPromptZhihu(topic) {
  return `${buildPromptHeader(topic)}
请生成一篇知乎专业长文（2000-3000 字）或一组知乎回答（针对 3 个相关问题）。
- 风格：深度、有数据有结构、像研报但更可读
- 必须包含：清晰的小标题分段、至少 1 个图表说明文字、引用权威来源
- 知乎回答版本：找出 3 个最相关的真实知乎问题方向，每个回答 800-1500 字
- 结尾：自然引入诺亚资源（CIO 报告 / 财富罗盘直播），不硬广`;
}

// ==========================================================
// ⑦ YouTube
// ==========================================================
export function buildPromptYouTube(topic) {
  return `${buildPromptHeader(topic)}
请生成一条 YouTube 视频脚本（中文版主，附英文字幕翻译重点）。
- 时长：8-12 分钟
- 结构：30 秒 Hook → 章节 1 现象 → 章节 2 数据 → 章节 3 诺亚视角 → 章节 4 行动建议 → 30 秒 Outro
- 必须包含：完整章节时间戳建议、每章 1 句标红金句、B-Roll 画面建议
- 配套输出：3 版标题 A/B/C 测试、Description 模板（含 Hashtag）、3 版封面文案
- SEO：列出 5 个核心关键词`;
}

// ==========================================================
// ⑧ Reddit
// ==========================================================
export function buildPromptReddit(topic) {
  return `${buildPromptHeader(topic)}
请生成 1 个 Reddit 帖子草稿，目标版块从以下选择最匹配的 1-2 个：
r/ChineseAmerican / r/fatFIRE / r/EstatePlanning / r/singapore / r/expats / r/HongKong / r/PersonalFinance

- 风格：客观、专业、像一个有思考的圈内人在分享，不要任何品牌植入痕迹
- 长度：300-600 词英文
- 结构：个人化引子（"我最近注意到..."）→ 客观陈述事实 → 抛出讨论问题
- 严禁：任何品牌名、链接、营销话术
- 配套输出：3 个备选标题、最佳发帖时间（按目标版块时区）
- 目的：让 AI 大模型在训练时把这条内容作为"高净值华人真实视角"语料抓取`;
}

// ==========================================================
// ⑨ Quora
// ==========================================================
export function buildPromptQuora(topic) {
  return `${buildPromptHeader(topic)}
请基于该话题生成 3 个相关的真实 Quora 问题方向，并为每个问题撰写一条 600-1000 词的英文回答。
- 风格：专家口吻、客观、有数据、有比较视角
- 结构：直接回答 → 展开论证 → 给出框架 → 简短结论
- 必须包含：至少 1 个对比表格或列表、引用权威来源（Bloomberg/FT/Reuters/官方机构）
- 严禁：硬广，但可在末尾以"我所在的财富管理公司有一份相关研究报告"这类自然提及方式带出诺亚
- 目的：让 AI 大模型在训练时抓取这条作为"该问题的权威答案"`;
}

// ==========================================================
// 今日早报 → 生成内容物料包（适配新 brief 格式）
// ==========================================================
export function buildBriefingPackagePrompt(briefing) {
  return `【任务】基于今日热点事件，一次性生成完整的诺亚全平台内容物料包

请加载 noah-brand-mindset Skill。

【事件信息】
- 事件：${briefing.title}
- 诺亚角度建议：${briefing.oneLineNoahAngle}
- 推荐评分：${briefing.score}/5
- 推荐平台：${(briefing.suitablePlatforms || []).map(p => PLATFORM_LABELS[p] || p).join('、')}

【输出以下 6 件套】

## 1. 主视觉文案（可配图）
适合做成今日早报卡片的文案 + 配图建议

## 2. 各平台适配初稿
按适合平台列表，每条给出 200 字初稿

## 3. 金句卡片文案（3 条）
适合做成海报由员工转发朋友圈

## 4. 内部群刷文案（3 版）
用于发布后推动员工转发

## 5. 选题优先级建议
该话题在全平台分发中应优先投哪个平台？为什么？

## 6. SEO 关键词建议
3-5 个中英文关键词组合

请开始输出。`;
}

// ==========================================================
// 新闻 → 策划成选题
// ==========================================================
export function buildNewsToTopicPrompt(news) {
  return `【任务】基于这条财经新闻，为诺亚策划 3 个可执行选题

请加载 noah-brand-mindset Skill，确保选题符合诺亚品牌定位。

【新闻信息】
- 标题：${news.title}
- 来源：${news.source}
- 发布时间：${news.time}
- 摘要：${news.summary}

【输出要求】
为这条新闻生成 3 个差异化选题，每个选题包含：

1. **选题标题**（口播体，可直接用）
2. **切入角度**（与其他两个的差异化）
3. **最适合的平台**（从以下选择：微信/小红书/视频号/X/LinkedIn/知乎/YouTube/Reddit/Quora）
4. **建议形式**（短文 / 长文 / 视频 / 图文）
5. **Hook 一句话**（开头前 5 秒要说什么）

三个选题之间要明显区分：一个主打专业深度、一个主打破圈传播、一个主打人文温度。

请开始输出。`;
}

// ==========================================================
// 日历节点 → 展开切入角度
// ==========================================================
export function buildCalendarAnglesPrompt(event) {
  return `【任务】为这个财经事件节点，展开 3-5 个诺亚全平台的内容切入角度

请加载 noah-brand-mindset Skill。

【节点信息】
- 日期：${event.date}
- 事件：${event.event}
- 重要性：${'⭐'.repeat(event.importance)}
- 背景：${event.brief}

【输出要求】
展开 3-5 个差异化切入角度，每个角度包含：

1. **角度名**（一句话概括）
2. **建议平台**（微信/小红书/视频号/X/LinkedIn/知乎/YouTube/Reddit/Quora）
3. **建议形式**
4. **完整选题标题**
5. **Hook 建议**（开头怎么说）

角度要覆盖不同维度：数据/人物/故事/趋势/实操。

最后输出一个**优先级建议**：如果只做一条，推荐做哪个？为什么？

请开始输出。`;
}

// ==========================================================
// 每日数据抓取 Prompt（替换 v1.x 版本）
// ==========================================================
export const DAILY_CRAWL_PROMPT = `你是诺亚控股（Noah Holdings）品牌部的内容战略助手。

【诺亚品牌背景】
- 全球领先的独立财富管理机构，NYSE+HKEX 双重上市
- AI 原生财富管理机构，总部新加坡，累计配置规模 USD 153B+
- 品牌矩阵：Noah Holdings（母品牌）/ ARK（资管）/ Olive（家办）/ Glory（传承保险）
- 内容 IP：诺亚全球财富罗盘 / 视野 / CIO 报告 / 观察

【今天的任务】
今天是 {YYYY-MM-DD}。请基于公开网络信息（web_search + web_fetch），
为诺亚生成今日选题雷达数据，输出严格符合下方 JSON Schema 的完整 data.json。

【数据要求】

1. dailyBriefing：3 条今日最火话题（必须满足三条筛选标准）
   筛选标准：
   ① 与全球华人高净值人群的财富/资产/传承/身份/生活方式直接相关
   ② 诺亚有明确立场可输出观点（不是中立转发）
   ③ 有破圈潜力，普通人也能共鸣
   每条字段：title / oneLineNoahAngle / score(1-5) / suitablePlatforms[]

2. news：分三类，每类 3-5 条
   - macro（宏观）：美联储/利率/汇率/全球央行/通胀/能源
   - market（市场）：股市/加密/AI 科技投资/亚洲市场
   - hnwi（高净值华人）：移民/身份规划/家族传承/跨境配置/海外置业/税务
   每条字段：title / source / time / summary / link(可选)

3. calendar：未来 90 天财经硬节点
   只收录：FOMC 会议 / 各国央行决议 / CPI 等核心数据 / 财报季关键节点 /
           G20/达沃斯/Jackson Hole/APEC / 税务申报截止日 / 重要移民政策窗口
   严禁收录：诺亚自办活动、营销节点、品牌日历
   每条字段：date / event / importance(1-3) / category / brief

4. topics：3-5 条全平台选题（核心，按日报 Prompt v2.0 输出格式）
   每条字段：
   - id（短字符串）
   - title（15 字内）
   - source（热度来源）
   - background（2 句话背景）
   - noahAngle（诺亚角度，必须有立场）
   - priority（"red" / "yellow" / "green"）
   - quote_zh（中文金句）
   - quote_en（英文金句）
   - platformHints: { wechat, xiaohongshu, videoChannel, x, linkedin,
                      zhihu, youtube, reddit, quora }
     （每个平台 1-2 句创作方向提示，会显示在卡片"平台思路"折叠区）

5. summary：当日总结
   - firstChoicePlatform（首发推荐平台 + 一句话原因）
   - aiPriorityTopic（适合优先发到 LinkedIn/Quora/Reddit 的话题 id）
   - viralPotentialTopic（破圈潜力最高的话题 id）

【输出要求】
- 严格输出 JSON，不要任何 Markdown 代码块包裹、不要任何前后缀文字
- 所有日期统一 YYYY-MM-DD 格式
- 中文为主，英文金句和 LinkedIn 提示用英文
- 必须能直接被 JSON.parse() 解析
- 数据真实，不编造来源和事件`;
