import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { OrthophotoMetaSearchController } from './orthophotoMetaSearch.controller';
import { OrthophotoMetaSearchService } from './orthophotoMetaSearch.service';

@Module({
  providers: [
    OrthophotoMetaSearchService,
    PrismaService,
    AuthService,
    JwtService,
    UsersService,
  ],
  controllers: [OrthophotoMetaSearchController],
  exports: [],
})
export class OrthophotoMetaSearchModule {}
