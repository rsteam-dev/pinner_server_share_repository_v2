import {
  Controller,
  Post,
  UseGuards,
  Get,
  Res,
  Req,
  Body,
  Headers,
} from '@nestjs/common';
import axios from 'axios';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { encryptPassword, randomString } from 'src/common/helper/common.helper';
import { AuthMailUserDto } from './dto/authmail-user.dto';
import { ChangePwUserDto } from './dto/changepw-user.dto';
import { FindPwUserDto } from './dto/findpw-user.dto';
import { GetUserListDataDto } from './dto/getuserlist-admin.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { SendMailUserDto } from './dto/sendmail-user.dto';
import { SetMyInfoDto } from './dto/setmyinfo-user.dto';
import { SetUserDto } from './dto/setuser-admin.dto';
import { SigninUserDto } from './dto/signin-user.dto';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(
    private UsersService: UsersService,
    private authService: AuthService,
  ) {}

  //! set MyInfo
  @UseGuards(JwtAuthGuard)
  @Post('set-info')
  async setmyinfo(
    @Res() res: Response,
    @Req() req: Request,
    @Body() body: SetMyInfoDto,
  ) {
    const { email, password, new_password } = body;

    const tk = req['headers']?.['authorization'];

    const result = await this.authService.validateUser(tk);

    // 패스워드 암호화
    const oldEncryptedPw = await encryptPassword(password, email);

    const user = await this.UsersService.getUserByIdx(result.mem_idx);

    if (user.mem_password !== oldEncryptedPw) {
      res.send({
        statusCode: 400,
        message: '기존 비밀번호를 확인해주세요.',
        error: 'fail',
      });
      return;
    }

    // 패스워드 암호화
    const newEncryptedPw = await encryptPassword(new_password, email);

    const setInfo = await this.UsersService.setMyInfo(
      result.mem_idx,
      newEncryptedPw,
    );

    if (!setInfo) {
      res.send({
        statusCode: 400,
        message: '내 정보를 수정하지 못했습니다.',
        error: 'fail',
      });
      return;
    }

    res.send({
      statusCode: 200,
      message: '내 정보가 수정되었습니다.',
      error: 'success',
    });
    return;
  }

  //! get MyInfo
  @UseGuards(JwtAuthGuard)
  @Post('get-info')
  async myinfo(@Res() res: Response, @Req() req: Request) {
    const tk = req['headers']?.['authorization'];

    const result = await this.authService.validateUser(tk);

    const user = await this.UsersService.getUserByIdx(result.mem_idx);

    // if (!user.mem_active) {
    //   res.send({
    //     statusCode: 400,
    //     message: '승인되지 않은 회원입니다.',
    //     error: 'fail',
    //   });
    //   return;
    // }

    res.send({
      statusCode: 200,
      message: 'ok',
      error: 'success',
      user: {
        name: user.mem_name,
        email: user.mem_email,
        active: user.mem_active,
        level: user.mem_auth_level,
        date: user.mem_ins_datetime,
        idx: user.mem_idx,
      },
    });
    return;
  }

  //* 로그아웃
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Res() res: Response, @Req() req: Request) {
    console.log('checktk');
    const tk = req['headers']?.['authorization'];

    const result = await this.authService.validateUser(tk);

    await this.UsersService.logout(result.mem_idx);

    res.send({
      statusCode: 200,
      message: 'ok',
      error: 'success',
    });
    return;
  }

  //* check Auth
  @UseGuards(JwtAuthGuard)
  @Post('checkauth')
  async checkauth(@Res() res: Response, @Req() req: Request) {
    console.log('checktk');
    const tk = req['headers']?.['authorization'];

    const result = await this.authService.validateUser(tk);

    const user = await this.UsersService.getUserByIdx(result.mem_idx);

    // if (!user.mem_active) {
    //   res.send({
    //     statusCode: 400,
    //     message: '미승인 계정',
    //     error: 'fail',
    //   });
    //   return;
    // }

    res.send({
      statusCode: 200,
      message: 'ok',
      error: 'success',
      level: user.mem_auth_level,
      active: user.mem_active,
    });
    return;
  }

  //* tk refresh
  @UseGuards(JwtAuthGuard)
  @Post('tkrefresh')
  async tkrefresh(
    @Res({ passthrough: true }) res: Response,
    @Headers() headers,
  ) {
    const authorization = headers['authorization'];

    const result = await this.authService.validateUser(authorization);
    // if (!result) {
    //   res.send({
    //     statusCode: 400,
    //     message: '유효하지 않은 요청입니다.',
    //     error: 'fail',
    //   });
    //   return;
    // }

    const user = await this.UsersService.getUserByIdx(result.mem_idx);

    // if (!user.mem_active) {
    //   res.send({
    //     statusCode: 400,
    //     message: '미승인 계정',
    //     error: 'fail',
    //   });
    //   return;
    // }

    if (user.mem_refresh_token !== authorization) {
      res.send({
        statusCode: 400,
        message: '유효하지 않은 요청입니다.',
        error: 'fail',
      });
      return;
    }

    // 토큰 발급 (at:accessToken, rt:refreshToken)
    const at = await this.authService.login(user.mem_idx);
    // const rt = await this.authService.rtLogin(user.mem_idx);

    // rt 저장
    // this.UsersService.setRt(user.mem_idx, rt);

    res.send({
      statusCode: 200,
      message: 'ok tk refresh',
      error: 'success',
      at: at,
      // rt: rt,
      level: user.mem_auth_level,
      active: user.mem_active,
    });
    return;
  }

  //* 로그인
  @Post('signin')
  async signin(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
    @Body() body: SigninUserDto,
  ) {
    const { email, password } = body;

    // 패스워드 암호화
    const encryptedPw = await encryptPassword(password, email);

    // 이메일 확인
    const user = await this.UsersService.getUserByEmail(email);

    /**
     * 유효성 확인
     * 유저가없거나, 탈퇴되었거나, 권한이없거나, 패스워드가일치하지않거나
     */
    if (
      !user ||
      (user?.mem_idx ?? 0) < 1 ||
      user.mem_deletion ||
      user.mem_auth_level < 1 ||
      user.mem_password !== encryptedPw
    ) {
      const reason =
        !user || (user?.mem_idx ?? 0) < 1
          ? '계정정보 없음'
          : user.mem_deletion
          ? '회원 탈퇴'
          : user.mem_auth_level < 1
          ? '권한 부족lv0'
          : user.mem_password !== encryptedPw
          ? '패스워드 불일치'
          : '';
      await this.UsersService.setLoginLog({
        mll_mem_idx: user?.mem_idx ?? 0,
        mll_email: email,
        mll_success: false,
        mll_datetime: new Date(),
        mll_reason: `로그인 실패(${reason})`,
        mll_ip:
          (typeof req.headers.ip === 'object'
            ? req.headers.ip[0]
            : req.headers.ip) ?? '',
      });

      res.send({
        statusCode: 400,
        message: '이메일 혹은 비밀번호를 확인해주세요.',
        error: 'fail',
      });
      return;
    } else {
      await this.UsersService.setLoginLog({
        mll_mem_idx: user?.mem_idx ?? 0,
        mll_email: email,
        mll_success: true,
        mll_datetime: new Date(),
        mll_reason: `로그인 성공`,
        mll_ip:
          (typeof req.headers.ip === 'object'
            ? req.headers.ip[0]
            : req.headers.ip) ?? '',
      });
    }

    // if (!user.mem_active) {
    //   res.send({
    //     statusCode: 400,
    //     message: '관리자에게 문의 (code: 계정 승인)',
    //     error: 'fail',
    //   });
    //   return;
    // }

    // 토큰 발급 (at:accessToken, rt:refreshToken)
    const at = await this.authService.login(user.mem_idx);
    const rt = await this.authService.rtLogin(user.mem_idx);

    // rt 저장
    this.UsersService.setRt(user.mem_idx, rt);

    res.send({
      statusCode: 200,
      message: '정상적으로 로그인 되었습니다.',
      error: 'success',
      at: at,
      rt: rt,
    });
    return;
  }

  //* 회원가입
  @Post('register')
  async register(@Res() res: Response, @Body() body: RegisterUserDto) {
    const { name, email, password, level } = body;

    // 이메일 확인
    const user = await this.UsersService.getUserByEmail(email);

    if (user?.mem_idx ?? 0 > 0) {
      res.send({
        statusCode: 400,
        message: '중복된 이메일입니다.',
        error: 'fail',
      });
      return;
    }

    // 이메일 인증 여부 체크
    if (!(await this.UsersService.isAuthorizedEmail(email))) {
      res.send({
        statusCode: 400,
        message: '이메일 인증이 필요합니다.',
        error: 'fail',
      });
      return;
    }

    // 패스워드 암호화
    const encryptedPw = await encryptPassword(password, email);

    // 회원 가입
    const register = await this.UsersService.addUser(
      name,
      email,
      encryptedPw,
      level,
      false,
    );
    if (!register) {
      res.send({
        statusCode: 400,
        message: '회원가입 신청에 실패하였습니다.',
        error: 'fail',
      });
      return;
    }

    // success
    res.send({
      statusCode: 200,
      message: '회원가입이 신청되었습니다.',
      error: 'success',
    });
    return;
  }

  //* 이메일 인증번호 확인
  @Post('authemail')
  async authemail(@Res() res: Response, @Body() body: AuthMailUserDto) {
    const { email, eth_email_number } = body;

    // 인증번호 확인
    const isAuth = await this.UsersService.authEmailNumber(
      email,
      eth_email_number,
    );

    if (!isAuth) {
      res.send({
        statusCode: 400,
        message: '인증번호를 확인해주세요.',
        error: 'fail',
      });
      return;
    }

    // success
    res.send({
      statusCode: 200,
      message: '이메일이 인증되었습니다.',
      error: 'success',
    });
    return;
  }

  //* 인증번호 이메일 전송
  @Post('sendmail')
  async sendMail(@Res() res: Response, @Body() body: SendMailUserDto) {
    const { email } = body;

    // 이메일 확인
    const user = await this.UsersService.getUserByEmail(email);

    if (user?.mem_idx ?? 0 > 0) {
      res.send({
        statusCode: 400,
        message: '중복된 이메일입니다.',
        error: 'fail',
      });
      return;
    }

    // 인증번호 생성
    const randomStr = randomString(6);

    // 이메일 전송
    await axios
      .post(
        'https://mq-recv.rs-team.co.kr/email/queueEmail/smtp/' +
          'text/' +
          'smtp.gmail.com',
        {
          SERVICE_PORT: 587,
          SERVICE_SECURE: false,
          TITLE: '[pinner] 회원가입 이메일 인증번호',
          CONTENT: `아래 표시된 인증번호를 입력해주세요. \n 인증번호: ${randomStr}`,
          SEND_NAME: 'Pinner',
          SEND_EMAIL: 'tmdqjaha12@gmail.com',
          SEND_AUTH_PASS: 'cgpgqyablnomfmht',
          REPLY: false,
          RECEIVE_USER: [
            {
              RECEIVE_EMAIL: email,
              RECEIVE_NAME: email,
            },
          ],
        },
        {
          headers: {
            Authorization:
              'Bearer ' +
              'd5beced29f4fa40262c0aa9062839c16088445eb07d9e3b77850289ccb841469',
            'Content-Type': 'application/json',
          },
          responseType: 'json',
        },
      )
      .catch((err) => {
        console.log('err: ', err?.response?.data);
        // throw new Error('팝빌 메시지 서비스를 정상적으로 호출하지 못했습니다.');
        res.send({
          statusCode: 400,
          message: '인증번호 전송이 실패했습니다. 잠시 후 재시도 해주세요.',
          error: 'fail',
        });
        return;
      });

    // 인증 정보 DB 저장
    const setDataInDB = await this.UsersService.upsertAuthorizeEmail(
      email,
      randomStr,
    );
    if (!setDataInDB) {
      res.send({
        statusCode: 400,
        message: '잠시 후 재시도 해주세요.',
        error: 'fail',
      });
      return;
    }

    // success
    res.send({
      statusCode: 200,
      message: '인증번호가 전송되었습니다.',
      error: 'success',
    });
    return;
  }

  //* 비밀번호 찾기
  @Post('findpw')
  async findpw(@Res() res: Response, @Body() body: FindPwUserDto) {
    const { name, email } = body;

    // 이메일 확인
    const user = await this.UsersService.getUserByEmail(email);

    if ((user?.mem_idx ?? 0) < 1) {
      res.send({
        statusCode: 400,
        message: '이름 또는 이메일을 확인해주세요.',
        error: 'fail',
      });
      return;
    }

    // 이름 확인
    if (user.mem_name !== name) {
      res.send({
        statusCode: 400,
        message: '이름 또는 이메일을 확인해주세요.',
        error: 'fail',
      });
      return;
    }

    // 인증 확인
    const result = await this.UsersService.authNumberFlagCheck(email);
    if (!result) {
      res.send({
        statusCode: 400,
        message: '인증에 실패하였습니다.',
        error: 'fail',
      });
      return;
    }

    res.send({
      statusCode: 200,
      message: '회원 정보 및 인증이 확인되었습니다.',
      error: 'success',
    });
    return;
  }

  //* 이메일 인증번호 확인 (비밀번호 찾기)
  @Post('authemailforfindpw')
  async authemailForFindPw(
    @Res() res: Response,
    @Body() body: AuthMailUserDto,
  ) {
    const { email, eth_email_number } = body;

    // 인증번호 확인
    const isAuth = await this.UsersService.authEmailNumberForFindPw(
      email,
      eth_email_number,
    );

    if (!isAuth) {
      res.send({
        statusCode: 400,
        message: '인증번호를 확인해주세요.',
        error: 'fail',
      });
      return;
    }

    // success
    res.send({
      statusCode: 200,
      message: '이메일이 인증되었습니다.',
      error: 'success',
    });
    return;
  }

  //* 인증번호 이메일 전송 (비밀번호 찾기)
  @Post('sendmailforfindpw')
  async sendMailForFindPw(@Res() res: Response, @Body() body: SendMailUserDto) {
    const { email } = body;

    // 이메일 확인
    const user = await this.UsersService.getUserByEmail(email);
    if ((user?.mem_idx ?? 0) < 1) {
      res.send({
        statusCode: 400,
        message: '이메일을 확인해주세요.',
        error: 'fail',
      });
      return;
    }

    // 인증번호 생성
    const randomStr = randomString(6);

    // 이메일 전송
    await axios
      .post(
        'https://mq-recv.rs-team.co.kr/email/queueEmail/smtp/' +
          'text/' +
          'smtp.gmail.com',
        {
          SERVICE_PORT: 587,
          SERVICE_SECURE: false,
          TITLE: '[pinner] 비밀번호 찾기 인증번호',
          CONTENT: `아래 표시된 인증번호를 입력해주세요. \n 인증번호: ${randomStr}`,
          SEND_NAME: 'Pinner',
          SEND_EMAIL: 'tmdqjaha12@gmail.com',
          SEND_AUTH_PASS: 'cgpgqyablnomfmht',
          REPLY: false,
          RECEIVE_USER: [
            {
              RECEIVE_EMAIL: email,
              RECEIVE_NAME: email,
            },
          ],
        },
        {
          headers: {
            Authorization:
              'Bearer ' +
              'd5beced29f4fa40262c0aa9062839c16088445eb07d9e3b77850289ccb841469',
            'Content-Type': 'application/json',
          },
          responseType: 'json',
        },
      )
      .catch((err) => {
        console.log('err: ', err?.response?.data);
        // throw new Error('팝빌 메시지 서비스를 정상적으로 호출하지 못했습니다.');
        res.send({
          statusCode: 400,
          message: '인증번호 전송이 실패했습니다. 잠시 후 재시도 해주세요.',
          error: 'fail',
        });
        return;
      });

    // 인증 정보 DB 저장
    const setDataInDB = await this.UsersService.upsertAuthorizeEmailForFindPw(
      email,
      randomStr,
    );
    if (!setDataInDB) {
      res.send({
        statusCode: 400,
        message: '잠시 후 재시도 해주세요.',
        error: 'fail',
      });
      return;
    }

    // success
    res.send({
      statusCode: 200,
      message: '인증번호가 전송되었습니다.',
      error: 'success',
    });
    return;
  }

  //* 비밀번호 변경
  @Post('changepw')
  async changePw(@Res() res: Response, @Body() body: ChangePwUserDto) {
    const { email, password, eth_email_number } = body;

    // 인증번호 확인
    const isAuth = await this.UsersService.authEmailNumberForFindPw(
      email,
      eth_email_number,
    );

    if (!isAuth) {
      res.send({
        statusCode: 400,
        message: '인증번호를 확인해주세요.',
        error: 'fail',
      });
      return;
    }

    // 패스워드 암호화
    const encryptedPw = await encryptPassword(password, email);

    // 비밀번호 변경
    const pwChangedUser = await this.UsersService.changePw(email, encryptedPw);

    if (!pwChangedUser) {
      res.send({
        statusCode: 400,
        message: '비밀번호 변경에 실패하였습니다.',
        error: 'fail',
      });
      return;
    }

    // success
    res.send({
      statusCode: 200,
      message: '비밀번호가 성공적으로 변경되었습니다.',
      error: 'success',
    });
    return;
  }

  // @UseGuards(JwtAuthGuard)
  // @Post('test')
  // async getProfile(@Res() res: Response) {
  //   console.log('test');
  //   const a = await this.authService.login({ username: 'test', userId: 123 });
  //   // console.log('a => ', a);
  //   return res.send({ a });
  // }

  @UseGuards(JwtAuthGuard)
  @Post('test2')
  async getProfile2(@Res() res: Response) {
    console.log('test');
    const a = await this.authService.validateUser(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJzdWIiOjEyMywiaWF0IjoxNjYwODA5NTM5LCJleHAiOjE2NjA4MDk1OTl9.qoosu09YFE_U90AjxsohhGsy31b88xc5VEb9nlF9wdw',
    );
    console.log('a => ', a);
    res.send({});
    return;
  }

  //! 관리자 기능
  // @UseGuards(JwtAuthGuard)
  // @Post('list')
  // async getUserList(
  //   @Res() res: Response,
  //   @Req() req: Request,
  //   @Body() getListData: GetUserListDataDto,
  // ) {
  //   const tk = req['headers']?.['authorization'];

  //   const result = await this.authService.validateUser(tk);

  //   const user = await this.UsersService.getUserByIdx(result.mem_idx);

  //   if (user.mem_auth_level < 6) {
  //     res.send({
  //       statusCode: 400,
  //       message: 'permission denined',
  //       error: 'fail',
  //     });
  //     return;
  //   }

  //   console.log('getUserListData => ', getListData);

  //   const userList = await this.UsersService.getUserList(getListData);

  //   res.send({
  //     statusCode: 200,
  //     message: 'ok',
  //     error: 'success',
  //     data: userList,
  //   });
  //   return;
  // }

  //! 관리자 기능
  @UseGuards(JwtAuthGuard)
  @Post('get-list')
  async getUserList(
    @Res() res: Response,
    @Req() req: Request,
    // @Body() getListData: GetUserListDataDto,
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

    const userList = await this.UsersService.getUserList();

    res.send({
      statusCode: 200,
      message: 'ok',
      error: 'success',
      list: userList,
    });
    return;
  }

  // @UseGuards(JwtAuthGuard)
  // @Post('add')
  // async addUser(
  //   @Res() res: Response,
  //   @Req() req: Request,
  //   @Body() addUserData: RegisterUserDto,
  // ) {
  //   const tk = req['headers']?.['authorization'];

  //   const result = await this.authService.validateUser(tk);

  //   const user = await this.UsersService.getUserByIdx(result.mem_idx);

  //   if (user.mem_auth_level < 6) {
  //     res.send({
  //       statusCode: 400,
  //       message: 'permission denined',
  //       error: 'fail',
  //     });
  //     return;
  //   }

  //   const { name, email, password, level } = addUserData;
  //   console.log('getUserListData => ', addUserData);

  //   // 이메일 확인
  //   const duplicatedEmailUser = await this.UsersService.getUserByEmail(email);

  //   if ((duplicatedEmailUser?.mem_idx ?? 0) > 0) {
  //     res.send({
  //       statusCode: 400,
  //       message: '중복된 이메일입니다.',
  //       error: 'fail',
  //     });
  //     return;
  //   }

  //   // 패스워드 암호화
  //   const encryptedPw = await encryptPassword(password, email);

  //   const addUserResult = await this.UsersService.addUser(
  //     name,
  //     email,
  //     encryptedPw,
  //     level,
  //     true,
  //   );

  //   if (!addUserResult) {
  //     res.send({
  //       statusCode: 400,
  //       message: '회원 추가에 실패하였습니다.',
  //       error: 'fail',
  //     });
  //     return;
  //   }

  //   res.send({
  //     statusCode: 200,
  //     message: '회원이 성공적으로 추가되었습니다.',
  //     error: 'success',
  //   });
  //   return;
  // }

  //!
  @UseGuards(JwtAuthGuard)
  @Post('add-one')
  async addUser(
    @Res() res: Response,
    @Req() req: Request,
    @Body() addUserData: RegisterUserDto,
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

    const { name, email, password, level } = addUserData;

    // 이메일 확인
    const duplicatedEmailUser = await this.UsersService.getUserByEmail(email);

    if ((duplicatedEmailUser?.mem_idx ?? 0) > 0) {
      res.send({
        statusCode: 400,
        message: '중복된 이메일입니다.',
        error: 'fail',
      });
      return;
    }

    // 패스워드 암호화
    const encryptedPw = await encryptPassword(password, email);

    const addUserResult = await this.UsersService.addUser(
      name,
      email,
      encryptedPw,
      level,
      true,
    );

    if (!addUserResult) {
      res.send({
        statusCode: 400,
        message: '회원 추가에 실패하였습니다.',
        error: 'fail',
      });
      return;
    }

    const userList = await this.UsersService.getUserList();

    res.send({
      statusCode: 200,
      message: '회원이 성공적으로 추가되었습니다.',
      error: 'success',
      list: userList,
    });
    return;
  }

  // @UseGuards(JwtAuthGuard)
  // @Post('confirmauth')
  // async confirmauth(
  //   @Res() res: Response,
  //   @Req() req: Request,
  //   @Body('idx') idx: number,
  // ) {
  //   const tk = req['headers']?.['authorization'];

  //   const result = await this.authService.validateUser(tk);

  //   const user = await this.UsersService.getUserByIdx(result.mem_idx);

  //   if (user.mem_auth_level < 6) {
  //     res.send({
  //       statusCode: 400,
  //       message: 'permission denined',
  //       error: 'fail',
  //     });
  //     return;
  //   }

  //   // 유저 확인
  //   const confirmUser = await this.UsersService.getUserByIdx(idx);
  //   console.log(confirmUser);
  //   if ((confirmUser?.mem_idx ?? 0) < 1) {
  //     res.send({
  //       statusCode: 400,
  //       message: '존재하지 않는 계정입니다.',
  //       error: 'fail',
  //     });
  //     return;
  //   }

  //   const confirmAuthUserResult = await this.UsersService.confirmAuthUser(idx);

  //   if (!confirmAuthUserResult) {
  //     res.send({
  //       statusCode: 400,
  //       message: '계정 승인에 실패하였습니다.',
  //       error: 'fail',
  //     });
  //     return;
  //   }

  //   res.send({
  //     statusCode: 200,
  //     message: '회원 계정이 승인되었습니다.',
  //     error: 'success',
  //   });
  //   return;
  // }

  //!
  @UseGuards(JwtAuthGuard)
  @Post('confirm-one')
  async confirmauth(
    @Res() res: Response,
    @Req() req: Request,
    @Body('idx') idx: number,
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

    // 유저 확인
    const confirmUser = await this.UsersService.getUserByIdx(idx);
    console.log(confirmUser);
    if ((confirmUser?.mem_idx ?? 0) < 1) {
      res.send({
        statusCode: 400,
        message: '존재하지 않는 계정입니다.',
        error: 'fail',
      });
      return;
    }

    const confirmAuthUserResult = await this.UsersService.confirmAuthUser(idx);

    if (!confirmAuthUserResult) {
      res.send({
        statusCode: 400,
        message: '계정 승인에 실패하였습니다.',
        error: 'fail',
      });
      return;
    }

    const userList = await this.UsersService.getUserList();

    res.send({
      statusCode: 200,
      message: '회원 계정이 승인되었습니다.',
      error: 'success',
      list: userList,
    });
    return;
  }

  //! get-one
  @UseGuards(JwtAuthGuard)
  @Post('get-one')
  async one(
    @Res() res: Response,
    @Req() req: Request,
    @Body('idx') idx: number,
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

    console.log('idx => ', idx);

    // 유저 확인
    const confirmUser = await this.UsersService.getUserByIdx(idx);
    console.log(confirmUser);
    if ((confirmUser?.mem_idx ?? 0) < 1) {
      res.send({
        statusCode: 400,
        message: '존재하지 않는 계정입니다.',
        error: 'fail',
      });
      return;
    }

    res.send({
      statusCode: 200,
      message: '성공적으로 회원 정보를 가져왔습니다.',
      error: 'success',
      data: confirmUser,
    });
    return;
  }

  // @UseGuards(JwtAuthGuard)
  // @Post('delete')
  // async delete(
  //   @Res() res: Response,
  //   @Req() req: Request,
  //   @Body('idx') idx: number,
  // ) {
  //   const tk = req['headers']?.['authorization'];

  //   const result = await this.authService.validateUser(tk);

  //   const user = await this.UsersService.getUserByIdx(result.mem_idx);

  //   if (user.mem_auth_level < 6) {
  //     res.send({
  //       statusCode: 400,
  //       message: 'permission denined',
  //       error: 'fail',
  //     });
  //     return;
  //   }

  //   // 유저 확인
  //   const confirmUser = await this.UsersService.getUserByIdx(idx);
  //   console.log(confirmUser);
  //   if ((confirmUser?.mem_idx ?? 0) < 1) {
  //     res.send({
  //       statusCode: 400,
  //       message: '존재하지 않는 계정입니다.',
  //       error: 'fail',
  //     });
  //     return;
  //   }

  //   const deleteUserResult = await this.UsersService.delete(idx);

  //   if (!deleteUserResult) {
  //     res.send({
  //       statusCode: 400,
  //       message: '회원 탈퇴에 실패하였습니다.',
  //       error: 'fail',
  //     });
  //     return;
  //   }

  //   res.send({
  //     statusCode: 200,
  //     message: '회원이 탈퇴되었습니다.',
  //     error: 'success',
  //   });
  //   return;
  // }
  //!
  @UseGuards(JwtAuthGuard)
  @Post('del-list')
  async delete(
    @Res() res: Response,
    @Req() req: Request,
    @Body('idx') idx: number,
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

    // 유저 확인
    const confirmUser = await this.UsersService.getUserByIdx(idx);
    console.log(confirmUser);
    if ((confirmUser?.mem_idx ?? 0) < 1) {
      res.send({
        statusCode: 400,
        message: '존재하지 않는 계정입니다.',
        error: 'fail',
      });
      return;
    }

    const deleteUserResult = await this.UsersService.delete(idx);

    if (!deleteUserResult) {
      res.send({
        statusCode: 400,
        message: '회원 탈퇴에 실패하였습니다.',
        error: 'fail',
      });
      return;
    }

    const userList = await this.UsersService.getUserList();

    res.send({
      statusCode: 200,
      message: '회원이 탈퇴되었습니다.',
      error: 'success',
      list: userList,
    });
    return;
  }

  // @UseGuards(JwtAuthGuard)
  // @Post('set')
  // async setUser(
  //   @Res() res: Response,
  //   @Req() req: Request,
  //   @Body() addUserData: SetUserDto,
  // ) {
  //   const tk = req['headers']?.['authorization'];

  //   const result = await this.authService.validateUser(tk);

  //   const user = await this.UsersService.getUserByIdx(result.mem_idx);

  //   if (user.mem_auth_level < 6) {
  //     res.send({
  //       statusCode: 400,
  //       message: 'permission denined',
  //       error: 'fail',
  //     });
  //     return;
  //   }

  //   const { idx, name, email, password, level } = addUserData;

  //   const setUserData = await this.UsersService.getUserByIdx(idx);

  //   // 현재 이메일과 다를 경우, 이메일 중복 확인
  //   if (setUserData.mem_email !== email) {
  //     // 이메일 확인
  //     const duplicatedEmailUser = await this.UsersService.getUserByEmail(email);

  //     if ((duplicatedEmailUser?.mem_idx ?? 0) > 0) {
  //       res.send({
  //         statusCode: 400,
  //         message: '중복된 이메일입니다.',
  //         error: 'fail',
  //       });
  //       return;
  //     }
  //   }

  //   let encryptedPw: string | undefined;
  //   if (password.length < 1) {
  //     encryptedPw = undefined;
  //   } else {
  //     // 패스워드 암호화
  //     encryptedPw = await encryptPassword(password, email);
  //   }

  //   const setUserResult = await this.UsersService.setUser(
  //     idx,
  //     name,
  //     email,
  //     encryptedPw,
  //     level,
  //   );

  //   if (!setUserResult) {
  //     res.send({
  //       statusCode: 400,
  //       message: '회원정보 수정 오류',
  //       error: 'fail',
  //     });
  //     return;
  //   }

  //   res.send({
  //     statusCode: 200,
  //     message: '회원 정보가 수정되었습니다.',
  //     error: 'success',
  //   });
  //   return;
  // }

  //!
  @UseGuards(JwtAuthGuard)
  @Post('set-one')
  async setUser(
    @Res() res: Response,
    @Req() req: Request,
    @Body() addUserData: SetUserDto,
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

    const { idx, name, email, password, level } = addUserData;

    const setUserData = await this.UsersService.getUserByIdx(idx);

    // 현재 이메일과 다를 경우, 이메일 중복 확인
    if (setUserData.mem_email !== email) {
      // 이메일 확인
      const duplicatedEmailUser = await this.UsersService.getUserByEmail(email);

      if ((duplicatedEmailUser?.mem_idx ?? 0) > 0) {
        res.send({
          statusCode: 400,
          message: '중복된 이메일입니다.',
          error: 'fail',
        });
        return;
      }
    }

    let encryptedPw: string | undefined;
    if (password.length < 1) {
      encryptedPw = undefined;
    } else {
      // 패스워드 암호화
      encryptedPw = await encryptPassword(password, email);
    }

    const setUserResult = await this.UsersService.setUser(
      idx,
      name,
      email,
      encryptedPw,
      level,
    );

    if (!setUserResult) {
      res.send({
        statusCode: 400,
        message: '회원정보 수정 오류',
        error: 'fail',
      });
      return;
    }

    const userList = await this.UsersService.getUserList();

    res.send({
      statusCode: 200,
      message: '회원 정보가 수정되었습니다.',
      error: 'success',
      list: userList,
    });
    return;
  }
  //!
  @UseGuards(JwtAuthGuard)
  @Post('set-info')
  async setInfo(
    @Res() res: Response,
    @Req() req: Request,
    @Body() addUserData: SetUserDto,
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

    const { idx, name, email, password, level } = addUserData;

    const setUserData = await this.UsersService.getUserByIdx(idx);

    // 현재 이메일과 다를 경우, 이메일 중복 확인
    if (setUserData.mem_email !== email) {
      // 이메일 확인
      const duplicatedEmailUser = await this.UsersService.getUserByEmail(email);

      if ((duplicatedEmailUser?.mem_idx ?? 0) > 0) {
        res.send({
          statusCode: 400,
          message: '중복된 이메일입니다.',
          error: 'fail',
        });
        return;
      }
    }

    let encryptedPw: string | undefined;
    if (password.length < 1) {
      encryptedPw = undefined;
    } else {
      // 패스워드 암호화
      encryptedPw = await encryptPassword(password, email);
    }

    const setUserResult = await this.UsersService.setUser(
      idx,
      name,
      email,
      encryptedPw,
      level,
    );

    if (!setUserResult) {
      res.send({
        statusCode: 400,
        message: '회원정보 수정 오류',
        error: 'fail',
      });
      return;
    }

    const userList = await this.UsersService.getUserList();

    res.send({
      statusCode: 200,
      message: '회원 정보가 수정되었습니다.',
      error: 'success',
      list: userList,
    });
    return;
  }
}
