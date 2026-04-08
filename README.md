# 个性化旅游系统

一个面向最终用户体验的旅游产品原型，当前以前端静态站点形式运行，适合直接上传到 GitHub 并通过 GitHub Pages 分享演示效果。

## 项目定位

本项目不是课程展示页，而是按产品思路组织的多页面网页系统。

当前已经完成：

1. 首页分发与任务入口
2. 发现目的地
3. 行程规划
4. 周边服务
5. 游记社区
6. 附近美食
7. 演出行程
8. 同行小队
9. 账户中心
10. 旅行档案

当前数据为本地模拟数据，用于验证交互流程、页面组织和模块联动。后续可继续接入地图 API、POI API 和数据库。

## 本地运行

在项目目录执行：

```bash
python3 -m http.server 8080
```

然后访问：

```text
http://localhost:8080/index.html
```

## 适合 GitHub 的原因

本项目当前是纯静态站点：

1. 不依赖后端服务
2. 不依赖数据库
3. 不依赖构建工具
4. 推到 GitHub 后可以直接部署到 GitHub Pages

仓库中已经包含：

1. `.gitignore`
2. `.nojekyll`
3. GitHub Pages 自动部署工作流：
   `.github/workflows/deploy-pages.yml`

## 发布到 GitHub

### 1. 初始化并提交

如果你还没有完成第一次提交，可以在项目目录执行：

```bash
git add .
git commit -m "feat: initial travel system prototype"
```

### 2. 关联你的 GitHub 仓库

把下面的地址替换成你自己的仓库地址：

```bash
git remote add origin https://github.com/你的用户名/你的仓库名.git
git branch -M main
git push -u origin main
```

### 3. 开启 GitHub Pages

到 GitHub 仓库页面：

1. 打开 `Settings`
2. 打开 `Pages`
3. 在 `Build and deployment` 中选择 `GitHub Actions`

之后每次推送到 `main`，GitHub 都会自动部署。

## 页面结构

```text
.
├── index.html
├── account.html
├── recommend.html
├── route.html
├── facility.html
├── diary.html
├── food.html
├── concert.html
├── team.html
├── profile.html
├── styles.css
├── src
│   ├── core
│   │   ├── algorithms.js
│   │   └── structures.js
│   ├── data
│   │   └── sampleData.js
│   ├── services
│   │   └── systemService.js
│   └── ui
│       └── pages.js
└── .github
    └── workflows
        └── deploy-pages.yml
```

## 后续接入建议

1. 在 `src/services` 中新增真实 API 适配层
2. 把内嵌示意地图替换成 Google Maps 或高德地图
3. 为“游记详情页”“餐厅详情页”“小队房间页”继续补二级页面
