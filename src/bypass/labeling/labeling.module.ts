import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { LabelingController } from './labeling.controller';
import { LabelingService } from './labeling.service';

@Module({
  providers: [
    LabelingService,
    PrismaService,
    AuthService,
    JwtService,
    UsersService,
  ],
  controllers: [LabelingController],
  exports: [],
})
export class LabelingModule {}
