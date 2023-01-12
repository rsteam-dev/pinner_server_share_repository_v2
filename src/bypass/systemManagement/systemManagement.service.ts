import { Injectable } from '@nestjs/common';
import { system } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UpdateSystemManagementDto } from './dto/upd-systemManagement.dto';
@Injectable()
export class SystemManagementService {
  constructor(private PrismaService: PrismaService) {}

  async getList(): Promise<system> {
    const result = await this.PrismaService.system.findUnique({
      where: {
        sys_idx: 1,
      },
    });
    return result;
  }

  async getOne(key: string): Promise<system> {
    const result = await this.PrismaService.system.findUnique({
      where: {
        sys_idx: 1,
      },
      select: {
        sys_idx: true,
        sys_geoserver_info: key === 'geoserver' ? true : false,
        sys_mqtt_info: key === 'mqtt' ? true : false,
        sys_mysql_info: key === 'mysql' ? true : false,
        sys_nas_info: key === 'nas' ? true : false,
      },
    });
    return result;
  }

  async setOne(obj: UpdateSystemManagementDto): Promise<system> {
    const { key, value } = obj;
    const result = await this.PrismaService.system.update({
      where: {
        sys_idx: 1,
      },
      data: {
        sys_geoserver_info: key === 'geoserver' ? value : undefined,
        sys_mqtt_info: key === 'mqtt' ? value : undefined,
        sys_mysql_info: key === 'mysql' ? value : undefined,
        sys_nas_info: key === 'nas' ? value : undefined,
      },
    });

    return result;
  }
}
