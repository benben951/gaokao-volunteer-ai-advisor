# GitHub Release Plan

## 推荐策略

不要直接把 `gaokao_site_plus` 整个目录推上 GitHub。那个目录是工作现场，里面可能包含：

- `.env`
- 真实 API Key
- 访问码
- 云平台配置
- 大体积真实招生数据
- 多轮部署残留文件

更好的方式是发布当前这个整理后的仓库：`gaokao-volunteer-ai-portfolio`。

## 仓库命名建议

可选名称：

- `gaokao-volunteer-ai-advisor`
- `henan-gaokao-ai-advisor`
- `volunteer-admission-ai-demo`

如果偏作品集，推荐：`gaokao-volunteer-ai-advisor`。

## 公开版应该包含

- README
- 系统架构文档
- 数据治理文档
- 产品案例说明
- 腾讯云部署复盘
- 数据库 schema
- 样例数据
- 可运行 API demo
- 推荐算法代码

## 公开版不应该包含

- 真实全量河南招生数据
- 商业平台下载的数据文件
- DeepSeek Key
- Tencent SecretId / SecretKey
- Vercel Token
- 访问码
- 真实用户咨询记录
- 旧项目里的 `.env`
- 旧项目里的 `node_modules`

## 发布步骤

```bash
git init
git add .
git commit -m "Initial portfolio-ready gaokao advisor demo"
gh repo create gaokao-volunteer-ai-advisor --public --source=. --remote=origin --push
```

如果还不想公开，可以先建私有仓库：

```bash
gh repo create gaokao-volunteer-ai-advisor --private --source=. --remote=origin --push
```

## 发布前检查

```powershell
npm install
npm run dev
rg --no-ignore -n "sk-[A-Za-z0-9]{12,}|AKID[A-Za-z0-9]{12,}|SecretKey|vcp_[A-Za-z0-9]+" . -g "!node_modules/**"
```

确认：

- demo 能启动
- README 没乱码
- 文档链接可点
- 没有真实 Key
- 没有真实全量数据
- `.gitignore` 覆盖 `data/`、`raw-data/`、`.env`

## 作品集展示方式

GitHub README 里建议放：

- 项目背景
- 架构图
- API 示例
- 数据治理边界
- 腾讯云复盘链接
- 后续路线图

简历中可以写：

> 设计并实现高考志愿 AI 辅助推荐系统，完成招生数据建模、分数/位次推荐算法、LLM 咨询边界设计、人生路径模拟和国内云部署复盘。项目采用数据库优先架构，避免前端暴露全量数据，并沉淀数据治理与部署风险文档。

## 博客发布建议

可以从 `docs/BLOG_TENCENT_CLOUD_POSTMORTEM.md` 改成一篇文章，标题建议：

- 一个高考志愿 AI 小站的国内部署复盘
- 为什么“支持 Express”不等于一键上线
- 做给女朋友用的高考志愿网站，最后学到的是数据边界和部署成本

平台建议：

- 掘金：适合技术复盘
- 知乎：适合产品故事 + 技术路线
- 小红书：适合轻量展示产品，不放太多代码
- GitHub README：适合招聘方快速浏览

## 私有商业版怎么保留

另建一个私有仓库或保留本地目录，用来放：

- 真实数据导入脚本
- 访问码管理
- 真实生产环境配置
- 私有部署说明

公开版和私有版不要混在一起。

推荐结构：

```text
gaokao-volunteer-ai-advisor/        # 公开作品集版
gaokao-volunteer-ai-private/        # 私有运营版，不公开
```
