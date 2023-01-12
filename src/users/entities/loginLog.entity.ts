import {
  IsBoolean,
  IsDate,
  IsInt,
  IsOptional,
  // IsMobilePhone,
  // IsUrl,
  IsString,
} from 'class-validator';

export class LoginLog {
  // @IsInt()
  // mll_idx: number;

  @IsBoolean()
  mll_success: boolean;

  @IsInt()
  @IsOptional()
  mll_mem_idx: number;

  @IsString()
  mll_email: string;

  @IsDate()
  mll_datetime: Date;

  @IsString()
  mll_reason: string;

  @IsString()
  @IsOptional()
  mll_ip: string;
}
