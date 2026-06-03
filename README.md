# Gaokao Volunteer AI Advisor

一个面向河南高考志愿填报场景的 AI 辅助推荐项目。这个仓库不是把真实全量招生数据直接公开，而是把项目整理成一个可开源、可演示、可继续产品化的工程样板。

它重点展示四件事：

- 如何把高考分数、位次、批次、专业、城市偏好和职业目标转成可解释的推荐结果。
- 如何用数据库承载招生计划、投档线、分专业录取线和一分一段表，而不是把数据硬写进前端代码。
- 如何让大模型只做“解释、对比、规划”，不越权编造候选院校和录取数据。
- 如何记录一次国内部署探索，包括 Tencent Cloud / CloudBase 的踩坑、费用意识和后续改进。

## 当前定位

这是一个作品集友好的公开仓库骨架。

真实项目里的完整河南招生数据、商业下载数据、API Key、访问码、云账号配置都不应该提交到 GitHub。本仓库只保留：

- 数据库 schema
- 样例数据
- 推荐算法 demo
- API demo
- 可审计的推荐证据字段
- 数据治理说明
- LLM 边界与防编造说明
- 产品案例说明
- 部署复盘文章

## 推荐发布方式

我建议分成两个载体发布：

1. GitHub 项目仓库：展示工程结构、代码、schema、README 和文档。
2. 博客/帖子文章：讲项目背景、产品判断、部署踩坑和复盘，比如发到掘金、知乎、公众号或个人博客。

这样比单纯丢一个网页链接更像“能做真实产品的人”：既能看代码，也能看你的思考过程。

## 项目结构

```text
.
├── README.md
├── docs/
│   ├── ARCHITECTURE.md
│   ├── BLOG_TENCENT_CLOUD_POSTMORTEM.md
│   ├── DATA_GOVERNANCE.md
│   ├── GITHUB_RELEASE_PLAN.md
│   └── PRODUCT_CASE_STUDY.md
├── schema/
│   └── postgres.sql
├── sample-data/
│   ├── admission_records.sample.json
│   └── rank_segments.sample.json
├── scripts/
│   └── import-plan.md
└── src/
    ├── api/server.js
    └── recommendation/ranking.js
```

## 快速运行

```bash
npm install
npm run dev
```

访问：

```text
http://127.0.0.1:8787/health
http://127.0.0.1:8787/api/recommend?score=450&rank=120000&subject=history&region=north
```

返回的是样例数据结果，不代表真实完整录取结论。

## 测试

```bash
npm test
```

当前测试覆盖：

- 推荐结果必须带 `evidence` 和 `warnings`
- 不允许推荐候选池外学校
- 支持调用方限制返回数量

## 为什么不提交全量数据

真实招生计划、分专业录取分数、商业平台下载数据可能涉及版权、授权、时效和隐私边界。公开仓库里直接提交全量数据，会给项目带来不必要的风险。

更好的做法是：

- GitHub 只提交 schema、导入方案、样例数据和脱敏文档。
- 真实 Excel / PDF / JSON 存放在私有数据盘或对象存储。
- 通过导入脚本写入数据库。
- 前端只请求后端 API，不加载全量数据文件。
- 大模型只基于后端筛选出的候选池做解释。

## 生产级演进方向

1. 用 PostgreSQL / Supabase / CloudBase Database 存真实数据。
2. 后端按分数、位次、科类、批次、地域偏好查询候选池。
3. 推荐算法输出冲稳保分层、推荐理由和风险提示。
4. LLM 接收候选池和用户画像，只做解释与人生模拟。
5. 增加访问码、次数限制、日志审计和缓存。
6. 前端保留小呆呆主题和移动端交互，但不再把数据写死在 JS 文件里。

## 相关文档

- [系统架构](docs/ARCHITECTURE.md)
- [数据治理](docs/DATA_GOVERNANCE.md)
- [LLM 边界与防编造](docs/LLM_BOUNDARIES.md)
- [腾讯云部署复盘](docs/BLOG_TENCENT_CLOUD_POSTMORTEM.md)
- [产品案例说明](docs/PRODUCT_CASE_STUDY.md)
- [GitHub 发布方案](docs/GITHUB_RELEASE_PLAN.md)
- [数据导入方案](scripts/import-plan.md)

## 免责声明

本项目仅用于志愿填报辅助、工程展示和产品原型验证。实际报考必须以河南省教育考试院、阳光高考、招生院校官方章程和当年正式招生计划为准。
