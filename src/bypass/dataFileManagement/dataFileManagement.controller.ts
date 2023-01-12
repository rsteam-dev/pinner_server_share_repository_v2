import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';

@Controller('file')
export class DataFileManagementController {
  constructor(
    private UsersService: UsersService,
    private authService: AuthService, // private dataFileManagementService: DataFileManagementService,
  ) {}

  /**
   * TODO
   * ect2.iptime.org:2299/data/directory/get
   * ect2.iptime.org:2299/data/directory/item/get
   * ect2.iptime.org:2299/data/cmd
   */

  //! 라벨러 지정
  //? 권한체크 필요
  /**
  @UseGuards(JwtAuthGuard)
  @Post('work/set-one')
  async labeler(@Res() res: Response, @Req() req: Request) {
    const tk = req['headers']?.['authorization'];

    const result = await this.authService.validateUser(tk);

    const user = await this.UsersService.getUserByIdx(result.mem_idx);

    res.send({
      statusCode: '',
      message: '',
      error: 'success',
    });
    return;
  } */

  //! 검수자 지정
  //? 권한체크 필요
  /**
  @UseGuards(JwtAuthGuard)
  @Post('check/set-one')
  async checker(@Res() res: Response, @Req() req: Request) {
    const dumiData = await getDirectory();
    res.send({
      statusCode: dumiData.rescode,
      message: dumiData.resmsg,
      error: 'success',
      list: dumiData.resobj,
    });
    return;
  } */
}
