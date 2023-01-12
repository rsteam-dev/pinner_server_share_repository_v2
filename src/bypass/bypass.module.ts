import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { DataFileManagementModule } from './dataFileManagement/dataFileManagement.module';
import { DetectLearningManagementModule } from './detectLearningManagement/detectLearningManagement.module';
import { DetectManagementModule } from './detectManagement/detectManagement.module';
import { ForestPestsModule } from './forestPests/forestPests.module';
import { LabelingModule } from './labeling/labeling.module';
import { OrthophotoMetaSearchModule } from './orthophotoMetaSearch/orthophotoMetaSearch.module';
import { SystemManagementModule } from './systemManagement/systemManagement.module';
@Module({
  imports: [
    DataFileManagementModule,
    OrthophotoMetaSearchModule,
    LabelingModule,
    ForestPestsModule,
    DetectManagementModule,
    DetectLearningManagementModule,
    SystemManagementModule,
  ],
  providers: [PrismaService, AuthService, JwtService, UsersService],
  controllers: [],
  exports: [],
})
export class ByPassModule {}
