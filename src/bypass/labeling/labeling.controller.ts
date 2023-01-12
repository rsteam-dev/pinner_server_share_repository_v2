import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import { AddLabelGroupItemDto } from './dto/add-labelGroup.dto';
import { SetLabelGroupNameDto } from './dto/set-labelGroupName.dto';
import { LabelingService } from './labeling.service';

@Controller('labeling')
export class LabelingController {
  constructor(
    private UsersService: UsersService,
    private authService: AuthService,
    private labelingService: LabelingService,
  ) {}
  /**
   * TODO
   *
   */

  // 데이터관리자 레벨 5
  //! 라벨 그룹 리스트 조회
  //? TEST
  @Post('testimg')
  async test(@Res() res: Response, @Req() req: Request) {
    res.send({});
    return;
  }

  // 데이터관리자 레벨 5
  //! 라벨 그룹 리스트 조회
  @UseGuards(JwtAuthGuard)
  @Post('group/get-list')
  async groupManagementList(@Res() res: Response, @Req() req: Request) {
    const tk = req['headers']?.['authorization'];

    const result = await this.authService.validateUser(tk);

    const user = await this.UsersService.getUserByIdx(result.mem_idx);

    if (user.mem_auth_level !== 5 && user.mem_auth_level !== 7) {
      res.send({
        statusCode: 400,
        message: 'permission denined',
        error: 'fail',
      });
      return;
    }

    const list = await this.labelingService.getListLabelGroup();

    res.send({
      statusCode: 200,
      message: '',
      error: 'success',
      list,
    });
    return;
  }

  // 데이터관리자 레벨 5
  //! 라벨 그룹 아이템 추가
  @UseGuards(JwtAuthGuard)
  @Post('groupItem/add-one')
  async groupManagementAdd(
    @Res() res: Response,
    @Req() req: Request,
    @Body() body: AddLabelGroupItemDto,
  ) {
    const tk = req['headers']?.['authorization'];

    const result = await this.authService.validateUser(tk);

    const user = await this.UsersService.getUserByIdx(result.mem_idx);

    if (user.mem_auth_level !== 5 && user.mem_auth_level !== 7) {
      res.send({
        statusCode: 400,
        message: 'permission denined',
        error: 'fail',
      });
      return;
    }

    const one = await this.labelingService.getOne(body.lbg_idx);
    const labelsArr = JSON.parse(
      (one.lbg_labels ?? '').length < 1 || !one.lbg_labels
        ? '[]'
        : one.lbg_labels,
    );

    if (labelsArr.includes(body.lbg_labels)) {
      res.send({
        statusCode: 400,
        message: '이미 사용중인 라벨입니다.',
        error: 'fail',
      });
      return;
    }
    const addResult = await this.labelingService.setLabelList(
      body.lbg_idx,
      JSON.stringify(
        JSON.parse(
          (one.lbg_labels ?? '').length < 1 || !one.lbg_labels
            ? '[]'
            : one.lbg_labels,
        ).concat(body.lbg_labels),
      ),
    );

    if (!addResult) {
      res.send({
        statusCode: 400,
        message: '라벨 생성에 실패하였습니다.',
        error: 'fail',
      });
      return;
    }

    const newOne = await this.labelingService.getOne(addResult.lbg_idx);
    const list = await this.labelingService.getListLabelGroup();

    res.send({
      statusCode: 200,
      message: '새 라벨이 생성되었습니다.',
      error: 'success',
      one: newOne,
      list,
    });
    return;
  }

  // 데이터관리자 레벨 5
  //! 라벨명 삭제
  @UseGuards(JwtAuthGuard)
  @Post('groupItem/del-one')
  async groupManagementDeleteGroupItem(
    @Res() res: Response,
    @Req() req: Request,
    @Body() body: AddLabelGroupItemDto,
  ) {
    const tk = req['headers']?.['authorization'];

    const result = await this.authService.validateUser(tk);

    const user = await this.UsersService.getUserByIdx(result.mem_idx);

    if (user.mem_auth_level !== 5 && user.mem_auth_level !== 7) {
      res.send({
        statusCode: 400,
        message: 'permission denined',
        error: 'fail',
      });
      return;
    }

    const one = await this.labelingService.getOne(body.lbg_idx);
    const labelsArr = JSON.parse(
      (one.lbg_labels ?? '').length < 1 || !one.lbg_labels
        ? '[]'
        : one.lbg_labels,
    );

    if (!labelsArr.includes(body.lbg_labels)) {
      res.send({
        statusCode: 400,
        message: '존재하지 않는 라벨링명입니다.',
        error: 'fail',
      });
      return;
    }

    const idx = labelsArr.findIndex((el) => el === body.lbg_labels);
    labelsArr.splice(idx, 1);
    const delResult = await this.labelingService.setLabelList(
      body.lbg_idx,
      JSON.stringify(labelsArr),
    );

    if (!delResult) {
      res.send({
        statusCode: 400,
        message: '라벨 삭제에 실패하였습니다.',
        error: 'fail',
      });
      return;
    }

    const newOne = await this.labelingService.getOne(delResult.lbg_idx);
    const list = await this.labelingService.getListLabelGroup();

    res.send({
      statusCode: 200,
      message: '라벨이 삭제되었습니다.',
      error: 'success',
      one: newOne,
      list,
    });
    return;
  }

  // 데이터관리자 레벨 5
  //! 라벨링 그룹 삭제
  @UseGuards(JwtAuthGuard)
  @Post('group/del-list')
  async groupManagementDelete(
    @Res() res: Response,
    @Req() req: Request,
    @Body('idxArr') idxArr: number[],
  ) {
    const tk = req['headers']?.['authorization'];

    const result = await this.authService.validateUser(tk);

    const user = await this.UsersService.getUserByIdx(result.mem_idx);

    if (user.mem_auth_level !== 5 && user.mem_auth_level !== 7) {
      res.send({
        statusCode: 400,
        message: 'permission denined',
        error: 'fail',
      });
      return;
    }
    console.log('idxArr= >', idxArr);

    await this.labelingService.deleteManyLabelGroup(idxArr);

    const list = await this.labelingService.getListLabelGroup();

    res.send({
      statusCode: 200,
      message: '선택 항목이 삭제되었습니다.',
      error: 'success',
      list,
    });
    return;
  }

  // 데이터관리자 레벨 5
  //! 라벨링 그룹 아이템 가져오기
  @UseGuards(JwtAuthGuard)
  @Post('groupItem/get-list')
  async groupManagementOne(
    @Res() res: Response,
    @Req() req: Request,
    @Body('idx') idx: number,
  ) {
    const tk = req['headers']?.['authorization'];

    const result = await this.authService.validateUser(tk);

    const user = await this.UsersService.getUserByIdx(result.mem_idx);

    if (user.mem_auth_level !== 5 && user.mem_auth_level !== 7) {
      res.send({
        statusCode: 400,
        message: 'permission denined',
        error: 'fail',
      });
      return;
    }

    const getOneData = await this.labelingService.getOne(idx);

    res.send({
      statusCode: 200,
      message: '',
      error: 'success',
      one: getOneData,
    });
    return;
  }

  // 데이터관리자 레벨 5
  //! 라벨링 그룹 수정
  @UseGuards(JwtAuthGuard)
  @Post('group/edit-one')
  async groupManagementSetName(
    @Res() res: Response,
    @Req() req: Request,
    @Body() body: SetLabelGroupNameDto,
  ) {
    console.log('body => ', body);
    const tk = req['headers']?.['authorization'];

    const result = await this.authService.validateUser(tk);

    const user = await this.UsersService.getUserByIdx(result.mem_idx);

    if (user.mem_auth_level !== 5 && user.mem_auth_level !== 7) {
      res.send({
        statusCode: 400,
        message: 'permission denined',
        error: 'fail',
      });
      return;
    }

    const list = await this.labelingService.getListLabelGroup();

    list.map((el) => {
      if (el.lbg_name === body.lbg_name) {
        res.send({
          statusCode: 400,
          message: '이미 사용중인 라벨그룹명입니다.',
          error: 'fail',
        });
        return;
      }
    });

    if (body.lbg_idx === 0) {
      // new
      const addOneData = await this.labelingService.addLabelGroup({
        mem_idx: user.mem_idx,
        lbg_name: body.lbg_name,
      });

      const list = await this.labelingService.getListLabelGroup();

      res.send({
        statusCode: 200,
        message: '라벨링 그룹이 추가되었습니다.',
        error: 'success',
        one: addOneData,
        list,
      });
      return;
    } else {
      //  update
      const setOneData = await this.labelingService.setName(
        body.lbg_idx,
        body.lbg_name,
      );

      const list = await this.labelingService.getListLabelGroup();

      res.send({
        statusCode: 200,
        message: '라벨링 그룹이 수정되었습니다.',
        error: 'success',
        one: setOneData,
        list,
      });
      return;
    }
  }
}
