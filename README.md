# 发发福利 · **采 · Demo 与文档

在线访问（无需登录）：

| 内容 | 链接 |
| --- | --- |
| 买家端 Demo · Beta 0.3（一页融合） | https://feichenanyu.github.io/fafa-fuli-demo/ |
| 采发发 Agent Demo v0.1（福利 / 行政 / 办公三大应用 · 服务商 / 企业账号） | https://feichenanyu.github.io/fafa-fuli-demo/agent/ |
| 运营管理后台 Demo v1.3（采发发 Agent · 商品池筛选规则） | https://feichenanyu.github.io/fafa-fuli-demo/admin/ |
| **采 Demo v0.3（企业终端采购 · 发发福利 Agent UI） | https://feichenanyu.github.io/fafa-fuli-demo/bangbang/ |
| 文档中心 | https://feichenanyu.github.io/fafa-fuli-demo/docs/ |
| 前台 PRD v2.1（一页融合版） | https://feichenanyu.github.io/fafa-fuli-demo/docs/prd-frontend.html |
| 产品 Spec v2.1 | https://feichenanyu.github.io/fafa-fuli-demo/docs/spec.html |
| 运营管理后台 PRD v1.1 | https://feichenanyu.github.io/fafa-fuli-demo/docs/prd-admin.html |
| AI Prompt 设计 v2.1 | https://feichenanyu.github.io/fafa-fuli-demo/docs/prompt.html |
| **采 Spec v0.1 | https://feichenanyu.github.io/fafa-fuli-demo/docs/bb-spec.html |
| **采 PRD v0.1 | https://feichenanyu.github.io/fafa-fuli-demo/docs/bb-prd.html |
| **采 AI 选品 Prompt v0.1 | https://feichenanyu.github.io/fafa-fuli-demo/docs/bb-prompt.html |

Markdown 原文在 [`docs/`](docs/) 目录。



## 帮你采 · 企业采购 Agent（MVP Demo，评审用）

| 内容 | 链接 |
| --- | --- |
| 采购工作台 Demo（新建任务 / 老任务续接 / 采购订单 / 结算与发票 / 账户中心） | https://feichenanyu.github.io/fafa-fuli-demo/bangnicai/ |
| 方案汇报 H5 分享页（领导手机端） | https://feichenanyu.github.io/fafa-fuli-demo/bangnicai/report.html |
| 方案汇报 PPT · 摘要页 | https://feichenanyu.github.io/fafa-fuli-demo/bangnicai/slides.html |
| 运营后台（场景与引导词 / 商品池三级定价） | https://feichenanyu.github.io/fafa-fuli-demo/bangnicai/admin.html |

演示数据已内置：左侧「最近任务」有 4 个不同状态的老任务（追问中、待挑选、方案已生成、已下单），也可在首页新建任务；左下角铃铛为站内提醒。商品、价格、企业信息均为示例数据，Logo 待定。

## 最近更新（2026-10-29）

- 新增采发发 Agent Demo v0.1（基于 Beta 0.3 复制）：福利采购 / 行政采购 / 办公采购作为采发发 Agent 的三个业务应用；行政、办公应用带子场景、引导问句、池内商品与 AI 推荐清单
- 账号分服务商 / 企业两类：服务商先选「为哪个客户采购」，自动套用客户合规档案，方案带建议售价与利润，可用活动账户；企业账号只有预付款 + AI 积分，按企业会员价、无利润与合规档案；两类都需企业认证后下单
- 运营后台 v1.3：发发福利与**采合并为「采发发 Agent」模块（三大应用与子场景、热门运营场景、福利场景专区、应用设置），**采独立商品库下线，统一用商品池
- 商品池新增「筛选规则」页签（每池一套）：价格优惠（结算价 / 京东价）、品类、剔除关键词、剔除竞对品牌、商品金额、剔除不可售、发货方式，保存即生效并展示筛掉的商品与原因
- **采 Demo v0.3 与历史文档保持封板，未改动

## 最近更新（2026-10-27）

- 新增**采（企业终端采购）：独立商品库（自动上下架 + 定价规则，不区分商品类型）、三大应用（福利 / 行政 / 办公采购）+ 后台运营的子场景与热门场景、左菜单 + 中间 AI 工作流 + 右侧产出物三栏、仅预付款与 AI 积分
- 运营后台新增「**采」应用；顶栏业务线可切换
- 文档：**采 Spec / PRD / AI 选品 Prompt v0.1
- **采 v0.2：前台按发发福利 Agent UI 复原；中间工作流只有问答与澄清选项，下单 / 汇报 / 导出 / 重配全部在右侧执行；热门场景改为输入框下方竖排胶囊（标题写成用户的问题）；保留订单管理（按货源拆子单）、账号信息、企业认证、组织管理、企业信息、预付款管理、结算与账单

## 2026-10-21

- 买家端：页头常驻商品搜索框与搜索结果视图；下滑后 AI 对话框收为底部小对话框
- AI：先识别意图，采购需求 2–6 轮反问收窄（追问卡片 + 右侧需求画像），输出全部满足条件的 SKU，支持多选筛选与多选加购
- 后台：场景新增 AI 反问配置（目标规模、最多轮数、可反问维度）
- 文档：前台 PRD v2.1、后台 PRD v1.1、Spec v2.1、Prompt v2.1 同步更新
