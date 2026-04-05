---
name: kais-notion
description: 向 Notion 写入丰富多彩的富格式内容。激活条件：任何需要创建/写入 Notion 页面的任务（定时任务、研究报告、读书笔记、每日总结等）。涵盖 callout、toggle、彩色文字、表格、代码块等全部 Notion 原生块类型。
metadata:
  openclaw:
    emoji: 📝
    requires:
      bins:
        - notion-cli
        - python3
---

# Kais Notion — Notion 富格式写入指南

## 核心原则

1. **所有写入走 `notion-write.sh`**，禁止直接 `notion-cli block append --content`
2. **内容用 Markdown 编写**，由 `markdown-to-notion.py` 自动转换为 Notion 块格式
3. **每条信息必须有来源链接**，格式 `[描述](URL)`
4. **视觉层次分明**，善用 callout/toggle/color 让页面"好看"

---

## 📐 写入流程

```bash
# 1. 写 Markdown 内容到文件
cat > /tmp/content.md << 'EOF'
# 标题
>💡 摘要内容
...
EOF

# 2. 统一入口写入（自动转换格式）
bash /home/kai/.openclaw/workspace/scripts/lib/notion-write.sh <PAGE_ID> /tmp/content.md

# 3. 验证块数
notion-cli block list <PAGE_ID> | grep "Blocks ("
```

### 页面创建

```bash
# 创建空页面（禁止 --content 预填）
notion-cli page create --parent <PARENT_ID> --content "" --title "页面标题"
```

---

## 🎨 富格式语法速查

### Callout 高亮块

```markdown
>💡 普通提示（默认背景）
>⚠️ 警告信息（黄色背景）
>✅ 成功标记（绿色背景）
>❌ 错误信息（红色背景）
>🔥 头条新闻（红色背景）
>🚀 工具推荐（蓝色背景）
>🧠 深度思考（紫色背景）
>📈 增长数据（绿色背景）
>📉 下降数据（红色背景）
>💎 精华内容（紫色背景）
>🏆 成就展示（黄色背景）
>❓ 问题探讨（蓝色背景）
>📌 重要信息
>📝 笔记记录
>📢 公告通知
>ℹ️ 信息说明
>🔍 搜索提示
>📚 资源推荐
>🤖 AI 相关（灰色背景）
>🔒 安全相关（红色背景）
>✨ 亮点（黄色背景）
```

**适用场景**：
- 页面顶部摘要 → `>💡`
- 重要警告 → `>⚠️`
- 任务完成标记 → `>✅`
- 错误/问题记录 → `>❌`
- 章节核心观点 → `>💡` 或 `>🧠`

### Toggle 折叠块

```markdown
>📋 点击展开详细内容
>📂 展开查看附件
>📖 展开阅读全文
>🔍 展开查看详情
```

**适用场景**：补充材料、详细数据、次要信息、参考链接

### 彩色文字

```markdown
{red:警告文字}                 → 红色（负面/警告）
{blue:技术术语}                → 蓝色（技术/链接提示）
{green:增长数据}               → 绿色（正面/增长）
{purple:投资相关}              → 紫色（金融/深度）
{orange:重点强调}              → 橙色
{pink:标签}                    → 粉色

{red_background:重要警示}      → 红色背景
{yellow_background:注意事项}    → 黄色背景
{green_background:已验证通过}   → 绿色背景
{blue_background:技术详情}      → 蓝色背景
{purple_background:深度分析}    → 紫色背景
```

**颜色语义规范**：
| 颜色 | 含义 | 示例 |
|------|------|------|
| red | 负面/失败/下降 | 市值下跌 20% |
| blue | 技术术语/关键概念 | Transformer 架构 |
| green | 正面/增长/成功 | 营收增长 300% |
| purple | 投资/金融/深度 | 巴菲特致股东信 |
| yellow_background | 需要注意 | 未经证实 |
| red_background | 严重警告 | 安全漏洞 |
| green_background | 验证通过 | 测试通过 |

### 基础 Markdown（已支持）

```markdown
# 一级标题    → heading_1
## 二级标题   → heading_2
### 三级标题  → heading_3
**粗体**      → bold
*斜体*        → italic
`代码`        → inline code
[链接](url)   → 可点击链接
- 列表项      → bulleted_list
1. 有序列表   → numbered_list
> 普通引用    → quote（无 emoji 时）
- [ ] 待办    → to_do unchecked
- [x] 已完成  → to_do checked
---           → divider
```

### 表格

```markdown
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 数据 | 数据 | 数据 |
```

### 代码块

````markdown
```python
print("hello")
```
````

---

## 📋 内容结构模板

### 通用页面模板

```markdown
# [页面标题] - YYYY年MM月DD日

>💡 一句话摘要核心内容

## 🔥 核心要点

### [要点1标题]
- [要点1内容]([来源链接](URL))
  - 补充说明
- [要点2]({blue:技术术语})
  - 详细描述

## 💡 深度分析

>🧠 核心观点：这是最重要的洞察

[分析内容]

## 📊 数据/案例

| 指标 | 数据 | 变化 |
|------|------|------|
| XX   | XX   | {green:+XX%} |

## 📋 补充资料

>📋 点击展开详细参考信息

[补充内容]

---

**数据来源**: [来源1](URL) | [来源2](URL)
**生成时间**: YYYY-MM-DD HH:MM
```

### AIGC 前沿模板

```markdown
# AIGC前沿 - YYYY年MM月DD日

>💡 今日 AI 领域最值得关注的动态

## 🔥 头条新闻

### [新闻标题]([来源](URL))
>📌 核心信息
- 关键数据：{green:+XX%}
- 影响分析

## 💡 技术突破

## 🏢 产品发布

## 💰 商业动态

## 🎯 趋势观察

---

**数据来源**: [来源列表]
```

### GitHub Trending 模板

```markdown
# GitHub Trending - YYYY年MM月DD日

>💡 今日最热开源项目速览

## 🔥 Top 项目

### 1. [项目名](GitHub链接)
- **语言**: Python
- **今日增长**: {green:+1,234⭐}
- **项目作用**: 详细中文描述（3-5句）
- **亮点功能**: 功能1、功能2
- **适合人群**: 开发者/数据科学家/...

## 💡 技术栈分布

## 🎯 趋势观察

---

**数据来源**: GitHub Trending, Hacker News
```

### 读书笔记模板

```markdown
# 读书笔记 - YYYY年MM月DD日

>💡 今日深度阅读摘要

## 📖 文章1：[标题]([链接](URL))

>🧠 核心观点
- 要点1
- 要点2

>📋 详细笔记
[详细内容]

## 💡 今日收获

---

**数据来源**: [来源列表]
```

---

## ⚠️ 格式红线

### ✅ 必须
- 页面开头用 `>💡` 做摘要
- 每条新闻/数据有来源链接
- 底部有「数据来源」段落
- 使用 `---` 分隔各部分
- 关键数字用颜色标注

### ❌ 禁止
- `notion-cli block append --content "markdown"`（格式丢失）
- 裸 URL（必须用 `[描述](URL)`）
- 只写机构名不带链接
- "自动生成于..." 等占位符
- 空白页面（宁可少写也不要创建空壳）

---

## 🔧 工具链

| 工具 | 路径 | 用途 |
|------|------|------|
| notion-write.sh | `scripts/lib/notion-write.sh` | 统一写入入口 |
| markdown-to-notion.py | `scripts/lib/markdown-to-notion.py` | MD→Notion 块转换 |
| notion-create-page.sh | `scripts/lib/notion-create-page.sh` | 创建空页面 |
| notion-append-blocks-chunked.sh | `scripts/lib/notion-append-blocks-chunked.sh` | 大内容分块追加 |
| dedupe-validator.py | `scripts/lib/dedupe-validator.py` | 内容去重 |

---

## 📐 质量检查清单

写入后必须验证：

```bash
# 1. 块数检查
notion-cli block list <PAGE_ID> | grep "Blocks ("

# 判断标准：
# < 20 块：❌ 严重不足
# 20-50 块：⚠️ 偏短
# 50-100 块：✅ 合格
# > 100 块：✅ 优秀
```

- [ ] 顶部有 callout 摘要
- [ ] 使用 heading_2 分类
- [ ] 每条信息有来源链接
- [ ] 关键数据有颜色标注
- [ ] 底部有数据来源说明
- [ ] 块数 ≥ 50

---

*创建时间: 2026-04-05*
*基于实战经验总结，覆盖 callout/toggle/color/table/code 全部 Notion 块类型*
