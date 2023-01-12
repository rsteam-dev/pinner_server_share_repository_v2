import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { DetectLearningManagementController } from './detectLearningManagement.controller';
import { DetectLearningManagementService } from './detectLearningManagement.service';

@Module({
  providers: [
    DetectLearningManagementService,
    PrismaService,
    AuthService,
    JwtService,
    UsersService,
  ],
  controllers: [DetectLearningManagementController],
  exports: [],
})
export class DetectLearningManagementModule {}
