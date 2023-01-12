import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { SystemManagementController } from './systemManagement.controller';
import { SystemManagementService } from './systemManagement.service';

@Module({
  providers: [
    SystemManagementService,
    PrismaService,
    AuthService,
    JwtService,
    UsersService,
  ],
  controllers: [SystemManagementController],
  exports: [],
})
export class SystemManagementModule {}
