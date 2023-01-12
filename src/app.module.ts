import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { ApiModule } from './api/api.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ByPassModule } from './bypass/bypass.module';
import { EventsModule } from './events/events.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    AuthModule,
    UsersModule,
    ByPassModule,
    ApiModule,
    // EventsModule,
    // RouterModule.register([
    //   {
    //     path: 'auth',
    //     module: AuthModule,
    //   },
    //   {
    //     path: 'user',
    //     module: UsersModule,
    //   },
    // ]),
  ],
  controllers: [],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  ],
})
export class AppModule {}
