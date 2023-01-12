import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { DetectManagementController } from './detectManagement.controller';
import { DetectManagementService } from './detectManagement.service';

@Module({
  providers: [
    DetectManagementService,
    PrismaService,
    AuthService,
    JwtService,
    UsersService,
  ],
  controllers: [DetectManagementController],
  exports: [],
})
export class DetectManagementModule {}
