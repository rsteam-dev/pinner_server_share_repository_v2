import { Body, Controller, Post, Res, UseGuards, Req } from '@nestjs/common';
import axios from 'axios';
import { Response, Request } from 'express';
import { readFileSync } from 'fs';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import {
  AddAnnualForestBody,
  AddAnnualForestBodyData,
} from './dto/add-annualForest.dto';
import { ForestPestsService } from './forestPests.service';

@Controller('forestPests')
export class ForestPestsController {
  constructor(
    private UsersService: UsersService,
    private authService: AuthService,
    private forestPestsServise: ForestPestsService,
  ) {}
  // 산림해충 현황-> 연차별 현황 list
  @UseGuards(JwtAuthGuard)
  @Post('annualStatus/get-list')
  async annualStatusList(@Res() res: Response) {
    const list = await this.forestPestsServise.getAnnualForestList();
    res.send({
      statusCode: 200,
      message: 'ok',
      error: 'success',
      list,
    });
    return;
  }

  // 산림해충 현황-> 연차별 현황
  @UseGuards(JwtAuthGuard)
  @Post('annualStatus/set-list')
  async annualStatusOne(
    @Res() res: Response,
    @Req() req: Request,
    @Body('data') data: AddAnnualForestBodyData[],
  ) {
    const tk = req['headers']?.['authorization'];
    const user = await this.authService.validateUser(tk);
    const userInfo = await this.UsersService.getUserByIdx(user.mem_idx);
    if (userInfo.mem_auth_level !== 6 && userInfo.mem_auth_level !== 7) {
      res.send({
        statusCode: 400,
        message: '권한이 없습니다.',
        error: 'fail',
      });
      return;
    }

    // data는 array
    // array안 idx키값이 0이면 새로 만들어짐 --> addAnnualForest
    // array안 idx키값이 존재하면 기존 것 수정 --> updateAnnualForest
    // array안 idx값이 기존 list에 존재하지 않으면 삭제 --> deleteAnnualForest

    const beforeList = await this.forestPestsServise.getAnnualForestList();
    const beforeListIdxArr: number[] = [];
    const beforeListYearArr: number[] = [];
    beforeList.map((el) => {
      beforeListIdxArr.push(el.anf_idx);
      beforeListIdxArr.push(el.anf_year);
    });

    for (let i = 0; i < data.length; i++) {
      if (
        beforeListIdxArr.includes(data[i].idx) &&
        !beforeListYearArr.includes(data[i].year)
      ) {
        // 기존 데이터

        if (data[i].delete) {
          // 기존 데이터 deletion
          await this.forestPestsServise.deleteAnnualForest([data[i].idx]);
        } else {
          // 기존 데이터 update
          await this.forestPestsServise.updateAnnualForest({
            anf_idx: data[i].idx,
            upd_mem_idx: userInfo.mem_idx,
            anf_year: data[i].year,
            anf_name: data[i].name,
            anf_shp: data[i].shp,
            anf_shpname: data[i].shpname,
          });
        }
      } else {
        // 새로 추가된 데이터

        if (data[i].delete) {
          // 새 데이터 x
        } else {
          // 새 데이터 create
          await this.forestPestsServise.addAnnualForest({
            mem_idx: userInfo.mem_idx,
            anf_year: data[i].year,
            anf_name: data[i].name,
            anf_shp: data[i].shp,
            anf_shpname: data[i].shpname,
          });
        }
      }
    }
    const list = await this.forestPestsServise.getAnnualForestList();
    res.send({
      statusCode: 200,
      message: '',
      error: 'success',
      list,
    });
    return;
  }

  // 산림해충 현황-> 실시간 검출 현황
  // @UseGuards(JwtAuthGuard)
  // @Post('realtimeDetectStatus/realtime')
  // async realtimeDetectStatus(@Res() res: Response) {
  //   res.send('realtimeDetectStatus/realtime');
  //   return;
  // }
}
