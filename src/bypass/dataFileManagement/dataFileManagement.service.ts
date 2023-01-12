import { Injectable } from '@nestjs/common';
import { inspect, Prisma, work } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
@Injectable()
export class DataFileManagementService {
  constructor(private PrismaService: PrismaService) {}

  /**
  async getLabelPath(args?: {
    select?: Prisma.workSelect;
    where?: Prisma.workWhereInput;
    orderBy?: Prisma.Enumerable<Prisma.workOrderByWithRelationInput>;
    cursor?: Prisma.workWhereUniqueInput;
    take?: number;
    skip?: number;
  }): Promise<work[] | any[]> {
    const { select, where, orderBy, cursor, take, skip } = args;
    const result = await this.PrismaService.work.findMany({
      select: select,
      where: where,
      orderBy: orderBy,
      cursor: cursor,
      take: take,
      skip: skip,
    });
    return result;
  } */

  /**
  async getCheckPath(args?: {
    select?: Prisma.inspectSelect;
    where?: Prisma.inspectWhereInput;
    orderBy?: Prisma.Enumerable<Prisma.inspectOrderByWithRelationInput>;
    cursor?: Prisma.inspectWhereUniqueInput;
    take?: number;
    skip?: number;
  }): Promise<inspect[] | any[]> {
    const { select, where, orderBy, cursor, take, skip } = args;
    const result = await this.PrismaService.inspect.findMany({
      select: select,
      where: where,
      orderBy: orderBy,
      cursor: cursor,
      take: take,
      skip: skip,
    });
    return result;
  } */
}
