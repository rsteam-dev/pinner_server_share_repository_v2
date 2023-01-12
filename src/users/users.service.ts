import { Injectable } from '@nestjs/common';
import { member } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { GetUserListDataDto } from './dto/getuserlist-admin.dto';
import { LoginLog } from './entities/loginLog.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private PrismaService: PrismaService) {}

  async setMyInfo(mem_idx: number, password: string): Promise<boolean> {
    const result = await this.PrismaService.member.update({
      where: {
        mem_idx: mem_idx,
      },
      data: {
        mem_password: password,
      },
    });
    if ((result?.mem_idx ?? 0) > 0) return true;
    return false;
  }

  async getUserByIdx(mem_idx: number): Promise<User> {
    const user = await this.PrismaService.member.findUnique({
      where: {
        mem_idx_mem_deletion: {
          mem_idx: mem_idx,
          mem_deletion: false,
        },
      },
    });
    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.PrismaService.member.findUnique({
      where: {
        mem_email_mem_deletion: {
          mem_deletion: false,
          mem_email: email,
        },
      },
    });
    return user;
  }

  async setRt(mem_idx: number, rt: string): Promise<void> {
    await this.PrismaService.member.update({
      where: {
        mem_idx: mem_idx,
      },
      data: {
        mem_refresh_token: rt,
      },
    });
  }

  async isAuthorizedEmail(mem_email: string): Promise<boolean> {
    const result = await this.PrismaService.eamil_auth_number.findUnique({
      where: {
        eth_email_eth_flag: {
          eth_email: mem_email,
          eth_flag: 1,
        },
      },
    });
    if ((result?.eth_idx ?? 0) > 0) return true;
    return false;
  }

  async authEmailNumber(
    email: string,
    authEmailNumber: string,
  ): Promise<boolean> {
    const result = await this.PrismaService.eamil_auth_number.findUnique({
      where: {
        eth_email_eth_number: {
          eth_email: email,
          eth_number: authEmailNumber,
        },
      },
    });

    if ((result?.eth_idx ?? 0) > 0) {
      await this.PrismaService.eamil_auth_number.update({
        where: {
          eth_idx: result.eth_idx,
        },
        data: {
          eth_flag: 1,
        },
      });
      return true;
    }
    return false;
  }

  async authEmailNumberForFindPw(
    email: string,
    authEmailNumber: string,
  ): Promise<boolean> {
    const result = await this.PrismaService.findpw_auth_number.findUnique({
      where: {
        pth_email_pth_number: {
          pth_email: email,
          pth_number: authEmailNumber,
        },
      },
    });

    if ((result?.pth_idx ?? 0) > 0) {
      await this.PrismaService.findpw_auth_number.update({
        where: {
          pth_idx: result.pth_idx,
        },
        data: {
          pth_flag: 1,
        },
      });
      return true;
    }
    return false;
  }

  async authNumberFlagCheck(email: string): Promise<boolean> {
    const result = await this.PrismaService.findpw_auth_number.findUnique({
      where: {
        pth_email_pth_flag: {
          pth_email: email,
          pth_flag: 1,
        },
      },
    });
    if ((result?.pth_idx ?? 0) > 0) return true;
    return false;
  }

  async upsertAuthorizeEmail(email: string, number: string): Promise<boolean> {
    const result = await this.PrismaService.eamil_auth_number.upsert({
      create: {
        eth_email: email,
        eth_number: number,
      },
      update: {
        eth_number: number,
        eth_flag: 0,
      },
      where: {
        eth_email: email,
      },
    });

    if ((result?.eth_idx ?? 0) > 0) return true;
    return false;
  }

  async upsertAuthorizeEmailForFindPw(
    email: string,
    number: string,
  ): Promise<boolean> {
    const result = await this.PrismaService.findpw_auth_number.upsert({
      create: {
        pth_email: email,
        pth_number: number,
      },
      update: {
        pth_number: number,
        pth_flag: 0,
      },
      where: {
        pth_email: email,
      },
    });
    if ((result?.pth_idx ?? 0) > 0) return true;
    return false;
  }

  async addUser(
    name: string,
    email: string,
    encryptedPw: string,
    level: number,
    active: boolean,
  ): Promise<boolean> {
    const result = await this.PrismaService.member.create({
      data: {
        mem_name: name,
        mem_email: email,
        mem_password: encryptedPw,
        mem_auth_level: level,
        mem_ins_datetime: new Date(),
        mem_auth_datetime: active === true ? new Date() : null,
        mem_active: active,
      },
    });
    if ((result?.mem_idx ?? 0) > 0) return true;
    return false;
  }

  async setUser(
    idx: number,
    name: string,
    email: string,
    encryptedPw: string,
    level: number,
  ): Promise<boolean> {
    const result = await this.PrismaService.member.update({
      where: {
        mem_idx_mem_deletion: {
          mem_idx: idx,
          mem_deletion: false,
        },
      },
      data: {
        mem_name: name,
        mem_email: email,
        mem_password: encryptedPw,
        mem_auth_level: level,
        mem_upd_datetime: new Date(),
      },
    });
    if ((result?.mem_idx ?? 0) > 0) return true;
    return false;
  }

  async changePw(email: string, password: string): Promise<boolean> {
    const result = await this.PrismaService.member.update({
      where: {
        mem_email_mem_deletion: {
          mem_deletion: false,
          mem_email: email,
        },
      },
      data: {
        mem_password: password,
      },
    });
    if ((result?.mem_idx ?? 0) > 0) return true;
    return false;
  }

  async logout(mem_idx: number): Promise<boolean> {
    const result = await this.PrismaService.member.update({
      where: {
        mem_idx: mem_idx,
      },
      data: {
        mem_refresh_token: '',
      },
    });
    if ((result?.mem_idx ?? 0) > 0) return true;
    return false;
  }

  //! 관리자 기능
  // async getUserList(data: GetUserListDataDto): Promise<User[]> {
  //   const { skip, active, level, name } = data;
  //   const result = await this.PrismaService.member.findMany({
  //     skip: skip,
  //     take: 10,
  //     where: {
  //       mem_active: active,
  //       mem_auth_level: level,
  //       mem_name: {
  //         contains: name,
  //       },
  //       mem_deletion: false,
  //     },
  //     orderBy: {
  //       mem_idx: 'desc',
  //     },
  //   });
  //   return result;
  // }

  async getUserList(): Promise<member[]> {
    const result = await this.PrismaService.member.findMany({
      where: {
        mem_deletion: false,
      },
      orderBy: {
        mem_idx: 'desc',
      },
    });

    return result;
  }

  async confirmAuthUser(idx: number): Promise<boolean> {
    const result = await this.PrismaService.member.update({
      where: {
        mem_idx: idx,
      },
      data: {
        mem_active: true,
        mem_auth_datetime: new Date(),
      },
    });

    if ((result?.mem_idx ?? 0) > 0) return true;
    return false;
  }

  async delete(idx: number): Promise<boolean> {
    // console.log(idx);
    // const result = await this.PrismaService.member.update({
    //   where: {
    //     mem_idx: idx,
    //   },
    //   data: {
    //     mem_deletion: true,
    //     mem_del_datetime: new Date(),
    //   },
    // });

    const result = await this.PrismaService.member.delete({
      where: {
        mem_idx: idx,
      },
    });

    if ((result?.mem_idx ?? 0) > 0) return true;
    return false;
  }

  async setLoginLog(obj: LoginLog): Promise<void> {
    const {
      mll_mem_idx,
      mll_email,
      mll_success,
      mll_datetime,
      mll_reason,
      mll_ip,
    } = obj;
    const result = await this.PrismaService.login_log.create({
      data: {
        mll_mem_idx: mll_mem_idx,
        mll_email: mll_email,
        mll_success: mll_success,
        mll_datetime: mll_datetime,
        mll_reason: mll_reason,
        mll_ip: mll_ip,
      },
    });
  }
}
