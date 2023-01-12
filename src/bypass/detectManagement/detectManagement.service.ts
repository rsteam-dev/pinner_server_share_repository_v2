import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
@Injectable()
export class DetectManagementService {
  constructor(private PrismaService: PrismaService) {}
}
