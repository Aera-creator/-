# 个性化旅游系统

一个面向最终用户体验的旅游产品原型，当前已经具备本地完整前后端运行能力，同时也保留了适合 GitHub Pages 展示的静态前端结构。

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
11. 地点详情页
12. 游记详情页
13. 餐厅详情页
14. 小队房间页

当前数据为本地模拟数据，用于验证交互流程、页面组织和模块联动。后续可继续接入地图 API、POI API 和数据库。

## 本地运行

### 方式一：完整前后端模式

在项目目录执行：

```bash
npm run dev
```

然后访问：

```text
http://127.0.0.1:3000/index.html
```

这个模式下：

1. 页面由 Node 服务提供
2. 前端优先调用后端 API
3. 后端继续使用本地模拟数据

### 方式二：仅前端静态预览

在项目目录执行：

```bash
python3 -m http.server 8080
```

然后访问：

```text
http://localhost:8080/index.html
```

## 后端原型

项目中已经新增后端骨架，并且前端已接入 `apiClient`，能够优先通过后端接口获取数据，在接口不可用时自动回退到本地模拟逻辑。

启动方式：

```bash
npm run dev
```

默认地址：

```text
http://127.0.0.1:3000
```

后端入口文件：

- `backend/server.js`

后端说明：

- `backend/README.md`

## 适合 GitHub 的原因

本项目仍然适合发布到 GitHub Pages，因为：

1. 前端页面仍是纯静态文件
2. 不依赖数据库
3. 不依赖构建工具
4. 推到 GitHub 后可以直接部署到 GitHub Pages 做界面演示

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
├── package.json
├── backend
│   ├── README.md
│   └── server.js
├── src
│   ├── core
│   │   ├── algorithms.js
│   │   └── structures.js
│   ├── data
│   │   └── sampleData.js
│   ├── services
│   │   ├── apiClient.js
│   │   └── systemService.js
│   └── ui
│       └── pages.js
└── .github
    └── workflows
        └── deploy-pages.yml
```

## 后续接入建议

1. 把 `backend/server.js` 继续拆为 controller / service / repository
2. 把内嵌示意地图替换成 Google Maps 或高德地图
3. 接入真实数据库与外部 API
