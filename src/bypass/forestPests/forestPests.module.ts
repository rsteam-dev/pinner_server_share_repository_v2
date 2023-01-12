import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { ForestPestsController } from './forestPests.controller';
import { ForestPestsService } from './forestPests.service';

@Module({
  providers: [
    ForestPestsService,
    PrismaService,
    AuthService,
    JwtService,
    UsersService,
  ],
  controllers: [ForestPestsController],
  exports: [],
})
export class ForestPestsModule {}
