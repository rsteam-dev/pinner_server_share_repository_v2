import { Injectable } from '@nestjs/common';
import { annual_forest } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { AddAnnualForestDto } from './dto/add-annualForest.dto';
import { UpdAnnualForestDto } from './dto/upd-annualForest.dto';
@Injectable()
export class ForestPestsService {
  constructor(private PrismaService: PrismaService) {}

  async getAnnualForestList(): Promise<annual_forest[]> {
    const result = await this.PrismaService.annual_forest.findMany({
      where: {
        anf_deletion: false,
      },
      orderBy: {
        anf_year: 'desc',
      },
    });

    return result;
  }

  async addAnnualForest(obj: AddAnnualForestDto): Promise<any> {
    const { mem_idx, anf_year, anf_name, anf_shp, anf_shpname } = obj;
    const result = await this.PrismaService.annual_forest.create({
      data: {
        mem_idx: mem_idx,
        anf_year: anf_year,
        anf_name: anf_name,
        anf_shp: anf_shp,
        anf_shpname: anf_shpname,
        anf_ins_datetime: new Date(),
      },
    });
    // console.log('add result => ', result);
  }

  async deleteAnnualForest(idx: number[]): Promise<any> {
    const result = await this.PrismaService.annual_forest.updateMany({
      data: {
        anf_deletion: true,
        anf_del_datetime: new Date(),
      },
      where: {
        anf_idx: {
          in: idx,
        },
      },
    });
    // console.log('de result => ', result);
  }

  async updateAnnualForest(obj: UpdAnnualForestDto): Promise<any> {
    const { anf_idx, upd_mem_idx, anf_year, anf_name, anf_shp, anf_shpname } =
      obj;
    const result = await this.PrismaService.annual_forest.update({
      data: {
        upd_mem_idx: upd_mem_idx,
        anf_year: anf_year,
        anf_name: anf_name,
        anf_shp: anf_shp,
        anf_shpname: anf_shpname,
        anf_upd_datetime: new Date(),
      },
      where: {
        anf_idx: anf_idx,
      },
    });
    // console.log('upd result => ', result);
  }
}
