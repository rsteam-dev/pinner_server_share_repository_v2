import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';

@Controller('api')
export class ApiController {
  constructor(
    private UsersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('shp/allt')
  async getAllShp(@Res() res: Response, @Req() req: Request) {
    return;
  }

  @Post('shp/point/feature/get')
  async getFeatures(@Res() res: Response, @Req() req: Request) {
    return;
  }

  @Post('data/directory/get')
  async getDirectories(
    @Res() res: Response,
    @Req() req: Request,
    @Body('directories') directories: string[],
  ) {
    return;
  }

  @Post('data/directory/item/get')
  async getDirectorieItems(
    @Res() res: Response,
    @Req() req: Request,
    @Body('path') path: string,
  ) {
    return;
  }

  @Post('data/cmd')
  async cmd(
    @Res() res: Response,
    @Req() req: Request,
    @Body('cmd')
    cmd: 'copy' | 'rename' | 'move' | 'delete' | 'mkdir' | 'upload',
    @Body('from') from: string[],
    @Body('to') to: string,
  ) {
    return;
  }

  @Post('lable/status/get')
  async getLabelState(
    @Res() res: Response,
    @Req() req: Request,
    @Body('path') path: string,
  ) {
    return;
  }

  @Post('lable/status/set')
  async setLabelState(
    @Res() res: Response,
    @Req() req: Request,
    @Body('path') path: string,
    @Body('state') state: string,
  ) {
    return;
  }

  @Post('lable/info/get')
  async getLabelInfo(
    @Res() res: Response,
    @Req() req: Request,
    @Body('path') path: string,
    @Body('target') state: string,
  ) {
    return;
  }

  @Post('lable/info/set')
  async setLabelInfo(
    @Res() res: Response,
    @Req() req: Request,
    @Body('path') path: string,
    @Body('target') state: string,
    @Body('label') label: any,
  ) {
    return;
  }

  @Post('lable/check/status/get')
  async getCheckState(
    @Res() res: Response,
    @Req() req: Request,
    @Body('path') path: string,
  ) {
    return;
  }

  @Post('lable/check/status/set')
  async setCheckState(
    @Res() res: Response,
    @Req() req: Request,
    @Body('path') path: string,
    @Body('state') state: string,
  ) {
    return;
  }

  @Post('lable/check/info/get')
  async getCheckInfo(
    @Res() res: Response,
    @Req() req: Request,
    @Body('path') path: string,
    @Body('target') state: string,
  ) {
    return;
  }

  @Post('lable/check/info/set')
  async setCheckInfo(
    @Res() res: Response,
    @Req() req: Request,
    @Body('path') path: string,
    @Body('target') state: string,
    @Body('checked')
    checked: {
      target: string;
      result: boolean;
    }[],
  ) {
    return;
  }
}
