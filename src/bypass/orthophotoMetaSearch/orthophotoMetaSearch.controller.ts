import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import { GetOrthophotoMetaSearchDto } from './dto/get-orthophotoMetaSearch';

@Controller('orthophotoMetaSearch')
export class OrthophotoMetaSearchController {
  constructor(
    private UsersService: UsersService,
    private authService: AuthService,
  ) {}
  // 정사영상 및 메타조회 -> 정사영상 및 조회
  /**
   * TODO
      POST /data/search_by_point
        {
          lat: "", // 위도
          long: "" // 경도
        }
  *
      RESPONSE
        {
          rescode: 200,
          resmsg: "reason",
          resobj: {
            orthos: ["ortho_0_url", "ortho_1_url", "ortho_2_url"],
            shapes: ["shape_0_url", "shape_1_url", "shape_2_url"],
            images: ["image_0_url", "image_1_url", "image_2_url"]
          }
        }
   */
  /**
  @UseGuards(JwtAuthGuard)
  @Post('orthophotoSearch/list')
  async groupManagementList(
    @Res() res: Response,
    @Req() req: Request,
    @Body() body: GetOrthophotoMetaSearchDto,
  ) {
    // console.log('GetOrthophotoMetaSearchDto =>', body);
    const { lat, long } = body;

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

    const data = await returnDumiData();

    res.send({
      statusCode: 200,
      message: '',
      error: 'success',
      resObj: data.resobj,
    });
    return;
  } */
}

/** 
const returnDumiData = async () => {
  return {
    rescode: 200,
    resmsg: 'reason',
    resobj: {
      orthos: ['ortho_0_url', 'ortho_1_url', 'ortho_2_url'],
      shapes: ['shape_0_url', 'shape_1_url', 'shape_2_url'],
      images: ['image_0_url', 'image_1_url', 'image_2_url'],
    },
  };
};
*/
