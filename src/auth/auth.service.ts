import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

type TokenType = {
  mem_idx: number;
  iat: number;
  exp: number;
};

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // { mem_idx: 1, iat: 1660880215, exp: 1660880275 }
  async validateUser(token: string): Promise<TokenType | undefined> {
    let result: TokenType | undefined;
    try {
      result = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch (err) {
      console.log(err.message);
      // console.log(err.name); // TokenExpiredError
      // console.log(err.message); // jwt expired
      // console.log(err.expiredAt); // 2022-08-19T02:46:59.000Z

      try {
        result = this.jwtService.verify(token, {
          secret: process.env.JWT_RT_SECRET,
        });
      } catch (err2) {
        console.log(err2.message);
        return undefined;
      }
    }

    return result;
  }

  async login(mem_idx: number): Promise<string> {
    const payload = { mem_idx };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      algorithm: 'HS256',
      // expiresIn: '60s',
      expiresIn: '1h', // 1시간
    });
    return token;
  }

  async rtLogin(mem_idx: number): Promise<string> {
    const payload = { mem_idx };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_RT_SECRET,
      algorithm: 'HS256',
      expiresIn: '7d', // 7일
    });
    return token;
  }
}
