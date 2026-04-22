# NOAH Content Radar · 诺亚海外内容监测中枢

> 服务于诺亚海外内容策划/编导团队的每日作战台
> 早上 5 分钟,获取今日选题方向、竞品动态、未来节点

---

## 🎯 产品定位

这不是一个新闻聚合器,而是一个**选题发生器** —— 每条信息都附带"诺亚可以怎么做"的内容建议。

**五大模块**:
- 🌅 今日早报 · 3 条今日必看
- 📰 重大新闻 · 宏观 / 市场 / 高净值华人三 Tab
- 📅 90 天日历 · 财经大事件 + 品牌节点 + 诺亚选题时点
- 🎬 选题生成器 · 对齐诺亚 12 栏目的 AI 选题建议
- 🏢 竞品动态 · YouTube 12 家机构每日新内容监测

**核心交互**:页面上每张卡片都有一个"复制 Prompt"按钮。点击后会把一段定制好的 Prompt 复制到剪贴板,你到 Claude 对话里粘贴,Claude 会:
- 生成完整脚本大纲
- 生成跨平台内容物料包
- 基于新闻策划 3 个差异化选题
- 展开日历节点的 5 个切入角度
- 深度分析竞品视频并给出应对策略

---

## 📁 项目结构

```
noah-radar-project/
├── index.html                  # 入口 HTML
├── package.json                # 依赖声明
├── vite.config.js              # Vite 配置
├── tailwind.config.js          # Tailwind 配置
├── postcss.config.js           # PostCSS 配置
└── src/
    ├── main.jsx                # React 入口
    ├── App.jsx                 # 主组件(页面主体)
    ├── index.css               # 全局样式
    ├── prompts.js              # 所有按钮的 Prompt 模板 ⭐
    └── data/
        └── data.json           # 所有动态数据(每日更新这个文件) ⭐
```

**重点关注两个文件**:
- `src/data/data.json` —— 每天更新这个文件,网页就会有新内容
- `src/prompts.js` —— 如果你想调整"点按钮生成什么 Prompt",改这里

---

## 🚀 第一次部署(10 分钟)

### 步骤 1:本地试跑

```bash
cd noah-radar-project
npm install       # 安装依赖(只需第一次)
npm run dev       # 启动本地开发服务器
```

浏览器会自动打开 http://localhost:5173,你先在本地确认页面正常。

### 步骤 2:推到 GitHub

1. 到 [github.com/new](https://github.com/new) 新建一个仓库,名字就叫 `noah-radar`
2. **把仓库设为 Private** (不要 Public,里面有你们的内容策略)
3. 按 GitHub 给出的命令把本地代码推上去:

```bash
cd noah-radar-project
git init
git add .
git commit -m "init: 诺亚内容雷达首次部署"
git branch -M main
git remote add origin https://github.com/你的账号/noah-radar.git
git push -u origin main
```

### 步骤 3:部署到 Cloudflare Pages

1. 打开 [pages.cloudflare.com](https://pages.cloudflare.com),用 GitHub 账号登录
2. 点 "Create a project" → "Connect to Git" → 选 `noah-radar` 仓库
3. 构建配置:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - 其他默认
4. 点 "Save and Deploy",等 1-2 分钟
5. 完成后会拿到一个链接:`https://noah-radar.pages.dev`,**这个就是团队访问的固定链接**

---

## 🔐 给链接加密码保护(建议做)

因为这个页面包含竞品监测和选题策略,不想被外人看到,有两个方案:

### 方案 A(推荐):Cloudflare Access

Cloudflare Pages 自带免费的 Access 功能:
1. 在你的 Cloudflare Dashboard → Zero Trust → Access → Applications
2. 添加一个 Self-hosted Application,指向你的 pages.dev 域名
3. 设置一个访问策略:只允许你指定的邮箱登录

访问时会先跳转到邮箱验证,验证通过后才能看到页面。**完全免费,50 人以内免费使用**。

### 方案 B:简单密码页

如果不想麻烦,我可以帮你在前端加一个简单的密码输入页(下次对话告诉我即可)。

---

## 🔄 日常使用工作流(每天早上 5 分钟)

### 每日刷新数据

1. **打开 Claude 对话**,说一句:
   > 跑今天的诺亚内容雷达

2. 或者 **打开部署好的网页** → 右上角点"手动刷新" → 把完整的抓取 Prompt 复制 → 粘贴到 Claude

3. Claude 会自动抓取(用 web_search 和 web_fetch):
   - 过去 24 小时宏观财经新闻
   - 竞品 12 家 YouTube 最新视频(通过 RSS)
   - 高净值华人相关政策动态
   - 未来 90 天重要节点
   - 并 AI 生成新的 6-8 个选题建议

4. Claude 输出一份**完整的新 `data.json`**

### 更新到网站(2 分钟)

拿到新的 data.json 后:

**最简单的方式(推荐)** —— 直接在 GitHub 网页上改:
1. 打开你的 `noah-radar` 仓库
2. 进入 `src/data/data.json`
3. 点右上角铅笔图标编辑
4. 全选删除旧内容,粘贴 Claude 给你的新 JSON
5. 点页面底部 "Commit changes"
6. Cloudflare Pages 会**自动重新部署**(1-2 分钟后,团队刷新网页就能看到新数据)

**命令行方式**(如果你习惯用 Git):
```bash
cd noah-radar-project
# 替换 src/data/data.json 内容
git add src/data/data.json
git commit -m "update: $(date +%Y-%m-%d) 数据更新"
git push
```

---

## 🎬 内容创作工作流(真正高频使用的场景)

编导小 A 的一个典型早晨:

```
09:00  打开 https://noah-radar.pages.dev
09:02  在"选题生成器"模块看到今日选题池,挑中一个
09:03  点卡片上的"生成详细脚本大纲"按钮 → 自动复制 Prompt
09:04  切换到 Claude 对话,粘贴、回车
09:05  Claude 输出完整脚本大纲(含 Hook、时长标注、画面建议、金句)
09:15  再追加一句"给我封面 A/B/C 三版 + YouTube 简介 + Hashtag"
09:18  Claude 输出完整物料包
09:20  把脚本发给主讲人准备录制
```

整个"选题 → 成稿"只用了 20 分钟。

---

## 🛠️ 常见维护操作

### 修改竞品监测名单

改 `src/data/data.json` 里的 `competitors` 数组。每条格式:
```json
{
  "account": "机构名",
  "title": "视频标题",
  "time": "昨日 18:30",
  "views": "42K",
  "rate": "4.8%",
  "viral": true,
  "aiSummary": "AI 对这条视频的摘要",
  "overlap": "诺亚覆盖状态",
  "platform": "YouTube",
  "duration": "8:32",
  "group": "B"
}
```

`group` 字段:`A` = 海外华人财富机构,`B` = 全球私行/财富品牌。

### 调整点击按钮生成的 Prompt

改 `src/prompts.js`。每个函数对应一个按钮:

| 函数名 | 对应按钮 |
|---|---|
| `buildTopicScriptPrompt` | 选题卡片的"生成详细脚本大纲" |
| `buildBriefingPackagePrompt` | 今日早报的"生成内容物料包" |
| `buildNewsToTopicPrompt` | 新闻条目的"策划选题" |
| `buildCalendarAnglesPrompt` | 日历节点的"展开 N 个角度" |
| `buildCompetitorAnalysisPrompt` | 竞品视频的"深度分析" |
| `DAILY_CRAWL_PROMPT` | 顶部"手动刷新"弹窗的抓取 Prompt |

改完 push 到 GitHub,Cloudflare Pages 自动重新部署。

### 修改诺亚 Logo

`src/App.jsx` 顶部的 `NOAH_LOGO` 常量是 base64 编码的图片。替换 base64 字符串即可。

### 修改颜色主题

所有主色都用了设计 token。如果想整体调色,用编辑器全局搜索替换:
- `#8B6F2A` = 主金色
- `#7A5D20` = 辅助金色
- `#1A1F2E` = 主文字墨色
- `#4A5268` = 次文字
- `#8A8578` = 辅助文字
- `#F7F3EA` / `#FDFBF5` = 两档象牙白背景

---

## ❓ 常见问题

**Q: 复制按钮不工作?**
A: 检查浏览器是否授予了剪贴板权限。Cloudflare Pages 的 https 域名下默认允许。

**Q: 网页打不开 / 空白?**
A: 打开浏览器 F12 控制台看报错。常见原因:`data.json` 格式错误(缺逗号、引号等)。用 [jsonlint.com](https://jsonlint.com) 校验一下。

**Q: 可以让非诺亚员工看到吗?**
A: 可以,把 Cloudflare Access 里添加外部邮箱即可。但建议只给内部团队。

**Q: 数据每天手动更新很麻烦,能不能全自动?**
A: 可以,但需要额外搭一个后端(Cloudflare Workers)+ 接 Claude API,月成本 ¥300-500。当前版本"手动触发"反而让你每天有个"主动感知选题"的仪式感,不一定是缺点。

**Q: 图片/竞品视频缩略图能显示真图吗?**
A: 当前原型用的是渐变占位图。如果要显示 YouTube 真缩略图,在 data.json 的 `competitors` 里每条加 `thumbnail: "缩略图URL"` 字段,我们下次迭代接入。

---

## 📞 迭代与支持

遇到问题、想加新功能、调整 Prompt 风格,直接在 Claude 对话里告诉我。这个项目的设计理念就是"让 AI 持续陪伴迭代"。

**版本**: v1.1.0
**最后更新**: 2026-04-21
