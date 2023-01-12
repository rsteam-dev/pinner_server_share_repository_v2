import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import { UpdateSystemManagementDto } from './dto/upd-systemManagement.dto';
import { SystemManagementService } from './systemManagement.service';

@Controller('system')
export class SystemManagementController {
  constructor(
    private UsersService: UsersService,
    private authService: AuthService,
    private systemManagementService: SystemManagementService,
  ) {}

  //! 시스템 정보 가져오기
  @UseGuards(JwtAuthGuard)
  @Post('get-list')
  async systemManagementList(@Res() res: Response, @Req() req: Request) {
    const tk = req['headers']?.['authorization'];

    const result = await this.authService.validateUser(tk);

    const user = await this.UsersService.getUserByIdx(result.mem_idx);

    if (user.mem_auth_level !== 6 && user.mem_auth_level !== 7) {
      res.send({
        statusCode: 400,
        message: 'permission denined',
        error: 'fail',
      });
      return;
    }

    const list = await this.systemManagementService.getList();

    res.send({
      statusCode: 200,
      message: 'ok',
      error: 'success',
      list,
    });
    return;
  }

  //! 시스템 정보 저장
  @UseGuards(JwtAuthGuard)
  @Post('set-one')
  async systemManagementSetOne(
    @Res() res: Response,
    @Req() req: Request,
    @Body() body: UpdateSystemManagementDto,
  ) {
    const tk = req['headers']?.['authorization'];

    const result = await this.authService.validateUser(tk);

    const user = await this.UsersService.getUserByIdx(result.mem_idx);

    if (user.mem_auth_level !== 6 && user.mem_auth_level !== 7) {
      res.send({
        statusCode: 400,
        message: 'permission denined',
        error: 'fail',
      });
      return;
    }

    const setOne = await this.systemManagementService.setOne(body);

    res.send({
      statusCode: 200,
      message: 'ok',
      error: 'success',
      one: setOne,
    });
    return;
  }
}
