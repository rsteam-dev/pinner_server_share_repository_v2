import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsInt,
  // IsMobilePhone,
  // IsUrl,
  IsString,
  Length,
} from 'class-validator';
import { rs_htmlclean } from 'src/common/helper/validation.helper';

export class User {
  @IsInt()
  mem_idx: number;

  @IsString()
  mem_name: string;

  @IsEmail()
  @Transform((value) => rs_htmlclean(value))
  @Length(10, 30)
  mem_email: string;

  @IsString()
  @Transform((value) => rs_htmlclean(value))
  mem_password: string;

  @IsBoolean()
  mem_deletion: boolean;

  @IsDate()
  mem_ins_datetime: Date;

  @IsDate()
  mem_upd_datetime?: Date;

  @IsDate()
  mem_del_datetime?: Date;

  @IsDate()
  mem_auth_datetime?: Date;

  @IsInt()
  mem_auth_level: number;

  @IsString()
  mem_refresh_token: string;

  @IsBoolean()
  mem_active: boolean;
}
