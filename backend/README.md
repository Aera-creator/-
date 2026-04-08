# Backend Skeleton

当前后端为可运行的 Node 原型，用来承接前端未来改为真实 API 调用时的接口层。

它现在承担两件事：

1. 提供 `/api/*` 接口
2. 直接提供前端静态页面

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

1. 把 `src/services/systemService.js` 中的数据访问逻辑进一步拆为 `repository` 层
2. 接入地图与 POI API
3. 接入数据库
4. 为前端增加 `apiClient`，逐步替换本地直连服务调用
