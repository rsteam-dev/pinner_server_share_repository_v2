import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import * as cookieParser from 'cookie-parser';
// import * as csurf from 'csurf';
import helmet from 'helmet';
import { AppModule } from './app.module';
// import { PrismaService } from './common/prisma/prisma.service';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // NestExpressApplication

  app.use(helmet()); // https://overcome-the-limits.tistory.com/743
  app.use(cookieParser());
  // app.use(csurf()); // https://github.com/expressjs/csurf#csurf

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    origin: [process.env.FRONT_ADMIN].concat(
      process.env.FRONT_EXTRA.split(',').map((s: string) => s.trim()),
    ),
  });

  // app.useWebSocketAdapter(new WsAdapter(app));

  // const prismaService = app.get(PrismaService);
  // await prismaService.enableShutdownHooks(app);

  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();

/**
 * encrypt-hashing: https://docs.nestjs.com/security/encryption-and-hashing
 */
