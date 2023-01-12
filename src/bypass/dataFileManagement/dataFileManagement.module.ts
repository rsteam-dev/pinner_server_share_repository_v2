import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { DataFileManagementController } from './dataFileManagement.controller';
import { DataFileManagementService } from './dataFileManagement.service';
@Module({
  providers: [
    DataFileManagementService,
    PrismaService,
    AuthService,
    JwtService,
    UsersService,
  ],
  controllers: [DataFileManagementController],
  exports: [],
})
export class DataFileManagementModule {}
