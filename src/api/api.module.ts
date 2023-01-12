import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';

@Module({
  providers: [ApiService, UsersService, PrismaService, AuthService, JwtService],
  controllers: [ApiController],
  exports: [ApiService],
})
export class ApiModule {}
