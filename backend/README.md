# Backend Skeleton

当前后端为可运行的 Node 原型，用来承接前端未来改为真实 API 调用时的接口层。

它现在承担两件事：

1. 提供 `/api/*` 接口
2. 直接提供前端静态页面

## 当前结构

```text
backend
├── server.js
└── src
    ├── app.js
    ├── config.js
    ├── controllers
    │   ├── apiController.js
    │   └── staticController.js
    ├── lib
    │   └── http.js
    ├── repositories
    │   └── mockTravelRepository.js
    └── services
        └── travelApiService.js
```

分层职责：

1. `controllers` 负责路由分发与返回
2. `services` 负责接口层参数整理
3. `repositories` 负责当前的模拟数据访问
4. `lib` 负责通用 HTTP 能力

## 启动

```bash
npm run dev
```

默认端口：`3000`

## 当前接口

- `GET /api/health`
- `GET /api/meta`
- `GET /api/recommendations`
- `GET /api/routes/single`
- `GET /api/routes/multi`
- `GET /api/facilities`
- `GET /api/diaries`
- `GET /api/diaries/:id`
- `POST /api/diary-draft`
- `GET /api/foods`
- `GET /api/foods/:id`
- `GET /api/pois/:id`
- `GET /api/concert-plan`
- `GET /api/profile`
- `GET /api/team-room`

## 下一步

1. 把 `mockTravelRepository.js` 替换成真实数据库仓库
2. 增加 `controller / service` 层的单元测试
3. 接入地图与 POI API
4. 接入数据库
