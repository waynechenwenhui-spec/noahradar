// ==========================================================
// NOAH Content Radar · Prompt 模板库
// 所有"复制到Claude"按钮的 prompt 在这里统一管理
// 修改 prompt 只需要改这个文件,其他地方不动
// ==========================================================

const PLATE_NAMES = {
  connect: '连接全球华人的财富世界',
  market: '全球市场判断',
  dialogue: '观点现场',
  beyond: '财富之外',
};

const FUNCTION_NAMES = {
  acquire: '拉新内容',
  trust: '建立信任',
  warmth: '品牌温度',
  basic: '基础认知',
};

// ==========================================================
// 1. 选题生成脚本大纲(最核心)
// ==========================================================
export function buildTopicScriptPrompt(topic) {
  return `【任务】为诺亚海外 YouTube 频道生成详细脚本大纲

请加载 noah-youtube-ad-script 和 noah-brand-mindset 两个 Skill,基于以下选题,输出符合诺亚品牌三层心智 + YouTube 投流规范的完整脚本大纲。

【选题信息】
- 标题:${topic.title}
- 一级板块:${PLATE_NAMES[topic.plate] || topic.plate}
- 归属栏目:${topic.column}
- 内容功能:${FUNCTION_NAMES[topic.function] || topic.function}
- 建议形式:${topic.format}
- 优先级:${topic.priority}
- Hook 建议:${topic.hook}

【输出要求】
1. 脚本完整结构:Hook(3-5秒) → 核心论点铺陈 → 2-3 个论据段落 → 观点升华 → 品牌落点(CTA)
2. 口播稿直接可用,每句带预估时长标注
3. 画面建议(B-roll 拍摄/素材提示)标注在每段旁
4. 中英双语处理:按栏目实际风格(${topic.column}:${topic.column === '一周世界' || topic.column === 'Noya来了' ? '中文口播 + 英文字幕' : '视需要决定语种'})
5. 金句至少 2 条,适合做视频金句卡片二次传播
6. 符合诺亚品牌三层心智的层级标注(认知层/信任层/认同层),每段注明属于哪一层

【禁忌】
- 不使用任何具体投资建议/收益率数字
- 不点名任何竞品机构
- 不使用小格局词汇(如"小钱""发财"等)
- 严格遵循 noah-brand-mindset Skill 的四大信任支撑点表述

请开始输出。`;
}

// ==========================================================
// 2. 今日早报 → 立即生成内容物料包
// ==========================================================
export function buildBriefingPackagePrompt(briefing) {
  return `【任务】基于今日热点新闻事件,一次性生成完整的诺亚 YouTube 内容物料包

请加载 noah-youtube-ad-script、noah-brand-mindset、noah-ai-brand-marketing 三个 Skill。

【新闻事件】
- 事件:${briefing.title}
- 背景:${briefing.summary}
- 热度:${briefing.heat}/100
- 诺亚视角建议:${briefing.noahAngle}
- 建议形式:${briefing.format}
- 建议栏目:${briefing.column}

【输出以下 6 件套】

## 1. 主视频脚本(${briefing.format})
完整口播稿 + 画面建议 + 时长标注

## 2. 封面标题 A/B/C 三版
- A 版:金句型(有记忆点)
- B 版:悬念型(激发点击)
- C 版:数据型(专业感)

## 3. YouTube 视频描述(SEO 优化)
前 3 行关键摘要 + 完整描述 + hashtag 组合

## 4. 跨平台同步物料
- X/Twitter 推文(英文,140字内)
- LinkedIn 帖文(英文,专业调性,200-300字)
- 小红书 / 微信视频号 简中版本(适配对应平台调性)

## 5. 金句卡片文案(3条)
适合做成海报由员工转发朋友圈

## 6. 内部群刷文案(3版)
用于发布后推动员工转发,参考 noah-brand-mindset 里的语言调性

请开始输出。`;
}

// ==========================================================
// 3. 新闻 → 基于此新闻策划选题
// ==========================================================
export function buildNewsToTopicPrompt(news) {
  return `【任务】基于这条财经新闻,为诺亚海外 YouTube 策划 3 个可执行选题

请加载 noah-brand-mindset Skill,确保选题符合诺亚品牌定位。

【新闻信息】
- 标题:${news.title}
- 来源:${news.source}
- 发布时间:${news.time}
- 热度:${news.heat}/100
- 诺亚契合度:${news.match}/5
- 分类标签:${news.tag}

【输出要求】
为这条新闻生成 3 个差异化选题,每个选题包含:

1. **选题标题**(口播体,可直接用)
2. **一级板块归属**(连接全球华人的财富世界 / 全球市场判断 / 观点现场 / 财富之外)
3. **栏目归属**(诺亚12个栏目之一:全球华人财富观察/品牌广告/我们是谁/品牌故事/与世界同行/一周世界/诺亚CIO观察/Noya来了/诺亚对话/人物与判断/听见世界/世界与家/向善而行)
4. **内容功能**(拉新/建立信任/品牌温度/基础认知)
5. **建议形式**(Shorts 30s / 中视频 3-5min / 深度长片 8-12min)
6. **切入角度**(这个选题与其他两个的差异化是什么)
7. **Hook 一句话**(视频开头前 5 秒要说什么)
8. **NOAH 适配度自检**(按选题判断四问回答)

三个选题之间要明显区分:一个主打专业深度、一个主打拉新传播、一个主打人文温度,不要重复。

请开始输出。`;
}

// ==========================================================
// 4. 日历节点 → 展开 5 个切入角度
// ==========================================================
export function buildCalendarAnglesPrompt(event) {
  return `【任务】为这个时间节点,展开 5 个诺亚海外 YouTube 的内容切入角度

请加载 noah-brand-mindset Skill。

【节点信息】
- 日期:${event.date}(距今 ${event.daysAway} 天)
- 节点类型:${event.layer}
- 节点名称:${event.title}
- 节点背景:${event.desc}
- 是否诺亚高适配:${event.noah ? '是' : '否'}

【输出要求】
展开 5 个差异化切入角度,每个角度包含:

1. **角度名**(一句话概括这个切入方向)
2. **适合栏目**(诺亚12个栏目之一)
3. **建议形式**(Shorts / 中视频 / 深度长片)
4. **完整选题标题**(口播体)
5. **Hook 建议**(开头怎么说)
6. **该节点的历史爆款参考**(其他机构或媒体在类似节点做过什么引发传播的内容,可供借鉴)
7. **诺亚独有视角**(与其他机构相比,诺亚应该怎么差异化)

5 个角度要覆盖不同维度:宏观/人物/故事/数据/哲思。

最后输出一个**优先级建议**:如果只做一条,推荐做哪个?为什么?

请开始输出。`;
}

// ==========================================================
// 5. 竞品视频 → 深度分析
// ==========================================================
export function buildCompetitorAnalysisPrompt(comp) {
  return `【任务】对这条竞品 YouTube 视频做深度分析,判断诺亚的应对策略

请加载 noah-ai-brand-marketing 和 noah-brand-mindset 两个 Skill。

【竞品视频信息】
- 账号:${comp.account}
- 视频标题:${comp.title}
- 发布时间:${comp.time}
- 时长:${comp.duration}
- 播放量:${comp.views}
- 互动率:${comp.rate}
- 是否爆款:${comp.viral ? '是(互动率超账号均值)' : '否'}
- AI 初步摘要:${comp.aiSummary}
- 初步判断:${comp.overlap}

【输出要求】

## 一、内容拆解
1. 这条视频的核心论点是什么?
2. 它的结构设计有什么特点?(开头/主体/结尾)
3. 它在卖什么"心智"?(用户看完会对该品牌产生什么印象)

## 二、爆款归因(如是爆款)
为什么这条超出该账号平均水平?标题? 选题? 人物? 时机?

## 三、竞争判断
1. 这是"偶然爆款"还是"系列化内容模板"?
2. 该账号近期内容是否围绕某个主题持续深耕?
3. 它侵占的是什么心智?与诺亚的定位冲突度多少(1-10)?

## 四、诺亚应对策略(3 选 1 + 理由)
选项 A:**直接对标**——用诺亚视角做同题材,输出差异化选题建议
选项 B:**反向差异化**——不做这个题,做它的对立面,输出差异化选题建议  
选项 C:**无视跳过**——不值得跟进,说明理由

## 五、如果选 A 或 B,给出完整的诺亚版选题方案
- 选题标题
- 栏目归属
- 差异化核心(一句话)
- Hook

请开始输出。`;
}

// ==========================================================
// 6. 每日雷达更新(在 Claude 里触发抓取的 prompt)
// ==========================================================
export const DAILY_CRAWL_PROMPT = `【任务】跑今天的诺亚内容雷达,输出新的 data.json

请按以下流程执行:

## 步骤 1:抓取宏观财经新闻
用 web_search 和 web_fetch 抓取以下源的最新内容,筛选出过去 24 小时最重要的 5 条:
- WSJ Economics
- FT Global Economy
- Reuters Business
- CNBC Economy
- Bloomberg Markets

## 步骤 2:抓取市场与资产新闻
同上流程,聚焦:美股/中概股重大波动、私募信贷、一级市场、加密、大宗商品 —— 筛选 5 条

## 步骤 3:抓取高净值华人关注
聚焦:香港/新加坡/迪拜家办政策、美国/英国/加拿大税务、移民政策、教育留学、身份规划 —— 筛选 6 条

## 步骤 4:抓取 12 家竞品 YouTube 最新视频
用 web_fetch 读取以下 RSS:
- Group A(5家):Arta Finance、Wealthsimple CN、老虎海外、富途海外、盈透华人
- Group B(7家):UBS、JPM Private Bank、Goldman Sachs、Morgan Stanley、Citi Private Bank、HSBC、DBS
(YouTube RSS 格式:https://www.youtube.com/feeds/videos.xml?channel_id=XXX)
筛选每家昨日~今日新发视频,按互动率判断爆款。

## 步骤 5:扫描未来 90 天日历
基于已知的全球财经日历(FOMC、财报季、股东大会)+ 全球品牌日历(节假日) + 诺亚选题黄金时点,输出未来 90 天关键节点。

## 步骤 6:基于以上所有数据,生成:
- 3 条今日必看(briefings)
- AI 原创选题池 6-8 个(topics) —— 对齐诺亚 12 个栏目
- 周度对标洞察(weeklyInsight)

## 步骤 7:输出完整的 data.json 文件
严格按照 /src/data/data.json 的 schema 格式输出,包括:
{
  "meta": { "lastUpdated": <当前时间ISO>, "version": "1.1.0", "sources": <数量>, "crawlStatus": "success" },
  "briefings": [...],
  "news": { "macro": [...], "market": [...], "chinese": [...] },
  "calendar": [...],
  "topics": [...],
  "competitors": [...],
  "weeklyInsight": {...}
}

## 输出格式
输出一个 JSON 文件(放在代码块里),我会复制并替换到 GitHub 仓库的 src/data/data.json,push 后网页自动更新。

请开始执行。`;
