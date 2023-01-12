import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';

@Controller('detectManagement')
export class DetectManagementController {
  constructor(
    private UsersService: UsersService,
    private authService: AuthService,
  ) {}

  /**
   * TODO
   *
   */
}
