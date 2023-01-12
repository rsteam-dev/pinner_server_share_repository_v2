import { Injectable } from '@nestjs/common';
import { label_group, Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { AddLabelGroupItemDto } from './dto/add-labelGroup.dto';
@Injectable()
export class LabelingService {
  constructor(private PrismaService: PrismaService) {}

  async getListLabelGroup(): Promise<label_group[]> {
    const result = await this.PrismaService.label_group.findMany({
      orderBy: {
        lbg_idx: 'desc',
      },
      where: {
        lbg_deletion: false,
      },
    });
    return result;
  }

  async getListLabelGroup2(): Promise<label_group[]> {
    const result = await this.PrismaService.label_group.findMany({
      orderBy: {
        lbg_idx: 'desc',
      },
      where: {
        lbg_deletion: false,
        lbg_labels: { not: '' },
      },
    });
    return result;
  }

  async addLabelGroup(obj: {
    mem_idx: number;
    lbg_name: string;
  }): Promise<label_group> {
    const { mem_idx, lbg_name } = obj;
    const result = await this.PrismaService.label_group.create({
      data: {
        mem_idx: mem_idx,
        lbg_name: lbg_name,
        lbg_ins_datetime: new Date(),
      },
    });

    return result;
  }

  async deleteManyLabelGroup(idxArr: number[]): Promise<number> {
    const result = await this.PrismaService.label_group.updateMany({
      data: {
        lbg_deletion: true,
        lbg_del_datetime: new Date(),
      },
      where: {
        lbg_idx: { in: idxArr },
      },
    });

    return result.count;
  }

  async getOne(idx: number): Promise<label_group> {
    const result = await this.PrismaService.label_group.findUnique({
      where: {
        lbg_idx: idx,
      },
    });
    return result;
  }

  async setName(idx: number, name: string): Promise<label_group> {
    const result = await this.PrismaService.label_group.update({
      data: {
        lbg_name: name,
        lbg_upd_datetime: new Date(),
      },
      where: {
        lbg_idx: idx,
      },
    });
    return result;
  }

  async setLabelList(idx: number, labels: string): Promise<label_group> {
    const result = await this.PrismaService.label_group.update({
      data: {
        lbg_labels: labels,
        lbg_upd_datetime: new Date(),
      },
      where: {
        lbg_idx: idx,
      },
    });
    return result;
  }

  // // async setLabelData(data: Prisma.label_dataCreateInput) {
  // async setLabelData(data: any) {
  //   // const result = await this.PrismaService.label_data.create({
  //   //   data: data,
  //   // });
  //   const result = await this.PrismaService.label_data.upsert({
  //     create: {
  //       lf_idx: data.lf_idx,
  //       mem_idx: data.mem_idx,
  //       cls: data.cls,
  //       color: data.color,
  //       editinglabels: data.editinglabels,
  //       h: data.h,
  //       highlighted: data.highlighted,
  //       id: data.id,
  //       ld_date: data.ld_date,
  //       open: data.open,
  //       points: data.points,
  //       type: data.type,
  //       w: data.w,
  //       x: data.x,
  //       y: data.y,
  //       ld_group_item: data.ld_group_item,
  //     },
  //     update: {
  //       cls: data.cls,
  //       color: data.color,
  //       editinglabels: data.editinglabels,
  //       h: data.h,
  //       highlighted: data.highlighted,
  //       id: data.id,
  //       ld_date: data.ld_date,
  //       open: data.open,
  //       points: data.points,
  //       type: data.type,
  //       w: data.w,
  //       x: data.x,
  //       y: data.y,
  //       ld_group_item: data.ld_group_item,
  //     },
  //     where: {
  //       ld_idx: data.ld_idx,
  //     },
  //   });
  //   return result;
  // }

  // async getLabelData({ where }: Prisma.label_dataFindManyArgs) {
  //   const result = await this.PrismaService.label_data.findMany({ where });
  //   return result;
  // }

  // async getMyFileData({ where }: Prisma.label_fileFindManyArgs) {
  //   const result = await this.PrismaService.label_file.findMany({ where });
  //   return result;
  // }

  // async getLabelData({ where }: Prisma.label_fileFindManyArgs) {
  //   const result = await this.PrismaService.label_file.findMany({ where });
  //   return result;
  // }
}
