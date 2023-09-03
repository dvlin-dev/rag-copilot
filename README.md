# docs-copilot
> 开发中
> 用户系统 刚从 typeorm 迁移到 prisma，未全量测试，应该有 bug

## 产品文档
[PRD](https://bowling00.notion.site/MVP1-0-4d6d9ccfab7c4ac784b3d9bc138d4e32?pvs=4)

## 如何本地开发
### client
配置好`.env` 参考 `.env.example`

```
pnpm install
npm run dev
```
### server

1. 安装 docker 后，执行 `docker-compose up -d`

2. 配置好`.env` 参考 `.env.example`

```
pnpm install 
npm run start:dev
```

