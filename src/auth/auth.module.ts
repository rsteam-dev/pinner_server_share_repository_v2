import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
    UsersModule,
    PassportModule,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    JwtService,
    UsersService,
    PrismaService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
