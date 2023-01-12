1. nest new [project-name]
2. cd ./[project-name]
3. npm i --save-dev webpack-node-externals run-script-webpack-plugin webpack
4. wbpack-hmr.config.js setting & add a module.hot in the main.ts
5. nest g resource .... users
6. npm install prisma --save-dev
7. npx prisma init
8. npm i --save @nestjs/config
9. ConfigModule setting in the app.module.ts
10. write ./prisma/schema.prisma
11. npm install @prisma/client
12. add ./src/common/prisma/\*
13. npm i -D @compodoc/compodoc
14. npx @compodoc/compodoc -p tsconfig.json -s ====> http://localhost:8080
15. health check -> npm install --save @nestjs/terminus: https://docs.nestjs.com/recipes/terminus
16. add ./common/core/heathCheck.core.ts ----> setting controller
17. swagger
18. npm install --save @nestjs/swagger ----> main.ts setting ----> http://localhost:3000/api : https://docs.nestjs.com/openapi/introduction
19. ./src/app.module.ts , RouterModule setting

npm install --save @nestjs/passport passport passport-local
npm install --save-dev @types/passport-local
npm install --save @nestjs/jwt passport-jwt
npm install --save-dev @types/passport-jwt

- OAuth2: https://betterprogramming.pub/spotify-oauth2-authentication-in-a-nestjs-application-307b25b2e49e
- https://velog.io/@yiyb0603/Nest.js%EC%97%90%EC%84%9C-Github-OAuth-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0
  nest g mo auth
  nest g s auth --no-spec
  nest g co auth --no-spec
  npm install @nestjs/passport @nestjs/jwt passport passport-jwt passport-spotify
  npm install -D @types/passport-jwt @types/passport-spotify

private prisma: PrismaService
